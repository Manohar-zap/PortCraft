'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Wrench,
  Cpu,
  Layers,
  ExternalLink,
  Mail,
  MapPin,
  Flame,
  Shield,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function MechaWorkshopTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'COMMANDER ASUKA';

  return (
    <div className="relative min-h-screen bg-[#0A0D14] text-[#E2E8F0] font-mono selection:bg-[#F59E0B] selection:text-black overflow-x-hidden">
      {/* Caution Stripe Top Bar */}
      <div
        className="h-3 w-full border-b-2 border-black"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #F59E0B, #F59E0B 12px, #000000 12px, #000000 24px)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== HANGAR BAY TELEMETRY ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-[#EF4444] bg-[#121724] p-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span className="font-black text-xs uppercase tracking-wider">
              HANGAR BAY 04 // TITAN MECH SUITE // PILOT ONLINE
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span>SYNC RATE: 99.4%</span>
            <span className="text-[#F59E0B]">HYDRAULICS: NOMINAL</span>
          </div>
        </div>

        {/* ===================== PILOT & MECH HERO ===================== */}
        <header className="border-2 border-neutral-700 bg-gradient-to-br from-[#131A29] via-[#0E131F] to-[#181220] p-6 sm:p-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Pilot Avatar Frame */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 border-2 border-[#EF4444] p-1 bg-black shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                {personal.avatar ? (
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover filter contrast-125" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#151D2E] text-[#EF4444]">
                    <Shield className="w-14 h-14" />
                    <span className="text-[10px] font-black uppercase mt-2">PILOT_ID</span>
                  </div>
                )}
              </div>
              <div className="mt-3 bg-[#EF4444] text-white font-black text-[10px] px-3 py-1 border border-black uppercase tracking-widest">
                TITAN PILOT CLASS-A
              </div>
            </div>

            {/* Pilot Identity */}
            <div className="md:col-span-8">
              <div className="text-xs text-[#F59E0B] uppercase tracking-widest font-black mb-1">
                MECHANIZED ARMOR DIVISION // SPEC-OPS
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-[#EF4444] uppercase mt-1">
                {personal.title || 'Mechatronics Architect & Robotics Engineer'}
              </div>

              <div className="mt-4 border-l-2 border-[#EF4444] bg-[#0A0E17] p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                <p>
                  {personal.bio ||
                    'Engineering industrial-grade robotics platforms, deploying autonomous mechatronic subassemblies, and forging reliable battle-tested software systems.'}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#EF4444] hover:bg-[#EF4444] text-white px-3 py-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-neutral-700 bg-[#121724] px-3 py-1.5 text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-neutral-600 hover:border-[#EF4444] text-neutral-200 px-3 py-1.5 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>BLUEPRINTS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== MECH BUILDS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#EF4444]" />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
                ROBOTICS UNITS & MECH CHASSIS
              </h2>
            </div>
            <span className="text-xs text-neutral-400">[{projects.length} UNITS DEPLOYED]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-neutral-800 bg-[#101522] p-5 hover:border-[#EF4444] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="text-[#F59E0B] font-black">
                      FRAME #{String(idx + 1).padStart(2, '0')} // ARMORED
                    </span>
                    {p.featured && (
                      <span className="bg-[#EF4444] text-white text-[9px] font-black px-2 py-0.5 uppercase">
                        VANGUARD UNIT
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 border border-neutral-700 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-lg font-black uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed font-sans min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#182030] text-[#EF4444] px-2 py-0.5 text-[10px] border border-neutral-700">
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
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#EF4444] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Launch
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CORE ACTUATORS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-neutral-700 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              CORE ACTUATORS & HARDWARE SYSTEMS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-neutral-800 bg-[#121724] p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#F59E0B]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-black mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DEPLOYMENT HISTORY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-neutral-700 pt-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#EF4444] font-bold mb-4">
              BATTLE & DEPLOYMENT CHRONOLOGY
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#EF4444] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="text-xs text-[#F59E0B] mt-0.5">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-1 text-xs text-neutral-300 font-sans leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#F59E0B] font-bold mb-4">
              MECHATRONICS ACADEMIA
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#F59E0B] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {edu.degree} in {edu.field}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-2 border-neutral-800 bg-[#0C101A] p-4 text-center text-xs text-neutral-500">
          TITAN DEFENSE HANGAR \/ COMBAT READY \u2022 {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
