'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Compass,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  Waves,
  Anchor,
  Activity,
  Layers,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function DeepSeaExplorerTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'JACQUES COUSTEAU';

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#D1FAE5] font-sans selection:bg-[#00F2FE] selection:text-black overflow-x-hidden">
      {/* Bathymetric Sonar Rings SVG */}
      <div className="fixed top-20 right-10 w-[500px] h-[500px] pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_80s_linear_infinite]" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#00F2FE" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="130" stroke="#4FACFE" strokeWidth="1" />
          <circle cx="200" cy="200" r="80" stroke="#00F2FE" strokeWidth="2" strokeDasharray="3 6" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#00F2FE" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#00F2FE" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== SUBMERSIBLE HUD ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#00F2FE]/40 bg-[#051329]/90 px-4 py-2.5 rounded-xl font-mono text-xs">
          <div className="flex items-center gap-2 text-[#00F2FE]">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              ABYSSAL SUBMERSIBLE // DEPTH: -8,450M CHALLENGER DEEP
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>PRESSURE: 850 ATM</span>
            <span className="text-[#38EF7D]">SONAR: LOCKED</span>
          </div>
        </div>

        {/* ===================== EXPEDITION HERO ===================== */}
        <header className="border border-[#00F2FE]/30 bg-gradient-to-b from-[#071933] to-[#040C1A] p-6 sm:p-10 rounded-2xl relative shadow-[0_0_40px_rgba(0,242,254,0.15)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#00F2FE] p-1 shadow-[0_0_30px_rgba(0,242,254,0.3)] overflow-hidden bg-black">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="flex items-center gap-2 font-mono text-xs text-[#00F2FE] uppercase tracking-wider mb-2">
                <Waves className="w-4 h-4" />
                <span>CHIEF MARINE EXPLORER & SYSTEMS SCIENTIST</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,242,254,0.4)]">
                {fullName}
              </h1>

              <div className="text-sm font-mono text-[#38EF7D] mt-1 font-bold">
                {personal.title || 'Deep-Trench Software Architect & Data Oceanographer'}
              </div>

              <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-sans bg-[#051329]/60 border-l-2 border-[#00F2FE] p-4">
                {personal.bio ||
                  'Navigating the deepest unexplored complexities of distributed architectures, deciphering abyssal telemetry, and building resilient oceanic digital ecosystems.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#00F2FE]/50 hover:bg-[#00F2FE] hover:text-black text-[#00F2FE] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-neutral-700 bg-[#051329] px-3 py-1.5 rounded-lg text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-[#38EF7D]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#00F2FE]/50 hover:bg-[#00F2FE] hover:text-black text-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>EXPEDITION REPOS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== ABYSSAL EXPEDITIONS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00F2FE]/30 pb-3">
            <div className="flex items-center gap-2 text-[#00F2FE]">
              <Anchor className="w-5 h-5" />
              <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
                DEEP-SEA EXPEDITIONS & DIVES
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-400">[{projects.length} LOGS ARCHIVED]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#00F2FE]/30 bg-[#051329]/80 p-6 rounded-2xl hover:border-[#00F2FE] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2 text-neutral-400">
                    <span className="text-[#00F2FE]">DIVE #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#38EF7D]/20 text-[#38EF7D] border border-[#38EF7D] text-[10px] font-bold px-2 py-0.5 rounded">
                        TRENCH BENCHMARK
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-3 rounded-xl overflow-hidden border border-[#00F2FE]/20 bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#00F2FE]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#0A2244] text-[#00F2FE] px-2 py-0.5 rounded text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#00F2FE] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Explore
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== OCEANIC INSTRUMENTS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#00F2FE]/30 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              RESEARCH INSTRUMENTS & ARSENAL
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#00F2FE]/30 bg-[#071933] p-3 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#38EF7D]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-[#030A14] mt-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F2FE] to-[#38EF7D]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== LOGS & VOYAGES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#00F2FE]/30 pt-8 font-sans">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#00F2FE] mb-4 font-bold">
              EXPEDITION VOYAGE LOGS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#00F2FE] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="font-mono text-xs text-[#38EF7D] mt-0.5">
                    {exp.company} // {exp.startDate} - {exp.current ? 'CURRENT' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed font-sans">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#38EF7D] mb-4 font-bold">
              OCEANIC ACCREDITATION & ACADEMIA
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#38EF7D] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="font-mono text-xs text-neutral-400 mt-0.5">
                    {edu.degree} in {edu.field} ({edu.startYear} - {edu.endYear})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#00F2FE]/30 bg-[#051329] p-4 rounded-xl text-center font-mono text-xs text-neutral-400">
          DEEP SEA EXPLORATION FLEET // BATHYMETRIC VESSEL • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
