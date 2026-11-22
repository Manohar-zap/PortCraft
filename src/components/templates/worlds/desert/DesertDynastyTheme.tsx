'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Compass,
  Sun,
  Flame,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function DesertDynastyTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'PAUL ATREIDES';

  return (
    <div className="relative min-h-screen bg-[#18110D] text-[#EADBCA] font-serif selection:bg-[#E2B872] selection:text-black overflow-x-hidden">
      {/* SVG Layered Dunes Background */}
      <div className="fixed -bottom-10 left-0 right-0 pointer-events-none z-0 opacity-25">
        <svg viewBox="0 0 1200 400" className="w-full h-auto" fill="none">
          <path d="M0,280 Q300,160 600,240 T1200,180 L1200,400 L0,400 Z" fill="#C2593F" />
          <path d="M0,320 Q450,220 800,290 T1200,260 L1200,400 L0,400 Z" fill="#E2B872" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== EXPEDITION DISPATCH ===================== */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#E2B872]/30 pb-3 font-sans text-xs uppercase tracking-widest text-[#E2B872]">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#E2B872]" />
            <span>THE DUNES OF ARRAKIS // EXPEDITION ARCHIVES</span>
          </div>
          <span>SECTOR: 07-DEEP DESERT</span>
        </div>

        {/* ===================== NOMAD HERO ===================== */}
        <header className="border-t border-b border-[#E2B872]/40 py-12 text-center relative">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-2 border-[#E2B872] p-1 mb-6 overflow-hidden">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full filter sepia-20" />
              </div>
            )}

            <div className="font-sans text-xs uppercase tracking-widest text-[#C2593F] font-bold mb-2">
              DESERT NOMAD & MASTER ARCHITECT
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-wide text-[#E2B872]">
              {fullName}
            </h1>

            <p className="font-sans text-sm sm:text-base text-neutral-300 mt-2 font-medium tracking-wide">
              {personal.title || 'Architect of Resilient Systems & Oasis Infrastructure'}
            </p>

            <p className="mt-6 text-sm sm:text-base text-neutral-300/90 max-w-2xl leading-relaxed italic">
              &quot;{personal.bio ||
                'Navigating shifting technological landscapes like winds over dunes, preserving critical system moisture, and constructing enduring architectures.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 font-sans text-xs">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 border border-[#E2B872] bg-[#2E1E16] hover:bg-[#E2B872] hover:text-black text-[#E2B872] px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>DISPATCH CARAVAN</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-[#C2593F] bg-[#2E1E16] hover:bg-[#C2593F] text-white px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>EXPEDITIONS (GITHUB)</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== EXPEDITIONS & ARTIFACTS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="border-b border-[#E2B872]/30 pb-3 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#E2B872]">
              DISCOVERIES & FORGED ARTIFACTS
            </h2>
            <span className="font-sans text-xs text-neutral-400">[{projects.length} EXPEDITIONS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#E2B872]/30 bg-[#221711] p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center font-sans text-xs mb-3 text-neutral-400">
                    <span className="text-[#E2B872] font-bold">CARAVAN #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="border border-[#C2593F] text-[#C2593F] text-[10px] font-bold px-2 py-0.5 uppercase">
                        MAJOR FIND
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-4 border border-[#E2B872]/20 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter sepia-25" />
                    </div>
                  )}

                  <h3 className="text-2xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2B872]/20 font-sans text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 text-[11px] text-[#E2B872]">
                    {p.techStack.join(' • ')}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Scroll
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#E2B872] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Oasis
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DISCIPLINES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#E2B872]/30 pb-3">
            <h2 className="text-2xl font-black uppercase text-[#E2B872]">
              SURVIVAL DISCIPLINES & CRAFTSMANSHIP
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#E2B872]/20 bg-[#20150F] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#E2B872] mt-1 font-mono uppercase">
                  MASTERY: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CARAVAN CHRONICLES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#E2B872]/30 pt-10 font-sans">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#E2B872] font-bold mb-4">
              CARAVAN JOURNEY LOGS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#E2B872] pl-4">
                  <div className="text-base font-bold text-white">{exp.position}</div>
                  <div className="text-xs text-neutral-400">
                    {exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C2593F] font-bold mb-4">
              GREAT ARCHIVES OF THE SANDS
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#C2593F] pl-4">
                  <div className="text-base font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-neutral-400">
                    {edu.degree} in {edu.field}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-t border-[#E2B872]/30 pt-6 text-center font-sans text-xs text-neutral-500 uppercase tracking-widest">
          DESERT DYNASTY CHRONICLES • {fullName.toUpperCase()} • MAY THY KNIFE CHIP AND SHATTER
        </footer>
      </div>
    </div>
  );
}
