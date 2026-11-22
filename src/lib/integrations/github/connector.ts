import type { GitHubProfile, Repository } from '@/lib/types';
import type { PlatformResult } from '../types';

export async function fetchGitHubProfile(username: string): Promise<PlatformResult<GitHubProfile>> {
  const response = await fetch(`/api/integrations/github?username=${encodeURIComponent(username)}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    return { success: false, error: err.error || 'GitHub fetch failed', platform: 'github' };
  }
  const data = await response.json();
  return { success: true, data, platform: 'github', fetchedAt: new Date().toISOString() };
}

export function validateGitHubUsername(username: string): boolean {
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username.trim());
}
