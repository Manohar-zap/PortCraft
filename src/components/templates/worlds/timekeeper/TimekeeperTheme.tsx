'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Clock,
  Compass,
  Layers,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function TimekeeperTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CHRONOS';

  return (
    <div className="relative min-h-screen bg-[#140C07] text-[#EDE0D4] font-serif selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* Clockwork Gear SVG Watermark */}
      <div className="fixed top-12 right-0 w-[550px] h-[550px] pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_100s_linear_infinite]" fill="none">
          <circle cx="200" cy="200" r="160" stroke="#D4AF37" strokeWidth="3" strokeDasharray="10 5" />
          <circle cx="200" cy="200" r="110" stroke="#CD7F32" strokeWidth="2" />
          <circle cx="200" cy="200" r="50" stroke="#D4AF37" strokeWidth="4" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="30"
              x2="200"
              y2="50"
              stroke="#D4AF37"
              strokeWidth="4"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== CHRONOMETER DISPATCH ===================== */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#D4AF37]/30 pb-3 font-sans text-xs uppercase tracking-widest text-[#D4AF37]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>CHRONOS HOROLOGICAL GUILD // PRECISION ESCAPEMENT</span>
          </div>
          <span className="font-mono">CALIBER: 28,800 BPH</span>
        </div>

        {/* ===================== TIMEKEEPER HERO ===================== */}
        <header className="border-t border-b border-[#D4AF37]/40 py-12 text-center relative">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-2 border-[#D4AF37] p-1 mb-6 overflow-hidden bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full filter sepia-20" />
              </div>
            )}

            <div className="font-sans text-xs uppercase tracking-widest text-[#CD7F32] font-bold mb-2">
              MASTER HOROLOGIST & TEMPORAL ARCHITECT
            </div>

            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-wide text-[#D4AF37]">
              {fullName}
            </h1>

            <p className="font-sans text-sm sm:text-base text-neutral-300 mt-2 font-medium tracking-wide">
              {personal.title || 'Precision Systems Engineer & Chronos Craftsman'}
            </p>

            <p className="mt-6 text-sm sm:text-base text-neutral-300/90 max-w-2xl leading-relaxed italic">
              &quot;{personal.bio ||
                'Aligning intricate gear trains of asynchronous logic, harmonizing system clock cycles, and crafting timeless digital escapements with microsecond precision.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 font-sans text-xs">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 border border-[#D4AF37] bg-[#21140B] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>DISPATCH LETTER</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-[#CD7F32] bg-[#21140B] hover:bg-[#CD7F32] hover:text-black text-white px-4 py-2 transition-colors font-bold uppercase tracking-wider"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>MECHANISMS (GITHUB)</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== CRAFTED MECHANISMS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="border-b border-[#D4AF37]/30 pb-3 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#D4AF37]">
              CRAFTED CALIBERS & MECHANISMS
            </h2>
            <span className="font-sans text-xs text-neutral-400">[{projects.length} TIMEPIECES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#D4AF37]/30 bg-[#1D1109] p-6 shadow-xl flex flex-col justify-between hover:border-[#D4AF37] transition-all"
              >
                <div>
                  <div className="flex justify-between items-center font-sans text-xs mb-3 text-neutral-400">
                    <span className="text-[#D4AF37]">CALIBER #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="border border-[#CD7F32] text-[#CD7F32] text-[10px] font-bold px-2 py-0.5 uppercase">
                        TOURBILLON GRADE
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-4 border border-[#D4AF37]/20 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter sepia-20" />
                    </div>
                  )}

                  <h3 className="text-2xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 font-sans text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 text-[11px] text-[#D4AF37]">
                    {p.techStack.join(' • ')}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Blueprint
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Wind Up
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== ESCAPEMENTS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#D4AF37]/30 pb-3">
            <h2 className="text-2xl font-black uppercase text-[#D4AF37]">
              PRECISION ESCAPEMENTS & COMPLICATIONS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#D4AF37]/20 bg-[#1A0E08] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#D4AF37] mt-1 font-mono uppercase">
                  PRECISION: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CHRONOLOGY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#D4AF37]/30 pt-10 font-sans">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-4">
              HISTORICAL HOROLOGICAL EPOCHS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#D4AF37] pl-4">
                  <div className="text-base font-bold text-white">{exp.position}</div>
                  <div className="text-xs text-[#CD7F32]">{exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#CD7F32] font-bold mb-4">
              CHRONOS GUILD OF WATCHMAKERS
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#CD7F32] pl-4">
                  <div className="text-base font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-neutral-400">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-t border-[#D4AF37]/30 pt-6 text-center font-sans text-xs text-neutral-500 uppercase tracking-widest">
          TIMEKEEPER GUILD // TICKING WITH PRECISION • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
