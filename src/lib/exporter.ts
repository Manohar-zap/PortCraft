import JSZip from 'jszip';
import { PortfolioData } from './types';
import { getTemplate } from './templates';

export async function exportPortfolio(data: PortfolioData): Promise<void> {
  const zip = new JSZip();

  const html = generateHTML(data);
  const css = generateCSS(data);
  const js = generateJS(data);

  zip.file('index.html', html);
  zip.file('style.css', css);
  zip.file('script.js', js);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personal.firstName || 'portfolio'}-portfolio.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateCSS(data: PortfolioData): string {
  const { theme } = data;
  return `
/* PortCraft Generated Portfolio CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;600;700;900&family=Playfair+Display:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --primary: ${theme.primaryColor};
  --secondary: ${theme.secondaryColor};
  --accent: ${theme.accentColor};
  --bg: ${theme.backgroundColor};
  --text: ${theme.textColor};
  --font: ${theme.fontFamily};
  --heading-font: ${theme.headingFont};
  --radius: ${theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'sm' ? '4px' : theme.borderRadius === 'md' ? '8px' : theme.borderRadius === 'lg' ? '16px' : '9999px'};
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  font-size: ${theme.fontSize === 'sm' ? '14px' : theme.fontSize === 'lg' ? '18px' : '16px'};
}

h1, h2, h3, h4 { font-family: var(--heading-font); }

a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }

.container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }

/* Header */
header {
  background: var(--primary);
  color: white;
  padding: 3rem 0;
  text-align: center;
}
header h1 { font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem; }
header p.title { font-size: 1.3rem; opacity: 0.9; margin-bottom: 1rem; }
header .contact-links { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
header .contact-links a { color: white; opacity: 0.85; }
header .contact-links a:hover { opacity: 1; text-decoration: none; }
header .avatar {
  width: 120px; height: 120px; border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.4);
  margin: 0 auto 1.5rem;
  object-fit: cover;
  display: block;
}

/* Nav */
nav {
  background: rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}
nav ul { display: flex; gap: 2rem; justify-content: center; list-style: none; flex-wrap: wrap; }
nav a { color: white; font-weight: 500; padding: 0.3rem 0.8rem; border-radius: var(--radius); transition: background 0.2s; }
nav a:hover { background: rgba(255,255,255,0.15); text-decoration: none; }

/* Sections */
section { padding: 4rem 0; }
section:nth-child(even) { background: rgba(0,0,0,0.03); }
.section-title {
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--accent);
  display: inline-block;
}

/* Bio */
.bio { font-size: 1.1rem; max-width: 700px; }

/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.skill-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius);
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.skill-name { font-weight: 600; margin-bottom: 0.5rem; }
.skill-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.skill-fill { height: 100%; background: var(--primary); border-radius: 3px; }
.skill-category { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }

/* Experience / Education */
.timeline { position: relative; }
.timeline-item {
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius);
  border-left: 4px solid var(--primary);
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.timeline-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
.timeline-title { font-size: 1.1rem; font-weight: 700; }
.timeline-subtitle { color: var(--primary); font-weight: 500; }
.timeline-date { font-size: 0.85rem; color: #6b7280; }
.timeline-desc { margin-top: 0.5rem; color: #374151; }
.highlights { margin-top: 0.75rem; padding-left: 1.25rem; }
.highlights li { margin-bottom: 0.25rem; color: #374151; }

/* Projects */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.project-card {
  background: white;
  border-radius: var(--radius);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}
.project-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.project-img { width: 100%; height: 160px; object-fit: cover; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; }
.project-body { padding: 1.25rem; }
.project-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
.project-desc { font-size: 0.9rem; color: #4b5563; margin-bottom: 1rem; }
.tech-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.tech-tag { background: #f3f4f6; color: #374151; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 999px; }
.project-links { display: flex; gap: 0.75rem; }
.project-links a { font-size: 0.85rem; color: var(--primary); font-weight: 500; }

/* Coding Stats */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
.stat-card { background: white; border-radius: var(--radius); border: 1px solid #e5e7eb; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.stat-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
.stat-value { font-size: 2rem; font-weight: 900; color: var(--primary); }
.stat-sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 0.75rem; }
.stat-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.stat-chip { font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: #f3f4f6; color: #374151; }

/* Achievements */
.achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
.achievement-card {
  background: white;
  border-radius: var(--radius);
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-top: 4px solid var(--accent);
}
.achievement-title { font-weight: 700; margin-bottom: 0.25rem; }
.achievement-issuer { color: var(--primary); font-size: 0.9rem; }
.achievement-date { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }
.achievement-desc { font-size: 0.9rem; margin-top: 0.5rem; color: #4b5563; }

/* Footer */
footer {
  background: var(--primary);
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 3rem;
}
footer p { opacity: 0.8; }

/* Responsive */
@media (max-width: 768px) {
  header h1 { font-size: 2rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .skills-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .timeline-header { flex-direction: column; }
}
`;
}

