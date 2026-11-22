import React from 'react';
import { PortfolioData } from '@/lib/types';

// The 10 Flagship Worlds
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

// The 20 Redesigned Classic Worlds
import ArcReactorTheme from './worlds/arcreactor/ArcReactorTheme';
import MysticDimensionTheme from './worlds/mystic/MysticDimensionTheme';
import DesertDynastyTheme from './worlds/desert/DesertDynastyTheme';
import BrickverseTheme from './worlds/brickverse/BrickverseTheme';
import ComicPopTheme from './worlds/comicpop/ComicPopTheme';
import AnimeDimensionTheme from './worlds/anime/AnimeDimensionTheme';
import ViceCityTheme from './worlds/vicecity/ViceCityTheme';
import AssassinTheme from './worlds/assassin/AssassinTheme';
import GalacticFrontierTheme from './worlds/galactic/GalacticFrontierTheme';
import OrbitalAcademyTheme from './worlds/orbital/OrbitalAcademyTheme';
import FrostbyteTheme from './worlds/frostbyte/FrostbyteTheme';
import SolarForgeTheme from './worlds/solarforge/SolarForgeTheme';
import DeepSeaExplorerTheme from './worlds/deepsea/DeepSeaExplorerTheme';
import TimekeeperTheme from './worlds/timekeeper/TimekeeperTheme';
import DreamscapeTheme from './worlds/dreamscape/DreamscapeTheme';
import WastelandSurvivorTheme from './worlds/wasteland/WastelandSurvivorTheme';
import MechaWorkshopTheme from './worlds/mechaworkshop/MechaWorkshopTheme';
import KingdomOfInkTheme from './worlds/kingdomofink/KingdomOfInkTheme';
import CloudKingdomTheme from './worlds/cloudkingdom/CloudKingdomTheme';
import ShadowProtocolTheme from './worlds/shadowprotocol/ShadowProtocolTheme';

export const THEME_REGISTRY: Record<string, React.ComponentType<{ data: PortfolioData }>> = {
  // 01-10 Flagship Worlds
  'spider-verse': SpiderVerseTheme,
  'miles-morales': SpiderVerseTheme,
  'gotham-noir': GothamTheme,
  'batman': GothamTheme,
  'night-city': CyberpunkTheme,
  'cyberpunk': CyberpunkTheme,
  'blocklands': RetroRpgTheme,
  'retro-rpg': RetroRpgTheme,
  'pixel-rpg': RetroRpgTheme,
  'code-reality': TerminalTheme,
  'terminal': TerminalTheme,
  'hacker': TerminalTheme,
  'tech': TerminalTheme,
  'digital-grid': BentoTheme,
  'bento': BentoTheme,
  'infinite-museum': MinimalistTheme,
  'minimalist': MinimalistTheme,
  'swiss': MinimalistTheme,
  'celestial-library': EditorialTheme,
  'editorial': EditorialTheme,
  'neon-nomad': CreativeStudioTheme,
  'creative': CreativeStudioTheme,
  'creative-studio': CreativeStudioTheme,
  'quantum-lab': DataScientistTheme,
  'data-scientist': DataScientistTheme,

  // 11-30 Redesigned Classic Worlds
  'arc-reactor': ArcReactorTheme,
  'mystic-dimension': MysticDimensionTheme,
  'desert-dynasty': DesertDynastyTheme,
  'elegant': DesertDynastyTheme,
  'brickverse': BrickverseTheme,
  'comic-pop': ComicPopTheme,
  'anime-dimension': AnimeDimensionTheme,
  'vice-city': ViceCityTheme,
  'assassin': AssassinTheme,
  'galactic-frontier': GalacticFrontierTheme,
  'orbital-academy': OrbitalAcademyTheme,
  'frostbyte': FrostbyteTheme,
  'solar-forge': SolarForgeTheme,
  'deep-sea-explorer': DeepSeaExplorerTheme,
  'timekeeper': TimekeeperTheme,
  'dreamscape': DreamscapeTheme,
  'wasteland-survivor': WastelandSurvivorTheme,
  'mecha-workshop': MechaWorkshopTheme,
  'kingdom-of-ink': KingdomOfInkTheme,
  'cloud-kingdom': CloudKingdomTheme,
  'shadow-protocol': ShadowProtocolTheme,
};

export function getThemeComponent(templateId?: string): React.ComponentType<{ data: PortfolioData }> {
  if (!templateId) return SpiderVerseTheme;
  const normalized = templateId.toLowerCase().trim();
  return THEME_REGISTRY[normalized] || SpiderVerseTheme;
}
