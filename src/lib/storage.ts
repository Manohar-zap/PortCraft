'use client';

import { PortfolioData, DEFAULT_PORTFOLIO } from './types';

const STORAGE_KEY = 'portcraft_portfolio';

/**
 * Migrates old-format portfolio data to the current schema,
 * filling in safe defaults for any missing new fields.
 */
export function migratePortfolioData(old: Partial<PortfolioData>): PortfolioData {
  return {
    // Spread defaults first so every required field is present
    ...DEFAULT_PORTFOLIO,
    // Overlay whatever the old data had
    ...old,
    // Deep-merge sub-objects that existed before
    personal: { ...DEFAULT_PORTFOLIO.personal, ...(old.personal ?? {}) },
    theme: { ...DEFAULT_PORTFOLIO.theme, ...(old.theme ?? {}) },
    // Array fields — keep existing data or fall back to empty array
    education: old.education ?? [],
    experience: old.experience ?? [],
    skills: old.skills ?? [],
    projects: old.projects ?? [],
    achievements: old.achievements ?? [],
    // New platform fields — keep if present, otherwise safe defaults
    repositories: old.repositories ?? [],
    codingStats: old.codingStats ?? undefined,
    publications: old.publications ?? [],
    certifications: old.certifications ?? [],
    platformProfiles: old.platformProfiles ?? undefined,
    importSession: old.importSession ?? undefined,
    aiState: old.aiState ?? undefined,
    sourceRecords: old.sourceRecords ?? [],
  };
}

export function savePortfolio(data: PortfolioData): void {
  try {
    const toSave = { ...data, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save portfolio:', err);
  }
}

export function loadPortfolio(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO;
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return migratePortfolioData(parsed);
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

export function clearPortfolio(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasPortfolio(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as PortfolioData;
    return !!(parsed.personal?.firstName || parsed.personal?.email);
  } catch {
    return false;
  }
}
