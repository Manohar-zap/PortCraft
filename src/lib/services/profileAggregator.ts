import type { PortfolioData, PlatformProfiles, CodingStats, Repository } from '@/lib/types';

export function aggregatePlatformData(
  platformProfiles: PlatformProfiles,
  existing: Partial<PortfolioData>
): Partial<PortfolioData> {
  const result: Partial<PortfolioData> = { ...existing };

  // Personal info from GitHub if not set
  const github = platformProfiles.github;
  if (github && !existing.personal?.firstName) {
    const nameParts = (github.name || github.username).split(' ');
    result.personal = {
      ...existing.personal!,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      bio: existing.personal?.bio || github.bio || '',
      github: existing.personal?.github || `https://github.com/${github.username}`,
      website: existing.personal?.website || github.blog || '',
      location: existing.personal?.location || github.location || '',
      avatar: existing.personal?.avatar || github.avatarUrl || '',
    };
  }

  // Repositories from GitHub/GitLab
  const repos: Repository[] = [];
  if (github?.repositories) repos.push(...github.repositories);

  if (repos.length > 0) {
    // Auto-select top 6 by stars as featured
    const sorted = [...repos].sort((a, b) => b.stars - a.stars);
    sorted.slice(0, 6).forEach(r => { r.featured = true; r.selected = true; });
    result.repositories = sorted;

    // Extract projects from selected repos
    const autoProjects = sorted.slice(0, 6).map(r => ({
      id: r.id,
      title: r.name.replace(/-/g, ' ').replace(/_/g, ' '),
      description: r.description || '',
      techStack: r.languages || (r.language ? [r.language] : []),
      liveUrl: r.homepage || '',
      githubUrl: r.url,
      imageUrl: '',
      featured: r.featured,
    }));

    // Only add if user has no manually entered projects
    if (!existing.projects?.length) {
      result.projects = autoProjects;
    }

    // Extract skills from languages
    if (!existing.skills?.length) {
      const langs = [...new Set(repos.map(r => r.language).filter(Boolean))];
      result.skills = langs.map((lang, i) => ({
        id: `lang-${i}`,
        name: lang,
        level: 3,
        category: 'Programming Languages',
      }));
    }
  }

  // Coding stats aggregation
  const codingStats: CodingStats = { ratings: [], platformBreakdown: [] };

  if (platformProfiles.leetcode) {
    const lc = platformProfiles.leetcode;
    codingStats.totalProblemsSolved = (codingStats.totalProblemsSolved || 0) + lc.totalSolved;
    codingStats.easySolved = lc.easySolved;
    codingStats.mediumSolved = lc.mediumSolved;
    codingStats.hardSolved = lc.hardSolved;
    codingStats.badges = lc.badges;
    codingStats.platformBreakdown!.push({
      platform: 'LeetCode',
      solved: lc.totalSolved,
      profileUrl: lc.profileUrl,
    });
  }

  if (platformProfiles.codeforces) {
    const cf = platformProfiles.codeforces;
    codingStats.ratings!.push({
      platform: 'Codeforces',
      rating: cf.rating,
      rank: cf.rank,
      maxRating: cf.maxRating,
    });
    codingStats.platformBreakdown!.push({
      platform: 'Codeforces',
      solved: 0, // Codeforces API doesn't expose this easily
      profileUrl: cf.profileUrl,
    });
  }

  if (codingStats.ratings!.length > 0 || codingStats.platformBreakdown!.length > 0) {
    result.codingStats = codingStats;
  }

  result.platformProfiles = platformProfiles;

  return result;
}
