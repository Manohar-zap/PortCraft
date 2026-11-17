'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getTemplate } from '@/lib/templates';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, Compass, Sparkles, Flame, Droplets } from 'lucide-react';

interface Props {
  data: PortfolioData;
}

// ==========================================
// THEME 04 — MYSTIC DIMENSION / PORTAL ARCHIVE
// ==========================================
export function ThemeMysticDimension({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('mystic-dimension');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'SORCERER SUPREME';
  const ember = theme.primaryColor || '#F28B42';
  const gold = theme.secondaryColor || '#D7B56D';

  return (
    <div style={{ background: '#171126', color: '#F1E7D4', fontFamily: '"Playfair Display", serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative' }}>
          <div style={{ color: ember, letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            ASTRAL SANCTUM ARCHIVE // REALM PORTAL
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: 700, color: '#FFF5E0', letterSpacing: '0.04em' }}>
            {fullName}
          </h1>
          <div style={{ color: gold, fontSize: '1.15rem', fontStyle: 'italic', marginTop: '0.4rem' }}>
            {personal.title || 'Master of Dimensions & Digital Arts'}
          </div>
        </header>

        {personal.bio && (
          <div style={{ maxWidth: '750px', margin: '0 auto 3rem', background: '#231A38', border: `1px solid ${gold}44`, padding: '1.75rem', borderRadius: '16px', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.8 }}>
            "{personal.bio}"
          </div>
        )}

        {/* Sacred Artifacts (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: ember, fontSize: '1.4rem', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem' }}>
              ✦ {terms.projects} ✦
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#211836', border: `1px solid ${ember}44`, borderRadius: '12px', padding: '1.5rem', boxShadow: `0 10px 25px rgba(0,0,0,0.5)` }}>
                  <h3 style={{ color: '#FFF5E0', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: ember, fontWeight: 700, fontSize: '0.85rem' }}>Open Dimension ↗</a>}
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
// THEME 16 — NEON NOMAD
// ==========================================
export function ThemeNeonNomad({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('neon-nomad');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'NEON NOMAD';
  const cyan = theme.primaryColor || '#2DE2E6';
  const ultraviolet = theme.secondaryColor || '#8A5CFF';

  return (
    <div style={{ background: '#0C0D13', color: '#F1F5F9', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ borderBottom: `2px solid ${cyan}`, paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <div style={{ color: ultraviolet, fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 800 }}>WAYFARER LOG // DISTRICT 09</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: '0.5rem 0' }}>{fullName}</h1>
          <div style={{ color: cyan, fontSize: '1.1rem', fontWeight: 700 }}>{personal.title || 'Megacity Explorer & Developer'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#131522', borderLeft: `4px solid ${cyan}`, padding: '1.5rem', marginBottom: '3rem' }}>
            <p style={{ lineHeight: 1.8, fontSize: '1rem', color: '#E2E8F0' }}>{personal.bio}</p>
          </div>
        )}

        {/* Districts (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: cyan, fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              📍 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#131522', border: `1px solid ${ultraviolet}55`, borderRadius: '8px', padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: cyan, fontWeight: 700 }}>Visit District ↗</a>}
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
// THEME 17 — ORBITAL ACADEMY
// ==========================================
export function ThemeOrbitalAcademy({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('orbital-academy');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CADET 42';
  const sky = theme.primaryColor || '#83CFFF';
  const orange = theme.secondaryColor || '#FF9D5C';

  return (
    <div style={{ background: '#0B132B', color: '#D9E4EF', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `1px solid ${sky}33`, background: '#101B3A', padding: '3rem 2.5rem', borderRadius: '16px' }}>
        <header style={{ borderBottom: `1px solid ${sky}44`, paddingBottom: '2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ color: orange, fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 700 }}>ORBITAL RESEARCH COLONY // STATION 7</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', margin: '0.3rem 0' }}>{fullName}</h1>
            <div style={{ color: sky, fontSize: '1rem' }}>{personal.title || 'Orbital Research Engineer'}</div>
          </div>
          <div style={{ background: '#182752', border: `1px solid ${sky}`, padding: '0.8rem 1.25rem', borderRadius: '8px', fontSize: '0.8rem' }}>
            <div style={{ color: sky }}>CADET ID: #ORB-883</div>
            <div>STATUS: ACTIVE MISSION</div>
          </div>
        </header>

        {personal.bio && (
          <div style={{ background: '#14224A', borderLeft: `3px solid ${sky}`, padding: '1.25rem', marginBottom: '2.5rem' }}>
            <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: sky, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              📡 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#14224A', border: `1px solid ${sky}33`, padding: '1.25rem', borderRadius: '8px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: sky, fontWeight: 700 }}>Telemetry Data ↗</a>}
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
// THEME 18 — FROSTBYTE
// ==========================================
export function ThemeFrostbyte({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('frostbyte');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'GLACIAL ARCHITECT';
  const blue = theme.primaryColor || '#0284C7';

  return (
    <div style={{ background: '#F0F9FF', color: '#0F172A', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid #BAE6FD', borderRadius: '24px', boxShadow: '0 20px 40px rgba(186, 230, 253, 0.4)', marginBottom: '3rem' }}>
          <div style={{ color: blue, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>CRYSTALLINE DATA NETWORK</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: '#0369A1', margin: '0.5rem 0' }}>{fullName}</h1>
          <div style={{ color: '#0284C7', fontSize: '1.1rem', fontWeight: 600 }}>{personal.title || 'Data Systems Architect'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E0F2FE', borderRadius: '16px', padding: '1.75rem', marginBottom: '3rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center', fontSize: '1.05rem', lineHeight: 1.8, color: '#334155' }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: blue, fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              ❄️ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #BAE6FD', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(224, 242, 254, 0.5)' }}>
                  <h3 style={{ color: '#0369A1', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: blue, fontWeight: 700, fontSize: '0.85rem' }}>Examine Crystal ↗</a>}
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
// THEME 19 — SOLAR FORGE
// ==========================================
export function ThemeSolarForge({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('solar-forge');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'SOLAR SMITH';
  const gold = theme.secondaryColor || '#F6B93B';
  const ember = theme.primaryColor || '#E76F3C';

  return (
    <div style={{ background: '#1E140F', color: '#FFF2D8', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ borderBottom: `2px solid ${ember}`, paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <div style={{ color: gold, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>THE SOLAR FOUNDRY // EST. 2026</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: gold, textTransform: 'uppercase', margin: '0.5rem 0' }}>{fullName}</h1>
          <div style={{ color: ember, fontSize: '1.15rem', fontWeight: 700 }}>{personal.title || 'Master Artisan & Creator'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#2B1C15', borderLeft: `4px solid ${gold}`, padding: '1.5rem', marginBottom: '3rem' }}>
            <p style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#FFE6BA' }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: gold, fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              🔥 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#2B1C15', border: `1px solid ${ember}55`, padding: '1.5rem' }}>
                  <h3 style={{ color: gold, fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#D4C3A3', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: ember, fontWeight: 700 }}>View Creation ↗</a>}
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
// THEME 20 — DEEP SEA EXPLORER
// ==========================================
export function ThemeDeepSea({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('deep-sea-explorer');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'ABYSS DIVER';
  const aqua = theme.primaryColor || '#53D6C2';

  return (
    <div style={{ background: '#04131E', color: '#E0F2FE', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `1px solid ${aqua}44`, background: '#071B2B', padding: '3rem 2rem', borderRadius: '16px' }}>
        <header style={{ borderBottom: `1px solid ${aqua}33`, paddingBottom: '2.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ color: aqua, fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>BENTHIC TRENCH EXPEDITION // DEPTH: -8,500M</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: '0.4rem 0' }}>{fullName}</h1>
            <div style={{ color: aqua, fontSize: '1rem' }}>{personal.title || 'Oceanographer & Deep-Sea Engineer'}</div>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${aqua}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${aqua}66` }}>
            <Droplets size={28} color={aqua} />
          </div>
        </header>

        {personal.bio && (
          <div style={{ background: '#092338', borderLeft: `3px solid ${aqua}`, padding: '1.5rem', marginBottom: '3rem' }}>
            <p style={{ lineHeight: 1.8, color: '#BAE6FD' }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: aqua, fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              🌊 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#092338', border: `1px solid ${aqua}33`, borderRadius: '8px', padding: '1.25rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#93C5FD', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: aqua, fontWeight: 700 }}>Inspect Specimen ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
