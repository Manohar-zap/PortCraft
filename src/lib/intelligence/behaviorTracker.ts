'use client';

import {
  UserProfile,
  AnalyticsEvent,
  UserContext,
  SessionAction,
  BehaviorProfile,
  SkillLevelAssessment,
  SkillEvidence,
  PortfolioData,
} from './types';
import { getUserProfile, saveUserProfile, trackEvent, getEvents, startSession, updateSession, endSession, getOrCreateAnonymousId, updateUserProfile, getConsent, getOrCreateActiveSession } from './storage';
import { generateId } from '@/lib/types';

// ─── Behavior Tracker ──────────────────────────────────────────────────────

export class BehaviorTracker {
  private userId: string;
  private sessionId: string;
  private sessionStart: number;
  private lastActivity: number;
  private actionCount: number;
  private pageViews: number;
  private currentPage: string;
  private pendingUpdates: Map<string, any>;
  private flushInterval: NodeJS.Timeout | null;
  private isInitialized: boolean;
  private visibilityHandler: (() => void) | null = null;
  private unloadHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private consentHandler: ((e: Event) => void) | null = null;

  constructor() {
    this.userId = getOrCreateAnonymousId();
    const active = typeof window !== 'undefined' ? getOrCreateActiveSession(this.userId) : null;
    this.sessionId = active?.id || generateId();
    this.sessionStart = active?.startedAt ? new Date(active.startedAt).getTime() : Date.now();
    this.lastActivity = Date.now();
    this.actionCount = active?.events || 0;
    this.pageViews = active?.pageViews || 0;
    this.currentPage = '';
    this.pendingUpdates = new Map();
    this.flushInterval = null;
    this.isInitialized = false;

    // Listen for runtime consent changes
    if (typeof window !== 'undefined') {
      this.consentHandler = (e: Event) => {
        const customEvent = e as CustomEvent;
        const consent = customEvent.detail;
        if (consent && consent.analytics === false) {
          this.stopTracking();
        } else if (consent && consent.analytics === true && !this.isInitialized) {
          this.initialize();
        }
      };
      window.addEventListener('portcraft_consent_changed', this.consentHandler);
    }
  }

  // ─── Initialization ──────────────────────────────────────────────────────

  initialize(): void {
    if (this.isInitialized) return;
    if (!this.canTrackAnalytics()) {
      return;
    }
    this.isInitialized = true;

    // Start or resume session
    const active = getOrCreateActiveSession(this.userId);
    if (active) {
      this.sessionId = active.id;
      this.sessionStart = new Date(active.startedAt).getTime();
    }

    // Start periodic flush
    this.flushInterval = setInterval(() => this.flushPendingUpdates(), 30000); // Every 30 seconds

    // Track page visibility changes
    if (typeof document !== 'undefined') {
      this.visibilityHandler = () => {
        if (!this.canTrackAnalytics()) return;
        if (document.hidden) {
          this.trackEvent('page_hidden', { page: this.currentPage });
          this.flushPendingUpdates();
        } else {
          this.trackEvent('page_visible', { page: this.currentPage });
        }
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);

      // Track before unload
      this.unloadHandler = () => {
        this.endSession();
      };
      window.addEventListener('beforeunload', this.unloadHandler);

      // Track scroll depth
      let maxScroll = 0;
      this.scrollHandler = () => {
        if (!this.canTrackAnalytics()) return;
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            this.trackEvent('scroll_depth', { 
              page: this.currentPage, 
              depth: maxScroll 
            });
          }
        }
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }

