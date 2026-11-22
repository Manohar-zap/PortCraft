'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/lib/types';
import {
  Clock,
  MapPin,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Terminal,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function BentoTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'ALEX RIVERA';

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#E2E8F0] font-sans selection:bg-violet-600 selection:text-white p-4 sm:p-8 lg:p-12">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* ===================== ROW 1: HERO & MICRO-WIDGETS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Hero Bento Card (Col 8) */}
          <div className="md:col-span-8 rounded-3xl bg-[#11131D]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AVAILABLE FOR ROLES & CONTRACTS</span>
              </div>
              {personal.location && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  <span>{personal.location}</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {personal.avatar && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl flex-shrink-0">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {fullName}
                </h1>
                <p className="text-violet-400 font-medium text-base sm:text-lg mt-1">
                  {personal.title || 'Product Engineer & Full-Stack Architect'}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              {personal.bio ||
                'Building intuitive, high-performance web applications and resilient systems. Driven by minimalist product design and meticulous software craftsmanship.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get in touch</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-xl border border-white/10 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </a>
              )}
              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-xl border border-white/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </a>
              )}
            </div>
          </div>

          {/* Micro-Widgets Stack (Col 4) */}
          <div className="md:col-span-4 grid grid-cols-1 gap-6">
            {/* Live Clock Card */}
            <div className="rounded-3xl bg-[#11131D]/80 border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> LOCAL TIME
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">UTC / LIVE</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-wider my-3">
                {currentTime || '12:00:00 PM'}
              </div>
              <div className="text-xs text-neutral-400">
                Synchronized across modern digital timezones.
              </div>
            </div>

            {/* Quick Metrics Card */}
            <div className="rounded-3xl bg-[#11131D]/80 border border-white/10 p-6 backdrop-blur-xl">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                METRICS & VELOCITY
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">{projects.length}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Shipped Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-400">{skills.length}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Core Technologies</div>
                </div>
                {codingStats && (() => {
                  const lcRating = codingStats.ratings?.find(r => r.platform.toLowerCase().includes('leetcode'))?.rating;
                  return (
                    <>
                      <div>
                        <div className="text-2xl font-bold text-cyan-400">
                          {codingStats.totalProblemsSolved || 0}
                        </div>
                        <div className="text-xs text-neutral-400 mt-0.5">Algorithms Solved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-400">
                          {lcRating ? Math.round(lcRating) : 'TOP'}
                        </div>
                        <div className="text-xs text-neutral-400 mt-0.5">Rank Score</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== ROW 2: PROJECTS BENTO (6 & 6) ===================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Code2 className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">FEATURED WORKS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-[#11131D]/80 border border-white/10 p-6 backdrop-blur-xl hover:border-violet-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {p.imageUrl && (
                    <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                      {p.title}
                    </h3>
                    {p.featured && (
                      <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono bg-white/5 text-neutral-300 px-2.5 py-0.5 rounded-md border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Visit
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== ROW 3: SKILLS BENTO CLOUD & CAREER ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tech Stack Pills (Col 6) */}
          <div className="md:col-span-6 rounded-3xl bg-[#11131D]/80 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">SKILLS & ARCHITECTURAL TOOLS</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-cyan-400/50 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-200 transition-colors"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {skill.level || 5}/5
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Career & Experience Timeline (Col 6) */}
          <div className="md:col-span-6 rounded-3xl bg-[#11131D]/80 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">EXPERIENCE & ROLES</h3>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-white/10 pl-3">
                  <div className="flex justify-between items-start text-xs">
                    <span className="font-bold text-white text-sm">{exp.position}</span>
                    <span className="text-neutral-500 font-mono">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-medium mt-0.5">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="rounded-3xl bg-[#11131D]/50 border border-white/5 p-6 text-center text-xs text-neutral-500">
          Designed with Bento Architecture • {fullName} • Crafted with PortCraft
        </footer>
      </div>
    </div>
  );
}
