'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Feather,
  BookOpen,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function KingdomOfInkTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'SCHOLAR LI';

  return (
    <div className="relative min-h-screen bg-[#F8F4EC] text-[#1E1E24] font-serif selection:bg-[#C23B22] selection:text-white overflow-x-hidden">
      {/* Ink Wash Mountain Silhouette SVG Background */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 1200 350" className="w-full h-auto" fill="none">
          <path d="M0,220 Q300,80 600,180 T1200,120 L1200,350 L0,350 Z" fill="#111113" />
          <path d="M0,260 Q400,160 800,240 T1200,200 L1200,350 L0,350 Z" fill="#3D3A45" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== IMPERIAL MASTHEAD ===================== */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#1E1E24] pb-3 text-xs uppercase tracking-widest text-[#4A6B53] font-sans">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C23B22] inline-block" />
            <span className="font-bold text-[#1E1E24]">IMPERIAL CALLIGRAPHY ARCHIVE // HANLIN ACADEMY</span>
          </div>
          <span>YEAR OF THE WATER DRAGON</span>
        </div>

        {/* ===================== CALLIGRAPHY HERO ===================== */}
        <header className="border-t-2 border-b-2 border-[#1E1E24] py-12 text-center relative">
          {/* Traditional Vermillion Seal Stamp */}
          <div className="absolute top-6 right-6 border-2 border-[#C23B22] p-1.5 rotate-3 text-[#C23B22] font-sans font-black text-[10px] tracking-widest uppercase">
            CERTIFIED SEAL
          </div>

          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-2 border-[#1E1E24] p-1 mb-6 overflow-hidden bg-white shadow-xl">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full filter grayscale contrast-125" />
              </div>
            )}

            <div className="font-sans text-xs uppercase tracking-widest text-[#C23B22] font-bold mb-2">
              MASTER OF BRUSH & ARCHITECTURAL LOGIC
            </div>

            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#111113]">
              {fullName}
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#4A6B53] mt-2 font-bold tracking-wide">
              {personal.title || 'Master Calligrapher & Software Scholar'}
            </p>

            <p className="mt-6 text-base sm:text-lg text-[#33313B] max-w-2xl leading-relaxed italic">
              &quot;{personal.bio ||
                'Every stroke of code carries intentional gravity. Like ink meeting fine rice paper, our digital creations should flow with balance, simplicity, and enduring grace.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 font-sans text-xs">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 border-2 border-[#1E1E24] bg-white hover:bg-[#C23B22] hover:text-white hover:border-[#C23B22] px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>TRANSMIT SCROLL</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-[#1E1E24] bg-white hover:bg-[#1E1E24] hover:text-white px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>MANUSCRIPTS (GITHUB)</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== INSCRIBED SCROLLS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="border-b-2 border-[#1E1E24] pb-3 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#111113]">
              INSCRIBED SCROLLS & WORKS
            </h2>
            <span className="font-sans text-xs text-[#4A6B53]">[{projects.length} WORKS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-[#1E1E24] bg-white p-6 shadow-md flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex justify-between items-center font-sans text-xs mb-3 text-neutral-500">
                    <span className="font-bold text-[#111113]">SCROLL #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#C23B22] text-white text-[9px] font-bold px-2 py-0.5 uppercase">
                        IMPERIAL SELECTION
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-4 border border-[#1E1E24] overflow-hidden bg-neutral-100">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-105" />
                    </div>
                  )}

                  <h3 className="text-2xl font-bold uppercase text-[#111113]">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[#44424D] leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 font-sans text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 text-[11px] text-[#4A6B53] font-medium">
                    {p.techStack.join(' • ')}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-[#111113] font-bold">
                        <GithubIcon className="w-3.5 h-3.5" /> Brush
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#C23B22] hover:underline flex items-center gap-1 font-black">
                        <ExternalLink className="w-3.5 h-3.5" /> Exhibit
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DISCIPLINES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#1E1E24] pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#111113]">
              SCHOLARLY ARTS & DISCIPLINES
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#1E1E24] bg-white p-3 text-center">
                <div className="font-bold text-[#111113] text-sm">{s.name}</div>
                <div className="text-[10px] text-[#C23B22] mt-1 font-mono uppercase font-bold">
                  GRADE: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t-2 border-[#1E1E24] pt-10 font-sans">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C23B22] font-bold mb-4">
              CHRONOLOGY OF SERVICE
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#C23B22] pl-4">
                  <div className="text-base font-bold text-[#111113]">{exp.position}</div>
                  <div className="text-xs text-neutral-600">{exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#4A6B53] font-bold mb-4">
              IMPERIAL ACADEMY OF LETTERS
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#4A6B53] pl-4">
                  <div className="text-base font-bold text-[#111113]">{edu.institution}</div>
                  <div className="text-xs text-neutral-600">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-t-2 border-[#1E1E24] pt-6 text-center font-sans text-xs text-neutral-600 uppercase tracking-widest">
          KINGDOM OF INK // AUTHENTIC HANLIN CODEX • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
