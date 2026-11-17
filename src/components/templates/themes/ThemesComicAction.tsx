'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getTemplate } from '@/lib/templates';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, Star, Shield, Zap, Award } from 'lucide-react';

interface Props {
  data: PortfolioData;
}

// ==========================================
// THEME 01 — SPIDER-VERSE / WEB-SLINGER
// ==========================================
export function ThemeSpiderVerse({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const tpl = getTemplate('spider-verse');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'Hero Name';
  const red = theme.primaryColor || '#E32636';
  const blue = theme.secondaryColor || '#2563EB';
  const yellow = theme.accentColor || '#FBBF24';
  const bg = theme.backgroundColor || '#101014';
  const text = theme.textColor || '#F5F1E8';

  return (
    <div style={{ background: bg, color: text, fontFamily: theme.fontFamily, minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Spider-verse Hero Header with Halftone & Web lines */}
      <header
        style={{
          position: 'relative',
          padding: '4rem 2rem 3rem',
          background: `radial-gradient(circle at 80% 20%, ${red}33 0%, transparent 60%), linear-gradient(135deg, #101014 0%, #1A1A24 100%)`,
          borderBottom: `4px solid ${red}`,
        }}
      >
        {/* Halftone texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            backgroundImage: `radial-gradient(${text} 1px, transparent 1px)`,
            backgroundSize: '10px 10px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-block',
              background: yellow,
              color: '#000',
              fontWeight: 900,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              transform: 'skewX(-8deg)',
              marginBottom: '1rem',
              border: '2px solid #000',
            }}
          >
            DISPATCH 01 // WEB-SLINGER NETWORK
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {personal.avatar ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={personal.avatar}
                  alt={fullName}
                  style={{
                    width: '110px',
                    height: '110px',
                    objectFit: 'cover',
                    border: `4px solid ${yellow}`,
                    boxShadow: `6px 6px 0px ${blue}, 12px 12px 0px ${red}`,
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  background: `linear-gradient(135deg, ${red}, ${blue})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'white',
                  border: `3px solid ${yellow}`,
                  boxShadow: `6px 6px 0px ${blue}`,
                }}
              >
                {personal.firstName?.[0] || 'S'}
              </div>
            )}

            <div>
              <h1
                style={{
                  fontFamily: theme.headingFont,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 0.95,
                  textShadow: `3px 3px 0px ${red}, 6px 6px 0px ${blue}`,
                  marginBottom: '0.4rem',
                  letterSpacing: '0.02em',
                }}
              >
                {fullName}
              </h1>
              <div
                style={{
                  display: 'inline-block',
                  background: red,
                  color: '#fff',
                  padding: '4px 12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  transform: 'skewX(-6deg)',
                  boxShadow: `3px 3px 0px ${yellow}`,
                }}
              >
                {personal.title || 'Dimensional Protector & Developer'}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {personal.email && (
              <a href={`mailto:${personal.email}`} style={{ color: yellow, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <Mail size={14} /> {personal.email}
              </a>
            )}
            {personal.location && (
              <span style={{ color: text, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <MapPin size={14} /> {personal.location}
              </span>
            )}
            {personal.github && (
              <a href={personal.github} target="_blank" rel="noreferrer" style={{ color: yellow, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Code size={14} /> GitHub
              </a>
            )}
            {personal.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noreferrer" style={{ color: yellow, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <ExternalLink size={14} /> LinkedIn
              </a>
            )}
            {personal.website && (
              <a href={personal.website} target="_blank" rel="noreferrer" style={{ color: yellow, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Globe size={14} /> Website
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        {personal.bio && (
          <section style={{ marginBottom: '3rem' }}>
            <div
              style={{
                background: '#181822',
                border: `3px solid ${yellow}`,
                padding: '1.75rem',
                position: 'relative',
                boxShadow: `6px 6px 0px ${blue}`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '20px',
                  background: red,
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  padding: '2px 10px',
                  transform: 'skewX(-6deg)',
                }}
              >
                {terms.about}
              </div>
              <p style={{ lineHeight: 1.8, fontSize: '1.05rem', opacity: 0.9 }}>{personal.bio}</p>
            </div>
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Projects / Missions */}
          {projects.length > 0 && (
            <div style={{ gridColumn: 'span 2' }}>
              <SectionHeader title={terms.projects} color={red} accent={yellow} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {projects.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#181822',
                      border: `3px solid ${p.featured ? yellow : blue}`,
                      padding: '1.25rem',
                      boxShadow: p.featured ? `6px 6px 0px ${red}` : `4px 4px 0px rgba(0,0,0,0.5)`,
                      transition: 'transform 0.2s',
                    }}
                  >
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: yellow }}>{p.title}</h3>
                      {p.featured && <span style={{ background: yellow, color: '#000', fontSize: '0.65rem', fontWeight: 900, padding: '1px 6px' }}>FEATURED</span>}
                    </div>
                    <p style={{ fontSize: '0.88rem', opacity: 0.8, lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {p.techStack.map((tech) => (
                        <span key={tech} style={{ background: '#252538', color: '#93C5FD', fontSize: '0.7rem', padding: '2px 8px', fontWeight: 600 }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: yellow, fontWeight: 700, fontSize: '0.85rem' }}>
                          Launch Demo ↗
                        </a>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ color: text, opacity: 0.7, fontSize: '0.85rem' }}>
                          Source Code →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills / Abilities */}
          {skills.length > 0 && (
            <div>
              <SectionHeader title={terms.skills} color={blue} accent={yellow} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {skills.map((s) => (
                  <div key={s.id} style={{ background: '#181822', border: `2px solid ${blue}`, padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>{s.name}</span>
                      <span style={{ color: yellow }}>Lvl {s.level}/5</span>
                    </div>
                    <div style={{ height: '6px', background: '#2B2B3D' }}>
                      <div style={{ width: `${(s.level / 5) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${blue}, ${red})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience / Field History */}
          {experience.length > 0 && (
            <div>
              <SectionHeader title={terms.experience} color={yellow} accent={red} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ borderLeft: `4px solid ${red}`, paddingLeft: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: yellow }}>{exp.position}</div>
                    <div style={{ color: text, opacity: 0.9, fontSize: '0.9rem', fontWeight: 600 }}>
                      {exp.company} {exp.location ? `· ${exp.location}` : ''}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: text, opacity: 0.6, marginBottom: '0.4rem' }}>
                      {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
                    </div>
                    {exp.description && <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5 }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// THEME 02 — GOTHAM NOIR / DARK DETECTIVE
// ==========================================
export function ThemeGothamNoir({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const tpl = getTemplate('gotham-noir');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'OPERATIVE';
  const gold = theme.primaryColor || '#D6B45A';
  const slate = theme.backgroundColor || '#090B10';
  const text = theme.textColor || '#B9C0CA';

  return (
    <div style={{ background: slate, color: text, fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      {/* Dossier Banner */}
      <div style={{ background: '#0F1218', borderBottom: `2px solid ${gold}40`, padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        <span>ARCHIVE REF: // NOIR-CASE-{data.personal.firstName?.slice(0, 3).toUpperCase() || 'SYS'}</span>
        <span style={{ color: gold }}>CLASSIFIED PERSONNEL DOSSIER</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        <header style={{ borderBottom: `1px solid ${gold}33`, paddingBottom: '2.5rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              {personal.avatar ? (
                <img
                  src={personal.avatar}
                  alt={fullName}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', border: `1px solid ${gold}`, filter: 'grayscale(60%) contrast(120%)' }}
                />
              ) : (
                <div style={{ width: '90px', height: '90px', border: `1px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121620' }}>
                  <Shield size={36} color={gold} />
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F1F5F9', marginBottom: '0.2rem' }}>
                  {fullName}
                </h1>
                <div style={{ color: gold, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {personal.title || 'Lead Investigator & Security Analyst'}
                </div>
                {personal.location && <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>📍 {personal.location}</div>}
              </div>
            </div>

            <div style={{ background: '#121622', border: `1px solid ${gold}40`, padding: '1rem 1.5rem', fontSize: '0.8rem', minWidth: '220px' }}>
              <div style={{ color: gold, fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.08em' }}>COMMUNICATION LINE</div>
              {personal.email && <div>✉ {personal.email}</div>}
              {personal.phone && <div>📞 {personal.phone}</div>}
              {personal.website && <div>🌐 {personal.website}</div>}
            </div>
          </div>
        </header>

        {personal.bio && (
          <section style={{ marginBottom: '3rem', background: '#0E1119', borderLeft: `3px solid ${gold}`, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
              {terms.about}
            </div>
            <p style={{ lineHeight: 1.8, fontSize: '0.98rem' }}>{personal.bio}</p>
          </section>
        )}

        {/* Case Files (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <NoirSectionTitle title={terms.projects} gold={gold} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#10141D', border: '1px solid #1F2736', borderTop: `2px solid ${gold}`, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#F1F5F9' }}>{p.title}</div>
                    <span style={{ fontSize: '0.65rem', border: `1px solid ${gold}66`, color: gold, padding: '1px 6px' }}>CONFIDENTIAL</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.75, lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {p.techStack.map((tech) => (
                      <span key={tech} style={{ fontSize: '0.7rem', background: '#19202D', padding: '2px 7px', color: '#94A3B8' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: gold }}>Examine File ↗</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ color: text, opacity: 0.7 }}>Inspection Code →</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience & Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {experience.length > 0 && (
            <div>
              <NoirSectionTitle title={terms.experience} gold={gold} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ borderLeft: '2px solid #232C3D', paddingLeft: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#F1F5F9' }}>{exp.position}</div>
                    <div style={{ color: gold, fontSize: '0.88rem' }}>{exp.company}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem' }}>
                      {exp.startDate} - {exp.current ? 'CURRENT' : exp.endDate}
                    </div>
                    {exp.description && <p style={{ fontSize: '0.82rem', opacity: 0.8, lineHeight: 1.5 }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <NoirSectionTitle title={terms.skills} gold={gold} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {skills.map((s) => (
                  <div key={s.id} style={{ background: '#10141D', border: '1px solid #1E2535', padding: '0.6rem 0.8rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#E2E8F0' }}>{s.name}</div>
                    <div style={{ color: gold, fontSize: '0.7rem', marginTop: '2px' }}>Rating: {s.level}/5</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// THEME 11 — COMIC POP / GRAPHIC NOVEL
// ==========================================
export function ThemeComicPop({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const tpl = getTemplate('comic-pop');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'Comic Star';
  const red = theme.primaryColor || '#EF3E36';
  const blue = theme.secondaryColor || '#2467B2';
  const yellow = theme.accentColor || '#FFD447';

  return (
    <div style={{ background: '#FFF9E9', color: '#171717', fontFamily: '"Poppins", sans-serif', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', border: '4px solid #171717', background: '#FFFDF5', boxShadow: '10px 10px 0px #171717', padding: '2.5rem' }}>
        {/* Comic Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '4px solid #171717', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ background: red, color: '#fff', fontWeight: 900, padding: '3px 12px', fontSize: '0.8rem', border: '2px solid #000' }}>ISSUE #01 // COLLECTOR’S EDITION</span>
            <h1 style={{ fontFamily: '"Impact", sans-serif', fontSize: '3.5rem', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '0.5rem', lineHeight: 1 }}>
              {fullName}
            </h1>
            <div style={{ color: blue, fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase' }}>
              {personal.title || 'Creative Technologist & Builder'}
            </div>
          </div>
          {personal.avatar && (
            <img src={personal.avatar} alt={fullName} style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #171717', boxShadow: '5px 5px 0px #EF3E36' }} />
          )}
        </div>

        {/* Bio Speech Bubble */}
        {personal.bio && (
          <div style={{ background: yellow, border: '3px solid #171717', padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '6px 6px 0px #171717', position: 'relative' }}>
            <div style={{ fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem', color: red }}>{terms.about}:</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6 }}>"{personal.bio}"</p>
          </div>
        )}

        {/* Projects / Published Issues */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: '"Impact", sans-serif', fontSize: '2rem', textTransform: 'uppercase', borderBottom: '3px solid #171717', display: 'inline-block', marginBottom: '1.5rem' }}>
              💥 {terms.projects}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ border: '3px solid #171717', background: '#FFFFFF', padding: '1.25rem', boxShadow: '6px 6px 0px #2467B2' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', color: red, marginBottom: '0.3rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                    {p.techStack.map((tech) => (
                      <span key={tech} style={{ border: '2px solid #171717', background: yellow, fontWeight: 700, fontSize: '0.7rem', padding: '1px 6px' }}>{tech}</span>
                    ))}
                  </div>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900, color: blue, textDecoration: 'underline' }}>READ ISSUE ↗</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 style={{ fontFamily: '"Impact", sans-serif', fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
              ⚡ {terms.skills}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {skills.map((s) => (
                <div key={s.id} style={{ border: '3px solid #171717', background: red, color: '#fff', fontWeight: 900, padding: '0.4rem 1rem', boxShadow: '3px 3px 0px #171717', transform: 'rotate(-1deg)' }}>
                  {s.name} ★ {s.level * 20}%
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
// THEME 12 — ANIME DIMENSION
// ==========================================
export function ThemeAnimeDimension({ data }: Props) {
  const { personal, experience, skills, projects, theme } = data;
  const tpl = getTemplate('anime-dimension');
  const terms = tpl.terms;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'Hero Protagonist';
  const crimson = theme.primaryColor || '#D94A58';
  const lavender = theme.secondaryColor || '#A7A1E8';

  return (
    <div style={{ background: '#0F1221', color: '#E9ECF5', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      {/* Anime Cinematic Title Screen */}
      <div style={{ position: 'relative', padding: '4rem 2rem 3rem', background: `linear-gradient(180deg, #181C33 0%, #0F1221 100%)`, borderBottom: `2px solid ${crimson}` }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ color: lavender, fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 800 }}>SEASON 01 // ARCHIVE</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF', margin: '0.4rem 0' }}>
              {fullName}
            </h1>
            <div style={{ display: 'inline-block', background: crimson, color: '#FFFFFF', fontWeight: 700, padding: '4px 14px', borderRadius: '4px', fontSize: '0.95rem' }}>
              {personal.title || 'Digital Alchemist'}
            </div>
          </div>
          {personal.avatar && (
            <img src={personal.avatar} alt={fullName} style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '50%', border: `3px solid ${crimson}`, boxShadow: `0 0 30px ${crimson}66` }} />
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '3rem 2rem' }}>
        {personal.bio && (
          <div style={{ background: '#161B30', border: '1px solid #2B3355', borderLeft: `4px solid ${crimson}`, padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem' }}>
            <div style={{ color: crimson, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{terms.about}</div>
            <p style={{ lineHeight: 1.8, fontSize: '1rem', color: '#CBD5E1' }}>{personal.bio}</p>
          </div>
        )}

        {/* Key Episodes (Projects) */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '8px', height: '24px', background: crimson }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{terms.projects}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map((p, idx) => (
                <div key={p.id} style={{ background: '#161B30', border: '1px solid #283050', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '0.5rem 1rem', background: '#202640', fontSize: '0.75rem', color: lavender, fontWeight: 700 }}>
                    EPISODE {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '0.75rem' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {p.techStack.map((tech) => (
                        <span key={tech} style={{ fontSize: '0.7rem', background: '#2B3355', color: lavender, padding: '2px 8px', borderRadius: '4px' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ color: crimson, fontWeight: 700, fontSize: '0.85rem' }}>Watch Preview ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, color, accent }: { title: string; color: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: '12px', height: '12px', background: color, transform: 'rotate(45deg)', border: `2px solid ${accent}` }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h2>
      <div style={{ flex: 1, height: '3px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

function NoirSectionTitle({ title, gold }: { title: string; gold: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: `1px solid ${gold}33`, paddingBottom: '0.5rem' }}>
      <div style={{ width: '4px', height: '18px', background: gold }} />
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#F8FAFC' }}>{title}</h2>
    </div>
  );
}
