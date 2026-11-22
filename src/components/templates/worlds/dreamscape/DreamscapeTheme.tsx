'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Sparkles,
  Moon,
  Cloud,
  ExternalLink,
  Mail,
  MapPin,
  Heart,
  Layers,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function DreamscapeTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'LUCID DREAMER';

  return (
    <div className="relative min-h-screen bg-[#0E0B1A] text-[#F3E8FF] font-sans selection:bg-[#C084FC] selection:text-black overflow-x-hidden">
      {/* Floating Clouds / Mist Glow SVG */}
      <div className="fixed top-20 left-10 w-[600px] h-[400px] pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 600 400" className="w-full h-full" fill="none">
          <ellipse cx="300" cy="200" rx="250" ry="120" fill="url(#mistGrad)" />
          <defs>
            <radialGradient id="mistGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="60%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* ===================== TOP CLOUD STATUS ===================== */}
        <div className="flex flex-wrap items-center justify-between border border-[#C084FC]/30 bg-[#1A1230]/70 backdrop-blur-md px-5 py-3 rounded-full text-xs">
          <div className="flex items-center gap-2 text-[#C084FC]">
            <Moon className="w-4 h-4 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              DREAMSCAPE VALLEY // REALM OF LUCID CONSCIOUSNESS
            </span>
          </div>
          <span className="text-[#FDBA74] font-medium">FREQUENCY: 432 HZ // PEACEFUL</span>
        </div>

        {/* ===================== DREAMWEAVER HERO ===================== */}
        <header className="border border-[#C084FC]/30 bg-gradient-to-br from-[#1E1238] via-[#120B24] to-[#25123A] p-8 sm:p-12 rounded-3xl relative shadow-[0_0_50px_rgba(192,132,252,0.15)] text-center">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-2 border-[#C084FC] p-1 shadow-[0_0_30px_rgba(192,132,252,0.4)] mb-6 overflow-hidden">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full" />
              </div>
            )}

            <div className="text-xs uppercase tracking-widest text-[#FDBA74] font-bold mb-2">
              ✦ DREAMWEAVER & DIGITAL VISIONARY ✦
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_20px_rgba(192,132,252,0.4)]">
              {fullName}
            </h1>

            <p className="text-sm sm:text-base text-[#C084FC] mt-2 font-medium tracking-wide">
              {personal.title || 'Creative Architect & Surrealist Systems Designer'}
            </p>

            <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed italic">
              &quot;{personal.bio ||
                'Translating ethereal visions into tactile interactive software, constructing serene floating digital worlds, and composing gentle algorithmic harmonies.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 bg-[#C084FC] text-black hover:bg-white px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider shadow-lg"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>TRANSMIT THOUGHT</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-[#C084FC]/50 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>DREAM CODES</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== DREAM FRAGMENTS (PROJECTS) ===================== */}
        <section className="space-y-8">
          <div className="border-b border-[#C084FC]/30 pb-3 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
              DREAM FRAGMENTS & VISIONS
            </h2>
            <span className="text-xs text-[#C084FC]">[{projects.length} FRAGMENTS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#C084FC]/30 bg-[#160E2E]/80 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-[#F472B6] transition-all"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-3 text-purple-300">
                    <span className="text-[#FDBA74]">VISION #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#F472B6]/20 text-[#F472B6] border border-[#F472B6] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        LUCID AWAKENING
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-4 rounded-2xl border border-[#C084FC]/20 overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-2xl font-bold uppercase text-white">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-purple-200/90 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-900/60 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-[#C084FC]">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#231545] px-2 py-0.5 rounded-full border border-purple-800">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white flex items-center gap-1">
                        <GithubIcon className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#FDBA74] hover:underline flex items-center gap-1 font-bold">
                        <ExternalLink className="w-3.5 h-3.5" /> Awaken
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CREATIVE ABILITIES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#C084FC]/30 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              CREATIVE ABILITIES & REPERTOIRE
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-purple-800/80 bg-[#1B1138] p-4 rounded-2xl text-center">
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[11px] text-[#C084FC] mt-1 font-medium">
                  HARMONY: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== PILGRIMAGE ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[#C084FC]/30 pt-10">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C084FC] font-bold mb-4">
              PILGRIMAGE THROUGH DREAM WORLDS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#C084FC] pl-4">
                  <div className="text-base font-bold text-white">{exp.position}</div>
                  <div className="text-xs text-purple-300">{exp.company} // {exp.startDate} - {exp.endDate || 'Now'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#FDBA74] font-bold mb-4">
              ACADEMY OF IMAGINATION
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#FDBA74] pl-4">
                  <div className="text-base font-bold text-white">{edu.institution}</div>
                  <div className="text-xs text-neutral-400">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#C084FC]/30 bg-[#120B24] p-6 rounded-full text-center text-xs text-purple-400">
          DREAMSCAPE CONSCIOUSNESS // DRIFTING THROUGH STARS • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