  stopTracking(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    if (typeof document !== 'undefined' && this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    if (typeof window !== 'undefined') {
      if (this.unloadHandler) {
        window.removeEventListener('beforeunload', this.unloadHandler);
        this.unloadHandler = null;
      }
      if (this.scrollHandler) {
        window.removeEventListener('scroll', this.scrollHandler);
        this.scrollHandler = null;
      }
    }
    this.pendingUpdates.clear();
    this.isInitialized = false;
    this.sessionId = '';
    this.actionCount = 0;
    this.pageViews = 0;
  }

  // ─── Page Tracking ───────────────────────────────────────────────────────

  trackPageView(page: string, metadata?: Record<string, any>): void {
    if (!this.canTrackAnalytics()) return;
    this.currentPage = page;
    this.pageViews++;
    this.updateActivity();
    
    this.trackEvent('page_view', {
      page,
      pageViews: this.pageViews,
      sessionDuration: Date.now() - this.sessionStart,
      ...metadata,
    });
  }

  // ─── Consent Checking ──────────────────────────────────────────────────────

  private canTrackAnalytics(): boolean {
    if (typeof window === 'undefined') return false;
    const consent = getConsent();
    return consent.analytics === true;
  }

  private canTrackPersonalization(): boolean {
    if (typeof window === 'undefined') return false;
    const consent = getConsent();
    return consent.personalization === true;
  }

  // ─── Event Tracking ──────────────────────────────────────────────────────

  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    // Check consent for analytics events
    if (!this.canTrackAnalytics()) {
      return;
    }

    this.updateActivity();
    this.actionCount++;

    const event: Omit<AnalyticsEvent, 'id' | 'timestamp'> = {
      userId: this.userId,
      sessionId: this.sessionId,
      eventType: this.inferEventType(eventName),
      eventName,
      properties,
      context: this.getCurrentContext(),
    };

    trackEvent(event);

    // Queue profile updates
    this.queueProfileUpdate(eventName, properties);
  }

  private inferEventType(eventName: string): AnalyticsEvent['eventType'] {
    const typeMap: Record<string, AnalyticsEvent['eventType']> = {
      'page_view': 'page_view',
      'page_hidden': 'page_view',
      'page_visible': 'page_view',
      'scroll_depth': 'page_view',
      'button_click': 'button_click',
      'link_click': 'button_click',
      'form_input': 'form_interaction',
      'form_submit': 'form_interaction',
      'form_change': 'form_interaction',
      'template_select': 'template_select',
      'template_preview': 'template_preview',
      'theme_customize': 'theme_customize',
      'section_complete': 'section_complete',
      'section_edit': 'section_edit',
      'portfolio_save': 'portfolio_save',
      'portfolio_export': 'portfolio_export',
      'ai_chat': 'ai_chat',
      'ai_generate': 'ai_generate',
      'ai_improve': 'ai_improve',
      'ai_analyze': 'ai_analyze',
      'recommendation_shown': 'recommendation_shown',
      'recommendation_click': 'recommendation_click',
      'recommendation_dismiss': 'recommendation_dismiss',
      'recommendation_feedback': 'recommendation_feedback',
      'skill_add': 'skill_add',
      'skill_edit': 'skill_edit',
      'project_add': 'project_add',
      'project_edit': 'project_edit',
      'experience_add': 'experience_add',
      'education_add': 'education_add',
      'search': 'search',
      'help_open': 'help_open',
      'settings_change': 'settings_change',
      'consent_change': 'consent_change',
      'error': 'error',
      'performance': 'performance',
    };

    return typeMap[eventName] || 'button_click';
  }

  // ─── Profile Updates ─────────────────────────────────────────────────────

  private queueProfileUpdate(eventName: string, properties: Record<string, any>): void {
    // Debounce profile updates
    this.pendingUpdates.set(eventName, { ...this.pendingUpdates.get(eventName), ...properties });
  }

  private async flushPendingUpdates(): Promise<void> {
    if (this.pendingUpdates.size === 0) return;

    const updates = Object.fromEntries(this.pendingUpdates);
    this.pendingUpdates.clear();

    // Process updates asynchronously
    this.processBehaviorUpdates(updates);
  }

  private processBehaviorUpdates(updates: Record<string, any>): void {
    if (!this.canTrackPersonalization()) {
      return;
    }
    updateUserProfile(profile => {
      let updated = { ...profile };
      const behavior = { ...updated.behaviorProfile };

      // Update session metrics
      behavior.lastActiveDate = new Date().toISOString();
      behavior.avgSessionDuration = (behavior.avgSessionDuration + (Date.now() - this.sessionStart) / 60000) / 2;

      // Update feature usage
      for (const [eventName, props] of Object.entries(updates)) {
        this.updateFeatureUsage(behavior, eventName, props);
        this.updateClickPatterns(behavior, eventName, props);
        this.updateSearchQueries(behavior, eventName, props);
        this.updateAIInteractions(behavior, eventName, props);
      }

      // Recalculate engagement score
      behavior.engagementScore = this.calculateEngagementScore(behavior);

      updated.behaviorProfile = behavior;
      updated.profileCompleteness = this.calculateProfileCompleteness(updated);
      updated.skillLevel = this.assessSkillLevel(updated, updated.skillLevel);

      return updated;
    });
  }

