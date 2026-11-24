import { PortfolioData, PersonalInfo, Education, Experience, Skill, Project, Achievement, generateId, DEFAULT_PORTFOLIO } from './types';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ParsedResumeData {
  personal: Partial<PersonalInfo>;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  rawText: string;
  confidence: number; // 0-100, how confident we are in the parsing
}

export interface ResumeParseResult {
  success: boolean;
  data?: ParsedResumeData;
  error?: string;
}

// ─── Regex Patterns ───────────────────────────────────────────────────────

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[A-Za-z0-9_-]+/gi;
const GITHUB_REGEX = /github\.com\/[A-Za-z0-9_-]+/gi;
const URL_REGEX = /https?:\/\/[^\s]+/gi;

// Common section headers (case-insensitive)
const SECTION_HEADERS: Record<string, string[]> = {
  personal: [
    'personal', 'profile', 'personal profile', 'summary', 'professional summary',
    'summary of qualifications', 'executive summary', 'objective', 'career objective',
    'about', 'about me', 'bio', 'contact', 'contact information'
  ],
  education: [
    'education', 'educational background', 'academic background',
    'academic history', 'academics', 'qualifications', 'degrees',
    'education & training', 'academic qualifications', 'academic credentials'
  ],
  experience: [
    'experience', 'work experience', 'employment', 'employment history',
    'work history', 'professional experience', 'career history',
    'positions held', 'professional background', 'relevant experience',
    'internships', 'work experience & projects', 'industry experience'
  ],
  skills: [
    'skills', 'technical skills', 'core skills', 'key skills',
    'competencies', 'core competencies', 'technologies',
    'tools & technologies', 'tools and technologies', 'tech stack',
    'areas of expertise', 'expertise', 'proficiencies', 'programming languages',
    'technical proficiencies', 'skills & tools', 'skills and tools', 'skillset',
    'technical skills & tools', 'skills & abilities'
  ],
  projects: [
    'projects', 'key projects', 'notable projects', 'personal projects',
    'selected projects', 'academic projects', 'portfolio', 'work samples',
    'featured projects', 'technical projects', 'independent projects'
  ],
  achievements: [
    'achievements', 'awards', 'honors', 'accomplishments',
    'recognition', 'awards & honors', 'awards and honors',
    'key achievements', 'notable achievements', 'honors & awards',
    'awards & achievements'
  ],
  certifications: [
    'certifications', 'certificates', 'licenses', 'credentials',
    'certifications & licenses', 'certifications and licenses',
    'licenses & certifications', 'professional certifications'
  ],
};

// ─── Utility Functions ────────────────────────────────────────────────────

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\S\r\n]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_REGEX);
  return matches ? [...new Set(matches)] : [];
}

function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_REGEX);
  return matches ? [...new Set(matches)] : [];
}

function extractLinkedIn(text: string): string {
  const match = text.match(LINKEDIN_REGEX);
  return match ? `https://${match[0]}` : '';
}

function extractGitHub(text: string): string {
  const match = text.match(GITHUB_REGEX);
  return match ? `https://${match[0]}` : '';
}

function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches ? [...new Set(matches)] : [];
}

