'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getTemplate } from '@/lib/templates';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, Terminal, Cpu, Shield, Zap } from 'lucide-react';

interface Props {
  data: PortfolioData;
}

// ==========================================
// THEME 03 — ARC REACTOR / HOLOGRAPHIC ENGINEER
// ==========================================
export function ThemeArcReactor({ data }: Props) {
  const { personal, experience, skills, projects, achievements, theme } = data;
  const tpl = getTemplate('arc-reactor');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'STARK ENGINEER';
  const cyan = theme.primaryColor || '#42D9F5';
  const bg = theme.backgroundColor || '#07131F';
  const text = theme.textColor || '#E0F2FE';

  return (
    <div style={{ background: bg, color: text, fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', border: `1px solid ${cyan}40`, boxShadow: `0 0 35px ${cyan}20`, background: '#091827', position: 'relative' }}>
        {/* Reactor Core Header */}
        <header style={{ padding: '3rem 2rem', borderBottom: `1px solid ${cyan}40`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Circular Arc Reactor Symbol */}
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `3px solid ${cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 25px ${cyan}`, position: 'relative' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: `2px dashed ${cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: cyan, boxShadow: `0 0 15px ${cyan}` }} />
                </div>
              </div>
              <div>
                <div style={{ color: cyan, fontSize: '0.8rem', letterSpacing: '0.2em' }}>// SYSTEM TELEMETRY V3.8</div>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', textShadow: `0 0 15px ${cyan}` }}>
                  {fullName}
                </h1>
                <div style={{ color: '#93C5FD', fontSize: '0.95rem' }}>{personal.title || 'Systems Architect & Core Engineer'}</div>
              </div>
            </div>
            {/* Live Metrics */}
            <div style={{ border: `1px solid ${cyan}50`, padding: '0.75rem 1.25rem', fontSize: '0.8rem', background: '#050D17' }}>
              <div style={{ color: cyan }}>OUTPUT: 100% NOMINAL</div>
              <div>STATUS: ONLINE</div>
              <div>LOC: {personal.location || 'GLOBAL_NODE'}</div>
            </div>
          </div>
        </header>

        <div style={{ padding: '2.5rem' }}>
          {personal.bio && (
            <div style={{ background: '#0B1F33', borderLeft: `4px solid ${cyan}`, padding: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ color: cyan, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem' }}>{terms.about}</div>
              <p style={{ lineHeight: 1.7, fontSize: '0.95rem', opacity: 0.9 }}>{personal.bio}</p>
            </div>
          )}

          {/* Builds / Projects */}
          {projects.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ color: cyan, fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>// {terms.projects}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ border: `1px solid ${cyan}40`, background: '#071624', padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.4rem' }}>{p.title}</div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      {p.techStack.map((tech) => (
                        <span key={tech} style={{ border: `1px solid ${cyan}60`, color: cyan, fontSize: '0.7rem', padding: '1px 6px' }}>{tech}</span>
                      ))}
                    </div>
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: cyan, fontSize: '0.8rem' }}>EXECUTE DEPLOYMENT ↗</a>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* System Modules (Skills) */}
          {skills.length > 0 && (
            <section>
              <div style={{ color: cyan, fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>// {terms.skills}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {skills.map((s) => (
                  <div key={s.id} style={{ border: `1px solid ${cyan}30`, background: '#05111D', padding: '0.6rem 0.8rem' }}>
                    <div style={{ color: '#fff', fontSize: '0.85rem' }}>{s.name}</div>
                    <div style={{ height: '4px', background: '#122B42', marginTop: '6px' }}>
                      <div style={{ width: `${(s.level / 5) * 100}%`, height: '100%', background: cyan }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// THEME 05 — NIGHT CITY / NEON FUTURE
// ==========================================
export function ThemeNightCity({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('night-city');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'NETRUNNER';
  const magenta = theme.secondaryColor || '#FF3CAC';
  const cyan = theme.primaryColor || '#00E5FF';
  const yellow = theme.accentColor || '#E9FF45';

  return (
    <div style={{ background: '#090A12', color: '#F1F5F9', fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Ticker Header */}
        <div style={{ background: yellow, color: '#000', fontWeight: 900, padding: '4px 12px', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>NIGHT CITY NETFEED // ACTIVE GIG CONTRACTOR</span>
          <span>STREET CRED: 50/50</span>
        </div>

        <header style={{ border: `2px solid ${cyan}`, padding: '2.5rem', marginBottom: '2.5rem', background: '#0E101E', boxShadow: `0 0 20px ${cyan}40` }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', textShadow: `3px 3px 0px ${magenta}, -3px -3px 0px ${cyan}` }}>
            {fullName}
          </h1>
          <div style={{ color: yellow, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem' }}>
            {personal.title || 'Cyberware Developer & Specialist'}
          </div>
          {personal.bio && <p style={{ marginTop: '1.25rem', color: '#CBD5E1', lineHeight: 1.7, fontSize: '0.95rem' }}>{personal.bio}</p>}
        </header>

        {/* Gigs & Contracts (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ color: magenta, fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              ⚡ {terms.projects}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid ${magenta}`, background: '#0F1224', padding: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: cyan, color: '#000', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px' }}>GIG READY</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {p.techStack.map((tech) => (
                      <span key={tech} style={{ color: yellow, border: '1px solid #334155', padding: '2px 6px', fontSize: '0.7rem' }}>{tech}</span>
                    ))}
                  </div>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: cyan, fontWeight: 700 }}>JACK IN ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cyberware Suite (Skills) */}
        {skills.length > 0 && (
          <section>
            <div style={{ color: cyan, fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem' }}>
              🧬 {terms.skills}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {skills.map((s) => (
                <div key={s.id} style={{ background: '#131730', border: `1px solid ${cyan}`, padding: '0.5rem 1rem', color: '#fff' }}>
                  <span style={{ color: magenta }}>▶ </span>{s.name} <span style={{ color: yellow }}>[{s.level}/5]</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ==========================================
// THEME 06 — DIGITAL GRID / LIGHT-CYCLE FUTURE
// ==========================================
export function ThemeDigitalGrid({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('digital-grid');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'GRID_PROGRAM';
  const blue = theme.primaryColor || '#1677FF';
  const cyan = theme.secondaryColor || '#51E5FF';

  return (
    <div style={{ background: '#05080D', color: '#F4FAFF', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', border: `2px solid ${blue}`, background: 'rgba(5, 8, 13, 0.95)', boxShadow: `0 0 30px ${blue}44` }}>
        <header style={{ padding: '3rem 2rem', borderBottom: `2px solid ${blue}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ color: cyan, fontSize: '0.8rem', letterSpacing: '0.2em' }}>GRID USER IDENTIFIER</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>{fullName}</h1>
            <div style={{ color: cyan, fontSize: '1rem' }}>{personal.title || 'Grid Developer'}</div>
          </div>
          {personal.avatar && (
            <img src={personal.avatar} alt={fullName} style={{ width: '100px', height: '100px', borderRadius: '4px', border: `2px solid ${cyan}`, boxShadow: `0 0 15px ${cyan}` }} />
          )}
        </header>

        <div style={{ padding: '2.5rem' }}>
          {personal.bio && (
            <div style={{ border: `1px solid ${blue}`, padding: '1.25rem', marginBottom: '2.5rem', background: '#09101C' }}>
              <div style={{ color: cyan, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>// {terms.about}</div>
              <p style={{ lineHeight: 1.7, color: '#CBD5E1' }}>{personal.bio}</p>
            </div>
          )}

          {projects.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: cyan, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                // {terms.projects}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ border: `1px solid ${blue}`, padding: '1.25rem', background: '#09101C' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.4rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: cyan, fontSize: '0.85rem' }}>Enter Construct ↗</a>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: cyan, textTransform: 'uppercase', marginBottom: '1rem' }}>
                // {terms.skills}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map((s) => (
                  <span key={s.id} style={{ border: `1px solid ${blue}`, background: '#09101C', padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: cyan }}>
                    {s.name} [R{s.level}]
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// THEME 07 — CODE REALITY / DIGITAL TERMINAL
// ==========================================
export function ThemeCodeReality({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('code-reality');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'root@localhost';
  const green = theme.primaryColor || '#42F57B';

  return (
    <div style={{ background: '#050706', color: '#D7E8DC', fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `1px solid #102218`, background: '#070C09', padding: '2rem' }}>
        {/* Terminal Header */}
        <div style={{ borderBottom: '1px solid #102218', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', color: '#4ADE80' }}>
          <div>root@devbox:~# ./init_profile.sh</div>
          <div>STATUS: RUNNING (PID 1337)</div>
        </div>

        <h1 style={{ color: green, fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {'> '} {fullName}
        </h1>
        <div style={{ color: '#86EFAC', marginBottom: '1.5rem' }}>// {personal.title || 'Systems Engineer & Architect'}</div>

        {personal.bio && (
          <div style={{ marginBottom: '2.5rem', background: '#09120C', borderLeft: `3px solid ${green}`, padding: '1rem' }}>
            <div style={{ color: green, fontWeight: 700, marginBottom: '0.4rem' }}>$ cat {terms.about}</div>
            <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{personal.bio}</p>
          </div>
        )}

        {/* Repositories (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ color: green, fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>$ ls -la ./{terms.projects}/</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid #153322`, background: '#09120C', padding: '1rem' }}>
                  <div style={{ color: green, fontWeight: 700 }}>{p.title}/</div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.75, margin: '0.5rem 0' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                    {p.techStack.map((tech) => (
                      <span key={tech} style={{ color: '#86EFAC', fontSize: '0.7rem' }}>#{tech}</span>
                    ))}
                  </div>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: green, fontSize: '0.8rem' }}>[ curl demo ]</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executable Commands (Skills) */}
        {skills.length > 0 && (
          <section>
            <div style={{ color: green, fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' }}>$ {terms.skills} --installed</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s) => (
                <span key={s.id} style={{ background: '#0E1E14', border: '1px solid #1E4028', color: '#86EFAC', padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                  {s.name} ({s.level}.0)
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ==========================================
// THEME 29 — SHADOW PROTOCOL
// ==========================================
export function ThemeShadowProtocol({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('shadow-protocol');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'AGENT_ZERO';
  const acid = theme.primaryColor || '#B5F23D';

  return (
    <div style={{ background: '#080B10', color: '#E8EDF2', fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `1px solid ${acid}33`, background: '#0B0F17', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: acid, fontSize: '0.75rem', borderBottom: `1px solid ${acid}33`, paddingBottom: '0.75rem', marginBottom: '2rem' }}>
          <span>SHADOW PROTOCOL // SECURITY NODE</span>
          <span>CLEARANCE: LEVEL 5</span>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.04em' }}>
          {fullName}
        </h1>
        <div style={{ color: acid, fontSize: '1rem', marginBottom: '1.5rem' }}>
          {personal.title || 'Cyber Threat Analyst & Architect'}
        </div>

        {personal.bio && (
          <div style={{ background: '#0F1522', borderLeft: `3px solid ${acid}`, padding: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ color: acid, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.3rem' }}>{terms.about}</div>
            <p style={{ lineHeight: 1.7, opacity: 0.85 }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ color: acid, fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem' }}>// {terms.projects}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid #1E293B`, background: '#0F1522', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', marginBottom: '0.4rem' }}>{p.title}</div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.75, lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: acid, fontSize: '0.8rem' }}>Audit Operation ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <div style={{ color: acid, fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem' }}>// {terms.skills}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s) => (
                <span key={s.id} style={{ border: `1px solid ${acid}55`, color: acid, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                  [+] {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