  private updateFeatureUsage(behavior: BehaviorProfile, eventName: string, props: any): void {
    const featureMap: Record<string, keyof BehaviorProfile['featureUsage']> = {
      'builder_step_view': 'builder',
      'builder_step_complete': 'builder',
      'preview_view': 'preview',
      'customize_theme': 'customizer',
      'connect_platform': 'connect',
      'ai_chat_message': 'aiChat',
      'ai_generate': 'aiChat',
      'portfolio_export': 'export',
      'template_select': 'templates',
      'template_preview': 'templates',
      'resume_upload': 'resumeImport',
    };

    const feature = featureMap[eventName];
    if (feature && behavior.featureUsage[feature] !== undefined) {
      behavior.featureUsage[feature] += 1;
    }

    // Track builder step times
    if (eventName === 'builder_step_complete' && props.step) {
      const currentTime = behavior.builderStepTimes[props.step] || 0;
      behavior.builderStepTimes[props.step] = (currentTime + (props.duration || 0)) / 2;
    }

    // Track template switches
    if (eventName === 'template_select') {
      behavior.templateSwitchCount += 1;
    }

    // Track preview frequency
    if (eventName === 'preview_view') {
      behavior.previewFrequency += 1;
    }
  }

  private updateClickPatterns(behavior: BehaviorProfile, eventName: string, props: any): void {
    if (!eventName.includes('click') && !eventName.includes('select')) return;

    const element = props.element || props.target || 'unknown';
    const page = props.page || this.currentPage;

    const existing = behavior.clickPatterns.find(p => p.element === element && p.page === page);
    if (existing) {
      existing.count += 1;
      existing.lastClicked = new Date().toISOString();
    } else {
      behavior.clickPatterns.push({
        element,
        page,
        count: 1,
        lastClicked: new Date().toISOString(),
      });
    }

    // Keep only top 50 click patterns
    behavior.clickPatterns.sort((a, b) => b.count - a.count);
    if (behavior.clickPatterns.length > 50) {
      behavior.clickPatterns = behavior.clickPatterns.slice(0, 50);
    }
  }

  private updateSearchQueries(behavior: BehaviorProfile, eventName: string, props: any): void {
    if (eventName !== 'search') return;

    behavior.searchQueries.unshift({
      query: props.query,
      timestamp: new Date().toISOString(),
      resultsCount: props.resultsCount || 0,
      clickedResult: props.clickedResult,
    });

    // Keep only last 50 searches
    if (behavior.searchQueries.length > 50) {
      behavior.searchQueries = behavior.searchQueries.slice(0, 50);
    }
  }

  private updateAIInteractions(behavior: BehaviorProfile, eventName: string, props: any): void {
    const aiEvents = ['ai_chat', 'ai_generate', 'ai_improve', 'ai_analyze'];
    if (!aiEvents.includes(eventName)) return;

    behavior.aiInteractions.unshift({
      type: eventName.replace('ai_', '') as any,
      prompt: props.prompt || '',
      responseLength: props.responseLength || 0,
      userRating: props.rating,
      timestamp: new Date().toISOString(),
    });

    if (behavior.aiInteractions.length > 50) {
      behavior.aiInteractions = behavior.aiInteractions.slice(0, 50);
    }
  }

