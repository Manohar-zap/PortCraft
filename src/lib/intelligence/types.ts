'use client';

export type { PortfolioData, Skill, Project, Experience, Education, Achievement } from '@/lib/types';
import type { PortfolioData, Skill, Project, Experience, Education, Achievement } from '@/lib/types';

// ─── Core Intelligence Types ────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Explicit preferences
  interests: InterestProfile;
  careerGoals: CareerGoal[];
  preferredThemes: string[];
  skillFocus: SkillFocus[];
  
  // Inferred from behavior
  behaviorProfile: BehaviorProfile;
  skillLevel: SkillLevelAssessment;
  profileCompleteness: number; // 0-100
  
  // Portfolio-specific
  portfolioHistory: PortfolioSnapshot[];
  currentPortfolioId?: string;
  
  // Privacy & Consent
  consent: ConsentSettings;
}

export interface InterestProfile {
  domains: DomainInterest[];
  technologies: TechnologyInterest[];
  industries: IndustryInterest[];
  roles: RoleInterest[];
  lastUpdated: string;
}

export interface DomainInterest {
  domain: string; // e.g., 'web-dev', 'data-science', 'devops', 'mobile', 'ai-ml'
  score: number; // 0-100
  confidence: number; // 0-1
  sources: InterestSource[];
}

export interface TechnologyInterest {
  technology: string;
  score: number;
  confidence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastInteraction: string;
}

export interface IndustryInterest {
  industry: string; // e.g., 'fintech', 'healthtech', 'edtech', 'gaming'
  score: number;
  confidence: number;
}

export interface RoleInterest {
  role: string; // e.g., 'frontend-dev', 'fullstack', 'data-engineer', 'ml-engineer'
  score: number;
  confidence: number;
}

export type InterestSource = 
  | 'explicit_selection' 
  | 'project_analysis' 
  | 'skill_analysis' 
  | 'theme_selection' 
  | 'search_query' 
  | 'time_spent' 
  | 'click_behavior' 
  | 'ai_chat';

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  targetIndustry?: string;
  timeline: 'immediate' | '3-months' | '6-months' | '1-year' | '2-years' | '5-years';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'achieved' | 'archived';
  milestones: CareerMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedAt?: string;
  relatedSkills: string[];
  relatedProjects: string[];
}

export interface SkillFocus {
  skill: string;
  category: string;
  targetLevel: number; // 1-5
  currentLevel: number;
  priority: 'high' | 'medium' | 'low';
  learningResources: LearningResource[];
}

export interface BehaviorProfile {
  // Session patterns
  avgSessionDuration: number; // minutes
  sessionsPerWeek: number;
  preferredTimes: TimePattern[];
  devicePreferences: DevicePreference[];
  
  // Feature usage
  featureUsage: FeatureUsageStats;
  builderStepTimes: Record<string, number>; // stepId -> avg minutes
  templateSwitchCount: number;
  previewFrequency: number;
  
  // Interaction patterns
  clickPatterns: ClickPattern[];
  searchQueries: SearchQuery[];
  aiInteractions: AIInteraction[];
  
  // Content preferences
  contentDensityPreference: 'minimal' | 'balanced' | 'detailed';
  visualComplexityPreference: 'low' | 'medium' | 'high';
  colorSchemePreference: 'dark' | 'light' | 'colorful' | 'mixed';
  
  // Engagement
  engagementScore: number; // 0-100
  lastActiveDate: string;
  streakDays: number;
}

export interface TimePattern {
  dayOfWeek: number; // 0-6
  hourRange: [number, number]; // 0-23
  frequency: number;
}

export interface DevicePreference {
  device: 'desktop' | 'tablet' | 'mobile';
  percentage: number;
  lastUsed: string;
}

export interface FeatureUsageStats {
  builder: number;
  preview: number;
  customizer: number;
  connect: number;
  aiChat: number;
  export: number;
  templates: number;
  resumeImport: number;
}

export interface ClickPattern {
  element: string;
  page: string;
  count: number;
  lastClicked: string;
}

export interface SearchQuery {
  query: string;
  timestamp: string;
  resultsCount: number;
  clickedResult?: string;
}

