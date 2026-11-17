'use client';

import { useState } from 'react';
import { PortfolioData, ThemeConfig } from '@/lib/types';
import { TEMPLATES as TEMPLATE_LIST, getTemplate } from '@/lib/templates';
import { Search } from 'lucide-react';

interface Props {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
}

const FONT_OPTIONS = [
  { label: 'Inter (Modern)', value: 'Inter, sans-serif' },
  { label: 'Poppins (Friendly)', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display (Elegant)', value: '"Playfair Display", serif' },
  { label: 'JetBrains Mono (Dev)', value: '"JetBrains Mono", monospace' },
  { label: 'Cinzel (Cinematic)', value: '"Cinzel", serif' },
  { label: 'Georgia (Classic)', value: 'Georgia, serif' },
  { label: 'Roboto (Clean)', value: 'Roboto, sans-serif' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-4">{title}</div>
      <div className="px-4 space-y-3">{children}</div>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-white/60">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/30 font-mono">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border border-white/10"
          style={{ padding: '2px', background: 'transparent' }}
        />
      </div>
    </div>
  );
}

export default function Customizer({ data, updateData }: Props) {
  const { theme } = data;
  const [templateSearch, setTemplateSearch] = useState('');

  const updateTheme = (partial: Partial<ThemeConfig>) =>
    updateData({ theme: { ...theme, ...partial } });

  const filteredTemplates = TEMPLATE_LIST.filter((t) => {
    if (!templateSearch.trim()) return true;
    const q = templateSearch.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  const activeTemplate = getTemplate(data.templateId);

  return (
    <div className="py-4 text-white">
      {/* Template switcher (30 Themes) */}
      <Section title={`Theme (${TEMPLATE_LIST.length} Available)`}>
        <div className="relative mb-2">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            placeholder="Search 30 themes..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {filteredTemplates.map((t) => {
            const isSelected = (data.templateId || 'spider-verse') === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  updateData({
                    templateId: t.id,
                    theme: { ...theme, ...t.defaultTheme },
                  });
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-900/30 text-white'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold truncate">
                    #{t.number} {t.name}
                  </div>
                  <div className="text-[10px] text-white/40">{t.category}</div>
                </div>
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                  style={{ background: t.accentColor }}
                />
              </button>
            );
          })}
        </div>
      </Section>

      <div className="border-t border-white/[0.05] my-4" />

      {/* Colors */}
      <Section title="Theme Palette">
        <ColorRow label="Primary" value={theme.primaryColor} onChange={(v) => updateTheme({ primaryColor: v })} />
        <ColorRow label="Secondary" value={theme.secondaryColor} onChange={(v) => updateTheme({ secondaryColor: v })} />
        <ColorRow label="Accent" value={theme.accentColor} onChange={(v) => updateTheme({ accentColor: v })} />
        <ColorRow label="Background" value={theme.backgroundColor} onChange={(v) => updateTheme({ backgroundColor: v })} />
        <ColorRow label="Text" value={theme.textColor} onChange={(v) => updateTheme({ textColor: v })} />
      </Section>

      <div className="border-t border-white/[0.05] my-4" />

      {/* Typography */}
      <Section title="Typography">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Body Font</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ background: '#1a1a2e' }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Heading Font</label>
          <select
            value={theme.headingFont}
            onChange={(e) => updateTheme({ headingFont: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ background: '#1a1a2e' }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Font Size</label>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateTheme({ fontSize: s })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  theme.fontSize === s ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.08]'
                }`}
              >
                {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <div className="border-t border-white/[0.05] my-4" />

      {/* Layout */}
      <Section title="Layout & Effects">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Border Radius</label>
          <div className="flex gap-1.5">
            {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
              <button
                key={r}
                onClick={() => updateTheme({ borderRadius: r })}
                className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                  theme.borderRadius === r ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'
                }`}
              >
                {r === 'none' ? '□' : r === 'sm' ? '▢' : r === 'md' ? '◻' : r === 'lg' ? '⬜' : '○'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Color Mode</label>
          <button
            onClick={() => updateTheme({ darkMode: !theme.darkMode })}
            className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
              theme.darkMode ? 'bg-slate-700 text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'
            }`}
          >
            {theme.darkMode ? '🌙 Dark Theme' : '☀️ Light Theme'}
          </button>
        </div>
      </Section>

      <div className="border-t border-white/[0.05] my-4" />

      {/* Reset to template defaults */}
      <div className="px-4">
        <button
          onClick={() => {
            if (activeTemplate) {
              updateTheme({ ...activeTemplate.defaultTheme } as ThemeConfig);
            }
          }}
          className="w-full py-2 rounded-lg text-xs text-white/40 hover:text-white/80 border border-white/[0.08] hover:border-white/20 transition-all"
        >
          Reset to {activeTemplate.name} defaults
        </button>
      </div>
    </div>
  );
}
