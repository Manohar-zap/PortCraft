'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/lib/types';
import {
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Zap,
  Award,
  Layers,
  ArrowUpRight,
  Shield,
  Radio,
  FileCode2,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function SpiderVerseTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats, platformProfiles } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'MILES MORALES';
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');

  const filteredProjects = activeTab === 'featured'
    ? projects.filter((p) => p.featured)
    : projects;

  return (
    <div className="relative min-h-screen bg-[#08080E] text-[#F3F4F6] font-sans selection:bg-[#E32636] selection:text-white overflow-x-hidden">
      {/* ===================== AMBIENT SVG BACKGROUND & HALFTONE ===================== */}
      {/* Halftone comic dot matrix */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #E32636 1.2px, transparent 1.2px), radial-gradient(circle, #00F0FF 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Comic Action Speed Lines */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.06) 40px, rgba(255,255,255,0.06) 42px)',
        }}
      />

      {/* Corner Spider Web SVG Top-Right */}
      <svg
        className="fixed -top-10 -right-10 w-80 h-80 pointer-events-none z-0 opacity-25 text-[#00F0FF]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M 200 0 L 0 200" strokeDasharray="3 3" />
        <path d="M 200 0 L 50 200" />
        <path d="M 200 0 L 100 200" />
        <path d="M 200 0 L 150 200" />
        <path d="M 200 0 L 0 150" />
        <path d="M 200 0 L 0 100" />
        <path d="M 200 0 L 0 50" />
        {/* Radial Web Rings */}
        <path d="M 170 30 Q 150 80 120 120 Q 80 150 30 170" />
        <path d="M 140 60 Q 120 100 90 140 Q 60 160 20 180" />
        <path d="M 110 90 Q 90 130 60 160 Q 40 180 10 190" />
        <path d="M 185 15 Q 165 50 140 80 Q 90 120 50 150" />
      </svg>

      {/* Corner Spider Web SVG Bottom-Left */}
      <svg
        className="fixed -bottom-10 -left-10 w-72 h-72 pointer-events-none z-0 opacity-20 text-[#E32636]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M 0 200 L 200 0" strokeDasharray="3 3" />
        <path d="M 0 200 L 150 0" />
        <path d="M 0 200 L 100 0" />
        <path d="M 0 200 L 50 0" />
        <path d="M 0 200 L 200 50" />
        <path d="M 0 200 L 200 100" />
        <path d="M 0 200 L 200 150" />
        <path d="M 30 170 Q 80 150 120 120 Q 150 80 170 30" />
        <path d="M 60 140 Q 100 120 140 90 Q 160 60 180 20" />
      </svg>

      {/* Floating Graffiti Sound-Effects Stickers */}
      <div className="fixed top-24 right-6 pointer-events-none z-0 hidden lg:block select-none">
        <div className="rotate-12 bg-[#FFE600] text-black font-black text-xs px-3 py-1 border-2 border-black shadow-[4px_4px_0_#E32636] uppercase tracking-wider">
          THWIP!
        </div>
      </div>
      <div className="fixed bottom-28 left-6 pointer-events-none z-0 hidden lg:block select-none">
        <div className="-rotate-12 bg-[#E32636] text-white font-black text-xs px-3 py-1 border-2 border-black shadow-[4px_4px_0_#00F0FF] uppercase tracking-wider">
          LEAP OF FAITH ✦
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ===================== COMIC HEADER BAR ===================== */}
        <header className="relative mb-12">
          {/* Top Issue Tag Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black bg-[#11111B] p-3 px-4 shadow-[6px_6px_0_#E32636]">
            <div className="flex items-center gap-2">
              <span className="bg-[#E32636] text-white text-[11px] font-black px-2.5 py-0.5 uppercase tracking-widest border border-black shadow-[2px_2px_0_#FFE600]">
                EARTH-1610
              </span>
              <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
                PORTFOLIO-VERSE // VOL. 01
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
                ONLINE
              </span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="hidden sm:inline text-neutral-300">NYC BROOKLYN SECTOR</span>
            </div>
          </div>

          {/* Hero Banner Box with Skewed Dynamic Panels */}
          <div className="relative mt-4 border-4 border-black bg-gradient-to-br from-[#1A0B1E] via-[#0E0F1D] to-[#0A1224] p-6 sm:p-10 shadow-[8px_8px_0_#00F0FF] overflow-hidden">
            {/* Chromatic aberration highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E32636] via-[#FFE600] to-[#00F0FF]" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Avatar & Glitch Poster */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="relative group">
                  {/* Comic Frame behind avatar */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#E32636] to-[#00F0FF] rounded-none rotate-3 opacity-80 group-hover:rotate-6 transition-transform" />
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 border-4 border-black bg-black overflow-hidden shadow-[6px_6px_0_#FFE600]">
                    {personal.avatar ? (
                      <img
                        src={personal.avatar}
                        alt={fullName}
                        className="w-full h-full object-cover filter contrast-125 saturate-125"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#E32636] to-[#11111B] text-white">
                        <Zap className="w-14 h-14 text-[#FFE600] animate-bounce" />
                        <span className="font-black text-xs uppercase tracking-widest mt-2">AGENT</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="bg-[#FFE600] text-black font-black text-xs px-2.5 py-1 uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000]">
                    LVL. 99 WEB-SLINGER
                  </span>
                </div>
              </div>

              {/* Right Column: Title, Headline & Hero Pitch */}
              <div className="md:col-span-8">
                <div className="inline-block bg-[#E32636] text-white font-black text-xs sm:text-sm px-3 py-1 uppercase tracking-widest mb-3 border-2 border-black -skew-x-6 shadow-[3px_3px_0_#FFE600]">
                  {personal.title || 'FULL-STACK SOFTWARE ENGINEER & ARCHITECT'}
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none drop-shadow-[4px_4px_0_#E32636]">
                  {fullName}
                </h1>

                {/* Comic Speech Bubble for Bio */}
                <div className="relative mt-6 p-4 sm:p-5 bg-[#141523] border-3 border-white/20 text-neutral-200 text-sm sm:text-base leading-relaxed shadow-[5px_5px_0_#00F0FF]">
                  <div className="absolute -top-3 left-6 bg-[#00F0FF] text-black font-black text-[10px] px-2 py-0.5 uppercase tracking-widest border border-black">
                    ORIGIN STATEMENT
                  </div>
                  <p>
                    {personal.bio ||
                      'Swinging through complex technical architectures, building resilient digital realities, and crafting high-impact code. Ready for any mission across the multiverse.'}
                  </p>
                </div>

                {/* Quick Info & Social Connectors */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {personal.email && (
                    <a
                      href={`mailto:${personal.email}`}
                      className="flex items-center gap-1.5 bg-[#1C1D2E] hover:bg-[#E32636] text-white text-xs font-bold px-3 py-2 border-2 border-black shadow-[3px_3px_0_#00F0FF] transition-all duration-150"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{personal.email}</span>
                    </a>
                  )}
                  {personal.location && (
                    <div className="flex items-center gap-1.5 bg-[#1C1D2E] text-neutral-300 text-xs font-bold px-3 py-2 border-2 border-black shadow-[3px_3px_0_#FFE600]">
                      <MapPin className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span>{personal.location}</span>
                    </div>
                  )}
                  {personal.github && (
                    <a
                      href={personal.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#1C1D2E] hover:bg-[#00F0FF] hover:text-black text-white text-xs font-bold px-3 py-2 border-2 border-black shadow-[3px_3px_0_#E32636] transition-all duration-150"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GITHUB</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                  {personal.linkedin && (
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#1C1D2E] hover:bg-[#00F0FF] hover:text-black text-white text-xs font-bold px-3 py-2 border-2 border-black shadow-[3px_3px_0_#FFE600] transition-all duration-150"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LINKEDIN</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================== MULTIVERSE STATS BANNER ===================== */}
        {codingStats && (() => {
          const lcRating = codingStats.ratings?.find(r => r.platform.toLowerCase().includes('leetcode'))?.rating;
          const cfRating = codingStats.ratings?.find(r => r.platform.toLowerCase().includes('codeforces'))?.rating;
          const cfRank = codingStats.ratings?.find(r => r.platform.toLowerCase().includes('codeforces'))?.rank;

          return (
            <section className="mb-14">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border-3 border-black bg-gradient-to-b from-[#1C1D2E] to-[#12131F] p-4 shadow-[5px_5px_0_#E32636]">
                  <div className="text-[10px] font-mono text-[#E32636] uppercase font-bold tracking-widest">
                    ALGORITHMS SOLVED
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {codingStats.totalProblemsSolved || 0}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    E:{codingStats.easySolved || 0} | M:{codingStats.mediumSolved || 0} | H:{codingStats.hardSolved || 0}
                  </div>
                </div>

                <div className="border-3 border-black bg-gradient-to-b from-[#1C1D2E] to-[#12131F] p-4 shadow-[5px_5px_0_#00F0FF]">
                  <div className="text-[10px] font-mono text-[#00F0FF] uppercase font-bold tracking-widest">
                    LEETCODE RATING
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {lcRating ? Math.round(lcRating) : 'RANKED'}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    TOP TIER COMPETITOR
                  </div>
                </div>

                <div className="border-3 border-black bg-gradient-to-b from-[#1C1D2E] to-[#12131F] p-4 shadow-[5px_5px_0_#FFE600]">
                  <div className="text-[10px] font-mono text-[#FFE600] uppercase font-bold tracking-widest">
                    CODEFORCES RATING
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {cfRating || 'ACTIVE'}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    {cfRank || 'CANDIDATE MASTER'}
                  </div>
                </div>

                <div className="border-3 border-black bg-gradient-to-b from-[#1C1D2E] to-[#12131F] p-4 shadow-[5px_5px_0_#E32636]">
                  <div className="text-[10px] font-mono text-[#E32636] uppercase font-bold tracking-widest">
                    DEPLOYED MISSIONS
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    {projects.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    PRODUCTION SYSTEMS
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ===================== ACTIVE MISSIONS (PROJECTS) ===================== */}
        <section className="mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-4 h-8 bg-[#E32636] border-2 border-black shadow-[2px_2px_0_#FFE600]" />
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[3px_3px_0_#E32636]">
                ACTIVE MISSIONS & OPERATIONS
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#E32636] text-white shadow-[3px_3px_0_#FFE600]'
                    : 'bg-[#141523] text-neutral-300 hover:bg-[#1E2035]'
                }`}
              >
                ALL ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition-all ${
                  activeTab === 'featured'
                    ? 'bg-[#00F0FF] text-black shadow-[3px_3px_0_#E32636]'
                    : 'bg-[#141523] text-neutral-300 hover:bg-[#1E2035]'
                }`}
              >
                FEATURED ONLY
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative border-4 border-black bg-[#10111D] p-6 shadow-[8px_8px_0_#E32636] hover:shadow-[12px_12px_0_#00F0FF] transition-all duration-200"
              >
                {/* Mission Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-black text-[#FFE600] uppercase tracking-wider bg-black/60 px-2 py-0.5 border border-white/10">
                    MISSION #{String(idx + 1).padStart(2, '0')}
                  </span>
                  {p.featured && (
                    <span className="bg-[#FFE600] text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest border border-black shadow-[2px_2px_0_#E32636]">
                      PRIORITY ALPHA ✦
                    </span>
                  )}
                </div>

                {/* Project Image Preview if available */}
                {p.imageUrl && (
                  <div className="relative mb-4 h-44 w-full border-2 border-black bg-black overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">
                  {p.title}
                </h3>

                <p className="mt-3 text-neutral-300 text-sm leading-relaxed min-h-[4rem]">
                  {p.description}
                </p>

                {/* Tech Stack Comic Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-[#1A1C2C] text-[#00F0FF] text-[11px] font-mono font-bold px-2.5 py-0.5 border border-black shadow-[2px_2px_0_#000]"
                    >
                      #{tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="mt-6 pt-4 border-t-2 border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#1C1D2E] hover:bg-[#E32636] text-white text-xs font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#FFE600] transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>SOURCE CODE</span>
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#00F0FF] hover:bg-[#FFE600] text-black text-xs font-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#E32636] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>LIVE DEMO</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    STATUS: DEPLOYED
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===================== SPIDER-SENSE TECH CAPABILITIES (SKILLS) ===================== */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-4 h-8 bg-[#00F0FF] border-2 border-black shadow-[2px_2px_0_#E32636]" />
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[3px_3px_0_#00F0FF]">
              SPIDER-SENSE CAPABILITIES & TECH ARSENAL
            </h2>
          </div>

          <div className="border-4 border-black bg-[#0F101C] p-6 sm:p-8 shadow-[8px_8px_0_#FFE600]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="relative border-2 border-black bg-[#161828] p-3 shadow-[4px_4px_0_#E32636] hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-bold text-sm text-white">{skill.name}</span>
                    <span className="font-mono text-[10px] font-black text-[#FFE600]">
                      LVL.{skill.level || 5}/5
                    </span>
                  </div>
                  {/* Skill Power Gauge Bar */}
                  <div className="w-full h-2.5 bg-black border border-neutral-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E32636] via-[#FFE600] to-[#00F0FF]"
                      style={{ width: `${((skill.level || 5) / 5) * 100}%` }}
                    />
                  </div>
                  {skill.category && (
                    <div className="mt-2 text-[9px] font-mono uppercase text-neutral-400">
                      {skill.category}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== MULTIVERSE TIMELINE (EXPERIENCE & EDUCATION) ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Experience Strip */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-8 bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#E32636]" />
              <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0_#FFE600]">
                TACTICAL FIELD HISTORY
              </h2>
            </div>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border-3 border-black bg-[#121321] p-5 shadow-[6px_6px_0_#00F0FF]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-black uppercase text-white">{exp.position}</h3>
                    <span className="bg-[#E32636] text-white font-mono font-bold text-[10px] px-2 py-0.5 border border-black">
                      {exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#00F0FF] mt-1">{exp.company}</div>
                  {exp.location && (
                    <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FFE600]" />
                      {exp.location}
                    </div>
                  )}
                  {exp.description && (
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-2.5 space-y-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-1.5">
                          <span className="text-[#FFE600] font-black">✦</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education Strip */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-8 bg-[#E32636] border-2 border-black shadow-[2px_2px_0_#00F0FF]" />
              <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0_#E32636]">
                ACADEMY RECORD
              </h2>
            </div>

            <div className="space-y-6">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="border-3 border-black bg-[#121321] p-5 shadow-[6px_6px_0_#FFE600]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-black uppercase text-white">{edu.institution}</h3>
                    <span className="bg-[#FFE600] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#FFE600] mt-1">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  {edu.gpa && (
                    <div className="mt-1 text-xs font-mono text-[#00F0FF]">
                      ACADEMIC INDEX / GPA: {edu.gpa}
                    </div>
                  )}
                  {edu.description && (
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}

              {/* Multiverse Honours / Achievements */}
              {achievements.length > 0 && (
                <div className="border-3 border-black bg-[#15172A] p-5 shadow-[6px_6px_0_#E32636]">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-[#FFE600]" />
                    <h3 className="text-base font-black uppercase text-white">COMMENDATIONS & HONOURS</h3>
                  </div>
                  <div className="space-y-2.5">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="border-l-2 border-[#E32636] pl-3 py-1">
                        <div className="font-bold text-xs text-white uppercase">{ach.title}</div>
                        <div className="text-[10px] font-mono text-[#00F0FF]">
                          {ach.issuer} {ach.date && `• ${ach.date}`}
                        </div>
                        {ach.description && (
                          <div className="text-xs text-neutral-400 mt-0.5">{ach.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ===================== FOOTER COMIC STRIP ===================== */}
        <footer className="border-4 border-black bg-[#10111E] p-6 text-center shadow-[6px_6px_0_#00F0FF]">
          <div className="font-black text-sm uppercase tracking-widest text-[#FFE600]">
            WHAT MAKES YOU DIFFERENT IS WHAT MAKES YOU SPIDER-MAN.
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400">
            PORTCRAFT // EARTH-1610 PROTOCOL • {fullName} • BUILT WITH DETERMINISTIC ARCHITECTURE
          </div>
        </footer>
      </div>
    </div>
  );
}
