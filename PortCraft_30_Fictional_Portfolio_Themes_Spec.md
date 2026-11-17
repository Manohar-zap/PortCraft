# PORTCRAFT — FICTIONAL PORTFOLIO THEME COLLECTION
## Product Design & Implementation Specification
Version: 1.0
Date: 17 November 2026
Audience: AI coding agents, frontend developers, product designers

---

# 1. PRODUCT PURPOSE

PortCraft is a browser-based portfolio builder. Users enter their information once, select a visual theme, and PortCraft renders a personalized portfolio using a shared profile data model.

This document specifies 30 distinct portfolio themes:
- Themes 01–15: franchise/genre-inspired visual directions.
- Themes 16–30: original fictional worlds created for PortCraft.

The themes must be meaningfully different. Do not implement them as one template with different colors. Each needs its own layout composition, typography, navigation, content presentation, visual assets, interaction model, responsive behavior, and theme tokens.

## Product constraints
- No AI or LLM calls in the portfolio generation workflow.
- No backend or database required.
- No authentication required.
- Browser-side profile editing, preview, persistence and export.
- Use original artwork and legally usable fonts/assets.
- Franchise-inspired themes must not ship with unlicensed characters, logos, movie stills, game assets, soundtrack, distinctive proprietary marks or copied layouts. Use original, legally distinct artwork that evokes broad visual genres only. Add a licensing review before commercial release.
- Respect reduced-motion preferences and maintain accessible contrast and keyboard navigation.
- All theme content must be populated from the same profile schema.

# 2. SHARED PROFILE DATA CONTRACT

Use a single typed data model for every theme. A suggested TypeScript interface:

```ts
type SocialLink = {
  id: string;
  label: string;
  url: string;
};

type Education = {
  id: string;
  institution: string;
  qualification: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

type Experience = {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  highlights?: string[];
};

type Project = {
  id: string;
  name: string;
  summary: string;
  description?: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  featured?: boolean;
};

type Achievement = {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
  url?: string;
};

type Profile = {
  personal: {
    fullName: string;
    headline: string;
    shortBio: string;
    about?: string;
    email?: string;
    phone?: string;
    location?: string;
    avatarUrl?: string;
    resumeUrl?: string;
    availability?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: {
    id: string;
    name: string;
    category?: string;
    level?: number;
  }[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Achievement[];
  socialLinks: SocialLink[];
  sectionVisibility: Record<string, boolean>;
};
```

Rules:
1. No template may hardcode a user's name, skills, project, education or contact details.
2. Empty optional sections should be hidden by default, or shown as configurable empty states in the editor only.
3. Users can reorder sections and hide/show them.
4. Template switching must preserve all profile data.
5. Theme-specific labels may change (e.g. “Projects” → “Missions”), but underlying data keys remain stable.
6. Every theme must provide clear, accessible labels and conventional contact links.
7. Avoid inventing skill proficiency or project metrics. Only display fields the user supplies.

# 3. SHARED TEMPLATE API

Recommended interface:

```ts
type ThemeConfig = {
  accent: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  headingFont: string;
  bodyFont: string;
  radius: string;
  density: "compact" | "comfortable" | "spacious";
  motion: "full" | "reduced" | "off";
};

type PortfolioThemeProps = {
  profile: Profile;
  config: ThemeConfig;
  previewMode?: boolean;
};

type ThemeDefinition = {
  id: string;
  name: string;
  family: "inspired" | "original";
  description: string;
  categories: string[];
  previewImage: string;
  component: React.ComponentType<PortfolioThemeProps>;
  defaultConfig: ThemeConfig;
  supportedSections: string[];
  motionLevel: "low" | "medium" | "high";
};
```

Each theme must implement:
- Desktop, tablet and mobile layouts.
- Theme-specific hero and section compositions.
- About, skills, projects, experience, education, achievements and contact when data exists.
- Responsive navigation with keyboard support.
- Theme-specific project cards and detail presentation.
- Configurable accent/background/text colors within safe contrast limits.
- A reduced-motion mode.
- A conventional fallback layout if decorative effects fail.

# 4. THEME SPECIFICATIONS

## FAMILY A — FRANCHISE / GENRE-INSPIRED DIRECTIONS

These concepts are visual inspiration only. Production assets and branding must be original or licensed.

### 01 — SPIDER-VERSE / WEB-SLINGER
**Positioning:** Energetic, youthful, comic-book-inspired portfolio for developers, designers and students.

- Palette: near-black `#101014`, signal red `#E32636`, off-white `#F5F1E8`, muted graphite `#33333B`.
- Typography: heavy condensed display face; neutral sans-serif for body.
- Layout: oversized split hero; diagonal or offset content blocks; comic-panel project gallery; full-width contact finale.
- Navigation: floating compact navigation with angular tabs.
- Signature visuals: original web-line SVGs, halftone textures, torn-paper shapes, abstract city silhouettes.
- Interactions: panel reveal on scroll, subtle line-draw animation, hover tilt on project cards, optional comic transition between sections.
- Profile mapping: About = Origin Story; Projects = Missions; Skills = Abilities; Achievements = Milestones.
- Components: `WebSlingerHero`, `ComicPanel`, `MissionCard`, `AbilityTag`, `OriginStory`.
- Mobile: stack panels vertically; disable diagonal overflow; keep navigation compact.
- Motion: medium; all motion disabled under `prefers-reduced-motion`.
- Avoid: Spider-Man character art, Marvel logos, movie stills, copied costume details or franchise typography.

