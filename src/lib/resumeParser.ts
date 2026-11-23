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
const SECTION_HEADERS = {
  personal: ['personal', 'profile', 'summary', 'objective', 'about', 'bio'],
  education: ['education', 'academic', 'qualifications', 'degrees', 'university', 'college'],
  experience: ['experience', 'employment', 'work history', 'professional experience', 'career', 'positions'],
  skills: ['skills', 'technical skills', 'competencies', 'technologies', 'tools', 'expertise', 'proficiencies'],
  projects: ['projects', 'portfolio', 'work samples', 'key projects', 'notable projects', 'personal projects'],
  achievements: ['achievements', 'awards', 'honors', 'accomplishments', 'recognition', 'certifications'],
  certifications: ['certifications', 'certificates', 'licenses', 'credentials'],
};

// ─── Utility Functions ────────────────────────────────────────────────────

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\s{2,}/g, ' ')
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

function findSectionIndices(text: string): Map<string, number> {
  const indices = new Map<string, number>();
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    const lowerLine = line.toLowerCase().trim();
    for (const [section, headers] of Object.entries(SECTION_HEADERS)) {
      for (const header of headers) {
        // Match section headers - either the whole line is the header, or it starts with it
        if (lowerLine === header || lowerLine.startsWith(header + ':') || lowerLine.startsWith(header + ' ')) {
          if (!indices.has(section) || i < indices.get(section)!) {
            indices.set(section, i);
          }
        }
      }
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

  // Try to extract name from first few lines
  const firstLines = fullText.split('\n').slice(0, 5).join(' ');
  // Look for a name pattern (capitalized words at the start)
  const nameMatch = firstLines.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);
  if (nameMatch) {
    const nameParts = nameMatch[1].split(' ');
    personal.firstName = nameParts[0];
    personal.lastName = nameParts.slice(1).join(' ');
  }

  // Try to extract title/role from first section
  const lines = fullText.split('\n');
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    // Look for title patterns
    if (line && !line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) && line.length > 5 && line.length < 80) {
      // Skip if it looks like an email, phone, or URL
      if (!EMAIL_REGEX.test(line) && !PHONE_REGEX.test(line) && !URL_REGEX.test(line)) {
        personal.title = line;
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
      personal.bio = personalSection.slice(0, 500);
    }
  }

  return personal;
}

function parseEducation(text: string): Education[] {
  const education: Education[] = [];
  const lines = text.split('\n');

  let currentEntry: Partial<Education> = {};
  let inEntry = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for institution/university keywords
    const isInstitution = /university|college|institute|school|academy/i.test(line);

    // Check for degree patterns
    const degreeMatch = line.match(/(Bachelor|Master|PhD|Doctorate|Associate|Diploma|Certificate|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|MBA|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?)/i);

    // Check for year patterns
    const yearMatch = line.match(/\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}|(19|20)\d{2}\s*[-–—]\s*(Present|Current)|(19|20)\d{2}/i);

    // Check for field of study
    const fieldMatch = line.match(/(Computer Science|Software Engineering|Information Technology|Data Science|Mathematics|Physics|Engineering|Business|Economics|Design|Arts|Marketing|Finance|Management)/i);

    if (isInstitution || degreeMatch || (yearMatch && currentEntry.institution)) {
      // Save previous entry if exists
      if (inEntry && currentEntry.institution) {
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
      }

      // Start new entry
      currentEntry = { id: generateId() };
      inEntry = true;

      if (isInstitution) currentEntry.institution = line;
      if (degreeMatch) currentEntry.degree = degreeMatch[0];
      if (fieldMatch) currentEntry.field = fieldMatch[0];
      if (yearMatch) {
        const years = yearMatch[0].split(/[-–—]/).map(y => y.trim());
        currentEntry.startYear = years[0];
        currentEntry.endYear = years[1] || '';
      }
    } else if (inEntry && (line.includes('GPA') || line.includes('grade') || line.includes('CGPA'))) {
      const gpaMatch = line.match(/(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)|(\d+\.?\d*)/);
      if (gpaMatch) currentEntry.gpa = gpaMatch[0];
    } else if (inEntry && currentEntry.institution) {
      // Accumulate description
      currentEntry.description = (currentEntry.description || '') + (currentEntry.description ? ' ' : '') + line;
    }
  }

  // Don't forget the last entry
  if (inEntry && currentEntry.institution) {
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
  }

  return education;
}

