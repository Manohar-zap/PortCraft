'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/lib/types';
import {
  ShieldAlert,
  Terminal,
  FolderGit2,
  ExternalLink,
  Mail,
  MapPin,
  Lock,
  Eye,
  Crosshair,
  Compass,
  FileText,
  Binary,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function GothamTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'BRUCE WAYNE';
  const [selectedCase, setSelectedCase] = useState<string | null>(projects[0]?.id || null);

  return (
    <div className="relative min-h-screen bg-[#07090D] text-[#C5CAD3] font-sans selection:bg-[#E5A93C] selection:text-black overflow-x-hidden">
      {/* ===================== AMBIENT RAIN & GOTHAM FOG ===================== */}
      {/* Dark Blueprint Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(to right, #1F2937 1px, transparent 1px), linear-gradient(to bottom, #1F2937 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Bat-Signal Light Cone SVG Projection from Bottom Right */}
      <svg
        className="fixed -bottom-20 right-0 w-[600px] h-[700px] pointer-events-none z-0 opacity-20"
        viewBox="0 0 500 600"
        fill="none"
      >
        <defs>
          <radialGradient id="batSignalGlow" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#E5A93C" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M 450 600 L 150 150 L 350 150 Z" fill="url(#batSignalGlow)" />
        {/* Bat Silhouette in the cloud beam */}
        <circle cx="250" cy="150" r="45" fill="#E5A93C" fillOpacity="0.12" />
        <path
          d="M 230 155 C 235 145 240 148 245 152 C 248 147 252 147 255 152 C 260 148 265 145 270 155 C 265 160 258 158 250 162 C 242 158 235 160 230 155 Z"
          fill="#07090D"
        />
      </svg>

      {/* Tactical Rain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(105deg, transparent, transparent 18px, rgba(255,255,255,0.15) 19px, transparent 20px)',
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ===================== WAYNE ENTERPRISES / BATCOMPUTER TELEMETRY ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#232936] bg-[#0C0F17]/90 backdrop-blur-md px-4 py-3 rounded-none mb-10 shadow-2xl">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-[#E5A93C]" />
            <span className="font-mono text-xs tracking-widest text-[#E5A93C] font-semibold uppercase">
              WAYNE ENTERPRISES // SECURE DOSSIER TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-neutral-400" />
              GOTHAM CITY [40.7128° N, 74.0060° W]
            </span>
            <span className="hidden sm:inline border-l border-neutral-700 h-3" />
            <span className="hidden sm:inline text-neutral-400">ENCRYPTION: QUANTUM-256</span>
          </div>
        </div>

        {/* ===================== OPERATIVE CLASSIFIED HEADER ===================== */}
        <header className="relative border border-[#232936] bg-[#0F131C] p-6 sm:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Classified Rubber Stamp Overlay */}
          <div className="absolute top-6 right-6 select-none pointer-events-none rotate-[-8deg] border-2 border-red-700/80 px-4 py-1 text-red-600 font-mono font-black text-xs sm:text-sm tracking-widest uppercase opacity-85">
            CLASSIFIED // EYES ONLY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Operative Portrait / Avatar */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start">
              <div className="relative border-2 border-[#E5A93C]/40 p-1 bg-[#090B10]">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-[#141824] overflow-hidden grayscale contrast-125">
                  {personal.avatar ? (
                    <img
                      src={personal.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                      <Lock className="w-12 h-12 text-[#E5A93C]/60 mb-2" />
                      <span className="font-mono text-[10px] tracking-widest uppercase">IDENTITY PROTECTED</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 left-3 bg-[#E5A93C] text-black font-mono text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                  OPERATIVE VERIFIED
                </div>
              </div>

              <div className="mt-6 font-mono text-xs text-neutral-500 space-y-1">
                <div>CLEARANCE: <span className="text-white">TOP SECRET</span></div>
                <div>STATUS: <span className="text-[#E5A93C]">ACTIVE IN FIELD</span></div>
              </div>
            </div>

            {/* Operative Briefing */}
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#E5A93C] tracking-widest uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>CASE DOSSIER // {fullName.toUpperCase()}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-serif">
                {fullName}
              </h1>

              <div className="text-sm sm:text-base font-mono text-neutral-400 mt-2 tracking-wide uppercase">
                {personal.title || 'SECURITY SPECIALIST & SOFTWARE ARCHITECT'}
              </div>

              <div className="mt-6 border-l-2 border-[#E5A93C] pl-4 py-1 text-sm sm:text-base text-neutral-300 leading-relaxed font-sans bg-[#131722]/50 p-3">
                <p>
                  {personal.bio ||
                    'Operates in high-stakes environments architecting bulletproof digital systems, auditing vulnerabilities, and resolving systemic challenges where failure is not an option.'}
                </p>
              </div>

              {/* Dossier Contact Coordinates */}
              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#232936] hover:border-[#E5A93C] bg-[#121620] px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-[#232936] bg-[#121620] px-3 py-1.5 text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#232936] hover:border-[#E5A93C] bg-[#121620] px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>REPOSITORY</span>
                  </a>
                )}
                {personal.linkedin && (
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#232936] hover:border-[#E5A93C] bg-[#121620] px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>NETWORK INTEL</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== EVIDENCE & CASE FILES (PROJECTS) ===================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b border-[#232936] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#E5A93C]" />
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide uppercase text-white">
                INVESTIGATION CASE FILES
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-500">
              {projects.length} ACTIVE INCIDENTS ARCHIVED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className={`relative border transition-all p-5 bg-[#0D1017] ${
                  p.featured
                    ? 'border-[#E5A93C]/60 shadow-[0_0_25px_rgba(229,169,60,0.1)]'
                    : 'border-[#1F2533] hover:border-[#384259]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-3 text-neutral-500">
                  <span className="text-[#E5A93C] font-semibold">
                    CASE RECORD #{String(idx + 1).padStart(3, '0')}
                  </span>
                  {p.featured && (
                    <span className="border border-[#E5A93C]/60 text-[#E5A93C] px-2 py-0.5 text-[9px] uppercase tracking-wider">
                      HIGH PRIORITY EVIDENCE
                    </span>
                  )}
                </div>

                {p.imageUrl && (
                  <div className="mb-4 h-40 w-full overflow-hidden border border-[#1F2533] bg-black">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover grayscale opacity-75 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}

                <h3 className="text-lg font-serif font-bold text-white uppercase tracking-tight">
                  {p.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-[#141824] text-[#E5A93C]/90 px-2 py-0.5 border border-[#232936]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-[#1C2230] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-[#E5A93C] flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>SOURCE</span>
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E5A93C] hover:underline flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>EXECUTE</span>
                      </a>
                    )}
                  </div>
                  <span className="text-neutral-600 text-[10px]">VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== FORENSIC TACTICAL REPERTOIRE (SKILLS) ===================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b border-[#232936] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Binary className="w-5 h-5 text-[#E5A93C]" />
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide uppercase text-white">
                TACTICAL CAPABILITIES & ARSENAL
              </h2>
            </div>
          </div>

          <div className="border border-[#1F2533] bg-[#0C0F17] p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="border border-[#1C2230] bg-[#111520] p-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-semibold">{skill.name}</span>
                    <span className="text-[#E5A93C]">{skill.level || 5}/5</span>
                  </div>
                  <div className="w-full h-1 bg-[#1C2230] mt-2">
                    <div
                      className="h-full bg-[#E5A93C]"
                      style={{ width: `${((skill.level || 5) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FIELD LOGS & SURVEILLANCE RECORD (EXPERIENCE & EDUCATION) ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Experience */}
          <section>
            <div className="border-b border-[#232936] pb-2 mb-4">
              <h3 className="font-serif font-black text-lg text-white uppercase tracking-wider">
                FIELD SURVEILLANCE & ENGAGEMENTS
              </h3>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border border-[#1C2230] bg-[#0E1119] p-4">
                  <div className="flex justify-between items-start">
                    <div className="font-serif font-bold text-white uppercase text-base">{exp.position}</div>
                    <span className="font-mono text-[10px] text-[#E5A93C] bg-[#191F2D] px-2 py-0.5">
                      {exp.startDate} - {exp.current ? 'CURRENT' : exp.endDate}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[#E5A93C] mt-1">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-400 font-sans leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education & Commendations */}
          <section>
            <div className="border-b border-[#232936] pb-2 mb-4">
              <h3 className="font-serif font-black text-lg text-white uppercase tracking-wider">
                ACADEMIC DOSSIER & CITATIONS
              </h3>
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border border-[#1C2230] bg-[#0E1119] p-4">
                  <div className="flex justify-between items-start">
                    <div className="font-serif font-bold text-white uppercase text-base">{edu.institution}</div>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-neutral-300 mt-1">
                    {edu.degree} {edu.field && `// ${edu.field}`}
                  </div>
                  {edu.gpa && (
                    <div className="font-mono text-[11px] text-[#E5A93C] mt-1">
                      SCORE INDEX: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}

              {achievements.length > 0 && (
                <div className="border border-[#E5A93C]/40 bg-[#10141F] p-4 mt-4">
                  <div className="font-mono text-xs text-[#E5A93C] uppercase tracking-wider mb-2 font-bold">
                    OFFICIAL COMMENDATIONS
                  </div>
                  <div className="space-y-2">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="text-xs">
                        <span className="text-white font-semibold">{ach.title}</span>
                        <span className="text-neutral-500 font-mono"> — {ach.issuer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ===================== FOOTER SECURE CLOSING ===================== */}
        <footer className="border border-[#232936] bg-[#0C0F17] p-4 text-center font-mono text-xs text-neutral-500">
          WAYNE ENTERPRISES ARCHIVE \/ RECORD REF #9482 \/ {fullName.toUpperCase()} \/ END TRANSMISSION
        </footer>
      </div>
    </div>
  );
}
