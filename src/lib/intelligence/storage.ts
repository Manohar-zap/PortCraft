'use client';

import {
  UserProfile,
  Recommendation,
  AnalyticsEvent,
  UserFeedback,
  ConsentSettings,
  ABTest,
  ABTestVariant,
  HeuristicEvaluation,
  UXMetrics,
  DataExport,
  DataDeletionRequest,
  DEFAULT_CONSENT,
  INITIAL_USER_PROFILE,
} from './types';
import { generateId } from '@/lib/types';

// ─── Storage Keys ──────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  USER_PROFILE: 'portcraft_user_profile',
  RECOMMENDATIONS: 'portcraft_recommendations',
  EVENTS: 'portcraft_analytics_events',
  FEEDBACK: 'portcraft_user_feedback',
  CONSENT: 'portcraft_consent_settings',
  AB_TESTS: 'portcraft_ab_tests',
  AB_ASSIGNMENTS: 'portcraft_ab_assignments',
  HEURISTIC_EVALS: 'portcraft_heuristic_evals',
  UX_METRICS: 'portcraft_ux_metrics',
  DELETION_REQUESTS: 'portcraft_deletion_requests',
  SESSION: 'portcraft_session',
} as const;


// ─── Storage Utilities ─────────────────────────────────────────────────────

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
}

function appendToArrayStorage<T>(key: string, item: T, maxLength = 1000): T[] {
  const arr = getStorage<T[]>(key, []);
  arr.unshift(item);
  if (arr.length > maxLength) arr.length = maxLength;
  setStorage(key, arr);
  return arr;
}

// ─── User Profile ──────────────────────────────────────────────────────────

export function getUserProfile(): UserProfile {
  // Only create profile on client side to avoid Math.random() during prerender
  if (typeof window === 'undefined') {
    // Return a minimal profile for SSR - will be replaced on client
    return {
      ...INITIAL_USER_PROFILE,
      id: 'ssr-placeholder',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserProfile;
  }
  
  const profile = getStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  if (!profile) {
    const anonId = getOrCreateAnonymousId();
    const newProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      id: anonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.USER_PROFILE, newProfile);
    return newProfile;
  }
  return profile;
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated: UserProfile = {
    ...current,
    ...profile,
    updatedAt: new Date().toISOString(),
    // Deep merge nested objects
    interests: { ...current.interests, ...profile.interests },
    behaviorProfile: { ...current.behaviorProfile, ...profile.behaviorProfile },
    skillLevel: { ...current.skillLevel, ...profile.skillLevel },
    consent: { ...current.consent, ...profile.consent },
  };
  setStorage(STORAGE_KEYS.USER_PROFILE, updated);
  return updated;
}

export function updateUserProfile(updater: (profile: UserProfile) => UserProfile): UserProfile {
  const current = getUserProfile();
  const updated = updater(current);
  return saveUserProfile(updated);
}

// ─── Recommendations ───────────────────────────────────────────────────────

export function getRecommendations(): Recommendation[] {
  return getStorage<Recommendation[]>(STORAGE_KEYS.RECOMMENDATIONS, []);
}

export function saveRecommendations(recs: Recommendation[]): void {
  setStorage(STORAGE_KEYS.RECOMMENDATIONS, recs);
}

export function addRecommendation(rec: Recommendation): void {
  const recs = getRecommendations();
  recs.unshift(rec);
  // Keep only last 100 recommendations
  if (recs.length > 100) recs.length = 100;
  saveRecommendations(recs);
}

export function updateRecommendation(id: string, updates: Partial<Recommendation>): void {
  const recs = getRecommendations();
  const idx = recs.findIndex(r => r.id === id);
  if (idx !== -1) {
    recs[idx] = { ...recs[idx], ...updates };
    saveRecommendations(recs);
  }
}

export function dismissRecommendation(id: string): void {
  updateRecommendation(id, { dismissedAt: new Date().toISOString() });
}