### 02 — GOTHAM NOIR / DARK DETECTIVE
**Positioning:** Serious, mysterious portfolio for cybersecurity, engineering, research and professional profiles.

- Palette: `#090B10`, charcoal `#171C24`, muted gold `#D6B45A`, cool gray `#B9C0CA`.
- Typography: condensed uppercase headings; highly legible sans-serif body.
- Layout: cinematic dark hero; narrow intelligence sidebar; project “case files”; timeline as investigation history.
- Navigation: fixed left rail on desktop; drawer on mobile.
- Signature visuals: original city skyline, blueprint grids, evidence labels, subtle rain texture.
- Interactions: dossier open/close, spotlight hover, evidence-card reveal, restrained parallax.
- Profile mapping: Projects = Case Files; Experience = Investigation Record; Skills = Tools & Capabilities; Achievements = Case Outcomes.
- Components: `NoirHero`, `CaseFileCard`, `EvidenceTag`, `InvestigationTimeline`, `SignalContact`.
- Mobile: no fixed sidebar; use top menu and stacked dossiers.
- Motion: low-to-medium; no flashing or strobing.
- Avoid: Batman logos, character silhouettes, film assets, Batmobile imagery or proprietary symbols.

### 03 — ARC REACTOR / HOLOGRAPHIC ENGINEER
**Positioning:** Technical portfolio for software, electronics, robotics and engineering.

- Palette: deep navy `#07131F`, graphite `#111E2B`, reactor cyan `#42D9F5`, warm red `#E94B4B`, pale gold `#E5B85C`.
- Typography: geometric sans-serif with monospaced micro-labels.
- Layout: central identity panel; radial skill modules; project cards as engineering schematics; experience as system logs.
- Navigation: horizontal HUD tabs with visible text labels.
- Signature visuals: original circular reactor motif, wireframe diagrams, technical callouts and measurement lines.
- Interactions: radial progress animation only for user-supplied skill levels; scanning line; expandable project specifications.
- Profile mapping: Skills = System Modules; Projects = Builds; Experience = Mission Log; Achievements = Certifications/Deployments.
- Components: `ReactorHero`, `HudPanel`, `ModuleRing`, `BuildCard`, `SystemLog`.
- Mobile: radial modules become a list; keep all controls usable without hover.
- Motion: medium; canvas effects optional, CSS/SVG preferred.
- Avoid: Iron Man armor, Stark branding, film UI screenshots or character likenesses.

### 04 — MYSTIC DIMENSION / PORTAL ARCHIVE
**Positioning:** Creative, research and storytelling portfolios.

- Palette: midnight violet `#171126`, plum `#34204B`, ember `#F28B42`, antique gold `#D7B56D`, parchment `#F1E7D4`.
- Typography: expressive serif headings with clean sans-serif body.
- Layout: circular portal hero; layered “realm” sections; projects displayed as artifacts; vertical journey timeline.
- Navigation: floating chapter markers and accessible text menu.
- Signature visuals: original geometric mandalas, portal rings, star maps and magical diagrams.
- Interactions: portal reveal, slow rotating geometry, chapter transitions, artifact detail drawer.
- Profile mapping: Projects = Artifacts; Skills = Disciplines; Experience = Journeys; Achievements = Relics.
- Components: `PortalHero`, `ArtifactCard`, `DisciplineGrid`, `JourneyTimeline`, `RealmNav`.
- Mobile: replace circular layout with linear stacked cards.
- Motion: medium; no essential content hidden behind animation.
- Avoid: Doctor Strange character, Sanctum assets, Marvel symbols or copied film graphics.

### 05 — NIGHT CITY / NEON FUTURE
**Positioning:** Bold creative-tech portfolio for developers, artists and digital creators.

- Palette: ink `#090A12`, neon magenta `#FF3CAC`, cyan `#00E5FF`, acid yellow `#E9FF45`, violet `#7657FF`.
- Typography: condensed futuristic display; readable sans-serif body; mono labels.
- Layout: asymmetric full-bleed hero; ticker strips; offset project cards; dense but ordered information panels.
- Navigation: street-sign style top navigation.
- Signature visuals: original skyline, neon signage, abstract circuitry and scanline texture.
- Interactions: subtle glitch on selected headings, neon border hover, parallax skyline, animated ticker with pause control.
- Profile mapping: Projects = Gigs; Skills = Cyberware; Experience = Street Record; Achievements = Reputation.
- Components: `NeonHero`, `GigCard`, `CyberwareList`, `StreetTicker`, `ReputationPanel`.
- Mobile: reduce visual density and remove heavy parallax.
- Motion: medium-to-high but never use rapid flashing.
- Avoid: Cyberpunk 2077 logos, characters, screenshots, game UI or copied branding.

