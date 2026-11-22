'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Compass,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function FrostbyteTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'DR. VICTOR FRIES';

  return (
    <div className="relative min-h-screen bg-[#070E1B] text-[#E0F2FE] font-sans selection:bg-[#38BDF8] selection:text-black overflow-x-hidden">
      {/* Falling Snow / Frost Shard SVG Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
          <circle cx="100" cy="150" r="2" fill="#BAE6FD" />
          <circle cx="300" cy="80" r="3" fill="#38BDF8" />
          <circle cx="550" cy="200" r="1.5" fill="#FFFFFF" />
          <circle cx="700" cy="100" r="2.5" fill="#BAE6FD" />
          <circle cx="200" cy="500" r="3" fill="#BAE6FD" />
          <circle cx="450" cy="650" r="2" fill="#38BDF8" />
          <circle cx="650" cy="550" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== OUTPOST TELEMETRY ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#38BDF8]/40 bg-[#0E1A33]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl font-mono text-xs shadow-[0_0_20px_rgba(56,189,248,0.15)]">
          <div className="flex items-center gap-2 text-[#38BDF8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="font-bold tracking-widest uppercase">
              ARCTIC OUTPOST 31 // TEMP: -42°C // BLIZZARD BEACON
            </span>
          </div>
          <span className="text-[#BAE6FD]">THERMAL SUIT: SECURE</span>
        </div>

        {/* ===================== ARCTIC HERO ===================== */}
        <header className="border border-[#38BDF8]/30 bg-gradient-to-br from-[#102244] via-[#0C1830] to-[#122750] p-6 sm:p-10 rounded-3xl relative shadow-[0_0_40px_rgba(56,189,248,0.15)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl border-2 border-[#38BDF8] p-1 shadow-[0_0_25px_rgba(56,189,248,0.3)] overflow-hidden bg-black">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-2xl filter contrast-110" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="text-xs font-mono text-[#38BDF8] uppercase tracking-widest font-black mb-1">
                CHIEF CRYOGENIC SCIENTIST & EXPEDITION LEAD
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                {fullName}
              </h1>

              <div className="text-sm font-mono text-[#BAE6FD] mt-1 font-bold">
                {personal.title || 'Polar Systems Architect & Climate Technologist'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#0A162B]/80 border-l-2 border-[#38BDF8] p-4">
                {personal.bio ||
                  'Designing fault-tolerant cryogenic architectures that never freeze under extreme loads. Preserving critical data integrity across the harshest digital blizzards.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#38BDF8] bg-[#162D59] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-black px-3 py-1.5 rounded-xl transition-colors font-bold"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-neutral-700 bg-[#0E1A33] px-3 py-1.5 rounded-xl text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#38BDF8] bg-[#162D59] text-white hover:bg-[#38BDF8] hover:text-black px-3 py-1.5 rounded-xl transition-colors font-bold"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>OUTPOST REPOS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== ARCTIC EXPEDITIONS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#38BDF8]/30 pb-3">
            <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
              ARCTIC EXPERIMENTS & STUDIES
            </h2>
            <span className="font-mono text-xs text-[#38BDF8]">[{projects.length} STUDIES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#1E3A6E] bg-[#0E1C38] p-6 rounded-3xl hover:border-[#38BDF8] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-3 text-neutral-400">
                    <span className="text-[#38BDF8]">EXPERIMENT #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8] text-[9px] font-bold px-2 py-0.5 rounded-full">
                        POLAR DISCOVERY
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 rounded-2xl border border-neutral-700 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1E3A6E] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#172E5C] text-[#38BDF8] px-2 py-0.5 rounded-md text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Paper
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Execute
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CRYOGENIC ARSENAL (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#38BDF8]/30 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              CRYOGENIC ARSENAL & CAPABILITIES
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#1E3A6E] bg-[#0E1C38] p-3 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#38BDF8]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-[#081224] mt-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] to-[#BAE6FD]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== EXPEDITION LOGS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#38BDF8]/30 pt-8">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] font-bold mb-4">
              POLAR EXPEDITION LOGS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#38BDF8] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="text-xs text-[#BAE6FD] font-mono">{exp.company}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#BAE6FD] font-bold mb-4">
              CRYOGENIC INSTITUTE ALUMNI
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#BAE6FD] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#38BDF8]/30 bg-[#0A162B] p-4 rounded-2xl text-center font-mono text-xs text-neutral-500">
          ARCTIC OUTPOST 31 RESEARCH EXPEDITION • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
