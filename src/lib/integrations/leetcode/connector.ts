import type { LeetCodeProfile } from '@/lib/types';
import type { PlatformResult } from '../types';

export async function fetchLeetCodeProfile(username: string): Promise<PlatformResult<LeetCodeProfile>> {
  const response = await fetch(`/api/integrations/leetcode?username=${encodeURIComponent(username)}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    return { success: false, error: err.error || 'LeetCode fetch failed', platform: 'leetcode' };
  }
  const data = await response.json();
  return { success: true, data, platform: 'leetcode', fetchedAt: new Date().toISOString() };
}

export function validateLeetCodeUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,25}$/.test(username.trim());
}
