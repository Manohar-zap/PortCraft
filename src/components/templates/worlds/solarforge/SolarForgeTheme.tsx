'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Flame,
  Hammer,
  Zap,
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

export default function SolarForgeTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'FORGE MASTER';

  return (
    <div className="relative min-h-screen bg-[#0D0B0A] text-[#F3E8E2] font-mono selection:bg-[#FF5400] selection:text-black overflow-x-hidden">
      {/* Industrial Sparks SVG Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
          <circle cx="150" cy="200" r="3" fill="#FF5400" />
          <circle cx="450" cy="150" r="2.5" fill="#FFD000" />
          <circle cx="700" cy="250" r="3" fill="#FF9E00" />
          <circle cx="250" cy="600" r="2" fill="#FF5400" />
          <circle cx="600" cy="650" r="3" fill="#FFD000" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== FORGE TELEMETRY ===================== */}
        <div className="flex flex-wrap items-center justify-between border-2 border-[#FF5400] bg-[#1C120C] p-3 shadow-[0_0_20px_rgba(255,84,0,0.25)] text-xs">
          <div className="flex items-center gap-2 text-[#FF9E00]">
            <Flame className="w-4 h-4 text-[#FF5400] animate-bounce" />
            <span className="font-black uppercase tracking-wider">
              SOLAR FORGE // FURNACE STATUS: 3,850°K // CASTING ACTIVE
            </span>
          </div>
          <span className="text-[#FFD000] font-bold">ALLOY: TITANIUM-CARBIDE</span>
        </div>

        {/* ===================== FORGE MASTER HERO ===================== */}
        <header className="border-2 border-[#FF5400] bg-gradient-to-br from-[#26150C] via-[#140C07] to-[#2B1006] p-6 sm:p-10 rounded-none relative shadow-[0_0_40px_rgba(255,84,0,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 border-4 border-[#FF5400] p-1 shadow-[0_0_30px_rgba(255,84,0,0.5)] overflow-hidden bg-black">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-125" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="text-xs text-[#FF9E00] uppercase tracking-widest font-black mb-1">
                MASTER BLACKSMITH & CHIEF SYSTEM FOUNDER
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,84,0,0.6)]">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-[#FFD000] uppercase tracking-wider mt-1">
                {personal.title || 'Senior Software Blacksmith & Systems Fabricator'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#120B07] border-l-2 border-[#FF5400] p-4 font-sans">
                {personal.bio ||
                  'Heating raw algorithmic logic in the crucible of distributed computing, striking code into indestructible enterprise infrastructure, and hammering out bugs with absolute precision.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#FF5400] bg-[#2E1408] text-[#FF9E00] hover:bg-[#FF5400] hover:text-black px-3 py-1.5 transition-colors font-bold uppercase"
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
                    className="flex items-center gap-1.5 border border-[#FFD000] bg-[#2E1408] text-white hover:bg-[#FFD000] hover:text-black px-3 py-1.5 transition-colors font-bold uppercase"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>FORGE BUILDS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== FORGED CREATIONS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#FF5400] pb-3">
            <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
              MOLTEN FORGED CREATIONS
            </h2>
            <span className="text-xs text-[#FF9E00]">[{projects.length} CASTINGS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-[#3D1E0E] bg-[#170E08] p-6 hover:border-[#FF5400] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-3 text-neutral-400">
                    <span className="text-[#FF9E00]">INGOT #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#FF5400] text-black text-[9px] font-black px-2 py-0.5 uppercase">
                        MASTERWORK
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 border border-neutral-700 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-125" />
                    </div>
                  )}

                  <h3 className="text-xl font-black uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#3D1E0E] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#2B1408] text-[#FFD000] px-2 py-0.5 text-[10px] border border-[#52250C]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Spec
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF5400] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Ignite
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== TOOLS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#FF5400] pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              CRAFTSMAN TOOLS & FOUNDRY SKILLS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#3D1E0E] bg-[#170E08] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#FF5400] mt-1 font-bold">
                  HEAT RESISTANCE: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== PRODUCTION CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-[#3D1E0E] pt-8 font-sans">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#FF5400] font-bold mb-4">
              FOUNDRY PRODUCTION HISTORY
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#FF5400] pl-4">
                  <div className="text-base font-bold text-white uppercase font-mono">{exp.position}</div>
                  <div className="text-xs text-[#FF9E00] font-mono">{exp.company}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#FFD000] font-bold mb-4">
              GUILD OF MASTER CRAFTSMEN
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#FFD000] pl-4">
                  <div className="text-base font-bold text-white uppercase font-mono">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-2 border-[#FF5400] bg-[#170E08] p-4 text-center text-xs text-neutral-500">
          SOLAR FORGE FOUNDRY \/ HAMMERED IN STEEL \u2022 {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