### 06 — DIGITAL GRID / LIGHT-CYCLE FUTURE
**Positioning:** Clean futuristic portfolio for developers, data scientists and product designers.

- Palette: black `#05080D`, electric blue `#1677FF`, cyan `#51E5FF`, white `#F4FAFF`.
- Typography: geometric sans-serif and monospaced metadata.
- Layout: strict grid; full-width hero; glowing framed sections; projects in equal-width modules.
- Navigation: thin horizontal bar with active grid indicator.
- Signature visuals: original luminous paths, wireframe grid, geometric rings.
- Interactions: animated path tracing, grid-line reveal, hover illumination.
- Profile mapping: Projects = Constructs; Skills = Programs; Experience = Runs; Achievements = Records.
- Components: `GridHero`, `ConstructCard`, `ProgramGrid`, `RunTimeline`.
- Mobile: collapse columns to one; avoid horizontal scrolling.
- Motion: low-to-medium.
- Avoid: TRON logos, suits, film stills, recognizable light-cycle designs or copied franchise marks.

### 07 — CODE REALITY / DIGITAL TERMINAL
**Positioning:** Programmer, security researcher and systems engineer portfolio.

- Palette: black `#050706`, terminal green `#42F57B`, dark green `#102218`, soft white `#D7E8DC`.
- Typography: accessible monospace for labels and body; optional sans-serif for long descriptions.
- Layout: terminal intro; command index; file-tree project explorer; output-style experience and skills.
- Navigation: clickable terminal commands plus standard navigation fallback.
- Signature visuals: abstract code rain, cursor, terminal prompt, system status labels.
- Interactions: typing intro with skip button; command selection; expandable file tree; copy contact command.
- Profile mapping: Projects = Repositories; Skills = Commands; Experience = System History; Achievements = Build Results.
- Components: `TerminalHero`, `CommandNav`, `RepoExplorer`, `OutputPanel`, `StatusLine`.
- Mobile: use touch-friendly command chips; do not require typing.
- Motion: low; code rain must be optional and pauseable.
- Avoid: Matrix film logos, copyrighted symbols or copied screen imagery.

### 08 — DESERT DYNASTY / EPIC SCI-FI
**Positioning:** Strategic, cinematic portfolio for architects, researchers, founders and writers.

- Palette: sand `#D8B98A`, parchment `#F0E4CF`, dark umber `#2B211B`, bronze `#9B6A3C`, muted olive `#77704C`.
- Typography: refined serif display and neutral sans-serif body.
- Layout: wide desert hero; editorial text blocks; horizontal project expeditions; long-form career journey.
- Navigation: minimal top bar with chapter anchors.
- Signature visuals: original dunes, abstract sun, topographic lines and dust particles.
- Interactions: slow landscape parallax, subtle horizon reveal, map-like project transitions.
- Profile mapping: Projects = Expeditions; Skills = Specialties; Experience = Journey; Achievements = Discoveries.
- Components: `DuneHero`, `ExpeditionCard`, `TopographicDivider`, `JourneyChapter`.
- Mobile: static landscape crop and linear sections.
- Motion: low.
- Avoid: Dune characters, logos, film art or copied costume/prop designs.

### 09 — BRICKVERSE / BUILDABLE WORLD
**Positioning:** Playful portfolio for students, makers, product designers and creative developers.

- Palette: primary red `#E53935`, yellow `#FFD43B`, blue `#2878D0`, green `#45A65A`, white `#FFFDF5`, dark ink `#242424`.
- Typography: rounded bold display and readable sans-serif.
- Layout: modular brick cards; colorful hero; projects arranged as build platforms; skill blocks as a parts shelf.
- Navigation: chunky block buttons.
- Signature visuals: original generic toy bricks, studs, block shadows and playful geometric scenery.
- Interactions: optional brick assembly intro; draggable project tiles in editor only; card lift and snap effects.
- Profile mapping: Projects = Builds; Skills = Parts; Experience = Build History; Achievements = Trophies.
- Components: `BrickHero`, `BuildPlatform`, `PartsShelf`, `BuildCard`, `TrophyTile`.
- Mobile: one-column blocks; no drag-only interaction.
- Motion: medium.
- Avoid: LEGO logo, minifigure designs, proprietary brick configurations, packaging graphics or trademarked wordmarks. Use generic construction-brick aesthetics and review trade dress.

### 10 — BLOCKLANDS / VOXEL ADVENTURE
**Positioning:** Gamified portfolio for students, developers and 3D creators.

