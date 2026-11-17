'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getTemplate } from '@/lib/templates';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code } from 'lucide-react';

interface Props {
  data: PortfolioData;
}

// ==========================================
// THEME 09 — BRICKVERSE / BUILDABLE WORLD
// ==========================================
export function ThemeBrickverse({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('brickverse');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'MASTER BUILDER';
  const red = '#E53935';
  const yellow = '#FFD43B';
  const blue = '#2878D0';
  const green = '#45A65A';

  return (
    <div style={{ background: '#FFFDF5', color: '#242424', fontFamily: '"Poppins", sans-serif', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        {/* Stud Header */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          {[red, yellow, blue, green, red, yellow].map((col, i) => (
            <div key={i} style={{ flex: 1, height: '14px', background: col, borderRadius: '4px', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)' }} />
          ))}
        </div>

        <header style={{ background: '#FFFFFF', border: '3px solid #242424', borderRadius: '16px', padding: '2.5rem', boxShadow: '8px 8px 0px #242424', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', background: yellow, border: '2px solid #242424', fontWeight: 900, fontSize: '0.8rem', padding: '3px 12px', borderRadius: '6px', marginBottom: '1rem' }}>
            BRICK SET #2026 // LEVEL: MASTER
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', color: red, lineHeight: 1 }}>
            {fullName}
          </h1>
          <div style={{ color: blue, fontSize: '1.2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {personal.title || 'Master Builder & Designer'}
          </div>
        </header>

        {personal.bio && (
          <div style={{ background: '#F0F9FF', border: `3px solid ${blue}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: `6px 6px 0px ${blue}` }}>
            <div style={{ fontWeight: 800, color: blue, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{terms.about}</div>
            <p style={{ lineHeight: 1.7, fontSize: '1rem', fontWeight: 500 }}>{personal.bio}</p>
          </div>
        )}

        {/* Custom Builds (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', color: red, marginBottom: '1.5rem' }}>
              🧱 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p, idx) => {
                const accent = [blue, red, green, yellow][idx % 4];
                return (
                  <div key={p.id} style={{ background: '#FFFFFF', border: '3px solid #242424', borderRadius: '12px', padding: '1.5rem', boxShadow: `6px 6px 0px ${accent}` }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#242424', marginBottom: '0.4rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '1rem' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {p.techStack.map((tech) => (
                        <span key={tech} style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>{tech}</span>
                      ))}
                    </div>
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: blue, fontWeight: 800, fontSize: '0.88rem' }}>Inspect Build ↗</a>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Parts Shelf (Skills) */}
        {skills.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', color: blue, marginBottom: '1rem' }}>
              🛠️ {terms.skills}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {skills.map((s, idx) => {
                const brickBg = [red, blue, green, '#F59E0B'][idx % 4];
                return (
                  <div key={s.id} style={{ background: brickBg, color: '#fff', border: '2px solid #242424', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 800, fontSize: '0.85rem', boxShadow: '3px 3px 0px #242424' }}>
                    {s.name} ★ {s.level}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ==========================================
// THEME 10 — BLOCKLANDS / VOXEL ADVENTURE
// ==========================================
export function ThemeBlocklands({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('blocklands');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'STEVE_THE_DEV';
  const green = '#5D9E43';
  const stone = '#92999D';

  return (
    <div style={{ background: '#1E252B', color: '#F1F5F9', fontFamily: '"Courier New", monospace', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: '4px solid #3A4750', background: '#252F38', padding: '2.5rem', boxShadow: '10px 10px 0px #0F1418' }}>
        {/* Top Biome Bar */}
        <div style={{ background: green, color: '#FFFFFF', fontWeight: 900, padding: '4px 12px', fontSize: '0.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>BIOME: GRASSLANDS (LVL 99)</span>
          <span>HEARTS: ❤️❤️❤️❤️❤️</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', color: '#A3E635', letterSpacing: '-0.02em', margin: 0 }}>
          {fullName}
        </h1>
        <div style={{ color: '#93C5FD', fontSize: '1.1rem', marginTop: '0.4rem', marginBottom: '2rem' }}>
          {personal.title || 'Voxel World Builder & Architect'}
        </div>

        {personal.bio && (
          <div style={{ background: '#1A2128', border: '2px solid #4B5563', padding: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ color: green, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem' }}>[!] {terms.about}</div>
            <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{personal.bio}</p>
          </div>
        )}

        {/* Crafted Worlds (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#FCD34D', fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.25rem' }}>
              ⛏️ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: '2px solid #4B5563', background: '#1E252D', padding: '1.25rem' }}>
                  <h3 style={{ color: '#A3E635', fontSize: '1.15rem', fontWeight: 700 }}>{p.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#CBD5E1', margin: '0.5rem 0 1rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#38BDF8', fontWeight: 700 }}>[ JOIN WORLD ] ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hotbar (Skills) */}
        {skills.length > 0 && (
          <section>
            <h2 style={{ color: '#FCD34D', fontSize: '1.3rem', fontWeight: 900, marginBottom: '1rem' }}>
              🎒 {terms.skills}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s) => (
                <div key={s.id} style={{ border: '2px solid #52616B', background: '#1A2128', padding: '0.5rem 0.8rem', color: '#E2E8F0', fontSize: '0.85rem' }}>
                  {s.name} x{s.level * 16}
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
// THEME 13 — VICE CITY / RETRO ARCADE
// ==========================================
export function ThemeViceCity({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('vice-city');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'TOMMY_VERCETTI';
  const pink = '#F04CB5';
  const aqua = '#63D6D0';
  const coral = '#FF6B6B';

  return (
    <div style={{ background: '#120F24', color: '#FDF2F8', fontFamily: '"Poppins", sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        {/* Sunset Gradient Horizon */}
        <header style={{ textAlign: 'center', padding: '4rem 2rem', background: `linear-gradient(180deg, ${coral} 0%, ${pink} 50%, #120F24 100%)`, borderRadius: '16px', border: `2px solid ${pink}`, boxShadow: `0 0 40px ${pink}40`, marginBottom: '3rem' }}>
          <div style={{ color: aqua, letterSpacing: '0.3em', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ★ VICE CITY ARCADE // 1986 ★
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', textShadow: `4px 4px 0px ${pink}, 8px 8px 0px ${coral}` }}>
            {fullName}
          </h1>
          <div style={{ color: aqua, fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
            {personal.title || 'Synthwave Creator & High Roller'}
          </div>
        </header>

        {personal.bio && (
          <div style={{ background: '#1A1535', border: `1px solid ${pink}`, padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#E2E8F0' }}>"{personal.bio}"</p>
          </div>
        )}

        {/* High Score Runs (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: pink, fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              🕹️ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p, idx) => (
                <div key={p.id} style={{ background: '#1B1538', border: `1px solid ${aqua}`, padding: '1.5rem', borderRadius: '8px' }}>
                  <div style={{ color: coral, fontSize: '0.75rem', fontWeight: 900, marginBottom: '0.3rem' }}>RANK #0{idx + 1}</div>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: aqua, fontWeight: 800 }}>PLAY RUN ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