  private calculateEngagementScore(behavior: BehaviorProfile): number {
    let score = 50; // Base score

    // Feature diversity (max 20 points)
    const featuresUsed = Object.values(behavior.featureUsage).filter(v => v > 0).length;
    score += Math.min(featuresUsed * 3, 20);

    // Session frequency (max 15 points)
    score += Math.min(behavior.sessionsPerWeek * 3, 15);

    // Template exploration (max 10 points)
    score += Math.min(behavior.templateSwitchCount * 2, 10);

    // Preview usage (max 10 points)
    score += Math.min(behavior.previewFrequency * 1.5, 10);

    // AI interaction (max 10 points)
    score += Math.min(behavior.aiInteractions.length * 1, 10);

    // Recency (max 15 points)
    const daysSinceActive = (Date.now() - new Date(behavior.lastActiveDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActive < 1) score += 15;
    else if (daysSinceActive < 3) score += 10;
    else if (daysSinceActive < 7) score += 5;

    // Streak bonus (max 10 points)
    score += Math.min(behavior.streakDays * 0.5, 10);

    return Math.min(Math.max(score, 0), 100);
  }

  private calculateProfileCompleteness(profile: UserProfile): number {
    // This would ideally use the portfolio data, but we only have the profile here
    // Return a proxy based on profile richness
    let score = 0;
    
    if (profile.interests.domains.length > 0) score += 15;
    if (profile.interests.technologies.length > 0) score += 15;
    if (profile.careerGoals.length > 0) score += 20;
    if (profile.preferredThemes.length > 0) score += 10;
    if (profile.skillFocus.length > 0) score += 15;
    if (profile.behaviorProfile.engagementScore > 50) score += 15;
    if (profile.portfolioHistory.length > 0) score += 10;

    return Math.min(score, 100);
  }

  private assessSkillLevel(profile: UserProfile, current: SkillLevelAssessment): SkillLevelAssessment {
    // Simple heuristic-based skill assessment
    const { skills } = this.getCurrentPortfolio() || { skills: [] };
    const evidence: SkillEvidence[] = [];

    // From portfolio skills
    for (const skill of skills) {
      evidence.push({
        type: 'self-reported',
        source: 'portfolio',
        skill: skill.name,
        level: skill.level,
        weight: 1.0,
      });
    }

    // From projects
    const { projects } = this.getCurrentPortfolio() || { projects: [] };
    for (const project of projects) {
      for (const tech of project.techStack) {
        evidence.push({
          type: 'project',
          source: `project:${project.title}`,
          skill: tech,
          level: 3, // Assumed
          weight: 0.7,
        });
      }
    }

    // From experience
    const { experience } = this.getCurrentPortfolio() || { experience: [] };
    for (const exp of experience) {
      // Could extract skills from description
      evidence.push({
        type: 'experience',
        source: `experience:${exp.company}`,
        skill: exp.position,
        level: 3,
        weight: 0.5,
      });
    }

    // Calculate levels by category
    const categoryLevels: Record<string, number[]> = {};
    for (const ev of evidence) {
      // Simple category inference
      const category = this.inferCategory(ev.skill);
      if (!categoryLevels[category]) categoryLevels[category] = [];
      categoryLevels[category].push(ev.level * ev.weight);
    }

    const byCategory: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {};
    let totalWeightedLevel = 0;
    let totalWeight = 0;

    for (const [category, levels] of Object.entries(categoryLevels)) {
      const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
      byCategory[category] = this.levelToLabel(avgLevel);
      totalWeightedLevel += avgLevel;
      totalWeight += 1;
    }

    const overallLevel = totalWeight > 0 ? totalWeightedLevel / totalWeight : 1;
    const overall = this.levelToLabel(overallLevel);

    // Confidence based on evidence count
    const confidence = Math.min(evidence.length / 20, 0.9);

    return {
      overall,
      byCategory,
      confidence,
      evidence: evidence.slice(0, 50), // Keep top 50
      lastAssessed: new Date().toISOString(),
    };
  }

  private levelToLabel(level: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (level >= 4.5) return 'expert';
    if (level >= 3.5) return 'advanced';
    if (level >= 2.5) return 'intermediate';
    return 'beginner';
  }

  private inferCategory(skill: string): string {
    const lower = skill.toLowerCase();
    const categories: Record<string, string[]> = {
      'Frontend': ['react', 'vue', 'angular', 'svelte', 'next.js', 'html', 'css', 'tailwind', 'javascript', 'typescript'],
      'Backend': ['node.js', 'express', 'python', 'django', 'fastapi', 'java', 'spring', 'go', 'rust'],
      'Database': ['postgresql', 'mysql', 'mongodb', 'redis', 'sql', 'prisma'],
      'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'github actions'],
      'Mobile': ['react native', 'flutter', 'swift', 'kotlin'],
      'Data & AI': ['python', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'ml', 'ai'],
      'Languages': ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++', 'c#'],
      'Testing': ['jest', 'vitest', 'cypress', 'playwright', 'testing'],
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(s => lower.includes(s))) return category;
    }
    return 'General';
  }

