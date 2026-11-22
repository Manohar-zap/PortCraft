'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Sparkles,
  ArrowUpRight,
  Zap,
  Mail,
  ExternalLink,
  Layers,
  Flame,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function CreativeStudioTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'STUDIO ZERO';

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#F3F4F6] font-sans selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      {/* ===================== TICKER MARQUEE ===================== */}
      <div className="bg-[#CCFF00] text-black py-2.5 font-black text-xs sm:text-sm uppercase tracking-widest overflow-hidden whitespace-nowrap border-b-2 border-black">
        <div className="inline-block animate-pulse">
          ✦ CREATIVE ENGINEER ✦ DESIGN TECHNOLOGIST ✦ DIGITAL CRAFTSMAN ✦ MULTIVERSE CODE ✦ INTERACTIVE SYSTEMS ✦
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== KINETIC STUDIO HERO ===================== */}
        <header className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="bg-[#8B5CF6] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              INDEPENDENT STUDIO
            </span>
            <span className="font-mono text-xs text-[#CCFF00]">
              {personal.location || 'AVAILABLE INTERNATIONALLY'}
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-none">
            {fullName}
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-xl sm:text-2xl font-bold text-neutral-300 max-w-2xl">
              {personal.title || 'Creative Technologist & Interactive Systems Engineer'}
            </div>

            <div className="flex flex-wrap gap-3">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="bg-[#CCFF00] text-black font-black text-xs px-4 py-2.5 rounded-full hover:bg-white transition-colors uppercase tracking-wider"
                >
                  START A CONVERSATION
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" /> GITHUB
                </a>
              )}
            </div>
          </div>

          {personal.bio && (
            <p className="mt-8 text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed">
              {personal.bio}
            </p>
          )}
        </header>

        {/* ===================== SHOWCASE OF WORKS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              SELECTED WORKS
            </h2>
            <span className="text-[#CCFF00] font-mono text-xs font-bold">
              [{projects.length} PROJECTS]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="group relative rounded-3xl bg-[#12121A] border-2 border-white/10 hover:border-[#CCFF00] p-6 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {p.imageUrl && (
                    <div className="h-52 w-full rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[#8B5CF6] font-bold">
                      CASE #{String(idx + 1).padStart(2, '0')}
                    </span>
                    {p.featured && (
                      <span className="bg-[#FF3366] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        HIGHLIGHT
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#CCFF00] transition-colors">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-white/5 text-[#CCFF00] text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> CODE
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#CCFF00] hover:underline flex items-center gap-1 transition-colors font-black"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> LIVE PROJECT
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CREATIVE ARSENAL (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-white/20 pb-4">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
              SKILL ARSENAL
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="bg-[#181824] hover:bg-[#CCFF00] hover:text-black text-white px-5 py-3 rounded-2xl text-sm font-bold border border-white/10 transition-colors flex items-center gap-2"
              >
                <span>{s.name}</span>
                <span className="text-xs opacity-60">({s.level || 5}/5)</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== TIMELINE CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t-2 border-white/20 pt-10">
          <div>
            <h3 className="text-xl font-black uppercase text-[#8B5CF6] mb-6">
              CAREER HIGHLIGHTS
            </h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#CCFF00] pl-4">
                  <div className="text-lg font-bold text-white uppercase">{exp.position}</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    {exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase text-[#FF3366] mb-6">
              STUDIES & BACKGROUND
            </h3>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#FF3366] pl-4">
                  <div className="text-lg font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    {edu.degree} in {edu.field} ({edu.startYear} - {edu.endYear})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="rounded-3xl bg-[#CCFF00] text-black p-8 text-center font-black uppercase tracking-wider shadow-2xl">
          <div className="text-2xl sm:text-4xl">LET&apos;S BUILD SOMETHING EXTRAORDINARY.</div>
          <div className="text-xs font-mono mt-2 font-bold opacity-80">
            PORTCRAFT CREATIVE STUDIO ENGINE • {fullName}
          </div>
        </footer>
      </div>
    </div>
  );
}
