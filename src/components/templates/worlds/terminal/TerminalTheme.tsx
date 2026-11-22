'use client';

import React, { useState } from 'react';
import { PortfolioData } from '@/lib/types';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  ExternalLink,
  Mail,
  MapPin,
  CheckCircle,
  Folder,
  FileText,
} from 'lucide-react';
import { GithubIcon } from '../WorldIcons';

interface Props {
  data: PortfolioData;
}

export default function TerminalTheme({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, codingStats } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'ROOT_USER';

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([
    `[SYS_INIT] Authenticated as ${personal.firstName?.toLowerCase() || 'guest'}@portcraft`,
    `[SYS_INFO] Type 'help' to see available commands or click quick action buttons.`,
  ]);

  const handleCommand = (cmd: string) => {
    const cleaned = cmd.trim().toLowerCase();
    let response: string[] = [];

    if (cleaned === 'help') {
      response = [
        'Available commands:',
        '  whoami       - Display personal bio and summary',
        '  projects     - List all deployed software projects',
        '  skills       - Print technical proficiencies',
        '  experience   - Display career timeline',
        '  education    - Display academic history',
        '  contact      - Print communication endpoints',
        '  clear        - Clear terminal history',
      ];
    } else if (cleaned === 'whoami' || cleaned === 'bio') {
      response = [
        `USER: ${fullName}`,
        `TITLE: ${personal.title || 'Software Architect'}`,
        `BIO: ${personal.bio || 'Building robust systems with clean code.'}`,
        `LOCATION: ${personal.location || 'Remote'}`,
      ];
    } else if (cleaned === 'projects') {
      response = [
        `=== DEPLOYED PROJECTS (${projects.length}) ===`,
        ...projects.map(
          (p, i) =>
            `[${i + 1}] ${p.title} -- ${p.techStack.join(', ')} | URL: ${p.liveUrl || p.githubUrl || 'N/A'}`
        ),
      ];
    } else if (cleaned === 'skills') {
      response = [
        '=== TECHNICAL ARSENAL ===',
        ...skills.map((s) => `  * ${s.name.padEnd(20, ' ')} [${'#'.repeat(s.level || 5)}${'-'.repeat(5 - (s.level || 5))}]`),
      ];
    } else if (cleaned === 'experience') {
      response = [
        '=== CAREER HISTORY ===',
        ...experience.map((e) => `  * ${e.position} @ ${e.company} (${e.startDate} - ${e.endDate || 'Present'})`),
      ];
    } else if (cleaned === 'education') {
      response = [
        '=== ACADEMIC BACKGROUND ===',
        ...education.map((ed) => `  * ${ed.degree} in ${ed.field} -- ${ed.institution} (${ed.startYear}-${ed.endYear})`),
      ];
    } else if (cleaned === 'contact') {
      response = [
        `EMAIL: ${personal.email || 'N/A'}`,
        `GITHUB: ${personal.github || 'N/A'}`,
        `LINKEDIN: ${personal.linkedin || 'N/A'}`,
      ];
    } else if (cleaned === 'clear') {
      setHistory([]);
      return;
    } else if (cleaned !== '') {
      response = [`bash: command not found: ${cleaned}. Type 'help' for command list.`];
    }

    setHistory((prev) => [...prev, `$ ${cmd}`, ...response]);
    setInputVal('');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      handleCommand(inputVal);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#39FF14] font-mono selection:bg-[#39FF14] selection:text-black p-4 sm:p-8">
      <div className="max-w-5xl mx-auto border-2 border-[#1B4324] bg-[#070B09] shadow-[0_0_40px_rgba(57,255,20,0.15)] rounded-lg overflow-hidden">
        {/* ===================== TERMINAL WINDOW HEADER ===================== */}
        <div className="flex items-center justify-between bg-[#111A14] border-b border-[#1B4324] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-xs text-neutral-400 font-bold ml-2">
              bash - {personal.firstName?.toLowerCase() || 'user'}@portcraft:~
            </span>
          </div>
          <div className="text-xs text-neutral-500 hidden sm:block">
            UTF-8 // 80x24 // BUFFER ACTIVE
          </div>
        </div>

        {/* ===================== INTERACTIVE CLI BODY ===================== */}
        <div className="p-6 space-y-6">
          {/* ASCII Banner & Identification */}
          <div className="text-xs sm:text-sm text-[#39FF14] leading-tight select-none">
            <pre className="font-mono text-[10px] sm:text-xs text-[#22C55E]">
{`  ___  ___  ___ _____ ___ ___    _   ___ _____ 
 | _ \\/ _ \\| _ \\_   _/ __| _ \\  /_\\ | __|_   _|
 |  _/ (_) |   / | || (__|   / / _ \\| _|  | |  
 |_|  \\___/|_|_\\ |_| \\___|_|_\\/_/ \\_\\_|   |_|  `}
            </pre>
            <div className="mt-2 text-neutral-300">
              SYSTEM HOST: <span className="text-white font-bold">{fullName}</span> [
              {personal.title || 'FULL STACK ARCHITECT'}]
            </div>
          </div>

          {/* Quick Clickable Command Pills */}
          <div className="border border-[#1B4324] bg-[#0C140F] p-3">
            <div className="text-[11px] text-neutral-400 mb-2 uppercase tracking-wider">
              QUICK COMMANDS:
            </div>
            <div className="flex flex-wrap gap-2">
              {['help', 'whoami', 'projects', 'skills', 'experience', 'contact', 'clear'].map(
                (btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCommand(btn)}
                    className="text-xs bg-[#142319] hover:bg-[#39FF14] hover:text-black border border-[#235830] text-[#39FF14] px-2.5 py-1 transition-colors"
                  >
                    ${btn}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Interactive Shell Output */}
          <div className="border border-[#1B4324] bg-[#050806] p-4 text-xs sm:text-sm space-y-1.5 max-h-80 overflow-y-auto">
            {history.map((line, idx) => (
              <div key={idx} className={line.startsWith('$') ? 'text-white font-bold' : 'text-[#39FF14]'}>
                {line}
              </div>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-[#10B981] font-bold">
              {personal.firstName?.toLowerCase() || 'user'}@portcraft:~$
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type a command (e.g. 'projects', 'skills', 'whoami')..."
              className="flex-1 bg-transparent border-b border-[#1B4324] text-white focus:outline-none focus:border-[#39FF14] py-1 px-2 font-mono text-xs sm:text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#142319] hover:bg-[#39FF14] hover:text-black text-[#39FF14] text-xs px-3 py-1.5 border border-[#235830] transition-colors"
            >
              RUN
            </button>
          </form>

          {/* ===================== STRUCTURED DATA BLOCKS ===================== */}
          {/* Projects View */}
          <div className="border-t border-[#1B4324] pt-6">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
              <Folder className="w-4 h-4 text-[#39FF14]" />
              <span>~/projects/ ({projects.length} repos)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="border border-[#1B4324] bg-[#0A120D] p-4">
                  <div className="flex items-center justify-between text-xs text-white font-bold">
                    <span>{p.title}</span>
                    {p.featured && (
                      <span className="text-[10px] bg-[#142319] text-[#39FF14] px-1.5 py-0.5 border border-[#235830]">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-400 font-sans leading-relaxed">
                    {p.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-[#39FF14]">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="bg-[#111C15] px-1.5 py-0.5">
                        [{tech}]
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#17331D] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 text-neutral-300"
                        >
                          <GithubIcon className="w-3.5 h-3.5" /> git
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 text-[#39FF14]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> open
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills View */}
          <div className="border-t border-[#1B4324] pt-6">
            <div className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#39FF14]" />
              <span>~/skills.manifest</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {skills.map((s) => (
                <div key={s.id} className="border border-[#1B4324] bg-[#0A120D] p-2.5">
                  <div className="text-white font-semibold">{s.name}</div>
                  <div className="text-[#39FF14] text-[10px] mt-1 font-mono">
                    [{'#'.repeat(s.level || 5)}{'-'.repeat(5 - (s.level || 5))}] {((s.level || 5) * 20)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== FOOTER STATUS BAR ===================== */}
        <div className="border-t border-[#1B4324] bg-[#111A14] px-4 py-2 text-[11px] text-neutral-400 flex flex-wrap justify-between items-center">
          <span>PORTCRAFT_OS v5.2 // ACTIVE SESSION</span>
          <span>MEMORY: 64MB / 512MB // 0 ERRORS</span>
        </div>
      </div>
    </div>
  );
}
