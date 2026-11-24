import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { generateGeminiContent, hasGeminiConfigured, getGeminiKeys } from '@/lib/ai/geminiClient';
import { parseResumeText } from '@/lib/resumeParser';

export const maxDuration = 60;

/**
 * Reconstructs lines from pdfjs text items preserving vertical line breaks and horizontal spacing.
 * Also handles two-column resume layouts by grouping items into left and right columns if a clear split exists.
 */
function reconstructPageText(items: any[]): string {
  if (!items || items.length === 0) return '';

  const validItems = items
    .filter((item: any) => item && typeof item.str === 'string' && item.str.length > 0)
    .map((item: any) => ({
      str: item.str,
      x: item.transform ? Number(item.transform[4]) : 0,
      y: item.transform ? Number(item.transform[5]) : 0,
      width: item.width ? Number(item.width) : 0,
      height: item.height ? Number(item.height) : 10,
      hasEOL: Boolean(item.hasEOL),
    }));

  if (validItems.length === 0) return '';

  // Check if this page has a distinct two-column layout:
  // Items in a left column (X < 240) and right column (X >= 240) without wide banners spanning across
  const leftItems = validItems.filter(it => it.x < 240);
  const rightItems = validItems.filter(it => it.x >= 240);
  const hasSpanningBanner = validItems.some(it => it.x < 150 && it.x + it.width > 350);
  const isTwoColumn = leftItems.length > 10 && rightItems.length > 10 && !hasSpanningBanner;

  const processBlock = (blockItems: typeof validItems): string => {
    const lines: { y: number; items: typeof validItems }[] = [];

    for (const item of blockItems) {
      const tolerance = Math.max(3, item.height * 0.45);
      const line = lines.find(l => Math.abs(l.y - item.y) <= tolerance);
      if (line) {
        line.items.push(item);
      } else {
        lines.push({ y: item.y, items: [item] });
      }
    }

    // Top to bottom (Y descending in PDF coordinate system)
    lines.sort((a, b) => b.y - a.y);

    const formattedLines: string[] = [];
    for (const line of lines) {
      line.items.sort((a, b) => a.x - b.x);

      let lineText = '';
      let prevX = -1;
      let prevWidth = 0;

      for (const it of line.items) {
        if (prevX >= 0) {
          const gap = it.x - (prevX + prevWidth);
          if (gap > 2 && !lineText.endsWith(' ') && !it.str.startsWith(' ')) {
            lineText += ' ';
          }
        }
        lineText += it.str;
        prevX = it.x;
        prevWidth = it.width;
      }

      const trimmed = lineText.trim();
      if (trimmed) {
        formattedLines.push(trimmed);
      }
    }

    return formattedLines.join('\n');
  };

  if (isTwoColumn) {
    const leftText = processBlock(leftItems);
    const rightText = processBlock(rightItems);
    return `${leftText}\n\n${rightText}`;
  }

  return processBlock(validItems);
}

/**
 * Resilient multi-tier PDF text extraction:
 * Tier 1: Direct in-memory pdfjs-dist with pre-loaded WorkerMessageHandler (no external path/bundle dependency)
 * Tier 2: Multimodal Gemini 2.0 Flash for scanned/image-only PDFs
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  let text = '';

  // Tier 1: Direct in-memory pdfjs-dist
  try {
    const [pdfjs, worker] = await Promise.all([
      import('pdfjs-dist/legacy/build/pdf.mjs'),
      // @ts-expect-error pdfjs-dist worker has no declaration file
      import('pdfjs-dist/legacy/build/pdf.worker.mjs'),
    ]);
    if (pdfjs.PDFWorker && worker.WorkerMessageHandler) {
      Object.defineProperty(pdfjs.PDFWorker, '_setupFakeWorkerGlobal', {
        value: Promise.resolve(worker.WorkerMessageHandler),
        configurable: true,
        writable: true,
      });
    }

    const doc = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;

    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = reconstructPageText(content.items);
      if (pageText) {
        fullText += (fullText ? '\n\n' : '') + pageText;
      }
    }
    await doc.destroy();
    text = fullText.trim();
  } catch (pdfjsErr) {
    console.warn('pdfjs-dist in-memory extraction failed:', pdfjsErr);
  }

  // Tier 2: Gemini multimodal vision for scanned image-only PDFs
  if ((!text || text.length < 50) && hasGeminiConfigured()) {
    try {
      const result = await generateGeminiContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: buffer.toString('base64'),
                },
              },
              {
                text: 'Extract all resume text verbatim from this PDF resume document. Preserve personal details, contact info, summary, work experience, education, skills, projects, and achievements. Keep clear line breaks and headings. Output only the extracted plain text.',
              },
            ],
          },
        ],
      });
      text = result.text?.trim() || text;
    } catch (geminiPdfErr) {
      console.warn('Gemini PDF multimodal fallback failed:', geminiPdfErr);
    }
  }

  return text;
}

/**
 * AI-assisted structured resume extraction when Gemini API key is available.
 * Accurately discerns between candidate names and role titles (e.g. "Data Science Student").
 */
