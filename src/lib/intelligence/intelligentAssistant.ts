'use client';

import {
  UserProfile,
  PortfolioData,
  UserContext,
  Recommendation,
  AssistantMessage,
  AssistantAction,
  AssistantCapabilities,
  AssistantContext,
  AnalyticsEvent,
} from './types';
import { getUserProfile, getRecommendations, getEvents, trackEvent, addRecommendationFeedback } from './storage';
import { createRecommendationEngine } from './recommendationEngine';
import { getBehaviorTracker } from './behaviorTracker';
import { generateId, DEFAULT_PORTFOLIO } from '@/lib/types';

// ─── Intelligent Assistant ──────────────────────────────────────────────────

export class IntelligentAssistant {
  private context: AssistantContext;
  private conversationHistory: AssistantMessage[];
  private capabilities: AssistantCapabilities;
  private isProcessing: boolean;
  private messageHandlers: Map<string, (message: AssistantMessage) => void>;

  constructor(portfolioData: PortfolioData | null, userContext: UserContext) {
    this.context = {
      userProfile: getUserProfile(),
      currentPortfolio: portfolioData,
      userContext,
      recentEvents: getEvents({ limit: 50 }),
      activeRecommendations: getRecommendations().filter(r => !r.dismissedAt && !r.clickedAt),
      conversationHistory: [],
    };
    this.conversationHistory = [];
    this.isProcessing = false;
    this.messageHandlers = new Map();
    this.capabilities = this.determineCapabilities();
  }

  // ─── Capabilities ────────────────────────────────────────────────────────

  private determineCapabilities(): AssistantCapabilities {
    const profile = this.context.userProfile;
    const portfolio = this.context.currentPortfolio;

    return {
      canNavigate: true,
      canModifyPortfolio: !!portfolio,
      canGenerateContent: true,
      canAnalyzePortfolio: !!portfolio,
      canRecommendThemes: true,
      canIdentifySkillGaps: portfolio !== null && portfolio.skills.length > 0,
      canSuggestProjects: true,
      canProvideLearningResources: true,
      canTrackProgress: true,
      canExportData: true,
    };
  }

  // ─── Message Processing ──────────────────────────────────────────────────

  async processMessage(userMessage: string): Promise<AssistantMessage> {
    if (this.isProcessing) {
      return this.createMessage('assistant', "I'm still processing your previous request. Please wait a moment.");
    }

    this.isProcessing = true;

    // Add user message to history
    const userMsg = this.createMessage('user', userMessage);
    this.conversationHistory.push(userMsg);
    this.context.conversationHistory = this.conversationHistory;

    try {
      // Analyze intent
      const intent = this.analyzeIntent(userMessage);
      
      // Generate response based on intent
      const response = await this.generateResponse(intent, userMessage);
      
      // Add assistant response to history
      this.conversationHistory.push(response);
      this.context.conversationHistory = this.conversationHistory;

      // Notify handlers
      this.notifyHandlers(response);

      return response;
    } catch (error) {
      console.error('Assistant error:', error);
      const errorMsg = this.createMessage('assistant', "I encountered an error. Please try rephrasing your question.");
      this.conversationHistory.push(errorMsg);
      return errorMsg;
    } finally {
      this.isProcessing = false;
    }
  }

  private analyzeIntent(message: string): string {
    const lower = message.toLowerCase();
    
    // Navigation intents
    if (lower.includes('go to') || lower.includes('navigate') || lower.includes('open') || lower.includes('show me')) {
      return 'navigation';
    }
    
    // Portfolio analysis
    if (lower.includes('analyze') || lower.includes('review') || lower.includes('critique') || lower.includes('improve')) {
      return 'portfolio_analysis';
    }
    
    // Theme recommendations
    if (lower.includes('theme') || lower.includes('template') || lower.includes('design')) {
      return 'theme_recommendation';
    }
    
    // Skill gaps
    if (lower.includes('skill') || lower.includes('learn') || lower.includes('gap') || lower.includes('missing')) {
      return 'skill_gap';
    }
    
    // Project ideas
    if (lower.includes('project') || lower.includes('build') || lower.includes('portfolio piece')) {
      return 'project_suggestion';
    }
    
    // Career guidance
    if (lower.includes('career') || lower.includes('job') || lower.includes('role') || lower.includes('path')) {
      return 'career_guidance';
    }
    
    // Learning resources
    if (lower.includes('resource') || lower.includes('tutorial') || lower.includes('course') || lower.includes('documentation')) {
      return 'learning_resource';
    }
    
    // Progress tracking
    if (lower.includes('progress') || lower.includes('how am i') || lower.includes('status')) {
      return 'progress_tracking';
    }
    
    // Settings/Help
    if (lower.includes('help') || lower.includes('setting') || lower.includes('export') || lower.includes('privacy')) {
      return 'help_settings';
    }

    return 'general_chat';
  }

