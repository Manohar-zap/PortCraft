'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  ExternalLink,
  Mail,
  MapPin,
  Radio,
  Compass,
  FileCode2,
  Award,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function ArcReactorTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'TONY STARK';

  return (
    <div className="relative min-h-screen bg-[#060912] text-[#D8E6FF] font-sans selection:bg-[#00F0FF] selection:text-black overflow-x-hidden">
      {/* Blueprint Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* SVG Arc Reactor Ambient Centerpiece Glow */}
      <div className="fixed top-1/4 -right-24 w-[500px] h-[500px] pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_60s_linear_infinite]" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#00F0FF" strokeWidth="2" strokeDasharray="12 12" />
          <circle cx="200" cy="200" r="140" stroke="#3B82F6" strokeWidth="3" />
          <circle cx="200" cy="200" r="100" stroke="#00F0FF" strokeWidth="4" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="60" stroke="#FFFFFF" strokeWidth="6" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="20"
              x2="200"
              y2="60"
              stroke="#00F0FF"
              strokeWidth="2"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== COMMAND INTERFACE STATUS BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#00F0FF]/30 bg-[#0B1324]/80 backdrop-blur-md px-5 py-3 rounded-none shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="font-mono text-xs tracking-widest text-[#00F0FF] font-black uppercase">
              ARC REACTOR LAB // MARK-85 OPERATIONAL
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span>CORE OUTPUT: 3.2 GJ/S</span>
            <span className="text-[#00F0FF]">ONLINE</span>
          </div>
        </div>

        {/* ===================== HERO SCHEMATIC ===================== */}
        <header className="relative border-2 border-[#00F0FF]/40 bg-gradient-to-br from-[#0B1328] via-[#070C1B] to-[#0D1B36] p-6 sm:p-10 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Holographic Avatar Wireframe */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative p-1 border-2 border-[#00F0FF] bg-[#050B16] rounded-full shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden relative">
                  {personal.avatar ? (
                    <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-125" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1328] text-[#00F0FF]">
                      <Zap className="w-16 h-16 animate-pulse" />
                      <span className="text-[10px] font-mono tracking-widest mt-2">SYS_CHIEF</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 font-mono text-xs text-[#00F0FF] uppercase tracking-wider font-bold">
                ENGINEERING CLEARANCE: ALPHA-01
              </div>
            </div>

            {/* Engineer Identity & Telemetry */}
            <div className="md:col-span-8">
              <div className="text-xs font-mono text-[#00F0FF] tracking-widest uppercase flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4" />
                <span>CHIEF ARCHITECT & RESEARCH FELLOW</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
                {fullName}
              </h1>

              <div className="text-sm sm:text-base font-mono text-[#60A5FA] mt-1 font-bold">
                {personal.title || 'Holographic Systems & Hardware Engineer'}
              </div>

              <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed font-sans bg-[#0E1B38]/60 border-l-2 border-[#00F0FF] p-4">
                {personal.bio ||
                  'Architecting next-generation autonomous computing, high-energy distributed protocols, and quantum-grade software infrastructure.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#00F0FF]/50 hover:bg-[#00F0FF] hover:text-black text-[#00F0FF] px-3 py-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-neutral-700 bg-[#0B1324] px-3 py-1.5 text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#00F0FF]/50 hover:bg-[#00F0FF] hover:text-black text-neutral-200 px-3 py-1.5 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>SCHEMATICS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== ENGINEERING BLUEPRINTS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00F0FF]/30 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00F0FF]" />
              <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
                SYSTEM BLUEPRINTS & BUILDS
              </h2>
            </div>
            <span className="font-mono text-xs text-[#00F0FF]">
              [ {projects.length} ACTIVE SCHEMATICS ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#00F0FF]/30 bg-[#0B1328]/90 p-6 relative hover:border-[#00F0FF] transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex justify-between items-center text-xs font-mono mb-3">
                  <span className="text-[#00F0FF] font-bold">
                    SPEC #{String(idx + 1).padStart(2, '0')} // CAD-ENGINE
                  </span>
                  {p.featured && (
                    <span className="bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                      PRIMARY REACTOR BUILD
                    </span>
                  )}
                </div>

                {p.imageUrl && (
                  <div className="h-44 w-full mb-4 border border-[#00F0FF]/20 overflow-hidden bg-black">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}

                <h3 className="text-xl font-bold uppercase text-white group-hover:text-[#00F0FF] transition-colors">
                  {p.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans min-h-[3.5rem]">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="bg-[#070D1C] text-[#60A5FA] border border-[#1E3A8A] px-2 py-0.5">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-[#00F0FF]/20 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#00F0FF] flex items-center gap-1">
                        <GithubIcon className="w-3.5 h-3.5" /> Source CAD
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#00F0FF] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Launch Build
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500">EFFICIENCY: 99.8%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== POWER GRID MODULES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#00F0FF]/30 pb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
              REACTOR SUBASSEMBLIES & CAPABILITIES
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#00F0FF]/30 bg-[#0B1328] p-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#00F0FF]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-[#050914] border border-[#00F0FF]/20 mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F0FF] to-[#3B82F6]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DEPLOYMENT HISTORY & ACCREDITATION ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#00F0FF]/30 pt-8">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#00F0FF] mb-4 font-bold">
              FIELD DEPLOYMENT LOGS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#00F0FF] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="font-mono text-xs text-[#60A5FA] mt-0.5">
                    {exp.company} // {exp.startDate} - {exp.current ? 'ACTIVE' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-300 font-sans leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#60A5FA] mb-4 font-bold">
              ENGINEERING ACCREDITATION
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#60A5FA] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="font-mono text-xs text-neutral-400 mt-0.5">
                    {edu.degree} in {edu.field} ({edu.startYear} - {edu.endYear})
                  </div>
                </div>
              ))}

              {achievements.length > 0 && (
                <div className="border border-[#00F0FF]/30 bg-[#0B1328] p-4 mt-4">
                  <div className="font-mono text-xs text-[#00F0FF] font-bold mb-2 uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> PATENTS & AWARDS
                  </div>
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    {achievements.map((ach) => (
                      <div key={ach.id}>
                        • <span className="font-bold text-white">{ach.title}</span> — {ach.issuer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#00F0FF]/30 bg-[#070D1C] p-4 text-center font-mono text-xs text-neutral-400">
          STARK INDUSTRIES R&D LAB \/ MARK-85 PLATFORM \u2022 {fullName.toUpperCase()} \u2022 ALL RIGHTS ENGINEERED
        </footer>
      </div>
    </div>
  );
}