- Palette: grass `#5D9E43`, sky `#83C9ED`, soil `#795438`, stone `#92999D`, charcoal `#28323A`.
- Typography: pixel display for short labels; readable sans-serif for paragraphs.
- Layout: voxel landscape hero; inventory-style skills; project “worlds”; progression timeline.
- Navigation: inventory toolbar.
- Signature visuals: original voxel trees, mountains, terrain tiles and block icons.
- Interactions: biome switcher, block reveal, optional low-poly scene.
- Profile mapping: Projects = Worlds; Skills = Inventory; Experience = Quests; Achievements = Advancements.
- Components: `VoxelHero`, `InventoryBar`, `WorldCard`, `QuestTimeline`, `AdvancementBadge`.
- Mobile: replace inventory strip with scrollable chips; no complex 3D requirement.
- Motion: medium; static fallback mandatory.
- Avoid: Minecraft textures, mobs, icons, logos, sounds or copied game assets.

### 11 — COMIC POP / GRAPHIC NOVEL
**Positioning:** Visual storytellers, illustrators, creative developers and communicators.

- Palette: comic red `#EF3E36`, yellow `#FFD447`, blue `#2467B2`, paper `#FFF9E9`, ink `#171717`.
- Typography: bold display face, comic accent lettering used sparingly, readable sans-serif body.
- Layout: panel-based story; oversized speech-bubble intro; project covers; issue-style section dividers.
- Navigation: numbered chapters and persistent menu.
- Signature visuals: original halftone, speed lines, burst shapes, speech bubbles and panel borders.
- Interactions: panel reveal, page-turn effect, hover callouts.
- Profile mapping: About = Origin; Projects = Issues; Experience = Chapters; Achievements = Highlights.
- Components: `ComicCoverHero`, `StoryPanel`, `IssueCard`, `SpeechCallout`, `ChapterNav`.
- Mobile: panels stack; page-turn becomes a simple fade.
- Motion: medium.
- Avoid: recognizable comic characters, publisher logos or copied panels.

### 12 — ANIME DIMENSION / CINEMATIC ANIMATION
**Positioning:** Illustrators, animators, game artists and creative technologists.

- Palette: configurable; default midnight `#101426`, crimson `#D94A58`, lavender `#A7A1E8`, mist `#E9ECF5`.
- Typography: expressive display and neutral sans-serif; do not use decorative fonts for body copy.
- Layout: cinematic full-screen hero; layered character-free illustration; episode cards; vertical story sections.
- Navigation: episode selector and conventional menu.
- Signature visuals: original manga-inspired speed lines, abstract landscapes, expressive gradients and motion frames.
- Interactions: scene transitions, title reveal, optional animated background.
- Profile mapping: Projects = Episodes; Skills = Techniques; Experience = Story Arc; Achievements = Awards.
- Components: `CinematicHero`, `EpisodeCard`, `TechniqueGrid`, `StoryArc`.
- Mobile: image crops must preserve focal point; disable expensive animation.
- Motion: medium-to-high, with reduced-motion alternative.
- Avoid: anime character likenesses, studio marks, show logos or copyrighted frames.

### 13 — VICE CITY / RETRO ARCADE
**Positioning:** Creative professionals, musicians, designers and developers who prefer nostalgic visuals.

- Palette: sunset coral `#FF6B6B`, hot pink `#F04CB5`, violet `#6C4AB6`, aqua `#63D6D0`, midnight `#17142A`.
- Typography: 80s-inspired display with clean body font.
- Layout: sunset hero; large typography; neon project gallery; compact profile stats.
- Navigation: retro arcade menu.
- Signature visuals: original sunset stripes, palm silhouettes, grid horizon and chrome-like text effects.
- Interactions: synthwave horizon movement, arcade-style hover, optional sound off by default.
- Profile mapping: Projects = High Scores; Skills = Power-Ups; Experience = Levels; Achievements = Trophies.
- Components: `SunsetHero`, `HighScoreCard`, `PowerUpGrid`, `TrophyShelf`.
- Mobile: simplify background layers and avoid tiny pixel text.
- Motion: medium.
- Avoid: GTA logos, characters, game map, soundtrack or copied artwork.

### 14 — ASSASSIN / HISTORICAL SHADOW
**Positioning:** History, architecture, research, writing and strategy portfolios.

- Palette: parchment `#E9DFC9`, ink `#25231F`, oxblood `#772D32`, antique brass `#A88A54`, stone `#9A9487`.
- Typography: historical serif headings and modern body font.
- Layout: manuscript hero; map-like project index; timeline and archival project cards.
- Navigation: chapter tabs with map coordinates as decoration only.
- Signature visuals: original parchment texture, compass geometry, ink stamps and architectural silhouettes.
- Interactions: document unfolding, map pin reveal, archive drawer.
- Profile mapping: Projects = Records; Skills = Disciplines; Experience = Timeline; Achievements = Honors.
- Components: `ArchiveHero`, `RecordCard`, `MapIndex`, `HonorSeal`, `ChronicleTimeline`.
- Mobile: map becomes a list; text remains readable.
- Motion: low.
- Avoid: Assassin's Creed insignia, character designs, game assets or proprietary symbols.

### 15 — GALACTIC FRONTIER / SPACE OPERA
**Positioning:** Scientists, engineers, researchers, founders and science communicators.

