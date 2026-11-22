import type { NextRequest } from 'next/server';

function isSafeHandle(h: string): boolean {
  return /^[a-zA-Z0-9_]{3,24}$/.test(h);
}

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle');
  if (!handle || !isSafeHandle(handle)) {
    return Response.json({ error: 'Invalid handle' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'PortCraft/1.0' } }
    );
    if (!res.ok) return Response.json({ error: 'Codeforces API error' }, { status: 502 });

    const json = await res.json();
    if (json.status !== 'OK' || !json.result?.length) {
      return Response.json({ error: 'Codeforces handle not found' }, { status: 404 });
    }

    const u = json.result[0];
    const profile = {
      handle: u.handle,
      rating: u.rating || 0,
      maxRating: u.maxRating || 0,
      rank: u.rank || 'unrated',
      maxRank: u.maxRank || 'unrated',
      country: u.country || undefined,
      city: u.city || undefined,
      organization: u.organization || undefined,
      contribution: u.contribution || 0,
      friendOfCount: u.friendOfCount || 0,
      profileUrl: `https://codeforces.com/profile/${u.handle}`,
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
