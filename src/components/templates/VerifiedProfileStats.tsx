'use client';

import React from 'react';
import { ExternalLink, CheckCircle, Code2, GitBranch, Trophy, Star } from 'lucide-react';
import type { PortfolioData } from '@/lib/types';

interface Props {
  data: PortfolioData;
}

export default function VerifiedProfileStats({ data }: Props) {
  const leetcode = data.platformProfiles?.leetcode;
  const codeforces = data.platformProfiles?.codeforces;
  const github = data.platformProfiles?.github;
  const stats = data.codingStats;

  const hasStats = leetcode || codeforces || (stats && (stats.totalProblemsSolved || stats.ratings?.length));
  if (!hasStats && !github) return null;

  return (
    <section className="py-12 px-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Verified Digital Profiles & Performance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LeetCode Card */}
          {leetcode && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-orange-500/20 hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-orange-400 flex items-center gap-1.5">
                  🧩 LeetCode
                </span>
                <a
                  href={leetcode.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400/70 hover:text-orange-300"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="text-2xl font-black text-white">{leetcode.totalSolved}</div>
              <div className="text-xs text-white/50 mb-3">Problems Solved</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Easy: {leetcode.easySolved}
                </span>
                <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  Med: {leetcode.mediumSolved}
                </span>
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  Hard: {leetcode.hardSolved}
                </span>
              </div>
            </div>
          )}

          {/* Codeforces Card */}
          {codeforces && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                  ⚔️ Codeforces
                </span>
                <a
                  href={codeforces.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400/70 hover:text-blue-300"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="text-2xl font-black text-white">{codeforces.rating || 'Unrated'}</div>
              <div className="text-xs text-white/50 mb-3">Contest Rating</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-300 capitalize font-medium">{codeforces.rank}</span>
                {codeforces.maxRating > 0 && (
                  <span className="text-white/40">Peak: {codeforces.maxRating}</span>
                )}
              </div>
            </div>
          )}

          {/* GitHub Activity Card */}
          {github && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <GitBranch size={14} /> GitHub
                </span>
                <a
                  href={github.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="text-2xl font-black text-white">{github.publicRepos}</div>
              <div className="text-xs text-white/50 mb-3">Public Repositories</div>
              <div className="flex flex-wrap gap-1">
                {github.languages.slice(0, 4).map((lang) => (
                  <span key={lang} className="text-[10px] bg-white/5 text-white/60 px-2 py-0.5 rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
