'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  ShieldAlert,
  Crosshair,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  Lock,
  Eye,
  Activity,
  Terminal,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function ShadowProtocolTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'OPERATIVE GHOST';

  return (
    <div className="relative min-h-screen bg-[#050709] text-[#E2E8F0] font-mono selection:bg-[#00FF66] selection:text-black overflow-x-hidden">
      {/* Night-Vision Phosphor Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(to right, #00FF66 1px, transparent 1px), linear-gradient(to bottom, #00FF66 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Rotating Radar Sweep Beam SVG */}
      <div className="fixed top-20 right-10 w-[450px] h-[450px] pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 300 300" className="w-full h-full animate-[spin_20s_linear_infinite]" fill="none">
          <circle cx="150" cy="150" r="140" stroke="#00FF66" strokeWidth="1.5" />
          <circle cx="150" cy="150" r="90" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="150" y1="150" x2="290" y2="150" stroke="#00FF66" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== TACTICAL INTELLIGENCE STATUS ===================== */}
        <div className="flex flex-wrap items-center justify-between border border-[#00FF66]/40 bg-[#0B0F14] p-3 shadow-[0_0_20px_rgba(0,255,102,0.15)] text-xs">
          <div className="flex items-center gap-2 text-[#00FF66]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-ping" />
            <span className="font-bold tracking-widest uppercase">
              SHADOW PROTOCOL // BLACK-OPS UPLINK // ENCRYPTION: AES-256-GCM
            </span>
          </div>
          <span className="text-neutral-400">SAT-LINK: ACTIVE [GEO-TAG: MASKED]</span>
        </div>

        {/* ===================== COVERT OPERATIVE HERO ===================== */}
        <header className="border border-[#00FF66]/30 bg-gradient-to-br from-[#0B1017] via-[#06080C] to-[#0E151E] p-6 sm:p-10 relative shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 border-2 border-[#00FF66] p-1 shadow-[0_0_25px_rgba(0,255,102,0.3)] bg-black overflow-hidden relative">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-150 grayscale" />
                  <div className="absolute inset-0 bg-[#00FF66]/10 pointer-events-none" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="text-xs text-[#00FF66] uppercase tracking-widest font-black mb-1">
                COVERT INTELLIGENCE OPERATIVE // TIER-1
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,255,102,0.5)]">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-neutral-300 uppercase mt-1">
                {personal.title || 'Tactical Cyberwarfare & Covert Systems Engineer'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#06080C] border-l-2 border-[#00FF66] p-4 font-sans">
                {personal.bio ||
                  'Specializing in zero-trace operations, defensive penetration testing, cryptographically isolated infrastructures, and high-stakes system hardening.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#00FF66] bg-[#0E1712] text-[#00FF66] hover:bg-[#00FF66] hover:text-black px-3 py-1.5 transition-colors font-bold uppercase"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>SECURE COMMS</span>
                  </a>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-neutral-600 bg-[#0E121A] text-white hover:border-[#00FF66] px-3 py-1.5 transition-colors font-bold uppercase"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>PROTOCOL TREE</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== OPERATIONS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00FF66]/30 pb-3">
            <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
              AUTHORIZED OPERATIONS & COVERT RIGS
            </h2>
            <span className="text-xs text-[#00FF66]">[{projects.length} OPERATIONS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#18231C] bg-[#0A0E13] p-6 hover:border-[#00FF66] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-3 text-neutral-400">
                    <span className="text-[#00FF66]">OP #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444] text-[9px] font-bold px-2 py-0.5 uppercase">
                        ZERO-DAY
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 border border-neutral-800 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-125 grayscale" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#18231C] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#0E1712] text-[#00FF66] border border-[#183322] px-2 py-0.5 text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#00FF66] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Execute
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CYBERWARFARE (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#00FF66]/30 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              CYBERWARFARE CAPABILITIES & TELEMETRY
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#18231C] bg-[#0A0E13] p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#00FF66]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-[#05080C] mt-2">
                  <div
                    className="h-full bg-[#00FF66]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DEPLOYMENT HISTORY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#00FF66]/30 pt-8 font-sans">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#00FF66] font-bold mb-4">
              COVERT DEPLOYMENT HISTORY
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#00FF66] pl-4">
                  <div className="text-base font-bold text-white uppercase font-mono">{exp.position}</div>
                  <div className="text-xs text-neutral-400 font-mono">{exp.company} // {exp.startDate} - {exp.current ? 'ACTIVE' : exp.endDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-bold mb-4">
              DEFENSE INTELLIGENCE ACCREDITATION
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-neutral-600 pl-4">
                  <div className="text-base font-bold text-white uppercase font-mono">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#00FF66]/30 bg-[#0A0E13] p-4 text-center text-xs text-neutral-500">
          SHADOW PROTOCOL // TOP SECRET SPEC-OPS // TERMINATE TRANSMISSION • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
