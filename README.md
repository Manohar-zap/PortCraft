# PortCraft 🚀
> **Student Digital Profile Aggregator + AI Portfolio Builder**
>
> Connect your coding and development profiles, consolidate achievements, and generate a personalized portfolio across **30 fictional universe themes** with Google Gemini AI assistance.

PortCraft is an educational and student portfolio platform. Students can connect their existing coding, development, and professional profiles (GitHub, LeetCode, Codeforces, HackerRank, etc.), aggregate verified statistics, review and approve imported data, and generate a customized portfolio website.

---

## ✨ Key Capabilities

### 1. 🌐 Universal Profile Import (`/connect`)
- **Coding Platforms**: LeetCode (problems solved, difficulty breakdown), Codeforces (ratings, peak ranking), HackerRank, CodeChef, GeeksforGeeks.
- **Development Platforms**: GitHub (public repositories, stargazers, forks, languages, topics), GitLab.
- **Data Science & Research**: Kaggle (medals, tiers, profile link), Google Scholar.
- **Professional**: LinkedIn profile linking, resume PDF/DOCX import fallback.
- **Privacy First**: Respects official platform permissions, no credential storage, public endpoints only.

### 2. 📊 Profile Analysis Dashboard (`/dashboard`)
- Real-time profile completeness score and readiness breakdown.
- Aggregated coding statistics (LeetCode difficulty distribution, Codeforces contest performance).
- Public GitHub repository explorer and language distribution.
- One-click AI Profile Analysis for strengths, gaps, and career recommendations.

### 3. 🛡️ User Review & Approval System (`/review`)
- Complete transparency: nothing is published without user consent.
- **Duplicate Project Detection**: Fuzzy matching identifies likely duplicates across platforms with one-click merging.
- Select featured repositories and projects to display.
- Edit bios, headlines, and descriptions before generation.

### 4. 🤖 Google Gemini AI Integration
- **Portfolio Generation** (`/api/ai/generate`): Generates impactful bios, headlines, and project summaries from verified facts without fabricating credentials.
- **PortCraft AI Assistant** (`src/components/ai/ChatWidget.tsx`): Persistent conversational AI helper on builder and preview pages with an approval-based action system.
- **Section Improvement** (`/api/ai/improve`): Rewrite specific sections with custom instructions.

### 5. 🎨 30 Independent Fictional Portfolio Universes
- Every single one of the 30 themes is an **independent visual universe** with its own layout architecture, SVG/CSS background environment, bespoke typography, and dedicated interactive component storytelling.
- Universal data binding: changing themes changes the entire visual reality without altering the student's authentic data.
- Zero layout breakage: dynamic `VerifiedProfileStats` component matches all themes.
- Client-side static ZIP export packages full HTML/CSS/JS with coding statistics.

---

## 🗂️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript |
| **AI** | Google Gen AI SDK (`@google/genai`) with Gemini 2.0 Flash |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Export** | JSZip (client-side standalone website packages) |
| **Storage** | Local-first browser localStorage |
| **Deployment** | Vercel (Serverless Functions) |

---

## 🏃 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Manohar-zap/PortCraft.git
cd PortCraft
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Required for AI features (portfolio generation, chatbot, content improvement)
# Get key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Override default model (default: gemini-2.0-flash)
GEMINI_MODEL=gemini-2.0-flash

# Optional: Higher GitHub API rate limits (5000/hr vs 60/hr)
GITHUB_TOKEN=your_github_token_here
```

> **Note**: PortCraft functions fully even without `GEMINI_API_KEY`! In offline/no-key mode, all manual builder features, theme previews, and ZIP exports continue to work seamlessly.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
```

---

## 🚀 Deployment to Vercel

PortCraft is optimized for deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. In Project Settings → **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Google AI Studio API key
   - `GITHUB_TOKEN` = (optional) your GitHub token
4. Click **Deploy**. Both the static pages and the serverless API routes (`/api/*`) deploy automatically.

---

## 🎨 30 Fictional Portfolio Themes