  private getCurrentPortfolio(): PortfolioData | null {
    // This would need to be passed in or accessed from storage
    // For now, return null - the profile assessment will be limited
    return null;
  }

  // ─── Context ─────────────────────────────────────────────────────────────

  private getCurrentContext(): Partial<UserContext> {
    return {
      currentPage: this.currentPage,
      sessionId: this.sessionId,
      sessionStart: new Date(this.sessionStart).toISOString(),
      sessionDuration: Date.now() - this.sessionStart,
      device: this.getDeviceType(),
      viewport: typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 1920, height: 1080 },
      prefersReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersDarkMode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: new Date().getDay(),
      isWeekend: [0, 6].includes(new Date().getDay()),
    };
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  // ─── Activity Tracking ───────────────────────────────────────────────────

  private updateActivity(): void {
    this.lastActivity = Date.now();
    updateSession({ events: this.actionCount });
  }

  // ─── Session Management ──────────────────────────────────────────────────

  endSession(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flushPendingUpdates();
    endSession();
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  getSessionId(): string {
    return this.sessionId;
  }

  getSessionStartTime(): number {
    return this.sessionStart;
  }

  getSessionDuration(): number {
    return Math.max(0, Date.now() - this.sessionStart);
  }

  getUserId(): string {
    return this.userId;
  }

  // Track specific user actions
  trackTemplateSelect(templateId: string, method: 'click' | 'preview' | 'auto' = 'click'): void {
    this.trackEvent('template_select', { templateId, method });
  }

  trackTemplatePreview(templateId: string, duration?: number): void {
    this.trackEvent('template_preview', { templateId, duration });
  }

  trackThemeCustomization(property: string, oldValue: any, newValue: any): void {
    this.trackEvent('theme_customize', { property, oldValue, newValue });
  }

  trackSectionComplete(section: string, completeness: number): void {
    this.trackEvent('section_complete', { section, completeness });
  }

  trackSectionEdit(section: string, field: string): void {
    this.trackEvent('section_edit', { section, field });
  }

  trackPortfolioSave(): void {
    this.trackEvent('portfolio_save', {});
  }

  trackPortfolioExport(format: string): void {
    this.trackEvent('portfolio_export', { format });
  }

  trackAIChat(messageLength: number, responseLength: number): void {
    this.trackEvent('ai_chat', { messageLength, responseLength });
  }

  trackAIGenerate(type: string, promptLength: number): void {
    this.trackEvent('ai_generate', { type, promptLength });
  }

  trackRecommendationShown(recId: string, recType: string): void {
    this.trackEvent('recommendation_shown', { recommendationId: recId, recommendationType: recType });
  }

  trackRecommendationClick(recId: string, recType: string): void {
    this.trackEvent('recommendation_click', { recommendationId: recId, recommendationType: recType });
  }

  trackRecommendationDismiss(recId: string, recType: string): void {
    this.trackEvent('recommendation_dismiss', { recommendationId: recId, recommendationType: recType });
  }

  trackRecommendationFeedback(recId: string, feedback: string): void {
    this.trackEvent('recommendation_feedback', { recommendationId: recId, feedback });
  }

  trackSkillAdd(skill: string, category: string): void {
    this.trackEvent('skill_add', { skill, category });
  }

  trackSkillEdit(skillId: string, field: string): void {
    this.trackEvent('skill_edit', { skillId, field });
  }

  trackProjectAdd(projectTitle: string): void {
    this.trackEvent('project_add', { projectTitle });
  }

  trackProjectEdit(projectId: string, field: string): void {
    this.trackEvent('project_edit', { projectId, field });
  }

  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent('search', { query, resultsCount });
  }

  trackError(error: string, context: string): void {
    this.trackEvent('error', { error, context });
  }

  trackPerformance(metric: string, value: number): void {
    this.trackEvent('performance', { metric, value });
  }
}

// ─── Singleton Instance ────────────────────────────────────────────────────

let trackerInstance: BehaviorTracker | null = null;