export interface AIInteraction {
  type: 'chat' | 'generate' | 'improve' | 'analyze' | 'theme-suggest' | 'skill-gap';
  prompt: string;
  responseLength: number;
  userRating?: number; // 1-5
  timestamp: string;
}

export interface SkillLevelAssessment {
  overall: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  byCategory: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'>;
  confidence: number;
  evidence: SkillEvidence[];
  lastAssessed: string;
}

export interface SkillEvidence {
  type: 'project' | 'experience' | 'certification' | 'self-reported' | 'ai-inferred';
  source: string;
  skill: string;
  level: number;
  weight: number;
}

export interface PortfolioSnapshot {
  id: string;
  timestamp: string;
  templateId: string;
  dataHash: string; // For change detection
  completenessScore: number;
  sectionsCompleted: string[];
  themeCustomizations: ThemeCustomization[];
}

export interface ThemeCustomization {
  property: string;
  originalValue: any;
  customizedValue: any;
}

export interface ConsentSettings {
  analytics: boolean;
  personalization: boolean;
  aiTraining: boolean;
  thirdPartySharing: boolean;
  marketingEmails: boolean;
  lastUpdated: string;
  version: string;
}

// ─── Recommendation Types ──────────────────────────────────────────────────

export type RecommendationType = 
  | 'theme' 
  | 'skill' 
  | 'project' 
  | 'learning-resource' 
  | 'career-path' 
  | 'portfolio-improvement'
  | 'template-customization'
  | 'section-completion';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-1
  priority: 'high' | 'medium' | 'low';
  
  // Actionable data
  action?: RecommendationAction;
  metadata: RecommendationMetadata;
  
  // Tracking
  shownAt?: string;
  clickedAt?: string;
  dismissedAt?: string;
  feedback?: UserFeedback;
  createdAt: string;
}

export interface RecommendationAction {
  type: 'navigate' | 'open-modal' | 'apply-template' | 'add-skill' | 'create-project' | 'open-resource' | 'start-chat';
  payload: Record<string, any>;
  label: string;
}

export interface RecommendationMetadata {
  source: 'collaborative' | 'content-based' | 'hybrid' | 'rule-based' | 'llm';
  factors: RecommendationFactor[];
  expiresAt?: string;
  context?: RecommendationContext;
}

export interface RecommendationFactor {
  factor: string;
  weight: number;
  value: any;
  explanation: string;
}

export interface RecommendationContext {
  page: string;
  step?: string;
  portfolioCompleteness: number;
  currentTemplate?: string;
  userIntent?: string;
}

export interface UserFeedback {
  rating: 'helpful' | 'not-helpful' | 'irrelevant' | 'already-done';
  comment?: string;
  timestamp: string;
}

// ─── Learning Resource Types ───────────────────────────────────────────────

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'tutorial' | 'documentation' | 'video' | 'article' | 'book' | 'certification' | 'practice';
  provider: string;
  url: string;
  duration?: string; // e.g., "4 hours", "6 weeks"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: 'free' | 'freemium' | 'paid';
  rating?: number; // 1-5
  skillsCovered: string[];
  prerequisites?: string[];
  certificate?: boolean;
  lastVerified: string;
}

// ─── Context Awareness ────────────────────────────────────────────────────

export interface UserContext {
  userId?: string;
  // Current state
  currentPage: string;
  currentStep?: string;
  portfolioData?: Partial<PortfolioData>;
  templateId?: string;
  
  // Session
  sessionId: string;
  sessionStart: string;
  sessionDuration: number;
  actionsInSession: SessionAction[];
  
  // Device & Environment
  device: 'desktop' | 'tablet' | 'mobile';
  viewport: { width: number; height: number };
  connection: 'fast' | 'slow' | 'offline';
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
  
  // Temporal
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  isWeekend: boolean;
  
  // User state
  isNewUser: boolean;
  isReturningUser: boolean;
  daysSinceLastVisit: number;
  profileCompleteness: number;
}

export interface SessionAction {
  type: string;
  target: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

// ─── UX Evaluation Types ───────────────────────────────────────────────────

export interface UXMetrics {
  // Engagement
  engagement: EngagementMetrics;
  
  // Task Completion
  taskCompletion: TaskCompletionMetrics;
  
  // Satisfaction
  satisfaction: SatisfactionMetrics;
  
