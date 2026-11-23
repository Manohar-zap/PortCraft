'use client';

import {
  UserProfile,
  Recommendation,
  RecommendationType,
  RecommendationAction,
  RecommendationMetadata,
  RecommendationFactor,
  RecommendationContext,
  LearningResource,
  PortfolioData,
  Skill,
  Project,
  Experience,
  Education,
  Achievement,
} from './types';
import { getUserProfile, addRecommendation, getRecommendations } from './storage';
import { generateId } from '@/lib/types';
import { TEMPLATES, getTemplate } from '@/lib/templates';

// ─── Recommendation Engine ─────────────────────────────────────────────────

export class RecommendationEngine {
  private userProfile: UserProfile;
  private portfolioData: PortfolioData | null;
  private context: RecommendationContext;

  constructor(portfolioData: PortfolioData | null, context: RecommendationContext) {
    this.userProfile = getUserProfile();
    this.portfolioData = portfolioData;
    this.context = context;
  }

  // ─── Main Entry Point ────────────────────────────────────────────────

  async generateAllRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get existing recommendations to check for dismissed/feedback
    const existingRecs = getRecommendations();
    const dismissedIds = new Set(existingRecs.filter(r => r.dismissedAt).map(r => r.id));
    const negativeFeedbackIds = new Set(
      existingRecs
        .filter(r => r.feedback && (
          r.feedback.rating === 'not-helpful' || 
          r.feedback.rating === 'irrelevant' ||
          r.feedback.rating === 'already-done'
        ))
        .map(r => r.id)
    );

    // Track helpful categories and skills for feedback boosting
    const helpfulThemeIds = new Set<string>();
    const helpfulSkillCategories = new Set<string>();
    existingRecs.forEach(r => {
      if (r.feedback?.rating === 'helpful') {
        if (r.type === 'theme' && r.action?.payload?.templateId) {
          helpfulThemeIds.add(r.action.payload.templateId);
        }
        if (r.type === 'skill' && r.metadata?.factors) {
          helpfulSkillCategories.add(r.title);
        }
      }
    });

