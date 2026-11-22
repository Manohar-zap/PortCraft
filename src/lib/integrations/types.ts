// PortCraft — Integration System Types

export interface ConnectionResult {
  success: boolean;
  error?: string;
  profileUrl?: string;
}

export type PlatformResult<T = unknown> = {
  success: true;
  data: T;
  platform: string;
  fetchedAt: string;
} | {
  success: false;
  error: string;
  platform: string;
};

export interface ConnectorCapabilities {
  canFetchProfile: boolean;
  canFetchStats: boolean;
  canFetchRepositories: boolean;
  canFetchCertifications: boolean;
  requiresApiKey: boolean;
  supportsPublicAccess: boolean;
  apiLimitations: string[];
}

export interface ConnectorMeta {
  id: string;
  displayName: string;
  website: string;
  iconEmoji: string;
  color: string;
  description: string;
  inputLabel: string; // e.g. "Username" or "Profile URL"
  inputPlaceholder: string;
  inputType: 'username' | 'url';
  capabilities: ConnectorCapabilities;
}
