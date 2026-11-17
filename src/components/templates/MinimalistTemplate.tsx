'use client';

import { PortfolioData } from '@/lib/types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Code, Share2 } from 'lucide-react';

interface Props { data: PortfolioData; }

export default function MinimalistTemplate({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const radius = theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'sm' ? '4px' : theme.borderRadius === 'md' ? '8px' : theme.borderRadius === 'lg' ? '16px' : '999px';
  const fz = theme.fontSize === 'sm' ? '13px' : theme.fontSize === 'lg' ? '17px' : '15px';

  return (
    <div style={{ fontFamily: theme.fontFamily, background: theme.backgroundColor, color: theme.textColor, fontSize: fz, minHeight: '100vh' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: '280px', flexShrink: 0, background: theme.primaryColor, color: 'white', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {personal.avatar && (
            <img src={personal.avatar} alt={fullName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
          )}
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: theme.headingFont, lineHeight: 1.2, marginBottom: '0.4rem' }}>{fullName || 'Your Name'}</h1>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{personal.title}</p>
          </div>

          {/* Contact */}
          {(personal.email || personal.phone || personal.location) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, fontWeight: 700 }}>Contact</div>
              {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}><Mail size={13} />{personal.email}</div>}
              {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}><Phone size={13} />{personal.phone}</div>}
              {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}><MapPin size={13} />{personal.location}</div>}
              {personal.website && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}><Globe size={13} /><a href={personal.website} style={{ color: 'white' }}>{personal.website.replace(/https?:\/\//, '')}</a></div>}
              {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}><ExternalLink size={13} /><a href={personal.linkedin} style={{ color: 'white' }}>LinkedIn</a></div>}
              {personal.github && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}><Code size={13} /><a href={personal.github} style={{ color: 'white' }}>GitHub</a></div>}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, fontWeight: 700, marginBottom: '0.75rem' }}>Skills</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {skills.map((s) => (
                  <div key={s.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.9, marginBottom: '3px' }}>
                      <span>{s.name}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${(s.level / 5) * 100}%`, background: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '2.5rem 2rem', overflowY: 'auto' }}>
          {personal.bio && (
            <section style={{ marginBottom: '2rem' }}>
              <SectionTitle title="About" primary={theme.primaryColor} />
              <p style={{ lineHeight: 1.7, color: theme.textColor + 'CC' }}>{personal.bio}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <SectionTitle title="Experience" primary={theme.primaryColor} />
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.3rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', fontFamily: theme.headingFont }}>{exp.position}</div>
                      <div style={{ color: theme.primaryColor, fontWeight: 600, fontSize: '0.9rem' }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: theme.textColor + '80' }}>{exp.startDate}{exp.startDate && ' — '}{exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  {exp.description && <p style={{ marginTop: '0.5rem', fontSize: '0.88rem', lineHeight: 1.6, color: theme.textColor + 'CC' }}>{exp.description}</p>}
                  {exp.highlights.length > 0 && (
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                      {exp.highlights.map((h, i) => <li key={i} style={{ fontSize: '0.85rem', color: theme.textColor + 'BB', marginBottom: '0.2rem' }}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <SectionTitle title="Education" primary={theme.primaryColor} />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontFamily: theme.headingFont }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                      <div style={{ color: theme.primaryColor, fontWeight: 600, fontSize: '0.9rem' }}>{edu.institution}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: theme.textColor + '80' }}>{edu.startYear}{edu.startYear && ' — '}{edu.endYear}{edu.gpa && ` · GPA: ${edu.gpa}`}</div>
                  </div>
                  {edu.description && <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: theme.textColor + 'BB' }}>{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <SectionTitle title="Projects" primary={theme.primaryColor} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ border: `1px solid ${theme.primaryColor}30`, borderRadius: radius, overflow: 'hidden', background: theme.primaryColor + '08' }}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />}
                    <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontFamily: theme.headingFont, marginBottom: '0.3rem' }}>{p.title}</div>
                      <p style={{ fontSize: '0.82rem', color: theme.textColor + 'AA', marginBottom: '0.5rem', lineHeight: 1.5 }}>{p.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                        {p.techStack.map((t) => (
                          <span key={t} style={{ background: theme.primaryColor + '20', color: theme.primaryColor, fontSize: '0.7rem', padding: '1px 6px', borderRadius: '999px' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {p.liveUrl && <a href={p.liveUrl} style={{ color: theme.primaryColor, fontSize: '0.8rem', fontWeight: 600 }}>Live Demo →</a>}
                        {p.githubUrl && <a href={p.githubUrl} style={{ color: theme.textColor + '80', fontSize: '0.8rem' }}>GitHub</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {achievements.length > 0 && (
            <section>
              <SectionTitle title="Achievements" primary={theme.primaryColor} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {achievements.map((a) => (
                  <div key={a.id} style={{ border: `1px solid ${theme.primaryColor}30`, borderTop: `3px solid ${theme.accentColor}`, borderRadius: radius, padding: '0.75rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: theme.headingFont }}>{a.title}</div>
                    <div style={{ color: theme.primaryColor, fontSize: '0.8rem', marginTop: '2px' }}>{a.issuer}</div>
                    <div style={{ color: theme.textColor + '60', fontSize: '0.75rem', marginTop: '2px' }}>{a.date}</div>
                    {a.description && <p style={{ fontSize: '0.8rem', color: theme.textColor + 'AA', marginTop: '0.3rem' }}>{a.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function SectionTitle({ title, primary }: { title: string; primary: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h2>
      <div style={{ flex: 1, height: '2px', background: primary }} />
    </div>
  );
}