export function addRecommendationFeedback(id: string, feedback: UserFeedback): void {
  updateRecommendation(id, { feedback });
  saveFeedback(feedback);

  // If user rated this recommendation helpful, learn and boost preferences
  if (feedback.rating === 'helpful') {
    const recs = getRecommendations();
    const rec = recs.find(r => r.id === id);
    if (rec) {
      updateUserProfile(p => {
        const interests = { ...p.interests };
        if (rec.type === 'theme' && rec.action?.payload?.templateId) {
          const tId = rec.action.payload.templateId;
          const preferred = Array.from(new Set([...p.preferredThemes, tId]));
          return { ...p, preferredThemes: preferred };
        }
        if (rec.type === 'skill' && rec.action?.payload?.skill) {
          const skillObj = rec.action.payload.skill;
          const skillName = typeof skillObj === 'string'
            ? skillObj
            : typeof skillObj === 'object' && skillObj && 'name' in skillObj
            ? ((skillObj as { name?: string }).name || '')
            : '';
          if (skillName) {
            const existingTech = interests.technologies.find(t => t.technology.toLowerCase() === skillName.toLowerCase());
            if (existingTech) {
              existingTech.score = Math.min(100, existingTech.score + 15);
              existingTech.trend = 'increasing';
              existingTech.lastInteraction = new Date().toISOString();
            } else {
              interests.technologies.push({
                technology: skillName,
                score: 75,
                confidence: 0.8,
                trend: 'increasing',
                lastInteraction: new Date().toISOString(),
              });
            }
          }
        }
        return { ...p, interests };
      });
    }
  }
}

// ─── Analytics Events ──────────────────────────────────────────────────────

export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent | null {
  const consent = getConsent();
  if (!consent.analytics) {
    return null;
  }
  const fullEvent: AnalyticsEvent = {
    ...event,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  appendToArrayStorage(STORAGE_KEYS.EVENTS, fullEvent, 5000);
  return fullEvent;
}

export function getEvents(filters?: {
  userId?: string;
  sessionId?: string;
  eventType?: AnalyticsEvent['eventType'];
  since?: string;
  limit?: number;
}): AnalyticsEvent[] {
  let events = getStorage<AnalyticsEvent[]>(STORAGE_KEYS.EVENTS, []);
  
  if (filters) {
    if (filters.userId) events = events.filter(e => e.userId === filters.userId);
    if (filters.sessionId) events = events.filter(e => e.sessionId === filters.sessionId);
    if (filters.eventType) events = events.filter(e => e.eventType === filters.eventType);
    if (filters.since) events = events.filter(e => e.timestamp >= filters.since!);
    if (filters.limit) events = events.slice(0, filters.limit);
  }
  
  return events;
}

export function getEventsByType(eventType: AnalyticsEvent['eventType'], limit = 100): AnalyticsEvent[] {
  return getEvents({ eventType, limit });
}

// ─── User Feedback ─────────────────────────────────────────────────────────

export function getFeedback(): UserFeedback[] {
  return getStorage<UserFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
}

export function saveFeedback(feedback: UserFeedback): void {
  const all = getFeedback();
  all.unshift(feedback);
  if (all.length > 500) all.length = 500;
  setStorage(STORAGE_KEYS.FEEDBACK, all);
}

// ─── Consent ───────────────────────────────────────────────────────────────

export function getConsent(): ConsentSettings {
  return getStorage<ConsentSettings>(STORAGE_KEYS.CONSENT, DEFAULT_CONSENT);
}

export function canTrackAnalytics(): boolean {
  if (typeof window === 'undefined') return false;
  return getConsent().analytics === true;
}

export function canTrackPersonalization(): boolean {
  if (typeof window === 'undefined') return false;
  return getConsent().personalization === true;
}

export function saveConsent(consent: Partial<ConsentSettings>): ConsentSettings {
  const current = getConsent();
  const updated: ConsentSettings = {
    ...current,
    ...consent,
    lastUpdated: new Date().toISOString(),
    version: incrementVersion(current.version),
  };
  setStorage(STORAGE_KEYS.CONSENT, updated);
  
  // Also update user profile
  updateUserProfile(p => ({ ...p, consent: updated }));
  
  // If analytics consent is revoked, end active session immediately
  if (updated.analytics === false) {
    endSession();
  }

  // Notify runtime listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('portcraft_consent_changed', { detail: updated }));
  }

  return updated;
}

