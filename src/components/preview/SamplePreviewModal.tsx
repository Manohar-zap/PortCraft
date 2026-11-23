'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Monitor, Tablet, Smartphone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getTemplate } from '@/lib/templates';
import { getSamplePortfolio } from '@/lib/sampleProfiles';
import ThemeDispatcher from '@/components/templates/ThemeDispatcher';
import DevicePreviewFrame from './DevicePreviewFrame';

interface Props {
  templateId: string | null;
  onClose: () => void;
  onLoadSample?: (sampleData: ReturnType<typeof getSamplePortfolio>) => void;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';

export default function SamplePreviewModal({ templateId, onClose, onLoadSample }: Props) {
  const [viewport, setViewport] = useState<Viewport>('desktop');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!templateId) return null;

  const tpl = getTemplate(templateId);
  const sampleData = getSamplePortfolio(templateId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md">
        {/* Modal Top Bar */}
        <div className="h-14 border-b border-white/10 bg-black/90 px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest bg-violet-600/40 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded">
              #{tpl.number < 10 ? `0${tpl.number}` : tpl.number}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm md:text-base">{tpl.name}</span>
              <span className="hidden sm:inline text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full capitalize">
                {tpl.family} · {tpl.category}
              </span>
            </div>
          </div>

          {/* Viewport switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`p-1.5 rounded transition-all ${
                  viewport === v ? 'bg-violet-600 text-white shadow' : 'text-white/40 hover:text-white'
                }`}
                title={`View ${v}`}
              >
                {v === 'desktop' && <Monitor size={15} />}
                {v === 'tablet' && <Tablet size={15} />}
                {v === 'mobile' && <Smartphone size={15} />}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {onLoadSample ? (
              <button
                onClick={() => {
                  onLoadSample(sampleData);
                  onClose();
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs md:text-sm px-3.5 py-1.5 rounded-lg transition-all shadow-md hover:scale-105"
              >
                <Sparkles size={14} />
                <span>Load Sample Data</span>
              </button>
            ) : (
              <Link
                href={`/builder?template=${tpl.id}&loadSample=true`}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs md:text-sm px-3 py-1.5 rounded-lg transition-all"
              >
                <Sparkles size={13} />
                <span className="hidden sm:inline">Use with Sample Data</span>
                <span className="sm:hidden">Load Sample</span>
              </Link>
            )}

            <Link
              href={`/builder?template=${tpl.id}`}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs md:text-sm px-3.5 py-1.5 rounded-lg transition-all"
            >
              <span>Use Blank</span>
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Close Preview (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Sample Notice Banner */}
        <div className="bg-violet-950/60 border-b border-violet-500/20 px-4 py-1.5 text-center text-xs text-violet-200 flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-violet-400" />
          <span>Interactive Live Sample: This portfolio is populated with realistic demonstration data for <strong>{tpl.name}</strong>.</span>
        </div>

        {/* Scrollable Preview Canvas */}
        <div className="flex-1 overflow-auto p-2 sm:p-6 flex items-start justify-center bg-[#0a0a10]">
          <DevicePreviewFrame viewport={viewport}>
            <ThemeDispatcher data={sampleData} />
          </DevicePreviewFrame>
        </div>
      </div>
    </AnimatePresence>
  );
}
