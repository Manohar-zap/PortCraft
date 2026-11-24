import type { PortfolioData, PlatformProfiles, CodingStats, Repository } from '@/lib/types';
import { DEFAULT_PORTFOLIO } from '@/lib/types';

// List of common template/dummy/placeholder names that should always be replaced by verified platform profile data
const PLACEHOLDER_NAMES = new Set([
  'alex', 'johnson', 'alex johnson',
  'hayden', 'smith', 'hayden smith',
  'john', 'doe', 'john doe',
  'data', 'science', 'science student', 'data science student',
  'p', 'he', 'p he',
  'jane', 'jane doe',
  'user', 'test', 'sample', 'root',
  'vincent', 'miles', 'marcus', 'oliver', 'elliot', 'paul', 'leo', 'elena', 'avery', 'kaelen',
]);

const PLACEHOLDER_LOCATIONS = new Set([
  'mitre avenue, park hill',
  'san francisco, ca',
  'city, country',
  'new york, ny',
  'remote',
]);

export function aggregatePlatformData(
  platformProfiles: PlatformProfiles,
  existing: Partial<PortfolioData>
): Partial<PortfolioData> {
  const result: Partial<PortfolioData> = { ...existing };
  const basePersonal = { ...(DEFAULT_PORTFOLIO.personal), ...(existing.personal || {}) };

  // Personal info from GitHub
  const github = platformProfiles.github;
  if (github) {
    const updatedPersonal = { ...basePersonal };

    // 1. Avatar: Always map GitHub avatar image to profile
    if (github.avatarUrl) {
      updatedPersonal.avatar = github.avatarUrl;
    }

    // 2. Name: If github has a display name or valid user name
    if (github.name && github.name.trim()) {
      const parts = github.name.trim().split(/\s+/).filter(Boolean);
      const ghFirst = parts[0] || '';
      const ghLast = parts.slice(1).join(' ') || '';

      const currentFirst = (updatedPersonal.firstName || '').trim().toLowerCase();
      const currentFull = `${updatedPersonal.firstName || ''} ${updatedPersonal.lastName || ''}`.trim().toLowerCase();
      const isPlaceholder = !currentFirst || PLACEHOLDER_NAMES.has(currentFirst) || PLACEHOLDER_NAMES.has(currentFull);

      // If currently empty, placeholder, or connecting a profile with a distinct real human name
      if (isPlaceholder || (github.name !== github.username && ghFirst.length > 1)) {
        updatedPersonal.firstName = ghFirst;
        updatedPersonal.lastName = ghLast;
      }
    } else if (!updatedPersonal.firstName && github.username) {
      updatedPersonal.firstName = github.username;
    }

    // 3. Location: If github location is provided, replace placeholder or empty location
    if (github.location && github.location.trim()) {
      const currentLoc = (updatedPersonal.location || '').trim().toLowerCase();
      const isPlaceholderLoc = !currentLoc || PLACEHOLDER_LOCATIONS.has(currentLoc) || currentLoc.includes('mitre') || currentLoc.includes('park hill');
      if (isPlaceholderLoc || github.location.trim()) {
        updatedPersonal.location = github.location.trim();
      }
    }

    // 4. GitHub URL
    if (!updatedPersonal.github || updatedPersonal.github.includes('alexjohnson') || updatedPersonal.github.includes('johndoe')) {
      updatedPersonal.github = github.profileUrl || `https://github.com/${github.username}`;
    }

    // 5. Bio
    if (github.bio && github.bio.trim()) {
      if (!updatedPersonal.bio || updatedPersonal.bio.length < 5) {
        updatedPersonal.bio = github.bio.trim();
      }
    }

    // 6. Website
    if (github.blog && github.blog.trim()) {
      if (!updatedPersonal.website || updatedPersonal.website.includes('example.com') || updatedPersonal.website.includes('alexjohnson.dev')) {
        updatedPersonal.website = github.blog.trim();
      }
    }

    // 7. Email
    if (github.email && github.email.trim()) {
      if (!updatedPersonal.email || updatedPersonal.email.includes('example.com') || updatedPersonal.email.includes('haydensmith')) {
        updatedPersonal.email = github.email.trim();
      }
    }

    result.personal = updatedPersonal;
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
        level: 0, // Unknown - remains unrated (0) until user sets it
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