function incrementVersion(version: string): string {
  const parts = version.split('.').map(Number);
  parts[parts.length - 1] += 1;
  return parts.join('.');
}

// ─── A/B Testing ───────────────────────────────────────────────────────────

export function getABTests(): ABTest[] {
  return getStorage<ABTest[]>(STORAGE_KEYS.AB_TESTS, []);
}

export function saveABTests(tests: ABTest[]): void {
  setStorage(STORAGE_KEYS.AB_TESTS, tests);
}

export function getABAssignment(testId: string): string | null {
  const assignments = getStorage<Record<string, string>>(STORAGE_KEYS.AB_ASSIGNMENTS, {});
  return assignments[testId] || null;
}

export function setABAssignment(testId: string, variantId: string): void {
  const assignments = getStorage<Record<string, string>>(STORAGE_KEYS.AB_ASSIGNMENTS, {});
  assignments[testId] = variantId;
  setStorage(STORAGE_KEYS.AB_ASSIGNMENTS, assignments);
}

export function getVariantForTest(testId: string): ABTestVariant | null {
  const tests = getABTests();
  const test = tests.find(t => t.id === testId && t.status === 'running');
  if (!test) return null;
  
  let variantId = getABAssignment(testId);
  if (!variantId) {
    // Assign based on traffic split
    const rand = Math.random();
    let cumulative = 0;
    for (const variant of test.variants) {
      cumulative += variant.trafficSplit;
      if (rand <= cumulative) {
        variantId = variant.id;
        break;
      }
    }
    if (variantId) setABAssignment(testId, variantId);
  }
  
  return test.variants.find(v => v.id === variantId) || null;
}

export function createABTest(test: Omit<ABTest, 'id' | 'results'>): ABTest {
  const tests = getABTests();
  const newTest: ABTest = {
    ...test,
    id: generateId(),
  };
  tests.push(newTest);
  saveABTests(tests);
  return newTest;
}

// ─── Heuristic Evaluations ─────────────────────────────────────────────────

export function getHeuristicEvaluations(): HeuristicEvaluation[] {
  return getStorage<HeuristicEvaluation[]>(STORAGE_KEYS.HEURISTIC_EVALS, []);
}

export function saveHeuristicEvaluation(evaluation: HeuristicEvaluation): void {
  const all = getHeuristicEvaluations();
  all.unshift(evaluation);
  setStorage(STORAGE_KEYS.HEURISTIC_EVALS, all);
}

// ─── UX Metrics ────────────────────────────────────────────────────────────

export function saveUXMetrics(metrics: UXMetrics): void {
  const all = getStorage<UXMetrics[]>(STORAGE_KEYS.UX_METRICS, []);
  all.unshift(metrics);
  if (all.length > 200) all.length = 200;
  setStorage(STORAGE_KEYS.UX_METRICS, all);
}

export function getUXMetrics(userId?: string): UXMetrics[] {
  const all = getStorage<UXMetrics[]>(STORAGE_KEYS.UX_METRICS, []);
  if (userId) return all.filter(m => m.userId === userId);
  return all;
}

// ─── Session Management ────────────────────────────────────────────────────

export interface SessionData {
  id: string;
  userId: string;
  startedAt: string;
  lastActivity: string;
  pageViews: number;
  events: number;
}

export function getSession(): SessionData | null {
  return getStorage<SessionData | null>(STORAGE_KEYS.SESSION, null);
}

export function startSession(userId: string): SessionData | null {
  const consent = getConsent();
  if (!consent.analytics) return null;

  const session: SessionData = {
    id: generateId(),
    userId,
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    pageViews: 1,
    events: 0,
  };
  setStorage(STORAGE_KEYS.SESSION, session);
  return session;
}

