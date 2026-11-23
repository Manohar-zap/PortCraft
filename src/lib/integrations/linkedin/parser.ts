import { Education, Skill, generateId } from '@/lib/types';

export interface ParsedLinkedInData {
  education: Education[];
  skills: Skill[];
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    description: string;
    highlights: string[];
  }>;
}

const CATEGORY_MAP: Record<string, string> = {
  // Languages
  python: 'Languages',
  javascript: 'Languages',
  typescript: 'Languages',
  java: 'Languages',
  cpp: 'Languages',
  'c++': 'Languages',
  c: 'Languages',
  csharp: 'Languages',
  'c#': 'Languages',
  go: 'Languages',
  golang: 'Languages',
  rust: 'Languages',
  ruby: 'Languages',
  php: 'Languages',
  swift: 'Languages',
  kotlin: 'Languages',
  sql: 'Languages',
  html: 'Frontend',
  css: 'Frontend',
  html5: 'Frontend',
  css3: 'Frontend',

  // Frontend
  react: 'Frontend',
  'react.js': 'Frontend',
  'next.js': 'Frontend',
  nextjs: 'Frontend',
  vue: 'Frontend',
  'vue.js': 'Frontend',
  angular: 'Frontend',
  tailwind: 'Frontend',
  'tailwind css': 'Frontend',
  redux: 'Frontend',
  sass: 'Frontend',

  // Backend
  node: 'Backend',
  'node.js': 'Backend',
  nodejs: 'Backend',
  express: 'Backend',
  'express.js': 'Backend',
  django: 'Backend',
  flask: 'Backend',
  fastapi: 'Backend',
  'spring boot': 'Backend',
  graphql: 'Backend',
  rest: 'Backend',
  'rest apis': 'Backend',
  postgresql: 'Backend',
  postgres: 'Backend',
  mongodb: 'Backend',
  mysql: 'Backend',
  redis: 'Backend',

  // DevOps & Cloud
  docker: 'DevOps',
  kubernetes: 'DevOps',
  aws: 'DevOps',
  azure: 'DevOps',
  gcp: 'DevOps',
  git: 'Tools',
  github: 'Tools',
  linux: 'DevOps',
  ci_cd: 'DevOps',
  'ci/cd': 'DevOps',

  // Data Science
  'machine learning': 'Data Science',
  'deep learning': 'Data Science',
  tensorflow: 'Data Science',
  pytorch: 'Data Science',
  pandas: 'Data Science',
  numpy: 'Data Science',
  'data analysis': 'Data Science',
  ai: 'Data Science',
};

function categorizeSkill(name: string): string {
  const normalized = name.toLowerCase().trim();
  if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) return cat;
  }
  return 'Tools';
}

/**
 * Deterministic client-side parser for pasted LinkedIn profile text or PDF text
 */
export function parseLinkedInText(rawText: string): ParsedLinkedInData {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const education: Education[] = [];
  const skills: Skill[] = [];

  let currentSection: 'none' | 'education' | 'skills' | 'experience' = 'none';
  let buffer: string[] = [];

  const flushEducation = () => {
    if (buffer.length === 0) return;

    // Typically:
    // Line 0: Institution
    // Line 1: Degree / Field
    // Line 2: Dates (e.g. 2020 - 2024 or Aug 2020 - May 2024)
    // Line 3+: Description
    const institution = buffer[0] || '';
    let degree = '';
    let field = '';
    let startYear = '';
    let endYear = '';
    let description = '';

    if (buffer.length > 1) {
      const degLine = buffer[1];
      if (degLine.includes(',')) {
        const parts = degLine.split(',');
        degree = parts[0].trim();
        field = parts.slice(1).join(',').trim();
      } else if (degLine.includes(' - ') || degLine.includes(' in ')) {
        const parts = degLine.includes(' - ') ? degLine.split(' - ') : degLine.split(' in ');
        degree = parts[0].trim();
        field = parts.slice(1).join(' ').trim();
      } else {
        degree = degLine;
      }
    }

    if (buffer.length > 2) {
      const dateLine = buffer[2];
      const years = dateLine.match(/\b(20\d\d|19\d\d)\b/g);
      if (years && years.length >= 2) {
        startYear = years[0];
        endYear = years[1];
      } else if (years && years.length === 1) {
        startYear = years[0];
        if (/present|current/i.test(dateLine)) endYear = 'Present';
      }

      if (buffer.length > 3) {
        description = buffer.slice(3).join('\n');
      }
    }

    if (institution) {
      education.push({
        id: generateId(),
        institution,
        degree,
        field,
        startYear,
        endYear,
        gpa: '',
        description,
      });
    }

    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section transitions
    if (/^(education|studies|academic background)$/i.test(line)) {
      if (currentSection === 'education') flushEducation();
      currentSection = 'education';
      buffer = [];
      continue;
    }

    if (/^(skills|top skills|skills & endorsements|competencies)$/i.test(line)) {
      if (currentSection === 'education') flushEducation();
      currentSection = 'skills';
      buffer = [];
      continue;
    }

    if (/^(experience|work experience|employment|certifications|licenses)$/i.test(line)) {
      if (currentSection === 'education') flushEducation();
      currentSection = 'none';
      buffer = [];
      continue;
    }

    // Process inside sections
    if (currentSection === 'education') {
      // If line looks like a new institution after we already have some lines
      if (buffer.length >= 3 && /university|college|institute|school|academy/i.test(line)) {
        flushEducation();
      }
      buffer.push(line);
    } else if (currentSection === 'skills') {
      // Split by common delimiters like bullets, commas, pipes, or newlines
      const splitItems = line.split(/[·•,\t|]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 50);
      for (const item of splitItems) {
        // Skip common section headers or UI noise
        if (/^(show all|endorsements|passed|assessment|view|profile)$/i.test(item)) continue;
        if (!skills.some((s) => s.name.toLowerCase() === item.toLowerCase())) {
          skills.push({
            id: generateId(),
            name: item,
            level: 0, // Unknown - strictly remains unrated (0) until user sets it
            category: categorizeSkill(item),
          });
        }
      }
    }
  }

  if (currentSection === 'education') {
    flushEducation();
  }

  // Fallback: If no explicit section headers were found, scan lines heuristically
  if (education.length === 0 && skills.length === 0) {
    // Check if line looks like skills (comma or bullet separated)
    for (const line of lines) {
      if (line.includes('·') || line.includes('•') || line.split(',').length > 2) {
        const parts = line.split(/[·•,]/).map((p) => p.trim()).filter((p) => p.length > 1 && p.length < 40);
        for (const p of parts) {
          if (!skills.some((s) => s.name.toLowerCase() === p.toLowerCase())) {
            skills.push({
              id: generateId(),
              name: p,
              level: 0, // Unknown - strictly remains unrated (0) until user sets it
              category: categorizeSkill(p),
            });
          }
        }
      } else if (/university|college|institute|institute of technology|polytechnic/i.test(line)) {
        education.push({
          id: generateId(),
          institution: line,
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startYear: '2021',
          endYear: '2025',
          gpa: '',
          description: '',
        });
      }
    }
  }

  return { education, skills };
}
