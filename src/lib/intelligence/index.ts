/**
 * PortCraft Intelligence System
 * 
 * A comprehensive personalized intelligence system including:
 * - User profiling and behavior tracking
 * - Recommendation engine (themes, skills, projects, career paths, learning resources)
 * - Intelligent assistant with context awareness
 * - UX evaluation framework (heuristics, A/B testing, usability testing)
 * - Privacy controls and data transparency
 */

// Types
export * from './types';

// Storage
export * from './storage';

// Recommendation Engine
export * from './recommendationEngine';

// Behavior Tracker
export * from './behaviorTracker';

// Intelligent Assistant
export * from './intelligentAssistant';

// UX Evaluation
export * from './uxEvaluation';

// Privacy
export * from './privacy';

// ─── Main Intelligence Controller ──────────────────────────────────────────

import { UserProfile, PortfolioData, UserContext, Recommendation, AnalyticsEvent } from './types';
import { getUserProfile, getRecommendations } from './storage';
import { BehaviorTracker, initializeBehaviorTracking } from './behaviorTracker';
import { createRecommendationEngine } from './recommendationEngine';
import { createIntelligentAssistant, QUICK_ACTIONS } from './intelligentAssistant';
import { createUXEvaluationEngine, ABTestingFramework, generateDashboardMetrics } from './uxEvaluation';
import { PrivacyManager, usePrivacy } from './privacy';

export class IntelligenceController {
  private behaviorTracker: BehaviorTracker;
  private assistant: ReturnType<typeof createIntelligentAssistant> | null;
  private uxEngine: ReturnType<typeof createUXEvaluationEngine> | null;
  private privacyManager: PrivacyManager;
  private portfolioData: PortfolioData | null;
  private userContext: UserContext;
  private isInitialized: boolean;

  constructor(portfolioData: PortfolioData | null, userContext: UserContext) {
    this.portfolioData = portfolioData;
    this.userContext = userContext;
    this.behaviorTracker = initializeBehaviorTracking();
    this.privacyManager = new PrivacyManager();
    this.assistant = null;
    this.uxEngine = null;
    this.isInitialized = false;
  }

  initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Initialize A/B tests
    ABTestingFramework.initializeTests();

    // Create assistant
    this.assistant = createIntelligentAssistant(this.portfolioData, this.userContext);

    // Create UX evaluation engine
    this.uxEngine = createUXEvaluationEngine(this.userContext.userId || 'anonymous', this.userContext.sessionId);

    // Track initial page view
    this.behaviorTracker.trackPageView(this.userContext.currentPage);
  }

  // ─── Portfolio Data Updates ──────────────────────────────────────────────

  updatePortfolioData(portfolioData: PortfolioData): void {
    this.portfolioData = portfolioData;
    if (this.assistant) {
      this.assistant.updateContext(portfolioData, this.userContext);
    }
  }

  updateUserContext(context: Partial<UserContext>): void {
    this.userContext = { ...this.userContext, ...context };
    if (this.assistant) {
      this.assistant.updateContext(this.portfolioData, this.userContext);
    }
  }

  // ─── Recommendations ─────────────────────────────────────────────────────

  async generateRecommendations(): Promise<Recommendation[]> {
    if (!this.portfolioData) return [];
    
    const engine = createRecommendationEngine(this.portfolioData, {
      page: this.userContext.currentPage,
      portfolioCompleteness: this.calculateCompleteness(this.portfolioData),
      currentTemplate: this.portfolioData.templateId,
    });

    return engine.generateAllRecommendations();
  }

  getActiveRecommendations(): Recommendation[] {
    return getRecommendations().filter(r => !r.dismissedAt && !r.clickedAt);
  }

  // ─── Intelligent Assistant ───────────────────────────────────────────────

  async askAssistant(message: string): Promise<ReturnType<typeof createIntelligentAssistant> extends { processMessage: (msg: string) => Promise<infer R> } ? R : never> {
    if (!this.assistant) {
      this.assistant = createIntelligentAssistant(this.portfolioData, this.userContext);
    }
    return this.assistant.processMessage(message);
  }

  getAssistantCapabilities() {
    return this.assistant?.getCapabilities() || {};
  }

  getConversationHistory() {
    return this.assistant?.getConversationHistory() || [];
  }

  // ─── Behavior Tracking ───────────────────────────────────────────────────

  getTracker(): BehaviorTracker {
    return this.behaviorTracker;
  }

  // ─── UX Evaluation ────────────────────────────────────────────────────────

  recordUXMetrics(): void {
    if (this.uxEngine) {
      this.uxEngine.saveMetrics();
    }
  }

  getDashboardMetrics() {
    return generateDashboardMetrics(this.userContext.userId);
  }

  // ─── Privacy ──────────────────────────────────────────────────────────────

  getPrivacyManager(): PrivacyManager {
    return this.privacyManager;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private calculateCompleteness(portfolio: PortfolioData): number {
    const { personal, education, experience, skills, projects, achievements } = portfolio;
    let score = 0;

    if (personal.firstName && personal.lastName && personal.email && personal.title) score += 20;
    else if (personal.firstName || personal.lastName) score += 10;

    if (education.length > 0) score += 15;
    if (experience.length > 0) score += 20;
    if (skills.length >= 8) score += 15;
    else if (skills.length > 0) score += Math.round(15 * skills.length / 8);
    if (projects.length >= 4) score += 20;
    else if (projects.length > 0) score += Math.round(20 * projects.length / 4);
    if (achievements.length >= 3) score += 10;
    else if (achievements.length > 0) score += Math.round(10 * achievements.length / 3);

    return Math.min(score, 100);
  }

  // ─── Quick Actions ────────────────────────────────────────────────────────

  getQuickActions() {
    return QUICK_ACTIONS;
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  destroy(): void {
    this.behaviorTracker.endSession();
    if (this.uxEngine) {
      this.uxEngine.saveMetrics();
    }
  }
}

// ─── Factory Function ──────────────────────────────────────────────────────

export function createIntelligenceController(
  portfolioData: PortfolioData | null,
  userContext: UserContext
): IntelligenceController {
  return new IntelligenceController(portfolioData, userContext);
}

// ─── React Hook ────────────────────────────────────────────────────────────

export function useIntelligence(portfolioData: PortfolioData | null) {
  // This would be implemented with React context in a real app
  // For now, return the controller factory
  return {
    createController: (context: UserContext) => createIntelligenceController(portfolioData, context),
  };
}