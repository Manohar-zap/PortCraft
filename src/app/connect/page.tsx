'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Sparkles, Check, X, Loader2,
  RefreshCw, ChevronDown, ChevronUp, AlertCircle, ExternalLink,
  Upload
} from 'lucide-react';
import { PLATFORM_CONNECTORS } from '@/lib/integrations/registry';
import type { ConnectorMeta } from '@/lib/integrations/types';
import { fetchGitHubProfile, validateGitHubUsername } from '@/lib/integrations/github/connector';
import { fetchLeetCodeProfile, validateLeetCodeUsername } from '@/lib/integrations/leetcode/connector';
import { fetchCodeforcesProfile, validateCodeforcesHandle } from '@/lib/integrations/codeforces/connector';
import { createManualHackerRankProfile, validateHackerRankUsername } from '@/lib/integrations/hackerrank/connector';
import { aggregatePlatformData } from '@/lib/services/profileAggregator';
import { loadPortfolio, savePortfolio } from '@/lib/storage';
import type { PlatformProfiles, ImportStatus } from '@/lib/types';

interface PlatformState {
  username: string;
  status: ImportStatus;
  error?: string;
  expanded: boolean;
  data?: unknown;
}

const IMPORT_SESSION_KEY = 'portcraft_import_session';

function loadImportSession(): Record<string, PlatformState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(IMPORT_SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveImportSession(state: Record<string, PlatformState>) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(IMPORT_SESSION_KEY, JSON.stringify(state)); } catch {}
}

