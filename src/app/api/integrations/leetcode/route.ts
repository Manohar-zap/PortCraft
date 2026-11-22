import type { NextRequest } from 'next/server';

function isSafeUsername(u: string): boolean {
  return /^[a-zA-Z0-9_-]{3,25}$/.test(u);
}

const LEETCODE_GQL = 'https://leetcode.com/graphql';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username || !isSafeUsername(username)) {
    return Response.json({ error: 'Invalid username' }, { status: 400 });
  }

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        badges { name }
      }
    }
  `;

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PortCraft/1.0',
        'Origin': 'https://leetcode.com',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return Response.json({ error: 'LeetCode API unavailable' }, { status: 502 });
    const json = await res.json();
    const user = json?.data?.matchedUser;
    if (!user) return Response.json({ error: 'LeetCode user not found' }, { status: 404 });

    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    const getStat = (difficulty: string) =>
      stats.find((s: { difficulty: string; count: number }) => s.difficulty === difficulty)?.count || 0;

    const profile = {
      username: user.username,
      realName: user.profile?.realName || undefined,
      avatarUrl: user.profile?.userAvatar || undefined,
      ranking: user.profile?.ranking || undefined,
      totalSolved: getStat('All'),
      easySolved: getStat('Easy'),
      mediumSolved: getStat('Medium'),
      hardSolved: getStat('Hard'),
      badges: (user.badges || []).map((b: { name: string }) => b.name),
      profileUrl: `https://leetcode.com/${username}`,
      fetchedAt: new Date().toISOString(),
    };

    return Response.json(profile, {
      headers: { 'Cache-Control': 'public, s-maxage=600' }
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Request failed';
    return Response.json({ error: msg }, { status: 502 });
  }
}