- Palette: space navy `#080D20`, star white `#F4F5FA`, ion blue `#6CA8FF`, amber `#F6C56A`, nebula violet `#8068C7`.
- Typography: cinematic geometric headings and readable sans-serif.
- Layout: starfield hero; mission cards; orbital skill group; timeline as flight log.
- Navigation: star-map anchors.
- Signature visuals: original planets, star maps, orbital paths and abstract spacecraft silhouettes.
- Interactions: orbital movement, constellation line drawing, mission dossier reveal.
- Profile mapping: Projects = Missions; Skills = Systems; Experience = Flight Log; Achievements = Discoveries.
- Components: `GalaxyHero`, `MissionCard`, `OrbitSkillMap`, `FlightLog`, `DiscoveryBadge`.
- Mobile: reduce starfield density; orbital skills become stacked cards.
- Motion: medium.
- Avoid: Star Wars names, logos, character designs, recognizable ships or film assets.

---

## FAMILY B — ORIGINAL PORTCRAFT FICTIONAL WORLDS

These are original design identities. They may be developed into PortCraft-owned theme brands, subject to normal trademark and asset review.

### 16 — NEON NOMAD
**Concept:** A lone explorer navigating a futuristic megacity.
- Palette: black `#0C0D13`, electric cyan `#2DE2E6`, ultraviolet `#8A5CFF`, coral `#FF6B6B`.
- Layout: split hero with portrait on one side and oversized headline on the other; project cards like city districts.
- Navigation: floating location selector.
- Signature: abstract city map, glowing route lines, district labels.
- Interactions: route drawing, district-to-project transitions, subtle parallax.
- Profile mapping: Projects = Districts; Skills = Gear; Experience = Routes; Achievements = Discoveries.
- Components: `NomadHero`, `DistrictCard`, `RouteTimeline`, `GearPanel`.
- Mobile: route map becomes a vertical journey.
- Implementation: SVG paths, CSS glow, Framer Motion.

### 17 — ORBITAL ACADEMY
**Concept:** A space-colony student and research profile.
- Palette: deep navy `#101A36`, sky `#83CFFF`, silver `#D9E4EF`, orange `#FF9D5C`.
- Layout: academy ID hero; research modules; project mission grid; academic timeline.
- Navigation: mission-control tabs.
- Signature: orbital rings, abstract station diagrams, data labels.
- Interactions: module activation, orbiting decorative elements, expandable research cards.
- Profile mapping: Education = Training; Projects = Research Missions; Skills = Equipment; Achievements = Flight Records.
- Components: `AcademyID`, `ResearchModule`, `MissionGrid`, `TrainingTimeline`.
- Mobile: linear mission cards.
- Implementation: SVG orbital diagrams, CSS transforms; no required 3D.

### 18 — FROSTBYTE
**Concept:** An icy digital world for software and data professionals.
- Palette: ice `#EAF7FF`, glacier `#9ED8F2`, deep blue `#173B5E`, frost violet `#A8A5D8`.
- Layout: clean pale hero; translucent ice panels; crystalline project gallery.
- Navigation: glassy top bar.
- Signature: frost gradients, faceted crystal shapes, soft blur.
- Interactions: crystalline reveal, subtle blur-to-focus, hover refraction illusion.
- Profile mapping: Projects = Experiments; Skills = Toolset; Experience = Expeditions; Achievements = Breakthroughs.
- Components: `FrostHero`, `CrystalCard`, `ToolsetGrid`, `BreakthroughList`.
- Mobile: remove excessive blur and maintain contrast.
- Implementation: CSS gradients, backdrop-filter with solid fallback.

### 19 — SOLAR FORGE
**Concept:** A warm, optimistic world of creation and invention.
- Palette: solar gold `#F6B93B`, ember `#E76F3C`, dark bronze `#38251D`, cream `#FFF2D8`.
- Layout: bright editorial hero; project workshop; process timeline; achievement gallery.
- Navigation: workshop tabs.
- Signature: sun discs, heat-wave lines, geometric metalwork patterns.
- Interactions: forge progress reveal, card stamping, warm gradient transitions.
- Profile mapping: Projects = Creations; Skills = Craft; Experience = Workshop History; Achievements = Masterworks.
- Components: `ForgeHero`, `CreationCard`, `CraftGrid`, `MasterworkBadge`.
- Mobile: stack cards and use static decorative sun.
- Implementation: CSS/SVG only; no expensive shaders.

### 20 — DEEP SEA EXPLORER
**Concept:** An underwater research and discovery portfolio.
- Palette: abyss `#061B2A`, ocean `#0D5265`, aqua `#53D6C2`, bioluminescent `#B7F7E5`, sand `#D9C6A0`.
- Layout: deep-sea hero; vertical depth scale; project “specimens”; research timeline.
- Navigation: depth markers.
- Signature: original bubbles, contour lines, abstract marine silhouettes and light shafts.
- Interactions: slow floating particles, depth transition, specimen-card reveal.
- Profile mapping: Projects = Discoveries; Skills = Instruments; Experience = Expeditions; Achievements = Findings.
- Components: `AbyssHero`, `SpecimenCard`, `DepthNav`, `ExpeditionLog`.
- Mobile: static background and compact depth navigation.
- Implementation: CSS particles or low-cost canvas; pause when tab is hidden.