  private async generateResponse(intent: string, message: string): Promise<AssistantMessage> {
    switch (intent) {
      case 'navigation':
        return this.handleNavigation(message);
      case 'portfolio_analysis':
        return this.handlePortfolioAnalysis(message);
      case 'theme_recommendation':
        return this.handleThemeRecommendation(message);
      case 'skill_gap':
        return this.handleSkillGap(message);
      case 'project_suggestion':
        return this.handleProjectSuggestion(message);
      case 'career_guidance':
        return this.handleCareerGuidance(message);
      case 'learning_resource':
        return this.handleLearningResource(message);
      case 'progress_tracking':
        return this.handleProgressTracking(message);
      case 'help_settings':
        return this.handleHelpSettings(message);
      default:
        return this.handleGeneralChat(message);
    }
  }

  // ─── Intent Handlers ─────────────────────────────────────────────────────

  private handleNavigation(message: string): AssistantMessage {
    const lower = message.toLowerCase();
    let targetPage = '/builder';
    let label = 'Open Builder';
    
    if (lower.includes('preview')) {
      targetPage = '/preview';
      label = 'Open Preview';
    } else if (lower.includes('template') || lower.includes('theme')) {
      targetPage = '/builder?step=template';
      label = 'Browse Themes';
    } else if (lower.includes('connect') || lower.includes('github') || lower.includes('profile')) {
      targetPage = '/connect';
      label = 'Connect Profiles';
    } else if (lower.includes('resume') || lower.includes('import')) {
      targetPage = '/resume-import';
      label = 'Import Resume';
    } else if (lower.includes('dashboard')) {
      targetPage = '/dashboard';
      label = 'Open Dashboard';
    }

    return this.createMessage('assistant', `I'll take you to the ${label.toLowerCase()}.`, 'action', {
      actions: [{
        type: 'navigate',
        label,
        payload: { page: targetPage },
        requiresConfirmation: false,
      }],
    });
  }

  private handlePortfolioAnalysis(message: string): AssistantMessage {
    const portfolio = this.context.currentPortfolio;
    if (!portfolio) {
      return this.createMessage('assistant', "You don't have a portfolio yet. Would you like to create one or import your resume?");
    }

    const analysis = this.analyzePortfolio(portfolio);
    const recommendations = this.context.activeRecommendations
      .filter(r => r.type === 'portfolio-improvement')
      .slice(0, 3);

    let content = `**Portfolio Analysis for ${portfolio.personal.firstName} ${portfolio.personal.lastName}**\n\n`;
    content += `**Completeness:** ${analysis.completeness}%\n`;
    content += `**Template:** ${this.getTemplateName(portfolio.templateId)}\n\n`;
    
    content += `**Strengths:**\n${analysis.strengths.map(s => `• ${s}`).join('\n')}\n\n`;
    
    if (analysis.gaps.length > 0) {
      content += `**Areas for Improvement:**\n${analysis.gaps.map(g => `• ${g}`).join('\n')}\n\n`;
    }

    if (recommendations.length > 0) {
      content += `**Top Recommendations:**\n`;
      for (const rec of recommendations) {
        content += `• ${rec.title}: ${rec.description}\n`;
      }
    }

    return this.createMessage('assistant', content, 'recommendation', {
      recommendations,
      actions: [{
        type: 'navigate',
        label: 'Open Builder to Fix',
        payload: { page: '/builder' },
        requiresConfirmation: false,
      }],
    });
  }

