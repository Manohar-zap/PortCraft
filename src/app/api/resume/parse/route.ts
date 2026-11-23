import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { GoogleGenAI } from '@google/genai';
import { parseResumeText } from '@/lib/resumeParser';

export const maxDuration = 60;

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
      try {
        const parser = new PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        text = pdfData.text;
        await parser.destroy();
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json(
          { success: false, error: 'Failed to parse PDF. The file may be corrupted or password-protected.' },
          { status: 400 }
        );
      }
    } else if (fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
        if (result.messages.length > 0) {
          console.warn('DOCX parsing warnings:', result.messages);
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
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
          const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/png';
          const result = await ai.models.generateContent({
            model,
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

    // Parse the extracted text using the shared parser
    const parseResult = parseResumeText(text);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error || 'Failed to parse resume content' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parseResult.data,
    });
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'An unexpected error occurred while parsing the resume' },
      { status: 500 }
    );
  }
}