function matchSectionHeader(rawLine: string): string | null {
  const line = rawLine.trim();
  if (!line || line.length > 60) return null;

  // Clean decorators: markdown headers, bullets, numbers, trailing/leading hyphens, colons, underscores, slashes, pipes
  const clean = line
    .replace(/^[#*_\-\s\d.)/|►•:]+/, '')
    .replace(/[:=~_\-#*|/]+$/, '')
    .trim()
    .toLowerCase();

  if (!clean || clean.length > 45) return null;

  // Reject lines that look like prose sentences or have common body words
  if (/\b(with|years?|year|building|passionate|worked|using|responsible|proven|experienced|proficient|track record|strong|crafting|developing|architecting|spearheaded|developed|built|created)\b/i.test(clean)) {
    return null;
  }

  for (const [section, headers] of Object.entries(SECTION_HEADERS)) {
    for (const header of headers) {
      if (
        clean === header ||
        clean === header + 's' ||
        clean.replace(/&/g, 'and') === header.replace(/&/g, 'and')
      ) {
        return section;
      }
    }
  }

  return null;
}

function findSectionIndices(text: string): Map<string, number> {
  const indices = new Map<string, number>();
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    const matched = matchSectionHeader(line);
    if (matched && !indices.has(matched)) {
      indices.set(matched, i);
    }
  });

  return indices;
}

function extractSection(text: string, startLine: number, endLine?: number): string {
  const lines = text.split('\n');
  const end = endLine ?? lines.length;
  return lines.slice(startLine, end).join('\n').trim();
}

// ─── Parsing Functions ────────────────────────────────────────────────────

function parsePersonalInfo(text: string, fullText: string): Partial<PersonalInfo> {
  const personal: Partial<PersonalInfo> = {};

  // Extract emails
  const emails = extractEmails(fullText);
  if (emails.length > 0) personal.email = emails[0];

  // Extract phones
  const phones = extractPhones(fullText);
  if (phones.length > 0) personal.phone = phones[0];

  // Extract LinkedIn
  personal.linkedin = extractLinkedIn(fullText);

  // Extract GitHub
  personal.github = extractGitHub(fullText);

  // Extract website from URLs
  const urls = extractUrls(fullText);
  const personalUrls = urls.filter(u =>
    !u.includes('linkedin.com') && !u.includes('github.com')
  );
  if (personalUrls.length > 0) personal.website = personalUrls[0];

  // Title / role / field keywords that must NEVER be accepted as a candidate's personal name
  const TITLE_OR_FIELD_KEYWORDS = /\b(student|engineer|developer|designer|analyst|scientist|manager|intern|architect|consultant|specialist|graduate|candidate|programmer|researcher|enthusiast|fellow|assistant|professor|director|lead|founder|co-founder|head|vp|officer|executive|professional|freelancer|instructor|coordinator|administrator|science|engineering|technology|fullstack|full-stack|frontend|backend|devops|software|computing|web|mobile|cloud|ai|ml|data|undergraduate|postgraduate|fresher|machine|learning|deep|database|systems|network|security|cybersecurity|agile|scrum)\b/i;

  const nonBlankLines = fullText.split('\n').map(l => l.trim()).filter(Boolean);
  const skipWords = /^(resume|curriculum vitae|cv|portfolio|personal profile|profile|biodata|bio|contact|contact information)$/i;

  for (let i = 0; i < Math.min(10, nonBlankLines.length); i++) {
    const rawLine = nonBlankLines[i];
    // Stop scanning for name once we cross into a standard resume section header (e.g. SKILLS, EDUCATION)
    if (matchSectionHeader(rawLine)) {
      break;
    }
    const line = rawLine.replace(/^[#*_\-\s►•·|]+/, '').replace(/[#*_\-\s►•·|]+$/, '').trim();

    if (!line || skipWords.test(line)) continue;

    // Split on delimiters (pipe, dash, bullet, colon, slash, parens, or comma before capitalized words)
    const segments = line
      .split(/\s*[-–—|•·/]\s*|\s*,\s*(?=[A-Z])|\s*[()]\s*/)
      .map(s => s.trim().replace(/^[#*_\-\s►•·|]+/, '').replace(/[#*_\-\s►•·|]+$/, ''))
      .filter(Boolean);

    for (const seg of segments) {
      if (EMAIL_REGEX.test(seg) || PHONE_REGEX.test(seg) || URL_REGEX.test(seg)) continue;

      const isTitleMatch = TITLE_OR_FIELD_KEYWORDS.test(seg);
      if (isTitleMatch) {
        if (!personal.title && seg.length > 3 && seg.length < 60) {
          personal.title = seg;
        }
        continue; // Strictly reject as a person's name!
      }

      // Check if this segment is a valid human name (2-4 words, letters/dashes/dots only)
      const nameMatch = seg.match(/^([A-Za-z.\-']+(?:\s+[A-Za-z.\-']+){1,3})$/);
      if (nameMatch && !/^(education|experience|skills|projects|summary|contact|awards|certifications|languages)/i.test(seg)) {
        const parts = nameMatch[1].split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && !personal.firstName) {
          // Normalize capitalization (e.g. MANOHAR REDDY -> Manohar Reddy)
          const normFirst = parts[0].length > 1 && parts[0] === parts[0].toUpperCase()
            ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
            : parts[0];
          const normLast = parts.slice(1).map(w =>
            w.length > 1 && w === w.toUpperCase()
              ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
              : w
          ).join(' ');

          personal.firstName = normFirst;
          personal.lastName = normLast;
        }
      }
    }

    if (personal.firstName && personal.title) break;
  }

  // Fallback 1: Infer name from LinkedIn handle if name was missed or blocked by graphics
  if (!personal.firstName && personal.linkedin) {
    const handleMatch = personal.linkedin.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (handleMatch) {
      const tokens = handleMatch[1]
        .split(/[-_]+/)
        .filter(t => !/^(tech|dev|developer|engineer|code|codes|official|profile|in|the|\d+)$/i.test(t));
      if (tokens.length >= 2) {
        personal.firstName = tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1).toLowerCase();
        personal.lastName = tokens.slice(1).map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(' ');
      }
    }
  }

  // Fallback 2: Infer name from email handle (e.g. manohar.reddy@gmail.com)
  if (!personal.firstName && personal.email) {
    const handle = personal.email.split('@')[0];
    const tokens = handle.split(/[._-]+/).filter(t => !/^\d+$/.test(t) && t.length > 1);
    if (tokens.length >= 2 && !TITLE_OR_FIELD_KEYWORDS.test(tokens[0]) && !TITLE_OR_FIELD_KEYWORDS.test(tokens[1])) {
      personal.firstName = tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1).toLowerCase();
      personal.lastName = tokens.slice(1).map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(' ');
    }
  }

  // Extract location: look for "City, State/Country" or "Location: ..."
  for (let i = 0; i < Math.min(15, nonBlankLines.length); i++) {
    const line = nonBlankLines[i];
    if (personal.location) break;

    const locPrefixMatch = line.match(/(?:location|address)[:\s]+([^|•\n,]+(?:,[^|•\n]+)?)/i);
    if (locPrefixMatch) {
      personal.location = locPrefixMatch[1].trim();
      break;
    }

    // Match City, State (e.g. "San Francisco, CA" or "New York, NY" or "Seattle, WA 98101" or "Bangalore, India")
    const cityStateMatch = line.match(/\b([A-Z][a-zA-Z\s.-]+,\s*(?:[A-Z]{2}(?:\s+\d{5})?|[A-Z][a-zA-Z\s.-]+))\b/);
    if (cityStateMatch) {
      const candidateLoc = cityStateMatch[1].trim();
      if (!/university|college|institute|corporation|company|inc|llc|present|experience/i.test(candidateLoc) && candidateLoc.length < 45) {
        personal.location = candidateLoc;
      }
    }
  }

  // Try to extract title/role if not yet set
  if (!personal.title) {
    const titleKeywords = /engineer|developer|designer|architect|manager|consultant|analyst|scientist|specialist|lead|student|intern|researcher/i;
    for (let i = 0; i < Math.min(10, nonBlankLines.length); i++) {
      const line = nonBlankLines[i].replace(/^[#*_\-\s►•·|]+/, '').trim();
      if (
        titleKeywords.test(line) &&
        line.length > 4 &&
        line.length < 60 &&
        !EMAIL_REGEX.test(line) &&
        !PHONE_REGEX.test(line) &&
        !URL_REGEX.test(line) &&
        !/^(experience|education|skills|projects|summary|profile)/i.test(line)
      ) {
        personal.title = line.split(/[|•·,]/)[0].trim();
        break;
      }
    }
  }

  // Extract bio/summary from personal section
  const sectionIndices = findSectionIndices(fullText);
  if (sectionIndices.has('personal')) {
    const nextSectionIndex = Math.min(
      ...Array.from(sectionIndices.values()).filter(v => v > sectionIndices.get('personal')!)
    ) ?? fullText.split('\n').length;
    const personalSection = extractSection(fullText, sectionIndices.get('personal')! + 1, nextSectionIndex);
    if (personalSection && personalSection.length > 20) {
      // Preserve full bio without arbitrary 500-char cutoff
      personal.bio = personalSection.trim();
    }
  }

  return personal;
}

function parseEducation(text: string): Education[] {
  const education: Education[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentEntry: Partial<Education> = {};

  const saveEntry = () => {
    if (currentEntry.institution || currentEntry.degree) {
      education.push({
        id: generateId(),
        institution: currentEntry.institution || '',
        degree: currentEntry.degree || '',
        field: currentEntry.field || '',
        startYear: currentEntry.startYear || '',
        endYear: currentEntry.endYear || '',
        gpa: currentEntry.gpa || '',
        description: currentEntry.description || '',
      });
      currentEntry = {};
    }
  };

  const institutionRegex = /university|college|institute|school|academy|polytechnic|\b(MIT|Stanford|Harvard|CMU|Caltech|Berkeley|UCLA|USC|NYU|IIT|BITS|Georgia Tech|Oxford|Cambridge)\b/i;
  const degreeRegex = /(Bachelor|Master|PhD|Doctorate|Associate|Diploma|Certificate|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|MBA|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|BCA|MCA|BBA)/i;
  const yearRegex = /\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}|\b(19|20)\d{2}\s*[-–—]\s*(Present|Current)|\b(19|20)\d{2}\b/i;
  const fieldRegex = /(Computer Science|Software Engineering|Information Technology|Data Science|Mathematics|Physics|Engineering|Business|Economics|Design|Arts|Marketing|Finance|Management)/i;
  const gpaRegex = /(?:GPA|CGPA|Grade)[:\s]*([0-4]\.\d{1,2}(?:\s*\/\s*[0-4]\.\d{1,2})?|\d{1,2}\.?\d*(?:\s*\/\s*\d{1,2})?)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const isInstitution = institutionRegex.test(line);
    const degreeMatch = line.match(degreeRegex);
    const yearMatch = line.match(yearRegex);
    const fieldMatch = line.match(fieldRegex);
    const gpaMatch = line.match(gpaRegex);

    // If we encounter a new institution and currentEntry already has an institution, save previous
    if (isInstitution && currentEntry.institution) {
      saveEntry();
    }

    if (isInstitution && !currentEntry.institution) {
      const parts = line.split(/\s+[|•,]\s+/);
      currentEntry.institution = parts[0].trim();
      if (parts.length > 1) {
        for (let p = 1; p < parts.length; p++) {
          const part = parts[p].trim();
          const pDeg = part.match(degreeRegex);
          if (pDeg && !currentEntry.degree) currentEntry.degree = part;
          const pYear = part.match(yearRegex);
          if (pYear && !currentEntry.startYear) {
            const y = pYear[0].split(/[-–—]/).map(s => s.trim());
            currentEntry.startYear = y[0] || '';
            currentEntry.endYear = y[1] || '';
          }
        }
      }
    }

    if (degreeMatch && !currentEntry.degree) {
      currentEntry.degree = line;
    }
    if (fieldMatch && !currentEntry.field) {
      currentEntry.field = fieldMatch[0];
    }
    if (yearMatch && !currentEntry.startYear) {
      const years = yearMatch[0].split(/[-–—]/).map(y => y.trim());
      currentEntry.startYear = years[0] || '';
      currentEntry.endYear = years[1] || '';
    }
    if (gpaMatch && !currentEntry.gpa) {
      currentEntry.gpa = gpaMatch[1] || gpaMatch[0];
    } else if (!isInstitution && !degreeMatch && !yearMatch && !gpaMatch && (currentEntry.institution || currentEntry.degree)) {
      currentEntry.description = (currentEntry.description ? currentEntry.description + ' ' : '') + line;
    }
  }

  saveEntry();
  return education;
}

function parseExperience(text: string): Experience[] {
  const experience: Experience[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentEntry: Partial<Experience> = {};

  const saveEntry = () => {
    if (currentEntry.company || currentEntry.position) {
      experience.push({
        id: generateId(),
        company: currentEntry.company || '',
        position: currentEntry.position || '',
        startDate: currentEntry.startDate || '',
        endDate: currentEntry.endDate || '',
        current: currentEntry.current || false,
        location: currentEntry.location || '',
        description: currentEntry.description || '',
        highlights: currentEntry.highlights || [],
      });
      currentEntry = {};
    }
  };

  const positionKeywords = /engineer|developer|analyst|manager|lead|architect|consultant|intern|director|vp|head|chief|officer|specialist|coordinator|designer|researcher|scientist|administrator|technician|programmer|fellow|founder|co-founder|cto|ceo|assistant|instructor|contributor/i;
  const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:[-–—]|to)\s*(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|Present|Current|Ongoing)|\b\d{1,2}\/\d{4}\s*(?:[-–—]|to)\s*(?:\d{1,2}\/\d{4}|Present|Current|Ongoing)|\b(19|20)\d{2}\s*(?:[-–—]|to)\s*((19|20)\d{2}|Present|Current|Ongoing)|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for bullets
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('►')) {
      const cleanBullet = line.replace(/^[•\-*►]\s*/, '').trim();
      if (cleanBullet) {
        if (!currentEntry.highlights) currentEntry.highlights = [];
        currentEntry.highlights.push(cleanBullet);
      }
      continue;
    }

    const dateMatch = line.match(dateRegex);
    const hasPosition = positionKeywords.test(line);

    // If line has date, extract date parts
    let startDate = '';
    let endDate = '';
    let isCurrent = false;
    if (dateMatch) {
      const dateParts = dateMatch[0].split(/\s*[-–—]\s*|\s+to\s+/i).map(d => d.trim());
      startDate = dateParts[0] || '';
      endDate = dateParts[1] || '';
      isCurrent = /present|current|ongoing/i.test(endDate || dateMatch[0]);
      if (isCurrent && !endDate) endDate = 'Present';
    }

    // Check if line is purely dates & location (e.g. "Jan 2022 - Present | San Francisco, CA")
    const lineWithoutDate = dateMatch ? line.replace(dateMatch[0], '').replace(/[|•,]/g, ' ').trim() : line;
    const isPurelyDateMeta = dateMatch && !hasPosition && lineWithoutDate.length < 35;

    if (isPurelyDateMeta && (currentEntry.company || currentEntry.position) && !currentEntry.startDate) {
      currentEntry.startDate = startDate;
      currentEntry.endDate = endDate;
      currentEntry.current = isCurrent;
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        const loc = parts.find(p => !dateRegex.test(p) && p.length > 2);
        if (loc && !currentEntry.location) currentEntry.location = loc;
      }
      continue;
    }

    // Is this line a new job entry?
    const isNewRole = hasPosition || (dateMatch && !currentEntry.startDate);

    if (isNewRole) {
      // If we already have a company/position and (dates or highlights), save previous
      if ((currentEntry.company || currentEntry.position) && (currentEntry.startDate || (currentEntry.highlights && currentEntry.highlights.length > 0))) {
        saveEntry();
      }

      if (dateMatch && !currentEntry.startDate) {
        currentEntry.startDate = startDate;
        currentEntry.endDate = endDate;
        currentEntry.current = isCurrent;
      }

      // Parse title and company
      const cleanLine = dateMatch ? line.replace(dateMatch[0], '').trim() : line;
      const atSplit = cleanLine.split(/\s+(?:at|@)\s+/i);
      const pipeSplit = cleanLine.split(/\s*[|•]\s*/);
      const dashSplit = cleanLine.split(/\s+[-–—]\s+/);

      if (atSplit.length >= 2) {
        currentEntry.position = atSplit[0].replace(/^[|•,]\s*|[|•,]\s*$/g, '').trim();
        const compLoc = atSplit[1].split(/\s*,\s*|\s*[|]\s*/);
        currentEntry.company = compLoc[0].trim();
        if (compLoc.length > 1 && !currentEntry.location) currentEntry.location = compLoc[1].trim();
      } else if (pipeSplit.length >= 2) {
        const p1 = pipeSplit[0].trim();
        const p2 = pipeSplit[1].trim();
        if (positionKeywords.test(p1)) {
          currentEntry.position = p1;
          currentEntry.company = p2;
        } else {
          currentEntry.company = p1;
          currentEntry.position = p2;
        }
      } else if (dashSplit.length >= 2) {
        const p1 = dashSplit[0].trim();
        const p2 = dashSplit[1].trim();
        if (positionKeywords.test(p1)) {
          currentEntry.position = p1;
          currentEntry.company = p2;
        } else {
          currentEntry.company = p1;
          currentEntry.position = p2;
        }
      } else if (hasPosition) {
        if (!currentEntry.position) {
          currentEntry.position = cleanLine;
        } else if (!currentEntry.company) {
          currentEntry.company = cleanLine;
        }
      } else if (!currentEntry.company) {
        currentEntry.company = cleanLine;
      }
    } else if (currentEntry.company || currentEntry.position) {
      if (currentEntry.position && !currentEntry.company && !line.startsWith('•') && !line.startsWith('-') && line.length < 75) {
        const cleanCompanyLine = dateMatch ? line.replace(dateMatch[0], '').trim() : line;
        if (cleanCompanyLine.includes(',')) {
          const parts = cleanCompanyLine.split(',');
          currentEntry.company = parts[0].trim();
          if (!currentEntry.location && parts[1]) currentEntry.location = parts.slice(1).join(',').trim();
        } else {
          currentEntry.company = cleanCompanyLine;
        }
        if (dateMatch && !currentEntry.startDate) {
          currentEntry.startDate = startDate;
          currentEntry.endDate = endDate;
          currentEntry.current = isCurrent;
        }
      } else if (!currentEntry.location && (line.includes(',') || /^(remote|hybrid|onsite)$/i.test(line))) {
        currentEntry.location = line;
      } else {
        currentEntry.description = (currentEntry.description ? currentEntry.description + ' ' : '') + line;
      }
    }
  }

  saveEntry();
  return experience;
}

function parseSkills(text: string): Skill[] {
  const skills: Skill[] = [];
  const skillCategories: Record<string, string[]> = {
    'Frontend': ['react', 'react.js', 'vue', 'vue.js', 'angular', 'svelte', 'next.js', 'nuxt', 'typescript', 'javascript', 'html', 'html5', 'css', 'css3', 'tailwind', 'tailwind css', 'sass', 'styled-components', 'webpack', 'vite', 'redux', 'zustand', 'context api', 'remix', 'astro', 'jquery'],
    'Backend': ['node.js', 'node', 'express', 'nest.js', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'spring boot', 'go', 'golang', 'rust', 'c#', '.net', 'php', 'laravel', 'ruby', 'rails', 'fastify', 'koa'],
    'Database': ['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'dynamodb', 'firebase', 'supabase', 'prisma', 'typeorm', 'sequelize', 'graphql', 'rest api', 'rest', 'grpc', 'cassandra', 'elasticsearch', 'mariadb'],
    'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'vercel', 'netlify', 'ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'terraform', 'ansible', 'nginx', 'linux', 'bash', 'helm', 'cloudformation'],
    'Mobile': ['react native', 'flutter', 'swift', 'kotlin', 'xamarin', 'ionic', 'expo', 'android', 'ios'],
    'Testing': ['jest', 'vitest', 'cypress', 'playwright', 'testing library', 'mocha', 'chai', 'selenium', 'puppeteer', 'junit'],
    'Languages': ['python', 'javascript', 'typescript', 'java', 'c++', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'shell'],
    'Tools': ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'notion', 'figma', 'sketch', 'adobe', 'vs code', 'vim', 'postman', 'insomnia', 'webpack', 'vite', 'prometheus'],
    'Data & AI': ['pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'opencv', 'spark', 'hadoop', 'kafka', 'airflow', 'mlops', 'llm', 'gpt', 'langchain', 'llama', 'huggingface', 'nlp', 'deep learning'],
  };

  const lowerText = text.toLowerCase();
  const foundSkillsMap = new Map<string, string>(); // name -> category

  // Process line by line
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    // Avoid parsing contact info or whole sentences as skills
    if (/@|http|\.(com|org|net|io)|\(\d{3}\)/i.test(line)) continue;

    let lineCategory = '';
    let contentLine = line;
    const catMatch = line.match(/^([A-Za-z\s/&]+):(.*)$/);
    if (catMatch) {
      const headerText = catMatch[1].trim();
      contentLine = catMatch[2].trim();
      for (const cat of Object.keys(skillCategories)) {
        if (headerText.toLowerCase().includes(cat.toLowerCase())) {
          lineCategory = cat;
          break;
        }
      }
    }

    // Split on common delimiters
    const tokens = contentLine
      .split(/[,•·|;/\t]/)
      .map(p => p.trim().replace(/^[•\-*►]\s*/, ''))
      .filter(p => p.length >= 2 && p.length <= 40);

    for (const token of tokens) {
      // Filter out invalid tokens
      if (/^(skills|proficiencies|tools|technologies|technical skills|frameworks|libraries|summary|experience|education)$/i.test(token)) continue;
      if (/@|http|\.com|\.org|\d{3,}/i.test(token)) continue;
      if (token.split(/\s+/).length > 4) continue; // Skip sentences

      const lowerTok = token.toLowerCase();
      if (!foundSkillsMap.has(lowerTok)) {
        foundSkillsMap.set(lowerTok, lineCategory || '');
      }
    }
  }

  // Also match known skills from categories across text
  for (const [category, categorySkills] of Object.entries(skillCategories)) {
    for (const skill of categorySkills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText) && !foundSkillsMap.has(skill.toLowerCase())) {
        foundSkillsMap.set(skill.toLowerCase(), category);
      }
    }
  }

  // Convert to Skill objects with clean categories - unknown levels strictly remain 0
  for (const [lowerName, explicitCategory] of foundSkillsMap.entries()) {
    let properName = lowerName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let category = explicitCategory || 'General';

    for (const [cat, catSkills] of Object.entries(skillCategories)) {
      const match = catSkills.find(s => s.toLowerCase() === lowerName);
      if (match) {
        properName = match.charAt(0).toUpperCase() + match.slice(1);
        if (!explicitCategory) category = cat;
        break;
      }
      if (!explicitCategory && catSkills.some(s => lowerName.includes(s.toLowerCase()))) {
        category = cat;
      }
    }

    skills.push({
      id: generateId(),
      name: properName,
      level: 0, // Unknown - strictly remains unknown (0) until user sets it
      category,
    });
  }

  // Return all extracted skills with zero arbitrary truncation
  return skills;
}