### 21 — TIMEKEEPER
**Concept:** A time-travel archive presenting career history as timelines and eras.
- Palette: midnight `#171B2D`, brass `#C7A66A`, parchment `#E9DFC9`, burgundy `#733D50`.
- Layout: central timeline hero; eras as experience sections; projects as time capsules.
- Navigation: chronological era selector.
- Signature: clockwork rings, timeline ticks, archive stamps.
- Interactions: timeline scrubber, era transitions, expandable time capsule.
- Profile mapping: Experience = Eras; Projects = Time Capsules; Skills = Instruments; Achievements = Milestones.
- Components: `ClockHero`, `EraTimeline`, `CapsuleCard`, `MilestoneMarker`.
- Mobile: vertical timeline; scrubber becomes accessible buttons.
- Implementation: SVG clockwork, CSS transforms and semantic timeline markup.

### 22 — DREAMSCAPE
**Concept:** A surreal, soft, imaginative portfolio for artists and creators.
- Palette: lavender `#B9A7E8`, blush `#F4B7C8`, sky `#A9D7E8`, cream `#FFF6E9`, plum `#4C3D65`.
- Layout: oversized floating hero; irregular organic cards; layered project gallery.
- Navigation: floating pill menu.
- Signature: original cloud forms, liquid gradients, abstract moons and soft shapes.
- Interactions: gentle floating motion, morphing blobs, image reveal.
- Profile mapping: Projects = Dreams; Skills = Talents; Experience = Chapters; Achievements = Highlights.
- Components: `DreamHero`, `FloatingCard`, `DreamGallery`, `ChapterStack`.
- Mobile: remove floating overlaps; preserve clear reading order.
- Implementation: CSS shapes and SVG; no required WebGL.

### 23 — WASTELAND SURVIVOR
**Concept:** A rugged post-apocalyptic portfolio with resource-management aesthetics.
- Palette: dust `#C1A47A`, rust `#A64B35`, charcoal `#202326`, faded olive `#73764E`, bone `#E6DDC9`.
- Layout: rugged hero; resource panels; project dossiers; survival log timeline.
- Navigation: utility belt / compact tabs.
- Signature: distressed textures, topographic maps, warning labels and hand-drawn marks.
- Interactions: dossier unfolding, resource counter only for real user data, map reveal.
- Profile mapping: Skills = Resources; Projects = Builds; Experience = Survival Log; Achievements = Milestones.
- Components: `WastelandHero`, `ResourcePanel`, `BuildDossier`, `SurvivalLog`.
- Mobile: avoid texture-heavy backgrounds and use standard menu.
- Implementation: CSS textures/SVG; no random fake stats.
- Accessibility: maintain strong contrast despite distressed decoration.

### 24 — CELESTIAL LIBRARY
**Concept:** A cosmic knowledge archive for researchers, writers and educators.
- Palette: ink blue `#171B3B`, star gold `#E7C978`, lavender `#B8A9E8`, paper `#F5F0E6`.
- Layout: library index; book-spine project cards; research shelves; profile as author page.
- Navigation: table of contents and searchable section list.
- Signature: constellations, book motifs, star maps and archival labels.
- Interactions: shelf selection, book opening, constellation line reveal.
- Profile mapping: Projects = Volumes; Skills = Disciplines; Experience = Chapters; Achievements = Citations/Honors.
- Components: `LibraryHero`, `VolumeCard`, `DisciplineShelf`, `AuthorIndex`.
- Mobile: shelves become stacked lists.
- Implementation: CSS 3D book tilt with non-animated fallback.

### 25 — MECHA WORKSHOP
**Concept:** A mechanical engineering and robotics workshop.
- Palette: industrial gray `#333B43`, safety orange `#F28C28`, steel `#AAB4BC`, off-white `#F1F2ED`, signal blue `#397BA8`.
- Layout: blueprint hero; modular machine-part project cards; engineering process timeline.
- Navigation: labeled machine-panel controls.
- Signature: blueprint grids, bolts, measurement lines and schematic icons.
- Interactions: assembly sequence, expandable technical drawing, component highlighting.
- Profile mapping: Projects = Machines; Skills = Components; Experience = Build Log; Achievements = Test Results.
- Components: `WorkshopHero`, `MachineCard`, `BlueprintPanel`, `BuildLog`.
- Mobile: diagrams scale or become downloadable/viewable images.
- Implementation: SVG schematics, CSS grid, optional lightweight 3D viewer.
- Avoid fabricated technical metrics.

### 26 — KINGDOM OF INK
**Concept:** A fantasy manuscript and storytelling portfolio.
- Palette: parchment `#E8D9B9`, forest `#314A3C`, wine `#743B43`, antique gold `#B69A62`, ink `#29251F`.
- Layout: illuminated manuscript hero; chapter sections; project scrolls; ornamental timeline.
- Navigation: chapter index with decorative initial letters.
- Signature: original flourishes, map borders, botanical motifs and manuscript textures.
- Interactions: scroll unroll, chapter reveal, decorative drop-cap animation.
- Profile mapping: Projects = Tales; Skills = Arts; Experience = Chapters; Achievements = Honors.
- Components: `ManuscriptHero`, `ScrollCard`, `ChapterIndex`, `HonorSeal`.
- Mobile: replace unrolling animation with simple section reveal.
- Implementation: CSS typography and SVG ornaments; use readable fonts and sufficient contrast.