function parseExperience(text: string): Experience[] {
  const experience: Experience[] = [];
  const lines = text.split('\n');

  let currentEntry: Partial<Experience> = {};
  let inEntry = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for company/role patterns
    const isCompany = line.length > 2 && line.length < 100 &&
      (line[0] === line[0].toUpperCase()) &&
      !/^(and|or|the|with|for|at|in|on|from|to|as|by|of)$/i.test(line);

    // Check for date patterns (experience often has dates)
    const dateMatch = line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\b\d{4}\s*[-–—]\s*\d{4}|\b\d{4}\s*[-–—]\s*(Present|Current)/i);

    // Check for position titles
    const positionKeywords = /engineer|developer|analyst|manager|lead|architect|consultant|intern|director|vp|head|chief|officer|specialist|coordinator|designer|researcher|scientist|administrator|technician/i;

    if ((isCompany && (positionKeywords.test(line) || dateMatch)) || dateMatch) {
      // Save previous entry
      if (inEntry && (currentEntry.company || currentEntry.position)) {
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
      }

      currentEntry = { id: generateId() };
      inEntry = true;

      if (dateMatch) {
        const dates = dateMatch[0].split(/[-–—]/).map(d => d.trim());
        currentEntry.startDate = dates[0];
        currentEntry.endDate = dates[1] || '';
        currentEntry.current = /present|current/i.test(dates[1] || '');
      }

      // Try to split company and position
      if (!currentEntry.company && !currentEntry.position) {
        // Heuristic: if line has "at" or "|" or "-", split it
        const parts = line.split(/\s+(?:at|@)\s+|\s+\|\s+|\s+-\s+/);
        if (parts.length >= 2) {
          currentEntry.position = parts[0];
          currentEntry.company = parts[1];
        } else if (positionKeywords.test(line)) {
          currentEntry.position = line;
        } else {
          currentEntry.company = line;
        }
      }
    } else if (inEntry) {
      // Check for location
      if (!currentEntry.location && (line.includes(',') || /^(remote|hybrid|onsite)$/i.test(line))) {
        currentEntry.location = line;
      }
      // Check for bullet points/highlights
      else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('►')) {
        currentEntry.highlights = [...(currentEntry.highlights || []), line.replace(/^[•\-*►]\s*/, '')];
      }
      // Accumulate description
      else {
        currentEntry.description = (currentEntry.description || '') + (currentEntry.description ? ' ' : '') + line;
      }
    }
  }

  // Don't forget the last entry
  if (inEntry && (currentEntry.company || currentEntry.position)) {
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
  }

  return experience;
}

function parseSkills(text: string): Skill[] {
  const skills: Skill[] = [];
  const skillCategories: Record<string, string[]> = {
    'Frontend': ['react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'sass', 'styled-components', 'webpack', 'vite', 'redux', 'zustand', 'context api'],
    'Backend': ['node.js', 'express', 'nest.js', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'go', 'golang', 'rust', 'c#', '.net', 'php', 'laravel', 'ruby', 'rails'],
    'Database': ['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'dynamodb', 'firebase', 'supabase', 'prisma', 'typeorm', 'sequelize', 'graphql', 'rest api', 'grpc'],
    'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'vercel', 'netlify', 'ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'terraform', 'ansible', 'nginx', 'linux'],
    'Mobile': ['react native', 'flutter', 'swift', 'kotlin', 'xamarin', 'ionic', 'expo'],
    'Testing': ['jest', 'vitest', 'cypress', 'playwright', 'testing library', 'mocha', 'chai', 'selenium'],
    'Languages': ['python', 'javascript', 'typescript', 'java', 'c++', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab'],
    'Tools': ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'notion', 'figma', 'sketch', 'adobe', 'vs code', 'vim', 'postman', 'insomnia'],
    'Data & AI': ['pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'opencv', 'spark', 'hadoop', 'kafka', 'airflow', 'mlops', 'llm', 'gpt', 'langchain'],
  };

  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();

  // Extract from comma/bullet separated lists
  const skillLines = text.split('\n').filter(l => l.includes(',') || l.includes('•') || l.includes('·'));
  for (const line of skillLines) {
    const parts = line.split(/[,•·|;]/).map(p => p.trim()).filter(p => p.length > 1 && p.length < 30);
    for (const part of parts) {
      if (part.length > 1) foundSkills.add(part);
    }
  }

  // Also match known skills from categories
  for (const [category, categorySkills] of Object.entries(skillCategories)) {
    for (const skill of categorySkills) {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    }
  }

  // Convert to Skill objects with categories
  for (const skillName of foundSkills) {
    let category = 'General';
    for (const [cat, catSkills] of Object.entries(skillCategories)) {
      if (catSkills.some(s => skillName.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(skillName.toLowerCase()))) {
        category = cat;
        break;
      }
    }
    skills.push({
      id: generateId(),
      name: skillName,
      level: Math.floor(Math.random() * 3) + 3, // 3-5
      category,
    });
  }

  // Limit to reasonable number
  return skills.slice(0, 20);
}

function parseProjects(text: string): Project[] {
  const projects: Project[] = [];
  const lines = text.split('\n');

  let currentProject: Partial<Project> = {};
  let inProject = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for project-like lines (often have tech stack or URLs)
    const hasTechStack = /react|vue|angular|node|python|django|flask|aws|docker|kubernetes|mongodb|postgres|typescript|javascript/i.test(line);
    const hasUrl = URL_REGEX.test(line);
    const isTitle = line.length > 3 && line.length < 80 && line[0] === line[0].toUpperCase() && !line.endsWith('.');

    if ((isTitle && (hasTechStack || hasUrl || i === 0)) || (hasUrl && !inProject)) {
      if (inProject && currentProject.title) {
        projects.push({
          id: generateId(),
          title: currentProject.title || '',
          description: currentProject.description || '',
          techStack: currentProject.techStack || [],
          liveUrl: currentProject.liveUrl || '',
          githubUrl: currentProject.githubUrl || '',
          imageUrl: currentProject.imageUrl || '',
          featured: currentProject.featured || false,
        });
      }

      currentProject = { id: generateId() };
      inProject = true;

      if (isTitle) currentProject.title = line;

      // Extract URLs
      const urls = extractUrls(line);
      for (const url of urls) {
        if (url.includes('github.com')) currentProject.githubUrl = url;
        else currentProject.liveUrl = url;
      }

      // Extract tech stack from line
      const techKeywords = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django', 'Flask', 'TypeScript', 'JavaScript', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST', 'Tailwind', 'Next.js'];
      currentProject.techStack = techKeywords.filter(t => line.toLowerCase().includes(t.toLowerCase()));
    } else if (inProject) {
      if (hasUrl) {
        const urls = extractUrls(line);
        for (const url of urls) {
          if (url.includes('github.com')) currentProject.githubUrl = url;
          else currentProject.liveUrl = url;
        }
      }
      // Extract tech stack
      const techKeywords = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django', 'Flask', 'TypeScript', 'JavaScript', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST', 'Tailwind', 'Next.js'];
      for (const tech of techKeywords) {
        if (line.toLowerCase().includes(tech.toLowerCase()) && !currentProject.techStack?.includes(tech)) {
          currentProject.techStack = [...(currentProject.techStack || []), tech];
        }
      }
      // Accumulate description
      currentProject.description = (currentProject.description || '') + (currentProject.description ? ' ' : '') + line;
    }
  }

  if (inProject && currentProject.title) {
    projects.push({
      id: generateId(),
      title: currentProject.title || '',
      description: currentProject.description || '',
      techStack: currentProject.techStack || [],
      liveUrl: currentProject.liveUrl || '',
      githubUrl: currentProject.githubUrl || '',
      imageUrl: currentProject.imageUrl || '',
      featured: currentProject.featured || false,
    });
  }

  return projects.slice(0, 10);
}

