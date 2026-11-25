'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Sparkles, Check, X, Edit2, Trash2,
  GitBranch, Code2, AlertTriangle, Eye, EyeOff, Star,
  RefreshCw, CheckCircle, Plus, Wand2, Shield, Home
} from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import { loadPortfolio, savePortfolio } from '@/lib/storage';
import { detectDuplicateProjects } from '@/lib/services/duplicateDetector';
import type { PortfolioData, Project, Repository, Skill } from '@/lib/types';

export default function ReviewPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'coding' | 'personal' | 'skills'>('projects');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setData(loadPortfolio());
  }, []);

  const updateData = (patch: Partial<PortfolioData>) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      savePortfolio(next);
      return next;
    });
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-violet-400 animate-pulse flex items-center gap-2">
          <RefreshCw size={18} className="animate-spin" />
          Loading imported profile...
        </div>
      </div>
    );
  }

  // Detect duplicates among projects and repositories
  const projectTitles = data.projects.map((p) => p.title);
  const duplicateGroups = detectDuplicateProjects(projectTitles);

  const toggleRepoSelected = (repoId: string) => {
    const repos = (data.repositories || []).map((r) =>
      r.id === repoId ? { ...r, selected: !r.selected } : r
    );
    // Also sync to projects
    const repo = repos.find((r) => r.id === repoId);
    let projects = [...data.projects];
    if (repo?.selected && !projects.some((p) => p.id === repoId)) {
      projects.push({
        id: repo.id,
        title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
        description: repo.description || '',
        techStack: repo.languages || (repo.language ? [repo.language] : []),
        liveUrl: repo.homepage || '',
        githubUrl: repo.url,
        imageUrl: '',
        featured: repo.featured,
      });
    } else if (!repo?.selected) {
      projects = projects.filter((p) => p.id !== repoId);
    }
    updateData({ repositories: repos, projects });
  };

  const toggleProjectFeatured = (projectId: string) => {
    const projects = data.projects.map((p) =>
      p.id === projectId ? { ...p, featured: !p.featured } : p
    );
    updateData({ projects });
  };

  const removeProject = (projectId: string) => {
    const projects = data.projects.filter((p) => p.id !== projectId);
    const repositories = (data.repositories || []).map((r) =>
      r.id === projectId ? { ...r, selected: false } : r
    );
    updateData({ projects, repositories });
  };

  const mergeDuplicate = (keepIndex: number, removeIndex: number) => {
    const toRemove = data.projects[removeIndex];
    if (!toRemove) return;
    removeProject(toRemove.id);
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: data,
          instructions: aiPrompt || 'Highlight my strongest engineering skills and projects.',
          theme: data.templateId || 'modern',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'AI generation failed' }));
        setAiError(err.error || 'AI generation failed. Check GEMINI_API_KEY.');
        setAiGenerating(false);
        return;
      }

      const result = await res.json();
      if (result.content) {
        const { bio, headline, projectDescriptions } = result.content;
        const updatedProjects = data.projects.map((p) => ({
          ...p,
          description: projectDescriptions?.[p.id] || p.description,
        }));

        updateData({
          personal: {
            ...data.personal,
            bio: bio || data.personal.bio,
            title: headline || data.personal.title,
          },
          projects: updatedProjects,
        });

        setAiSuccess('Portfolio content successfully enhanced by Gemini AI!');
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'AI connection failed');
    }

    setAiGenerating(false);
  };

  const repos = data.repositories || [];
  const github = data.platformProfiles?.github;
  const leetcode = data.platformProfiles?.leetcode;
  const codeforces = data.platformProfiles?.codeforces;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Navbar */}
      <AppHeader
        currentPath="/review"
        pageTitle="Review Data"
        backHref="/dashboard"
        backLabel="Dashboard"
        rightActions={
          <Link
            href="/builder"
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all hover:scale-105"
          >
            Choose Theme & Preview
            <ArrowRight size={13} />
          </Link>
        }
      />

      <div className="pt-20 pb-28 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-500/20 text-violet-300 text-xs px-3 py-1.5 rounded-full mb-3">
            <Shield size={12} />
            User Review & Approval Mode — Nothing is published without your consent
          </div>
          <h1 className="text-3xl font-black font-poppins">
            Review <span className="text-gradient">Imported Information</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Accept, edit, or reject imported projects, verify stats, and optionally use Gemini AI to polish your descriptions.
          </p>
        </div>

        {/* AI Enhancement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-gradient-to-br from-violet-950/40 via-purple-950/20 to-black/40 border border-violet-500/30 rounded-2xl"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <Wand2 size={18} className="text-violet-400" />
            <h2 className="font-bold text-sm text-violet-200">AI Portfolio Enhancement (Google Gemini)</h2>
            <span className="text-[10px] bg-violet-600/30 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full ml-auto">
              Optional
            </span>
          </div>
          <p className="text-xs text-white/50 mb-3">
            Gemini reads your approved projects and statistics to write a compelling bio, headline, and concise project impact summaries.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Custom instructions (e.g. 'Target AI research internships', 'Highlight frontend skills')..."
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              className="flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shrink-0"
            >
              {aiGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
              {aiGenerating ? 'Generating...' : 'Enhance with AI'}
            </button>
          </div>

          {aiSuccess && (
            <div className="mt-3 flex items-center gap-2 text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg p-2.5">
              <CheckCircle size={14} />
              {aiSuccess}
            </div>
          )}
          {aiError && (
            <div className="mt-3 flex items-center gap-2 text-amber-300 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
              <AlertTriangle size={14} />
              {aiError}
            </div>
          )}
        </motion.div>

        {/* Duplicate Warning Alert */}
        {duplicateGroups.length > 0 && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-2">
              <AlertTriangle size={15} />
              Potential Duplicate Projects Detected ({duplicateGroups.length})
            </div>
            {duplicateGroups.map((group, gi) => (
              <div key={gi} className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg mb-1.5 text-xs">
                <span className="text-white/70">
                  Similar: <strong>{group.titles.join('</strong> & <strong>')}</strong>
                </span>
                <button
                  onClick={() => mergeDuplicate(group.indices[0], group.indices[1])}
                  className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded transition-colors"
                >
                  Keep First & Remove Duplicate
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-6 gap-2">
          {[
            { id: 'projects', label: `Projects & Repos (${data.projects.length})`, icon: <GitBranch size={13} /> },
            { id: 'coding', label: 'Coding Stats', icon: <Code2 size={13} /> },
            { id: 'personal', label: 'Personal Info', icon: <Eye size={13} /> },
            { id: 'skills', label: `Skills (${data.skills.length})`, icon: <Star size={13} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-300'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Projects & Repositories */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">
                Choose which projects are featured and visible in your portfolio:
              </div>
              <Link
                href="/builder"
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <Plus size={12} /> Add Custom Project
              </Link>
            </div>

            {data.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 transition-all hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{proj.title}</span>
                      {proj.featured && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full font-semibold">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{proj.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleProjectFeatured(proj.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        proj.featured
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                      }`}
                      title={proj.featured ? 'Unfeature' : 'Mark as Featured'}
                    >
                      <Star size={13} />
                    </button>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                      title="Reject / Remove Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-violet-400 hover:text-violet-300 ml-auto"
                    >
                      View Source ↗
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Imported Repositories Selector */}
            {repos.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="font-bold text-sm mb-3">All Imported GitHub Repositories ({repos.length})</h3>
                <p className="text-xs text-white/50 mb-4">Toggle checkboxes to include repositories as portfolio projects:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {repos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => toggleRepoSelected(repo.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        repo.selected
                          ? 'bg-violet-600/20 border-violet-500/40 text-white'
                          : 'bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs truncate">{repo.name}</div>
                        <div className="text-[10px] text-white/40 truncate">{repo.language || 'Unknown'} · ⭐ {repo.stars}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        repo.selected ? 'bg-violet-600 border-violet-400 text-white' : 'border-white/20'
                      }`}>
                        {repo.selected && <Check size={12} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Coding Stats */}
        {activeTab === 'coding' && (
          <div className="space-y-4">
            <div className="text-xs text-white/60 mb-2">
              Review competitive programming statistics imported from LeetCode, Codeforces, and connected platforms:
            </div>

            {leetcode && (
              <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-orange-400 flex items-center gap-1.5">
                    🧩 LeetCode (@{leetcode.username})
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Solved: <strong className="text-white">{leetcode.totalSolved}</strong> (Easy: {leetcode.easySolved}, Med: {leetcode.mediumSolved}, Hard: {leetcode.hardSolved})
                  </div>
                </div>
                <div className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} /> Verified Public
                </div>
              </div>
            )}

            {codeforces && (
              <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                    ⚔️ Codeforces (@{codeforces.handle})
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    Rating: <strong className="text-white">{codeforces.rating}</strong> ({codeforces.rank}) · Max: {codeforces.maxRating}
                  </div>
                </div>
                <div className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} /> Verified Public
                </div>
              </div>
            )}

            {!leetcode && !codeforces && (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/40 text-xs">
                No coding platforms connected yet.{' '}
                <Link href="/connect" className="text-violet-400 hover:text-violet-300">
                  Connect LeetCode or Codeforces →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personal Information */}
        {activeTab === 'personal' && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 block mb-1">First Name</label>
                <input
                  type="text"
                  value={data.personal.firstName}
                  onChange={(e) => updateData({ personal: { ...data.personal, firstName: e.target.value } })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Last Name</label>
                <input
                  type="text"
                  value={data.personal.lastName}
                  onChange={(e) => updateData({ personal: { ...data.personal, lastName: e.target.value } })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1">Professional Title / Headline</label>
              <input
                type="text"
                value={data.personal.title}
                onChange={(e) => updateData({ personal: { ...data.personal, title: e.target.value } })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1">Bio / About Summary</label>
              <textarea
                rows={4}
                value={data.personal.bio}
                onChange={(e) => updateData({ personal: { ...data.personal, bio: e.target.value } })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 block mb-1">Email</label>
                <input
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => updateData({ personal: { ...data.personal, email: e.target.value } })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1">Location</label>
                <input
                  type="text"
                  value={data.personal.location}
                  onChange={(e) => updateData({ personal: { ...data.personal, location: e.target.value } })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <div
                  key={skill.id || index}
                  className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg"
                >
                  <span>{skill.name}</span>
                  <button
                    onClick={() => {
                      const skills = data.skills.filter((_, i) => i !== index);
                      updateData({ skills });
                    }}
                    className="text-white/30 hover:text-red-400 transition-colors ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-t border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
              <Home size={15} />
              Home
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft size={16} />
              Dashboard
            </Link>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Approve & Select Theme
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
