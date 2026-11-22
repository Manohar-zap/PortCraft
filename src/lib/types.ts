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
  // Platform integration extensions
  repositories?: Repository[];
  codingStats?: CodingStats;
  publications?: Publication[];
  certifications?: Certification[];
  platformProfiles?: PlatformProfiles;
  importSession?: ImportSession;
  aiState?: AIGenerationState;
  sourceRecords?: PlatformSourceRecord[];
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
  repositories: [],
  codingStats: undefined,
  publications: [],
  certifications: [],
  platformProfiles: undefined,
  importSession: undefined,
  aiState: undefined,
  sourceRecords: [],
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// ─── Platform Integration Types ───────────────────────────────

export interface PlatformSourceRecord {
  platform: string;         // e.g. "github", "leetcode"
  sourceUrl: string;
  fetchedAt: string;        // ISO timestamp
  category: string;         // e.g. "repositories", "stats"
  verified: boolean;
  externalId?: string;      // Platform's own record ID
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  languages?: string[];
  stars: number;
  forks: number;
  url: string;
  homepage?: string;
  topics?: string[];
  isPrivate: boolean;
  updatedAt: string;
  featured: boolean;
  selected: boolean;        // User explicitly selected for portfolio
  source: 'github' | 'gitlab' | 'manual';
  sourceRecord?: PlatformSourceRecord;
}

export interface PlatformRating {
  platform: string;
  rating: number;
  rank?: string;
  maxRating?: number;
  contestsParticipated?: number;
}

export interface CodingStats {
  totalProblemsSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  totalContests?: number;
  ratings?: PlatformRating[];
  badges?: string[];
  streakDays?: number;
  globalRank?: number;
  platformBreakdown?: {
    platform: string;
    solved: number;
    profileUrl: string;
  }[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: string;
  venue?: string;
  url?: string;
  doi?: string;
  citations?: number;
  abstract?: string;
  source: 'scholar' | 'researchgate' | 'manual';
  sourceRecord?: PlatformSourceRecord;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  skills?: string[];
  source: 'linkedin' | 'hackerrank' | 'coursera' | 'kaggle' | 'manual' | 'resume';
  sourceRecord?: PlatformSourceRecord;
}

// ─── Platform-Specific Raw Profile Types ──────────────────────

export interface GitHubProfile {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  location: string;
  company: string;
  blog: string;
  email: string;
  publicRepos: number;
  followers: number;
  following: number;
  repositories: Repository[];
  languages: string[];
  profileUrl: string;
  fetchedAt: string;
}

export interface GitLabProfile {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  location: string;
  website: string;
  publicRepos: number;
  repositories: Repository[];
  profileUrl: string;
  fetchedAt: string;
}

export interface LeetCodeProfile {
  username: string;
  realName?: string;
  avatarUrl?: string;
  ranking?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions?: number;
  acceptanceRate?: number;
  contributionPoints?: number;
  badges?: string[];
  profileUrl: string;
  fetchedAt: string;
}

export interface CodeforcesProfile {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  friendOfCount: number;
  profileUrl: string;
  fetchedAt: string;
}

export interface HackerRankProfile {
  username: string;
  name?: string;
  level?: string;
  badges?: { name: string; stars: number }[];
  skills?: string[];
  certifications?: Certification[];
  profileUrl: string;
  fetchedAt: string;
  note: string; // Always: "Data entered manually or from public profile"
}

export interface KaggleProfile {
  username: string;
  displayName?: string;
  tier: string;
  totalVotes: number;
  notebooks?: number;
  competitions?: number;
  datasets?: number;
  medals?: { gold: number; silver: number; bronze: number };
  profileUrl: string;
  fetchedAt: string;
}

export interface PlatformProfiles {
  github?: GitHubProfile;
  gitlab?: GitLabProfile;
  leetcode?: LeetCodeProfile;
  codeforces?: CodeforcesProfile;
  hackerrank?: HackerRankProfile;
  kaggle?: KaggleProfile;
}

// ─── Import Session State ──────────────────────────────────────

export type ImportStatus =
  | 'not_connected'
  | 'connecting'
  | 'importing'
  | 'imported'
  | 'partial'
  | 'failed'
  | 'manual_required';

export interface PlatformImportState {
  platform: string;
  status: ImportStatus;
  username: string;
  lastFetched?: string;
  error?: string;
  dataCategories?: string[];
}

export interface ImportSession {
  platforms: Record<string, PlatformImportState>;
  startedAt: string;
  completedAt?: string;
}

// ─── AI Generation State ──────────────────────────────────────

export interface AIGenerationState {
  status: 'idle' | 'generating' | 'done' | 'error';
  generatedAt?: string;
  instructions?: string;
  model?: string;
}