export default function ConnectPage() {
  const [platformStates, setPlatformStates] = useState<Record<string, PlatformState>>({});
  const [importedProfiles, setImportedProfiles] = useState<PlatformProfiles>({});

  useEffect(() => {
    const session = loadImportSession();
    setPlatformStates(session);
  }, []);

  const updateState = (id: string, patch: Partial<PlatformState>) => {
    setPlatformStates(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      saveImportSession(next);
      return next;
    });
  };

  const getState = (id: string): PlatformState =>
    platformStates[id] ?? { username: '', status: 'not_connected', expanded: false };

  const connectedCount = Object.values(platformStates).filter(
    s => s.status === 'imported' || s.status === 'partial'
  ).length;

  const handleConnect = async (meta: ConnectorMeta) => {
    const state = getState(meta.id);
    const username = state.username.trim();
    if (!username) {
      updateState(meta.id, { error: `Please enter your ${meta.inputLabel}` });
      return;
    }

    updateState(meta.id, { status: 'connecting', error: undefined });

    try {
      if (meta.id === 'github') {
        if (!validateGitHubUsername(username)) {
          updateState(meta.id, { status: 'failed', error: 'Invalid GitHub username format' });
          return;
        }
        updateState(meta.id, { status: 'importing' });
        const result = await fetchGitHubProfile(username);
        if (result.success) {
          setImportedProfiles(prev => {
            const next = { ...prev, github: result.data };
            const portfolio = loadPortfolio();
            const updated = aggregatePlatformData(next, portfolio);
            savePortfolio({ ...portfolio, ...updated });
            return next;
          });
          updateState(meta.id, { status: 'imported', data: result.data, error: undefined });
        } else {
          updateState(meta.id, { status: 'failed', error: result.error });
        }

      } else if (meta.id === 'leetcode') {
        if (!validateLeetCodeUsername(username)) {
          updateState(meta.id, { status: 'failed', error: 'Invalid LeetCode username' });
          return;
        }
        updateState(meta.id, { status: 'importing' });
        const result = await fetchLeetCodeProfile(username);
        if (result.success) {
          setImportedProfiles(prev => {
            const next = { ...prev, leetcode: result.data };
            const portfolio = loadPortfolio();
            const updated = aggregatePlatformData(next, portfolio);
            savePortfolio({ ...portfolio, ...updated });
            return next;
          });
          updateState(meta.id, { status: 'imported', data: result.data, error: undefined });
        } else {
          updateState(meta.id, { status: 'failed', error: result.error });
        }

      } else if (meta.id === 'codeforces') {
        if (!validateCodeforcesHandle(username)) {
          updateState(meta.id, { status: 'failed', error: 'Invalid Codeforces handle' });
          return;
        }
        updateState(meta.id, { status: 'importing' });
        const result = await fetchCodeforcesProfile(username);
        if (result.success) {
          setImportedProfiles(prev => {
            const next = { ...prev, codeforces: result.data };
            const portfolio = loadPortfolio();
            const updated = aggregatePlatformData(next, portfolio);
            savePortfolio({ ...portfolio, ...updated });
            return next;
          });
          updateState(meta.id, { status: 'imported', data: result.data, error: undefined });
        } else {
          updateState(meta.id, { status: 'failed', error: result.error });
        }

      } else if (meta.id === 'hackerrank') {
        if (!validateHackerRankUsername(username)) {
          updateState(meta.id, { status: 'failed', error: 'Invalid HackerRank username' });
          return;
        }
        // Manual link only
        const profile = createManualHackerRankProfile(username);
        setImportedProfiles(prev => {
          const next = { ...prev, hackerrank: profile };
          const portfolio = loadPortfolio();
          savePortfolio({ ...portfolio, platformProfiles: next });
          return next;
        });
        updateState(meta.id, { status: 'partial', data: profile, error: undefined });

      } else {
        // Platforms without API — just save username as link
        const profileUrl = meta.inputType === 'url' ? username :
          `https://${meta.id === 'geeksforgeeks' ? `auth.geeksforgeeks.org/user/${username}` :
            meta.id === 'codechef' ? `codechef.com/users/${username}` :
            meta.id === 'kaggle' ? `kaggle.com/${username}` :
            `${meta.website.replace('https://', '')}/${username}`}`;
        updateState(meta.id, {
          status: 'partial',
          data: { username, profileUrl, note: meta.capabilities.apiLimitations[0] },
          error: undefined,
        });
      }
    } catch (err) {
      updateState(meta.id, { status: 'failed', error: err instanceof Error ? err.message : 'Connection failed' });
    }
  };

  const handleDisconnect = (id: string) => {
    updateState(id, { status: 'not_connected', data: undefined, error: undefined, username: '' });
    setImportedProfiles(prev => {
      const next = { ...prev };
      delete next[id as keyof PlatformProfiles];
      return next;
    });
  };

  const statusColors: Record<ImportStatus, string> = {
    not_connected: 'text-white/40',
    connecting: 'text-yellow-400',
    importing: 'text-blue-400',
    imported: 'text-green-400',
    partial: 'text-orange-400',
    failed: 'text-red-400',
    manual_required: 'text-orange-300',
  };

  const statusLabels: Record<ImportStatus, string> = {
    not_connected: 'Not connected',
    connecting: 'Connecting...',
    importing: 'Importing...',
    imported: 'Imported ✓',
    partial: 'Linked (manual)',
    failed: 'Failed',
    manual_required: 'Manual required',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40 h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="flex items-center gap-2 font-bold text-lg ml-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <span className="text-sm font-poppins bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            PortCraft — Connect Profiles
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {connectedCount > 0 && (
            <span className="text-xs text-green-400 font-semibold">
              {connectedCount} platform{connectedCount > 1 ? 's' : ''} connected
            </span>
          )}
          <Link
            href="/builder"
            className="text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Skip →
          </Link>
        </div>
      </div>

      <div className="pt-20 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-500/20 text-violet-300 text-xs px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={12} />
            Connect your developer profiles for instant portfolio generation
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-poppins mb-4">
            Connect Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              Digital Profile
            </span>
          </h1>
          <p className="text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
            Connect any platforms below to automatically import your projects, coding stats, and achievements.
            You can also skip this step and fill in details manually.
          </p>
        </motion.div>

        {/* Progress bar */}
        {connectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-green-900/20 border border-green-500/20 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600/30 flex items-center justify-center">
                <Check size={16} className="text-green-400" />
              </div>
              <div>
                <div className="text-green-300 font-semibold text-sm">
                  {connectedCount} platform{connectedCount > 1 ? 's' : ''} connected
                </div>
                <div className="text-green-400/60 text-xs">
                  Your data is ready. Proceed to review your imported profile.
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              View Dashboard
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {PLATFORM_CONNECTORS.map((meta, i) => {
            const state = getState(meta.id);
            const isImporting = state.status === 'connecting' || state.status === 'importing';
            const isConnected = state.status === 'imported' || state.status === 'partial';

            return (
              <motion.div
                key={meta.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-all ${
                  isConnected ? 'border-green-500/30' : 'border-white/[0.08]'
                }`}
              >
                {/* Card Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white/90 shadow-lg"
                        style={{ background: `${meta.color}33`, border: `1px solid ${meta.color}44` }}
                      >
                        {meta.iconEmoji}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{meta.displayName}</div>
                        <div className={`text-xs ${statusColors[state.status]}`}>
                          {statusLabels[state.status]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!meta.capabilities.supportsPublicAccess && (
                        <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/20">
                          Manual
                        </span>
                      )}
                      {isConnected && (
                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      <button
                        onClick={() => updateState(meta.id, { expanded: !state.expanded })}
                        className="text-white/40 hover:text-white transition-colors p-1"
                      >
                        {state.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  <p className="text-white/50 text-xs leading-relaxed mb-3">{meta.description}</p>

                  {/* API Limitation Warning */}
                  {!meta.capabilities.supportsPublicAccess && (
                    <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5 mb-3">
                      <AlertCircle size={13} className="text-orange-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-orange-300/80">{meta.capabilities.apiLimitations[0]}</p>
                    </div>
                  )}

                  {/* Input + Connect */}
                  <AnimatePresence>
                    {(!isConnected || state.expanded) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={state.username}
                            onChange={e => updateState(meta.id, { username: e.target.value, error: undefined })}
                            onKeyDown={e => { if (e.key === 'Enter') handleConnect(meta); }}
                            placeholder={meta.inputPlaceholder}
                            className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                            disabled={isImporting}
                          />
                          {isConnected ? (
                            <button
                              onClick={() => handleDisconnect(meta.id)}
                              className="px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                            >
                              <X size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(meta)}
                              disabled={isImporting || !state.username.trim()}
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                            >
                              {isImporting ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                              {isImporting ? 'Connecting...' : 'Connect'}
                            </button>
                          )}
                        </div>

                        {state.error && (
                          <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
                            <AlertCircle size={12} />
                            {state.error}
                          </div>
                        )}

                        {meta.id === 'linkedin' && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-white/30 text-xs">or</span>
                            <label className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">
                              <Upload size={12} />
                              Upload Resume PDF
                              <input type="file" accept=".pdf,.docx" className="hidden" />
                            </label>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Connected Summary */}
                  {isConnected && !state.expanded && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">@{state.username}</span>
                      <a
                        href={
                          meta.inputType === 'url'
                            ? state.username
                            : meta.id === 'geeksforgeeks'
                              ? `https://auth.geeksforgeeks.org/user/${state.username}`
                              : meta.id === 'codechef'
                                ? `https://codechef.com/users/${state.username}`
                                : meta.id === 'kaggle'
                                  ? `https://kaggle.com/${state.username}`
                                  : meta.id === 'codeforces'
                                    ? `https://codeforces.com/profile/${state.username}`
                                    : `${meta.website}/${state.username}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300"
                      >
                        <ExternalLink size={11} />
                      </a>
                      <button
                        onClick={() => updateState(meta.id, { expanded: true })}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                      >
                        <RefreshCw size={11} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Capability chips */}
                <div className="px-4 pb-3 flex flex-wrap gap-1">
                  {meta.capabilities.canFetchProfile && (
                    <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">Profile</span>
                  )}
                  {meta.capabilities.canFetchStats && (
                    <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">Stats</span>
                  )}
                  {meta.capabilities.canFetchRepositories && (
                    <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">Repos</span>
                  )}
                  {!meta.capabilities.supportsPublicAccess && (
                    <span className="text-[10px] bg-orange-500/10 text-orange-400/70 px-2 py-0.5 rounded-full">
                      URL Link Only
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-white/5 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={15} />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Skip & Enter Manually
            </Link>
            <Link
              href={connectedCount > 0 ? '/dashboard' : '/builder'}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
            >
              {connectedCount > 0 ? 'View My Dashboard' : 'Continue to Builder'}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
