'use client';

import { PortfolioData } from '@/lib/types';
import { Mail, Phone, MapPin, Globe, Code, ExternalLink, Terminal } from 'lucide-react';

interface Props { data: PortfolioData; }

export default function TechTemplate({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const bg = theme.darkMode ? theme.backgroundColor : '#0f172a';
  const text = theme.darkMode ? theme.textColor : '#e2e8f0';
  const primary = theme.primaryColor;
  const fz = theme.fontSize === 'sm' ? '13px' : theme.fontSize === 'lg' ? '17px' : '15px';

  return (
    <div style={{ fontFamily: theme.fontFamily, background: bg, color: text, fontSize: fz, minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '3rem 2rem 2rem', borderBottom: `1px solid ${primary}30`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 30% 50%, ${primary}15 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {personal.avatar && (
            <img src={personal.avatar} alt={fullName} style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover', border: `2px solid ${primary}`, boxShadow: `0 0 30px ${primary}40` }} />
          )}
          <div>
            <div style={{ color: primary, fontFamily: theme.headingFont, fontSize: '0.8rem', marginBottom: '0.3rem' }}>
              <span style={{ opacity: 0.6 }}>// </span>hello, world. I am
            </div>
            <h1 style={{ fontFamily: theme.headingFont, fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.4rem', textShadow: `0 0 40px ${primary}50` }}>
              {fullName || 'Your_Name'}
            </h1>
            <p style={{ color: primary, fontFamily: theme.headingFont, fontSize: '1rem' }}>
              <span style={{ opacity: 0.5 }}>{'> '}</span>{personal.title || 'Developer'}
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {personal.email && <a href={`mailto:${personal.email}`} style={{ color: text, opacity: 0.6, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={13} />{personal.email}</a>}
              {personal.location && <span style={{ color: text, opacity: 0.6, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} />{personal.location}</span>}
              {personal.github && <a href={personal.github} style={{ color: primary, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Code size={13} />GitHub</a>}
              {personal.linkedin && <a href={personal.linkedin} style={{ color: primary, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ExternalLink size={13} />LinkedIn</a>}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 'calc(100vh - 200px)', gap: 0 }}>
        {/* Main */}
        <main style={{ padding: '2rem', borderRight: `1px solid ${primary}20` }}>
          {personal.bio && (
            <TechSection title="about_me" primary={primary} headingFont={theme.headingFont}>
              <div style={{ background: `${primary}10`, border: `1px solid ${primary}20`, borderRadius: '8px', padding: '1rem', fontFamily: theme.headingFont, fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                <span style={{ color: primary, opacity: 0.5 }}>{'/**\n * '}</span>
                <span style={{ color: text, opacity: 0.8 }}>{personal.bio}</span>
                <span style={{ color: primary, opacity: 0.5 }}>{'\n */'}</span>
              </div>
            </TechSection>
          )}

          {experience.length > 0 && (
            <TechSection title="work_experience" primary={primary} headingFont={theme.headingFont}>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: `2px solid ${primary}40` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    <div style={{ fontFamily: theme.headingFont }}>
                      <span style={{ color: primary }}>function </span>
                      <span style={{ color: text, fontWeight: 700 }}>{exp.position?.replace(/ /g, '_') || 'position'}</span>
                      <span style={{ color: primary, opacity: 0.6 }}>() {'{'}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: text, opacity: 0.4, fontFamily: theme.headingFont }}>{exp.startDate} → {exp.current ? 'now' : exp.endDate}</span>
                  </div>
                  <div style={{ paddingLeft: '1rem', fontFamily: theme.headingFont }}>
                    <div style={{ color: primary, opacity: 0.7, fontSize: '0.83rem' }}>// @company: <span style={{ color: '#93c5fd' }}>{exp.company}</span></div>
                    {exp.description && <div style={{ marginTop: '0.4rem', fontSize: '0.84rem', color: text, opacity: 0.7, lineHeight: 1.6 }}>{exp.description}</div>}
                    {exp.highlights.length > 0 && (
                      <ul style={{ marginTop: '0.4rem', paddingLeft: '1rem', listStyle: 'none' }}>
                        {exp.highlights.map((h, j) => <li key={j} style={{ fontSize: '0.82rem', color: text, opacity: 0.65, marginBottom: '0.2rem' }}><span style={{ color: primary }}>→ </span>{h}</li>)}
                      </ul>
                    )}
                  </div>
                  <div style={{ fontFamily: theme.headingFont, color: primary, opacity: 0.6 }}>{'}'}</div>
                </div>
              ))}
            </TechSection>
          )}

          {projects.length > 0 && (
            <TechSection title="projects[]" primary={primary} headingFont={theme.headingFont}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ background: `${primary}08`, border: `1px solid ${primary}25`, borderRadius: '8px', overflow: 'hidden', transition: 'all 0.2s' }}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '110px', objectFit: 'cover', opacity: 0.8 }} />}
                    <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontFamily: theme.headingFont, fontWeight: 700, color: primary, marginBottom: '0.3rem' }}>{p.title}</div>
                      <p style={{ fontSize: '0.8rem', opacity: 0.65, lineHeight: 1.5, marginBottom: '0.5rem' }}>{p.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.4rem' }}>
                        {p.techStack.map((t) => <span key={t} style={{ background: `${primary}20`, color: primary, fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', fontFamily: theme.headingFont }}>{t}</span>)}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {p.liveUrl && <a href={p.liveUrl} style={{ color: primary, fontSize: '0.78rem', fontFamily: theme.headingFont }}>./demo ↗</a>}
                        {p.githubUrl && <a href={p.githubUrl} style={{ color: text, opacity: 0.5, fontSize: '0.78rem', fontFamily: theme.headingFont }}>./src ↗</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TechSection>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ padding: '2rem 1.5rem', background: `${primary}05` }}>
          {skills.length > 0 && (
            <TechSection title="skills.json" primary={primary} headingFont={theme.headingFont}>
              <div style={{ background: `${primary}08`, border: `1px solid ${primary}20`, borderRadius: '8px', padding: '0.75rem', fontFamily: theme.headingFont, fontSize: '0.78rem' }}>
                <div style={{ color: primary, opacity: 0.6 }}>{`{`}</div>
                {skills.map((s) => (
                  <div key={s.id} style={{ paddingLeft: '1rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#93c5fd' }}>"{s.name}"</span>
                    <span style={{ color: text, opacity: 0.4 }}>: </span>
                    <span style={{ color: '#fbbf24' }}>{s.level}/5</span>
                    <span style={{ color: text, opacity: 0.4 }}>,</span>
                  </div>
                ))}
                <div style={{ color: primary, opacity: 0.6 }}>{`}`}</div>
              </div>
            </TechSection>
          )}

          {education.length > 0 && (
            <TechSection title="education" primary={primary} headingFont={theme.headingFont}>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '1rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${primary}40` }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', fontFamily: theme.headingFont }}>{edu.institution}</div>
                  <div style={{ color: primary, fontSize: '0.8rem', opacity: 0.8 }}>{edu.degree}{edu.field && ` · ${edu.field}`}</div>
                  <div style={{ opacity: 0.4, fontSize: '0.75rem' }}>{edu.startYear}{edu.startYear && '—'}{edu.endYear}</div>
                </div>
              ))}
            </TechSection>
          )}

          {achievements.length > 0 && (
            <TechSection title="achievements" primary={primary} headingFont={theme.headingFont}>
              {achievements.map((a) => (
                <div key={a.id} style={{ marginBottom: '0.75rem', background: `${primary}10`, borderRadius: '6px', padding: '0.6rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.83rem', fontFamily: theme.headingFont }}>🏆 {a.title}</div>
                  <div style={{ color: primary, opacity: 0.7, fontSize: '0.75rem' }}>{a.issuer} · {a.date}</div>
                </div>
              ))}
            </TechSection>
          )}
        </aside>
      </div>
    </div>
  );
}

function TechSection({ title, primary, headingFont, children }: { title: string; primary: string; headingFont: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Terminal size={14} color={primary} />
        <span style={{ fontFamily: headingFont, color: primary, fontSize: '0.85rem', fontWeight: 700 }}>{title}</span>
        <div style={{ flex: 1, height: '1px', background: `${primary}30` }} />
      </div>
      {children}
    </div>
  );
}
