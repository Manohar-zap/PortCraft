import type { NextRequest } from 'next/server';

// Kaggle public profile data
function isSafeUsername(u: string): boolean {
  return /^[a-zA-Z0-9_-]{2,30}$/.test(u);
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username || !isSafeUsername(username)) {
    return Response.json({ error: 'Invalid username' }, { status: 400 });
  }
  // Kaggle has no unauthenticated public API for user stats
  // Return profile URL for linking only
  return Response.json({
    username,
    profileUrl: `https://www.kaggle.com/${username}`,
    note: 'Kaggle does not provide unauthenticated public profile data via API. Profile URL is linked for reference.',
    fetchedAt: new Date().toISOString(),
  });
}