function generateJS(_data: PortfolioData): string {
  return `
// PortCraft Portfolio — Interactive JS
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.background = link.getAttribute('href') === '#' + current
        ? 'rgba(255,255,255,0.2)' : '';
    });
  });

  // Animate elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.timeline-item, .project-card, .skill-card, .achievement-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateHTML(data: PortfolioData): string {
  const { personal, education, experience, skills, projects, achievements, theme } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'Portfolio';

  const skillCategories = [...new Set(skills.map((s) => s.category))];

  const skillsHTML = skillCategories.map((cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    return `
      <h3 style="margin-bottom:1rem;color:#6b7280;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(cat)}</h3>
      <div class="skills-grid">
        ${catSkills.map((s) => `
          <div class="skill-card">
            <div class="skill-name">${escapeHtml(s.name)}</div>
            <div class="skill-bar"><div class="skill-fill" style="width:${(s.level / 5) * 100}%"></div></div>
            <div class="skill-category">${'★'.repeat(s.level)}${'☆'.repeat(5 - s.level)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('<br>');

  const experienceHTML = experience.map((exp) => `
    <div class="timeline-item">
      <div class="timeline-header">
        <div>
          <div class="timeline-title">${escapeHtml(exp.position)}</div>
          <div class="timeline-subtitle">${escapeHtml(exp.company)}${exp.location ? ` · ${escapeHtml(exp.location)}` : ''}</div>
        </div>
        <div class="timeline-date">${escapeHtml(exp.startDate)} — ${exp.current ? 'Present' : escapeHtml(exp.endDate)}</div>
      </div>
      ${exp.description ? `<div class="timeline-desc">${escapeHtml(exp.description)}</div>` : ''}
      ${exp.highlights.length > 0 ? `<ul class="highlights">${exp.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const educationHTML = education.map((edu) => `
    <div class="timeline-item">
      <div class="timeline-header">
        <div>
          <div class="timeline-title">${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</div>
          <div class="timeline-subtitle">${escapeHtml(edu.institution)}</div>
        </div>
        <div class="timeline-date">${escapeHtml(edu.startYear)} — ${escapeHtml(edu.endYear)}${edu.gpa ? ` · GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
      </div>
      ${edu.description ? `<div class="timeline-desc">${escapeHtml(edu.description)}</div>` : ''}
    </div>
  `).join('');

  const projectsHTML = projects.map((p) => `
    <div class="project-card">
      ${p.imageUrl
        ? `<img src="${p.imageUrl}" alt="${escapeHtml(p.title)}" class="project-img" />`
        : `<div class="project-img" style="background:${theme.primaryColor}">${escapeHtml(p.title.charAt(0))}</div>`
      }
      <div class="project-body">
        <div class="project-title">${escapeHtml(p.title)}</div>
        <div class="project-desc">${escapeHtml(p.description)}</div>
        <div class="tech-tags">${p.techStack.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}</div>
        <div class="project-links">
          ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank">🔗 Live Demo</a>` : ''}
          ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank">📦 GitHub</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  const achievementsHTML = achievements.map((a) => `
    <div class="achievement-card">
      <div class="achievement-title">${escapeHtml(a.title)}</div>
      <div class="achievement-issuer">${escapeHtml(a.issuer)}</div>
      <div class="achievement-date">${escapeHtml(a.date)}</div>
      ${a.description ? `<div class="achievement-desc">${escapeHtml(a.description)}</div>` : ''}
      ${a.url ? `<a href="${escapeHtml(a.url)}" target="_blank" style="font-size:0.85rem;margin-top:0.5rem;display:inline-block;">View →</a>` : ''}
    </div>
  `).join('');

  const leetcode = data.platformProfiles?.leetcode;
  const codeforces = data.platformProfiles?.codeforces;
  const github = data.platformProfiles?.github;
  const hasStats = Boolean(leetcode || codeforces || github || (data.codingStats && (data.codingStats.totalProblemsSolved || data.codingStats.ratings?.length)));

  const statsHTML = hasStats ? `
    <div class="stats-grid">
      ${leetcode ? `
        <div class="stat-card">
          <div class="stat-title">🧩 LeetCode (@${escapeHtml(leetcode.username)})</div>
          <div class="stat-value">${leetcode.totalSolved}</div>
          <div class="stat-sub">Problems Solved</div>
          <div class="stat-chips">
            <span class="stat-chip">Easy: ${leetcode.easySolved}</span>
            <span class="stat-chip">Med: ${leetcode.mediumSolved}</span>
            <span class="stat-chip">Hard: ${leetcode.hardSolved}</span>
          </div>
        </div>
      ` : ''}
      ${codeforces ? `
        <div class="stat-card">
          <div class="stat-title">⚔️ Codeforces (@${escapeHtml(codeforces.handle)})</div>
          <div class="stat-value">${codeforces.rating || 'Unrated'}</div>
          <div class="stat-sub">Contest Rating (${escapeHtml(codeforces.rank)})</div>
          ${codeforces.maxRating > 0 ? `<div class="stat-chips"><span class="stat-chip">Peak: ${codeforces.maxRating}</span></div>` : ''}
        </div>
      ` : ''}
      ${github ? `
        <div class="stat-card">
          <div class="stat-title">⚙ GitHub (@${escapeHtml(github.username)})</div>
          <div class="stat-value">${github.publicRepos}</div>
          <div class="stat-sub">Public Repositories</div>
          <div class="stat-chips">
            ${github.languages.slice(0, 3).map((l: string) => `<span class="stat-chip">${escapeHtml(l)}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  ` : '';

  const tpl = getTemplate(data.templateId);
  const terms = tpl.terms;

  const sections = [
    ...(personal.bio ? ['about'] : []),
    ...(hasStats ? ['stats'] : []),
    ...(skills.length > 0 ? ['skills'] : []),
    ...(experience.length > 0 ? ['experience'] : []),
    ...(education.length > 0 ? ['education'] : []),
    ...(projects.length > 0 ? ['projects'] : []),
    ...(achievements.length > 0 ? ['achievements'] : []),
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(fullName)} — Portfolio</title>
  <link rel="stylesheet" href="style.css" />
  <meta name="description" content="${personal.bio ? escapeHtml(personal.bio.slice(0, 160)) : `Portfolio of ${escapeHtml(fullName)}`}" />
</head>
<body>

<header>
  ${personal.avatar ? `<img src="${personal.avatar}" alt="${escapeHtml(fullName)}" class="avatar" />` : ''}
  <h1>${escapeHtml(fullName)}</h1>
  ${personal.title ? `<p class="title">${escapeHtml(personal.title)}</p>` : ''}
  <div class="contact-links">
    ${personal.email ? `<a href="mailto:${escapeHtml(personal.email)}">✉ ${escapeHtml(personal.email)}</a>` : ''}
    ${personal.phone ? `<a href="tel:${escapeHtml(personal.phone)}">📞 ${escapeHtml(personal.phone)}</a>` : ''}
    ${personal.location ? `<span>📍 ${escapeHtml(personal.location)}</span>` : ''}
    ${personal.website ? `<a href="${escapeHtml(personal.website)}" target="_blank">🌐 Website</a>` : ''}
    ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}" target="_blank">in LinkedIn</a>` : ''}
    ${personal.github ? `<a href="${escapeHtml(personal.github)}" target="_blank">⚙ GitHub</a>` : ''}
  </div>
</header>

${sections.length > 0 ? `
<nav>
  <ul>
    ${sections.map((s) => {
      const label = s === 'about' ? terms.about : s === 'stats' ? 'Stats' : s === 'skills' ? terms.skills : s === 'experience' ? terms.experience : s === 'education' ? terms.education : s === 'projects' ? terms.projects : terms.achievements;
      return `<li><a href="#${s}">${escapeHtml(label)}</a></li>`;
    }).join('\n    ')}
  </ul>
</nav>
` : ''}

<main class="container">
  ${personal.bio ? `
  <section id="about">
    <h2 class="section-title">${escapeHtml(terms.about)}</h2>
    <p class="bio">${escapeHtml(personal.bio)}</p>
  </section>` : ''}

  ${hasStats ? `
  <section id="stats">
    <h2 class="section-title">Verified Profiles & Statistics</h2>
    ${statsHTML}
  </section>` : ''}

  ${skills.length > 0 ? `
  <section id="skills">
    <h2 class="section-title">${escapeHtml(terms.skills)}</h2>
    ${skillsHTML}
  </section>` : ''}

  ${experience.length > 0 ? `
  <section id="experience">
    <h2 class="section-title">${escapeHtml(terms.experience)}</h2>
    <div class="timeline">${experienceHTML}</div>
  </section>` : ''}

  ${education.length > 0 ? `
  <section id="education">
    <h2 class="section-title">${escapeHtml(terms.education)}</h2>
    <div class="timeline">${educationHTML}</div>
  </section>` : ''}

  ${projects.length > 0 ? `
  <section id="projects">
    <h2 class="section-title">${escapeHtml(terms.projects)}</h2>
    <div class="projects-grid">${projectsHTML}</div>
  </section>` : ''}

  ${achievements.length > 0 ? `
  <section id="achievements">
    <h2 class="section-title">${escapeHtml(terms.achievements)}</h2>
    <div class="achievements-grid">${achievementsHTML}</div>
  </section>` : ''}
</main>

<footer>
  <p>© 2026 ${escapeHtml(fullName)} · Built with <a href="https://portcraft.dev" style="color:rgba(255,255,255,0.7)">PortCraft</a></p>
</footer>

<script src="script.js"></script>
</body>
</html>`;
}
