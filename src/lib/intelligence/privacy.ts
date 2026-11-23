'use client';

import {
  UserProfile,
  ConsentSettings,
  DataExport,
  DataDeletionRequest,
  PrivacyDashboardData,
  DataCategory,
  ConsentChange,
  ThirdPartyShare,
  RetentionPolicy,
  AnalyticsEvent,
  Recommendation,
  UserFeedback,
  DEFAULT_CONSENT,
  INITIAL_USER_PROFILE,
} from './types';
import { 
  getUserProfile, 
  getEvents, 
  getRecommendations, 
  getFeedback,
  getConsent, 
  saveConsent,
  exportAllData,
  requestDataDeletion,
  processDataDeletion,
  updateUserProfile,
} from './storage';
import { generateId } from '@/lib/types';

// ─── Privacy Manager ───────────────────────────────────────────────────────

export class PrivacyManager {
  private userProfile: UserProfile | null = null;
  private consentHistory: ConsentChange[] = [];
  private initialized = false;

  private ensureInitialized(): void {
    if (!this.initialized && typeof window !== 'undefined') {
      this.userProfile = getUserProfile();
      this.loadConsentHistory();
      this.initialized = true;
    }
  }

  private getProfile(): UserProfile {
    this.ensureInitialized();
    return this.userProfile || getUserProfile();
  }

  // ─── Consent Management ──────────────────────────────────────────────────

  getCurrentConsent(): ConsentSettings {
    return getConsent();
  }

  updateConsent(updates: Partial<ConsentSettings>, source: 'user' | 'system' | 'policy-update' = 'user'): ConsentSettings {
    const current = getConsent();
    const updated: ConsentSettings = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString(),
      version: this.incrementVersion(current.version),
    };

    // Record consent changes
    for (const [key, value] of Object.entries(updates)) {
      if (key in current && current[key as keyof ConsentSettings] !== value) {
        this.consentHistory.push({
          timestamp: new Date().toISOString(),
          setting: key,
          oldValue: current[key as keyof ConsentSettings] as boolean,
          newValue: value as boolean,
          source,
        });
      }
    }
    this.saveConsentHistory();