### Family A: Franchise & Genre-Inspired (01–15)
1. **Spider-Verse / Web-Slinger** (`spider-verse`) — Energetic comic halftone, diagonal panels, and mission logs.
2. **Gotham Noir / Dark Detective** (`gotham-noir`) — Serious intelligence dossier, blueprint grids, and confidential case files.
3. **Arc Reactor / Holographic Engineer** (`arc-reactor`) — Telemetry HUD, glowing reactor rings, and engineering schematics.
4. **Mystic Dimension / Portal Archive** (`mystic-dimension`) — Astral mandalas, shimmering portal rings, and sacred relics.
5. **Night City / Neon Future** (`night-city`) — Cyberpunk neon signage, glitch headers, and street gigs.
6. **Digital Grid / Light-Cycle Future** (`digital-grid`) — Electric blue wireframe grid, construct modules, and run cycles.
7. **Code Reality / Digital Terminal** (`code-reality`) — Terminal green prompt, ASCII status lines, and repository explorer.
8. **Desert Dynasty / Epic Sci-Fi** (`desert-dynasty`) — Warm sand dunes, topographic contour lines, and long-range expeditions.
9. **Brickverse / Buildable World** (`brickverse`) — Toy construction bricks, plastic stud bevels, and parts shelf.
10. **Blocklands / Voxel Adventure** (`blocklands`) — Pixelated voxel terrain, hotbar inventory, and advancement badges.
11. **Comic Pop / Graphic Novel** (`comic-pop`) — Four-color pop art, speech bubbles, and Issue #1 cover stories.
12. **Anime Dimension / Cinematic Animation** (`anime-dimension`) — Widescreen anime title sequences, speedlines, and key episodes.
13. **Vice City / Retro Arcade** (`vice-city`) — 80s synthwave sunset grid, palm silhouettes, and high-score arcade runs.
14. **Assassin / Historical Shadow** (`assassin`) — Parchment manuscripts, compass geometry, and memory corridors.
15. **Galactic Frontier / Space Opera** (`galactic-frontier`) — Deep space starfields, orbital trajectories, and captain flight logs.

### Family B: Original PortCraft Fictional Worlds (16–30)
16. **Neon Nomad** (`neon-nomad`) — Lone explorer in glowing megacity districts and route waypoints.
17. **Orbital Academy** (`orbital-academy`) — Space colony student station, research missions, and cadet ID.
18. **Frostbyte** (`frostbyte`) — Pristine glacial glassmorphism, faceted crystal cards, and cryo experiments.
19. **Solar Forge** (`solar-forge`) — Radiant amber artisan foundry, forged creations, and masterwork seals.
20. **Deep Sea Explorer** (`deep-sea-explorer`) — Abyssal ocean trench, bioluminescent aqua depth meters, and specimens.
21. **Timekeeper** (`timekeeper`) — Chronological steampunk archive with brass dials and historical era capsules.
22. **Dreamscape** (`dreamscape`) — Soft surrealism with organic pastel floating cards and manifested dreams.
23. **Wasteland Survivor** (`wasteland-survivor`) — Rugged post-apocalyptic survival log with hazard stamps and scavenged gear.
24. **Celestial Library** (`celestial-library`) — Cosmic book spines, scholarly star shelves, and catalogued volumes.
25. **Mecha Workshop** (`mecha-workshop`) — Industrial robotics engineering blueprint with machine assemblies.
26. **Kingdom of Ink** (`kingdom-of-ink`) — Medieval illuminated manuscript with gold botanical flourishes and chronicles.
27. **Quantum Lab** (`quantum-lab`) — Clean scientific research dashboard with controlled experiment matrices.
28. **Cloud Kingdom** (`cloud-kingdom`) — Floating island project modules with gentle pastel breezes.
29. **Shadow Protocol** (`shadow-protocol`) — Stealth cybersecurity tactical HUD with threat audits and clearances.
30. **Infinite Museum** (`infinite-museum`) — Contemporary gallery architecture, exhibition rooms, and curator statements.

## 📦 Export Format

Generates a standalone ZIP with:
- `index.html` — Full responsive portfolio with theme terminology
- `style.css` — CSS variables matching the chosen theme palette and typography
- `script.js` — Smooth scrolling and interactive navigation

---

Built with Next.js, Tailwind CSS, and Framer Motion.
