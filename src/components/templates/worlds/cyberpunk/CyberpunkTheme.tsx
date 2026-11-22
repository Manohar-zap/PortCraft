'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/lib/types';
import {
  Cpu,
  Terminal,
  Activity,
  Zap,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  Flame,
  Binary,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function CyberpunkTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'V // NETRUNNER';

  return (
    <div className="relative min-h-screen bg-[#07070C] text-[#E0E7FF] font-mono selection:bg-[#FCEE0A] selection:text-black overflow-x-hidden">
      {/* ===================== SCANLINES & CYBER GRID ===================== */}
      {/* CRT Scanline Horizontal Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Neon Cyber Grid Floor Perspective SVG */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #00FFFF 1px, transparent 1px), linear-gradient(to bottom, #FF0055 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating Holographic Glitch Particles */}
      <div className="fixed top-12 right-10 pointer-events-none z-0 hidden lg:block opacity-40">
        <div className="border border-[#FCEE0A] bg-[#FCEE0A]/10 text-[#FCEE0A] text-[10px] px-3 py-1 font-mono tracking-widest uppercase">
          CYBERDECK: ARASAKA MK-IV // OVERCLOCK: ACTIVE
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ===================== NEURAL INTERFACE STATUS BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-[#00FFFF] bg-[#0E0E1B]/90 px-4 py-2.5 mb-10 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FFFF] animate-ping" />
            <span className="text-xs font-black text-[#00FFFF] tracking-widest uppercase">
              NEURAL INTERFACE LINKED // NIGHT CITY GRID
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#FCEE0A]">
            <span>STREET CRED: 50/50</span>
            <span className="text-neutral-600">|</span>
            <span className="text-[#FF0055]">ICE PROTOCOL: BYPASSED</span>
          </div>
        </div>

        {/* ===================== CYBERNETIC HERO UNIT ===================== */}
        <header className="relative border-2 border-[#FCEE0A] bg-gradient-to-br from-[#12111E] via-[#0A0A13] to-[#160D1A] p-6 sm:p-10 mb-14 shadow-[0_0_30px_rgba(252,238,10,0.15)] overflow-hidden">
          {/* Top Yellow Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FCEE0A]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Cyberware Avatar Card */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start">
              <div className="relative p-1 border-2 border-[#00FFFF] bg-black shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#0A0C14] overflow-hidden relative">
                  {personal.avatar ? (
                    <img
                      src={personal.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover filter contrast-125 saturate-150"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#00FFFF]">
                      <Cpu className="w-14 h-14 animate-pulse mb-2" />
                      <span className="text-[10px] tracking-widest font-black uppercase">CHROMED</span>
                    </div>
                  )}
                  {/* Cyan Corner Reticle */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#FCEE0A]" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#FF0055]" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="bg-[#FF0055] text-white text-[10px] font-black px-2 py-0.5 tracking-widest uppercase">
                  NETRUNNER CLASS
                </span>
                <span className="bg-[#00FFFF] text-black text-[10px] font-black px-2 py-0.5 tracking-widest uppercase">
                  RANK S
                </span>
              </div>
            </div>

            {/* Neural Profile Details */}
            <div className="md:col-span-8">
              <div className="text-xs text-[#00FFFF] tracking-widest uppercase flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#FCEE0A]" />
                <span>IDENTIFIER // SYNAPSE PROTOCOL</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#FCEE0A] drop-shadow-[0_0_12px_rgba(252,238,10,0.6)]">
                {fullName}
              </h1>

              <div className="text-sm sm:text-base font-bold text-[#FF0055] uppercase tracking-wider mt-1">
                {personal.title || 'CYBERSPACE ARCHITECT & DEEP-NET SPECIALIST'}
              </div>

              <div className="mt-5 border-l-2 border-[#00FFFF] bg-[#0A0C16] p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed shadow-inner">
                {personal.bio ||
                  'Jacking into high-throughput distributed protocols, deploying autonomous edge clusters, and dismantling corrupt digital architectures with precision code.'}
              </div>

              {/* Holographic Uplinks */}
              <div className="mt-6 flex flex-wrap gap-3">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black text-[#00FFFF] text-xs px-3 py-1.5 transition-all shadow-[0_0_8px_rgba(0,255,255,0.2)]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-neutral-700 bg-[#0E0E1B] text-neutral-300 text-xs px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF0055]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#FCEE0A] hover:bg-[#FCEE0A] hover:text-black text-[#FCEE0A] text-xs px-3 py-1.5 transition-all shadow-[0_0_8px_rgba(252,238,10,0.2)]"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>REPO_STREAM</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
                {personal.linkedin && (
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#FF0055] hover:bg-[#FF0055] hover:text-white text-[#FF0055] text-xs px-3 py-1.5 transition-all shadow-[0_0_8px_rgba(255,0,85,0.2)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>SUBNET_FEED</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== CYBERNETIC RIGS & ICE-BREAKER SOFTWARE (PROJECTS) ===================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b-2 border-[#00FFFF] pb-3 mb-8">
            <div className="flex items-center gap-2">
              <Binary className="w-5 h-5 text-[#FCEE0A]" />
              <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wider">
                DEPLOYED CYBER-RIGS & ICE BREAKERS
              </h2>
            </div>
            <span className="text-xs text-[#00FFFF] tracking-widest">
              [ {projects.length} UNITS RUNNING ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className={`relative border-2 bg-[#0B0C16] p-5 transition-all group ${
                  p.featured
                    ? 'border-[#FCEE0A] shadow-[0_0_20px_rgba(252,238,10,0.2)]'
                    : 'border-[#1E2238] hover:border-[#00FFFF]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[#00FFFF] font-bold">
                    PROGRAM #{String(idx + 1).padStart(2, '0')} // DAEMON
                  </span>
                  {p.featured && (
                    <span className="bg-[#FF0055] text-white text-[9px] font-black px-2 py-0.5 tracking-widest uppercase">
                      OVERCLOCKED
                    </span>
                  )}
                </div>

                {p.imageUrl && (
                  <div className="mb-4 h-40 w-full overflow-hidden border border-neutral-700 bg-black">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover filter saturate-150 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <h3 className="text-lg sm:text-xl font-black uppercase text-white group-hover:text-[#FCEE0A] transition-colors">
                  {p.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans min-h-[3.5rem]">
                  {p.description}
                </p>

                {/* Tech chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF] text-[10px] px-2 py-0.5 uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-[#1C2035] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-[#00FFFF] flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>SRC_TREE</span>
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FCEE0A] hover:underline flex items-center gap-1 font-bold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>INITIALIZE</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-600">PING: 4ms</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== INSTALLED CYBERWARE (SKILLS) ===================== */}
        <section className="mb-14">
          <div className="flex items-center gap-2 border-b-2 border-[#FF0055] pb-3 mb-6">
            <Cpu className="w-5 h-5 text-[#FF0055]" />
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
              INSTALLED CYBERWARE & SUB-ROUTINES
            </h2>
          </div>

          <div className="border-2 border-[#1E2238] bg-[#0A0B14] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="border border-[#222742] bg-[#101222] p-3 hover:border-[#00FFFF] transition-colors"
                >
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white font-bold">{skill.name}</span>
                    <span className="text-[#00FFFF] font-mono">{((skill.level || 5) * 20)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-[#00FFFF] to-[#FF0055]"
                      style={{ width: `${((skill.level || 5) / 5) * 100}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-neutral-500 uppercase mt-1">
                    {skill.category || 'KERNEL EXTENSION'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== STREET CRED & FIXER CONTRACTS (EXPERIENCE & EDUCATION) ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Contracts */}
          <section>
            <div className="border-b-2 border-[#FCEE0A] pb-2 mb-4">
              <h3 className="font-black text-lg text-white uppercase tracking-wider">
                FIXER GIGS & CONTRACT HISTORY
              </h3>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border border-[#232844] bg-[#0C0E1B] p-4">
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-white font-bold text-sm uppercase">{exp.position}</span>
                    <span className="text-[#FCEE0A] bg-[#FCEE0A]/10 px-2 py-0.5 border border-[#FCEE0A]/30">
                      {exp.startDate} - {exp.current ? 'ACTIVE' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-[#00FFFF] font-bold mt-1">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-300 font-sans leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Academy & Augments */}
          <section>
            <div className="border-b-2 border-[#00FFFF] pb-2 mb-4">
              <h3 className="font-black text-lg text-white uppercase tracking-wider">
                CORPO ACADEMY ACCREDITATION
              </h3>
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border border-[#232844] bg-[#0C0E1B] p-4">
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-white font-bold text-sm uppercase">{edu.institution}</span>
                    <span className="text-neutral-500">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                  <div className="text-xs text-[#FF0055] font-bold mt-1">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  {edu.gpa && (
                    <div className="text-[11px] text-[#00FFFF] mt-1 font-mono">
                      SYNC RATE: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}

              {achievements.length > 0 && (
                <div className="border border-[#FCEE0A] bg-[#121324] p-4 mt-4">
                  <div className="text-xs text-[#FCEE0A] font-black uppercase mb-2">
                    BOUNTY REPUTATION & AWARDS
                  </div>
                  <div className="space-y-2">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="text-xs">
                        <span className="text-white font-bold">{ach.title}</span>
                        <span className="text-neutral-500"> // {ach.issuer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ===================== SYSTEM LOG TERMINAL FOOTER ===================== */}
        <footer className="border-2 border-[#00FFFF] bg-[#0A0A14] p-4 text-center text-xs text-neutral-500 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          SYSTEM_VERSION: NIGHT_CITY_OS_v3.8 • {fullName.toUpperCase()} • ALL RIGHTS CHROMED
        </footer>
      </div>
    </div>
  );
}