export function getBehaviorTracker(): BehaviorTracker {
  if (!trackerInstance) {
    trackerInstance = new BehaviorTracker();
  }
  return trackerInstance;
}

export function initializeBehaviorTracking(): BehaviorTracker {
  const tracker = getBehaviorTracker();
  tracker.initialize();
  return tracker;
}

// ─── React Hook ────────────────────────────────────────────────────────────

export function useBehaviorTracker() {
  const tracker = getBehaviorTracker();
  
  if (typeof window !== 'undefined' && !tracker.getSessionId()) {
    tracker.initialize();
  }

  return tracker;
}

// ─── Shared Completeness & Context Builder ────────────────────────────────

export function calculatePortfolioCompleteness(portfolio?: PortfolioData | null): number {
  if (!portfolio) return 0;
  const { personal, education, experience, skills, projects, achievements } = portfolio;
  let score = 0;

  if (personal?.firstName && personal?.lastName && personal?.email && personal?.title) score += 20;
  else if (personal?.firstName || personal?.lastName) score += 10;

  if (education && education.length > 0) score += 15;
  if (experience && experience.length > 0) score += 20;
  if (skills && skills.length >= 8) score += 15;
  else if (skills && skills.length > 0) score += Math.round((15 * skills.length) / 8);
  if (projects && projects.length >= 4) score += 20;
  else if (projects && projects.length > 0) score += Math.round((20 * projects.length) / 4);
  if (achievements && achievements.length >= 3) score += 10;
  else if (achievements && achievements.length > 0) score += Math.round((10 * achievements.length) / 3);

  return Math.min(score, 100);
}

export function getOrBuildUserContext(
  currentPage: string,
  portfolio?: PortfolioData | null,
  extra?: Partial<UserContext>
): UserContext {
  const tracker = getBehaviorTracker();
  const profile = getUserProfile();
  const consent = getConsent();
  const sessionId = tracker.getSessionId();
  const sessionStart = tracker.getSessionStartTime();
  const sessionDuration = tracker.getSessionDuration();

  // User is new if no stored visit marker exists
  const hasVisited = typeof window !== 'undefined' ? localStorage.getItem('portcraft_has_visited') : null;
  const isNewUser = !hasVisited;
  const isReturningUser = !!hasVisited;
  if (typeof window !== 'undefined' && !hasVisited) {
    try {
      localStorage.setItem('portcraft_has_visited', 'true');
    } catch {
      // Storage unavailable
    }
  }

  // Real days since last visit
  let daysSinceLastVisit = 0;
  if (profile.behaviorProfile?.lastActiveDate) {
    const diffMs = Date.now() - new Date(profile.behaviorProfile.lastActiveDate).getTime();
    daysSinceLastVisit = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  // Real actions in session from actual events
  const sessionEvents = consent.analytics ? getEvents({ sessionId }) : [];
  const actionsInSession: SessionAction[] = sessionEvents.map(e => ({
    type: e.eventName,
    target: (e.properties?.target || e.properties?.page || e.eventType || 'app') as string,
    timestamp: e.timestamp,
    metadata: e.properties,
  }));

  const now = new Date();
  const h = now.getHours();
  const timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' =
    h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 22 ? 'evening' : 'night';

  const device: 'mobile' | 'tablet' | 'desktop' = typeof window !== 'undefined'
    ? (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop')
    : 'desktop';

  const connection: 'fast' | 'slow' | 'offline' = typeof navigator !== 'undefined'
    ? (!navigator.onLine ? 'offline' : (navigator as any).connection?.effectiveType === '2g' ? 'slow' : 'fast')
    : 'fast';

  return {
    currentPage,
    currentStep: extra?.currentStep,
    portfolioData: portfolio || undefined,
    templateId: portfolio?.templateId,
    userId: profile.id,
    sessionId,
    sessionStart: new Date(sessionStart).toISOString(),
    sessionDuration,
    actionsInSession,
    device,
    viewport: typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 1920, height: 1080 },
    connection,
    prefersReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersDarkMode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
    timeOfDay,
    dayOfWeek: now.getDay(),
    isWeekend: [0, 6].includes(now.getDay()),
    isNewUser,
    isReturningUser,
    daysSinceLastVisit,
    profileCompleteness: calculatePortfolioCompleteness(portfolio),
    ...extra,
  };
}