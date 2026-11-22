'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/lib/types';
import {
  Sword,
  Shield,
  Heart,
  Sparkles,
  Scroll,
  Trophy,
  ExternalLink,
  Mail,
  MapPin,
  Flame,
  Award,
  Crown,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function RetroRpgTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'HERO OF THE REALM';
  const [selectedQuest, setSelectedQuest] = useState<string | null>(projects[0]?.id || null);

  return (
    <div className="relative min-h-screen bg-[#14101E] text-[#F4F4F6] font-mono selection:bg-[#FEE761] selection:text-black overflow-x-hidden">
      {/* ===================== PIXEL ART DUNGEON BACKGROUND ===================== */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#FEE761 1.5px, transparent 1.5px), radial-gradient(#3B5DC9 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* ===================== RPG TOP GUILD BANNER ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-4 border-black bg-[#231A38] p-3 mb-8 shadow-[4px_4px_0_#000]">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-[#FEE761]" />
            <span className="font-black text-xs text-[#FEE761] uppercase tracking-wider">
              PORTCRAFT GUILD // GUILD REGISTER: S-RANK
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-300">
            <span className="flex items-center gap-1 text-[#D95763]">
              <Heart className="w-3.5 h-3.5 fill-current" /> 100/100 HP
            </span>
            <span className="text-[#3B5DC9] font-bold">150/150 MP</span>
            <span className="bg-[#38B764] text-black text-[10px] font-black px-1.5 py-0.5">
              LVL. 48
            </span>
          </div>
        </div>

        {/* ===================== CHARACTER SHEET (HERO CARD) ===================== */}
        <header className="border-4 border-black bg-[#1C162E] p-6 sm:p-8 mb-12 shadow-[8px_8px_0_#000]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Character Avatar in Pixel Box */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative border-4 border-black p-1 bg-[#3A2A56] shadow-[4px_4px_0_#000]">
                <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#0F0C17] flex items-center justify-center overflow-hidden">
                  {personal.avatar ? (
                    <img
                      src={personal.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover filter contrast-125"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#FEE761]">
                      <Crown className="w-14 h-14 mb-2 animate-bounce" />
                      <span className="text-[10px] font-black uppercase">LVL 99 ARCHMAGE</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 bg-[#FEE761] text-black font-black text-xs px-3 py-1 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0_#000]">
                CLASS: CODE WIZARD
              </div>
            </div>

            {/* Character Attributes & Description */}
            <div className="md:col-span-8">
              <div className="text-xs text-[#38B764] uppercase font-bold tracking-widest mb-1">
                ✦ ADVENTURER DOSSIER
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#FEE761] uppercase tracking-tight drop-shadow-[3px_3px_0_#000]">
                {fullName}
              </h1>

              <div className="text-sm font-bold text-[#3B5DC9] uppercase mt-1">
                {personal.title || 'LEGENDARY SOFTWARE CRAFTSMAN'}
              </div>

              {/* Dialogue Box Bio */}
              <div className="relative mt-4 border-4 border-black bg-[#100D1B] p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed shadow-[4px_4px_0_#000]">
                <div className="text-[10px] text-[#FEE761] font-black mb-1 uppercase tracking-widest">
                  [ NPC DIALOGUE: HERO&apos;S OATH ]
                </div>
                <p>
                  &quot;{personal.bio ||
                    'Embarking on grand technical expeditions across distributed lands, vanquishing legacy bugs, and conjuring high-performance web spells.'}&quot;
                </p>
                <span className="absolute bottom-2 right-3 text-[#FEE761] text-xs animate-bounce">
                  ▼
                </span>
              </div>

              {/* Quest Attributes Matrix */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="border-2 border-black bg-[#2B1F45] p-2 text-center">
                  <div className="text-[10px] text-neutral-400">INT (LOGIC)</div>
                  <div className="text-sm font-black text-[#FEE761]">98 / 100</div>
                </div>
                <div className="border-2 border-black bg-[#2B1F45] p-2 text-center">
                  <div className="text-[10px] text-neutral-400">DEX (SPEED)</div>
                  <div className="text-sm font-black text-[#38B764]">94 / 100</div>
                </div>
                <div className="border-2 border-black bg-[#2B1F45] p-2 text-center">
                  <div className="text-[10px] text-neutral-400">VIT (SYSTEMS)</div>
                  <div className="text-sm font-black text-[#3B5DC9]">96 / 100</div>
                </div>
                <div className="border-2 border-black bg-[#2B1F45] p-2 text-center">
                  <div className="text-[10px] text-neutral-400">QUESTS DONE</div>
                  <div className="text-sm font-black text-[#D95763]">{projects.length}</div>
                </div>
              </div>

              {/* Contacts / Guild links */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                {personal.email && (
                  <a
                    href={`mailto:${personal.email}`}
                    className="flex items-center gap-1.5 border-2 border-black bg-[#2B1F45] hover:bg-[#FEE761] hover:text-black text-[#FEE761] px-2.5 py-1 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{personal.email}</span>
                  </a>
                )}
                {personal.location && (
                  <div className="flex items-center gap-1.5 border-2 border-black bg-[#2B1F45] text-neutral-300 px-2.5 py-1">
                    <MapPin className="w-3.5 h-3.5 text-[#38B764]" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border-2 border-black bg-[#2B1F45] hover:bg-[#38B764] hover:text-black text-white px-2.5 py-1 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>SPELLBOOK (GITHUB)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===================== ACTIVE QUESTS & BOSS DUNGEONS (PROJECTS) ===================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Scroll className="w-6 h-6 text-[#FEE761]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#FEE761] uppercase tracking-wider">
                COMPLETED DUNGEONS & ACTIVE QUESTS
              </h2>
            </div>
            <span className="text-xs text-neutral-400">EXP POOL: 48,200 XP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="border-4 border-black bg-[#1E1733] p-5 shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#FEE761] transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="bg-[#2C2149] text-[#FEE761] px-2 py-0.5 border border-black font-bold">
                    QUEST #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="bg-[#D95763] text-white text-[10px] font-black px-2 py-0.5 border border-black">
                    {p.featured ? 'RANK S // BOSS CLEAR' : 'RANK A'}
                  </span>
                </div>

                {p.imageUrl && (
                  <div className="mb-3 h-36 w-full border-2 border-black overflow-hidden bg-black">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  {p.title}
                </h3>

                <p className="mt-2 text-xs text-neutral-300 leading-relaxed min-h-[3rem]">
                  {p.description}
                </p>

                {/* Loot Items (Tech Stack) */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-black bg-[#120E1E] text-[#38B764] text-[10px] font-bold px-2 py-0.5"
                    >
                      +{tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FEE761] hover:underline flex items-center gap-1"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>SCROLL</span>
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#38B764] hover:underline flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>ENTER REALM</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">+500 EXP</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== INVENTORY & SPELLBOOK (SKILLS) ===================== */}
        <section className="mb-14">
          <div className="border-b-4 border-black pb-3 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#38B764]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#38B764] uppercase tracking-wider">
              SPELLBOOK & INVENTORY ITEMS
            </h2>
          </div>

          <div className="border-4 border-black bg-[#161224] p-5 shadow-[6px_6px_0_#000]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="border-2 border-black bg-[#231C38] p-3 text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{skill.name}</span>
                    <span className="text-[#FEE761]">★{skill.level || 5}</span>
                  </div>
                  <div className="w-full h-2 bg-black border border-neutral-700">
                    <div
                      className="h-full bg-[#FEE761]"
                      style={{ width: `${((skill.level || 5) / 5) * 100}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-neutral-400 mt-1 uppercase">
                    RARITY: LEGENDARY
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CHRONICLES OF ADVENTURE (EXPERIENCE & EDUCATION) ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Guild history */}
          <section>
            <div className="border-b-4 border-black pb-2 mb-4">
              <h3 className="font-black text-lg text-white uppercase">
                GUILD CAMPAIGN LOGS
              </h3>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-4 border-black bg-[#1D1730] p-4 shadow-[4px_4px_0_#000]">
                  <div className="flex justify-between items-start text-xs">
                    <span className="font-bold text-white text-sm uppercase">{exp.position}</span>
                    <span className="bg-[#38B764] text-black font-black text-[10px] px-2 py-0.5">
                      {exp.startDate} - {exp.current ? 'NOW' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-[#FEE761] mt-1 font-bold">{exp.company}</div>
                  {exp.description && (
                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Wizard Academy */}
          <section>
            <div className="border-b-4 border-black pb-2 mb-4">
              <h3 className="font-black text-lg text-white uppercase">
                ACADEMY OF SORCERY
              </h3>
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-4 border-black bg-[#1D1730] p-4 shadow-[4px_4px_0_#000]">
                  <div className="flex justify-between items-start text-xs">
                    <span className="font-bold text-white text-sm uppercase">{edu.institution}</span>
                    <span className="text-neutral-400">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                  <div className="text-xs text-[#3B5DC9] mt-1 font-bold">
                    {edu.degree} {edu.field && `// ${edu.field}`}
                  </div>
                </div>
              ))}

              {achievements.length > 0 && (
                <div className="border-4 border-black bg-[#281F42] p-4 mt-4 shadow-[4px_4px_0_#000]">
                  <div className="text-xs text-[#FEE761] font-black uppercase mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#FEE761]" />
                    GUILD TROPHIES & MEDALS
                  </div>
                  <div className="space-y-1.5">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="text-xs text-neutral-200">
                        ✦ <span className="font-bold text-white">{ach.title}</span> — {ach.issuer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ===================== RETRO FOOTER ===================== */}
        <footer className="border-4 border-black bg-[#100D1A] p-4 text-center text-xs text-neutral-400 shadow-[4px_4px_0_#000]">
          *** GAME OVER? NO. INSERT COIN TO HIRE {fullName.toUpperCase()} ***
        </footer>
      </div>
    </div>
  );
}
