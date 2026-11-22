// Simple fuzzy duplicate detection for project titles

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;

  // Word overlap
  const wordsA = new Set(na.split(' '));
  const wordsB = new Set(nb.split(' '));
  const intersection = [...wordsA].filter(w => wordsB.has(w) && w.length > 2);
  if (!wordsA.size || !wordsB.size) return 0;
  return intersection.length / Math.max(wordsA.size, wordsB.size);
}

export interface DuplicateGroup {
  titles: string[];
  indices: number[];
  confidence: number;
}

export function detectDuplicateProjects(titles: string[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const used = new Set<number>();

  for (let i = 0; i < titles.length; i++) {
    if (used.has(i)) continue;
    const group: number[] = [i];
    for (let j = i + 1; j < titles.length; j++) {
      if (used.has(j)) continue;
      const score = similarity(titles[i], titles[j]);
      if (score >= 0.7) {
        group.push(j);
        used.add(j);
      }
    }
    if (group.length > 1) {
      used.add(i);
      groups.push({
        titles: group.map(idx => titles[idx]),
        indices: group,
        confidence: Math.max(...group.slice(1).map(j => similarity(titles[i], titles[j]))),
      });
    }
  }

  return groups;
}
