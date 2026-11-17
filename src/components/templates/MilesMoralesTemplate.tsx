'use client';

import { PortfolioData } from '@/lib/types';
import { Mail, MapPin, Code, ExternalLink, Globe } from 'lucide-react';

interface Props { data: PortfolioData; }

export default function MilesMoralesTemplate({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const red = theme.primaryColor;
  const blue = theme.secondaryColor;
  const yellow = theme.accentColor;
  const fz = theme.fontSize === 'sm' ? '14px' : theme.fontSize === 'lg' ? '18px' : '16px';

  const halftone = `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`;

  return (
    <div style={{ fontFamily: theme.fontFamily, background: '#0a0a0a', color: 'white', fontSize: fz, minHeight: '100vh' }}>
      {/* Header — Spider-Verse style */}
      <header style={{
        background: `linear-gradient(135deg, ${red} 0%, #1a0a0a 50%, ${blue} 100%)`,
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '280px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Halftone dots */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: halftone, backgroundSize: '12px 12px', opacity: 0.4 }} />
        {/* Comic lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 42px)' }} />
        {/* Accent stripe */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px', background: `repeating-linear-gradient(90deg, ${yellow} 0px, ${yellow} 20px, ${red} 20px, ${red} 40px, ${blue} 40px, ${blue} 60px)` }} />

        <div style={{ position: 'relative', padding: '3rem 3rem 4rem', zIndex: 2 }}>
          <div style={{ display: 'inline-block', background: yellow, color: '#000', fontSize: '0.65rem', fontWeight: 900, padding: '3px 10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', transform: 'skewX(-5deg)', fontFamily: theme.headingFont }}>
            INTO THE PORTFOLIO-VERSE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {personal.avatar && (
              <div style={{ position: 'relative' }}>
                <img src={personal.avatar} alt={fullName} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0', border: `4px solid ${yellow}`, boxShadow: `8px 8px 0 ${blue}, 12px 12px 0 ${yellow}` }} />
              </div>
            )}
            <div>
              <h1 style={{ fontFamily: theme.headingFont, fontSize: '3.5rem', fontWeight: 900, lineHeight: 0.9, textTransform: 'uppercase', textShadow: `4px 4px 0 ${red}, 8px 8px 0 ${blue}`, marginBottom: '0.5rem' }}>
                {fullName || 'YOUR NAME'}
              </h1>
              <div style={{ background: red, color: 'white', display: 'inline-block', padding: '4px 14px', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', transform: 'skewX(-8deg)', fontFamily: theme.headingFont }}>
                {personal.title || 'DEVELOPER'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {personal.email && <a href={`mailto:${personal.email}`} style={{ color: yellow, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><Mail size={13} />{personal.email}</a>}
            {personal.location && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} />{personal.location}</span>}
            {personal.github && <a href={personal.github} style={{ color: yellow, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><Code size={13} />GitHub</a>}
            {personal.linkedin && <a href={personal.linkedin} style={{ color: yellow, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><ExternalLink size={13} />LinkedIn</a>}
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: '2.5rem 2.5rem' }}>
        {personal.bio && (
          <div style={{ background: `${blue}20`, border: `2px solid ${blue}`, padding: '1.5rem', marginBottom: '2.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '20px', background: yellow, color: '#000', fontSize: '0.7rem', fontWeight: 900, padding: '2px 10px', textTransform: 'uppercase', fontFamily: theme.headingFont }}>ABOUT ME</div>
            <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{personal.bio}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          <div>
            {experience.length > 0 && (
              <SpiderSection title="EXPERIENCE" color={red} yellow={yellow}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '1.75rem', borderLeft: `4px solid ${red}`, paddingLeft: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1rem', fontFamily: theme.headingFont, textTransform: 'uppercase' }}>{exp.position}</div>
                        <div style={{ color: red, fontWeight: 700, fontSize: '0.88rem' }}>{exp.company}</div>
                      </div>
                      <span style={{ background: `${red}30`, color: red, fontSize: '0.72rem', padding: '2px 8px', fontWeight: 700, fontFamily: theme.headingFont }}>{exp.startDate}{exp.startDate && ' → '}{exp.current ? 'NOW' : exp.endDate}</span>
                    </div>
                    {exp.description && <p style={{ marginTop: '0.4rem', fontSize: '0.87rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{exp.description}</p>}
                  </div>
                ))}
              </SpiderSection>
            )}

            {projects.length > 0 && (
              <SpiderSection title="PROJECTS" color={blue} yellow={yellow}>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                  {projects.map((p) => (
                    <div key={p.id} style={{ background: `${blue}15`, border: `2px solid ${p.featured ? yellow : blue + '50'}`, position: 'relative', overflow: 'hidden' }}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100px', objectFit: 'cover', opacity: 0.7 }} />}
                      {p.featured && <div style={{ position: 'absolute', top: '8px', right: '8px', background: yellow, color: '#000', fontSize: '0.65rem', padding: '1px 6px', fontWeight: 900, fontFamily: theme.headingFont }}>FEATURED</div>}
                      <div style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 900, fontFamily: theme.headingFont, textTransform: 'uppercase', marginBottom: '0.3rem', color: blue === '#3b82f6' ? '#93c5fd' : blue }}>{p.title}</div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: '0.4rem' }}>{p.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.4rem' }}>
                          {p.techStack.map((t) => <span key={t} style={{ background: 'rgba(255,255,255,0.08)', color: yellow, fontSize: '0.68rem', padding: '1px 6px', fontFamily: theme.headingFont }}>{t}</span>)}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          {p.liveUrl && <a href={p.liveUrl} style={{ color: yellow, fontSize: '0.78rem', fontWeight: 700, fontFamily: theme.headingFont }}>[ DEMO ]</a>}
                          {p.githubUrl && <a href={p.githubUrl} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>[ SRC ]</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SpiderSection>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <SpiderSection title="SKILLS" color={yellow} yellow={yellow}>
                {skills.map((sk) => (
                  <div key={sk.id} style={{ marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', fontFamily: theme.headingFont }}>
                      <span>{sk.name}</span>
                      <span style={{ color: yellow }}>{'▮'.repeat(sk.level)}{'▯'.repeat(5 - sk.level)}</span>
                    </div>
                  </div>
                ))}
              </SpiderSection>
            )}

            {education.length > 0 && (
              <SpiderSection title="EDUCATION" color={red} yellow={yellow}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '1rem', background: `${red}15`, border: `2px solid ${red}40`, padding: '0.75rem' }}>
                    <div style={{ fontWeight: 900, fontFamily: theme.headingFont, textTransform: 'uppercase', fontSize: '0.88rem' }}>{edu.institution}</div>
                    <div style={{ color: red, fontSize: '0.8rem', fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.73rem' }}>{edu.startYear}{edu.startYear && ' — '}{edu.endYear}</div>
                  </div>
                ))}
              </SpiderSection>
            )}

            {achievements.length > 0 && (
              <SpiderSection title="ACHIEVEMENTS" color={blue} yellow={yellow}>
                {achievements.map((ac) => (
                  <div key={ac.id} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ color: yellow, fontSize: '1.1rem', marginTop: '-2px' }}>★</span>
                    <div>
                      <div style={{ fontWeight: 900, fontFamily: theme.headingFont, fontSize: '0.85rem', textTransform: 'uppercase' }}>{ac.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{ac.issuer} · {ac.date}</div>
                    </div>
                  </div>
                ))}
              </SpiderSection>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: `linear-gradient(90deg, ${red}, ${blue})`, padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: theme.headingFont, fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>{fullName}</div>
        <div style={{ color: yellow, fontSize: '0.75rem', fontFamily: theme.headingFont }}>BUILT WITH PORTCRAFT</div>
      </footer>
    </div>
  );
}

function SpiderSection({ title, color, yellow, children }: { title: string; color: string; yellow: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ height: '3px', width: '20px', background: color }} />
        <h2 style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.12em', color: yellow, textTransform: 'uppercase' }}>{title}</h2>
        <div style={{ flex: 1, height: '1px', background: `${color}40` }} />
      </div>
      {children}
    </div>
  );
}
