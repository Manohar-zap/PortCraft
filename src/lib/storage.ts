'use client';

import { PortfolioData, DEFAULT_PORTFOLIO } from './types';

const STORAGE_KEY = 'portcraft_portfolio';

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
    const parsed = JSON.parse(raw) as PortfolioData;
    // Merge with defaults to handle schema migrations
    return {
      ...DEFAULT_PORTFOLIO,
      ...parsed,
      personal: { ...DEFAULT_PORTFOLIO.personal, ...parsed.personal },
      theme: { ...DEFAULT_PORTFOLIO.theme, ...parsed.theme },
    };
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