function parseAchievements(text: string): Achievement[] {
  const achievements: Achievement[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for achievement indicators
    const isAchievement = /award|honor|winner|won|placed|rank|certification|certificate|scholarship|fellowship|grant|published|patent|speaker|presented|hackathon|competition|challenge/i.test(trimmed);

    // Check for date
    const dateMatch = trimmed.match(/\b(19|20)\d{2}\b/);

    if (isAchievement || (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
      const cleanText = trimmed.replace(/^[•\-*]\s*/, '');
      if (cleanText.length > 5) {
        achievements.push({
          id: generateId(),
          title: cleanText.split('\n')[0].slice(0, 100),
          issuer: '',
          date: dateMatch ? dateMatch[0] : new Date().getFullYear().toString(),
          description: cleanText,
          url: '',
        });
      }
    }
  }

  return achievements.slice(0, 10);
}

function parseCertifications(text: string): Array<{ id: string; title: string; issuer: string; date: string; url: string }> {
  const certs: Array<{ id: string; title: string; issuer: string; date: string; url: string }> = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isCert = /certif|credential|license|badge/i.test(trimmed);
    const dateMatch = trimmed.match(/\b(19|20)\d{2}\b/);
    const urls = extractUrls(trimmed);

    if (isCert && trimmed.length > 5) {
      certs.push({
        id: generateId(),
        title: trimmed.split('\n')[0].slice(0, 100),
        issuer: '',
        date: dateMatch ? dateMatch[0] : new Date().getFullYear().toString(),
        url: urls[0] || '',
      });
    }
  }

  return certs.slice(0, 10);
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
    const education = sectionTexts.education ? parseEducation(sectionTexts.education) : [];
    const experience = sectionTexts.experience ? parseExperience(sectionTexts.experience) : [];
    const skills = sectionTexts.skills ? parseSkills(sectionTexts.skills) : parseSkills(cleanedText);
    const projects = sectionTexts.projects ? parseProjects(sectionTexts.projects) : [];
    const achievements = sectionTexts.achievements ? parseAchievements(sectionTexts.achievements) : [];
    const certifications = sectionTexts.certifications ? parseCertifications(sectionTexts.certifications) : [];

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
export async function parseResumeFile(file: File): Promise<ResumeParseResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to parse file' };
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