  // Perceived Effort
  effort: EffortMetrics;
  
  // Behavioral
  behavioral: BehavioralMetrics;
  
  // Timestamp
  recordedAt: string;
  sessionId: string;
  userId: string;
}

export interface EngagementMetrics {
  timeOnPage: Record<string, number>; // page -> seconds
  pagesPerSession: number;
  returnVisitRate: number;
  featureAdoptionRate: Record<string, number>;
  scrollDepth: Record<string, number>; // page -> percentage
  interactionRate: number; // interactions per minute
}

export interface TaskCompletionMetrics {
  builderCompletionRate: number; // % who finish all steps
  stepCompletionTimes: Record<string, number>; // step -> avg seconds
  dropOffPoints: string[]; // steps where users quit
  errorRate: number;
  retryRate: number;
  successRate: Record<string, number>; // task -> success %
}

export interface SatisfactionMetrics {
  npsScore?: number; // -100 to 100
  csatScore?: number; // 1-5
  easeOfUseRating?: number; // 1-5
  usefulnessRating?: number; // 1-5
  recommendLikelihood?: number; // 1-10
  feedbackCount: number;
  positiveFeedbackRatio: number;
}

export interface EffortMetrics {
  cognitiveLoad: Record<string, number>; // task -> 1-7 (NASA TLX)
  timeToFirstValue: number; // seconds to first meaningful output
  clicksToComplete: Record<string, number>; // task -> click count
  formFieldsCompleted: Record<string, number>;
  helpRequests: number;
  undoRedoCount: number;
}

export interface BehavioralMetrics {
  rageClicks: number;
  deadClicks: number;
  backButtonUsage: number;
  searchUsage: number;
  helpMenuOpens: number;
  keyboardShortcutsUsed: number;
  aiAssistantUsage: number;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  trafficSplit: number; // 0-1
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  hypothesis: string;
  variants: ABTestVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  targetMetric: string;
  minimumSampleSize: number;
  results?: ABTestResults;
}

export interface ABTestResults {
  variantResults: Record<string, VariantResult>;
  winner?: string;
  confidence: number;
  pValue: number;
  lift: number;
}

export interface VariantResult {
  visitors: number;
  conversions: number;
  conversionRate: number;
  avgMetricValue: number;
  confidenceInterval: [number, number];
}

export interface HeuristicEvaluation {
  id: string;
  evaluator: string;
  date: string;
  heuristics: HeuristicScore[];
  overallScore: number;
  criticalIssues: HeuristicIssue[];
  recommendations: string[];
}

export interface HeuristicScore {
  heuristic: string; // Nielsen's 10 heuristics
  score: number; // 1-5
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
  notes: string;
}

export interface HeuristicIssue {
  heuristic: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
  location: string;
  recommendation: string;
}

// ─── Event Tracking ────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: EventType;
  eventName: string;
  properties: Record<string, any>;
  context: Partial<UserContext>;
  timestamp: string;
}

export type EventType = 
  | 'page_view'
  | 'button_click'
  | 'form_interaction'
  | 'template_select'
  | 'template_preview'
  | 'theme_customize'
  | 'section_complete'
  | 'section_edit'
  | 'portfolio_save'
  | 'portfolio_export'
  | 'ai_chat'
  | 'ai_generate'
  | 'ai_improve'
  | 'ai_analyze'
  | 'recommendation_shown'
  | 'recommendation_click'
  | 'recommendation_dismiss'
  | 'recommendation_feedback'
  | 'skill_add'
  | 'skill_edit'
  | 'project_add'
  | 'project_edit'
  | 'experience_add'
  | 'education_add'
  | 'search'
  | 'help_open'
  | 'settings_change'
  | 'consent_change'
  | 'error'
  | 'performance';

export interface EventFunnel {
  name: string;
  steps: FunnelStep[];
  conversionRate: number;
  dropoffPoints: FunnelDropoff[];
}

export interface FunnelStep {
  eventName: string;
  count: number;
  conversionRate: number;
  avgTimeToNext: number;
}

export interface FunnelDropoff {
  fromStep: string;
  toStep: string;
  dropoffRate: number;
  topReasons: string[];
}

// ─── Intelligent Assistant Types ───────────────────────────────────────────

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'recommendation' | 'action' | 'confirmation' | 'question';
  metadata?: MessageMetadata;
  timestamp: string;
}

