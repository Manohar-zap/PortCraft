'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Compass,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  Rocket,
  Globe,
  Layers,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function GalacticFrontierTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'COMMANDER SHEPARD';

  return (
    <div className="relative min-h-screen bg-[#040714] text-[#E0E7FF] font-mono selection:bg-[#38BDF8] selection:text-black overflow-x-hidden">
      {/* Orbital Path SVG Trajectory */}
      <div className="fixed top-10 right-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_100s_linear_infinite]" fill="none">
          <ellipse cx="250" cy="250" rx="220" ry="100" stroke="#38BDF8" strokeWidth="2" strokeDasharray="8 8" transform="rotate(-30 250 250)" />
          <ellipse cx="250" cy="250" rx="180" ry="80" stroke="#FB923C" strokeWidth="1" transform="rotate(45 250 250)" />
          <circle cx="250" cy="250" r="30" fill="#38BDF8" fillOpacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== STARFLEET TOP BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between border border-[#38BDF8]/40 bg-[#0A1026] p-3 shadow-[0_0_20px_rgba(56,189,248,0.2)] text-xs">
          <div className="flex items-center gap-2 text-[#38BDF8]">
            <Rocket className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              GALACTIC FRONTIER VOYAGER // WARP FACTOR: 9.2 // STATUS: DEPLOYED
            </span>
          </div>
          <span className="text-[#FB923C]">SECTOR: EPSILON-INDI</span>
        </div>

        {/* ===================== EXPLORER HERO ===================== */}
        <header className="border-2 border-[#38BDF8]/50 bg-gradient-to-br from-[#0C1536] via-[#070D22] to-[#141838] p-6 sm:p-10 rounded-2xl relative shadow-[0_0_40px_rgba(56,189,248,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#38BDF8] p-1 shadow-[0_0_30px_rgba(56,189,248,0.5)] overflow-hidden bg-black">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="text-xs text-[#38BDF8] uppercase tracking-widest font-black mb-1">
                DEEP-SPACE EXPEDITIONARY COMMAND
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-[#FB923C] uppercase tracking-wider mt-1">
                {personal.title || 'Interstellar Systems Architect & Flight Engineer'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#080E24]/80 border-l-2 border-[#38BDF8] p-4 font-sans">
                {personal.bio ||
                  'Charting unmapped technical territories, navigating hyperspace latency, and piloting high-concurrency microservice fleets across the galactic frontier.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#38BDF8] bg-[#101C42] hover:bg-[#38BDF8] hover:text-black text-[#38BDF8] px-3 py-1.5 transition-colors font-bold"
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
                    className="flex items-center gap-1.5 border border-[#FB923C] bg-[#101C42] hover:bg-[#FB923C] hover:text-black text-white px-3 py-1.5 transition-colors font-bold"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>STAR MAPS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== SPACE MISSIONS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#38BDF8]/40 pb-3">
            <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
              DEEP-SPACE MISSIONS & VOYAGES
            </h2>
            <span className="text-xs text-[#38BDF8]">[{projects.length} LOGS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#1E2D5A] bg-[#0A122E] p-6 hover:border-[#38BDF8] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-3 text-neutral-400">
                    <span className="text-[#38BDF8]">MISSION #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#FB923C] text-black text-[9px] font-black px-2 py-0.5 uppercase">
                        WARP EXPEDITION
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 border border-neutral-700 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed font-sans min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1E2D5A] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#101C42] text-[#38BDF8] px-2 py-0.5 text-[10px] border border-blue-900">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Telemetry
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Warp In
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== STARSHIP AVIONICS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#38BDF8]/40 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              STARSHIP AVIONICS & SUBSYSTEMS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#1E2D5A] bg-[#0A122E] p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#38BDF8]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-black mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] to-[#FB923C]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== MISSION LOGS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#38BDF8]/40 pt-8 font-sans">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] font-bold mb-4">
              STARFLEET CAMPAIGN LOGS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#38BDF8] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="text-xs text-[#FB923C] font-mono">{exp.company}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#FB923C] font-bold mb-4">
              STARFLEET ACADEMY
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#FB923C] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#38BDF8]/40 bg-[#070D22] p-4 text-center text-xs text-neutral-500">
          STARFLEET COMMAND // BOLDLY GOING WHERE NO SYSTEM HAS GONE BEFORE • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
