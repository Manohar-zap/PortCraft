'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import {
  ThemeSpiderVerse,
  ThemeGothamNoir,
  ThemeComicPop,
  ThemeAnimeDimension,
} from './themes/ThemesComicAction';
import {
  ThemeArcReactor,
  ThemeNightCity,
  ThemeDigitalGrid,
  ThemeCodeReality,
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
  ThemeBlocklands,
  ThemeViceCity,
} from './themes/ThemesPlayfulGaming';
import {
  ThemeMysticDimension,
  ThemeNeonNomad,
  ThemeOrbitalAcademy,
  ThemeFrostbyte,
  ThemeSolarForge,
  ThemeDeepSea,
} from './themes/ThemesOriginalWorlds1';
import {
  ThemeDreamscape,
  ThemeWasteland,
  ThemeCelestialLibrary,
  ThemeMechaWorkshop,
  ThemeQuantumLab,
  ThemeCloudKingdom,
  ThemeInfiniteMuseum,
} from './themes/ThemesOriginalWorlds2';

interface Props {
  data: PortfolioData;
}

export default function ThemeDispatcher({ data }: Props) {
  const id = data.templateId || 'spider-verse';

  switch (id) {
    // 01-15: Franchise / Genre-inspired
    case 'spider-verse':
    case 'miles-morales':
      return <ThemeSpiderVerse data={data} />;
    case 'gotham-noir':
      return <ThemeGothamNoir data={data} />;
    case 'arc-reactor':
      return <ThemeArcReactor data={data} />;
    case 'mystic-dimension':
      return <ThemeMysticDimension data={data} />;
    case 'night-city':
      return <ThemeNightCity data={data} />;
    case 'digital-grid':
      return <ThemeDigitalGrid data={data} />;
    case 'code-reality':
    case 'tech':
      return <ThemeCodeReality data={data} />;
    case 'desert-dynasty':
    case 'elegant':
      return <ThemeDesertDynasty data={data} />;
    case 'brickverse':
      return <ThemeBrickverse data={data} />;
    case 'blocklands':
      return <ThemeBlocklands data={data} />;
    case 'comic-pop':
      return <ThemeComicPop data={data} />;
    case 'anime-dimension':
      return <ThemeAnimeDimension data={data} />;
    case 'vice-city':
      return <ThemeViceCity data={data} />;
    case 'assassin':
      return <ThemeAssassin data={data} />;
    case 'galactic-frontier':
      return <ThemeGalacticFrontier data={data} />;

    // 16-30: Original PortCraft Fictional Worlds
    case 'neon-nomad':
    case 'creative':
      return <ThemeNeonNomad data={data} />;
    case 'orbital-academy':
      return <ThemeOrbitalAcademy data={data} />;
    case 'frostbyte':
      return <ThemeFrostbyte data={data} />;
    case 'solar-forge':
      return <ThemeSolarForge data={data} />;
    case 'deep-sea-explorer':
      return <ThemeDeepSea data={data} />;
    case 'timekeeper':
      return <ThemeTimekeeper data={data} />;
    case 'dreamscape':
      return <ThemeDreamscape data={data} />;
    case 'wasteland-survivor':
      return <ThemeWasteland data={data} />;
    case 'celestial-library':
      return <ThemeCelestialLibrary data={data} />;
    case 'mecha-workshop':
      return <ThemeMechaWorkshop data={data} />;
    case 'kingdom-of-ink':
      return <ThemeKingdomOfInk data={data} />;
    case 'quantum-lab':
      return <ThemeQuantumLab data={data} />;
    case 'cloud-kingdom':
      return <ThemeCloudKingdom data={data} />;
    case 'shadow-protocol':
      return <ThemeShadowProtocol data={data} />;
    case 'infinite-museum':
    case 'minimalist':
      return <ThemeInfiniteMuseum data={data} />;

    default:
      return <ThemeSpiderVerse data={data} />;
  }
}