export interface MessageMetadata {
  recommendations?: Recommendation[];
  actions?: AssistantAction[];
  contextUsed?: Partial<UserContext>;
  confidence?: number;
  tokensUsed?: number;
  model?: string;
}

export interface AssistantAction {
  type: 'navigate' | 'apply' | 'create' | 'edit' | 'show' | 'explain' | 'open-modal';
  label: string;
  payload: Record<string, any>;
  requiresConfirmation?: boolean;
}

export interface AssistantCapabilities {
  canNavigate: boolean;
  canModifyPortfolio: boolean;
  canGenerateContent: boolean;
  canAnalyzePortfolio: boolean;
  canRecommendThemes: boolean;
  canIdentifySkillGaps: boolean;
  canSuggestProjects: boolean;
  canProvideLearningResources: boolean;
  canTrackProgress: boolean;
  canExportData: boolean;
}

export interface AssistantContext {
  userProfile: UserProfile;
  currentPortfolio: PortfolioData | null;
  userContext: UserContext;
  recentEvents: AnalyticsEvent[];
  activeRecommendations: Recommendation[];
  conversationHistory: AssistantMessage[];
}

// ─── Privacy & Data Control ────────────────────────────────────────────────

export interface DataExport {
  userProfile: UserProfile;
  events: AnalyticsEvent[];
  recommendations: Recommendation[];
  feedback: UserFeedback[];
  abTestAssignments: Record<string, string>;
  exportedAt: string;
  version: string;
}

export interface DataDeletionRequest {
  userId: string;
  requestId: string;
  requestedAt: string;
  scope: 'all' | 'analytics' | 'recommendations' | 'profile' | 'events';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedAt?: string;
}

export interface PrivacyDashboardData {
  dataCollected: DataCategory[];
  consentHistory: ConsentChange[];
  thirdPartyShares: ThirdPartyShare[];
  dataRetention: RetentionPolicy[];
}

export interface DataCategory {
  category: string;
  description: string;
  examples: string[];
  retentionDays: number;
  canDelete: boolean;
}

export interface ConsentChange {
  timestamp: string;
  setting: string;
  oldValue: boolean;
  newValue: boolean;
  source: 'user' | 'system' | 'policy-update';
}

export interface ThirdPartyShare {
  recipient: string;
  purpose: string;
  dataCategories: string[];
  timestamp: string;
  legalBasis: string;
}

export interface RetentionPolicy {
  dataCategory: string;
  retentionDays: number;
  autoDelete: boolean;
  legalBasis: string;
}

// ─── Shared Constants ────────────────────────────────────────────────────────

export const DEFAULT_CONSENT: ConsentSettings = {
  analytics: false,
  personalization: false,
  aiTraining: false,
  thirdPartySharing: false,
  marketingEmails: false,
  lastUpdated: new Date().toISOString(),
  version: '1.0',
};

export const INITIAL_USER_PROFILE: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
  interests: {
    domains: [],
    technologies: [],
    industries: [],
    roles: [],
    lastUpdated: new Date().toISOString(),
  },
  careerGoals: [],
  preferredThemes: [],
  skillFocus: [],
  behaviorProfile: {
    avgSessionDuration: 0,
    sessionsPerWeek: 0,
    preferredTimes: [],
    devicePreferences: [],
    featureUsage: {
      builder: 0,
      preview: 0,
      customizer: 0,
      connect: 0,
      aiChat: 0,
      export: 0,
      templates: 0,
      resumeImport: 0,
    },
    builderStepTimes: {},
    templateSwitchCount: 0,
    previewFrequency: 0,
    clickPatterns: [],
    searchQueries: [],
    aiInteractions: [],
    contentDensityPreference: 'balanced',
    visualComplexityPreference: 'medium',
    colorSchemePreference: 'mixed',
    engagementScore: 50,
    lastActiveDate: new Date().toISOString(),
    streakDays: 0,
  },
  skillLevel: {
    overall: 'beginner',
    byCategory: {},
    confidence: 0,
    evidence: [],
    lastAssessed: new Date().toISOString(),
  },
  profileCompleteness: 0,
  portfolioHistory: [],
  consent: DEFAULT_CONSENT,
};