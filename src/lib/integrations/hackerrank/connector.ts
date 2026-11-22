import type { HackerRankProfile } from '@/lib/types';

// HackerRank has no official public API. We store the username for profile linking.
export function createManualHackerRankProfile(username: string): HackerRankProfile {
  return {
    username,
    profileUrl: `https://www.hackerrank.com/${username}`,
    fetchedAt: new Date().toISOString(),
    note: 'Profile URL saved. HackerRank does not provide a public API. Visit your profile to view full data.',
  };
}

export function validateHackerRankUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{2,30}$/.test(username.trim());
}