async function parseResumeWithGemini(text: string, apiKey: string) {
  try {
    const prompt = `You are a precision resume parsing engine. Parse the following resume text into structured JSON.

CRITICAL RULES:
1. Extract the candidate's real legal personal name (First Name and Last Name). DO NOT mistake job titles or student status (like "Data Science Student", "Software Engineer") as the person's name!
2. Extract only factual data present in the text. DO NOT fabricate companies, dates, degrees, or skills.
3. If dates or grades are not mentioned, use empty string "".
4. All extracted skills must have level 0 unless explicitly rated.

RESUME TEXT:
${text.substring(0, 30000)}

REQUIRED JSON OUTPUT FORMAT:
{
  "personal": {
    "firstName": "First name of candidate",
    "lastName": "Last name of candidate",
    "title": "Professional title or role (e.g. Data Science Student, Full Stack Developer)",
    "email": "email or empty string",
    "phone": "phone or empty string",
    "location": "location or empty string",
    "website": "portfolio or website URL or empty string",
    "linkedin": "LinkedIn URL or empty string",
    "github": "GitHub URL or empty string",
    "twitter": "",
    "bio": "Bio or summary paragraph or empty string",
    "avatar": ""
  },
  "education": [
    {
      "institution": "University / College name",
      "degree": "Degree name",
      "field": "Field of study",
      "startYear": "Start year",
      "endYear": "End year or Present",
      "gpa": "GPA or empty string",
      "description": ""
    }
  ],
  "experience": [
    {
      "company": "Company / Organization name",
      "position": "Job title / role",
      "startDate": "Start date",
      "endDate": "End date",
      "current": false,
      "location": "Location",
      "description": "Role overview",
      "highlights": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "Frontend|Backend|Database|DevOps|Mobile|Testing|Languages|Tools|Data & AI|General",
      "level": 0
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "Project overview",
      "techStack": ["React", "Python"],
      "liveUrl": "",
      "githubUrl": "",
      "featured": false
    }
  ],
  "achievements": [
    {
      "title": "Achievement or award name",
      "issuer": "Issuing organization or empty string",
      "date": "Year or date",
      "description": "Description"
    }
  ],
  "certifications": [
    {
      "title": "Certification name",
      "issuer": "Issuer",
      "date": "Date",
      "url": ""
    }
  ]
}

Return ONLY valid JSON.`;

    const result = await generateGeminiContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.1,
      responseMimeType: 'application/json',
      keyOverride: apiKey,
    });

    const parsed = JSON.parse(result.text || '{}');
    if (parsed?.personal?.firstName) {
      const { generateId } = await import('@/lib/types');
      return {
        personal: {
          firstName: parsed.personal.firstName || '',
          lastName: parsed.personal.lastName || '',
          title: parsed.personal.title || '',
          email: parsed.personal.email || '',
          phone: parsed.personal.phone || '',
          location: parsed.personal.location || '',
          website: parsed.personal.website || '',
          linkedin: parsed.personal.linkedin || '',
          github: parsed.personal.github || '',
          twitter: parsed.personal.twitter || '',
          bio: parsed.personal.bio || '',
          avatar: '',
        },
        education: (parsed.education || []).map((e: any) => ({
          id: generateId(),
          institution: e.institution || '',
          degree: e.degree || '',
          field: e.field || '',
          startYear: e.startYear || '',
          endYear: e.endYear || '',
          gpa: e.gpa || '',
          description: e.description || '',
        })),
        experience: (parsed.experience || []).map((e: any) => ({
          id: generateId(),
          company: e.company || '',
          position: e.position || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          current: Boolean(e.current),
          location: e.location || '',
          description: e.description || '',
          highlights: Array.isArray(e.highlights) ? e.highlights : [],
        })),
        skills: (parsed.skills || []).map((s: any) => ({
          id: generateId(),
          name: s.name || '',
          category: s.category || 'General',
          level: typeof s.level === 'number' ? Math.max(0, Math.min(5, s.level)) : 0,
        })),
        projects: (parsed.projects || []).map((p: any) => ({
          id: generateId(),
          title: p.title || '',
          description: p.description || '',
          techStack: Array.isArray(p.techStack) ? p.techStack : [],
          liveUrl: p.liveUrl || '',
          githubUrl: p.githubUrl || '',
          imageUrl: '',
          featured: Boolean(p.featured),
        })),
        achievements: (parsed.achievements || []).map((a: any) => ({
          id: generateId(),
          title: a.title || '',
          issuer: a.issuer || '',
          date: a.date || '',
          description: a.description || '',
          url: '',
        })),
        certifications: (parsed.certifications || []).map((c: any) => ({
          id: generateId(),
          title: c.title || '',
          issuer: c.issuer || '',
          date: c.date || '',
          url: c.url || '',
        })),
        rawText: text,
        confidence: 95,
      };
    }
  } catch (err) {
    console.warn('Gemini AI resume parsing error:', err);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/bmp',
      'image/tiff',
    ];
    const allowedExtensions = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'];

    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    const hasValidType = allowedTypes.includes(file.type) || file.type.startsWith('image/');

    if (!hasValidExtension && !hasValidType) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload PDF, DOCX, TXT, or Image (PNG, JPG, WEBP) files.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    let text = '';

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isImage =
      fileName.endsWith('.png') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.webp') ||
      fileName.endsWith('.bmp') ||
      fileName.endsWith('.tiff') ||
      file.type.startsWith('image/');

    // Parse based on file type
    if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
      text = await extractPdfText(buffer);

      if (!text || text.trim().length < 20) {
        return NextResponse.json(
          { success: false, error: 'Could not extract readable text from this PDF. Please verify the file is not password-protected or empty.' },
          { status: 400 }
        );
      }
    } else if (fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const mdResult = await (mammoth as any).convertToMarkdown({ buffer });
        text = mdResult?.value || '';
        if (!text || text.trim().length < 50) {
          const rawResult = await mammoth.extractRawText({ buffer });
          text = rawResult.value;
        }
        if (mdResult?.messages?.length > 0) {
          console.warn('DOCX parsing warnings:', mdResult.messages);
        }
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return NextResponse.json(
          { success: false, error: 'Failed to parse DOCX. The file may be corrupted.' },
          { status: 400 }
        );
      }
    } else if (isImage) {
      let extractedImageText = '';

      // If Gemini API is configured, use high-accuracy multimodal vision extraction
      if (hasGeminiConfigured()) {
        try {
          const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/png';
          const result = await generateGeminiContent({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: buffer.toString('base64'),
                    },
                  },
                  {
                    text: 'Extract all resume text verbatim from this resume image. Preserve personal details, contact info, summary, work experience, education, skills, projects, and achievements. Keep clear line breaks and headings. Output only the extracted plain text.',
                  },
                ],
              },
            ],
          });
          extractedImageText = result.text?.trim() || '';
        } catch (geminiError) {
          console.warn('Gemini vision extraction failed, falling back to local OCR:', geminiError);
        }
      }

      // Fallback to local Tesseract OCR engine
      if (!extractedImageText) {
        try {
          const workerPath = path.join(process.cwd(), 'node_modules', 'tesseract.js', 'src', 'worker-script', 'node', 'index.js');
          const corePath = path.join(process.cwd(), 'node_modules', 'tesseract.js-core');
          const ocrResult = await Tesseract.recognize(buffer, 'eng', {
            workerPath,
            corePath,
          });
          extractedImageText = ocrResult.data?.text?.trim() || '';
        } catch (ocrError) {
          console.error('Tesseract OCR error:', ocrError);
          return NextResponse.json(
            { success: false, error: 'Failed to extract text from image resume. The image might be unreadable or corrupt.' },
            { status: 400 }
          );
        }
      }

      text = extractedImageText;
    } else if (fileName.endsWith('.txt') || file.type === 'text/plain') {
      text = buffer.toString('utf-8');
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Could not extract sufficient text from the file. Please ensure the file contains readable text.' },
        { status: 400 }
      );
    }

    // Determine if Gemini API key is available (from env, header, or formData)
    const apiKey =
      (request.headers.get('x-gemini-api-key') || '').trim() ||
      ((formData.get('apiKey') as string) || '').trim() ||
      (hasGeminiConfigured() ? getGeminiKeys()[0] : '') ||
      '';

    let finalData: any = null;

    if (apiKey) {
      finalData = await parseResumeWithGemini(text, apiKey);
    }

    if (!finalData) {
      const parseResult = parseResumeText(text);
      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: parseResult.error || 'Failed to parse resume content' },
          { status: 400 }
        );
      }
      finalData = parseResult.data;
    }

    return NextResponse.json({
      success: true,
      data: finalData,
    });
  } catch (error: unknown) {
    console.error('Resume parsing error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while parsing the resume';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}