  private handleThemeRecommendation(message: string): AssistantMessage {
    const portfolio = this.context.currentPortfolio;
    const themeRecs = this.context.activeRecommendations
      .filter(r => r.type === 'theme')
      .slice(0, 5);

    if (themeRecs.length === 0) {
      // Generate fresh recommendations
      const engine = createRecommendationEngine(portfolio || DEFAULT_PORTFOLIO, {
        page: '/builder',
        portfolioCompleteness: portfolio ? this.calculateCompleteness(portfolio) : 0,
        currentTemplate: portfolio?.templateId,
      });
      // This would be async in reality
    }

    let content = `**Theme Recommendations for You**\n\n`;
    
    if (portfolio?.templateId) {
      content += `**Current:** ${this.getTemplateName(portfolio.templateId)}\n\n`;
    }

    content += `Based on your profile, here are themes that match your style:\n\n`;
    
    for (const rec of themeRecs) {
      content += `🎨 **${rec.title}**\n${rec.description}\n\n`;
    }

    return this.createMessage('assistant', content, 'recommendation', {
      recommendations: themeRecs,
      actions: [{
        type: 'navigate',
        label: 'Browse All Themes',
        payload: { page: '/builder?step=template' },
        requiresConfirmation: false,
      }],
    });
  }

  private handleSkillGap(message: string): AssistantMessage {
    const portfolio = this.context.currentPortfolio;
    const skillRecs = this.context.activeRecommendations
      .filter(r => r.type === 'skill')
      .slice(0, 5);

    let content = `**Skill Gap Analysis**\n\n`;
    
    if (portfolio) {
      const skills = portfolio.skills;
      content += `**Current Skills (${skills.length}):** ${skills.map(s => s.name).join(', ') || 'None'}\n\n`;
    }

    if (skillRecs.length > 0) {
      content += `**Recommended Skills to Add:**\n`;
      for (const rec of skillRecs) {
        content += `• ${rec.title}\n  ${rec.description}\n\n`;
      }
    } else {
      content += `Add more skills to your portfolio to get personalized recommendations.`;
    }

    const learningRecs = this.context.activeRecommendations
      .filter(r => r.type === 'learning-resource')
      .slice(0, 3);

    if (learningRecs.length > 0) {
      content += `**Learning Resources:**\n`;
      for (const rec of learningRecs) {
        content += `• ${rec.title}\n`;
      }
    }

    return this.createMessage('assistant', content, 'recommendation', {
      recommendations: [...skillRecs, ...learningRecs],
    });
  }

  private handleProjectSuggestion(message: string): AssistantMessage {
    const portfolio = this.context.currentPortfolio;
    const projectRecs = this.context.activeRecommendations
      .filter(r => r.type === 'project')
      .slice(0, 4);

    let content = `**Project Ideas for Your Portfolio**\n\n`;
    
    if (portfolio) {
      content += `**Current Projects (${portfolio.projects.length}):** ${portfolio.projects.map(p => p.title).join(', ') || 'None'}\n\n`;
    }

    if (projectRecs.length > 0) {
      for (const rec of projectRecs) {
        content += `🚀 **${rec.title}**\n${rec.description}\n\n`;
      }
    } else {
      content += `Add more skills and define your career goals to get personalized project suggestions.`;
    }

    return this.createMessage('assistant', content, 'recommendation', {
      recommendations: projectRecs,
      actions: [{
        type: 'navigate',
        label: 'Add Project in Builder',
        payload: { page: '/builder', step: 'projects' },
        requiresConfirmation: false,
      }],
    });
  }

  private handleCareerGuidance(message: string): AssistantMessage {
    const profile = this.context.userProfile;
    const careerRecs = this.context.activeRecommendations
      .filter(r => r.type === 'career-path')
      .slice(0, 3);

    let content = `**Career Guidance**\n\n`;
    
    const activeGoals = profile.careerGoals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      content += `**Active Goals:**\n`;
      for (const goal of activeGoals) {
        content += `• ${goal.targetRole} (${goal.timeline}) - ${goal.milestones.filter(m => m.completed).length}/${goal.milestones.length} milestones\n`;
      }
      content += `\n`;
    } else {
      content += `You don't have active career goals set. Setting a target role helps me give better advice.\n\n`;
    }

    if (careerRecs.length > 0) {
      content += `**Next Steps:**\n`;
      for (const rec of careerRecs) {
        content += `• ${rec.title}: ${rec.description}\n`;
      }
    }

    // Suggest setting a goal if none
    if (activeGoals.length === 0) {
      const suggestedRoles = this.getSuggestedRoles();
      content += `\n**Suggested Career Paths:**\n`;
      for (const role of suggestedRoles.slice(0, 3)) {
        content += `• ${role.title}: ${role.description}\n`;
      }
    }