### 27 — QUANTUM LAB
**Concept:** A high-precision scientific and data-driven portfolio.
- Palette: white `#F6F8FC`, midnight `#111C35`, cobalt `#356AE6`, mint `#54C6A9`, violet `#8C78D8`.
- Layout: research dashboard hero; experiment cards; skill matrix; publication/research list.
- Navigation: compact tab bar with section index.
- Signature: graph paper, nodes, waveforms and particle diagrams.
- Interactions: graph reveal, experiment detail drawer, filterable project set.
- Profile mapping: Projects = Experiments; Skills = Methods; Experience = Research History; Achievements = Results.
- Components: `LabHero`, `ExperimentCard`, `MethodMatrix`, `ResearchTimeline`.
- Mobile: charts become scrollable or simplified; do not rely on hover.
- Implementation: SVG charts for decorative graphics; real data only for user-provided metrics.

### 28 — CLOUD KINGDOM
**Concept:** A light, optimistic, floating world for generalist creatives.
- Palette: sky `#A8D8F0`, cloud `#FFFFFF`, blue `#4D8CCB`, peach `#F6C5A8`, navy `#243B53`.
- Layout: open airy hero; floating islands as project sections; soft profile cards.
- Navigation: floating island anchors.
- Signature: original cloud shapes, islands, birds and sky gradients.
- Interactions: gentle float, island focus, smooth anchor movement.
- Profile mapping: Projects = Islands; Skills = Tools; Experience = Journeys; Achievements = Landmarks.
- Components: `CloudHero`, `IslandCard`, `JourneyPath`, `LandmarkBadge`.
- Mobile: remove overlapping island layout and use clear vertical cards.
- Implementation: CSS/SVG; respect reduced motion.

### 29 — SHADOW PROTOCOL
**Concept:** A stealth-tech intelligence interface for cybersecurity and technical professionals.
- Palette: near-black `#080B10`, slate `#202A35`, acid green `#B5F23D`, cool white `#E8EDF2`, muted cyan `#4CB8C8`.
- Layout: secure-access hero; intelligence dashboard; project threat-analysis cards; audit timeline.
- Navigation: compact protocol tabs with visible text.
- Signature: abstract scanning grid, signal lines, encrypted-file motifs.
- Interactions: access-panel reveal, scan animation, expandable technical dossier.
- Profile mapping: Projects = Operations; Skills = Capabilities; Experience = Field Record; Achievements = Clearances (only if supplied).
- Components: `ProtocolHero`, `OperationCard`, `CapabilityGrid`, `AuditTimeline`.
- Mobile: standard drawer; no hidden keyboard-only controls.
- Implementation: CSS/SVG and restrained motion.
- Do not imply security certifications or clearance the user does not have.

### 30 — INFINITE MUSEUM
**Concept:** A premium, immersive digital exhibition for multidisciplinary portfolios.
- Palette: warm white `#F4F1EA`, black `#1B1B1B`, gallery gray `#B9B6AE`, accent configurable by user.
- Layout: museum entrance hero; large curated project exhibits; spacious gallery rooms; profile as curator statement.
- Navigation: gallery floor plan and room selector.
- Signature: oversized artwork frames, gallery labels, subtle architectural lines.
- Interactions: exhibit focus, image lightbox, room-to-room transitions, optional guided tour.
- Profile mapping: Projects = Exhibits; Skills = Mediums; Experience = Collections; Achievements = Awards.
- Components: `MuseumEntrance`, `ExhibitCard`, `GalleryRoom`, `CuratorStatement`, `FloorPlanNav`.
- Mobile: floor plan becomes a simple section list; images remain tappable.
- Implementation: CSS layout, accessible lightbox and optional view transitions.

# 5. MARKETPLACE CATEGORIES AND FILTERS

Create these categories:
- Superhero & Comic
- Sci-Fi & Cyberpunk
- Gaming & Pixel
- Toy & Animation
- Fantasy & Mythology
- Original Worlds
- Cinematic
- Professional Creative

Marketplace filters:
- Theme family: Inspired / Original
- Mood: dark / light / colorful / cinematic / minimal
- Profession: developer / designer / student / researcher / photographer / writer / general
- Motion: low / medium / high
- Layout: grid / editorial / dashboard / timeline / immersive
- Device: desktop-ready / mobile-first

Each card should show:
- Preview image
- Theme name
- Short description
- Family label
- Best-for tags
- Motion level
- Preview button
- Use this theme button

# 6. LIVE PREVIEW AND EDITOR REQUIREMENTS

