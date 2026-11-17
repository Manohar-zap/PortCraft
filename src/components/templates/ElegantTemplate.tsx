'use client';

import { PortfolioData } from '@/lib/types';
import { Mail, Phone, MapPin, Globe, Code, ExternalLink } from 'lucide-react';

interface Props { data: PortfolioData; }

export default function ElegantTemplate({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const navy = theme.primaryColor;
  const gold = theme.accentColor;
  const bg = theme.backgroundColor;
  const text = theme.textColor;
  const fz = theme.fontSize === 'sm' ? '14px' : theme.fontSize === 'lg' ? '17px' : '15px';
  const r = theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'sm' ? '3px' : theme.borderRadius === 'md' ? '6px' : theme.borderRadius === 'lg' ? '12px' : '999px';

  return (
    <div style={{ fontFamily: theme.fontFamily, background: bg, color: text, fontSize: fz, minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: navy, color: 'white', textAlign: 'center', padding: '4rem 2rem 3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${gold}, ${gold}80, ${gold})` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: `${gold}40` }} />

        {personal.avatar && (
          <img src={personal.avatar} alt={fullName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}`, margin: '0 auto 1.5rem', display: 'block', boxShadow: `0 0 0 6px ${gold}20` }} />
        )}

        <h1 style={{ fontFamily: theme.headingFont, fontSize: '2.8rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          {fullName || 'Your Name'}
        </h1>
        <div style={{ color: gold, fontSize: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem', fontWeight: 400 }}>
          {personal.title || 'Professional Title'}
        </div>

        {/* Divider ornament */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ height: '1px', width: '60px', background: `${gold}60` }} />
          <div style={{ width: '8px', height: '8px', background: gold, transform: 'rotate(45deg)' }} />
          <div style={{ height: '1px', width: '60px', background: `${gold}60` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {personal.email && <a href={`mailto:${personal.email}`} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><Mail size={13} />{personal.email}</a>}
          {personal.phone && <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={13} />{personal.phone}</span>}
          {personal.location && <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} />{personal.location}</span>}
          {personal.website && <a href={personal.website} style={{ color: gold, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><Globe size={13} />Website</a>}
          {personal.linkedin && <a href={personal.linkedin} style={{ color: gold, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><ExternalLink size={13} />LinkedIn</a>}
          {personal.github && <a href={personal.github} style={{ color: gold, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}><Code size={13} />GitHub</a>}
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        {personal.bio && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ lineHeight: 1.9, color: text + 'CC', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem', fontStyle: 'italic' }}>
              "{personal.bio}"
            </p>
          </div>
        )}

        {experience.length > 0 && (
          <ElegantSection title="Professional Experience" navy={navy} gold={gold} headingFont={theme.headingFont} r={r}>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '2rem' }}>
                <div style={{ textAlign: 'right', paddingRight: '1.5rem', borderRight: `2px solid ${gold}40` }}>
                  <div style={{ fontSize: '0.78rem', color: text + '60', lineHeight: 1.5 }}>{exp.startDate}<br />{exp.current ? 'Present' : exp.endDate}</div>
                  {exp.location && <div style={{ fontSize: '0.75rem', color: text + '50', marginTop: '0.3rem' }}>{exp.location}</div>}
                </div>
                <div>
                  <div style={{ fontFamily: theme.headingFont, fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>{exp.position}</div>
                  <div style={{ color: navy, fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{exp.company}</div>
                  {exp.description && <p style={{ fontSize: '0.88rem', color: text + 'BB', lineHeight: 1.7 }}>{exp.description}</p>}
                  {exp.highlights.length > 0 && (
                    <ul style={{ marginTop: '0.5rem', listStyle: 'none', paddingLeft: 0 }}>
                      {exp.highlights.map((h, j) => (
                        <li key={j} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: text + 'AA', marginBottom: '0.25rem' }}>
                          <span style={{ color: gold, fontSize: '0.7rem', marginTop: '4px' }}>◆</span>{h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </ElegantSection>
        )}

        {education.length > 0 && (
          <ElegantSection title="Education" navy={navy} gold={gold} headingFont={theme.headingFont} r={r}>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '2rem' }}>
                <div style={{ textAlign: 'right', paddingRight: '1.5rem', borderRight: `2px solid ${gold}40`, fontSize: '0.78rem', color: text + '60' }}>
                  {edu.startYear}<br />{edu.endYear}{edu.gpa && <><br />GPA: {edu.gpa}</>}
                </div>
                <div>
                  <div style={{ fontFamily: theme.headingFont, fontWeight: 700 }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  <div style={{ color: navy, fontWeight: 600, fontSize: '0.9rem' }}>{edu.institution}</div>
                  {edu.description && <p style={{ fontSize: '0.85rem', color: text + 'AA', marginTop: '0.3rem' }}>{edu.description}</p>}
                </div>
              </div>
            ))}
          </ElegantSection>
        )}

        {skills.length > 0 && (
          <ElegantSection title="Areas of Expertise" navy={navy} gold={gold} headingFont={theme.headingFont} r={r}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {skills.map((sk) => (
                <div key={sk.id} style={{ background: `${navy}06`, border: `1px solid ${gold}30`, borderRadius: r, padding: '0.75rem 1rem' }}>
                  <div style={{ fontWeight: 700, fontFamily: theme.headingFont, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{sk.name}</div>
                  <div style={{ color: text + '50', fontSize: '0.72rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sk.category}</div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} style={{ flex: 1, height: '3px', borderRadius: '999px', background: n <= sk.level ? gold : `${gold}20` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ElegantSection>
        )}

        {projects.length > 0 && (
          <ElegantSection title="Notable Projects" navy={navy} gold={gold} headingFont={theme.headingFont} r={r}>
            {projects.map((p) => (
              <div key={p.id} style={{ marginBottom: '1.5rem', border: `1px solid ${gold}30`, borderLeft: `4px solid ${gold}`, borderRadius: `0 ${r} ${r} 0`, overflow: 'hidden', display: 'flex' }}>
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '130px', flexShrink: 0, objectFit: 'cover' }} />}
                <div style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontFamily: theme.headingFont, fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {p.featured && <span style={{ color: gold }}>★</span>}{p.title}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: text + 'AA', lineHeight: 1.6, marginBottom: '0.5rem' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                    {p.techStack.map((t) => <span key={t} style={{ border: `1px solid ${gold}40`, color: navy, fontSize: '0.7rem', padding: '1px 7px', borderRadius: r }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {p.liveUrl && <a href={p.liveUrl} style={{ color: navy, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View Live →</a>}
                    {p.githubUrl && <a href={p.githubUrl} style={{ color: text + '70', fontSize: '0.8rem', textDecoration: 'none' }}>View Code →</a>}
                  </div>
                </div>
              </div>
            ))}
          </ElegantSection>
        )}

        {achievements.length > 0 && (
          <ElegantSection title="Honours & Achievements" navy={navy} gold={gold} headingFont={theme.headingFont} r={r}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {achievements.map((a) => (
                <div key={a.id} style={{ textAlign: 'center', border: `1px solid ${gold}30`, borderRadius: r, padding: '1.25rem', background: `${gold}04` }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏅</div>
                  <div style={{ fontFamily: theme.headingFont, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{a.title}</div>
                  <div style={{ color: navy, fontWeight: 600, fontSize: '0.8rem' }}>{a.issuer}</div>
                  <div style={{ color: text + '50', fontSize: '0.75rem', marginTop: '0.2rem' }}>{a.date}</div>
                </div>
              ))}
            </div>
          </ElegantSection>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: navy, color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '2rem', borderTop: `4px solid ${gold}` }}>
        <div style={{ color: gold, fontFamily: theme.headingFont, fontSize: '1.2rem', marginBottom: '0.3rem' }}>{fullName}</div>
        <div style={{ fontSize: '0.8rem' }}>© 2026 · Portfolio built with PortCraft</div>
      </footer>
    </div>
  );
}

function ElegantSection({ title, navy, gold, headingFont, r, children }: {
  title: string; navy: string; gold: string; headingFont: string; r: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ height: '1px', width: '30px', background: gold }} />
        <h2 style={{ fontFamily: headingFont, fontSize: '1rem', fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>{title}</h2>
        <div style={{ flex: 1, height: '1px', background: `${gold}40` }} />
        <div style={{ width: '5px', height: '5px', background: gold, transform: 'rotate(45deg)', flexShrink: 0 }} />
      </div>
      {children}
    </div>
  );
}
