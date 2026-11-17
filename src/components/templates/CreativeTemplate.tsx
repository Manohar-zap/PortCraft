'use client';

import { PortfolioData } from '@/lib/types';
import { Mail, MapPin, Code, ExternalLink, Globe } from 'lucide-react';

interface Props { data: PortfolioData; }

export default function CreativeTemplate({ data }: Props) {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const p = theme.primaryColor;
  const s = theme.secondaryColor;
  const a = theme.accentColor;
  const bg = theme.backgroundColor;
  const text = theme.textColor;
  const fz = theme.fontSize === 'sm' ? '14px' : theme.fontSize === 'lg' ? '18px' : '16px';
  const r = theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'sm' ? '6px' : theme.borderRadius === 'md' ? '12px' : theme.borderRadius === 'lg' ? '24px' : '999px';

  return (
    <div style={{ fontFamily: theme.fontFamily, background: bg, color: text, fontSize: fz, minHeight: '100vh' }}>
      {/* Bold hero */}
      <header style={{ background: `linear-gradient(135deg, ${p}, ${s})`, color: 'white', padding: '4rem 3rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5rem', flexWrap: 'wrap', position: 'relative' }}>
          {personal.avatar ? (
            <img src={personal.avatar} alt={fullName} style={{ width: '120px', height: '120px', borderRadius: r, objectFit: 'cover', border: '4px solid rgba(255,255,255,0.4)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
          ) : (
            <div style={{ width: '120px', height: '120px', borderRadius: r, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              {personal.firstName?.[0] ?? '?'}
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: theme.headingFont, fontSize: '3.5rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '0.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              {personal.firstName || 'First'}<br /><span style={{ color: 'rgba(255,255,255,0.75)' }}>{personal.lastName || 'Last'}</span>
            </h1>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.95rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
              {personal.title || 'Your Title'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {personal.email && <ContactItem icon={<Mail size={14} />} label={personal.email} href={`mailto:${personal.email}`} />}
          {personal.location && <ContactItem icon={<MapPin size={14} />} label={personal.location} />}
          {personal.github && <ContactItem icon={<Code size={14} />} label="GitHub" href={personal.github} />}
          {personal.linkedin && <ContactItem icon={<ExternalLink size={14} />} label="LinkedIn" href={personal.linkedin} />}
          {personal.website && <ContactItem icon={<Globe size={14} />} label="Website" href={personal.website} />}
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        {personal.bio && (
          <div style={{ background: `linear-gradient(135deg, ${p}15, ${s}08)`, borderRadius: r, padding: '2rem', marginBottom: '3rem', borderLeft: `6px solid ${p}` }}>
            <p style={{ lineHeight: 1.8, fontSize: '1.05rem', color: text + 'DD' }}>{personal.bio}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          {/* Left column */}
          <div>
            {experience.length > 0 && (
              <CreativeSection title="Work Experience" color={p} accent={a} headingFont={theme.headingFont} r={r}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '2rem', position: 'relative', paddingLeft: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: 0, top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: `linear-gradient(135deg, ${p}, ${s})`, boxShadow: `0 0 10px ${p}60` }} />
                    <div style={{ position: 'absolute', left: '4px', top: '20px', bottom: '-8px', width: '2px', background: `${p}20` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', fontFamily: theme.headingFont }}>{exp.position}</div>
                        <div style={{ color: p, fontWeight: 600 }}>{exp.company}</div>
                      </div>
                      <span style={{ background: `${p}15`, color: p, fontSize: '0.75rem', padding: '2px 10px', borderRadius: '999px', fontWeight: 600, height: 'fit-content' }}>
                        {exp.startDate}{exp.startDate && ' — '}{exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && <p style={{ fontSize: '0.9rem', color: text + 'CC', lineHeight: 1.6, marginTop: '0.4rem' }}>{exp.description}</p>}
                    {exp.highlights.length > 0 && (
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '0' }}>
                        {exp.highlights.map((h, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.87rem', color: text + 'BB', marginBottom: '0.25rem', listStyle: 'none' }}>
                            <span style={{ color: a, marginTop: '3px' }}>◆</span>{h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CreativeSection>
            )}

            {projects.length > 0 && (
              <CreativeSection title="Projects" color={s} accent={a} headingFont={theme.headingFont} r={r}>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                  {projects.map((proj) => (
                    <div key={proj.id} style={{ border: `2px solid ${proj.featured ? p : p + '30'}`, borderRadius: r, overflow: 'hidden', background: proj.featured ? `${p}08` : 'transparent' }}>
                      {proj.imageUrl && <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
                      <div style={{ padding: '0.9rem' }}>
                        <div style={{ fontWeight: 800, fontFamily: theme.headingFont, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {proj.featured && <span style={{ color: '#fbbf24' }}>★</span>}{proj.title}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: text + 'AA', lineHeight: 1.5, marginBottom: '0.5rem' }}>{proj.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                          {proj.techStack.map((t) => <span key={t} style={{ background: `linear-gradient(135deg, ${p}20, ${s}20)`, color: p, fontSize: '0.68rem', padding: '2px 7px', borderRadius: '999px', fontWeight: 600 }}>{t}</span>)}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          {proj.liveUrl && <a href={proj.liveUrl} style={{ color: 'white', background: `linear-gradient(135deg, ${p}, ${s})`, fontSize: '0.78rem', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>Demo ↗</a>}
                          {proj.githubUrl && <a href={proj.githubUrl} style={{ color: p, fontSize: '0.78rem', fontWeight: 600 }}>Code →</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CreativeSection>
            )}
          </div>

          {/* Right column */}
          <div>
            {skills.length > 0 && (
              <CreativeSection title="Skills" color={a} accent={p} headingFont={theme.headingFont} r={r}>
                {skills.map((sk) => (
                  <div key={sk.id} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>{sk.name}</span>
                      <span style={{ color: p, fontSize: '0.75rem' }}>{sk.category}</span>
                    </div>
                    <div style={{ height: '6px', background: `${p}15`, borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(sk.level / 5) * 100}%`, background: `linear-gradient(90deg, ${p}, ${s})`, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </CreativeSection>
            )}

            {education.length > 0 && (
              <CreativeSection title="Education" color={p} accent={a} headingFont={theme.headingFont} r={r}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '1rem', background: `${p}08`, borderRadius: r, padding: '0.9rem', border: `1px solid ${p}20` }}>
                    <div style={{ fontWeight: 800, fontFamily: theme.headingFont, fontSize: '0.9rem' }}>{edu.institution}</div>
                    <div style={{ color: p, fontSize: '0.83rem', fontWeight: 600, marginTop: '2px' }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                    <div style={{ color: text + '60', fontSize: '0.75rem', marginTop: '2px' }}>{edu.startYear}{edu.startYear && ' – '}{edu.endYear}</div>
                  </div>
                ))}
              </CreativeSection>
            )}

            {achievements.length > 0 && (
              <CreativeSection title="Achievements" color={s} accent={p} headingFont={theme.headingFont} r={r}>
                {achievements.map((ac) => (
                  <div key={ac.id} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${p}, ${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>🏆</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', fontFamily: theme.headingFont }}>{ac.title}</div>
                      <div style={{ color: p, fontSize: '0.78rem' }}>{ac.issuer} · {ac.date}</div>
                    </div>
                  </div>
                ))}
              </CreativeSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const inner = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.83rem' }}>
      {icon}{label}
    </span>
  );
  return href ? <a href={href} style={{ textDecoration: 'none' }}>{inner}</a> : inner;
}

function CreativeSection({ title, color, accent, headingFont, r, children }: {
  title: string; color: string; accent: string; headingFont: string; r: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${accent})` }} />
        <h2 style={{ fontFamily: headingFont, fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
