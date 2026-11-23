'use client';

import {
  UXMetrics,
  ABTest,
  ABTestVariant,
  ABTestResults,
  VariantResult,
  HeuristicEvaluation,
  HeuristicScore,
  HeuristicIssue,
  AnalyticsEvent,
  EventFunnel,
  FunnelStep,
  FunnelDropoff,
} from './types';
import { getEvents, saveUXMetrics, getUXMetrics, getABTests, saveABTests, createABTest, getVariantForTest, saveHeuristicEvaluation, getHeuristicEvaluations, trackEvent, getSession } from './storage';
import { generateId, PortfolioData } from '@/lib/types';

// ─── UX Evaluation Engine ──────────────────────────────────────────────────

export class UXEvaluationEngine {
  private userId: string;
  private sessionId: string;
  private sessionStart: number;
  private metricsBuffer: Partial<UXMetrics>;
  private funnelTracking: Map<string, FunnelStep[]>;
  private abTestExposures: Map<string, string>; // testId -> variantId

  constructor(userId: string, sessionId: string) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.sessionStart = Date.now();
    this.metricsBuffer = {
      engagement: { timeOnPage: {}, pagesPerSession: 0, returnVisitRate: 0, featureAdoptionRate: {}, scrollDepth: {}, interactionRate: 0 },
      taskCompletion: { builderCompletionRate: 0, stepCompletionTimes: {}, dropOffPoints: [], errorRate: 0, retryRate: 0, successRate: {} },
      satisfaction: { feedbackCount: 0, positiveFeedbackRatio: 0 },
      effort: { cognitiveLoad: {}, timeToFirstValue: 0, clicksToComplete: {}, formFieldsCompleted: {}, helpRequests: 0, undoRedoCount: 0 },
      behavioral: { rageClicks: 0, deadClicks: 0, backButtonUsage: 0, searchUsage: 0, helpMenuOpens: 0, keyboardShortcutsUsed: 0, aiAssistantUsage: 0 },
    };
    this.funnelTracking = new Map();
    this.abTestExposures = new Map();
  }

  // ─── Metrics Collection ──────────────────────────────────────────────────

  recordPageView(page: string, timestamp = Date.now()): void {
    const metrics = this.metricsBuffer;
    metrics.engagement!.pagesPerSession += 1;
  }

  recordTimeOnPage(page: string, seconds: number): void {
    const metrics = this.metricsBuffer;
    metrics.engagement!.timeOnPage[page] = (metrics.engagement!.timeOnPage[page] || 0) + seconds;
  }

  recordInteraction(page: string, interactionType: string): void {
    const metrics = this.metricsBuffer;
    metrics.engagement!.interactionRate += 1;
    metrics.behavioral!.searchUsage += interactionType === 'search' ? 1 : 0;
    metrics.behavioral!.helpMenuOpens += interactionType === 'help' ? 1 : 0;
    metrics.behavioral!.keyboardShortcutsUsed += interactionType === 'shortcut' ? 1 : 0;
    metrics.behavioral!.aiAssistantUsage += interactionType === 'ai' ? 1 : 0;
  }

  recordClick(x: number, y: number, element: string | null, isRage = false, isDead = false): void {
    const metrics = this.metricsBuffer;
    if (isRage) metrics.behavioral!.rageClicks += 1;
    if (isDead) metrics.behavioral!.deadClicks += 1;
  }

  recordScrollDepth(page: string, depth: number): void {
    const metrics = this.metricsBuffer;
    if (depth > (metrics.engagement!.scrollDepth[page] || 0)) {
      metrics.engagement!.scrollDepth[page] = depth;
    }
  }

  recordFormInteraction(fieldCount: number, completed: boolean): void {
    const metrics = this.metricsBuffer;
    metrics.effort!.formFieldsCompleted[`field_${fieldCount}`] = (metrics.effort!.formFieldsCompleted[`field_${fieldCount}`] || 0) + (completed ? 1 : 0);
  }

  recordTaskStart(task: string): void {
    if (!this.funnelTracking.has(task)) {
      this.funnelTracking.set(task, []);
    }
    this.funnelTracking.get(task)!.push({
      eventName: `${task}_start`,
      count: 1,
      conversionRate: 0,
      avgTimeToNext: 0,
    });
  }

  recordTaskComplete(task: string, success: boolean, timeMs: number, clicks: number): void {
    const metrics = this.metricsBuffer;
    metrics.taskCompletion!.successRate[task] = success ? 1 : 0;
    metrics.effort!.timeToFirstValue = metrics.effort!.timeToFirstValue || timeMs;
    metrics.effort!.clicksToComplete[task] = clicks;
    
    if (!success) {
      metrics.taskCompletion!.errorRate += 1;
    }
  }

  recordRetry(task: string): void {
    this.metricsBuffer.taskCompletion!.retryRate += 1;
  }

  recordUndoRedo(): void {
    this.metricsBuffer.effort!.undoRedoCount += 1;
  }

  recordBackButton(): void {
    this.metricsBuffer.behavioral!.backButtonUsage += 1;
  }

  recordHelpRequest(): void {
    this.metricsBuffer.effort!.helpRequests += 1;
  }

  recordFeatureAdoption(feature: string): void {
    const metrics = this.metricsBuffer;
    metrics.engagement!.featureAdoptionRate[feature] = (metrics.engagement!.featureAdoptionRate[feature] || 0) + 1;
  }

  recordSatisfaction(rating: number, feedback?: string): void {
    const metrics = this.metricsBuffer;
    if (rating >= 4) metrics.satisfaction!.positiveFeedbackRatio += 1;
    metrics.satisfaction!.feedbackCount += 1;
    if (rating !== undefined) metrics.satisfaction!.csatScore = rating;
    if (rating !== undefined && rating >= 9) metrics.satisfaction!.npsScore = (metrics.satisfaction!.npsScore || 0) + 1;
    else if (rating !== undefined && rating <= 6) metrics.satisfaction!.npsScore = (metrics.satisfaction!.npsScore || 0) - 1;
  }

  recordCognitiveLoad(task: string, load: number): void {
    this.metricsBuffer.effort!.cognitiveLoad[task] = load;
  }

  // ─── A/B Testing ─────────────────────────────────────────────────────────

  exposeToABTest(testId: string, variantId: string): void {
    this.abTestExposures.set(testId, variantId);
  }

  getABTestVariant(testId: string): string | undefined {
    return this.abTestExposures.get(testId);
  }

  recordConversion(testId: string, variantId: string, metricValue: number = 1): void {
    // This would be aggregated in the A/B test results
    console.log(`Conversion recorded for test ${testId}, variant ${variantId}, value: ${metricValue}`);
  }

  // ─── Funnel Analysis ─────────────────────────────────────────────────────

  buildFunnel(funnelName: string, steps: string[]): EventFunnel {
    const events = getEvents({ sessionId: this.sessionId });
    const funnelSteps: FunnelStep[] = [];
    let previousCount = events.length;

    for (const step of steps) {
      const stepEvents = events.filter(e => e.eventName === step);
      const count = stepEvents.length;
      const conversionRate = previousCount > 0 ? count / previousCount : 0;
      
      // Calculate avg time to next step
      let avgTime = 0;
      if (stepEvents.length > 0 && funnelSteps.length > 0) {
        const prevStepName = steps[steps.indexOf(step) - 1];
        const prevEvents = events.filter(e => e.eventName === prevStepName);
        // Simplified - would need more sophisticated matching
        avgTime = 0;
      }

      funnelSteps.push({
        eventName: step,
        count,
        conversionRate,
        avgTimeToNext: avgTime,
      });

      previousCount = count;
    }

    // Identify dropoff points
    const dropoffPoints: FunnelDropoff[] = [];
    for (let i = 0; i < funnelSteps.length - 1; i++) {
      const from = funnelSteps[i];
      const to = funnelSteps[i + 1];
      const dropoffRate = from.count > 0 ? 1 - to.conversionRate : 0;
      
      dropoffPoints.push({
        fromStep: from.eventName,
        toStep: to.eventName,
        dropoffRate,
        topReasons: this.identifyDropoffReasons(from.eventName, to.eventName),
      });
    }

    const overallConversion = funnelSteps.length > 0 && funnelSteps[0].count > 0
      ? funnelSteps[funnelSteps.length - 1].count / funnelSteps[0].count
      : 0;

    return {
      name: funnelName,
      steps: funnelSteps,
      conversionRate: overallConversion,
      dropoffPoints,
    };
  }

  private identifyDropoffReasons(fromStep: string, toStep: string): string[] {
    // Analyze events between steps to find common patterns
    const events = getEvents({ sessionId: this.sessionId });
    const fromEvents = events.filter(e => e.eventName === fromStep);
    const reasons: string[] = [];

    // Check for errors
    const errors = fromEvents.filter(e => e.eventType === 'error');
    if (errors.length > 0) reasons.push('Errors encountered');

    // Check for help requests
    const help = fromEvents.filter(e => e.eventName === 'help_open');
    if (help.length > 0) reasons.push('Help requested');

    // Check for back navigation
    const back = fromEvents.filter(e => e.eventName === 'back_button');
    if (back.length > 0) reasons.push('Navigated back');

    // Check for long dwell time (confusion)
    // This would need more sophisticated timing analysis

    return reasons.length > 0 ? reasons : ['Unknown'];
  }

  // ─── Session Metrics Finalization ────────────────────────────────────────

  finalizeSession(): UXMetrics {
    const metrics = this.metricsBuffer;
    const sessionDuration = Date.now() - this.sessionStart;

    // Calculate average interaction rate per minute
    metrics.engagement!.interactionRate = sessionDuration > 0 
      ? metrics.engagement!.interactionRate / (sessionDuration / 60000) 
      : 0;

    // Calculate builder completion rate
    const builderCompleteEvents = getEvents({ 
      sessionId: this.sessionId, 
    }).filter(e => (e as any).eventName === 'builder_complete');
    metrics.taskCompletion!.builderCompletionRate = builderCompleteEvents.length > 0 ? 1 : 0;

    // Calculate step completion times
    for (const [task, steps] of this.funnelTracking.entries()) {
      if (steps.length >= 2) {
        const totalTime = steps.reduce((sum, s) => sum + (s.avgTimeToNext || 0), 0);
        metrics.taskCompletion!.stepCompletionTimes[task] = totalTime / steps.length;
      }
    }

    // Identify drop-off points
    const builderFunnel = this.buildFunnel('Builder Funnel', [
      'builder_start',
      'builder_step_personal',
      'builder_step_education',
      'builder_step_experience',
      'builder_step_projects',
      'builder_step_template',
      'builder_complete',
    ]);
    metrics.taskCompletion!.dropOffPoints = builderFunnel.dropoffPoints.map(d => d.fromStep);

    return {
      engagement: metrics.engagement!,
      taskCompletion: metrics.taskCompletion!,
      satisfaction: metrics.satisfaction!,
      effort: metrics.effort!,
      behavioral: metrics.behavioral!,
      recordedAt: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  saveMetrics(): void {
    const metrics = this.finalizeSession();
    saveUXMetrics(metrics);
  }
}

// ─── Heuristic Evaluation ──────────────────────────────────────────────────

export class HeuristicEvaluator {
  // Nielsen's 10 Heuristics
  static readonly HEURISTICS = [
    'visibility_of_system_status',
    'match_between_system_and_real_world',
    'user_control_and_freedom',
    'consistency_and_standards',
    'error_prevention',
    'recognition_rather_than_recall',
    'flexibility_and_efficiency_of_use',
    'aesthetic_and_minimalist_design',
    'help_users_recognize_diagnose_recover_errors',
    'help_and_documentation',
  ] as const;

  static readonly HEURISTIC_DESCRIPTIONS: Record<string, string> = {
    visibility_of_system_status: 'The system should always keep users informed about what is going on through appropriate feedback within reasonable time.',
    match_between_system_and_real_world: 'The system should speak the users\' language, with words, phrases and concepts familiar to the user, rather than system-oriented terms.',
    user_control_and_freedom: 'Users often choose system functions by mistake and will need a clearly marked "emergency exit" to leave the unwanted state without having to go through an extended dialogue.',
    consistency_and_standards: 'Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.',
    error_prevention: 'Even better than good error messages is a careful design which prevents a problem from occurring in the first place.',
    recognition_rather_than_recall: 'Minimize the user\'s memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the dialogue to another.',
    flexibility_and_efficiency_of_use: 'Accelerators — unseen by the novice user — may often speed up the interaction for the expert user such that the system can cater to both inexperienced and experienced users.',
    aesthetic_and_minimalist_design: 'Dialogues should not contain information which is irrelevant or rarely needed. Every extra unit of information in a dialogue competes with the relevant units of information and diminishes their relative visibility.',
    help_users_recognize_diagnose_recover_errors: 'Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution.',
    help_and_documentation: 'Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation.',
  };

  static evaluate(
    evaluator: string,
    page: string,
    scores: Partial<Record<typeof HeuristicEvaluator.HEURISTICS[number], number>>,
    notes: Partial<Record<typeof HeuristicEvaluator.HEURISTICS[number], string>> = {}
  ): HeuristicEvaluation {
    const heuristicScores: HeuristicScore[] = [];
    const criticalIssues: HeuristicIssue[] = [];

    for (const heuristic of this.HEURISTICS) {
      const score = scores[heuristic] || 3;
      const note = notes[heuristic] || '';
      
      let severity: HeuristicScore['severity'] = 'cosmetic';
      if (score <= 1) severity = 'critical';
      else if (score === 2) severity = 'major';
      else if (score === 3 || score === 4) severity = 'minor';

      heuristicScores.push({
        heuristic,
        score,
        severity,
        notes: note,
      });

      if (severity === 'critical' || severity === 'major') {
        criticalIssues.push({
          heuristic,
          description: note || `Low score (${score}/5) on ${heuristic.replace(/_/g, ' ')}`,
          severity,
          location: page,
          recommendation: this.getRecommendationForHeuristic(heuristic, score),
        });
      }
    }

    const overallScore = heuristicScores.reduce((sum, h) => sum + h.score, 0) / heuristicScores.length;

    return {
      id: generateId(),
      evaluator,
      date: new Date().toISOString(),
      heuristics: heuristicScores,
      overallScore,
      criticalIssues,
      recommendations: this.generateRecommendations(heuristicScores),
    };
  }

  private static getRecommendationForHeuristic(heuristic: string, score: number): string {
    const recommendations: Record<string, string[]> = {
      visibility_of_system_status: [
        'Add loading indicators for async operations',
        'Show clear progress in multi-step flows',
        'Provide immediate feedback for user actions',
      ],
      match_between_system_and_real_world: [
        'Use familiar terminology instead of technical jargon',
        'Follow real-world conventions for icons and patterns',
        'Explain technical concepts in plain language',
      ],
      user_control_and_freedom: [
        'Add clear "Cancel" and "Back" options',
        'Allow undo for destructive actions',
        'Provide clear exit paths from modals and flows',
      ],
      consistency_and_standards: [
        'Standardize button styles and placements',
        'Use consistent terminology across pages',
        'Follow platform design guidelines',
      ],
      error_prevention: [
        'Add confirmation dialogs for destructive actions',
        'Validate input in real-time',
        'Provide sensible defaults',
      ],
      recognition_rather_than_recall: [
        'Show recently used items',
        'Provide autocomplete and suggestions',
        'Keep context visible during tasks',
      ],
      flexibility_and_efficiency_of_use: [
        'Add keyboard shortcuts',
        'Provide power-user features (bulk actions, etc.)',
        'Allow customization of frequent workflows',
      ],
      aesthetic_and_minimalist_design: [
        'Reduce visual clutter',
        'Use progressive disclosure for advanced options',
        'Improve visual hierarchy',
      ],
      help_users_recognize_diagnose_recover_errors: [
        'Write error messages in plain language',
        'Include specific recovery steps',
        'Avoid error codes, explain what went wrong',
      ],
      help_and_documentation: [
        'Add contextual help tooltips',
        'Create searchable documentation',
        'Provide onboarding for new users',
      ],
    };

    return recommendations[heuristic]?.[0] || 'Review and improve based on heuristic guidelines';
  }

  private static generateRecommendations(scores: HeuristicScore[]): string[] {
    const critical = scores.filter(s => s.severity === 'critical');
    const major = scores.filter(s => s.severity === 'major');
    
    const recs: string[] = [];
    
    if (critical.length > 0) {
      recs.push(`Address ${critical.length} critical usability issues immediately`);
    }
    if (major.length > 0) {
      recs.push(`Plan fixes for ${major.length} major usability issues`);
    }
    
    const lowestScoring = scores.sort((a, b) => a.score - b.score).slice(0, 3);
    for (const h of lowestScoring) {
      recs.push(`Improve ${h.heuristic.replace(/_/g, ' ')} (currently ${h.score}/5)`);
    }

    return recs;
  }

  static evaluatePortfolio(
    portfolio: PortfolioData | null,
    evaluator: string = 'PortCraft Usability Engine',
    page: string = '/builder'
  ): HeuristicEvaluation {
    const scores: Partial<Record<typeof HeuristicEvaluator.HEURISTICS[number], number>> = {};
    const notes: Partial<Record<typeof HeuristicEvaluator.HEURISTICS[number], string>> = {};

    if (!portfolio) {
      for (const h of this.HEURISTICS) {
        scores[h] = 2;
        notes[h] = 'No portfolio loaded for evaluation';
      }
      return this.evaluate(evaluator, page, scores, notes);
    }

    const { personal, experience, skills, projects, templateId } = portfolio;

    // 1. Visibility of system status
    if (portfolio.lastUpdated) {
      scores.visibility_of_system_status = 5;
      notes.visibility_of_system_status = 'Real-time auto-saving active with accurate last-updated timestamp';
    } else {
      scores.visibility_of_system_status = 3;
      notes.visibility_of_system_status = 'System status indicator could be more explicit';
    }

    // 2. Match between system and real world
    const hasJobTitle = !!personal?.title;
    const hasCompany = experience?.some(e => !!e.company);
    if (hasJobTitle && hasCompany) {
      scores.match_between_system_and_real_world = 5;
      notes.match_between_system_and_real_world = 'Clear, real-world industry terminology for job roles, companies, and skills';
    } else {
      scores.match_between_system_and_real_world = 3;
      notes.match_between_system_and_real_world = 'Consider completing your professional title and company history with industry-standard terminology';
    }

    // 3. User control and freedom
    scores.user_control_and_freedom = 5;
    notes.user_control_and_freedom = 'Full control over adding, editing, reordering, and removing sections, skills, and projects';

    // 4. Consistency and standards
    if (templateId) {
      scores.consistency_and_standards = 5;
      notes.consistency_and_standards = `Consistent theme design applied (${templateId}) adhering to design system tokens`;
    } else {
      scores.consistency_and_standards = 3;
      notes.consistency_and_standards = 'Select a template theme to guarantee design consistency';
    }

    // 5. Error prevention
    const emailValid = personal?.email && personal.email.includes('@');
    const hasName = personal?.firstName && personal?.lastName;
    if (emailValid && hasName) {
      scores.error_prevention = 5;
      notes.error_prevention = 'Essential identity and contact fields verified to prevent delivery/contact failures';
    } else {
      scores.error_prevention = 2;
      notes.error_prevention = 'Missing valid email or full name in personal info; potential contact failure';
    }

    // 6. Recognition rather than recall
    const hasSkillCategories = skills?.some(s => !!s.category);
    const hasProjectStack = projects?.some(p => p.techStack && p.techStack.length > 0);
    if (hasSkillCategories && hasProjectStack) {
      scores.recognition_rather_than_recall = 5;
      notes.recognition_rather_than_recall = 'Skills and project technologies are visibly tagged with visual cues and categories';
    } else {
      scores.recognition_rather_than_recall = 3;
      notes.recognition_rather_than_recall = 'Categorize your skills and add tech stack badges to your projects';
    }

    // 7. Flexibility and efficiency of use
    const hasMultipleSkills = (skills?.length || 0) >= 5;
    const hasMultipleProjects = (projects?.length || 0) >= 2;
    if (hasMultipleSkills && hasMultipleProjects) {
      scores.flexibility_and_efficiency_of_use = 5;
      notes.flexibility_and_efficiency_of_use = 'Accelerated workflows enabled with resume import, quick templates, and AI assistant';
    } else {
      scores.flexibility_and_efficiency_of_use = 4;
      notes.flexibility_and_efficiency_of_use = 'Leverage resume import or profile connect to quickly populate portfolio entries';
    }

    // 8. Aesthetic and minimalist design
    const hasBio = personal?.bio && personal.bio.length >= 20;
    if (hasBio) {
      scores.aesthetic_and_minimalist_design = 5;
      notes.aesthetic_and_minimalist_design = 'Balanced layout with concise bio, readable typography, and organized content hierarchy';
    } else {
      scores.aesthetic_and_minimalist_design = 3;
      notes.aesthetic_and_minimalist_design = 'Add an introductory summary bio to introduce yourself without cluttering the interface';
    }

    // 9. Help users recognize, diagnose, and recover from errors
    scores.help_users_recognize_diagnose_recover_errors = 4;
    notes.help_users_recognize_diagnose_recover_errors = 'Validation messages guide required fields and format corrections';

    // 10. Help and documentation
    scores.help_and_documentation = 5;
    notes.help_and_documentation = 'Context-aware AI assistant and real-time recommendations panel provide proactive guidance';

    return this.evaluate(evaluator, page, scores, notes);
  }

  static runFullEvaluation(evaluator: string, pages: string[]): HeuristicEvaluation[] {
    const evaluations: HeuristicEvaluation[] = [];
    
    for (const page of pages) {
      // In practice, this would be filled by actual evaluator input
      // Here we provide a template with default scores
      const scores: Partial<Record<typeof HeuristicEvaluator.HEURISTICS[number], number>> = {};
      const notes: Partial<Record<typeof HeuristicEvaluator.HEURISTICS[number], string>> = {};
      
      // Default to 4 (good) for all - evaluator would adjust
      for (const h of this.HEURISTICS) {
        scores[h] = 4;
        notes[h] = 'To be evaluated';
      }

      const evaluation = this.evaluate(evaluator, page, scores, notes);
      evaluations.push(evaluation);
      saveHeuristicEvaluation(evaluation);
    }

    return evaluations;
  }
}

// ─── A/B Testing Framework ────────────────────────────────────────────────

export class ABTestingFramework {
  // Predefined A/B tests for PortCraft
  static readonly DEFAULT_TESTS: Omit<ABTest, 'id' | 'results'>[] = [
    {
      name: 'Builder Step Order',
      hypothesis: 'Moving template selection earlier will increase completion rate',
      variants: [
        { id: 'control', name: 'Current Order', description: 'Personal → Education → Experience → Projects → Template', trafficSplit: 0.5, config: { stepOrder: ['personal', 'education', 'experience', 'projects', 'template'] } },
        { id: 'variant_a', name: 'Template First', description: 'Template → Personal → Education → Experience → Projects', trafficSplit: 0.5, config: { stepOrder: ['template', 'personal', 'education', 'experience', 'projects'] } },
      ],
      status: 'draft',
      targetMetric: 'builderCompletionRate',
      minimumSampleSize: 200,
    },
    {
      name: 'Theme Preview Modal',
      hypothesis: 'Larger theme previews with live demos will increase theme selection',
      variants: [
        { id: 'control', name: 'Small Cards', description: 'Current small theme cards', trafficSplit: 0.5, config: { previewSize: 'small' } },
        { id: 'variant_a', name: 'Large Previews', description: 'Full-width theme previews with live demo button', trafficSplit: 0.5, config: { previewSize: 'large' } },
      ],
      status: 'draft',
      targetMetric: 'templateSwitchCount',
      minimumSampleSize: 150,
    },
    {
      name: 'AI Assistant Prominence',
      hypothesis: 'More prominent AI assistant will increase feature adoption',
      variants: [
        { id: 'control', name: 'Bottom Right', description: 'Current floating chat widget', trafficSplit: 0.5, config: { position: 'bottom-right', size: 'compact' } },
        { id: 'variant_a', name: 'Sidebar', description: 'Persistent sidebar with proactive suggestions', trafficSplit: 0.5, config: { position: 'sidebar', size: 'expanded' } },
      ],
      status: 'draft',
      targetMetric: 'aiAssistantUsage',
      minimumSampleSize: 300,
    },
    {
      name: 'Recommendation Timing',
      hypothesis: 'Showing recommendations after section completion increases action rate',
      variants: [
        { id: 'control', name: 'On Demand', description: 'Recommendations only when requested', trafficSplit: 0.5, config: { timing: 'on-demand' } },
        { id: 'variant_a', name: 'Proactive', description: 'Show recommendations after each section', trafficSplit: 0.5, config: { timing: 'proactive' } },
      ],
      status: 'draft',
      targetMetric: 'recommendation_click',
      minimumSampleSize: 200,
    },
    {
      name: 'Export Button Placement',
      hypothesis: 'Moving export to top toolbar increases exports',
      variants: [
        { id: 'control', name: 'Bottom Right', description: 'Current position in preview toolbar', trafficSplit: 0.5, config: { position: 'bottom-right' } },
        { id: 'variant_a', name: 'Top Toolbar', description: 'Prominent position in top toolbar', trafficSplit: 0.5, config: { position: 'top-toolbar' } },
      ],
      status: 'draft',
      targetMetric: 'portfolio_export',
      minimumSampleSize: 150,
    },
  ];

  static initializeTests(): void {
    const existing = getABTests();
    if (existing.length === 0) {
      for (const test of this.DEFAULT_TESTS) {
        createABTest(test);
      }
    }
  }

  static getActiveTestForUser(testId: string, userId: string): ABTestVariant | null {
    return getVariantForTest(testId);
  }

  static recordExposure(testId: string, variantId: string, userId?: string): void {
    trackEvent({
      userId: userId || 'anonymous',
      sessionId: getSession()?.id || 'ab-session',
      eventType: 'button_click',
      eventName: 'ab_test_exposure',
      properties: { testId, variantId },
      context: { currentPage: '/builder', sessionId: getSession()?.id || 'ab-session' },
    });
  }

  static recordConversion(testId: string, variantId: string, metricValue: number = 1, userId?: string): void {
    trackEvent({
      userId: userId || 'anonymous',
      sessionId: getSession()?.id || 'ab-session',
      eventType: 'button_click',
      eventName: 'ab_test_conversion',
      properties: { testId, variantId, metricValue },
      context: { currentPage: '/builder', sessionId: getSession()?.id || 'ab-session' },
    });
  }

  static analyzeResults(testId: string): ABTestResults | null {
    const tests = getABTests();
    const test = tests.find(t => t.id === testId);
    if (!test) return null;

    const allEvents = getEvents();
    const exposures = allEvents.filter(e => e.eventName === 'ab_test_exposure' && e.properties.testId === testId);
    const conversions = allEvents.filter(e => e.eventName === 'ab_test_conversion' && e.properties.testId === testId);

    const variantResults: Record<string, VariantResult> = {};
    for (const v of test.variants) {
      const vExposures = exposures.filter(e => e.properties.variantId === v.id);
      const vConversions = conversions.filter(e => e.properties.variantId === v.id);
      const visitors = vExposures.length;
      const convCount = vConversions.length;
      const conversionRate = visitors > 0 ? convCount / visitors : 0;
      
      const marginOfError = visitors > 0 ? 1.96 * Math.sqrt((conversionRate * (1 - conversionRate)) / visitors) : 0;
      const ci: [number, number] = [
        Math.max(0, conversionRate - marginOfError),
        Math.min(1, conversionRate + marginOfError),
      ];

      variantResults[v.id] = {
        visitors,
        conversions: convCount,
        conversionRate,
        avgMetricValue: convCount > 0 ? convCount : 0,
        confidenceInterval: ci,
      };
    }

    const control = variantResults['control'] || Object.values(variantResults)[0];
    const candidate = Object.entries(variantResults).find(([k]) => k !== 'control')?.[1] || Object.values(variantResults)[1];

    let significance = { pValue: 1, confidence: 0, lift: 0 };
    if (control && candidate && control.visitors > 0 && candidate.visitors > 0) {
      significance = this.calculateSignificance(
        control.visitors,
        control.conversions,
        candidate.visitors,
        candidate.conversions
      );
    }

    const winnerId = Object.keys(variantResults).find(k => k !== 'control');

    const results: ABTestResults = {
      variantResults,
      winner: significance.confidence >= 0.95 ? (significance.lift > 0 ? winnerId : 'control') : undefined,
      confidence: significance.confidence,
      pValue: significance.pValue,
      lift: significance.lift,
    };

    return results;
  }

  static calculateSignificance(
    controlVisitors: number,
    controlConversions: number,
    variantVisitors: number,
    variantConversions: number
  ): { pValue: number; confidence: number; lift: number } {
    // Two-proportion z-test
    const p1 = controlConversions / controlVisitors;
    const p2 = variantConversions / variantVisitors;
    const pPool = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
    
    const se = Math.sqrt(pPool * (1 - pPool) * (1/controlVisitors + 1/variantVisitors));
    const z = (p2 - p1) / se;
    
    // Two-tailed p-value
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    const lift = p1 > 0 ? (p2 - p1) / p1 : 0;
    const confidence = 1 - pValue;

    return { pValue, confidence, lift };
  }

  private static normalCDF(x: number): number {
    // Approximation of standard normal CDF
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }
}

// ─── Usability Testing Helpers ────────────────────────────────────────────

export interface UsabilityTask {
  id: string;
  name: string;
  description: string;
  successCriteria: string[];
  expectedTime: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export const USABILITY_TASKS: UsabilityTask[] = [
  {
    id: 'create_portfolio',
    name: 'Create Complete Portfolio',
    description: 'Build a complete portfolio from scratch using the builder',
    successCriteria: [
      'Personal info filled',
      'At least 1 education entry',
      'At least 1 experience entry',
      'At least 5 skills added',
      'At least 2 projects added',
      'Template selected',
    ],
    expectedTime: 600, // 10 minutes
    difficulty: 'medium',
  },
  {
    id: 'import_resume',
    name: 'Import Resume',
    description: 'Upload a resume and generate a portfolio',
    successCriteria: [
      'Resume uploaded successfully',
      'Data extracted correctly',
      'Review and edit extracted data',
      'Select theme',
      'Generate portfolio',
    ],
    expectedTime: 300, // 5 minutes
    difficulty: 'easy',
  },
  {
    id: 'customize_theme',
    name: 'Customize Theme',
    description: 'Customize colors, fonts, and layout of selected theme',
    successCriteria: [
      'Open customizer',
      'Change primary color',
      'Change font',
      'Adjust spacing',
      'Save changes',
    ],
    expectedTime: 180, // 3 minutes
    difficulty: 'easy',
  },
  {
    id: 'connect_github',
    name: 'Connect GitHub Profile',
    description: 'Connect GitHub to auto-import repositories and stats',
    successCriteria: [
      'Navigate to Connect page',
      'Enter GitHub username',
      'Successfully import profile',
      'Verify repositories imported',
    ],
    expectedTime: 120, // 2 minutes
    difficulty: 'easy',
  },
  {
    id: 'export_portfolio',
    name: 'Export Portfolio',
    description: 'Export portfolio as HTML/CSS/JS package',
    successCriteria: [
      'Open preview',
      'Click export button',
      'Download ZIP file',
      'Verify files in download',
    ],
    expectedTime: 60, // 1 minute
    difficulty: 'easy',
  },
  {
    id: 'use_ai_assistant',
    name: 'Use AI Assistant',
    description: 'Use the AI assistant to improve portfolio content',
    successCriteria: [
      'Open AI chat',
      'Ask for portfolio analysis',
      'Request skill recommendations',
      'Apply a suggestion',
    ],
    expectedTime: 180, // 3 minutes
    difficulty: 'medium',
  },
];

export interface UsabilityTestResult {
  taskId: string;
  participantId: string;
  success: boolean;
  completionTime: number;
  errors: string[];
  satisfaction: number; // 1-5
  notes: string;
}

export function runUsabilityTest(
  taskId: string,
  participantId: string,
  onTaskStart: () => void,
  onTaskComplete: (result: UsabilityTestResult) => void
): void {
  const task = USABILITY_TASKS.find(t => t.id === taskId);
  if (!task) return;

  const startTime = Date.now();
  onTaskStart();

  // In a real implementation, this would be a guided test session
  // For now, we provide the framework
  console.log(`Starting usability test: ${task.name}`);
  console.log(`Task: ${task.description}`);
  console.log(`Success criteria: ${task.successCriteria.join(', ')}`);
}

// ─── Analytics Dashboard Data ────────────────────────────────────────────

export interface DashboardMetrics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    avgSessionDuration: number;
    completionRate: number;
    npsScore: number;
  };
  engagement: {
    dailyActiveUsers: number[];
    featureAdoption: Record<string, number>;
    topPages: { page: string; views: number }[];
  };
  funnels: EventFunnel[];
  abTests: { testId: string; name: string; status: string; lift: number }[];
  heuristicIssues: { critical: number; major: number; minor: number };
}

