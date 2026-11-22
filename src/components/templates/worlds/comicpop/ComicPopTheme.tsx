'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Sparkles,
  Zap,
  ExternalLink,
  Mail,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function ComicPopTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'POW HERO';

  return (
    <div className="relative min-h-screen bg-[#FFFDF0] text-black font-sans selection:bg-[#FFE600] selection:text-black overflow-x-hidden">
      {/* Ben-Day Halftone Dot Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, #000000 2px, transparent 2px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ===================== COMIC STRIP HEADER ===================== */}
        <div className="flex flex-wrap items-center justify-between border-4 border-black bg-[#FFE600] p-3 shadow-[6px_6px_0_#000]">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF0033] text-white font-black text-xs px-2.5 py-0.5 border-2 border-black -rotate-3">
              12¢ APPROVED BY CODE AUTHORITY
            </span>
            <span className="font-black text-sm uppercase tracking-wider">
              GOLDEN AGE COMIC CHRONICLES // ISSUE #01
            </span>
          </div>
          <span className="font-black text-xs uppercase bg-white px-2 py-0.5 border-2 border-black">
            BAM! POW!
          </span>
        </div>

        {/* ===================== DRAMATIC HERO PANEL ===================== */}
        <header className="border-4 border-black bg-white p-6 sm:p-10 shadow-[10px_10px_0_#FF0033] relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Comic Frame Avatar */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-40 h-40 border-4 border-black bg-[#00E5FF] p-2 rotate-2 shadow-[6px_6px_0_#000]">
                {personal.avatar ? (
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover border-2 border-black filter contrast-125 saturate-150" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFE600] text-black">
                    <Zap className="w-16 h-16 animate-bounce" />
                    <span className="font-black text-xs uppercase mt-1">HERO</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comic Speech Balloon Bio */}
            <div className="md:col-span-8">
              <div className="inline-block bg-[#FF0033] text-white font-black text-xs px-3 py-1 border-2 border-black uppercase tracking-widest mb-3 shadow-[3px_3px_0_#000] -skew-x-6">
                {personal.title || 'INCREDIBLE CODE DEFENDER'}
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight drop-shadow-[4px_4px_0_#FFE600]">
                {fullName}
              </h1>

              {/* Speech Bubble */}
              <div className="relative mt-4 border-4 border-black bg-[#FFE600] p-4 text-sm font-bold shadow-[4px_4px_0_#000]">
                <p>
                  &quot;{personal.bio ||
                    'With great computational power comes great architectural responsibility! Defeating monolithic legacy beasts one commit at a time!'}&quot;
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-black">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border-2 border-black bg-white hover:bg-[#FF0033] hover:text-white px-3 py-1.5 shadow-[3px_3px_0_#000] transition-colors"
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
                    className="flex items-center gap-1.5 border-2 border-black bg-[#00E5FF] hover:bg-black hover:text-white px-3 py-1.5 shadow-[3px_3px_0_#000] transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>SUPER-REPOS</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== COMIC PANELS (PROJECTS) ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-black drop-shadow-[3px_3px_0_#FFE600]">
              ACTION-PACKED ISSUES & MISSIONS
            </h2>
            <span className="font-black text-xs bg-[#FF0033] text-white px-2 py-1 border-2 border-black">
              [{projects.length} EPISODES]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-4 border-black bg-white p-5 shadow-[8px_8px_0_#000] hover:shadow-[10px_10px_0_#FF0033] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-black mb-3">
                    <span className="bg-[#FFE600] px-2 py-0.5 border-2 border-black">
                      PANEL #{String(idx + 1).padStart(2, '0')}
                    </span>
                    {p.featured && (
                      <span className="bg-[#FF0033] text-white text-[10px] px-2 py-0.5 border-2 border-black uppercase rotate-2">
                        SMASH HIT!
                      </span>
                    )}
                  </div>

                  {p.imageUrl && (
                    <div className="h-44 w-full mb-3 border-2 border-black overflow-hidden bg-black">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover filter contrast-125" />
                    </div>
                  )}

                  <h3 className="text-2xl font-black uppercase text-black">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed min-h-[3rem]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs font-black">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#00E5FF] border border-black px-2 py-0.5 text-[10px]">
                        #{tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <GithubIcon className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-[#FFE600] px-2.5 py-1 border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Read
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SUPERPOWERS (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b-4 border-black pb-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black">
              SUPERPOWERS & ABILITY CARDS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skills.map((s) => (
              <div key={s.id} className="border-4 border-black bg-white p-3 shadow-[4px_4px_0_#00E5FF]">
                <div className="font-black text-sm text-black">{s.name}</div>
                <div className="text-[11px] font-black text-[#FF0033] mt-1">
                  POWER LEVEL: {s.level || 5}/5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== STORY CHAPTERS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-black pt-8">
          <div>
            <h3 className="font-black text-lg uppercase text-black mb-4">
              CHRONICLES OF BATTLES PAST
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_#FFE600]">
                  <div className="font-black text-base uppercase text-black">{exp.position}</div>
                  <div className="text-xs font-bold text-[#FF0033]">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-2 text-xs font-medium text-slate-700 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-black text-lg uppercase text-black mb-4">
              SUPERHERO ACADEMY ALUMNI
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_#00E5FF]">
                  <div className="font-black text-base uppercase text-black">{edu.institution}</div>
                  <div className="text-xs font-bold text-black">{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-4 border-black bg-[#FF0033] text-white p-4 text-center font-black text-xs uppercase shadow-[6px_6px_0_#000]">
          TO BE CONTINUED IN NEXT ISSUE • {fullName.toUpperCase()}
        </footer>
      </div>
    </div>
  );
}
