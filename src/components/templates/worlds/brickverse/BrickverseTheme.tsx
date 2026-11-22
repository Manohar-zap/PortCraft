'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Box,
  Layers,
  Wrench,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function BrickverseTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'MASTER BUILDER';

  return (
    <div className="relative min-h-screen bg-[#F0F2F5] text-[#1E293B] font-sans selection:bg-[#F5CD2F] selection:text-black overflow-x-hidden">
      {/* Brick Stud Pattern Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, #000000 3px, transparent 3.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== TOP STUD BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-4 border-black bg-[#E52521] text-white p-3 shadow-[6px_6px_0_#000]">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[#F5CD2F]" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
              BRICKVERSE FACTORY // MASTER BUILDER REGISTRY
            </span>
          </div>
          <span className="bg-[#F5CD2F] text-black font-black text-xs px-2 py-0.5 border-2 border-black">
            SET #9482 // AGES 99+
          </span>
        </div>

        {/* ===================== MODULAR BUILDER HERO ===================== */}
        <header className="border-4 border-black bg-white p-6 sm:p-10 shadow-[10px_10px_0_#0055BF] relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Minifig Avatar Frame */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 border-4 border-black bg-[#F5CD2F] p-2 shadow-[6px_6px_0_#000]">
                {personal.avatar ? (
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover border-2 border-black" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5CD2F] text-black">
                    <Wrench className="w-14 h-14" />
                    <span className="font-black text-xs uppercase mt-2">BUILDER</span>
                  </div>
                )}
              </div>
              <div className="mt-4 bg-[#237841] text-white font-black text-xs px-3 py-1 border-2 border-black uppercase tracking-wider shadow-[3px_3px_0_#000]">
                LEVEL: CERTIFIED MASTER BUILDER
              </div>
            </div>

            {/* Builder Details */}
            <div className="md:col-span-8">
              <div className="bg-[#0055BF] text-white text-xs font-black px-3 py-1 border-2 border-black inline-block uppercase tracking-widest mb-3 shadow-[3px_3px_0_#000]">
                {personal.title || 'MODULAR SOFTWARE ARCHITECT'}
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase text-black tracking-tight drop-shadow-[3px_3px_0_#F5CD2F]">
                {fullName}
              </h1>

              <div className="mt-4 p-4 border-3 border-black bg-[#FFFBEB] text-slate-800 text-sm leading-relaxed shadow-[4px_4px_0_#000]">
                <p>
                  {personal.bio ||
                    'Snapping together modular component libraries, architecting rock-solid software structures, and designing playful, reliable web experiences.'}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-black">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border-2 border-black bg-[#E52521] text-white hover:bg-black px-3 py-1.5 shadow-[3px_3px_0_#000] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border-2 border-black bg-[#F5CD2F] text-black px-3 py-1.5 shadow-[3px_3px_0_#000]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border-2 border-black bg-[#0055BF] text-white hover:bg-black px-3 py-1.5 shadow-[3px_3px_0_#000] transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>BLUEPRINTS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== MASTER BUILDS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#E52521]" />
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                COMPLETED BUILDS & KITS
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">[{projects.length} MODELS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_#E52521] hover:shadow-[10px_10px_0_#0055BF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-black mb-3">
                    <span className="bg-[#F5CD2F] px-2 py-0.5 border-2 border-black">
                      KIT #{String(idx + 1).padStart(3, '0')}
                    </span>
                    {p.featured && (
                      <span className="bg-[#237841] text-white text-[10px] px-2 py-0.5 border-2 border-black uppercase">
                        COLLECTOR&apos;S ITEM
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-3 border-2 border-black overflow-hidden bg-slate-100">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-black uppercase text-black">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-slate-100 text-black border border-black text-[10px] px-2 py-0.5">
                        +{tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <GithubIcon className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0055BF] text-white px-2.5 py-1 border border-black hover:bg-black transition-colors flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Play
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== BUILDING COMPONENTS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-4 border-black pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black">
              COMPONENT INVENTORY & BRICKS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skills.map((s) => (
              <div key={s.id} className="border-3 border-black bg-white p-3 shadow-[4px_4px_0_#F5CD2F]">
                <div className="font-black text-sm text-black">{s.name}</div>
                <div className="text-[11px] font-bold text-[#E52521] mt-1">
                  MODULE STRENGTH: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CONSTRUCTION TIMELINE ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-black pt-8">
          <div>
            <h3 className="font-black text-base uppercase text-black mb-4">
              CONSTRUCTION HISTORY
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_#237841]">
                  <div className="font-black text-sm uppercase text-black">{exp.position}</div>
                  <div className="text-xs font-bold text-[#0055BF]">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-black text-base uppercase text-black mb-4">
              BUILDER GUILD ACCREDITATION
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_#E52521]">
                  <div className="font-black text-sm uppercase text-black">{edu.institution}</div>
                  <div className="text-xs font-bold text-[#E52521]">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-4 border-black bg-[#F5CD2F] p-4 text-center font-black text-xs uppercase shadow-[6px_6px_0_#000]">
          EVERYTHING IS AWESOME • {fullName.toUpperCase()} • BRICKVERSE STUDIO
        </footer>
      </div>
    </div>
  );
}
