'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Sparkles,
  BookOpen,
  Compass,
  ExternalLink,
  Mail,
  MapPin,
  Moon,
  Flame,
  Award,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function MysticDimensionTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'DOCTOR STEPHEN STRANGE';

  return (
    <div className="relative min-h-screen bg-[#0C061A] text-[#F3E8FF] font-serif selection:bg-[#F59E0B] selection:text-black overflow-x-hidden">
      {/* Background Arcane Mandala SVG */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[650px] h-[650px] pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_120s_linear_infinite]" fill="none">
          <circle cx="250" cy="250" r="230" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="250" cy="250" r="180" stroke="#D946EF" strokeWidth="2" />
          <polygon points="250,30 430,360 70,360" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="250,470 430,140 70,140" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="250" cy="250" r="110" stroke="#A855F7" strokeWidth="3" strokeDasharray="4 6" />
          <circle cx="250" cy="250" r="50" stroke="#F59E0B" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== SANCTUM BANNER ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#F59E0B]/30 bg-[#170C33]/80 px-5 py-3 shadow-[0_0_20px_rgba(245,158,11,0.15)] font-sans text-xs">
          <div className="flex items-center gap-2 text-[#F59E0B]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              SANCTUM SANCTORUM ARCHIVES // DIMENSIONAL DISPATCH
            </span>
          </div>
          <div className="text-purple-300 font-mono text-[11px]">
            PLANE OF EXISTENCE: PRIME MATERIAL
          </div>
        </div>

        {/* ===================== SORCERER HERO ===================== */}
        <header className="border-2 border-[#F59E0B]/40 bg-gradient-to-b from-[#1C0F3D] to-[#120829] p-8 sm:p-12 shadow-[0_0_50px_rgba(217,70,239,0.15)] text-center relative overflow-hidden">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-4 border-[#F59E0B] p-1 shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-6 overflow-hidden">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full filter contrast-110" />
              </div>
            )}

            <div className="font-sans text-xs uppercase tracking-widest text-[#F59E0B] font-bold mb-2">
              ✦ MASTER OF THE MYSTIC ARTS ✦
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              {fullName}
            </h1>

            <p className="font-sans text-purple-300 text-sm sm:text-base mt-2 font-medium tracking-wide">
              {personal.title || 'Dimensional Architect & Software Sorcerer'}
            </p>

            <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed italic">
              &quot;{personal.bio ||
                'Manipulating the fabric of code across multiple realities, channeling clean distributed spells, and warding systems against chaos.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 font-sans text-xs">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 border border-[#F59E0B] bg-[#2A165A] hover:bg-[#F59E0B] hover:text-black text-[#F59E0B] px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>TRANSMIT PARCHMENT</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-purple-500 bg-[#2A165A] hover:bg-purple-600 text-white px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>SPELLBOOK (GITHUB)</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== GRIMOIRE OF WORKS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="border-b border-[#F59E0B]/30 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#F59E0B]">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                SACRED MANUSCRIPTS & ARTIFACTS
              </h2>
            </div>
            <span className="font-sans text-xs text-purple-300">[{projects.length} GRIMOIRES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#F59E0B]/30 bg-[#160B33] p-6 shadow-xl relative hover:border-[#F59E0B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center font-sans text-xs mb-3 text-purple-300">
                    <span className="text-[#F59E0B] font-bold">CHAPTER #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="border border-[#D946EF] bg-[#D946EF]/20 text-[#D946EF] text-[10px] font-bold px-2 py-0.5 uppercase">
                        FORBIDDEN SPELL
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-4 border border-[#F59E0B]/20 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-2xl font-bold uppercase text-white tracking-tight">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-purple-200 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-900/60 font-sans text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-[#F59E0B]">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#241352] px-2 py-0.5 border border-purple-800">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white flex items-center gap-1">
                        <GithubIcon className="w-3.5 h-3.5" /> Inscription
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Cast Spell
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== MYSTICAL DISCIPLINES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#F59E0B]/30 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              MYSTICAL DISCIPLINES & ARTS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-purple-800/80 bg-[#1A0E3B] p-4 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[11px] text-[#F59E0B] mt-1 font-mono">
                  MASTERY RANK: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SANCTUM CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#F59E0B]/30 pt-10 font-sans">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#F59E0B] font-bold mb-4">
              CHRONICLES OF SACRED DUTY
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#F59E0B] pl-4">
                  <div className="text-base font-bold text-white">{exp.position}</div>
                  <div className="text-xs text-purple-300">
                    {exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-purple-200/80 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#D946EF] font-bold mb-4">
              SANCTUM SCHOLASTIC TRAINING
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#D946EF] pl-4">
                  <div className="text-base font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-purple-300">
                    {edu.degree} in {edu.field} ({edu.startYear} - {edu.endYear})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#F59E0B]/30 bg-[#120726] p-6 text-center font-sans text-xs text-purple-400">
          BY THE VISHANTI • {fullName.toUpperCase()} • SANCTUM SANCTORUM ARCHIVES
        </footer>
      </div>
    </div>
  );
}
