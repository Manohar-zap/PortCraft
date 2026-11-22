'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Sparkles, Code2, GitBranch, Trophy,
  BookOpen, Briefcase, Star, ExternalLink, RefreshCw,
  CheckCircle, AlertCircle, TrendingUp, Award, Globe
} from 'lucide-react';
import { loadPortfolio } from '@/lib/storage';
import type { PortfolioData, Repository, CodingStats } from '@/lib/types';

export default function DashboardPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<null | {
    completenessScore: number;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    suggestedRoles: string[];
    readinessLevel: string;
  }>(null);

  useEffect(() => {
    setData(loadPortfolio());
  }, []);

  const handleAnalyze = async () => {
    if (!data) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: data }),
      });
      if (res.ok) {
        const result = await res.json();
        setAnalysis(result);
      }
    } catch {}
    setAnalyzing(false);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-violet-400 animate-pulse flex items-center gap-2">
          <RefreshCw size={18} className="animate-spin" />
          Loading profile data...
        </div>
      </div>
    );
  }

  const github = data.platformProfiles?.github;
  const leetcode = data.platformProfiles?.leetcode;
  const codeforces = data.platformProfiles?.codeforces;
  const stats = data.codingStats;
  const repos = data.repositories || [];
  const selectedRepos = repos.filter((r: Repository) => r.selected);
  const connectedPlatforms = Object.keys(data.platformProfiles || {});

  const completenessItems = [
    { label: 'Personal Info', done: !!(data.personal.firstName && data.personal.email) },
    { label: 'Education', done: data.education.length > 0 },
    { label: 'Experience', done: data.experience.length > 0 },
    { label: 'Skills', done: data.skills.length > 0 },
    { label: 'Projects', done: data.projects.length > 0 },
    { label: 'GitHub Connected', done: !!github },
    { label: 'Coding Stats', done: !!stats?.totalProblemsSolved },
    { label: 'Template Selected', done: !!data.templateId },
  ];
  const completenessScore = Math.round((completenessItems.filter(i => i.done).length / completenessItems.length) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40 h-14 flex items-center px-6 gap-4">
        <Link href="/connect" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Connect More
        </Link>
        <div className="flex items-center gap-2 font-bold ml-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <span className="text-sm font-poppins bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            PortCraft — Profile Dashboard
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            {analyzing ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
            AI Analyze
          </button>
          <Link
            href="/builder"
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            Build Portfolio
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="pt-20 pb-24 px-4 md:px-6 max-w-6xl mx-auto">

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {github?.avatarUrl || data.personal.avatar ? (
                <img
                  src={github?.avatarUrl || data.personal.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-2xl font-black">
                  {(data.personal.firstName || github?.name || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0a0a0f] flex items-center justify-center">
                <CheckCircle size={10} className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-black">
                {data.personal.firstName
                  ? `${data.personal.firstName} ${data.personal.lastName}`
                  : github?.name || 'Your Profile'}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {data.personal.title || github?.bio || 'Student / Developer'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {connectedPlatforms.map(p => (
                  <span key={p} className="text-[11px] font-semibold bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2.5 py-1 rounded-full capitalize">
                    {p} ✓
                  </span>
                ))}
                {connectedPlatforms.length === 0 && (
                  <Link href="/connect" className="text-xs text-white/40 hover:text-violet-400 transition-colors">
                    + Connect platforms
                  </Link>
                )}
              </div>
            </div>

            {/* Completeness Ring */}
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="url(#grad)" strokeWidth="3"
                    strokeDasharray={`${completenessScore} ${100 - completenessScore}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{completenessScore}%</span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-1">Complete</p>
            </div>
          </div>

          {/* Completeness checklist */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            {completenessItems.map(item => (
              <div key={item.label} className={`flex items-center gap-2 text-xs ${item.done ? 'text-green-400' : 'text-white/40'}`}>
                {item.done
                  ? <CheckCircle size={12} className="shrink-0" />
                  : <AlertCircle size={12} className="shrink-0" />}
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Analysis Panel */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-violet-900/20 border border-violet-500/30 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-violet-400" />
              <h2 className="font-bold text-violet-200">AI Portfolio Analysis</h2>
              <span className="ml-auto text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                {analysis.readinessLevel}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-2">Strengths</h3>
                {analysis.strengths.map((s, i) => (
                  <div key={i} className="text-xs text-white/70 flex items-start gap-1.5 mb-1">
                    <span className="text-green-400 mt-0.5">✓</span>{s}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-2">Gaps</h3>
                {analysis.gaps.map((g, i) => (
                  <div key={i} className="text-xs text-white/70 flex items-start gap-1.5 mb-1">
                    <span className="text-orange-400 mt-0.5">!</span>{g}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-2">Suggested Roles</h3>
                {analysis.suggestedRoles.map((r, i) => (
                  <span key={i} className="inline-block text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full mr-1 mb-1">{r}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">→</span>{rec}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Coding Stats */}
          {(leetcode || codeforces || stats) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Code2 size={16} className="text-orange-400" />
                </div>
                <h2 className="font-bold text-sm">Coding Stats</h2>
              </div>

              {leetcode && (
                <div className="mb-4 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-300">🧩 LeetCode</span>
                    <a href={leetcode.profileUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className="text-2xl font-black text-white">{leetcode.totalSolved}</div>
                  <div className="text-xs text-white/50 mb-2">Problems Solved</div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-400">E: {leetcode.easySolved}</span>
                    <span className="text-yellow-400">M: {leetcode.mediumSolved}</span>
                    <span className="text-red-400">H: {leetcode.hardSolved}</span>
                  </div>
                </div>
              )}

              {codeforces && (
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-300">⚔️ Codeforces</span>
                    <a href={codeforces.profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className="text-2xl font-black text-white">{codeforces.rating || 'Unrated'}</div>
                  <div className="text-xs text-white/50 mb-1">Rating</div>
                  <div className="text-xs text-blue-300 capitalize">{codeforces.rank}</div>
                  {codeforces.maxRating > 0 && (
                    <div className="text-xs text-white/40 mt-1">Peak: {codeforces.maxRating} ({codeforces.maxRank})</div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* GitHub Repositories */}
          {github && repos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <GitBranch size={16} className="text-white/70" />
                </div>
                <h2 className="font-bold text-sm">GitHub Repos</h2>
                <span className="ml-auto text-xs text-white/40">{github.publicRepos} public</span>
              </div>

              <div className="space-y-2.5">
                {repos.slice(0, 5).map((repo: Repository) => (
                  <div key={repo.id} className={`p-2.5 rounded-lg border transition-all ${repo.selected ? 'border-violet-500/30 bg-violet-500/10' : 'border-white/5 bg-white/[0.02]'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{repo.name}</div>
                        {repo.description && (
                          <div className="text-[10px] text-white/40 truncate">{repo.description}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {repo.language && (
                          <span className="text-[10px] text-white/40">{repo.language}</span>
                        )}
                        {repo.stars > 0 && (
                          <span className="text-[10px] text-yellow-400">⭐ {repo.stars}</span>
                        )}
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70">
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {repos.length > 5 && (
                <div className="mt-3 text-center">
                  <span className="text-xs text-white/40">+{repos.length - 5} more repositories imported</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="text-xs text-white/40">Top Languages</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {github.languages.slice(0, 6).map((lang: string) => (
                    <span key={lang} className="text-[10px] bg-white/5 text-white/60 px-2 py-0.5 rounded-full">{lang}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Trophy size={16} className="text-violet-400" />
              </div>
              <h2 className="font-bold text-sm">Profile Summary</h2>
            </div>

            <div className="space-y-3">
              {[
                { icon: <BookOpen size={13} />, label: 'Education', count: data.education.length, link: '/builder' },
                { icon: <Briefcase size={13} />, label: 'Experience', count: data.experience.length, link: '/builder' },
                { icon: <Star size={13} />, label: 'Skills', count: data.skills.length, link: '/builder' },
                { icon: <Globe size={13} />, label: 'Projects', count: data.projects.length, link: '/builder' },
                { icon: <Award size={13} />, label: 'Achievements', count: data.achievements.length, link: '/builder' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="text-violet-400">{item.icon}</span>
                    {item.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${item.count > 0 ? 'text-white' : 'text-white/30'}`}>
                      {item.count}
                    </span>
                    {item.count === 0 && (
                      <Link href={item.link} className="text-[10px] text-violet-400 hover:text-violet-300">+ Add</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedRepos.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="text-xs text-white/40 mb-1">Featured Repos</div>
                <div className="text-xs font-semibold text-violet-300">{selectedRepos.length} selected for portfolio</div>
              </div>
            )}
          </motion.div>

        </div>

        {/* Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-gradient-to-r from-violet-900/40 to-purple-900/30 border border-violet-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-violet-400" />
              <h3 className="font-bold text-violet-200">Ready to build your portfolio?</h3>
            </div>
            <p className="text-white/50 text-sm">
              Your data is imported. Continue to the builder to review, select a theme, and generate your portfolio with AI assistance.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/connect"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              Connect More
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-105"
            >
              Build Portfolio
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
