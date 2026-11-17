// PortCraft — Core Data Types

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string; // e.g. "Full Stack Developer"
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  bio: string;
  avatar: string; // base64 or URL
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string; // base64 or URL
  featured: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  url: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  templateId: string;
  theme: ThemeConfig;
  lastUpdated: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  layout: 'classic' | 'sidebar' | 'grid' | 'centered';
  darkMode: boolean;
}

export interface TemplateTerms {
  about: string;
  projects: string;
  skills: string;
  experience: string;
  education: string;
  achievements: string;
}

export interface Template {
  id: string;
  number: number;
  name: string;
  family: 'inspired' | 'original';
  category: string;
  mood: 'dark' | 'light' | 'colorful' | 'cinematic' | 'minimal' | 'rugged' | 'futuristic' | 'historical' | 'warm';
  motionLevel: 'low' | 'medium' | 'high';
  layoutType: string;
  description: string;
  tags: string[];
  previewBg: string;
  accentColor: string;
  defaultTheme: Partial<ThemeConfig>;
  terms: TemplateTerms;
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#7c3aed',
  secondaryColor: '#a78bfa',
  accentColor: '#c4b5fd',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'Inter, sans-serif',
  headingFont: 'Inter, sans-serif',
  fontSize: 'md',
  borderRadius: 'md',
  layout: 'classic',
  darkMode: false,
};

export const DEFAULT_PORTFOLIO: PortfolioData = {
  personal: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
    bio: '',
    avatar: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  achievements: [],
  templateId: '',
  theme: DEFAULT_THEME,
  lastUpdated: new Date().toISOString(),
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
