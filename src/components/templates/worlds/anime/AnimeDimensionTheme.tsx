'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Flame,
  Zap,
  Sword,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function AnimeDimensionTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'PROTAGONIST';

  return (
    <div className="relative min-h-screen bg-[#07080E] text-[#F3F4F6] font-sans selection:bg-[#F72585] selection:text-white overflow-x-hidden">
      {/* Anime Speed Lines SVG Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 1000 1000" className="w-full h-full" preserveAspectRatio="none">
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
            <line
              key={deg}
              x1="500"
              y1="500"
              x2="500"
              y2="0"
              stroke="#00F5D4"
              strokeWidth="2"
              transform={`rotate(${deg} 500 500)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== SHONEN TOP BANNER ===================== */}
        <div className="flex flex-wrap items-center justify-between border-2 border-[#F72585] bg-[#120D24] p-3 shadow-[0_0_20px_rgba(247,37,133,0.3)]">
          <div className="flex items-center gap-2 text-[#00F5D4]">
            <Flame className="w-5 h-5 text-[#F72585] animate-pulse" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-widest font-mono">
              ANIME DIMENSION // SHONEN CHRONICLES // POWER TIER: S-CLASS
            </span>
          </div>
          <span className="bg-[#F72585] text-white font-black text-xs px-2 py-0.5">
            LIMIT BREAK ACTIVE
          </span>
        </div>

        {/* ===================== PROTAGONIST HERO ===================== */}
        <header className="border-2 border-[#00F5D4] bg-gradient-to-r from-[#170E2E] via-[#0E0C1C] to-[#1F0D2E] p-6 sm:p-10 relative shadow-[0_0_40px_rgba(0,245,212,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Protagonist Avatar */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 border-3 border-[#00F5D4] p-1 bg-black shadow-[0_0_25px_rgba(0,245,212,0.5)]">
                {personal.avatar ? (
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-125" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#180E2B] text-[#F72585]">
                    <Sword className="w-14 h-14" />
                    <span className="text-[10px] font-black uppercase mt-1">HERO</span>
                  </div>
                )}
              </div>
              <div className="mt-3 bg-[#00F5D4] text-black font-black text-xs px-3 py-1 uppercase tracking-widest shadow-[2px_2px_0_#F72585]">
                RANK: SPECIAL GRADE
              </div>
            </div>

            {/* Protagonist Details */}
            <div className="md:col-span-8">
              <div className="text-xs text-[#00F5D4] uppercase tracking-widest font-black mb-1 font-mono">
                THE MAIN PROTAGONIST // NEVER GIVING UP
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(247,37,133,0.6)]">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-[#F72585] uppercase tracking-wider mt-1">
                {personal.title || 'Legendary Code Shinobi & Full-Stack Hero'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#0C0B18]/80 border-l-3 border-[#F72585] p-4">
                &quot;{personal.bio ||
                  'No matter how impossible the architectural challenge seems, I will never break my coding oath. Surpassing my limits every single turn!'}&quot;
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#F72585] bg-[#180E2B] text-white hover:bg-[#F72585] px-3 py-1.5 transition-colors font-bold"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#00F5D4] bg-[#180E2B] text-white hover:bg-[#00F5D4] hover:text-black px-3 py-1.5 transition-colors font-bold"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>TECHNIQUES</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== BOSS BATTLES (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#F72585] pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              BOSS BATTLES & S-RANK MISSIONS
            </h2>
            <span className="font-mono text-xs text-[#00F5D4]">[{projects.length} CLEARED]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-[#2E184D] bg-[#120B24] p-5 hover:border-[#00F5D4] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-3">
                    <span className="text-[#00F5D4] font-bold">
                      ARC #{String(idx + 1).padStart(2, '0')} // EPISODIC CLIMAX
                    </span>
                    {p.featured && (
                      <span className="bg-[#F72585] text-white text-[9px] font-black px-2 py-0.5 uppercase">
                        S-RANK CLEAR
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 border border-neutral-700 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter saturate-125" />
                    </div>
                  )}

                  <h3 className="text-xl font-black uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#241344] text-[#00F5D4] border border-purple-800 px-2 py-0.5 text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Scroll
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#F72585] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Engage
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SPIRIT TECHNIQUES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#00F5D4] pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              INHERITED TECHNIQUES & JUTSU ARSENAL
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-purple-800 bg-[#140C29] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#00F5D4] mt-1 font-black">
                  MASTERY: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== STORY ARCS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-neutral-800 pt-8 font-sans">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#F72585] font-bold mb-4">
              CHRONICLES OF BATTLES & ARCS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#F72585] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="text-xs text-[#00F5D4] font-mono">{exp.company}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#00F5D4] font-bold mb-4">
              TRAINING ACADEMY ARCHIVES
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#00F5D4] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-2 border-[#F72585] bg-[#120B24] p-4 text-center font-mono text-xs text-neutral-400">
          SHONEN HERO ARCHIVE // BELIEVE IT! • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
