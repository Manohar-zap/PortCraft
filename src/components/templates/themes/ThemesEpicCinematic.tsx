'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getTemplate } from '@/lib/templates';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, Compass, Award, BookOpen, Clock } from 'lucide-react';

interface Props {
  data: PortfolioData;
}

// ==========================================
// THEME 08 — DESERT DYNASTY / EPIC SCI-FI
// ==========================================
export function ThemeDesertDynasty({ data }: Props) {
  const { personal, experience, skills, projects, achievements, theme } = data;
  const tpl = getTemplate('desert-dynasty');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'WARRIOR OF ARRAKIS';
  const sand = theme.secondaryColor || '#D8B98A';
  const bronze = theme.primaryColor || '#9B6A3C';

  return (
    <div style={{ background: '#1E1713', color: '#F0E4CF', fontFamily: '"Cinzel", serif, Georgia', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', borderBottom: `1px solid ${sand}44`, paddingBottom: '3rem', marginBottom: '3rem' }}>
          <div style={{ color: sand, letterSpacing: '0.3em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            THE SANDS OF DESTINY // CHRONICLES
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sand, marginBottom: '0.75rem' }}>
            {fullName}
          </h1>
          <div style={{ color: '#D4B996', fontSize: '1.1rem', letterSpacing: '0.15em', fontStyle: 'italic' }}>
            {personal.title || 'Wayfinder & Desert Architect'}
          </div>
        </header>

        {personal.bio && (
          <div style={{ maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center', fontStyle: 'italic', fontSize: '1.15rem', lineHeight: 1.9, color: '#E2D3B8' }}>
            "{personal.bio}"
          </div>
        )}

        {/* Expeditions (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, height: '1px', background: `${sand}44` }} />
              <h2 style={{ color: sand, fontSize: '1.3rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                {terms.projects}
              </h2>
              <div style={{ flex: 1, height: '1px', background: `${sand}44` }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid ${bronze}`, background: '#251D18', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                  <h3 style={{ color: sand, fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#D1C2A5', lineHeight: 1.7, marginBottom: '1rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {p.techStack.map((tech) => (
                      <span key={tech} style={{ border: `1px solid ${sand}55`, color: sand, fontSize: '0.7rem', padding: '2px 8px' }}>{tech}</span>
                    ))}
                  </div>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: sand, fontWeight: 700, fontSize: '0.85rem' }}>View Expedition ↗</a>}
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
// THEME 14 — ASSASSIN / HISTORICAL SHADOW
// ==========================================
export function ThemeAssassin({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('assassin');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'BROTHERHOOD MASTER';
  const oxblood = theme.primaryColor || '#772D32';
  const brass = theme.secondaryColor || '#A88A54';

  return (
    <div style={{ background: '#1C1A17', color: '#E9DFC9', fontFamily: '"Cinzel", Georgia, serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `1px solid ${brass}44`, background: '#201E1A', padding: '3rem 2.5rem' }}>
        <header style={{ borderBottom: `2px solid ${oxblood}`, paddingBottom: '2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ color: brass, fontSize: '0.8rem', letterSpacing: '0.2em' }}>ANIMUS MEMORY CORRIDOR // SYNC 100%</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, textTransform: 'uppercase', color: '#F2EBD9', margin: '0.3rem 0' }}>{fullName}</h1>
            <div style={{ color: oxblood, fontSize: '1.1rem', fontWeight: 600 }}>{personal.title || 'Master of the Creed'}</div>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${brass}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={32} color={brass} />
          </div>
        </header>

        {personal.bio && (
          <div style={{ background: '#26231E', borderLeft: `4px solid ${oxblood}`, padding: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ color: brass, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{terms.about}</div>
            <p style={{ lineHeight: 1.8, fontSize: '1rem', color: '#D9CFA6' }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: brass, fontSize: '1.3rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              ◆ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid ${brass}33`, background: '#24211C', padding: '1.25rem' }}>
                  <h3 style={{ color: '#F2EBD9', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#BDB394', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: brass, fontSize: '0.85rem' }}>Inspect Target ↗</a>}
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
// THEME 15 — GALACTIC FRONTIER / SPACE OPERA
// ==========================================
export function ThemeGalacticFrontier({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('galactic-frontier');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'COMMANDER';
  const ion = theme.primaryColor || '#6CA8FF';
  const amber = theme.secondaryColor || '#F6C56A';

  return (
    <div style={{ background: '#070B18', color: '#F4F5FA', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ borderBottom: `1px solid ${ion}44`, paddingBottom: '2.5rem', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>SECTOR 04 // DEEP EXPLORATION</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.04em', margin: '0.4rem 0' }}>
            {fullName}
          </h1>
          <div style={{ color: ion, fontSize: '1.1rem' }}>{personal.title || 'Starship Navigator & Systems Lead'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#0D142B', border: `1px solid ${ion}33`, padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
            <div style={{ color: amber, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{terms.about}</div>
            <p style={{ lineHeight: 1.8, fontSize: '1rem', color: '#CBD5E1' }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: ion, fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              ✦ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#0D142B', border: `1px solid ${ion}44`, padding: '1.5rem', borderRadius: '8px' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: ion, fontSize: '0.85rem', fontWeight: 600 }}>Execute Mission ↗</a>}
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
// THEME 21 — TIMEKEEPER
// ==========================================
export function ThemeTimekeeper({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('timekeeper');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CHRONO MASTER';
  const brass = theme.primaryColor || '#C7A66A';

  return (
    <div style={{ background: '#121524', color: '#E9DFC9', fontFamily: 'Georgia, serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `2px solid ${brass}44`, padding: '3rem 2rem', background: '#161A2C' }}>
        <header style={{ textAlign: 'center', borderBottom: `1px solid ${brass}44`, paddingBottom: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: brass, fontSize: '0.8rem', letterSpacing: '0.2em' }}>
            <Clock size={16} /> TEMPORAL CHRONOMETER
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, textTransform: 'uppercase', color: '#FFF5E0', margin: '0.5rem 0' }}>{fullName}</h1>
          <div style={{ color: brass, fontSize: '1rem', fontStyle: 'italic' }}>{personal.title || 'Architect of Timelines'}</div>
        </header>

        {personal.bio && (
          <div style={{ fontStyle: 'italic', textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem', lineHeight: 1.9, fontSize: '1.1rem' }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: brass, fontSize: '1.25rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              ⌛ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid ${brass}44`, background: '#191E33', padding: '1.25rem' }}>
                  <h3 style={{ color: '#FFF5E0', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#C8C0A9', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: brass, fontWeight: 700 }}>Open Capsule ↗</a>}
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
// THEME 26 — KINGDOM OF INK
// ==========================================
export function ThemeKingdomOfInk({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('kingdom-of-ink');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'ROYAL SCRIBE';
  const gold = theme.secondaryColor || '#B69A62';
  const wine = theme.primaryColor || '#743B43';

  return (
    <div style={{ background: '#F8F4EA', color: '#29251F', fontFamily: '"Cinzel", Georgia, serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', border: `3px double ${gold}`, padding: '3rem 2.5rem', background: '#FDFBF7', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <header style={{ textAlign: 'center', borderBottom: `2px solid ${wine}33`, paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <div style={{ color: wine, fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700 }}>
            IMPERIAL SCROLL ARCHIVE
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 700, color: '#1A1815', margin: '0.5rem 0', letterSpacing: '0.04em' }}>
            {fullName}
          </h1>
          <div style={{ color: gold, fontSize: '1.1rem', fontWeight: 600 }}>{personal.title || 'Grand Scribe & Chronicler'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#FAF6EE', border: `1px solid ${gold}44`, padding: '1.75rem', marginBottom: '3rem', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.9 }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: wine, fontSize: '1.3rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              📜 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid ${gold}66`, background: '#FFFFFF', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ color: wine, fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#4A443B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: gold, fontWeight: 700, fontSize: '0.85rem' }}>Unroll Manuscript ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
