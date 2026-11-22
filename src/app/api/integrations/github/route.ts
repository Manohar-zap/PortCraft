import type { NextRequest } from 'next/server';

function isSafeUsername(username: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(username);
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username || !isSafeUsername(username)) {
    return Response.json({ error: 'Invalid username' }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PortCraft/1.0',
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, signal: AbortSignal.timeout(10000) }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=public`, { headers, signal: AbortSignal.timeout(10000) }),
    ]);

    if (userRes.status === 404) return Response.json({ error: 'GitHub user not found' }, { status: 404 });
    if (!userRes.ok) return Response.json({ error: 'GitHub API error' }, { status: 502 });

    const user = await userRes.json();
    const rawRepos = reposRes.ok ? await reposRes.json() : [];

    // Normalize repositories
    const repositories = rawRepos
      .filter((r: { fork: boolean }) => !r.fork) // skip forks by default
      .slice(0, 30)
      .map((r: {
        id: number; name: string; description: string; language: string;
        stargazers_count: number; forks_count: number; html_url: string;
        homepage: string; topics: string[]; private: boolean; updated_at: string;
      }) => ({
        id: String(r.id),
        name: r.name,
        description: r.description || '',
        language: r.language || 'Unknown',
        languages: r.language ? [r.language] : [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        homepage: r.homepage || '',
        topics: r.topics || [],
        isPrivate: r.private,
        updatedAt: r.updated_at,
        featured: false,
        selected: false,
        source: 'github',
        sourceRecord: {
          platform: 'github',
          sourceUrl: r.html_url,
          fetchedAt: new Date().toISOString(),
          category: 'repositories',
          verified: true,
          externalId: String(r.id),
        },
      }));

    // Collect unique languages
    const languages = [...new Set(repositories.map((r: { language: string }) => r.language).filter(Boolean))];

    const profile = {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio || '',
      avatarUrl: user.avatar_url,
      location: user.location || '',
      company: user.company || '',
      blog: user.blog || '',
      email: user.email || '',
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      repositories,
      languages,
      profileUrl: user.html_url,
      fetchedAt: new Date().toISOString(),
    };

    return Response.json(profile, {
      headers: { 'Cache-Control': 'public, s-maxage=300' }
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Request failed';
    return Response.json({ error: msg }, { status: 502 });
  }
}
