'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getTemplate } from '@/lib/templates';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, BookOpen, Layers, Sparkles, Award } from 'lucide-react';

interface Props {
  data: PortfolioData;
}

// ==========================================
// THEME 22 — DREAMSCAPE
// ==========================================
export function ThemeDreamscape({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('dreamscape');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'DREAM WEAVER';
  const purple = theme.primaryColor || '#7C3AED';
  const pink = theme.secondaryColor || '#EC4899';

  return (
    <div style={{ background: '#FAF5FF', color: '#3B0764', fontFamily: '"Poppins", sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)', borderRadius: '32px', border: '2px solid #E9D5FF', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(233, 213, 255, 0.4)' }}>
          <div style={{ color: purple, letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>ASTRAL CONSCIOUSNESS // DREAMS</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0.5rem 0' }}>
            {fullName}
          </h1>
          <div style={{ color: pink, fontSize: '1.2rem', fontWeight: 700 }}>{personal.title || 'Creative Visionary & Dreamer'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2rem', border: '1px solid #F3E8FF', textAlign: 'center', fontSize: '1.1rem', lineHeight: 1.8, color: '#581C87', marginBottom: '3rem' }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: purple, fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem' }}>
              ✨ {terms.projects} ✨
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#FFFFFF', border: '2px solid #F3E8FF', borderRadius: '24px', padding: '1.75rem', boxShadow: '0 10px 25px rgba(243, 232, 255, 0.6)' }}>
                  <h3 style={{ color: purple, fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#6B21A8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: pink, fontWeight: 700 }}>Enter Dream ↗</a>}
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
// THEME 23 — WASTELAND SURVIVOR
// ==========================================
export function ThemeWasteland({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('wasteland-survivor');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'WASTELAND_CHIEF';
  const rust = theme.primaryColor || '#A64B35';

  return (
    <div style={{ background: '#191C1E', color: '#E6DDC9', fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: '3px solid #3F4448', background: '#202427', padding: '2.5rem' }}>
        <header style={{ borderBottom: `3px solid ${rust}`, paddingBottom: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ color: rust, fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 900 }}>WASTELAND SURVIVAL LOG // SECTOR Z-9</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#F5EBE1', margin: '0.4rem 0' }}>{fullName}</h1>
          <div style={{ color: '#FBBF24', fontSize: '1.1rem', fontWeight: 700 }}>{personal.title || 'Scavenger & Heavy Systems Builder'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#17191B', borderLeft: `4px solid ${rust}`, padding: '1.25rem', marginBottom: '2.5rem' }}>
            <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: rust, fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              ⚠️ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: '2px solid #3A3F43', background: '#181B1D', padding: '1.25rem' }}>
                  <h3 style={{ color: '#F5EBE1', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#A0A7AE', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: rust, fontWeight: 800 }}>Examine Build ↗</a>}
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
// THEME 24 — CELESTIAL LIBRARY
// ==========================================
export function ThemeCelestialLibrary({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('celestial-library');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'COSMIC SCHOLAR';
  const starGold = theme.primaryColor || '#E7C978';

  return (
    <div style={{ background: '#0F122B', color: '#F5F0E6', fontFamily: '"Playfair Display", serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', borderBottom: `1px solid ${starGold}44`, paddingBottom: '3rem', marginBottom: '3rem' }}>
          <div style={{ color: starGold, fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>THE CELESTIAL REPOSITORY OF KNOWLEDGE</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, color: starGold, margin: '0.5rem 0' }}>{fullName}</h1>
          <div style={{ color: '#C4B5FD', fontSize: '1.15rem', fontStyle: 'italic' }}>{personal.title || 'Master Archivist & Scholar'}</div>
        </header>

        {personal.bio && (
          <div style={{ maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.9, color: '#E2D9C8' }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: starGold, fontSize: '1.35rem', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem' }}>
              📚 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#161A3C', border: `1px solid ${starGold}44`, padding: '1.5rem', borderRadius: '4px', borderLeft: `5px solid ${starGold}` }}>
                  <h3 style={{ color: starGold, fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: starGold, fontWeight: 700 }}>Inspect Volume ↗</a>}
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
// THEME 25 — MECHA WORKSHOP
// ==========================================
export function ThemeMechaWorkshop({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('mecha-workshop');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CHIEF MECHA ENGINEER';
  const orange = theme.primaryColor || '#F28C28';
  const blue = '#1E3A8A';

  return (
    <div style={{ background: '#1E242B', color: '#F1F2ED', fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: `2px solid ${orange}`, background: '#181E24', padding: '2.5rem' }}>
        <header style={{ borderBottom: `2px dashed ${orange}`, paddingBottom: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ color: orange, fontSize: '0.8rem', letterSpacing: '0.2em' }}>MECHA BLUEPRINT ASSEMBLY // DIVISION 04</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: '0.4rem 0' }}>{fullName}</h1>
          <div style={{ color: '#93C5FD', fontSize: '1rem' }}>{personal.title || 'Robotics Lead & Mecha Architect'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#10151A', borderLeft: `4px solid ${orange}`, padding: '1.25rem', marginBottom: '2.5rem' }}>
            <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: orange, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              ⚙️ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: `1px solid ${orange}44`, background: '#12171D', padding: '1.25rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: orange, fontWeight: 700 }}>Inspect Assembly ↗</a>}
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
// THEME 27 — QUANTUM LAB
// ==========================================
export function ThemeQuantumLab({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('quantum-lab');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'PRINCIPAL INVESTIGATOR';
  const cobalt = theme.primaryColor || '#356AE6';
  const mint = theme.secondaryColor || '#54C6A9';

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ padding: '3rem 2.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
          <div style={{ color: cobalt, fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase' }}>QUANTUM COMPUTATION RESEARCH FACILITY</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', margin: '0.4rem 0' }}>{fullName}</h1>
          <div style={{ color: cobalt, fontSize: '1.1rem', fontWeight: 600 }}>{personal.title || 'Chief Quantum Scientist & Systems Lead'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: `4px solid ${cobalt}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '3rem' }}>
            <p style={{ lineHeight: 1.8, fontSize: '1rem', color: '#334155' }}>{personal.bio}</p>
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: cobalt, fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              🔬 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ color: '#0F172A', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: cobalt, fontWeight: 700, fontSize: '0.85rem' }}>View Experiment Data ↗</a>}
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
// THEME 28 — CLOUD KINGDOM
// ==========================================
export function ThemeCloudKingdom({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('cloud-kingdom');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'SKY AERONAUT';
  const blue = theme.primaryColor || '#0284C7';

  return (
    <div style={{ background: '#F0F9FF', color: '#1E293B', fontFamily: '"Poppins", sans-serif', minHeight: '100vh', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 100%)', borderRadius: '32px', border: '1px solid #BAE6FD', marginBottom: '3rem' }}>
          <div style={{ color: blue, letterSpacing: '0.2em', fontSize: '0.85rem', fontWeight: 800 }}>SKYWARD EXPEDITIONS // CLOUD REALM</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0369A1', margin: '0.5rem 0' }}>{fullName}</h1>
          <div style={{ color: '#F59E0B', fontSize: '1.15rem', fontWeight: 700 }}>{personal.title || 'Aeronaut & Floating Realm Architect'}</div>
        </header>

        {personal.bio && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2rem', border: '1px solid #BAE6FD', textAlign: 'center', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '3rem' }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ color: blue, fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem' }}>
              ☁️ {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #BAE6FD', borderRadius: '24px', padding: '1.75rem', boxShadow: '0 10px 25px rgba(186, 230, 253, 0.4)' }}>
                  <h3 style={{ color: '#0369A1', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{p.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: blue, fontWeight: 700 }}>Visit Island ↗</a>}
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
// THEME 30 — INFINITE MUSEUM
// ==========================================
export function ThemeInfiniteMuseum({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('infinite-museum');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'CURATOR';

  return (
    <div style={{ background: '#F9F8F5', color: '#18181B', fontFamily: 'Inter, sans-serif', minHeight: '100vh', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', borderBottom: '1px solid #E4E4E7', paddingBottom: '3.5rem', marginBottom: '4rem' }}>
          <div style={{ color: '#71717A', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            EXHIBITION GALLERY 01 // CONTEMPORARY
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, letterSpacing: '0.04em', margin: '0.5rem 0' }}>
            {fullName}
          </h1>
          <div style={{ color: '#71717A', fontSize: '1rem', fontStyle: 'italic' }}>
            {personal.title || 'Multidisciplinary Creator & Architect'}
          </div>
        </header>

        {personal.bio && (
          <div style={{ maxWidth: '720px', margin: '0 auto 4rem', textAlign: 'center', fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontSize: '1.2rem', lineHeight: 1.9, color: '#3F3F46' }}>
            "{personal.bio}"
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#E4E4E7' }} />
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#18181B' }}>
                {terms.projects}
              </h2>
              <div style={{ flex: 1, height: '1px', background: '#E4E4E7' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ color: '#71717A', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>{p.description}</p>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#18181B', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #18181B' }}>View Exhibit ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
