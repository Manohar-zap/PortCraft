'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Eye, Palette, RefreshCw, Sparkles,
  Monitor, Tablet, Smartphone, Settings2, X, Brain, Lightbulb
} from 'lucide-react';
import { loadPortfolio, savePortfolio } from '@/lib/storage';
import { PortfolioData, generateId } from '@/lib/types';
import { exportPortfolio } from '@/lib/exporter';
import { TEMPLATES, getTemplate } from '@/lib/templates';
import { getSamplePortfolio } from '@/lib/sampleProfiles';
import Customizer from '@/components/customizer/Customizer';

import ThemeDispatcher from '@/components/templates/ThemeDispatcher';
import DevicePreviewFrame from '@/components/preview/DevicePreviewFrame';
import ChatWidget from '@/components/ai/ChatWidget';
import IntelligentAssistantWidget from '@/components/intelligence/IntelligentAssistantWidget';
import RecommendationsPanel from '@/components/intelligence/RecommendationsPanel';
import { UserContext } from '@/lib/intelligence/types';
import { getOrBuildUserContext } from '@/lib/intelligence';


type Viewport = 'desktop' | 'tablet' | 'mobile';

function TemplateRenderer({ data }: { data: PortfolioData }) {
  return <ThemeDispatcher data={data} />;
}

