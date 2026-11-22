'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { ArrowUpRight, BookOpen, Feather, Mail, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function EditorialTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CLARA CHEN';

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#191614] font-serif selection:bg-[#7F1D1D] selection:text-white p-6 sm:p-12 lg:p-20">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ===================== MASTHEAD ===================== */}
        <header className="border-b-4 border-[#191614] pb-8">
          <div className="flex flex-wrap items-center justify-between text-xs font-sans tracking-widest uppercase text-neutral-600 border-b border-[#191614]/30 pb-3 mb-6">
            <span>VOLUME VII // EDITION 2026</span>
            <span>THE PORTFOLIO REVIEW</span>
            <span>{personal.location || 'NEW YORK & WORLDWIDE'}</span>
          </div>

          <div className="text-center py-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#191614] font-serif">
              {fullName}
            </h1>
            <p className="font-sans text-xs sm:text-sm tracking-widest uppercase text-[#7F1D1D] font-bold mt-4">
              {personal.title || 'ARCHITECT OF MODERN DIGITAL EXPERIENCES'}
            </p>
          </div>

          {/* Editorial Lead Paragraph with Drop Cap */}
          <div className="mt-8 border-t border-[#191614]/30 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <p className="text-lg sm:text-xl text-[#2B2623] leading-relaxed">
                <span className="float-left text-5xl sm:text-6xl font-black text-[#7F1D1D] leading-none pr-3 pt-1">
                  {personal.bio ? personal.bio.charAt(0) : 'W'}
                </span>
                {personal.bio
                  ? personal.bio.slice(1)
                  : 'riting code as an act of deliberate authorship. Bridging the rigorous logic of distributed architectures with the nuanced sensitivity of human-centric interaction design.'}
              </p>
            </div>

            <div className="md:col-span-4 border-l border-[#191614]/20 pl-6 font-sans text-xs space-y-3">
              <div className="font-bold text-[#7F1D1D] uppercase tracking-wider">
                EDITORIAL CONTACTS
              </div>
              {personal.email && (
                <div>
                  <a href={`mailto:${personal.email}`} className="hover:underline text-neutral-800">
                    {personal.email}
                  </a>
                </div>
              )}
              {personal.github && (
                <div>
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-neutral-800 flex items-center gap-1"
                  >
                    GitHub Archive <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}
              {personal.linkedin && (
                <div>
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-neutral-800 flex items-center gap-1"
                  >
                    Professional Profile <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===================== FEATURED CASE STUDIES (PROJECTS) ===================== */}
        <section className="space-y-10">
          <div className="border-b-2 border-[#191614] pb-2 flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#191614]">
              ESSAYS & CASE STUDIES
            </h2>
            <span className="font-sans text-xs text-neutral-500 uppercase tracking-widest">
              CURATED SELECTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((p, idx) => (
              <article key={p.id} className="border-b border-[#191614]/20 pb-8 flex flex-col justify-between">
                <div>
                  {p.imageUrl && (
                    <div className="mb-4 h-52 w-full overflow-hidden border border-[#191614]">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-105" />
                    </div>
                  )}

                  <div className="font-sans text-[10px] tracking-widest uppercase text-[#7F1D1D] font-bold mb-1">
                    REPORT NO. {String(idx + 1).padStart(2, '0')}
                  </div>

                  <h3 className="text-2xl font-bold text-[#191614] leading-snug">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#4A423D] leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#191614]/10 font-sans text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 text-[11px] text-neutral-600">
                    {p.techStack.join(' • ')}
                  </div>
                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">
                        Manuscript
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#7F1D1D] hover:underline font-bold">
                        Exhibit →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================== CURATED REPERTOIRE (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#191614] pb-2">
            <h2 className="text-2xl font-black uppercase text-[#191614]">
              CURATED REPERTOIRE
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 font-sans">
            {skills.map((s) => (
              <div key={s.id} className="border-t border-[#191614]/30 pt-3">
                <div className="font-bold text-sm text-[#191614]">{s.name}</div>
                <div className="text-[11px] text-neutral-500 uppercase mt-0.5">
                  Proficiency Level {s.level || 5} of 5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CHRONICLE (EXPERIENCE & EDUCATION) ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-2 border-[#191614] pt-8">
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#7F1D1D] mb-4">
              CHRONOLOGY OF ENGAGEMENTS
            </h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="font-bold text-lg text-[#191614]">{exp.position}</div>
                  <div className="font-sans text-xs text-neutral-600">
                    {exp.company} — {exp.startDate} to {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-[#4A423D] leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#7F1D1D] mb-4">
              ACADEMIC FOUNDATION
            </h3>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-lg text-[#191614]">{edu.institution}</div>
                  <div className="font-sans text-xs text-neutral-600">
                    {edu.degree} in {edu.field} ({edu.startYear} – {edu.endYear})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-t-4 border-[#191614] pt-6 text-center font-sans text-xs tracking-widest uppercase text-neutral-500">
          PRINTED IN PORTCRAFT • {fullName} • ALL ESSAYS AUTHENTIC
        </footer>
      </div>
    </div>
  );
}
