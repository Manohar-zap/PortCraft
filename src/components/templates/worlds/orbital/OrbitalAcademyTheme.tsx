'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  GraduationCap,
  Compass,
  Radio,
  ExternalLink,
  Mail,
  MapPin,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function OrbitalAcademyTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CADET ORION';

  return (
    <div className="relative min-h-screen bg-[#0B101E] text-[#E2E8F0] font-sans selection:bg-[#06B6D4] selection:text-black overflow-x-hidden">
      {/* Orbital Station Geometric Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(to right, #06B6D4 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== ACADEMY STATION STATUS ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#06B6D4]/40 bg-[#101930] p-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] font-mono text-xs">
          <div className="flex items-center gap-2 text-[#06B6D4]">
            <GraduationCap className="w-4 h-4 animate-bounce" />
            <span className="font-bold tracking-widest uppercase">
              ORBITAL ACADEMY // ZERO-G CAMPUS // STATION DECK 09
            </span>
          </div>
          <span className="text-[#EAB308]">STATUS: HONOR ROLL SCHOLAR</span>
        </div>

        {/* ===================== SCHOLAR HERO ===================== */}
        <header className="border border-[#06B6D4]/30 bg-gradient-to-br from-[#121E3B] via-[#0E152B] to-[#162347] p-6 sm:p-10 rounded-2xl relative shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-2 border-[#06B6D4] p-1 shadow-[0_0_25px_rgba(6,182,212,0.3)] overflow-hidden bg-black">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-8' : 'md:col-span-12'}>
              <div className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest font-black mb-1">
                ACADEMIC STATION TRANSCRIPT // CLASS OF 2026
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
                {fullName}
              </h1>

              <div className="text-sm font-mono text-[#EAB308] mt-1 font-bold">
                {personal.title || 'Orbital Research Engineer & System Scientist'}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#0A1020]/80 border-l-2 border-[#06B6D4] p-4">
                {personal.bio ||
                  'Advancing computational frontiers in zero gravity. Designing high-availability satellite telemetry, orbital algorithms, and distributed research platforms.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#06B6D4] bg-[#162547] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-black px-3 py-1.5 rounded-lg transition-colors font-bold"
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
                    className="flex items-center gap-1.5 border border-[#3B82F6] bg-[#162547] text-white hover:bg-[#3B82F6] px-3 py-1.5 rounded-lg transition-colors font-bold"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>LAB CODE</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== LAB PRACTICUMS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#06B6D4]/30 pb-3">
            <h2 className="text-xl sm:text-3xl font-black uppercase text-white tracking-wide">
              RESEARCH LABS & PRACTICUMS
            </h2>
            <span className="font-mono text-xs text-[#06B6D4]">[{projects.length} LABS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#1E305C] bg-[#0E172F] p-6 rounded-2xl hover:border-[#06B6D4] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-3 text-neutral-400">
                    <span className="text-[#06B6D4]">LAB #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308] text-[9px] font-bold px-2 py-0.5 rounded">
                        DISSERTATION
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-40 w-full mb-3 rounded-xl border border-neutral-700 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1E305C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#17274F] text-[#06B6D4] px-2 py-0.5 rounded text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Paper
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== ACADEMIC COMPETENCIES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#06B6D4]/30 pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              STATION OPERATIONAL COMPETENCIES
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#1E305C] bg-[#0E172F] p-3 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#06B6D4]">{s.level || 5}/5</span>
                </div>
                <div className="w-full h-1.5 bg-[#090F20] mt-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#06B6D4]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== COURSE PROGRESSION ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#06B6D4]/30 pt-8">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#06B6D4] font-bold mb-4">
              RESEARCH APPOINTMENTS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#06B6D4] pl-4">
                  <div className="text-base font-bold text-white uppercase">{exp.position}</div>
                  <div className="text-xs text-[#EAB308] font-mono">{exp.company}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#EAB308] font-bold mb-4">
              ACADEMIC DEGREE PROGRESSION
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#EAB308] pl-4">
                  <div className="text-base font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-neutral-400 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#06B6D4]/30 bg-[#0A1020] p-4 rounded-xl text-center font-mono text-xs text-neutral-500">
          ORBITAL ACADEMY DEAN OF STUDENTS // REGISTERED SCHOLAR • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
