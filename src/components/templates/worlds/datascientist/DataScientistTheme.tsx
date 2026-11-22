'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Activity,
  Binary,
  Cpu,
  Database,
  BarChart2,
  FileSpreadsheet,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function DataScientistTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats, publications } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'DR. ARIA VANCE';

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E2E8F0] font-sans selection:bg-[#06B6D4] selection:text-black p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ===================== LAB STATUS BAR ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#1E293B] bg-[#0F172A]/80 px-4 py-2.5 rounded-xl font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#06B6D4] font-bold">RESEARCH LAB & INTELLIGENCE CLUSTER</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>CUDA // TENSORFLOW // PYTORCH</span>
            <span className="hidden sm:inline">LATENCY: &lt;1.2ms</span>
          </div>
        </div>

        {/* ===================== PRINCIPAL RESEARCHER HERO ===================== */}
        <header className="border border-[#1E293B] bg-gradient-to-br from-[#0F172A] to-[#0A0E17] rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {personal.avatar && (
              <div className="md:col-span-3 flex justify-center md:justify-start">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#06B6D4]/40 shadow-xl">
                  <img src={personal.avatar} alt={fullName} className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className={personal.avatar ? 'md:col-span-9' : 'md:col-span-12'}>
              <div className="flex items-center gap-2 font-mono text-xs text-[#06B6D4] tracking-wider uppercase mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>PRINCIPAL INVESTIGATOR & RESEARCH ENGINEER</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {fullName}
              </h1>

              <div className="text-sm sm:text-base font-medium text-[#6366F1] mt-1 font-mono">
                {personal.title || 'Machine Learning Engineer & Data Systems Architect'}
              </div>

              <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl">
                {personal.bio ||
                  'Specializing in statistical inference, distributed model training, algorithmic efficiency, and scalable data architectures. Translating empirical research into production systems.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border border-[#1E293B] hover:border-[#06B6D4] bg-[#1E293B]/40 px-3 py-1.5 rounded-lg text-neutral-200 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border border-[#1E293B] bg-[#1E293B]/40 px-3 py-1.5 rounded-lg text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#1E293B] hover:border-[#06B6D4] bg-[#1E293B]/40 px-3 py-1.5 rounded-lg text-neutral-200 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>Research Repos</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== EMPIRICAL BENCHMARKS (CODING STATS) ===================== */}
        {codingStats && (() => {
          const lcRating = codingStats.ratings?.find(r => r.platform.toLowerCase().includes('leetcode'))?.rating;
          const cfRank = codingStats.ratings?.find(r => r.platform.toLowerCase().includes('codeforces'))?.rank;

          return (
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="border border-[#1E293B] bg-[#0F172A] p-4 rounded-xl">
                <div className="text-xs text-neutral-400 uppercase">ALGORITHMIC PROBLEMS</div>
                <div className="text-3xl font-black text-[#06B6D4] mt-1">
                  {codingStats.totalProblemsSolved || 0}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  E:{codingStats.easySolved || 0} | M:{codingStats.mediumSolved || 0} | H:{codingStats.hardSolved || 0}
                </div>
              </div>

              <div className="border border-[#1E293B] bg-[#0F172A] p-4 rounded-xl">
                <div className="text-xs text-neutral-400 uppercase">COMPETITIVE RATING</div>
                <div className="text-3xl font-black text-[#6366F1] mt-1">
                  {lcRating ? Math.round(lcRating) : 'TOP'}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  {cfRank || 'GLOBAL TIER'}
                </div>
              </div>

              <div className="border border-[#1E293B] bg-[#0F172A] p-4 rounded-xl">
                <div className="text-xs text-neutral-400 uppercase">SYSTEMS DEPLOYED</div>
                <div className="text-3xl font-black text-[#10B981] mt-1">
                  {projects.length}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">PRODUCTION LABS</div>
              </div>

              <div className="border border-[#1E293B] bg-[#0F172A] p-4 rounded-xl">
                <div className="text-xs text-neutral-400 uppercase">ACCURACY / RELIABILITY</div>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  99.4%
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">SYSTEM CONVERGENCE</div>
              </div>
            </section>
          );
        })()}

        {/* ===================== RESEARCH PROJECTS & CASE STUDIES ===================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#06B6D4]" />
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                RESEARCH INITIATIVES & EMPIRICAL MODELS
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-400">[{projects.length} STUDIES]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border border-[#1E293B] bg-[#0F172A] p-6 rounded-2xl flex flex-col justify-between hover:border-[#06B6D4]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-2">
                    <span className="text-[#06B6D4]">EXP #{String(idx + 1).padStart(2, '0')}</span>
                    {p.featured && (
                      <span className="bg-[#6366F1]/20 text-[#6366F1] px-2 py-0.5 rounded text-[10px] font-bold">
                        KEY PUBLICATION
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white uppercase">{p.title}</h3>

                  <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-[#1E293B] text-[#06B6D4] px-2 py-0.5 rounded text-[10px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-300 hover:text-white flex items-center gap-1"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#06B6D4] hover:underline flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Model Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== SCIENTIFIC TOOLS & MATHEMATICAL ARSENAL (SKILLS) ===================== */}
        <section className="space-y-6">
          <div className="border-b border-[#1E293B] pb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#6366F1]" />
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              CORE QUANTITATIVE & COMPUTATIONAL STACK
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {skills.map((s) => (
              <div key={s.id} className="border border-[#1E293B] bg-[#0F172A] p-3 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{s.name}</span>
                  <span className="text-[#06B6D4]">{((s.level || 5) * 20)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#06B6D4] to-[#6366F1]"
                    style={{ width: `${((s.level || 5) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== LAB EXPERIENCE & ACADEMIA ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#1E293B] pt-8">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#06B6D4] mb-4">
              RESEARCH APPOINTMENTS & LAB ROLES
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#06B6D4] pl-4">
                  <div className="font-bold text-white text-base">{exp.position}</div>
                  <div className="font-mono text-xs text-[#6366F1] mt-0.5">
                    {exp.company} // {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed font-sans">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#10B981] mb-4">
              ACADEMIC CITATIONS & DEGREES
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-[#10B981] pl-4">
                  <div className="font-bold text-white text-base">{edu.institution}</div>
                  <div className="font-mono text-xs text-neutral-400 mt-0.5">
                    {edu.degree} in {edu.field} ({edu.startYear} - {edu.endYear})
                  </div>
                </div>
              ))}

              {achievements.length > 0 && (
                <div className="border border-[#1E293B] bg-[#0F172A] p-4 rounded-xl mt-4">
                  <div className="font-mono text-xs text-amber-400 font-bold mb-2 uppercase">
                    HONORS & CITATIONS
                  </div>
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    {achievements.map((ach) => (
                      <div key={ach.id}>
                        • <span className="font-bold text-white">{ach.title}</span> ({ach.issuer})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="border border-[#1E293B] bg-[#0F172A] p-4 rounded-xl text-center font-mono text-xs text-neutral-500">
          DATA SCIENCE & RESEARCH ENGINE • {fullName} • DETERMINISTIC COMPUTATION
        </footer>
      </div>
    </div>
  );
}
