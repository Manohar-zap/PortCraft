'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Sun,
  Flame,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Music,
  Tv,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function ViceCityTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'TOMMY VERCETTI';

  return (
    <div className="relative min-h-screen bg-[#080512] text-[#FCE7F3] font-sans selection:bg-[#FF007F] selection:text-white overflow-x-hidden">
      {/* 80s Wireframe Floor Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #FF007F 1px, transparent 1px), linear-gradient(to bottom, #00F5D4 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Synthwave Sunset SVG Centerpiece */}
      <div className="fixed -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none z-0 opacity-25">
        <svg viewBox="0 0 500 300" className="w-full h-full" fill="none">
          <circle cx="250" cy="200" r="140" fill="url(#sunGrad)" />
          <defs>
            <linearGradient id="sunGrad" x1="250" y1="60" x2="250" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF8500" />
              <stop offset="60%" stopColor="#FF007F" />
              <stop offset="100%" stopColor="#7B2CBF" />
            </linearGradient>
          </defs>
          {[130, 155, 175, 195, 210, 225].map((y) => (
            <rect key={y} x="100" y={y} width="300" height="4" fill="#080512" />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== TOP VHS BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between border-2 border-[#FF007F] bg-[#140A26] p-3 shadow-[0_0_20px_rgba(255,0,127,0.3)] font-mono text-xs">
          <div className="flex items-center gap-2 text-[#00F5D4]">
            <Tv className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              VICE CITY BROADCAST // SP-1986 // HI-FI STEREO
            </span>
          </div>
          <span className="text-[#FF8500] font-bold">PLAY ► [00:42:15]</span>
        </div>

        {/* ===================== SUNSET HERO ===================== */}
        <header className="border-2 border-[#FF007F] bg-gradient-to-b from-[#200A38] to-[#0F071F] p-6 sm:p-10 rounded-2xl relative shadow-[0_0_40px_rgba(255,0,127,0.25)] text-center">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-4 border-[#00F5D4] p-1 shadow-[0_0_25px_rgba(0,245,212,0.5)] mb-6 overflow-hidden">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full filter contrast-125 saturate-150" />
              </div>
            )}

            <div className="font-mono text-xs uppercase tracking-widest text-[#00F5D4] font-bold mb-2">
              ✦ MIAMI SUNSET SYNTHWAVE ✦
            </div>

            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#FF007F] drop-shadow-[0_0_20px_rgba(255,0,127,0.6)] italic">
              {fullName}
            </h1>

            <p className="text-sm sm:text-base font-bold text-[#FF8500] uppercase tracking-wider mt-1 font-mono">
              {personal.title || 'Full-Stack Virtuoso & Synthwave Technologist'}
            </p>

            <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              {personal.bio ||
                'Cruising down digital ocean drives at 120 BPM. Building high-gloss, neon-charged web architectures and ultra-responsive frontend applications.'}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 font-mono text-xs">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-1.5 border border-[#FF007F] bg-[#2E0B3B] hover:bg-[#FF007F] text-white px-4 py-2 transition-colors font-bold uppercase"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>TRANSMIT AUDIO</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-[#00F5D4] bg-[#2E0B3B] hover:bg-[#00F5D4] hover:text-black text-white px-4 py-2 transition-colors font-bold uppercase"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>MIXTAPE (GITHUB)</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== FEATURED RELEASES (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#FF007F] pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide italic">
              FEATURED TRACKS & RELEASES
            </h2>
            <span className="font-mono text-xs text-[#00F5D4]">[{projects.length} CASSETTES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-[#3D1456] bg-[#140826] p-6 hover:border-[#FF007F] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-3 text-neutral-400">
                    <span className="text-[#00F5D4]">TRACK #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#FF007F] text-white text-[9px] font-black px-2 py-0.5 uppercase">
                        PLATINUM HIT
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-3 border border-[#FF007F]/40 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-125 saturate-150" />
                    </div>
                  )}

                  <h3 className="text-2xl font-black uppercase text-white italic">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#3D1456] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#260E45] text-[#00F5D4] px-2 py-0.5 text-[10px] border border-purple-800">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 font-bold">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-neutral-300">
                        <GithubIcon className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF007F] hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Listen
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SYNTHESIZERS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#00F5D4] pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white italic">
              SYNTHESIZER INSTRUMENTS & SOUNDBOARD
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-purple-800 bg-[#1A0A30] p-3 text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-[#00F5D4] mt-1 font-bold">
                  FREQ: {((s.level || 5) * 20)}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== MIAMI TOUR DATES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-[#3D1456] pt-8 font-mono">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#FF007F] font-bold mb-4">
              TOUR SCHEDULE & ENGAGEMENTS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#FF007F] pl-4">
                  <div className="text-base font-bold text-white">{exp.position}</div>
                  <div className="text-xs text-[#00F5D4]">{exp.company} \/ {exp.startDate} - {exp.endDate || 'Now'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#00F5D4] font-bold mb-4">
              SOUTH BEACH ACADEMY
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#00F5D4] pl-4">
                  <div className="text-base font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-neutral-400">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-2 border-[#FF007F] bg-[#140A26] p-4 text-center font-mono text-xs text-neutral-400">
          VICE CITY RECORDS \/ RECORDED ON ANALOG TAPE \u2022 {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
