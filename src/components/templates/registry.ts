import React from 'react';
import { PortfolioData } from '@/lib/types';

import SpiderVerseTheme from './worlds/spiderverse/SpiderVerseTheme';
import GothamTheme from './worlds/gotham/GothamTheme';
import CyberpunkTheme from './worlds/cyberpunk/CyberpunkTheme';
import RetroRpgTheme from './worlds/retrorpg/RetroRpgTheme';
import TerminalTheme from './worlds/terminal/TerminalTheme';
import BentoTheme from './worlds/bento/BentoTheme';
import MinimalistTheme from './worlds/minimalist/MinimalistTheme';
import EditorialTheme from './worlds/editorial/EditorialTheme';
import CreativeStudioTheme from './worlds/creativestudio/CreativeStudioTheme';
import DataScientistTheme from './worlds/datascientist/DataScientistTheme';

// Import remaining original worlds for full 30-template preservation
import {
  ThemeComicPop,
  ThemeAnimeDimension,
} from './themes/ThemesComicAction';
import {
  ThemeArcReactor,
  ThemeShadowProtocol,
} from './themes/ThemesCyberTech';
import {
  ThemeDesertDynasty,
  ThemeAssassin,
  ThemeGalacticFrontier,
  ThemeTimekeeper,
  ThemeKingdomOfInk,
} from './themes/ThemesEpicCinematic';
import {
  ThemeBrickverse,
  ThemeViceCity,
} from './themes/ThemesPlayfulGaming';
import {
  ThemeMysticDimension,
  ThemeOrbitalAcademy,
  ThemeFrostbyte,
  ThemeSolarForge,
  ThemeDeepSea,
} from './themes/ThemesOriginalWorlds1';
import {
  ThemeDreamscape,
  ThemeWasteland,
  ThemeMechaWorkshop,
  ThemeCloudKingdom,
} from './themes/ThemesOriginalWorlds2';

export interface ThemeDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType<{ data: PortfolioData }>;
  aliases?: string[];
}

export const FLAGSHIP_WORLDS: Record<string, React.ComponentType<{ data: PortfolioData }>> = {
  // 1. Spider-Verse
  'spider-verse': SpiderVerseTheme,
  'miles-morales': SpiderVerseTheme,

  // 2. Gotham Noir / Dark Detective
  'gotham-noir': GothamTheme,
  'batman': GothamTheme,

  // 3. Cyberpunk / Night City
  'night-city': CyberpunkTheme,
  'cyberpunk': CyberpunkTheme,

  // 4. Retro RPG / Pixel Hero
  'blocklands': RetroRpgTheme,
  'retro-rpg': RetroRpgTheme,
  'pixel-rpg': RetroRpgTheme,

  // 5. Terminal / Matrix Hacker
  'code-reality': TerminalTheme,
  'terminal': TerminalTheme,
  'hacker': TerminalTheme,
  'tech': TerminalTheme,

  // 6. Modern Bento Grid
  'digital-grid': BentoTheme,
  'bento': BentoTheme,

  // 7. Swiss Minimalist
  'infinite-museum': MinimalistTheme,
  'minimalist': MinimalistTheme,
  'swiss': MinimalistTheme,

  // 8. Editorial / The Magazine
  'celestial-library': EditorialTheme,
  'editorial': EditorialTheme,

  // 9. Creative Studio / Avant-Garde
  'neon-nomad': CreativeStudioTheme,
  'creative': CreativeStudioTheme,
  'creative-studio': CreativeStudioTheme,

  // 10. Data Scientist / Research Lab
  'quantum-lab': DataScientistTheme,
  'data-scientist': DataScientistTheme,

  // Preserved original worlds & franchise inspirations
  'arc-reactor': ThemeArcReactor,
  'mystic-dimension': ThemeMysticDimension,
  'desert-dynasty': ThemeDesertDynasty,
  'elegant': ThemeDesertDynasty,
  'brickverse': ThemeBrickverse,
  'comic-pop': ThemeComicPop,
  'anime-dimension': ThemeAnimeDimension,
  'vice-city': ThemeViceCity,
  'assassin': ThemeAssassin,
  'galactic-frontier': ThemeGalacticFrontier,
  'orbital-academy': ThemeOrbitalAcademy,
  'frostbyte': ThemeFrostbyte,
  'solar-forge': ThemeSolarForge,
  'deep-sea-explorer': ThemeDeepSea,
  'timekeeper': ThemeTimekeeper,
  'dreamscape': ThemeDreamscape,
  'wasteland-survivor': ThemeWasteland,
  'mecha-workshop': ThemeMechaWorkshop,
  'kingdom-of-ink': ThemeKingdomOfInk,
  'cloud-kingdom': ThemeCloudKingdom,
  'shadow-protocol': ThemeShadowProtocol,
};

export function getThemeComponent(templateId?: string): React.ComponentType<{ data: PortfolioData }> {
  if (!templateId) return SpiderVerseTheme;
  const normalized = templateId.toLowerCase().trim();
  return FLAGSHIP_WORLDS[normalized] || SpiderVerseTheme;
}
