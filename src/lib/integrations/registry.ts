import type { ConnectorMeta } from './types';

export const PLATFORM_CONNECTORS: ConnectorMeta[] = [
  {
    id: 'github',
    displayName: 'GitHub',
    website: 'https://github.com',
    iconEmoji: '🐙',
    color: '#24292e',
    description: 'Import your public repositories, programming languages, and project data.',
    inputLabel: 'GitHub Username',
    inputPlaceholder: 'your-github-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: true,
      canFetchStats: false,
      canFetchRepositories: true,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: true,
      apiLimitations: ['60 requests/hour without token', 'Only public repositories']
    }
  },
  {
    id: 'gitlab',
    displayName: 'GitLab',
    website: 'https://gitlab.com',
    iconEmoji: '🦊',
    color: '#fc6d26',
    description: 'Import your public GitLab repositories and projects.',
    inputLabel: 'GitLab Username',
    inputPlaceholder: 'your-gitlab-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: true,
      canFetchStats: false,
      canFetchRepositories: true,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: true,
      apiLimitations: ['Only public repositories accessible without authentication']
    }
  },
  {
    id: 'leetcode',
    displayName: 'LeetCode',
    website: 'https://leetcode.com',
    iconEmoji: '🧩',
    color: '#ffa116',
    description: 'Import your problem-solving stats, rankings, and achievements.',
    inputLabel: 'LeetCode Username',
    inputPlaceholder: 'your-leetcode-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: true,
      canFetchStats: true,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: true,
      apiLimitations: ['Unofficial GraphQL endpoint', 'Rate limited', 'Some stats may be unavailable']
    }
  },
  {
    id: 'codeforces',
    displayName: 'Codeforces',
    website: 'https://codeforces.com',
    iconEmoji: '⚔️',
    color: '#1189c6',
    description: 'Import your competitive programming rating, rank, and contest history.',
    inputLabel: 'Codeforces Handle',
    inputPlaceholder: 'your-cf-handle',
    inputType: 'username',
    capabilities: {
      canFetchProfile: true,
      canFetchStats: true,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: true,
      apiLimitations: ['Official API', 'No problem solving breakdown by difficulty available via public API']
    }
  },
  {
    id: 'hackerrank',
    displayName: 'HackerRank',
    website: 'https://hackerrank.com',
    iconEmoji: '💚',
    color: '#00ea64',
    description: 'Import your badges, skills, and certifications. Enter your profile URL for manual import.',
    inputLabel: 'HackerRank Username',
    inputPlaceholder: 'your-hackerrank-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: false,
      canFetchStats: false,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: false,
      apiLimitations: ['No official public API available', 'Manual import only — enter your profile URL']
    }
  },
  {
    id: 'geeksforgeeks',
    displayName: 'GeeksforGeeks',
    website: 'https://geeksforgeeks.org',
    iconEmoji: '📗',
    color: '#2f8d46',
    description: 'No official API available. Enter your username to link your profile.',
    inputLabel: 'GFG Username',
    inputPlaceholder: 'your-gfg-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: false,
      canFetchStats: false,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: false,
      apiLimitations: ['No official public API', 'Profile URL is linked — no data import available']
    }
  },
  {
    id: 'codechef',
    displayName: 'CodeChef',
    website: 'https://codechef.com',
    iconEmoji: '👨‍🍳',
    color: '#5b4638',
    description: 'No official API available. Enter your username to link your profile.',
    inputLabel: 'CodeChef Username',
    inputPlaceholder: 'your-codechef-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: false,
      canFetchStats: false,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: false,
      apiLimitations: ['No official public API', 'Profile URL is linked — no data import available']
    }
  },
  {
    id: 'kaggle',
    displayName: 'Kaggle',
    website: 'https://kaggle.com',
    iconEmoji: '📊',
    color: '#20beff',
    description: 'Import your competition medals, notebook rankings, and dataset statistics.',
    inputLabel: 'Kaggle Username',
    inputPlaceholder: 'your-kaggle-username',
    inputType: 'username',
    capabilities: {
      canFetchProfile: true,
      canFetchStats: true,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: false,
      supportsPublicAccess: true,
      apiLimitations: ['Public profile data only', 'No private datasets or competitions']
    }
  },
  {
    id: 'linkedin',
    displayName: 'LinkedIn',
    website: 'https://linkedin.com',
    iconEmoji: '💼',
    color: '#0a66c2',
    description: 'LinkedIn restricts data access. Upload your LinkedIn data export or resume PDF instead.',
    inputLabel: 'LinkedIn Profile URL',
    inputPlaceholder: 'https://linkedin.com/in/your-profile',
    inputType: 'url',
    capabilities: {
      canFetchProfile: false,
      canFetchStats: false,
      canFetchRepositories: false,
      canFetchCertifications: false,
      requiresApiKey: true,
      supportsPublicAccess: false,
      apiLimitations: ['LinkedIn restricts public data access via API', 'Use LinkedIn data export (Settings > Get a copy of your data) or upload your resume PDF']
    }
  }
];

export function getConnectorMeta(id: string): ConnectorMeta | undefined {
  return PLATFORM_CONNECTORS.find(c => c.id === id);
}