export default function PreviewPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(loadPortfolio());
  }, []);

  // Derived user context for intelligence (client-side only)
  const userContext = useMemo(() => {
    if (!mounted) return null;
    return getOrBuildUserContext('/preview', data);
  }, [mounted, data]);

  const updateData = (partial: Partial<PortfolioData>) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      savePortfolio(updated);
      return updated;
    });
  };

  const handleRecommendationAction = (action: { type: string; label: string; payload: Record<string, any> }) => {
    switch (action.type) {
      case 'close':
        setShowRecommendations(false);
        break;
      case 'navigate':
        if (action.payload.page) {
          window.location.href = action.payload.page;
        }
        break;
      case 'apply-template':
        if (action.payload.templateId && data) {
          const template = getTemplate(action.payload.templateId);
          if (template) {
            updateData({
              templateId: template.id,
              theme: { ...data.theme, ...template.defaultTheme },
            });
          }
        }
        break;
      case 'add-skill':
        if (data) {
          const skillObj = action.payload.skill || {
            name: action.payload.skillName || 'New Skill',
            level: 3,
            category: action.payload.skillCategory || 'Technical',
          };
          const exists = data.skills?.some(s => s.name.toLowerCase() === skillObj.name.toLowerCase());
          if (!exists) {
            updateData({
              skills: [...(data.skills || []), { id: generateId(), name: skillObj.name, level: skillObj.level || 3, category: skillObj.category || 'Technical' }],
            });
          }
        }
        break;
      case 'create-project':
        if (data) {
          const newProj = {
            id: generateId(),
            title: action.payload.projectTitle || action.payload.project?.title || 'New Project',
            description: action.payload.projectIdea || action.payload.project?.description || '',
            techStack: action.payload.techStack || action.payload.project?.techStack || [],
            liveUrl: '',
            githubUrl: '',
            imageUrl: '',
            featured: false,
          };
          updateData({
            projects: [...(data.projects || []), newProj],
          });
        }
        break;
      case 'open-resource':
        if (action.payload.url) {
          window.open(action.payload.url, '_blank');
        }
        break;
      case 'open-modal':
        console.log('Open modal:', action.payload);
        break;
      default:
        console.log('Action handled:', action);
        break;
    }
  };

  const handleExport = async () => {
    if (!data) return;
    setExporting(true);
    try {
      await exportPortfolio(data);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-violet-400 animate-pulse flex items-center gap-2">
          <RefreshCw size={18} className="animate-spin" />
          Loading your portfolio...
        </div>
      </div>
    );
  }

  const template = TEMPLATES.find((t) => t.id === data.templateId);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Top toolbar */}
      <div className="flex-shrink-0 h-14 border-b border-white/5 backdrop-blur-xl bg-black/60 flex items-center px-4 gap-3 z-50">
        {/* Left */}
        <Link href="/builder" className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Edit</span>
        </Link>

        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Sparkles size={10} />
          </div>
          <span className="text-white/70 text-sm font-medium hidden sm:inline">
            {template?.name ?? 'Portfolio Preview'}
          </span>
        </div>

        {/* Center — Viewport controls */}
        <div className="flex items-center gap-1 mx-auto bg-white/[0.04] rounded-xl p-1">
          {([
            { key: 'desktop', icon: <Monitor size={15} /> },
            { key: 'tablet', icon: <Tablet size={15} /> },
            { key: 'mobile', icon: <Smartphone size={15} /> },
          ] as const).map((v) => (
            <button
              key={v.key}
              onClick={() => setViewport(v.key)}
              className={`p-2 rounded-lg transition-all ${viewport === v.key ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'}`}
            >
              {v.icon}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              if (data) {
                const sample = getSamplePortfolio(data.templateId || 'spider-verse');
                updateData(sample);
              }
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-500/30 text-emerald-300 font-medium transition-all"
            title="Load sample content tailored for this theme"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Load Sample</span>
          </button>
          <button
            onClick={() => setShowCustomizer((s) => !s)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
              showCustomizer ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
            }`}
          >
            <Palette size={15} />
            <span className="hidden sm:inline">Customize</span>
          </button>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
              showRecommendations ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
            }`}
            title="AI Recommendations"
          >
            <Lightbulb size={15} />
            <span className="hidden sm:inline">Recommendations</span>
          </button>
          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
              showAssistant ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
            }`}
            title="AI Assistant"
          >
            <Brain size={15} />
            <span className="hidden sm:inline">Assistant</span>
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-semibold transition-all ${
              exportDone
                ? 'bg-green-600 text-white'
                : 'bg-violet-600 hover:bg-violet-700 text-white hover:scale-105 active:scale-95'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {exporting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : exportDone ? (
              '✓ Downloaded!'
            ) : (
              <>
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Customizer panel */}
        <AnimatePresence>
          {showCustomizer && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden border-r border-white/[0.07]"
            >
              <div className="w-80 h-full overflow-y-auto bg-[#0d0d14]">
                <div className="flex items-center justify-between p-4 border-b border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <Settings2 size={16} className="text-violet-400" />
                    <span className="font-semibold text-sm">Customizer</span>
                  </div>
                  <button onClick={() => setShowCustomizer(false)} className="text-white/40 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <Customizer data={data} updateData={updateData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview area */}
        <div className="flex-1 overflow-auto bg-[#111118] p-4 md:p-8 flex items-start justify-center">
          <DevicePreviewFrame viewport={viewport}>
            <TemplateRenderer data={data} />
          </DevicePreviewFrame>
        </div>

        {/* Recommendations sidebar (right) */}
        <AnimatePresence>
          {showRecommendations && data && userContext && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden border-l border-white/[0.07]"
            >
              <div className="w-[360px] h-full overflow-y-auto bg-[#0d0d14]">
                <div className="flex items-center justify-between p-4 border-b border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-violet-400" />
                    <span className="font-semibold text-sm">Recommendations</span>
                  </div>
                  <button onClick={() => setShowRecommendations(false)} className="text-white/40 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <RecommendationsPanel
                  portfolioData={data}
                  userContext={userContext}
                  position="inline"
                  onAction={handleRecommendationAction}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export success toast */}
      <AnimatePresence>
        {exportDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2 z-50"
          >
            ✓ Portfolio downloaded! Unzip and open index.html to view.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intelligent Assistant */}
      <AnimatePresence>
        {showAssistant && data && userContext && (
          <IntelligentAssistantWidget
            portfolioData={data}
            userContext={userContext}
            position="bottom-right"
            isOpen={showAssistant}
            onClose={() => setShowAssistant(false)}
          />
        )}
      </AnimatePresence>

      {/* Persistent AI Assistant (Legacy) */}
      <ChatWidget data={data} updateData={updateData} selectedTheme={data.templateId} />
    </div>
  );
}
