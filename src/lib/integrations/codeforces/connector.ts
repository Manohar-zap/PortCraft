import type { CodeforcesProfile } from '@/lib/types';
import type { PlatformResult } from '../types';

export async function fetchCodeforcesProfile(handle: string): Promise<PlatformResult<CodeforcesProfile>> {
  const response = await fetch(`/api/integrations/codeforces?handle=${encodeURIComponent(handle)}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    return { success: false, error: err.error || 'Codeforces fetch failed', platform: 'codeforces' };
  }
  const data = await response.json();
  return { success: true, data, platform: 'codeforces', fetchedAt: new Date().toISOString() };
}

export function validateCodeforcesHandle(handle: string): boolean {
  return /^[a-zA-Z0-9_]{3,24}$/.test(handle.trim());
}