export function generateDashboardMetrics(userId?: string): DashboardMetrics {
  const events = userId ? getEvents({ userId }) : getEvents({});
  const metrics = getUXMetrics(userId);
  const tests = getABTests();
  const evaluations = getHeuristicEvaluations();

  // Unique users
  const uniqueUsers = new Set(events.map(e => e.userId)).size;
  
  // Active users (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const activeUsers = new Set(
    events.filter(e => new Date(e.timestamp).getTime() > sevenDaysAgo).map(e => e.userId)
  ).size;

  // Average session duration
  const sessionDurations = events
    .filter(e => e.eventType === 'page_view')
    .map(e => e.properties.sessionDuration || 0)
    .filter(d => d > 0);
  const avgSessionDuration = sessionDurations.length > 0
    ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length / 60000 // minutes
    : 0;

  // Completion rate
  const completed = events.filter(e => e.eventName === 'builder_complete').length;
  const started = events.filter(e => e.eventName === 'builder_start').length;
  const completionRate = started > 0 ? completed / started : 0;

  // NPS from satisfaction metrics
  const npsScores = metrics.flatMap(m => m.satisfaction.npsScore || []).filter(n => n !== undefined);
  const npsScore = npsScores.length > 0 
    ? npsScores.reduce((a, b) => a + b, 0) / npsScores.length 
    : 0;

  // Feature adoption
  const featureEvents = events.filter(e => e.eventName === 'feature_adoption');
  const featureAdoption: Record<string, number> = {};
  for (const e of featureEvents) {
    const feature = e.properties.feature;
    if (feature) featureAdoption[feature] = (featureAdoption[feature] || 0) + 1;
  }

  // Top pages
  const pageViews = events.filter(e => e.eventType === 'page_view');
  const pageCounts: Record<string, number> = {};
  for (const e of pageViews) {
    const page = e.properties.page || 'unknown';
    pageCounts[page] = (pageCounts[page] || 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));

  // Funnels
  const funnels = [
    buildFunnelFromEvents('Builder Funnel', events, [
      'builder_start',
      'builder_step_personal',
      'builder_step_education',
      'builder_step_experience',
      'builder_step_projects',
      'builder_step_template',
      'builder_complete',
    ]),
    buildFunnelFromEvents('Resume Import Funnel', events, [
      'resume_upload',
      'resume_parse',
      'resume_review',
      'resume_template_select',
      'resume_generate',
    ]),
  ];

  // A/B Tests
  const abTests = tests
    .filter(t => t.status === 'running' || t.status === 'completed')
    .map(t => ({
      testId: t.id,
      name: t.name,
      status: t.status,
      lift: t.results?.lift || 0,
    }));

  // Heuristic issues
  const allIssues = evaluations.flatMap((e: HeuristicEvaluation) => e.criticalIssues);
  const heuristicIssues = {
    critical: allIssues.filter((i: HeuristicIssue) => i.severity === 'critical').length,
    major: allIssues.filter((i: HeuristicIssue) => i.severity === 'major').length,
    minor: allIssues.filter((i: HeuristicIssue) => i.severity === 'minor').length,
  };

  return {
    overview: {
      totalUsers: uniqueUsers,
      activeUsers,
      avgSessionDuration: Math.round(avgSessionDuration * 10) / 10,
      completionRate: Math.round(completionRate * 100) / 100,
      npsScore: Math.round(npsScore * 10) / 10,
    },
    engagement: {
      dailyActiveUsers: [], // Would need time-series data
      featureAdoption,
      topPages,
    },
    funnels,
    abTests,
    heuristicIssues,
  };
}

