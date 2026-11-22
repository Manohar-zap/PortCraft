'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Search, Sparkles, Eye, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { PortfolioData } from '@/lib/types';
import { TEMPLATES, THEME_CATEGORIES, ThemeCategory } from '@/lib/templates';
import { getSamplePortfolio } from '@/lib/sampleProfiles';
import SamplePreviewModal from '@/components/preview/SamplePreviewModal';

interface Props {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
}

export default function StepTemplate({ data, updateData }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState<'all' | 'inspired' | 'original'>('all');
  const [previewModalId, setPreviewModalId] = useState<string | null>(null);

  const selectTemplate = (id: string) => {
    const tpl = TEMPLATES.find((t) => t.id === id);
    updateData({
      templateId: id,
      theme: { ...data.theme, ...(tpl?.defaultTheme ?? {}) },
    });
  };

  const handleLoadSample = (templateId: string) => {
    const sample = getSamplePortfolio(templateId);
    updateData(sample);
  };

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (familyFilter !== 'all' && t.family !== familyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles size={14} />
          30 Fictional Worlds & Themes Collection
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">Choose Your Template</h1>
        <p className="text-white/50 text-sm">
          Select from 30 distinct fictional themes. Each theme has its own layout, typography, and atmosphere.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 30 themes (e.g. Spider-Verse, Cyberpunk, Noir, Voxel)..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Family Pill Filter */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1">
          {(['all', 'inspired', 'original'] as const).map((fam) => (
            <button
              key={fam}
              onClick={() => setFamilyFilter(fam)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                familyFilter === fam
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {fam === 'all' ? 'All (30)' : fam === 'inspired' ? 'Inspired (15)' : 'Original (15)'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {THEME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-white text-black font-semibold'
                : 'bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((t, i) => {
          const isSelected = data.templateId === t.id;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              onClick={() => selectTemplate(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectTemplate(t.id);
                }
              }}
              className={`text-left rounded-2xl overflow-hidden border-2 transition-all cursor-pointer focus:outline-none group relative ${
                isSelected
                  ? 'border-violet-500 shadow-xl shadow-violet-500/20'
                  : 'border-white/[0.08] hover:border-white/25 hover:bg-white/[0.01]'
              }`}
            >
              {/* Preview banner area */}
              <div className={`h-36 bg-gradient-to-br ${t.previewBg} relative overflow-hidden flex flex-col justify-between p-3.5`}>
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded">
                    #{t.number < 10 ? `0${t.number}` : t.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewModalId(t.id);
                      }}
                      className="text-[10px] font-bold bg-black/60 hover:bg-violet-600 text-white px-2 py-0.5 rounded backdrop-blur-md transition-all flex items-center gap-1 border border-white/10"
                      title="View live demo sample of this theme"
                    >
                      <Eye size={11} />
                      Sample
                    </button>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                      {t.family}
                    </span>
                  </div>
                </div>

                <div className="z-10">
                  <div className="w-8 h-1.5 rounded-full mb-1.5" style={{ background: t.accentColor }} />
                  <div className="font-black text-white text-base leading-tight drop-shadow-md">
                    {t.name}
                  </div>
                </div>

                {/* Selected Checkmark Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-violet-600/30 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center shadow-lg border-2 border-white">
                      <Check size={18} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Meta & Terms */}
              <div className={`p-4 transition-colors ${isSelected ? 'bg-violet-950/20' : 'bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-violet-400">{t.category}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewModalId(t.id);
                    }}
                    className="text-[11px] text-white/60 hover:text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    <Eye size={12} />
                    Live Demo
                  </button>
                </div>
                <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">{t.description}</p>

                {/* Terminology mapping chip preview */}
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2 mb-3 text-[11px] text-white/60">
                  <span className="text-white/40">Projects:</span> <span className="text-white/90 font-medium">{t.terms.projects}</span> · <span className="text-white/40">Skills:</span> <span className="text-white/90 font-medium">{t.terms.skills}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/[0.05] text-white/40 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/40 text-sm">No themes found matching your search. Try adjusting the category or search keyword.</p>
        </div>
      )}

      {data.templateId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-violet-900/20 border border-violet-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center shrink-0">
              <Check size={16} className="text-violet-400" />
            </div>
            <div>
              <div className="text-violet-200 text-sm font-semibold">
                {TEMPLATES.find((t) => t.id === data.templateId)?.name || data.templateId} selected
              </div>
              <div className="text-violet-400/60 text-xs">Ready to preview in live viewport mode or load sample data.</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleLoadSample(data.templateId)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-700/40 hover:bg-emerald-600/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all"
              title="Populate your builder fields with this theme's realistic sample data"
            >
              <Sparkles size={13} />
              Load Sample Persona
            </button>
            <button
              type="button"
              onClick={() => setPreviewModalId(data.templateId)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all"
            >
              <Eye size={13} />
              View Demo
            </button>
            <Link
              href="/preview"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Preview
              <ExternalLink size={13} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Live Sample Modal */}
      <SamplePreviewModal
        templateId={previewModalId}
        onClose={() => setPreviewModalId(null)}
        onLoadSample={(sample) => updateData(sample)}
      />
    </div>
  );
}