export function updateSession(updates: Partial<SessionData>): SessionData | null {
  const consent = getConsent();
  if (!consent.analytics) return null;

  const session = getSession();
  if (!session) return null;
  const updated = { ...session, ...updates, lastActivity: new Date().toISOString() };
  setStorage(STORAGE_KEYS.SESSION, updated);
  return updated;
}

export function getOrCreateActiveSession(userId: string): SessionData | null {
  const consent = getConsent();
  if (!consent.analytics) return null;

  const existing = getSession();
  const THIRTY_MINUTES = 30 * 60 * 1000;
  if (existing && Date.now() - new Date(existing.lastActivity).getTime() < THIRTY_MINUTES) {
    return updateSession({ lastActivity: new Date().toISOString() }) || existing;
  }
  return startSession(userId);
}

export function endSession(): void {
  setStorage(STORAGE_KEYS.SESSION, null);
}

// ─── Data Export / Deletion ────────────────────────────────────────────────

export function exportAllData(): DataExport {
  const profile = getUserProfile();
  const anonId = getOrCreateAnonymousId();
  const events = getEvents().filter(e => e.userId === profile.id || e.userId === anonId);
  const recommendations = getRecommendations();
  const feedback = getFeedback();
  const assignments = getStorage<Record<string, string>>(STORAGE_KEYS.AB_ASSIGNMENTS, {});
  
  return {
    userProfile: profile,
    events,
    recommendations,
    feedback,
    abTestAssignments: assignments,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
}

export function requestDataDeletion(scope: DataDeletionRequest['scope'] = 'all'): DataDeletionRequest {
  const profile = getUserProfile();
  const request: DataDeletionRequest = {
    userId: profile.id,
    requestId: generateId(),
    requestedAt: new Date().toISOString(),
    scope,
    status: 'pending',
  };
  
  const requests = getStorage<DataDeletionRequest[]>(STORAGE_KEYS.DELETION_REQUESTS, []);
  requests.push(request);
  setStorage(STORAGE_KEYS.DELETION_REQUESTS, requests);
  
  return request;
}

export function processDataDeletion(requestId: string): boolean {
  const requests = getStorage<DataDeletionRequest[]>(STORAGE_KEYS.DELETION_REQUESTS, []);
  const request = requests.find(r => r.requestId === requestId);
  if (!request) return false;
  
  const profile = getUserProfile();
  const anonId = getOrCreateAnonymousId();
  if (request.userId !== profile.id && request.userId !== anonId) return false;
  
  request.status = 'processing';
  setStorage(STORAGE_KEYS.DELETION_REQUESTS, requests);
  
  try {
    switch (request.scope) {
      case 'all':
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
        localStorage.removeItem(STORAGE_KEYS.EVENTS);
        localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
        localStorage.removeItem(STORAGE_KEYS.CONSENT);
        localStorage.removeItem(STORAGE_KEYS.AB_ASSIGNMENTS);
        localStorage.removeItem(STORAGE_KEYS.UX_METRICS);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.HEURISTIC_EVALS);
        localStorage.removeItem('portcraft_has_visited');
        break;
      case 'analytics':
        localStorage.removeItem(STORAGE_KEYS.EVENTS);
        localStorage.removeItem(STORAGE_KEYS.UX_METRICS);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        break;
      case 'recommendations':
        localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);
        break;
      case 'profile':
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        break;
      case 'events':
        localStorage.removeItem(STORAGE_KEYS.EVENTS);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        break;
    }
    
    request.status = 'completed';
    request.completedAt = new Date().toISOString();
    setStorage(STORAGE_KEYS.DELETION_REQUESTS, requests);
    return true;
  } catch {
    request.status = 'failed';
    setStorage(STORAGE_KEYS.DELETION_REQUESTS, requests);
    return false;
  }
}

// ─── Utility: Generate Anonymous ID ────────────────────────────────────────

export function getOrCreateAnonymousId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem('portcraft_anon_id');
  if (!id) {
    id = `anon_${generateId()}`;
    localStorage.setItem('portcraft_anon_id', id);
  }
  return id;
}