'use client';

import React from 'react';
import { PortfolioData } from '@/lib/types';
import { getThemeComponent } from './registry';
import VerifiedProfileStats from './VerifiedProfileStats';

interface Props {
  data: PortfolioData;
}

function isLightColor(colorStr?: string): boolean {
  if (!colorStr) return false;
  let c = colorStr.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length === 6) {
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.55;
    }
  }
  return false;
}

export default function ThemeDispatcher({ data }: Props) {
  const ThemeComponent = getThemeComponent(data.templateId);
  const theme = data.theme || {};

  const radiusMap: Record<string, string> = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  };
  const radiusVal = radiusMap[theme.borderRadius || 'md'] || '8px';

  const fontScaleMap: Record<string, { root: string; p: string; heading: string }> = {
    sm: { root: '14px', p: '0.875rem', heading: '0.92' },
    md: { root: '16px', p: '1rem', heading: '1' },
    lg: { root: '18px', p: '1.125rem', heading: '1.08' },
  };
  const fontScale = fontScaleMap[theme.fontSize || 'md'] || fontScaleMap.md;

  const isLightMode = theme.darkMode === false || isLightColor(theme.backgroundColor);

  return (
    <div
      id="portcraft-theme-root"
      className={`relative w-full ${isLightMode ? 'theme-light-mode' : 'theme-dark-mode'}`}
      style={{
        fontFamily: theme.fontFamily || 'Inter, sans-serif',
        color: theme.textColor || '#ffffff',
        backgroundColor: theme.backgroundColor || '#0a0a0f',
      }}
    >
      {/* Dynamic Google Fonts for all Customizer typography options */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Poppins:wght@300;400;500;600;700;900&family=Roboto:wght@300;400;500;700&display=swap"
      />

      <style dangerouslySetInnerHTML={{ __html: `
        /* Theme Typography Overrides */
        #portcraft-theme-root {
          font-family: ${theme.fontFamily || 'Inter, sans-serif'} !important;
          font-size: ${fontScale.root} !important;
          --font-sans: ${theme.fontFamily || 'Inter, sans-serif'};
          --font-serif: ${theme.headingFont || theme.fontFamily || 'serif'};
          --font-poppins: ${theme.fontFamily || 'Poppins, sans-serif'};
          --theme-primary: ${theme.primaryColor || '#7c3aed'};
          --theme-secondary: ${theme.secondaryColor || '#a78bfa'};
          --theme-accent: ${theme.accentColor || '#c4b5fd'};
          --theme-bg: ${theme.backgroundColor || '#0a0a0f'};
          --theme-text: ${theme.textColor || '#ffffff'};
        }

        #portcraft-theme-root p,
        #portcraft-theme-root span:not([class*="font-mono"]),
        #portcraft-theme-root a:not([class*="font-mono"]),
        #portcraft-theme-root li,
        #portcraft-theme-root input,
        #portcraft-theme-root button:not([class*="font-mono"]) {
          font-family: ${theme.fontFamily || 'Inter, sans-serif'} !important;
        }

        #portcraft-theme-root h1,
        #portcraft-theme-root h2,
        #portcraft-theme-root h3,
        #portcraft-theme-root h4,
        #portcraft-theme-root h5,
        #portcraft-theme-root h6 {
          font-family: ${theme.headingFont || theme.fontFamily || 'Inter, sans-serif'} !important;
        }

        /* Border Radius Overrides */
        #portcraft-theme-root button:not([class*="rounded-full"]),
        #portcraft-theme-root [class*="rounded-lg"],
        #portcraft-theme-root [class*="rounded-xl"],
        #portcraft-theme-root [class*="rounded-2xl"],
        #portcraft-theme-root [class*="rounded-3xl"],
        #portcraft-theme-root [class*="rounded-md"],
        #portcraft-theme-root [class*="rounded-sm"] {
          border-radius: ${radiusVal} !important;
        }

        /* Background & Text Palette Overrides */
        #portcraft-theme-root > div:first-child,
        #portcraft-theme-root [class*="min-h-screen"] {
          background-color: ${theme.backgroundColor || '#0a0a0f'} !important;
          color: ${theme.textColor || '#ffffff'} !important;
        }

        /* Primary and Accent Color Highlights */
        #portcraft-theme-root button[class*="bg-violet"],
        #portcraft-theme-root button[class*="bg-purple"],
        #portcraft-theme-root button[class*="bg-amber"],
        #portcraft-theme-root button[class*="bg-blue"],
        #portcraft-theme-root button[class*="bg-red"],
        #portcraft-theme-root button[class*="bg-emerald"] {
          background-color: ${theme.primaryColor || '#7c3aed'} !important;
          color: ${isLightColor(theme.primaryColor) ? '#000000' : '#ffffff'} !important;
        }

        #portcraft-theme-root [class*="border-[#F59E0B]"],
        #portcraft-theme-root [class*="border-[#F28B42]"],
        #portcraft-theme-root [class*="border-violet-"],
        #portcraft-theme-root [class*="border-purple-"],
        #portcraft-theme-root [class*="border-amber-"] {
          border-color: ${theme.primaryColor || '#7c3aed'} !important;
        }

        #portcraft-theme-root [class*="text-[#F59E0B]"],
        #portcraft-theme-root [class*="text-[#F28B42]"],
        #portcraft-theme-root [class*="text-violet-400"],
        #portcraft-theme-root [class*="text-purple-400"],
        #portcraft-theme-root [class*="text-amber-400"] {
          color: ${theme.primaryColor || '#7c3aed'} !important;
        }

        #portcraft-theme-root [class*="text-[#C084FC]"],
        #portcraft-theme-root [class*="text-[#D7B56D]"],
        #portcraft-theme-root [class*="text-purple-300"],
        #portcraft-theme-root [class*="text-cyan-400"],
        #portcraft-theme-root [class*="text-pink-400"] {
          color: ${theme.accentColor || theme.secondaryColor || '#C084FC'} !important;
        }

        /* Light Mode Inversion & Adaptation */
        #portcraft-theme-root.theme-light-mode {
          background-color: ${isLightColor(theme.backgroundColor) ? theme.backgroundColor : '#FAF9F6'} !important;
          color: ${!isLightColor(theme.textColor) ? theme.textColor : '#18181B'} !important;
        }
        #portcraft-theme-root.theme-light-mode > div:first-child,
        #portcraft-theme-root.theme-light-mode [class*="min-h-screen"] {
          background-color: ${isLightColor(theme.backgroundColor) ? theme.backgroundColor : '#FAF9F6'} !important;
          color: ${!isLightColor(theme.textColor) ? theme.textColor : '#18181B'} !important;
        }
        #portcraft-theme-root.theme-light-mode header,
        #portcraft-theme-root.theme-light-mode section,
        #portcraft-theme-root.theme-light-mode [class*="bg-[#1"],
        #portcraft-theme-root.theme-light-mode [class*="bg-[#0"],
        #portcraft-theme-root.theme-light-mode [class*="bg-[#2"],
        #portcraft-theme-root.theme-light-mode [class*="bg-black"],
        #portcraft-theme-root.theme-light-mode [class*="bg-neutral-900"],
        #portcraft-theme-root.theme-light-mode [class*="bg-slate-900"] {
          background-color: #FFFFFF !important;
          color: #18181B !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
        }
        #portcraft-theme-root.theme-light-mode h1,
        #portcraft-theme-root.theme-light-mode h2,
        #portcraft-theme-root.theme-light-mode h3,
        #portcraft-theme-root.theme-light-mode h4,
        #portcraft-theme-root.theme-light-mode h5,
        #portcraft-theme-root.theme-light-mode h6,
        #portcraft-theme-root.theme-light-mode strong {
          color: #0F172A !important;
          -webkit-text-fill-color: initial !important;
        }
        #portcraft-theme-root.theme-light-mode p,
        #portcraft-theme-root.theme-light-mode span:not([class*="text-white"]),
        #portcraft-theme-root.theme-light-mode div:not([class*="text-white"]) {
          color: #334155 !important;
        }
      `}} />

      <ThemeComponent data={data} />
      <VerifiedProfileStats data={data} />
    </div>
  );
}
