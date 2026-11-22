'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Compass,
  Shield,
  ExternalLink,
  Mail,
  MapPin,
  Crosshair,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function AssassinTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'EZIO AUDITORE';

  return (
    <div className="relative min-h-screen bg-[#090A0D] text-[#E4DFD7] font-serif selection:bg-[#A91B24] selection:text-white overflow-x-hidden">
      {/* Animus Triangular Grid SVG */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
          <polygon points="400,100 700,700 100,700" stroke="#C5A059" strokeWidth="2" strokeDasharray="10 10" />
          <polygon points="400,250 600,650 200,650" stroke="#A91B24" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== ANIMUS STATUS ===================== */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#C5A059]/40 pb-3 font-sans text-xs uppercase tracking-widest text-[#C5A059]">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#A91B24]" />
            <span>ANIMUS 4.0 // SYNCHRONIZATION RATIO: 100%</span>
          </div>
          <span>MEMORY BLOCK: SEQUENCE 08</span>
        </div>

        {/* ===================== CREED HERO ===================== */}
        <header className="border-t border-b border-[#C5A059]/30 py-12 text-center relative">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 border-2 border-[#A91B24] p-1 mb-6 overflow-hidden bg-black shadow-[0_0_30px_rgba(169,27,36,0.4)]">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-125" />
              </div>
            )}

            <div className="font-sans text-xs uppercase tracking-widest text-[#A91B24] font-bold mb-2">
              NOTHING IS TRUE • EVERYTHING IS PERMITTED
            </div>

            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-wide text-white drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]">
              {fullName}
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#C5A059] mt-2 font-medium tracking-wide">
              {personal.title || 'Master Operative & Software Assassin'}
            </p>

            <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed italic">
              &quot;{personal.bio ||
                'Operating in the dark to serve the light. Eliminating system bottlenecks with surgical stealth, architecting untraceable resilient protocols.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 font-sans text-xs">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 border border-[#A91B24] bg-[#1A0A0C] hover:bg-[#A91B24] text-white px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>TRANSMIT CODEX</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-[#C5A059] bg-[#1A0A0C] hover:bg-[#C5A059] hover:text-black text-white px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>ARCHIVES (GITHUB)</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== CONTRACT MISSIONS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="border-b border-[#C5A059]/30 pb-3 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              SYNCHRONIZED MEMORIES & MISSIONS
            </h2>
            <span className="font-sans text-xs text-[#C5A059]">[{projects.length} CONTRACTS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#C5A059]/30 bg-[#121319] p-6 shadow-xl flex flex-col justify-between hover:border-[#A91B24] transition-all"
              >
                <div>
                  <div className="flex justify-between items-center font-sans text-xs mb-3 text-neutral-400">
                    <span className="text-[#C5A059]">CONTRACT #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#A91B24] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                        HIGH PRIORITY
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-4 border border-[#C5A059]/20 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-125" />
                    </div>
                  )}

                  <h3 className="text-2xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C5A059]/20 font-sans text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 text-[11px] text-[#C5A059]">
                    {p.techStack.join(' • ')}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Codex
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#A91B24] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Execute
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== OPERATIVE CAPABILITIES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#C5A059]/30 pb-3">
            <h2 className="text-2xl font-black uppercase text-white">
              OPERATIVE DISCIPLINE & ARSENAL
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#C5A059]/20 bg-[#14151E] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#C5A059] mt-1 font-mono uppercase">
                  LETHALITY: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#C5A059]/30 pt-10 font-sans">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#A91B24] font-bold mb-4">
              HISTORICAL OPERATIONS TIMELINE
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#A91B24] pl-4">
                  <div className="text-base font-bold text-white">{exp.position}</div>
                  <div className="text-xs text-[#C5A059]">{exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-4">
              BROTHERHOOD CODEX TRAINING
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#C5A059] pl-4">
                  <div className="text-base font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-neutral-400">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-t border-[#C5A059]/30 pt-6 text-center font-sans text-xs text-neutral-500 uppercase tracking-widest">
          ASSASSIN&apos;S CREED ARCHIVE // SYNC COMPLETE • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