    saveConsent(updated);
    return updated;
  }

  acceptAll(): ConsentSettings {
    return this.updateConsent({
      analytics: true,
      personalization: true,
      aiTraining: true,
      thirdPartySharing: true,
      marketingEmails: true,
    });
  }

  rejectAll(): ConsentSettings {
    return this.updateConsent({
      analytics: false,
      personalization: false,
      aiTraining: false,
      thirdPartySharing: false,
      marketingEmails: false,
    });
  }

  acceptEssentialOnly(): ConsentSettings {
    return this.updateConsent({
      analytics: true, // Essential for functionality
      personalization: false,
      aiTraining: false,
      thirdPartySharing: false,
      marketingEmails: false,
    });
  }

  // ─── Data Access ─────────────────────────────────────────────────────────

  getDataCategories(): DataCategory[] {
    return [
      {
        category: 'Profile Data',
        description: 'Personal information, skills, experience, education, projects',
        examples: ['Name', 'Email', 'Bio', 'Work history', 'Skills list', 'Projects'],
        retentionDays: 365 * 10, // 10 years or until deletion
        canDelete: true,
      },
      {
        category: 'Behavioral Analytics',
        description: 'Page views, clicks, scroll depth, feature usage, session data',
        examples: ['Pages visited', 'Time on page', 'Button clicks', 'Search queries', 'Theme selections'],
        retentionDays: 365 * 2, // 2 years
        canDelete: true,
      },
      {
        category: 'Recommendations',
        description: 'Personalized theme, skill, project, and career recommendations',
        examples: ['Theme suggestions', 'Skill gaps', 'Project ideas', 'Learning resources', 'Career paths'],
        retentionDays: 365 * 2,
        canDelete: true,
      },
      {
        category: 'AI Interactions',
        description: 'Chat history, generated content, analysis requests',
        examples: ['Chat messages', 'Portfolio analysis', 'Generated bios', 'Improved content'],
        retentionDays: 365,
        canDelete: true,
      },
      {
        category: 'A/B Test Assignments',
        description: 'Which experiment variants you were assigned to',
        examples: ['Test ID', 'Variant ID', 'Exposure timestamp'],
        retentionDays: 365,
        canDelete: true,
      },
      {
        category: 'Feedback & Ratings',
        description: 'Your feedback on recommendations and features',
        examples: ['Helpful/not helpful ratings', 'Comments', 'Satisfaction scores'],
        retentionDays: 365 * 2,
        canDelete: true,
      },
      {
        category: 'Consent Records',
        description: 'History of your privacy preferences',
        examples: ['Consent settings', 'Change timestamps', 'Source of change'],
        retentionDays: 365 * 10, // Legal requirement
        canDelete: false, // Required for compliance
      },
    ];
  }

  getConsentHistory(): ConsentChange[] {
    return [...this.consentHistory].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getThirdPartyShares(): ThirdPartyShare[] {
    // PortCraft doesn't share data with third parties by default
    // This would be populated if integrations were added
    return [];
  }

  getRetentionPolicies(): RetentionPolicy[] {
    return this.getDataCategories().map(cat => ({
      dataCategory: cat.category,
      retentionDays: cat.retentionDays,
      autoDelete: cat.canDelete,
      legalBasis: cat.canDelete ? 'Legitimate interest / Consent' : 'Legal obligation',
    }));
  }

  // ─── Data Export ─────────────────────────────────────────────────────────

  async exportData(): Promise<DataExport> {
    return exportAllData();
  }

  async downloadDataExport(): Promise<void> {
    const data = await this.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portcraft-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ─── Data Deletion ───────────────────────────────────────────────────────

  requestDeletion(scope: DataDeletionRequest['scope'] = 'all'): DataDeletionRequest {
    return requestDataDeletion(scope);
  }

  getDeletionRequests(): DataDeletionRequest[] {
    // Would be stored in localStorage
    return [];
  }

  async deleteAllData(): Promise<boolean> {
    const request = this.requestDeletion('all');
    return processDataDeletion(request.requestId);
  }

  async deleteAnalyticsData(): Promise<boolean> {
    const request = this.requestDeletion('analytics');
    return processDataDeletion(request.requestId);
  }

  async deleteRecommendations(): Promise<boolean> {
    const request = this.requestDeletion('recommendations');
    return processDataDeletion(request.requestId);
  }

  // ─── Privacy Dashboard ───────────────────────────────────────────────────

  getDashboardData(): PrivacyDashboardData {
    return {
      dataCollected: this.getDataCategories(),
      consentHistory: this.getConsentHistory(),
      thirdPartyShares: this.getThirdPartyShares(),
      dataRetention: this.getRetentionPolicies(),
    };
  }

  // ─── Transparency Report ─────────────────────────────────────────────────

  generateTransparencyReport(): string {
    const data = this.getDashboardData();
    const profile = getUserProfile();
    const events = getEvents({ userId: profile.id });
    const recommendations = getRecommendations();
    const feedback = getFeedback();

    let report = `# PortCraft Privacy Transparency Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**User ID:** ${profile.id}\n`;
    report += `**Account Created:** ${profile.createdAt}\n\n`;

    report += `## Data Summary\n\n`;
    report += `| Category | Items | Retention |\n`;
    report += `|----------|-------|-----------|\n`;
    report += `| Profile Data | 1 profile | 10 years |\n`;
    report += `| Analytics Events | ${events.length} | 2 years |\n`;
    report += `| Recommendations | ${recommendations.length} | 2 years |\n`;
    report += `| Feedback Entries | ${feedback.length} | 2 years |\n\n`;

    report += `## Current Consent Settings\n\n`;
    const consent = getConsent();
    report += `| Setting | Status |\n`;
    report += `|---------|--------|\n`;
    report += `| Analytics | ${consent.analytics ? '✅ Enabled' : '❌ Disabled'} |\n`;
    report += `| Personalization | ${consent.personalization ? '✅ Enabled' : '❌ Disabled'} |\n`;
    report += `| AI Training | ${consent.aiTraining ? '✅ Enabled' : '❌ Disabled'} |\n`;
    report += `| Third-Party Sharing | ${consent.thirdPartySharing ? '✅ Enabled' : '❌ Disabled'} |\n`;
    report += `| Marketing Emails | ${consent.marketingEmails ? '✅ Enabled' : '❌ Disabled'} |\n\n`;

    report += `## Data Processing Purposes\n\n`;
    report += `1. **Portfolio Creation** - Building and customizing your portfolio\n`;
    report += `2. **Personalization** - Tailoring themes, recommendations, and content\n`;
    report += `3. **Analytics** - Improving product usability and performance\n`;
    report += `4. **AI Features** - Generating content, analyzing portfolios, providing guidance\n\n`;

    report += `## Your Rights\n\n`;
    report += `- **Access:** Download all your data (JSON format)\n`;
    report += `- **Rectification:** Edit your profile data anytime in the builder\n`;
    report += `- **Erasure:** Request deletion of specific or all data categories\n`;
    report += `- **Portability:** Export data in machine-readable format\n`;
    report += `- **Restriction:** Disable specific processing (analytics, AI, etc.)\n`;
    report += `- **Objection:** Opt-out of personalization or analytics\n\n`;

    report += `## Data Storage\n\n`;
    report += `All data is stored **locally in your browser** (localStorage). `;
    report += `No data is transmitted to external servers unless you explicitly use `;
    report += `features that require it (e.g., GitHub API calls for profile import).\n\n`;

    report += `## Third-Party Services\n\n`;
    report += `PortCraft does not share your personal data with third parties. `;
    report += `The only external requests are:\n`;
    report += `- GitHub API (when you connect your GitHub profile)\n`;
    report += `- LeetCode/Codeforces APIs (when you connect those profiles)\n`;
    report += `These are direct browser-to-API calls, not routed through our servers.\n\n`;

    report += `---\n\n`;
    report += `*This report is generated locally in your browser. No copy is sent to any server.*`;

    return report;
  }

  downloadTransparencyReport(): void {
    const report = this.generateTransparencyReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portcraft-transparency-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private loadConsentHistory(): void {
    // In practice, this would be loaded from localStorage
    this.consentHistory = [];
  }

  private saveConsentHistory(): void {
    // In practice, this would be saved to localStorage
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number);
    parts[parts.length - 1] += 1;
    return parts.join('.');
  }
}

// ─── Privacy Hook for React Components ────────────────────────────────────

export function usePrivacy() {
  const manager = new PrivacyManager();
  
  return {
    // Consent
    getConsent: () => manager.getCurrentConsent(),
    updateConsent: (updates: Partial<ConsentSettings>) => manager.updateConsent(updates),
    acceptAll: () => manager.acceptAll(),
    rejectAll: () => manager.rejectAll(),
    acceptEssentialOnly: () => manager.acceptEssentialOnly(),
    
    // Data Access
    getDataCategories: () => manager.getDataCategories(),
    getConsentHistory: () => manager.getConsentHistory(),
    getThirdPartyShares: () => manager.getThirdPartyShares(),
    getRetentionPolicies: () => manager.getRetentionPolicies(),
    
    // Data Export
    exportData: () => manager.exportData(),
    downloadDataExport: () => manager.downloadDataExport(),
    
    // Data Deletion
    requestDeletion: (scope?: 'all' | 'analytics' | 'recommendations' | 'profile' | 'events') => 
      manager.requestDeletion(scope),
    deleteAllData: () => manager.deleteAllData(),
    deleteAnalyticsData: () => manager.deleteAnalyticsData(),
    deleteRecommendations: () => manager.deleteRecommendations(),
    
    // Dashboard
    getDashboardData: () => manager.getDashboardData(),
    
    // Transparency
    generateTransparencyReport: () => manager.generateTransparencyReport(),
    downloadTransparencyReport: () => manager.downloadTransparencyReport(),
  };
}

// ─── Consent Banner Component Data ────────────────────────────────────────

export interface ConsentBannerConfig {
  showBanner: boolean;
  consent: ConsentSettings;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
  onAcceptEssential: () => void;
}

export function getConsentBannerConfig(): ConsentBannerConfig {
  const consent = getConsent();
  const hasConsented = consent.analytics || consent.personalization || consent.aiTraining;
  
  return {
    showBanner: !hasConsented && typeof window !== 'undefined',
    consent,
    onAcceptAll: () => new PrivacyManager().acceptAll(),
    onRejectAll: () => new PrivacyManager().rejectAll(),
    onCustomize: () => {}, // Would open modal
    onAcceptEssential: () => new PrivacyManager().acceptEssentialOnly(),
  };
}