Build a theme preview route with:
- Desktop, tablet and mobile viewport toggles.
- Live profile data.
- Theme switching without data loss.
- Theme-specific color controls.
- Typography choices from a vetted local font list.
- Motion setting: full / reduced / off.
- Section visibility and ordering.
- Preview in a separate tab.
- Reset theme settings.

Editor layout:
- Left: profile sections and content controls.
- Center: live portfolio preview.
- Right: theme customization and selected section settings.
- Mobile: preview-first editor with collapsible controls.

Every button must work. No placeholder actions.

# 7. EXPORT REQUIREMENTS

Support:
1. Download standalone HTML/CSS/JS website as ZIP.
2. Download profile JSON backup.
3. Import profile JSON backup.
4. Generate PDF resume.

Exported websites must:
- Work without the PortCraft application.
- Include all required local assets.
- Have functional navigation and links.
- Be responsive.
- Not require a runtime API call.
- Include a README with local preview and deployment instructions.

Use safe HTML escaping and sanitize URLs. Never execute user-supplied scripts.

# 8. TECHNICAL IMPLEMENTATION

Suggested stack:
- React + TypeScript + Vite, or Next.js if the project already uses it.
- Tailwind CSS for shared primitives.
- CSS Modules or scoped styles for theme-specific styling.
- Framer Motion for optional transitions.
- Lucide icons for generic interface icons.
- JSZip for ZIP exports.
- Browser storage: localStorage for profile metadata; IndexedDB for larger images if needed.

Suggested folder structure:

```text
src/
  app/
    routes/
  components/
    marketplace/
    editor/
    preview/
    forms/
    shared/
  data/
    themeRegistry.ts
  profile/
    profileSchema.ts
    profileDefaults.ts
    profileValidation.ts
  themes/
    01-spider-verse/
    02-gotham-noir/
    03-arc-reactor/
    04-mystic-dimension/
    05-night-city/
    06-digital-grid/
    07-code-reality/
    08-desert-dynasty/
    09-brickverse/
    10-blocklands/
    11-comic-pop/
    12-anime-dimension/
    13-vice-city/
    14-assassin/
    15-galactic-frontier/
    16-neon-nomad/
    17-orbital-academy/
    18-frostbyte/
    19-solar-forge/
    20-deep-sea/
    21-timekeeper/
    22-dreamscape/
    23-wasteland/
    24-celestial-library/
    25-mecha-workshop/
    26-kingdom-of-ink/
    27-quantum-lab/
    28-cloud-kingdom/
    29-shadow-protocol/
    30-infinite-museum/
  lib/
    storage.ts
    themeEngine.ts
    exportHtml.ts
    exportZip.ts
    exportPdf.ts
    sanitize.ts
  styles/
    tokens.css
```

Do not put all themes into one component. Each theme should be independently maintainable but consume the shared `Profile` and `ThemeConfig` contracts.

# 9. QUALITY AND ACCEPTANCE TESTS

For every one of the 30 themes, verify:
- Correct theme identity and visual distinction.
- All profile sections populate correctly.
- Empty sections do not create broken gaps.
- Long names and long project descriptions wrap correctly.
- Missing images have graceful fallbacks.
- External links are validated and open safely.
- Keyboard navigation works.
- Color contrast is acceptable.
- Reduced-motion mode works.
- Mobile layout has no horizontal overflow.
- Theme switch preserves profile data.
- Exported version resembles the preview.
- No licensed/copyrighted assets are bundled without permission.

Test with:
1. A complete profile with all sections.
2. A minimal profile with only name, headline and one project.
3. A long profile with 20 projects and long descriptions.
4. Missing avatar and missing project images.
5. Non-Latin names and special characters.
6. Mobile viewport and keyboard-only navigation.

# 10. DELIVERY PLAN

Do not attempt to generate all 30 fully polished themes in one unverified pass.

Recommended sequence:
- Phase 1: shared profile schema, theme registry, marketplace and preview shell.
- Phase 2: implement 3 reference themes: Spider-Verse-inspired, Brickverse and Quantum Lab.
- Phase 3: validate the shared rendering contract and responsive behavior.
- Phase 4: implement themes 04–15 in batches of three.
- Phase 5: implement original themes 16–30 in batches of three.
- Phase 6: editor customization, local persistence and import/export.
- Phase 7: standalone HTML/ZIP and PDF export.
- Phase 8: accessibility, performance, licensing and regression testing.

For each phase:
- Run type checking.
- Run linting.
- Run production build.
- Test key interactions.
- Record completed work and remaining issues.
- Do not mark a theme complete until its acceptance checks pass.

# 11. FINAL INSTRUCTION TO THE CODING AGENT

Treat this document as the product specification for PortCraft's 30-theme fictional collection.

First inspect the existing repository and preserve its current architecture where sensible. Do not overwrite working functionality without checking it.

Implement the shared data contract and theme registry before building theme-specific pages. Build genuinely different compositions, not just palette swaps. Use original, legally usable visual assets. Make all interactions functional, all themes responsive, and every portfolio export independent of PortCraft.

Deliver working code, not mockups or placeholder screens. If a feature cannot be completed, state exactly what is missing rather than pretending it works.
