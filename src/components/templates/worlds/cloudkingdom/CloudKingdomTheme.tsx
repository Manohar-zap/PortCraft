'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Wind,
  Compass,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  Plane,
  Cloud,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function CloudKingdomTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CAPTAIN SKY';

  return (
    <div className="relative min-h-screen bg-[#F0F9FF] text-[#0F172A] font-sans selection:bg-[#38BDF8] selection:text-white overflow-x-hidden">
      {/* Floating Cloud Silhouettes SVG Background */}
      <div className="fixed -bottom-10 left-0 right-0 pointer-events-none z-0 opacity-40">
        <svg viewBox="0 0 1200 300" className="w-full h-auto" fill="none">
          <ellipse cx="200" cy="220" rx="250" ry="80" fill="#BAE6FD" />
          <ellipse cx="600" cy="240" rx="300" ry="90" fill="#E0F2FE" />
          <ellipse cx="1000" cy="220" rx="250" ry="80" fill="#BAE6FD" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== AIRSHIP LOG ===================== */}
        <div className="flex flex-wrap items-center justify-between border-2 border-[#38BDF8] bg-white p-3 rounded-2xl shadow-lg text-xs font-mono">
          <div className="flex items-center gap-2 text-[#0284C7]">
            <Cloud className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-bold uppercase tracking-wider">
              ROYAL AIRSHIP ZEPHYR // ALTITUDE: 14,200 FT // CLEAR SKIES
            </span>
          </div>
          <span className="text-[#D97706] font-bold">WIND: 12 KNOTS NE</span>
        </div>

        {/* ===================== SKY CAPTAIN HERO ===================== */}
        <header className="border-2 border-[#38BDF8] bg-gradient-to-br from-white via-[#F0F9FF] to-[#E0F2FE] p-6 sm:p-10 rounded-3xl relative shadow-[0_10px_30px_rgba(56,189,248,0.2)] text-center">
          <div className="flex flex-col items-center">
            {personal.avatar && (
              <div className="w-36 h-36 rounded-full border-4 border-[#38BDF8] p-1 shadow-xl mb-6 overflow-hidden bg-white">
                <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover rounded-full" />
              </div>
            )}

            <div className="font-mono text-xs uppercase tracking-widest text-[#0284C7] font-bold mb-2">
              ✦ SKY ARCHITECT & HIGH-ALTITUDE AVIATOR ✦
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0F172A] drop-shadow-sm">
              {fullName}
            </h1>

            <p className="text-sm sm:text-base font-bold text-[#D97706] uppercase tracking-wider mt-1 font-mono">
              {personal.title || 'Cloud Infrastructure Architect & Aerial Technologist'}
            </p>

            <p className="mt-4 text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed">
              &quot;{personal.bio ||
                'Soaring above turbulent legacy architectures, charting pristine cloud-native flightpaths, and deploying high-altitude distributed solutions.'}&quot;
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold font-mono">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2 bg-[#0284C7] text-white hover:bg-black px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>TRANSMIT AIRMAIL</span>
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-[#0284C7] bg-white text-[#0284C7] hover:bg-[#0284C7] hover:text-white px-5 py-2.5 rounded-full transition-colors uppercase tracking-wider shadow-sm"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>FLIGHT PLANS</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ===================== SKY VOYAGES (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#BAE6FD] pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#0F172A] tracking-wide">
              EXPEDITIONS & AIRSHIP BUILDS
            </h2>
            <span className="font-mono text-xs text-[#0284C7]">[{projects.length} VOYAGES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-2 border-[#BAE6FD] bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:border-[#38BDF8] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-3 text-slate-500">
                    <span className="text-[#0284C7] font-bold">VOYAGE #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        FLAGSHIP AIRSHIP
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-3 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h3 className="text-xl font-black uppercase text-[#0F172A]">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 font-bold">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-slate-600">
                        <GithubIcon className="w-3.5 h-3.5" /> Log
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#0284C7] hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Board
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== AERONAUTIC CAPABILITIES (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#BAE6FD] pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0F172A]">
              AERONAUTIC CAPABILITIES & ENGINES
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border-2 border-sky-100 bg-white p-3 rounded-2xl shadow-sm">
                <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                <div className="text-[10px] text-[#0284C7] mt-1 font-bold">
                  ALTITUDE: {((s.level || 5) * 20)}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== VOYAGE LOGS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-[#BAE6FD] pt-8">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#0284C7] font-bold mb-4">
              EXPEDITION FLIGHT LOGS
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#0284C7] pl-4">
                  <div className="text-base font-bold text-[#0F172A] uppercase">{exp.position}</div>
                  <div className="text-xs text-[#D97706] font-mono">{exp.company} // {exp.startDate} - {exp.endDate || 'Now'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#D97706] font-bold mb-4">
              ROYAL AERONAUTICAL ACADEMY
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#D97706] pl-4">
                  <div className="text-base font-bold text-[#0F172A] uppercase">{edu.institution}</div>
                  <div className="text-xs text-slate-500 font-mono">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-2 border-[#BAE6FD] bg-white p-4 rounded-2xl text-center font-mono text-xs text-slate-500 shadow-sm">
          CLOUD KINGDOM NAVIGATION FLEET \/ CELESTIAL HIGHLANDS \u2022 {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