function parseProjects(text: string): Project[] {
  const projects: Project[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentProject: Partial<Project> = {};

  const techKeywords = [
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Node', 'Express',
    'Python', 'Django', 'FastAPI', 'Flask', 'TypeScript', 'JavaScript',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis',
    'GraphQL', 'REST', 'Tailwind', 'Tailwind CSS', 'Prometheus', 'Kafka',
    'Java', 'Spring', 'Go', 'Rust', 'C++', 'C#', '.NET', 'Firebase', 'Supabase'
  ];

  const saveProject = () => {
    if (currentProject.title) {
      projects.push({
        id: generateId(),
        title: currentProject.title,
        description: currentProject.description || '',
        techStack: [...new Set(currentProject.techStack || [])],
        liveUrl: currentProject.liveUrl || '',
        githubUrl: currentProject.githubUrl || '',
        imageUrl: currentProject.imageUrl || '',
        featured: currentProject.featured || false,
      });
      currentProject = {};
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const urls = extractUrls(line);
    const hasUrls = urls.length > 0;
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');

    // Title line: short line, not bullet, not URL, not sentence ending with dot
    const isLikelyTitle = !isBullet && !hasUrls && line.length > 3 && line.length < 75 &&
      !line.endsWith('.') &&
      !line.toLowerCase().startsWith('technologies:') &&
      !line.toLowerCase().startsWith('tech stack:');

    const foundTech = techKeywords.filter(t => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(line));

    if (isLikelyTitle && (currentProject.description || (currentProject.techStack && currentProject.techStack.length > 0) || currentProject.githubUrl || currentProject.liveUrl)) {
      saveProject();
      currentProject = { title: line, techStack: foundTech };
    } else if (isLikelyTitle && !currentProject.title) {
      currentProject.title = line;
      if (foundTech.length > 0) {
        currentProject.techStack = [...(currentProject.techStack || []), ...foundTech];
      }
    } else {
      if (hasUrls) {
        for (const url of urls) {
          if (url.includes('github.com')) currentProject.githubUrl = url;
          else if (!currentProject.liveUrl) currentProject.liveUrl = url;
        }
      }

      if (foundTech.length > 0) {
        currentProject.techStack = [...(currentProject.techStack || []), ...foundTech];
      }

      const cleanDesc = line.replace(URL_REGEX, '').replace(/^[•\-*►]\s*/, '').trim();
      if (cleanDesc && !cleanDesc.toLowerCase().startsWith('http')) {
        currentProject.description = (currentProject.description ? currentProject.description + ' ' : '') + cleanDesc;
      }
    }
  }

  saveProject();
  return projects;
}

function parseAchievements(text: string): Achievement[] {
  const achievements: Achievement[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isAchievement = /award|honor|winner|won|placed|rank|scholarship|fellowship|grant|published|patent|speaker|presented|hackathon|competition|challenge/i.test(trimmed);
    const dateMatch = trimmed.match(/\b(19|20)\d{2}\b/);

    if (isAchievement || (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
      const cleanText = trimmed.replace(/^[•\-*►]\s*/, '').trim();
      if (cleanText.length > 5) {
        achievements.push({
          id: generateId(),
          title: cleanText.split('\n')[0].trim(),
          issuer: '',
          date: dateMatch ? dateMatch[0] : '', // Empty string instead of fabricated current year
          description: cleanText,
          url: '',
        });
      }
    }
  }

  return achievements;
}

function parseCertifications(text: string): Array<{ id: string; title: string; issuer: string; date: string; url: string }> {
  const certs: Array<{ id: string; title: string; issuer: string; date: string; url: string }> = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isCert = /certif|credential|license|badge|master|administrator|architect/i.test(trimmed);
    const dateMatch = trimmed.match(/\b(19|20)\d{2}\b/);
    const urls = extractUrls(trimmed);

    if ((isCert || trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) && trimmed.length > 5) {
      const cleanTitle = trimmed.split('\n')[0].replace(/^[•\-*►]\s*/, '').trim();
      const titleWithoutDate = dateMatch ? cleanTitle.replace(dateMatch[0], '').trim() : cleanTitle;
      certs.push({
        id: generateId(),
        title: titleWithoutDate || cleanTitle,
        issuer: '',
        date: dateMatch ? dateMatch[0] : '', // Empty instead of fabricated current year
        url: urls[0] || '',
      });
    }
  }

  return certs;
}

// ─── Main Parse Function ──────────────────────────────────────────────────

export function parseResumeText(text: string): ResumeParseResult {
  try {
    const cleanedText = cleanText(text);

    if (cleanedText.length < 50) {
      return { success: false, error: 'Resume text too short. Please provide a complete resume.' };
    }

    // Find section boundaries
    const sectionIndices = findSectionIndices(cleanedText);
    const sortedSections = Array.from(sectionIndices.entries()).sort((a, b) => a[1] - b[1]);

    // Extract text for each section
    const sectionTexts: Record<string, string> = {};
    for (let i = 0; i < sortedSections.length; i++) {
      const [section, startIdx] = sortedSections[i];
      const endIdx = i + 1 < sortedSections.length ? sortedSections[i + 1][1] : cleanedText.split('\n').length;
      sectionTexts[section] = extractSection(cleanedText, startIdx + 1, endIdx);
    }

    // Parse each section
    const personal = parsePersonalInfo(sectionTexts.personal || cleanedText, cleanedText);
    let education = sectionTexts.education ? parseEducation(sectionTexts.education) : [];
    if (education.length === 0) {
      education = parseEducation(cleanedText);
    }
    let experience = sectionTexts.experience ? parseExperience(sectionTexts.experience) : [];
    if (experience.length === 0) {
      experience = parseExperience(cleanedText);
    }
    const skills = sectionTexts.skills ? parseSkills(sectionTexts.skills) : parseSkills(cleanedText);
    let projects = sectionTexts.projects ? parseProjects(sectionTexts.projects) : [];
    if (projects.length === 0) {
      projects = parseProjects(cleanedText);
    }
    let achievements = sectionTexts.achievements ? parseAchievements(sectionTexts.achievements) : [];
    if (achievements.length === 0) {
      achievements = parseAchievements(cleanedText);
    }
    let certifications = sectionTexts.certifications ? parseCertifications(sectionTexts.certifications) : [];
    if (certifications.length === 0) {
      certifications = parseCertifications(cleanedText);
    }

    // Calculate confidence based on how many sections we found
    let confidence = 20; // base
    if (personal.firstName) confidence += 10;
    if (personal.email) confidence += 10;
    if (education.length > 0) confidence += 15;
    if (experience.length > 0) confidence += 15;
    if (skills.length > 0) confidence += 10;
    if (projects.length > 0) confidence += 10;
    if (achievements.length > 0) confidence += 5;
    if (certifications.length > 0) confidence += 5;

    const data: ParsedResumeData = {
      personal,
      education,
      experience,
      skills,
      projects,
      achievements,
      certifications,
      rawText: cleanedText,
      confidence: Math.min(confidence, 100),
    };

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse resume',
    };
  }
}

// ─── File Reading Helpers ─────────────────────────────────────────────────

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// For PDF/DOCX, we'll use the API route (server-side parsing)
export async function parseResumeFile(file: File, apiKey?: string): Promise<ResumeParseResult> {
  const formData = new FormData();
  formData.append('file', file);
  const key = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '');
  if (key) {
    formData.append('apiKey', key);
  }

  try {
    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, error: data.error || data.message || 'Failed to parse file' };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ─── Convert to PortfolioData ─────────────────────────────────────────────

export function parsedToPortfolioData(parsed: ParsedResumeData, templateId: string = 'spider-verse'): PortfolioData {
  const { personal, education, experience, skills, projects, achievements, certifications } = parsed;

  // Convert certifications to Achievement format for achievements array
  const certAchievements: Achievement[] = certifications.map(cert => ({
    id: cert.id,
    title: cert.title,
    issuer: cert.issuer,
    date: cert.date,
    description: cert.title,
    url: cert.url,
  }));

  return {
    ...DEFAULT_PORTFOLIO,
    personal: {
      ...DEFAULT_PORTFOLIO.personal,
      firstName: personal.firstName || '',
      lastName: personal.lastName || '',
      title: personal.title || '',
      email: personal.email || '',
      phone: personal.phone || '',
      location: personal.location || '',
      website: personal.website || '',
      linkedin: personal.linkedin || '',
      github: personal.github || '',
      twitter: personal.twitter || '',
      bio: personal.bio || '',
      avatar: personal.avatar || '',
    },
    education,
    experience,
    skills,
    projects,
    achievements: [...achievements, ...certAchievements],
    templateId,
    lastUpdated: new Date().toISOString(),
    certifications: certifications.map(c => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      expiryDate: undefined,
      credentialUrl: c.url,
      credentialId: undefined,
      skills: undefined,
      source: 'resume' as const,
    })),
  };
}