    return this.createMessage('assistant', content, 'recommendation', {
      recommendations: careerRecs,
      actions: [{
        type: 'open-modal',
        label: 'Set Career Goal',
        payload: { action: 'create-career-goal' },
        requiresConfirmation: false,
      }],
    });
  }

  private handleLearningResource(message: string): AssistantMessage {
    const learningRecs = this.context.activeRecommendations
      .filter(r => r.type === 'learning-resource')
      .slice(0, 5);

    let content = `**Learning Resources**\n\n`;

    if (learningRecs.length > 0) {
      for (const rec of learningRecs) {
        content += `📚 **${rec.title}**\n${rec.description}\n\n`;
      }
    } else {
      content += `Add focus skills or career goals to get personalized learning recommendations.\n\n`;
      
      // Suggest popular resources
      content += `**Popular Resources:**\n`;
      content += `• TypeScript Handbook (free) - https://www.typescriptlang.org/docs/\n`;
      content += `• React Official Tutorial (free) - https://react.dev/learn\n`;
      content += `• Next.js Learn Course (free) - https://nextjs.org/learn\n`;
      content += `• Docker Getting Started (free) - https://docs.docker.com/get-started/\n`;
    }

    return this.createMessage('assistant', content, 'recommendation', {
      recommendations: learningRecs,
    });
  }

  private handleProgressTracking(message: string): AssistantMessage {
    const profile = this.context.userProfile;
    const portfolio = this.context.currentPortfolio;

    let content = `**Your Progress**\n\n`;
    
    content += `**Profile Completeness:** ${profile.profileCompleteness}%\n`;
    content += `**Engagement Score:** ${profile.behaviorProfile.engagementScore}/100\n`;
    content += `**Skill Level:** ${profile.skillLevel.overall}\n`;
    content += `**Streak:** ${profile.behaviorProfile.streakDays} days\n\n`;

    if (portfolio) {
      const completeness = this.calculateCompleteness(portfolio);
      content += `**Portfolio Completeness:** ${completeness}%\n`;
      content += `**Sections:** ${this.getCompletedSections(portfolio).join(', ')}\n`;
      content += `**Projects:** ${portfolio.projects.length}\n`;
      content += `**Skills:** ${portfolio.skills.length}\n`;
    }

    // Recent activity
    const recentEvents = this.context.recentEvents.slice(0, 10);
    if (recentEvents.length > 0) {
      content += `\n**Recent Activity:**\n`;
      for (const event of recentEvents.slice(0, 5)) {
        const time = new Date(event.timestamp).toLocaleTimeString();
        content += `• ${time} - ${event.eventName.replace(/_/g, ' ')}\n`;
      }
    }

    return this.createMessage('assistant', content, 'text');
  }

  private handleHelpSettings(message: string): AssistantMessage {
    const lower = message.toLowerCase();
    
    if (lower.includes('export')) {
      return this.createMessage('assistant', 'You can export your portfolio from the Preview page. Click the "Export" button to download a complete HTML/CSS/JS package.', 'action', {
        actions: [{
          type: 'navigate',
          label: 'Go to Preview',
          payload: { page: '/preview' },
          requiresConfirmation: false,
        }],
      });
    }
    
    if (lower.includes('privacy') || lower.includes('data')) {
      return this.createMessage('assistant', 'Your data is stored locally in your browser. You can view, export, or delete it anytime from Settings. No data is sent to external servers without your consent.', 'action', {
        actions: [{
          type: 'open-modal',
          label: 'Open Privacy Dashboard',
          payload: { action: 'privacy-dashboard' },
          requiresConfirmation: false,
        }],
      });
    }
    
    if (lower.includes('setting')) {
      return this.createMessage('assistant', 'You can customize your theme, colors, fonts, and layout in the Preview page using the Customizer panel (palette icon).', 'action', {
        actions: [{
          type: 'navigate',
          label: 'Open Customizer',
          payload: { page: '/preview' },
          requiresConfirmation: false,
        }],
      });
    }

    return this.createMessage('assistant', `**How can I help you?**\n\n• **Navigation:** "Go to preview", "Open builder", "Show themes"\n• **Portfolio:** "Analyze my portfolio", "What's missing?"\n• **Themes:** "Recommend a theme", "What theme fits me?"\n• **Skills:** "What skills should I add?", "Find learning resources"\n• **Projects:** "Suggest project ideas", "What to build next?"\n• **Career:** "Career guidance", "Set a career goal"\n• **Progress:** "How am I doing?", "Show my progress"\n• **Settings:** "Export portfolio", "Privacy settings"\n\nJust ask naturally!`);
  }

  private handleGeneralChat(message: string): AssistantMessage {
    // Friendly conversational response
    const responses = [
      "That's interesting! Tell me more about what you're working on.",
      "I'd love to help with that. Could you give me a bit more detail?",
      "Great question! Based on your profile, I think...",
      "Let me think about that. What's your current goal?",
    ];
    
    return this.createMessage('assistant', responses[Math.floor(Math.random() * responses.length)]);
  }

  // ─── Analysis Helpers ────────────────────────────────────────────────────

  private analyzePortfolio(portfolio: PortfolioData): {
    completeness: number;
    strengths: string[];
    gaps: string[];
  } {
    const strengths: string[] = [];
    const gaps: string[] = [];

    // Check each section
    if (portfolio.personal.firstName && portfolio.personal.bio && portfolio.personal.bio.length > 100) {
      strengths.push('Complete personal profile with detailed bio');
    } else if (portfolio.personal.firstName) {
      gaps.push('Add a compelling bio (2-3 sentences about your unique value)');
    }

    if (portfolio.skills.length >= 8) {
      strengths.push(`Well-rounded skill set (${portfolio.skills.length} skills)`);
    } else if (portfolio.skills.length > 0) {
      gaps.push(`Add more skills (currently ${portfolio.skills.length}, aim for 8-12)`);
    } else {
      gaps.push('No skills listed - add your technical skills');
    }

    if (portfolio.projects.length >= 4) {
      strengths.push(`Strong project portfolio (${portfolio.projects.length} projects)`);
    } else if (portfolio.projects.length > 0) {
      gaps.push(`Add more projects (currently ${portfolio.projects.length}, aim for 4-6)`);
    } else {
      gaps.push('No projects showcased - add your best work');
    }

    if (portfolio.experience.length > 0) {
      const hasHighlights = portfolio.experience.some((e: any) => e.highlights && e.highlights.length > 0);
      if (hasHighlights) {
        strengths.push('Experience includes quantified achievements');
      } else {
        gaps.push('Add quantified highlights to experience entries');
      }
    } else {
      gaps.push('Add work experience or relevant projects');
    }

    if (portfolio.education.length > 0) {
      strengths.push('Education background included');
    }

    if (portfolio.achievements.length >= 3) {
      strengths.push(`Good achievement tracking (${portfolio.achievements.length} items)`);
    } else if (portfolio.achievements.length > 0) {
      gaps.push('Add more achievements, awards, or certifications');
    }

    const completeness = this.calculateCompleteness(portfolio);

    return { completeness, strengths, gaps };
  }

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

  private getCompletedSections(portfolio: PortfolioData): string[] {
    const sections: string[] = [];
    if (portfolio.personal.firstName) sections.push('Personal');
    if (portfolio.education.length > 0) sections.push('Education');
    if (portfolio.experience.length > 0) sections.push('Experience');
    if (portfolio.skills.length > 0) sections.push('Skills');
    if (portfolio.projects.length > 0) sections.push('Projects');
    if (portfolio.achievements.length > 0) sections.push('Achievements');
    return sections;
  }

  private getTemplateName(templateId: string): string {
    // This would import from templates
    const templateMap: Record<string, string> = {
      'spider-verse': 'Spider-Verse',
      'gotham-noir': 'Gotham Noir',
      'terminal': 'Terminal',
      'bento': 'Bento Grid',
      'minimalist': 'Minimalist',
      'editorial': 'Editorial',
      'creative-studio': 'Creative Studio',
      'data-scientist': 'Data Scientist',
    };
    return templateMap[templateId] || templateId;
  }

  private getSuggestedRoles(): Array<{ title: string; description: string }> {
    const { interests, skillLevel } = this.context.userProfile;
    const topDomains = interests.domains.slice(0, 2).map(d => d.domain);
    
    const suggestions: Array<{ title: string; description: string }> = [];
    
    if (topDomains.includes('web-dev')) {
      suggestions.push({ title: 'Full Stack Developer', description: 'Build complete web applications end-to-end' });
      suggestions.push({ title: 'Frontend Developer', description: 'Specialize in user interfaces and client-side logic' });
    }
    if (topDomains.includes('data-science') || topDomains.includes('ai-ml')) {
      suggestions.push({ title: 'Data Scientist', description: 'Extract insights and build predictive models from data' });
      suggestions.push({ title: 'ML Engineer', description: 'Productionize ML models and build ML infrastructure' });
    }
    if (topDomains.includes('devops')) {
      suggestions.push({ title: 'DevOps Engineer', description: 'Automate infrastructure, deployment, and monitoring' });
    }
    if (topDomains.includes('security')) {
      suggestions.push({ title: 'Security Engineer', description: 'Protect systems and data from threats' });
    }

    return suggestions.length > 0 ? suggestions : [
      { title: 'Full Stack Developer', description: 'Versatile role building complete web applications' },
      { title: 'Frontend Developer', description: 'Focus on user interfaces and experiences' },
    ];
  }

  // ─── Message Creation ────────────────────────────────────────────────────

  private createMessage(
    role: 'user' | 'assistant' | 'system',
    content: string,
    type: 'text' | 'recommendation' | 'action' | 'confirmation' | 'question' = 'text',
    metadata?: { recommendations?: Recommendation[]; actions?: AssistantAction[] }
  ): AssistantMessage {
    return {
      id: generateId(),
      role,
      content,
      type,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  // ─── Event Handlers ──────────────────────────────────────────────────────

  onMessage(handler: (message: AssistantMessage) => void): () => void {
    const id = generateId();
    this.messageHandlers.set(id, handler);
    return () => this.messageHandlers.delete(id);
  }

  private notifyHandlers(message: AssistantMessage): void {
    for (const handler of this.messageHandlers.values()) {
      try {
        handler(message);
      } catch (e) {
        console.error('Message handler error:', e);
      }
    }
  }

  // ─── Feedback ────────────────────────────────────────────────────────────

  async provideFeedback(recommendationId: string, feedback: 'helpful' | 'not-helpful' | 'irrelevant' | 'already-done'): Promise<void> {
    addRecommendationFeedback(recommendationId, {
      rating: feedback,
      timestamp: new Date().toISOString(),
    });

    // Track feedback event
    trackEvent({
      userId: this.context.userProfile.id,
      sessionId: this.context.userContext.sessionId,
      eventType: 'recommendation_feedback',
      eventName: 'recommendation_feedback',
      properties: { recommendationId, feedback },
      context: this.context.userContext,
    });
  }

  // ─── Context Updates ─────────────────────────────────────────────────────

  updateContext(portfolioData: PortfolioData | null, userContext: UserContext): void {
    this.context.currentPortfolio = portfolioData;
    this.context.userContext = userContext;
    this.context.userProfile = getUserProfile();
    this.context.recentEvents = getEvents({ limit: 50 });
    this.context.activeRecommendations = getRecommendations().filter(r => !r.dismissedAt && !r.clickedAt);
    this.capabilities = this.determineCapabilities();
  }

  getConversationHistory(): AssistantMessage[] {
    return [...this.conversationHistory];
  }

  getCapabilities(): AssistantCapabilities {
    return { ...this.capabilities };
  }

  clearHistory(): void {
    this.conversationHistory = [];
    this.context.conversationHistory = [];
  }
}

// ─── Factory Function ──────────────────────────────────────────────────────

export function createIntelligentAssistant(
  portfolioData: PortfolioData | null,
  userContext: UserContext
): IntelligentAssistant {
  return new IntelligentAssistant(portfolioData, userContext);
}

// ─── Quick Action Helpers ──────────────────────────────────────────────────

export const QUICK_ACTIONS = {
  analyzePortfolio: 'Analyze my portfolio and tell me what to improve',
  recommendTheme: 'What theme would fit my profile best?',
  skillGaps: 'What skills am I missing for my career goals?',
  projectIdeas: 'Suggest some project ideas for my portfolio',
  careerGuidance: 'Help me plan my career path',
  learningResources: 'Find learning resources for my focus skills',
  progress: 'How is my portfolio progress?',
  export: 'How do I export my portfolio?',
  privacy: 'What data do you collect about me?',
} as const;