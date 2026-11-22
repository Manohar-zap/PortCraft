'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Wrench,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function WastelandSurvivorTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'MAD MAX';

  return (
    <div className="relative min-h-screen bg-[#110E0C] text-[#E7E5E4] font-mono selection:bg-[#FBBF24] selection:text-black overflow-x-hidden">
      {/* Hazard Caution Bar */}
      <div
        className="h-3 w-full border-b-2 border-black"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #FBBF24, #FBBF24 10px, #000 10px, #000 20px)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== GEIGER STATUS BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between border-2 border-[#B45309] bg-[#1C1613] p-3 shadow-lg text-xs">
          <div className="flex items-center gap-2 text-[#FBBF24]">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-black uppercase tracking-wider">
              WASTELAND SECTOR 04 // GEIGER: 0.12 mSv/h // PURIFIED WATER: 80%
            </span>
          </div>
          <span className="text-[#10B981] font-bold">STATUS: SURVIVING</span>
        </div>

        {/* ===================== SURVIVOR HERO ===================== */}
        <header className="border-3 border-[#B45309] bg-gradient-to-br from-[#261C16] via-[#14100E] to-[#2B180F] p-6 sm:p-10 relative shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 border-4 border-[#B45309] p-1 bg-black shadow-[6px_6px_0_#FBBF24] overflow-hidden">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-125 saturate-50" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="text-xs text-[#FBBF24] uppercase tracking-widest font-black mb-1">
                RUST FRONTIER SCAVENGER & SCRAP ARCHITECT
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[3px_3px_0_#B45309]">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-[#FBBF24] uppercase mt-1">
                {personal.title || 'Post-Apocalyptic Engineer & System Scavenger'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#120E0C] border-l-3 border-[#FBBF24] p-4 font-sans">
                {personal.bio ||
                  'Salvaging functional components from the ruins of legacy architectures. Rebuilding resilient, rugged software that can survive total infrastructure collapse.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#FBBF24] bg-[#2E1F18] text-[#FBBF24] hover:bg-[#FBBF24] hover:text-black px-3 py-1.5 transition-colors font-bold uppercase"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>RADIO CALLSIGN</span>
                  </a>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#B45309] bg-[#2E1F18] text-white hover:bg-[#B45309] px-3 py-1.5 transition-colors font-bold uppercase"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>SCRAP LOGS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== SALVAGED BUILDS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#B45309] pb-3">
            <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
              SALVAGED BUILDS & RIGS
            </h2>
            <span className="text-xs text-[#FBBF24]">[{projects.length} RIGS RUNNING]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-[#442E24] bg-[#1A1411] p-6 hover:border-[#FBBF24] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-3 text-neutral-400">
                    <span className="text-[#FBBF24]">RIG #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#B45309] text-white text-[9px] font-black px-2 py-0.5 uppercase">
                        WAR RIG
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

                <div className="mt-5 pt-3 border-t border-[#442E24] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#261C17] text-[#FBBF24] px-2 py-0.5 text-[10px] border border-[#54382B]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Blueprint
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Fire Up
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SALVAGE CAPABILITIES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#B45309] pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              SCAVENGER CAPABILITIES & TOOLS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#442E24] bg-[#1A1411] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#FBBF24] mt-1 font-bold">
                  DURABILITY: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SURVIVAL CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-[#442E24] pt-8 font-sans">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#FBBF24] font-bold mb-4">
              EXPEDITION SURVIVAL MILESTONES
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#FBBF24] pl-4">
                  <div className="text-base font-bold text-white uppercase font-mono">{exp.position}</div>
                  <div className="text-xs text-[#B45309] font-mono">{exp.company} // {exp.startDate} - {exp.endDate || 'Now'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#B45309] font-bold mb-4">
              PRE-WAR ACADEMY ARCHIVES
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#B45309] pl-4">
                  <div className="text-base font-bold text-white uppercase font-mono">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-2 border-[#B45309] bg-[#1A1411] p-4 text-center text-xs text-neutral-500">
          WASTELAND SURVIVOR NETWORK // OUTPOST REGISTER • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
