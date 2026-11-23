'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { ArrowUpRight, Mail, ExternalLink, MapPin } from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function MinimalistTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'MAX BILL';

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] font-sans selection:bg-black selection:text-white p-6 sm:p-12 lg:p-20">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* ===================== SWISS HEADER ===================== */}
        <header className="border-b-2 border-black pb-12">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-500 mb-8">
            <span>INDEX: 00 // PROFILE</span>
            <span>{personal.location || 'GLOBAL // REMOTE'}</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-black leading-none">
            {fullName}
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
            <p className="text-xl sm:text-2xl font-light text-neutral-800 max-w-2xl leading-snug">
              {personal.title || 'Independent Software Architect & System Designer'}
            </p>

            <div className="flex items-center gap-6 text-xs font-mono uppercase">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="hover:underline flex items-center gap-1 font-bold"
                >
                  EMAIL <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 font-bold"
                >
                  GITHUB <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 font-bold"
                >
                  LINKEDIN <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {personal.bio && (
            <p className="mt-8 text-neutral-600 text-base sm:text-lg max-w-3xl leading-relaxed">
              {personal.bio}
            </p>
          )}
        </header>

        {/* ===================== 01 / SELECTED WORKS ===================== */}
        <section className="space-y-8">
          <div className="flex items-baseline justify-between border-b border-black pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              01 / SELECTED WORKS
            </h2>
            <span className="font-mono text-xs text-neutral-500">[{projects.length} UNITS]</span>
          </div>

          <div className="divide-y divide-neutral-200">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="py-8 group flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-neutral-50 px-3 transition-colors"
              >
                <div className="md:w-1/3">
                  <div className="font-mono text-xs text-neutral-400 mb-1">
                    INDEX #{String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-black group-hover:underline">
                    {p.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1 text-[11px] font-mono text-neutral-600">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="border border-neutral-300 px-1.5 py-0.5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/2">
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs font-mono uppercase">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 text-black font-semibold"
                      >
                        Source Code <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 text-black font-semibold"
                      >
                        Live Demonstration <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== 02 / CAPABILITIES & METHODOLOGIES ===================== */}
        <section className="space-y-8">
          <div className="flex items-baseline justify-between border-b border-black pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              02 / TECHNICAL CAPABILITIES
            </h2>
            <span className="font-mono text-xs text-neutral-500">[{skills.length} MODULES]</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {skills.map((s) => (
              <div key={s.id} className="border-t-2 border-black pt-3">
                <div className="font-bold text-base text-black uppercase tracking-tight">
                  {s.name}
                </div>
                <div className="text-xs font-mono text-neutral-500 mt-1 uppercase">
                  EFFICIENCY: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== 03 / CHRONOLOGY (EXPERIENCE & EDUCATION) ===================== */}
        <section className="space-y-8">
          <div className="flex items-baseline justify-between border-b border-black pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              03 / CAREER CHRONOLOGY
            </h2>
            <span className="font-mono text-xs text-neutral-500">RECORDS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
                ENGAGEMENTS
              </div>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-black pl-4">
                    <div className="font-bold text-base uppercase text-black">{exp.position}</div>
                    <div className="text-xs font-mono text-neutral-600 mt-0.5">
                      {exp.company} // {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
                ACADEMICS & CERTIFICATIONS
              </div>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-black pl-4">
                    <div className="font-bold text-base uppercase text-black">{edu.institution}</div>
                    <div className="text-xs font-mono text-neutral-600 mt-0.5">
                      {edu.degree} in {edu.field} \/ {edu.startYear} \u2013 {edu.endYear}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SWISS FOOTER ===================== */}
        <footer className="border-t-2 border-black pt-8 flex flex-wrap items-center justify-between text-xs font-mono uppercase text-neutral-500">
          <span>PORTCRAFT \/ SWISS MINIMALIST ENGINE</span>
          <span>{fullName} \/ ALL DATA DETERMINISTIC</span>
        </footer>
      </div>
    </div>
  );
}