function buildFunnelFromEvents(name: string, events: AnalyticsEvent[], steps: string[]): EventFunnel {
  const funnelSteps: FunnelStep[] = [];
  let previousCount = events.length;

  for (const step of steps) {
    const stepEvents = events.filter(e => e.eventName === step);
    const count = stepEvents.length;
    const conversionRate = previousCount > 0 ? count / previousCount : 0;
    
    funnelSteps.push({
      eventName: step,
      count,
      conversionRate,
      avgTimeToNext: 0,
    });

    previousCount = count;
  }

  const dropoffPoints: FunnelDropoff[] = [];
  for (let i = 0; i < funnelSteps.length - 1; i++) {
    const from = funnelSteps[i];
    const to = funnelSteps[i + 1];
    dropoffPoints.push({
      fromStep: from.eventName,
      toStep: to.eventName,
      dropoffRate: from.count > 0 ? 1 - to.conversionRate : 0,
      topReasons: [],
    });
  }

  const overallConversion = funnelSteps.length > 0 && funnelSteps[0].count > 0
    ? funnelSteps[funnelSteps.length - 1].count / funnelSteps[0].count
    : 0;

  return {
    name,
    steps: funnelSteps,
    conversionRate: overallConversion,
    dropoffPoints,
  };
}

// ─── Export ────────────────────────────────────────────────────────────────

export function createUXEvaluationEngine(userId: string, sessionId: string): UXEvaluationEngine {
  return new UXEvaluationEngine(userId, sessionId);
}