    // Generate each type of recommendation
    const allRecs: Recommendation[] = [];
    allRecs.push(...this.recommendThemes(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendSkills(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendProjects(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendLearningResources(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendCareerPaths(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendPortfolioImprovements(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendTemplateCustomizations(dismissedIds, negativeFeedbackIds));
    allRecs.push(...this.recommendSectionCompletion(dismissedIds, negativeFeedbackIds));

    // Filter out dismissed and negatively-received recommendations, and deduplicate by ID
    const seenRecIds = new Set<string>();
    const filtered = allRecs.filter(r => {
      if (dismissedIds.has(r.id) || negativeFeedbackIds.has(r.id)) return false;
      if (seenRecIds.has(r.id)) return false;
      seenRecIds.add(r.id);
      return true;
    });

    // Sort by priority and confidence
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    // Limit total recommendations
    const limited = filtered.slice(0, 15);

    // Save to storage
    for (const rec of limited) {
      addRecommendation(rec);
    }

    return limited;
  }

  // ─── Theme Recommendations ───────────────────────────────────────────────

  private recommendThemes(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const { preferredThemes, behaviorProfile, interests } = this.userProfile;
    const currentTemplate = this.portfolioData?.templateId;

    // Analyze theme preferences based on interests
    const themeScores = this.scoreThemesByInterests();

    // Boost themes user has explicitly liked (resolved via getTemplate)
    for (const themeId of preferredThemes) {
      const theme = getTemplate(themeId);
      if (theme) themeScores[theme.id] = (themeScores[theme.id] || 0) + 20;
    }

    // Consider visual complexity preference
    const complexityPref = behaviorProfile.visualComplexityPreference;
    for (const theme of TEMPLATES) {
      const themeComplexity = this.getThemeComplexity(theme);
      if (themeComplexity === complexityPref) {
        themeScores[theme.id] = (themeScores[theme.id] || 0) + 10;
      }
    }

    // Consider color scheme preference
    const colorPref = behaviorProfile.colorSchemePreference;
    for (const theme of TEMPLATES) {
      const isDark = theme.defaultTheme.darkMode;
      if ((colorPref === 'dark' && isDark) || (colorPref === 'light' && !isDark) || colorPref === 'mixed') {
        themeScores[theme.id] = (themeScores[theme.id] || 0) + 5;
      }
    }

    // Get top recommendations
    const sortedThemes = Object.entries(themeScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [themeId, score] of sortedThemes) {
      const theme = getTemplate(themeId);
      if (!theme || theme.id === currentTemplate) continue;
      const recId = `rec-theme-${theme.id}`;
      if (dismissedIds.has(recId) || dismissedIds.has(theme.id) || negativeFeedbackIds.has(recId) || negativeFeedbackIds.has(theme.id)) continue;

      const confidence = Math.min(score / 100, 0.95);
      if (confidence < 0.3) continue;

      recs.push(this.createRecommendation({
        id: recId,
        type: 'theme',
        title: `Try "${theme.name}" Theme`,
        description: `${theme.description} This theme matches your ${this.getThemeMatchReason(theme, interests)}.`,
        reasoning: `Based on your interests in ${this.getTopInterests(interests).join(', ') || 'software development'} and preference for ${behaviorProfile.visualComplexityPreference} complexity themes.`,
        confidence,
        priority: confidence > 0.7 ? 'high' : 'medium',
        action: {
          type: 'apply-template',
          payload: { templateId: theme.id },
          label: 'Preview Theme',
        },
        metadata: {
          source: 'content-based',
          factors: this.getThemeFactors(theme, themeScores[theme.id] || score, interests),
          context: this.context,
        },
      }));
    }

    return recs;
  }

  private scoreThemesByInterests(): Record<string, number> {
    const scores: Record<string, number> = {};
    const { domains, technologies, roles } = this.userProfile.interests;

    // Theme to interest mapping using canonical template IDs (plus legacy aliases)
    const themeInterestMap: Record<string, { domains: string[]; technologies: string[]; roles: string[] }> = {
      'spider-verse': { domains: ['web-dev', 'creative'], technologies: ['react', 'animation'], roles: ['frontend-dev', 'creative-dev'] },
      'gotham-noir': { domains: ['web-dev', 'security'], technologies: ['typescript', 'testing'], roles: ['fullstack', 'security-engineer'] },
      'arc-reactor': { domains: ['web-dev', 'devops', 'embedded'], technologies: ['typescript', 'rust', 'electronics'], roles: ['fullstack', 'embedded-engineer'] },
      'mystic-dimension': { domains: ['creative', 'web-dev'], technologies: ['react', 'canvas', 'animation'], roles: ['creative-dev', 'frontend-dev'] },
      'night-city': { domains: ['web-dev', 'devops', 'ai-ml'], technologies: ['react', 'node.js', 'docker'], roles: ['fullstack', 'devops-engineer'] },
      'cyberpunk': { domains: ['web-dev', 'devops', 'ai-ml'], technologies: ['react', 'node.js', 'docker'], roles: ['fullstack', 'devops-engineer'] },
      'digital-grid': { domains: ['web-dev', 'design'], technologies: ['react', 'css', 'tailwind'], roles: ['frontend-dev', 'ui-developer'] },
      'bento': { domains: ['web-dev', 'design'], technologies: ['react', 'css', 'tailwind'], roles: ['frontend-dev', 'ui-developer'] },
      'code-reality': { domains: ['devops', 'backend'], technologies: ['bash', 'linux', 'cli'], roles: ['devops-engineer', 'backend-dev', 'cli-developer'] },
      'terminal': { domains: ['devops', 'backend'], technologies: ['bash', 'linux', 'cli'], roles: ['devops-engineer', 'backend-dev', 'cli-developer'] },
      'desert-dynasty': { domains: ['web-dev', 'content'], technologies: ['react', 'markdown'], roles: ['fullstack', 'content-developer'] },
      'brickverse': { domains: ['creative', 'gaming'], technologies: ['unity', 'godot'], roles: ['game-dev', 'creative-dev'] },
      'blocklands': { domains: ['gaming', 'web-dev'], technologies: ['pixel-art', 'typescript', 'game-dev'], roles: ['game-dev', 'frontend-dev'] },
      'retro-rpg': { domains: ['gaming', 'web-dev'], technologies: ['pixel-art', 'typescript', 'game-dev'], roles: ['game-dev', 'frontend-dev'] },
      'comic-pop': { domains: ['creative', 'design'], technologies: ['illustration', 'animation'], roles: ['designer', 'creative-dev'] },
      'anime-dimension': { domains: ['creative', 'animation'], technologies: ['after-effects', 'lottie'], roles: ['motion-designer', 'animator'] },
      'vice-city': { domains: ['gaming', 'creative'], technologies: ['unity', 'pixel-art'], roles: ['game-dev', 'creative-dev'] },
      'assassin': { domains: ['security', 'history'], technologies: ['cryptography', 'rust'], roles: ['security-engineer', 'backend-dev'] },
      'galactic-frontier': { domains: ['ai-ml', 'space-tech'], technologies: ['python', 'tensorflow', 'ros'], roles: ['ml-engineer', 'robotics-engineer'] },
      'neon-nomad': { domains: ['creative', 'design', 'web-dev'], technologies: ['react', 'animation', 'canvas'], roles: ['creative-dev', 'frontend-dev'] },
      'creative-studio': { domains: ['creative', 'design', 'web-dev'], technologies: ['react', 'animation', 'canvas'], roles: ['creative-dev', 'frontend-dev'] },
      'orbital-academy': { domains: ['education', 'ai-ml'], technologies: ['python', 'jupyter'], roles: ['educator', 'researcher'] },
      'frostbyte': { domains: ['web-dev', 'design'], technologies: ['react', 'css', 'glassmorphism'], roles: ['frontend-dev', 'ui-developer'] },
      'solar-forge': { domains: ['hardware', 'iot', 'web-dev'], technologies: ['arduino', 'raspberry-pi', 'mqtt'], roles: ['iot-engineer', 'hardware-engineer'] },
      'deep-sea-explorer': { domains: ['data-science', 'research'], technologies: ['python', 'sql', 'visualization'], roles: ['data-analyst', 'researcher'] },
      'timekeeper': { domains: ['productivity', 'web-dev'], technologies: ['react', 'scheduling'], roles: ['product-manager', 'fullstack'] },
      'dreamscape': { domains: ['creative', 'design'], technologies: ['figma', 'illustration'], roles: ['designer', 'creative-dev'] },
      'wasteland-survivor': { domains: ['devops', 'security'], technologies: ['linux', 'bash', 'infrastructure'], roles: ['devops-engineer', 'sre'] },
      'celestial-library': { domains: ['content', 'design'], technologies: ['typography', 'css'], roles: ['content-developer', 'designer'] },
      'editorial': { domains: ['content', 'design'], technologies: ['typography', 'css'], roles: ['content-developer', 'designer'] },
      'mecha-workshop': { domains: ['robotics', 'embedded', 'hardware'], technologies: ['ros', 'c++', 'python'], roles: ['robotics-engineer', 'embedded-engineer'] },
      'kingdom-of-ink': { domains: ['content', 'design', 'history'], technologies: ['markdown', 'typography'], roles: ['technical-writer', 'content-developer'] },
      'quantum-lab': { domains: ['data-science', 'ai-ml', 'quantum'], technologies: ['python', 'pandas', 'tensorflow'], roles: ['data-scientist', 'ml-engineer'] },
      'data-scientist': { domains: ['data-science', 'ai-ml'], technologies: ['python', 'pandas', 'tensorflow'], roles: ['data-scientist', 'ml-engineer'] },
      'cloud-kingdom': { domains: ['cloud', 'devops', 'web-dev'], technologies: ['aws', 'azure', 'kubernetes'], roles: ['cloud-engineer', 'devops-engineer'] },
      'shadow-protocol': { domains: ['security', 'devops'], technologies: ['rust', 'go', 'cryptography'], roles: ['security-engineer', 'backend-dev'] },
      'infinite-museum': { domains: ['design', 'art', 'web-dev'], technologies: ['css', 'typography', 'layout'], roles: ['designer', 'frontend-dev'] },
      'minimalist': { domains: ['web-dev', 'design'], technologies: ['react', 'css'], roles: ['frontend-dev', 'ui-developer'] },
    };

    // Extract technologies and roles directly from portfolioData so recommendations
    // work accurately even when analytics/behavioral tracking is disabled by default
    const portfolioSkills = (this.portfolioData?.skills || []).map(s => s.name.toLowerCase());
    const portfolioTechs = new Set<string>(portfolioSkills);
    for (const p of this.portfolioData?.projects || []) {
      for (const t of p.techStack || []) {
        portfolioTechs.add(t.toLowerCase());
      }
    }
    const roleString = (this.portfolioData?.personal?.title || '').toLowerCase();

    for (const theme of TEMPLATES) {
      const mapping = themeInterestMap[theme.id] || { domains: [], technologies: [], roles: [] };
      let score = 35; // Baseline score to ensure recommendations work on any valid profile

      // Domain matching from profile interests
      for (const domain of domains) {
        if (mapping.domains.includes(domain.domain)) {
          score += domain.score * 0.3;
        }
      }

      // Technology matching from profile interests
      for (const tech of technologies) {
        if (mapping.technologies.includes(tech.technology.toLowerCase())) {
          score += tech.score * 0.4;
        }
      }

      // Technology matching directly from portfolio skills & projects
      for (const tech of mapping.technologies) {
        if (portfolioTechs.has(tech)) {
          score += 25;
        }
      }

      // Role matching from profile interests & portfolio title
      for (const role of roles) {
        if (mapping.roles.includes(role.role)) {
          score += role.score * 0.3;
        }
      }
      for (const role of mapping.roles) {
        if (roleString.includes(role.replace('-', ' ')) || roleString.includes(role.split('-')[0])) {
          score += 20;
        }
      }

      scores[theme.id] = score;
    }

    return scores;
  }

  private getThemeComplexity(theme: typeof TEMPLATES[0]): 'low' | 'medium' | 'high' {
    const motionMap: Record<string, 'low' | 'medium' | 'high'> = { low: 'low', medium: 'medium', high: 'high' };
    return motionMap[theme.motionLevel] || 'medium';
  }

  private getThemeMatchReason(theme: typeof TEMPLATES[0], interests: UserProfile['interests']): string {
    const reasons: string[] = [];
    const topDomains = interests.domains.slice(0, 2).map(d => d.domain);
    const topTechs = interests.technologies.slice(0, 2).map(t => t.technology);
    
    if (topDomains.length > 0) reasons.push(`interest in ${topDomains.join(' & ')}`);
    if (topTechs.length > 0) reasons.push(`work with ${topTechs.join(' & ')}`);
    
    return reasons.length > 0 ? reasons.join(' and ') : 'your profile';
  }

  private getTopInterests(interests: UserProfile['interests']): string[] {
    return [
      ...interests.domains.slice(0, 2).map(d => d.domain),
      ...interests.technologies.slice(0, 2).map(t => t.technology),
    ];
  }

  private getThemeFactors(theme: typeof TEMPLATES[0], score: number, interests: UserProfile['interests']): RecommendationFactor[] {
    const factors: RecommendationFactor[] = [];
    
    factors.push({
      factor: 'interest_alignment',
      weight: 0.4,
      value: score,
      explanation: `Theme aligns with your stated interests and technology preferences`,
    });

    factors.push({
      factor: 'visual_preference_match',
      weight: 0.2,
      value: this.userProfile.behaviorProfile.visualComplexityPreference,
      explanation: `Matches your preferred visual complexity level`,
    });

    if (this.userProfile.preferredThemes.includes(theme.id)) {
      factors.push({
        factor: 'explicit_preference',
        weight: 0.3,
        value: true,
        explanation: 'You have previously selected or liked this theme',
      });
    }

    return factors;
  }

  // ─── Skill Recommendations ───────────────────────────────────────────────

  private recommendSkills(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const { skills } = this.portfolioData || { skills: [] };
    const { interests, skillLevel, skillFocus, careerGoals } = this.userProfile;

    // Identify skill gaps based on interests and career goals
    const targetSkills = this.getTargetSkills();
    const currentSkillNames = new Set(skills.map((s: any) => s.name.toLowerCase()));

    for (const target of targetSkills) {
      const skillId = `skill-${target.name.toLowerCase()}`;
      if (currentSkillNames.has(target.name.toLowerCase())) continue;
      if (dismissedIds.has(skillId) || negativeFeedbackIds.has(skillId)) continue;

      const confidence = this.calculateSkillConfidence(target, interests, careerGoals);
      if (confidence < 0.35) continue;

      recs.push(this.createRecommendation({
        type: 'skill',
        title: `Add "${target.name}" to Your Skills`,
        description: `${target.reason} This ${target.category} skill is valued in ${target.roles.join(', ')} roles.`,
        reasoning: `Based on your interest in ${target.domains.join(', ')} and goal to become a ${target.roles[0] || 'developer'}.`,
        confidence,
        priority: confidence > 0.7 ? 'high' : 'medium',
        action: {
          type: 'add-skill',
          payload: { skill: target },
          label: 'Add Skill',
        },
        metadata: {
          source: 'hybrid',
          factors: [
            { factor: 'career_relevance', weight: 0.4, value: target.roles, explanation: 'Directly relevant to your career goals' },
            { factor: 'interest_alignment', weight: 0.3, value: target.domains, explanation: 'Matches your stated interests' },
            { factor: 'market_demand', weight: 0.3, value: target.demand, explanation: 'High demand in current job market' },
          ],
          context: this.context,
        },
      }));
    }

    // Recommend leveling up existing skills
    for (const skill of skills) {
      const focus = skillFocus.find(f => f.skill.toLowerCase() === skill.name.toLowerCase());
      const skillId = `skill-${skill.name.toLowerCase()}`;
      if (focus && focus.targetLevel > skill.level) {
        if (dismissedIds.has(skillId) || negativeFeedbackIds.has(skillId)) continue;
        recs.push(this.createRecommendation({
          type: 'skill',
          title: `Level Up "${skill.name}"`,
          description: `You're at level ${skill.level}/5 but targeting level ${focus.targetLevel}. Consider advanced topics in ${skill.category}.`,
          reasoning: 'You set this as a focus skill with a higher target level.',
          confidence: 0.8,
          priority: 'high',
          action: {
            type: 'open-modal',
            payload: { action: 'edit-skill', skillId: skill.id },
            label: 'Update Level',
          },
          metadata: {
            source: 'rule-based',
            factors: [
              { factor: 'user_target', weight: 1.0, value: { current: skill.level, target: focus.targetLevel }, explanation: 'You set a higher target level for this skill' },
            ],
            context: this.context,
          },
        }));
      }
    }

    return recs.slice(0, 5);
  }

  private getTargetSkills(): Array<{
    name: string;
    category: string;
    reason: string;
    domains: string[];
    roles: string[];
    demand: 'high' | 'medium' | 'low';
  }> {
    const { domains, technologies, roles } = this.userProfile.interests;
    const targetRoles = this.userProfile.careerGoals
      .filter(g => g.status === 'active')
      .map(g => g.targetRole);

    const allRoles = [...new Set([...roles.map(r => r.role), ...targetRoles])];
    const allDomains = [...new Set([...domains.map(d => d.domain)])];

    // Skill recommendations based on role/domain
    const skillMap: Record<string, Array<{ name: string; category: string; reason: string; domains: string[]; roles: string[]; demand: 'high' | 'medium' | 'low' }>> = {
      'frontend-dev': [
        { name: 'TypeScript', category: 'Frontend', reason: 'Essential for modern frontend development', domains: ['web-dev'], roles: ['frontend-dev', 'fullstack'], demand: 'high' },
        { name: 'React', category: 'Frontend', reason: 'Most popular frontend framework', domains: ['web-dev'], roles: ['frontend-dev', 'fullstack'], demand: 'high' },
        { name: 'Next.js', category: 'Frontend', reason: 'Production-ready React framework', domains: ['web-dev'], roles: ['frontend-dev', 'fullstack'], demand: 'high' },
        { name: 'Tailwind CSS', category: 'Frontend', reason: 'Utility-first CSS framework', domains: ['web-dev', 'design'], roles: ['frontend-dev', 'ui-developer'], demand: 'high' },
        { name: 'Testing (Jest/Vitest)', category: 'Frontend', reason: 'Critical for production apps', domains: ['web-dev'], roles: ['frontend-dev', 'fullstack'], demand: 'high' },
        { name: 'State Management (Zustand/Redux)', category: 'Frontend', reason: 'Complex app state management', domains: ['web-dev'], roles: ['frontend-dev'], demand: 'medium' },
      ],
      'backend-dev': [
        { name: 'Node.js', category: 'Backend', reason: 'JavaScript runtime for backend', domains: ['web-dev'], roles: ['backend-dev', 'fullstack'], demand: 'high' },
        { name: 'PostgreSQL', category: 'Database', reason: 'Popular relational database', domains: ['web-dev', 'data'], roles: ['backend-dev', 'fullstack'], demand: 'high' },
        { name: 'Redis', category: 'Database', reason: 'Caching and session storage', domains: ['web-dev', 'devops'], roles: ['backend-dev', 'devops-engineer'], demand: 'medium' },
        { name: 'Docker', category: 'DevOps', reason: 'Containerization for deployment', domains: ['devops', 'web-dev'], roles: ['backend-dev', 'devops-engineer'], demand: 'high' },
        { name: 'GraphQL', category: 'API', reason: 'Flexible API query language', domains: ['web-dev'], roles: ['backend-dev', 'fullstack'], demand: 'medium' },
      ],
      'fullstack': [
        { name: 'TypeScript', category: 'Language', reason: 'Type safety across stack', domains: ['web-dev'], roles: ['fullstack'], demand: 'high' },
        { name: 'PostgreSQL', category: 'Database', reason: 'Relational data storage', domains: ['web-dev'], roles: ['fullstack'], demand: 'high' },
        { name: 'Docker', category: 'DevOps', reason: 'Containerization', domains: ['devops'], roles: ['fullstack', 'devops-engineer'], demand: 'high' },
        { name: 'CI/CD (GitHub Actions)', category: 'DevOps', reason: 'Automated deployment', domains: ['devops'], roles: ['fullstack'], demand: 'high' },
        { name: 'Authentication (NextAuth/Auth.js)', category: 'Backend', reason: 'User authentication', domains: ['web-dev'], roles: ['fullstack'], demand: 'high' },
      ],
      'data-scientist': [
        { name: 'Python', category: 'Language', reason: 'Primary language for data science', domains: ['data-science', 'ai-ml'], roles: ['data-scientist', 'ml-engineer'], demand: 'high' },
        { name: 'Pandas', category: 'Data', reason: 'Data manipulation and analysis', domains: ['data-science'], roles: ['data-scientist'], demand: 'high' },
        { name: 'SQL', category: 'Data', reason: 'Querying relational databases', domains: ['data-science', 'data'], roles: ['data-scientist', 'data-analyst'], demand: 'high' },
        { name: 'Scikit-learn', category: 'ML', reason: 'Classical machine learning', domains: ['ai-ml'], roles: ['data-scientist', 'ml-engineer'], demand: 'high' },
        { name: 'Data Visualization (Matplotlib/Plotly)', category: 'Data', reason: 'Communicating insights', domains: ['data-science'], roles: ['data-scientist', 'data-analyst'], demand: 'high' },
      ],
      'ml-engineer': [
        { name: 'Python', category: 'Language', reason: 'Primary ML language', domains: ['ai-ml'], roles: ['ml-engineer'], demand: 'high' },
        { name: 'PyTorch/TensorFlow', category: 'ML', reason: 'Deep learning frameworks', domains: ['ai-ml'], roles: ['ml-engineer'], demand: 'high' },
        { name: 'MLOps (MLflow/Kubeflow)', category: 'MLOps', reason: 'ML lifecycle management', domains: ['ai-ml', 'devops'], roles: ['ml-engineer'], demand: 'high' },
        { name: 'Docker/Kubernetes', category: 'DevOps', reason: 'Model deployment', domains: ['devops', 'ai-ml'], roles: ['ml-engineer', 'devops-engineer'], demand: 'high' },
        { name: 'Feature Stores', category: 'MLOps', reason: 'Feature management', domains: ['ai-ml'], roles: ['ml-engineer'], demand: 'medium' },
      ],
      'devops-engineer': [
        { name: 'Docker', category: 'DevOps', reason: 'Containerization', domains: ['devops'], roles: ['devops-engineer'], demand: 'high' },
        { name: 'Kubernetes', category: 'DevOps', reason: 'Container orchestration', domains: ['devops'], roles: ['devops-engineer'], demand: 'high' },
        { name: 'Terraform', category: 'DevOps', reason: 'Infrastructure as Code', domains: ['devops'], roles: ['devops-engineer'], demand: 'high' },
        { name: 'CI/CD Pipelines', category: 'DevOps', reason: 'Automated deployment', domains: ['devops'], roles: ['devops-engineer'], demand: 'high' },
        { name: 'Monitoring (Prometheus/Grafana)', category: 'DevOps', reason: 'Observability', domains: ['devops'], roles: ['devops-engineer', 'sre'], demand: 'high' },
      ],
      'security-engineer': [
        { name: 'Cryptography', category: 'Security', reason: 'Encryption and security protocols', domains: ['security'], roles: ['security-engineer'], demand: 'high' },
        { name: 'OWASP Top 10', category: 'Security', reason: 'Web vulnerability knowledge', domains: ['security', 'web-dev'], roles: ['security-engineer', 'fullstack'], demand: 'high' },
        { name: 'Penetration Testing', category: 'Security', reason: 'Offensive security skills', domains: ['security'], roles: ['security-engineer'], demand: 'medium' },
        { name: 'Cloud Security (AWS/Azure/GCP)', category: 'Security', reason: 'Securing cloud infrastructure', domains: ['security', 'cloud'], roles: ['security-engineer', 'cloud-engineer'], demand: 'high' },
      ],
    };

    const recommendations: Array<{ name: string; category: string; reason: string; domains: string[]; roles: string[]; demand: 'high' | 'medium' | 'low' }> = [];

    for (const role of allRoles) {
      const skills = skillMap[role] || [];
      for (const skill of skills) {
        if (allDomains.some(d => skill.domains.includes(d)) || allRoles.includes(role)) {
          recommendations.push({ ...skill, roles: [role] });
        }
      }
    }

    // Deduplicate by name
    const seen = new Set<string>();
    return recommendations.filter(s => {
      if (seen.has(s.name.toLowerCase())) return false;
      seen.add(s.name.toLowerCase());
      return true;
    });
  }

  private calculateSkillConfidence(
    target: { name: string; category: string; roles: string[]; domains: string[]; demand: string },
    interests: UserProfile['interests'],
    careerGoals: UserProfile['careerGoals']
  ): number {
    let confidence = 0.3; // Base

    // Domain alignment
    const domainOverlap = target.domains.filter(d => 
      interests.domains.some(i => i.domain === d)
    ).length;
    confidence += domainOverlap * 0.15;

    // Role alignment
    const activeGoals = careerGoals.filter(g => g.status === 'active');
    const roleOverlap = target.roles.filter(r => 
      activeGoals.some(g => g.targetRole === r)
    ).length;
    confidence += roleOverlap * 0.2;

    // Technology interest alignment
    const techOverlap = interests.technologies.filter(t => 
      t.technology.toLowerCase().includes(target.name.toLowerCase()) ||
      target.name.toLowerCase().includes(t.technology.toLowerCase())
    ).length;
    confidence += techOverlap * 0.1;

    // Market demand
    const demandBonus = target.demand === 'high' ? 0.15 : target.demand === 'medium' ? 0.1 : 0.05;
    confidence += demandBonus;

    // Skill level assessment
    const skillLevel = this.userProfile.skillLevel.overall;
    const levelMultiplier = skillLevel === 'beginner' ? 1.0 : skillLevel === 'intermediate' ? 0.9 : 0.8;
    confidence *= levelMultiplier;

    return Math.min(confidence, 0.95);
  }

  // ─── Project Recommendations ─────────────────────────────────────────────

  private recommendProjects(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const { projects, skills } = this.portfolioData || { projects: [], skills: [] };
    const { interests, careerGoals } = this.userProfile;

    if (projects.length >= 6) return recs; // Already has good project count

    const skillNames = new Set<string>(skills.map((s: any) => s.name.toLowerCase()));
    const currentProjectTitles = new Set((projects || []).map((p: any) => p.title.toLowerCase().trim()));
    const projectIdeas = this.generateProjectIdeas(skillNames, interests, careerGoals);

    for (const idea of projectIdeas) {
      if (currentProjectTitles.has(idea.title.toLowerCase().trim())) continue;
      const confidence = this.calculateProjectConfidence(idea, interests, careerGoals);
      if (confidence < 0.3) continue;

      const projectId = `project-${idea.title.toLowerCase().replace(/\s+/g, '-')}`;
      if (dismissedIds.has(projectId) || negativeFeedbackIds.has(projectId)) continue;

      recs.push(this.createRecommendation({
        type: 'project',
        title: `Build a ${idea.title}`,
        description: idea.description,
        reasoning: `Showcases your ${idea.skills.join(', ')} skills and aligns with ${idea.roles.join(', ')} roles.`,
        confidence,
        priority: confidence > 0.6 ? 'high' : 'medium',
        action: {
          type: 'create-project',
          payload: { project: idea },
          label: 'Add Project',
        },
        metadata: {
          source: 'hybrid',
          factors: [
            { factor: 'skill_showcase', weight: 0.4, value: idea.skills, explanation: 'Demonstrates your technical skills' },
            { factor: 'career_relevance', weight: 0.3, value: idea.roles, explanation: 'Relevant to your target roles' },
            { factor: 'portfolio_gap', weight: 0.3, value: projects.length, explanation: `You have ${projects.length} projects; more adds depth` },
          ],
          context: this.context,
        },
      }));
    }

    return recs;
  }

  private generateProjectIdeas(
    skillNames: Set<string>,
    interests: UserProfile['interests'],
    careerGoals: UserProfile['careerGoals']
  ): Array<{
    title: string;
    description: string;
    skills: string[];
    techStack: string[];
    roles: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }> {
    const ideas: Array<{
      title: string;
      description: string;
      skills: string[];
      techStack: string[];
      roles: string[];
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    }> = [];

    const hasReact = skillNames.has('react') || skillNames.has('next.js');
    const hasNode = skillNames.has('node.js') || skillNames.has('express');
    const hasPython = skillNames.has('python');
    const hasDocker = skillNames.has('docker');
    const hasPostgres = skillNames.has('postgresql') || skillNames.has('postgres');
    const hasTypeScript = skillNames.has('typescript');
    const hasTailwind = skillNames.has('tailwind css') || skillNames.has('tailwind');

    const targetRoles = careerGoals
      .filter(g => g.status === 'active')
      .map(g => g.targetRole);
    const allRoles = [...new Set([...interests.roles.map(r => r.role), ...targetRoles])];

    // Fullstack project ideas
    if (hasReact && hasNode) {
      ideas.push({
        title: 'SaaS Dashboard with Auth & Billing',
        description: 'Full-stack application with user authentication, subscription billing, and admin dashboard',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Authentication', 'Stripe API'],
        techStack: ['Next.js', 'TypeScript', 'Prisma', 'NextAuth', 'Stripe', 'Tailwind CSS'],
        roles: ['fullstack', 'frontend-dev', 'backend-dev'],
        difficulty: 'intermediate',
      });
      
      ideas.push({
        title: 'Real-time Collaboration Tool',
        description: 'Google Docs-like collaborative editor with presence indicators and comments',
        skills: ['React', 'WebSockets', 'Node.js', 'Real-time Sync', 'Conflict Resolution'],
        techStack: ['Next.js', 'Socket.io', 'TypeScript', 'PostgreSQL', 'Redis', 'Yjs'],
        roles: ['fullstack', 'frontend-dev'],
        difficulty: 'advanced',
      });
    }

    // Frontend-focused ideas
    if (hasReact) {
      ideas.push({
        title: 'Interactive Data Visualization Dashboard',
        description: 'Dashboard with charts, filters, and drill-down capabilities using real-world datasets',
        skills: ['React', 'D3.js/Chart.js', 'TypeScript', 'Data Processing', 'API Integration'],
        techStack: ['Next.js', 'Recharts/Visx', 'TypeScript', 'SWRTanStack Query', 'Tailwind CSS'],
        roles: ['frontend-dev', 'data-analyst', 'data-scientist'],
        difficulty: 'intermediate',
      });

      ideas.push({
        title: 'Component Library with Storybook',
        description: 'Reusable UI component library with documentation, testing, and design tokens',
        skills: ['React', 'TypeScript', 'Storybook', 'Testing', 'Design Systems', 'CSS-in-JS'],
        techStack: ['React', 'TypeScript', 'Storybook', 'Jest', 'Testing Library', 'Styled Components'],
        roles: ['frontend-dev', 'ui-developer'],
        difficulty: 'intermediate',
      });
    }

    // Backend/Data ideas
    if (hasNode || hasPython) {
      ideas.push({
        title: 'RESTful API with Comprehensive Documentation',
        description: 'Production-ready API with OpenAPI docs, rate limiting, caching, and monitoring',
        skills: ['API Design', 'Node.js/Python', 'PostgreSQL', 'Redis', 'OpenAPI/Swagger', 'Testing'],
        techStack: hasNode ? ['Fastify/Express', 'TypeScript', 'Prisma', 'Zod', 'Swagger UI'] : ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Alembic'],
        roles: ['backend-dev', 'fullstack', 'api-developer'],
        difficulty: 'intermediate',
      });
    }

    // Data Science ideas
    if (hasPython && (interests.domains.some(d => d.domain === 'data-science' || d.domain === 'ai-ml'))) {
      ideas.push({
        title: 'End-to-End ML Pipeline',
        description: 'Complete ML project from data ingestion to model deployment with monitoring',
        skills: ['Python', 'Pandas', 'Scikit-learn', 'MLflow', 'Docker', 'Model Deployment', 'Monitoring'],
        techStack: ['Python', 'FastAPI', 'MLflow', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
        roles: ['ml-engineer', 'data-scientist'],
        difficulty: 'advanced',
      });

      ideas.push({
        title: 'Interactive Data Analysis Notebook',
        description: 'Jupyter notebook with interactive widgets, visualizations, and executive summary',
        skills: ['Python', 'Pandas', 'Plotly/Seaborn', 'Jupyter', 'Statistical Analysis', 'Storytelling'],
        techStack: ['Jupyter', 'Pandas', 'Plotly', 'IPyWidgets', 'nbconvert'],
        roles: ['data-scientist', 'data-analyst'],
        difficulty: 'beginner',
      });
    }

    // DevOps/Cloud ideas
    if (hasDocker && (interests.domains.some(d => d.domain === 'devops' || d.domain === 'cloud'))) {
      ideas.push({
        title: 'Infrastructure as Code Portfolio',
        description: 'Terraform modules for AWS/GCP/Azure with CI/CD pipelines and monitoring',
        skills: ['Terraform', 'AWS/GCP/Azure', 'Kubernetes', 'CI/CD', 'Monitoring', 'GitOps'],
        techStack: ['Terraform', 'GitHub Actions/GitLab CI', 'ArgoCD', 'Prometheus', 'Grafana', 'Helm'],
        roles: ['devops-engineer', 'cloud-engineer', 'sre'],
        difficulty: 'advanced',
      });
    }

    // Creative/Portfolio ideas
    if (interests.domains.some(d => d.domain === 'creative' || d.domain === 'design')) {
      ideas.push({
        title: 'Interactive Portfolio with Custom Animations',
        description: 'Personal portfolio showcasing creative coding skills with WebGL/Canvas animations',
        skills: ['React', 'GSAP/Framer Motion', 'Canvas/WebGL', 'Three.js', 'Creative Coding', 'Performance Optimization'],
        techStack: ['Next.js', 'Three.js', 'GSAP', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        roles: ['creative-dev', 'frontend-dev', 'motion-designer'],
        difficulty: 'intermediate',
      });
    }

    // Filter by user's skill level
    const skillLevel = this.userProfile.skillLevel.overall;
    const difficultyOrder: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const userLevel = difficultyOrder[skillLevel] || 2;
    
    return ideas
      .filter(idea => difficultyOrder[idea.difficulty] <= userLevel + 1) // Allow one level stretch
      .sort((a, b) => {
        // Prioritize by role relevance
        const aRelevance = a.roles.filter(r => allRoles.includes(r)).length;
        const bRelevance = b.roles.filter(r => allRoles.includes(r)).length;
        return bRelevance - aRelevance;
      });
  }

  private calculateProjectConfidence(
    idea: { roles: string[]; skills: string[]; difficulty: string },
    interests: UserProfile['interests'],
    careerGoals: UserProfile['careerGoals']
  ): number {
    let confidence = 0.3;

    const targetRoles = careerGoals.filter(g => g.status === 'active').map(g => g.targetRole);
    const roleMatch = idea.roles.filter(r => targetRoles.includes(r) || interests.roles.some(i => i.role === r)).length;
    confidence += roleMatch * 0.15;

    const skillMatch = idea.skills.filter(s => 
      interests.technologies.some(t => t.technology.toLowerCase().includes(s.toLowerCase()))
    ).length;
    confidence += skillMatch * 0.1;

    const domainMatch = interests.domains.filter(d => 
      idea.roles.some(r => r.includes(d.domain) || d.domain.includes(r))
    ).length;
    confidence += domainMatch * 0.1;

    return Math.min(confidence, 0.9);
  }

  // ─── Learning Resource Recommendations ──────────────────────────────────

  private recommendLearningResources(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const { skillFocus, interests, skillLevel } = this.userProfile;
    const { skills } = this.portfolioData || { skills: [] };

    // Resources for focus skills
    for (const focus of skillFocus.slice(0, 3)) {
      const resourceId = `resource-${focus.skill.toLowerCase()}`;
      if (dismissedIds.has(resourceId) || negativeFeedbackIds.has(resourceId)) continue;
      
      const resources = this.getResourcesForSkill(focus.skill, focus.category, skillLevel.overall);
      
      for (const resource of resources.slice(0, 2)) {
        recs.push(this.createRecommendation({
          type: 'learning-resource',
          title: `Learn ${focus.skill}: ${resource.title}`,
          description: `${resource.description} (${resource.duration}, ${resource.cost}, ${resource.difficulty})`,
          reasoning: `You marked ${focus.skill} as a focus skill targeting level ${focus.targetLevel}.`,
          confidence: 0.75,
          priority: 'high',
          action: {
            type: 'open-resource',
            payload: { url: resource.url, title: resource.title },
            label: 'Start Learning',
          },
          metadata: {
            source: 'content-based',
            factors: [
              { factor: 'user_focus', weight: 0.5, value: focus.skill, explanation: 'You explicitly set this as a learning focus' },
              { factor: 'skill_gap', weight: 0.3, value: { current: focus.currentLevel, target: focus.targetLevel }, explanation: `Gap of ${focus.targetLevel - focus.currentLevel} levels` },
              { factor: 'resource_quality', weight: 0.2, value: resource.rating || 4.5, explanation: 'High-quality, verified resource' },
            ],
            context: this.context,
          },
        }));
      }
    }

    // Resources for missing key skills
    const missingKeySkills = this.getMissingKeySkills();
    for (const skill of missingKeySkills.slice(0, 2)) {
      const resources = this.getResourcesForSkill(skill.name, skill.category, skillLevel.overall);
      if (resources.length === 0) continue;

      const resource = resources[0];
      const resourceId = `resource-${skill.name.toLowerCase()}`;
      if (dismissedIds.has(resourceId) || negativeFeedbackIds.has(resourceId)) continue;
      
      recs.push(this.createRecommendation({
        type: 'learning-resource',
        title: `Learn ${skill.name}: ${resource.title}`,
        description: `${resource.description} - Essential for ${skill.roles.join(', ')} roles.`,
        reasoning: `${skill.name} is a key skill for your target roles but not in your profile.`,
        confidence: 0.65,
        priority: 'medium',
        action: {
          type: 'open-resource',
          payload: { url: resource.url, title: resource.title },
          label: 'View Resource',
        },
        metadata: {
          source: 'hybrid',
          factors: [
            { factor: 'career_requirement', weight: 0.5, value: skill.roles, explanation: 'Required for your target roles' },
            { factor: 'market_demand', weight: 0.3, value: skill.demand, explanation: 'High market demand' },
            { factor: 'resource_accessibility', weight: 0.2, value: resource.cost === 'free' ? 'free' : 'paid', explanation: resource.cost === 'free' ? 'Completely free resource' : 'Paid resource with high ROI' },
          ],
          context: this.context,
        },
      }));
    }

    return recs.slice(0, 4);
  }

  private getResourcesForSkill(skillName: string, category: string, userLevel: string): LearningResource[] {
    // Curated resource database (in production, this would come from an API)
    const resourceMap: Record<string, LearningResource[]> = {
      'TypeScript': [
        { id: 'ts-1', title: 'TypeScript Handbook', description: 'Official TypeScript documentation and guide', type: 'documentation', provider: 'TypeScript', url: 'https://www.typescriptlang.org/docs/', duration: 'Self-paced', difficulty: 'beginner', cost: 'free', rating: 4.8, skillsCovered: ['TypeScript'], lastVerified: '2024-01-15' },
        { id: 'ts-2', title: 'Effective TypeScript', description: '62 specific ways to improve your TypeScript', type: 'book', provider: 'Dan Vanderkam', url: 'https://effectivetypescript.com/', duration: '8-10 hours', difficulty: 'intermediate', cost: 'paid', rating: 4.9, skillsCovered: ['TypeScript'], lastVerified: '2024-01-15' },
        { id: 'ts-3', title: 'TypeScript Course', description: 'Complete TypeScript course from basics to advanced', type: 'course', provider: 'Frontend Masters', url: 'https://frontendmasters.com/courses/typescript/', duration: '6 hours', difficulty: 'intermediate', cost: 'paid', rating: 4.8, skillsCovered: ['TypeScript'], lastVerified: '2024-01-15' },
      ],
      'React': [
        { id: 'react-1', title: 'React Official Tutorial', description: 'Hands-on tutorial building a tic-tac-toe game', type: 'tutorial', provider: 'React', url: 'https://react.dev/learn/tutorial-tic-tac-toe', duration: '1-2 hours', difficulty: 'beginner', cost: 'free', rating: 4.7, skillsCovered: ['React'], lastVerified: '2024-01-15' },
        { id: 'react-2', title: 'Advanced React Patterns', description: 'Compound components, render props, hooks patterns', type: 'course', provider: 'Kent C. Dodds', url: 'https://kentcdodds.com/advanced-react-patterns/', duration: '4 hours', difficulty: 'advanced', cost: 'paid', rating: 4.9, skillsCovered: ['React'], lastVerified: '2024-01-15' },
        { id: 'react-3', title: 'React Performance', description: 'Optimizing React applications for production', type: 'course', provider: 'Frontend Masters', url: 'https://frontendmasters.com/courses/react-performance/', duration: '5 hours', difficulty: 'advanced', cost: 'paid', rating: 4.8, skillsCovered: ['React', 'Performance'], lastVerified: '2024-01-15' },
      ],
      'Next.js': [
        { id: 'next-1', title: 'Next.js Official Learn Course', description: 'Build a full-stack Next.js application from scratch', type: 'course', provider: 'Vercel', url: 'https://nextjs.org/learn', duration: '4-6 hours', difficulty: 'beginner', cost: 'free', rating: 4.8, skillsCovered: ['Next.js', 'React', 'Fullstack'], lastVerified: '2024-01-15' },
        { id: 'next-2', title: 'Next.js 14+ Advanced Patterns', description: 'Server Components, Server Actions, Streaming', type: 'course', provider: 'Frontend Masters', url: 'https://frontendmasters.com/courses/next-js/', duration: '6 hours', difficulty: 'advanced', cost: 'paid', rating: 4.9, skillsCovered: ['Next.js', 'React'], lastVerified: '2024-01-15' },
      ],
      'Python': [
        { id: 'py-1', title: 'Python Official Tutorial', description: 'Comprehensive introduction to Python', type: 'documentation', provider: 'Python Software Foundation', url: 'https://docs.python.org/3/tutorial/', duration: 'Self-paced', difficulty: 'beginner', cost: 'free', rating: 4.7, skillsCovered: ['Python'], lastVerified: '2024-01-15' },
        { id: 'py-2', title: 'Effective Python', description: '90 specific ways to write better Python', type: 'book', provider: 'Brett Slatkin', url: 'https://effectivepython.com/', duration: '10-12 hours', difficulty: 'intermediate', cost: 'paid', rating: 4.8, skillsCovered: ['Python'], lastVerified: '2024-01-15' },
      ],
      'Docker': [
        { id: 'docker-1', title: 'Docker Official Getting Started', description: 'Learn Docker by building and deploying containers', type: 'tutorial', provider: 'Docker', url: 'https://docs.docker.com/get-started/', duration: '2-3 hours', difficulty: 'beginner', cost: 'free', rating: 4.6, skillsCovered: ['Docker', 'Containers'], lastVerified: '2024-01-15' },
        { id: 'docker-2', title: 'Docker Deep Dive', description: 'Comprehensive Docker and container orchestration', type: 'book', provider: 'Nigel Poulton', url: 'https://www.dockerdive.com/', duration: '15 hours', difficulty: 'intermediate', cost: 'paid', rating: 4.7, skillsCovered: ['Docker', 'Kubernetes'], lastVerified: '2024-01-15' },
      ],
      'Kubernetes': [
        { id: 'k8s-1', title: 'Kubernetes Basics', description: 'Official Kubernetes tutorials', type: 'tutorial', provider: 'Kubernetes', url: 'https://kubernetes.io/docs/tutorials/', duration: '4-6 hours', difficulty: 'beginner', cost: 'free', rating: 4.5, skillsCovered: ['Kubernetes', 'Containers'], lastVerified: '2024-01-15' },
        { id: 'k8s-2', title: 'Certified Kubernetes Administrator (CKA)', description: 'Complete CKA exam preparation', type: 'course', provider: 'Linux Foundation', url: 'https://training.linuxfoundation.org/training/cka/', duration: '20-30 hours', difficulty: 'advanced', cost: 'paid', rating: 4.8, skillsCovered: ['Kubernetes', 'DevOps'], certificate: true, lastVerified: '2024-01-15' },
      ],
      'PostgreSQL': [
        { id: 'pg-1', title: 'PostgreSQL Tutorial', description: 'Official PostgreSQL documentation and tutorials', type: 'documentation', provider: 'PostgreSQL', url: 'https://www.postgresql.org/docs/current/tutorial.html', duration: 'Self-paced', difficulty: 'beginner', cost: 'free', rating: 4.6, skillsCovered: ['PostgreSQL', 'SQL'], lastVerified: '2024-01-15' },
        { id: 'pg-2', title: 'SQL for Data Analysis', description: 'Advanced SQL for analytics and reporting', type: 'course', provider: 'Mode Analytics', url: 'https://mode.com/sql-tutorial/', duration: '6-8 hours', difficulty: 'intermediate', cost: 'free', rating: 4.8, skillsCovered: ['PostgreSQL', 'SQL', 'Analytics'], lastVerified: '2024-01-15' },
      ],
      'AWS': [
        { id: 'aws-1', title: 'AWS Cloud Practitioner Essentials', description: 'Fundamental AWS cloud concepts', type: 'course', provider: 'AWS', url: 'https://aws.amazon.com/training/digital/cloud-practitioner-essentials/', duration: '6 hours', difficulty: 'beginner', cost: 'free', rating: 4.5, skillsCovered: ['AWS', 'Cloud'], lastVerified: '2024-01-15' },
        { id: 'aws-2', title: 'AWS Solutions Architect Associate', description: 'Certification preparation for SAA-C03', type: 'course', provider: 'A Cloud Guru / AWS Skill Builder', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', duration: '30-40 hours', difficulty: 'intermediate', cost: 'paid', rating: 4.8, skillsCovered: ['AWS', 'Architecture', 'Cloud'], certificate: true, lastVerified: '2024-01-15' },
      ],
      'Tailwind CSS': [
        { id: 'tw-1', title: 'Tailwind CSS Official Docs', description: 'Complete reference and examples', type: 'documentation', provider: 'Tailwind Labs', url: 'https://tailwindcss.com/docs', duration: 'Self-paced', difficulty: 'beginner', cost: 'free', rating: 4.7, skillsCovered: ['Tailwind CSS', 'CSS'], lastVerified: '2024-01-15' },
        { id: 'tw-2', title: 'Tailwind CSS From Scratch', description: 'Build modern responsive websites', type: 'course', provider: 'Traversy Media', url: 'https://www.udemy.com/course/tailwind-css-from-scratch/', duration: '4 hours', difficulty: 'beginner', cost: 'paid', rating: 4.7, skillsCovered: ['Tailwind CSS', 'CSS'], lastVerified: '2024-01-15' },
      ],
      'Testing (Jest/Vitest)': [
        { id: 'test-1', title: 'Testing React with Vitest', description: 'Modern testing with Vitest and React Testing Library', type: 'course', provider: 'Frontend Masters', url: 'https://frontendmasters.com/courses/testing-react/', duration: '5 hours', difficulty: 'intermediate', cost: 'paid', rating: 4.8, skillsCovered: ['Testing', 'Vitest', 'React Testing Library'], lastVerified: '2024-01-15' },
        { id: 'test-2', title: 'Jest Official Documentation', description: 'Complete Jest testing framework guide', type: 'documentation', provider: 'Jest', url: 'https://jestjs.io/docs/getting-started', duration: 'Self-paced', difficulty: 'beginner', cost: 'free', rating: 4.6, skillsCovered: ['Jest', 'Testing'], lastVerified: '2024-01-15' },
      ],
    };

    const resources = resourceMap[skillName] || [];
    
    // Filter by user level
    const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    const userLevelNum = levelOrder[userLevel as keyof typeof levelOrder] || 2;
    
    return resources
      .filter(r => levelOrder[r.difficulty] <= userLevelNum + 1)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  private getMissingKeySkills(): Array<{ name: string; category: string; roles: string[]; demand: 'high' | 'medium' | 'low' }> {
    const { skills } = this.portfolioData || { skills: [] };
    const currentSkills = new Set(skills.map((s: any) => s.name.toLowerCase()));
    const targetRoles = this.userProfile.careerGoals
      .filter(g => g.status === 'active')
      .map(g => g.targetRole);

    const keySkillsByRole: Record<string, Array<{ name: string; category: string; demand: 'high' | 'medium' | 'low' }>> = {
      'fullstack': [
        { name: 'TypeScript', category: 'Language', demand: 'high' },
        { name: 'PostgreSQL', category: 'Database', demand: 'high' },
        { name: 'Docker', category: 'DevOps', demand: 'high' },
        { name: 'Testing (Jest/Vitest)', category: 'Testing', demand: 'high' },
        { name: 'CI/CD (GitHub Actions)', category: 'DevOps', demand: 'high' },
      ],
      'frontend-dev': [
        { name: 'TypeScript', category: 'Language', demand: 'high' },
        { name: 'React', category: 'Frontend', demand: 'high' },
        { name: 'Next.js', category: 'Frontend', demand: 'high' },
        { name: 'Tailwind CSS', category: 'Frontend', demand: 'high' },
        { name: 'Testing (Jest/Vitest)', category: 'Testing', demand: 'high' },
      ],
      'backend-dev': [
        { name: 'Node.js', category: 'Backend', demand: 'high' },
        { name: 'PostgreSQL', category: 'Database', demand: 'high' },
        { name: 'Docker', category: 'DevOps', demand: 'high' },
        { name: 'Redis', category: 'Database', demand: 'medium' },
        { name: 'GraphQL', category: 'API', demand: 'medium' },
      ],
      'data-scientist': [
        { name: 'Python', category: 'Language', demand: 'high' },
        { name: 'Pandas', category: 'Data', demand: 'high' },
        { name: 'SQL', category: 'Data', demand: 'high' },
        { name: 'Scikit-learn', category: 'ML', demand: 'high' },
        { name: 'Data Visualization', category: 'Data', demand: 'high' },
      ],
      'ml-engineer': [
        { name: 'Python', category: 'Language', demand: 'high' },
        { name: 'PyTorch/TensorFlow', category: 'ML', demand: 'high' },
        { name: 'MLOps (MLflow/Kubeflow)', category: 'MLOps', demand: 'high' },
        { name: 'Docker/Kubernetes', category: 'DevOps', demand: 'high' },
        { name: 'Feature Stores', category: 'MLOps', demand: 'medium' },
      ],
      'devops-engineer': [
        { name: 'Docker', category: 'DevOps', demand: 'high' },
        { name: 'Kubernetes', category: 'DevOps', demand: 'high' },
        { name: 'Terraform', category: 'DevOps', demand: 'high' },
        { name: 'CI/CD Pipelines', category: 'DevOps', demand: 'high' },
        { name: 'Monitoring (Prometheus/Grafana)', category: 'DevOps', demand: 'high' },
      ],
    };

    const missing: Array<{ name: string; category: string; roles: string[]; demand: 'high' | 'medium' | 'low' }> = [];

    for (const role of targetRoles) {
      const keySkills = keySkillsByRole[role] || [];
      for (const skill of keySkills) {
        if (!currentSkills.has(skill.name.toLowerCase())) {
          const existing = missing.find(m => m.name.toLowerCase() === skill.name.toLowerCase());
          if (existing) {
            existing.roles.push(role);
          } else {
            missing.push({ ...skill, roles: [role] });
          }
        }
      }
    }

    return missing.sort((a, b) => {
      const demandOrder = { high: 3, medium: 2, low: 1 };
      return demandOrder[b.demand] - demandOrder[a.demand];
    });
  }

  // ─── Career Path Recommendations ─────────────────────────────────────────

  private recommendCareerPaths(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const { careerGoals, interests, skillLevel } = this.userProfile;
    const { skills, projects, experience } = this.portfolioData || { skills: [], projects: [], experience: [] };

    // If no active career goals, suggest setting one
    const activeGoals = careerGoals.filter(g => g.status === 'active');
    if (activeGoals.length === 0) {
      const suggestedRoles = this.getSuggestedRoles(interests, skills, experience);
      
      for (const role of suggestedRoles.slice(0, 2)) {
        const careerId = `career-${role.role}`;
        if (dismissedIds.has(careerId) || negativeFeedbackIds.has(careerId)) continue;
        
        recs.push(this.createRecommendation({
          type: 'career-path',
          title: `Consider ${role.title} Career Path`,
          description: role.description,
          reasoning: `Based on your skills in ${role.matchingSkills.join(', ')} and interest in ${role.domains.join(', ')}.`,
          confidence: role.confidence,
          priority: 'high',
          action: {
            type: 'open-modal',
            payload: { action: 'create-career-goal', role: role.role },
            label: 'Set as Goal',
          },
          metadata: {
            source: 'hybrid',
            factors: [
              { factor: 'skill_match', weight: 0.4, value: role.matchingSkills, explanation: 'Your skills align well with this role' },
              { factor: 'interest_alignment', weight: 0.3, value: role.domains, explanation: 'Matches your stated interests' },
              { factor: 'experience_relevance', weight: 0.3, value: role.experienceMatch, explanation: 'Your experience is relevant' },
            ],
            context: this.context,
          },
        }));
      }
      return recs;
    }

    // For each active goal, recommend next steps
    for (const goal of activeGoals.slice(0, 2)) {
      const nextSteps = this.getCareerNextSteps(goal, skills, projects, experience);
      
      for (const step of nextSteps.slice(0, 2)) {
        const stepId = `career-step-${goal.targetRole}-${step.title.toLowerCase().replace(/\s+/g, '-')}`;
        if (dismissedIds.has(stepId) || negativeFeedbackIds.has(stepId)) continue;
        
        recs.push(this.createRecommendation({
          type: 'career-path',
          title: step.title,
          description: step.description,
          reasoning: `Next step toward your goal of becoming a ${goal.targetRole}.`,
          confidence: step.confidence,
          priority: step.priority,
          action: step.action,
          metadata: {
            source: 'rule-based',
            factors: step.factors,
            context: this.context,
          },
        }));
      }
    }

    return recs;
  }

  private getSuggestedRoles(
    interests: UserProfile['interests'],
    skills: Skill[],
    experience: Experience[]
  ): Array<{
    role: string;
    title: string;
    description: string;
    domains: string[];
    matchingSkills: string[];
    experienceMatch: string;
    confidence: number;
  }> {
    const skillNames = new Set(skills.map(s => s.name.toLowerCase()));
    const expRoles = new Set(experience.map(e => e.position.toLowerCase()));
    const topDomains = interests.domains.slice(0, 3).map(d => d.domain);
    const topTechs = interests.technologies.slice(0, 5).map(t => t.technology.toLowerCase());

    const roleDefinitions = [
      {
        role: 'fullstack',
        title: 'Full Stack Developer',
        description: 'Build complete web applications from frontend to backend',
        requiredSkills: ['javascript', 'typescript', 'react', 'node.js', 'postgresql', 'docker'],
        domains: ['web-dev'],
        experienceKeywords: ['fullstack', 'full stack', 'frontend', 'backend'],
      },
      {
        role: 'frontend-dev',
        title: 'Frontend Developer',
        description: 'Create beautiful, interactive user interfaces',
        requiredSkills: ['javascript', 'typescript', 'react', 'css', 'tailwind', 'next.js'],
        domains: ['web-dev', 'design'],
        experienceKeywords: ['frontend', 'ui', 'react', 'vue'],
      },
      {
        role: 'backend-dev',
        title: 'Backend Developer',
        description: 'Build scalable server-side systems and APIs',
        requiredSkills: ['node.js', 'python', 'postgresql', 'redis', 'docker', 'api'],
        domains: ['web-dev', 'devops'],
        experienceKeywords: ['backend', 'api', 'server', 'database'],
      },
      {
        role: 'data-scientist',
        title: 'Data Scientist',
        description: 'Extract insights from data using statistical analysis and ML',
        requiredSkills: ['python', 'pandas', 'sql', 'scikit-learn', 'visualization', 'statistics'],
        domains: ['data-science', 'ai-ml'],
        experienceKeywords: ['data', 'analytics', 'analysis', 'research'],
      },
      {
        role: 'ml-engineer',
        title: 'Machine Learning Engineer',
        description: 'Productionize ML models and build ML infrastructure',
        requiredSkills: ['python', 'pytorch', 'tensorflow', 'mlops', 'docker', 'kubernetes'],
        domains: ['ai-ml', 'devops'],
        experienceKeywords: ['machine learning', 'ml', 'ai', 'model'],
      },
      {
        role: 'devops-engineer',
        title: 'DevOps Engineer',
        description: 'Automate infrastructure, deployment, and monitoring',
        requiredSkills: ['docker', 'kubernetes', 'terraform', 'ci/cd', 'aws', 'monitoring'],
        domains: ['devops', 'cloud'],
        experienceKeywords: ['devops', 'infrastructure', 'deployment', 'cloud'],
      },
    ];

    return roleDefinitions
      .map(role => {
        const matchingSkills = role.requiredSkills.filter(s => skillNames.has(s.toLowerCase()));
        const domainMatch = role.domains.filter(d => topDomains.includes(d)).length;
        const techMatch = role.requiredSkills.filter(s => topTechs.includes(s.toLowerCase())).length;
        const expMatch = role.experienceKeywords.some(k => 
          Array.from(expRoles).some(e => e.includes(k))
        );

        const confidence = 
          (matchingSkills.length / role.requiredSkills.length) * 0.5 +
          (domainMatch / Math.max(role.domains.length, 1)) * 0.2 +
          (techMatch / role.requiredSkills.length) * 0.2 +
          (expMatch ? 0.1 : 0);

        return {
          ...role,
          matchingSkills: matchingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
          experienceMatch: expMatch ? 'Relevant experience found' : 'Limited direct experience',
          confidence: Math.min(confidence, 0.9),
        };
      })
      .filter(r => r.confidence > 0.25)
      .sort((a, b) => b.confidence - a.confidence);
  }

  private getCareerNextSteps(
    goal: UserProfile['careerGoals'][0],
    skills: Skill[],
    projects: Project[],
    experience: Experience[]
  ): Array<{
    title: string;
    description: string;
    confidence: number;
    priority: 'high' | 'medium' | 'low';
    action: RecommendationAction;
    factors: RecommendationFactor[];
  }> {
    const steps: Array<{
      title: string;
      description: string;
      confidence: number;
      priority: 'high' | 'medium' | 'low';
      action: RecommendationAction;
      factors: RecommendationFactor[];
    }> = [];

    const skillNames = new Set(skills.map(s => s.name.toLowerCase()));
    const projectCount = projects.length;

    // Skill gaps for target role
    const roleSkillMap: Record<string, string[]> = {
      'fullstack': ['typescript', 'postgresql', 'docker', 'testing', 'ci/cd'],
      'frontend-dev': ['typescript', 'react', 'next.js', 'tailwind css', 'testing'],
      'backend-dev': ['node.js', 'postgresql', 'redis', 'docker', 'graphql'],
      'data-scientist': ['python', 'pandas', 'sql', 'scikit-learn', 'visualization'],
      'ml-engineer': ['python', 'pytorch', 'mlops', 'docker', 'kubernetes'],
      'devops-engineer': ['docker', 'kubernetes', 'terraform', 'ci/cd', 'monitoring'],
    };

    const requiredSkills = roleSkillMap[goal.targetRole] || [];
    const missingSkills = requiredSkills.filter(s => !skillNames.has(s.toLowerCase()));

    if (missingSkills.length > 0) {
      steps.push({
        title: `Learn ${missingSkills[0].charAt(0).toUpperCase() + missingSkills[0].slice(1)}`,
        description: `Essential skill for ${goal.targetRole} roles. ${missingSkills.length - 1} more key skills to acquire.`,
        confidence: 0.85,
        priority: 'high',
        action: {
          type: 'open-modal',
          payload: { action: 'add-skill', skill: missingSkills[0] },
          label: 'Add to Skills',
        },
        factors: [
          { factor: 'role_requirement', weight: 0.6, value: missingSkills[0], explanation: `Required for ${goal.targetRole}` },
          { factor: 'skill_gap', weight: 0.4, value: missingSkills.length, explanation: `${missingSkills.length} key skills missing` },
        ],
      });
    }

    // Project portfolio gaps
    if (projectCount < 3) {
      steps.push({
        title: 'Build More Portfolio Projects',
        description: `You have ${projectCount} projects. Aim for 4-6 diverse projects to showcase your ${goal.targetRole} skills.`,
        confidence: 0.8,
        priority: 'high',
        action: {
          type: 'create-project',
          payload: { suggestedRole: goal.targetRole },
          label: 'Add Project',
        },
        factors: [
          { factor: 'portfolio_depth', weight: 0.7, value: projectCount, explanation: 'More projects demonstrate breadth' },
          { factor: 'role_showcase', weight: 0.3, value: goal.targetRole, explanation: 'Projects should align with target role' },
        ],
      });
    }

    // Experience gaps
    const hasRelevantExp = experience.some(e => 
      e.position.toLowerCase().includes(goal.targetRole.replace('-', ' ')) ||
      goal.targetRole.split('-').some(r => e.position.toLowerCase().includes(r))
    );

    if (!hasRelevantExp && experience.length > 0) {
      steps.push({
        title: 'Highlight Transferable Experience',
        description: 'Reframe your current experience to emphasize skills relevant to your target role.',
        confidence: 0.7,
        priority: 'medium',
        action: {
          type: 'open-modal',
          payload: { action: 'edit-experience', focus: goal.targetRole },
          label: 'Update Experience',
        },
        factors: [
          { factor: 'experience_reframe', weight: 0.5, value: true, explanation: 'Reframe existing experience' },
          { factor: 'skill_transfer', weight: 0.5, value: requiredSkills.slice(0, 3), explanation: 'Emphasize transferable skills' },
        ],
      });
    }

    // Certifications
    const certMap: Record<string, string[]> = {
      'devops-engineer': ['AWS Solutions Architect', 'CKA (Kubernetes)', 'Terraform Associate'],
      'data-scientist': ['Google Data Analytics', 'Microsoft Azure Data Scientist'],
      'ml-engineer': ['AWS ML Specialty', 'Google Cloud ML Engineer'],
      'fullstack': ['AWS Developer Associate', 'Meta Frontend Developer'],
      'frontend-dev': ['Meta Frontend Developer', 'Google UX Design'],
      'backend-dev': ['AWS Developer Associate', 'Google Cloud Backend'],
    };

    const certs = certMap[goal.targetRole];
    if (certs && certs.length > 0) {
      steps.push({
        title: `Consider ${certs[0]} Certification`,
        description: `Industry-recognized certification that validates your ${goal.targetRole} expertise.`,
        confidence: 0.65,
        priority: 'medium',
        action: {
          type: 'open-resource',
          payload: { query: `${certs[0]} certification` },
          label: 'Research Cert',
        },
        factors: [
          { factor: 'credential_value', weight: 0.6, value: certs[0], explanation: 'Validates expertise to employers' },
          { factor: 'career_milestone', weight: 0.4, value: goal.timeline, explanation: 'Aligns with your timeline' },
        ],
      });
    }

    return steps;
  }

  // ─── Portfolio Improvement Recommendations ───────────────────────────────

  private recommendPortfolioImprovements(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const { personal, education, experience, skills, projects, achievements } = this.portfolioData || {
      personal: {},
      education: [],
      experience: [],
      skills: [],
      projects: [],
      achievements: [],
    };
    const templateId = this.portfolioData?.templateId;

    // Check completeness
    const completeness = this.calculateCompleteness(this.portfolioData);
    
    const completenessId = 'improvement-completeness';
    if (completeness < 60 && !dismissedIds.has(completenessId) && !negativeFeedbackIds.has(completenessId)) {
      recs.push(this.createRecommendation({
        type: 'portfolio-improvement',
        title: 'Complete Your Profile',
        description: `Your portfolio is ${completeness}% complete. Add missing sections to make it more compelling.`,
        reasoning: 'Incomplete portfolios receive less engagement from recruiters and peers.',
        confidence: 0.9,
        priority: 'high',
        action: {
          type: 'navigate',
          payload: { page: '/builder' },
          label: 'Continue Building',
        },
        metadata: {
          source: 'rule-based',
          factors: [
            { factor: 'completeness_score', weight: 1.0, value: completeness, explanation: `Current completeness: ${completeness}%` },
          ],
          context: this.context,
        },
      }));
    }

    // Specific section recommendations
    const bioId = 'improvement-bio';
    if (!personal.bio || personal.bio.length < 50 && !dismissedIds.has(bioId) && !negativeFeedbackIds.has(bioId)) {
      recs.push(this.createRecommendation({
        type: 'portfolio-improvement',
        title: 'Add a Compelling Bio',
        description: 'Write a 2-3 sentence professional summary highlighting your unique value proposition.',
        reasoning: 'A strong bio is the first thing visitors read and sets the tone for your entire portfolio.',
        confidence: 0.85,
        priority: 'high',
        action: {
          type: 'navigate',
          payload: { page: '/builder', step: 'personal' },
          label: 'Write Bio',
        },
        metadata: {
          source: 'rule-based',
          factors: [
            { factor: 'missing_bio', weight: 1.0, value: true, explanation: 'Bio is empty or too short' },
          ],
          context: this.context,
        },
      }));
    }

    const skillsId = 'improvement-skills';
    if (skills.length < 5 && !dismissedIds.has(skillsId) && !negativeFeedbackIds.has(skillsId)) {
      recs.push(this.createRecommendation({
        type: 'portfolio-improvement',
        title: 'Add More Skills',
        description: `You have ${skills.length} skills listed. Add 8-12 relevant skills to better showcase your expertise.`,
        reasoning: 'Recruiters often filter by specific skills. More skills = more search visibility.',
        confidence: 0.8,
        priority: 'medium',
        action: {
          type: 'navigate',
          payload: { page: '/builder', step: 'education' }, // Skills are in education step
          label: 'Add Skills',
        },
        metadata: {
          source: 'rule-based',
          factors: [
            { factor: 'skill_count', weight: 1.0, value: skills.length, explanation: `Only ${skills.length} skills listed` },
          ],
          context: this.context,
        },
      }));
    }

    const projectsId = 'improvement-projects';
    if (projects.length < 3 && !dismissedIds.has(projectsId) && !negativeFeedbackIds.has(projectsId)) {
      recs.push(this.createRecommendation({
        type: 'portfolio-improvement',
        title: 'Showcase More Projects',
        description: `You have ${projects.length} projects. Add 2-3 more to demonstrate range and depth.`,
        reasoning: 'Multiple projects show consistency and allow you to highlight different skill sets.',
        confidence: 0.85,
        priority: 'high',
        action: {
          type: 'navigate',
          payload: { page: '/builder', step: 'projects' },
          label: 'Add Projects',
        },
        metadata: {
          source: 'rule-based',
          factors: [
            { factor: 'project_count', weight: 1.0, value: projects.length, explanation: `Only ${projects.length} projects` },
          ],
          context: this.context,
        },
      }));
    }

    const featuredId = 'improvement-featured';
    if (projects.length > 0 && projects.every((p: any) => !p.featured) && !dismissedIds.has(featuredId) && !negativeFeedbackIds.has(featuredId)) {
      recs.push(this.createRecommendation({
        type: 'portfolio-improvement',
        title: 'Feature Your Best Project',
        description: 'Mark your most impressive project as featured to draw attention to it.',
        reasoning: 'Featured projects are prominently displayed in most themes.',
        confidence: 0.75,
        priority: 'medium',
        action: {
          type: 'navigate',
          payload: { page: '/builder', step: 'projects' },
          label: 'Set Featured',
        },
        metadata: {
          source: 'rule-based',
          factors: [
            { factor: 'no_featured', weight: 1.0, value: true, explanation: 'No project marked as featured' },
          ],
          context: this.context,
        },
      }));
    }

    const highlightsId = 'improvement-highlights';
    if (experience.length > 0 && experience.some((e: any) => !e.highlights || e.highlights.length === 0) && !dismissedIds.has(highlightsId) && !negativeFeedbackIds.has(highlightsId)) {
      recs.push(this.createRecommendation({
        type: 'portfolio-improvement',
        title: 'Add Achievement Highlights',
        description: 'Add bullet-point achievements to your experience entries with metrics and impact.',
        reasoning: 'Quantified achievements (e.g., "Improved performance by 40%") are far more compelling than responsibilities.',
        confidence: 0.8,
        priority: 'medium',
        action: {
          type: 'navigate',
          payload: { page: '/builder', step: 'experience' },
          label: 'Add Highlights',
        },
        metadata: {
          source: 'rule-based',
          factors: [
            { factor: 'missing_highlights', weight: 1.0, value: experience.filter((e: any) => !e.highlights || e.highlights.length === 0).length, explanation: 'Experience entries lack quantified achievements' },
          ],
          context: this.context,
        },
      }));
    }

    // Theme-specific improvements
    if (templateId) {
      const theme = getTemplate(templateId);
      const themeRecs = this.getThemeSpecificImprovements(theme, this.portfolioData!);
      // Filter theme recs too
      const filteredThemeRecs = themeRecs.filter(r => !dismissedIds.has(r.id) && !negativeFeedbackIds.has(r.id));
      recs.push(...filteredThemeRecs);
    }

    return recs.slice(0, 5);
  }

  private calculateCompleteness(portfolio: PortfolioData | null): number {
    if (!portfolio) return 0;
    
    const { personal, education, experience, skills, projects, achievements } = portfolio;
    let score = 0;
    const weights = {
      personal: 20,
      education: 15,
      experience: 20,
      skills: 15,
      projects: 20,
      achievements: 10,
    };

    if (personal.firstName && personal.lastName && personal.email && personal.title) score += weights.personal;
    else if (personal.firstName || personal.lastName) score += weights.personal * 0.5;

    if (education.length > 0) score += weights.education;
    if (experience.length > 0) score += weights.experience;
    else if (experience.length === 0) score += 0;

    if (skills.length >= 8) score += weights.skills;
    else if (skills.length > 0) score += weights.skills * (skills.length / 8);

    if (projects.length >= 4) score += weights.projects;
    else if (projects.length > 0) score += weights.projects * (projects.length / 4);

    if (achievements.length >= 3) score += weights.achievements;
    else if (achievements.length > 0) score += weights.achievements * (achievements.length / 3);

    return Math.round(score);
  }

  private getThemeSpecificImprovements(theme: any, portfolio: PortfolioData): Recommendation[] {
    const recs: Recommendation[] = [];
    const { personal, projects, skills } = portfolio;

    // Terminal theme: suggest CLI-style projects
    if (theme.id === 'terminal' || theme.id === 'code-reality') {
      if (projects.some((p: any) => p.techStack?.includes('CLI') || p.techStack?.includes('Terminal'))) {
        recs.push(this.createRecommendation({
          type: 'portfolio-improvement',
          title: 'Add CLI/Terminal Projects',
          description: 'This terminal theme works perfectly with CLI tools, developer utilities, or terminal-based projects.',
          reasoning: 'Theme-specific content creates a more cohesive and impressive portfolio.',
          confidence: 0.7,
          priority: 'low',
          action: {
            type: 'create-project',
            payload: { themeHint: 'terminal' },
            label: 'Add CLI Project',
          },
          metadata: {
            source: 'content-based',
            factors: [
              { factor: 'theme_alignment', weight: 1.0, value: 'terminal', explanation: 'Terminal theme pairs well with CLI projects' },
            ],
            context: this.context,
          },
        }));
      }
    }

    // Data scientist theme: suggest data projects
    if (theme.id === 'data-scientist' || theme.id === 'quantum-lab') {
      if (!projects.some((p: any) => p.techStack?.some((t: any) => ['Python', 'Pandas', 'Jupyter', 'ML'].includes(t)))) {
        recs.push(this.createRecommendation({
          type: 'portfolio-improvement',
          title: 'Add Data Science Projects',
          description: 'Showcase Jupyter notebooks, ML models, or data visualizations that align with this research theme.',
          reasoning: 'Theme-specific projects create a cohesive narrative.',
          confidence: 0.75,
          priority: 'medium',
          action: {
            type: 'create-project',
            payload: { themeHint: 'data-science' },
            label: 'Add Data Project',
          },
          metadata: {
            source: 'content-based',
            factors: [
              { factor: 'theme_alignment', weight: 1.0, value: 'data-science', explanation: 'Research theme pairs well with data projects' },
            ],
            context: this.context,
          },
        }));
      }
    }

    return recs;
  }

  private recommendTemplateCustomizations(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const theme = this.portfolioData?.templateId ? getTemplate(this.portfolioData.templateId) : null;
    const { behaviorProfile } = this.userProfile;

    if (!theme) return recs;

    // Suggest color scheme based on preferences
    if (behaviorProfile.colorSchemePreference !== 'mixed') {
      const currentDark = theme.defaultTheme.darkMode;
      const prefersDark = behaviorProfile.colorSchemePreference === 'dark';
      
      if (currentDark !== prefersDark) {
        const customId = 'customize-darkmode';
        if (!dismissedIds.has(customId) && !negativeFeedbackIds.has(customId)) {
          recs.push(this.createRecommendation({
            type: 'template-customization',
            title: `Switch to ${prefersDark ? 'Dark' : 'Light'} Mode`,
            description: `You prefer ${behaviorProfile.colorSchemePreference} themes. This theme's default is ${currentDark ? 'dark' : 'light'}.`,
            reasoning: 'Matching your color preference improves visual comfort and engagement.',
            confidence: 0.7,
            priority: 'low',
            action: {
              type: 'open-modal',
              payload: { action: 'toggle-dark-mode' },
              label: 'Toggle Dark Mode',
            },
            metadata: {
              source: 'rule-based',
              factors: [
                { factor: 'color_preference', weight: 1.0, value: behaviorProfile.colorSchemePreference, explanation: 'Your preferred color scheme' },
              ],
              context: this.context,
            },
          }));
        }
      }
    }

    // Suggest font based on content density preference
    if (behaviorProfile.contentDensityPreference === 'minimal' && theme.defaultTheme.fontSize !== 'sm') {
      const customId = 'customize-fontsize';
      if (!dismissedIds.has(customId) && !negativeFeedbackIds.has(customId)) {
        recs.push(this.createRecommendation({
          type: 'template-customization',
          title: 'Reduce Font Size for Compact Layout',
          description: 'You prefer minimal content density. Smaller fonts fit more content without scrolling.',
          reasoning: 'Aligning font size with density preference improves readability.',
          confidence: 0.6,
          priority: 'low',
          action: {
            type: 'open-modal',
            payload: { action: 'change-font-size', size: 'sm' },
            label: 'Adjust Font Size',
          },
          metadata: {
            source: 'rule-based',
            factors: [
              { factor: 'density_preference', weight: 1.0, value: 'minimal', explanation: 'You prefer minimal content density' },
            ],
            context: this.context,
          },
        }));
      }
    }

    return recs;
  }

  private recommendSectionCompletion(dismissedIds: Set<string>, negativeFeedbackIds: Set<string>): Recommendation[] {
    const recs: Recommendation[] = [];
    const portfolio = this.portfolioData;
    
    if (!portfolio) return recs;

    const sections = [
      { key: 'personal', label: 'Personal Info', check: () => !!portfolio.personal.firstName && !!portfolio.personal.email },
      { key: 'education', label: 'Education', check: () => portfolio.education.length > 0 },
      { key: 'experience', label: 'Experience', check: () => portfolio.experience.length > 0 },
      { key: 'skills', label: 'Skills', check: () => portfolio.skills.length > 0 },
      { key: 'projects', label: 'Projects', check: () => portfolio.projects.length > 0 },
      { key: 'achievements', label: 'Achievements', check: () => portfolio.achievements.length > 0 },
    ];

    for (const section of sections) {
      if (!section.check()) {
        const sectionId = `section-${section.key}`;
        if (dismissedIds.has(sectionId) || negativeFeedbackIds.has(sectionId)) continue;
        
        recs.push(this.createRecommendation({
          type: 'section-completion',
          title: `Complete ${section.label} Section`,
          description: `Your ${section.label.toLowerCase()} section is empty. Adding this will significantly improve your portfolio.`,
          reasoning: `The ${section.label.toLowerCase()} section is a core component of any professional portfolio.`,
          confidence: 0.9,
          priority: 'high',
          action: {
            type: 'navigate',
            payload: { page: '/builder', step: section.key === 'skills' ? 'education' : section.key },
            label: `Add ${section.label}`,
          },
          metadata: {
            source: 'rule-based',
            factors: [
              { factor: 'empty_section', weight: 1.0, value: section.key, explanation: `${section.label} section is completely empty` },
            ],
            context: this.context,
          },
        }));
      }
    }

    return recs;
  }

  // ─── Helper: Create Recommendation Object ────────────────────────────────

  private createRecommendation(params: {
    id?: string;
    type: RecommendationType;
    title: string;
    description: string;
    reasoning: string;
    confidence: number;
    priority: 'high' | 'medium' | 'low';
    action?: RecommendationAction;
    metadata: RecommendationMetadata;
  }): Recommendation {
    // Generate a deterministic slug ID based on type, action target, and title
    // to prevent duplicate recommendations and ensure dismissal/feedback persistence
    const keyParts = [
      params.type,
      params.action?.payload?.templateId ||
      params.action?.payload?.skill?.name ||
      params.action?.payload?.skillName ||
      params.action?.payload?.projectTitle ||
      params.action?.payload?.project?.title ||
      params.action?.payload?.resourceId ||
      params.action?.payload?.step ||
      params.title
    ];
    const slug = keyParts
      .filter(Boolean)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    const deterministicId = params.id || `rec-${slug}`;

    return {
      id: deterministicId,
      type: params.type,
      title: params.title,
      description: params.description,
      reasoning: params.reasoning,
      confidence: Math.max(0, Math.min(1, params.confidence)),
      priority: params.priority,
      action: params.action ? {
        ...params.action,
        payload: {
          ...params.action.payload,
          recommendationId: deterministicId,
          recommendationType: params.type,
        }
      } : undefined,
      metadata: {
        ...params.metadata,
        factors: params.metadata.factors || [],
        context: params.metadata.context || this.context,
      },
      createdAt: new Date().toISOString(),
    };
  }
}

// ─── Export singleton factory ──────────────────────────────────────────────

export function createRecommendationEngine(
  portfolioData: PortfolioData | null,
  context: RecommendationContext
): RecommendationEngine {
  return new RecommendationEngine(portfolioData, context);
}