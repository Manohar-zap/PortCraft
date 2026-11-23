'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ArrowRight, Check, Brain, Lightbulb } from 'lucide-react';
import { loadPortfolio, savePortfolio } from '@/lib/storage';
import { PortfolioData, generateId } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';
import { getSamplePortfolio } from '@/lib/sampleProfiles';
import ChatWidget from '@/components/ai/ChatWidget';
import IntelligentAssistantWidget from '@/components/intelligence/IntelligentAssistantWidget';
import RecommendationsPanel from '@/components/intelligence/RecommendationsPanel';
import { UserContext } from '@/lib/intelligence/types';
import { initializeBehaviorTracking } from '@/lib/intelligence/behaviorTracker';

// Step components
import StepPersonal from '@/components/builder/StepPersonal';
import StepEducation from '@/components/builder/StepEducation';
import StepExperience from '@/components/builder/StepExperience';
import StepProjects from '@/components/builder/StepProjects';
import StepTemplate from '@/components/builder/StepTemplate';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'education', label: 'Education & Skills', icon: '🎓' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'projects', label: 'Projects & Awards', icon: '🚀' },
  { id: 'template', label: 'Choose Template', icon: '🎨' },
];

function BuilderContent() {
  const searchParams = useSearchParams();
  const preselectedTemplate = searchParams.get('template');
  const loadSampleParam = searchParams.get('loadSample');

  const [step, setStep] = useState(0);
  const [data, setData] = useState<PortfolioData>(() => {
    if (typeof window !== 'undefined') {
      const loaded = loadPortfolio();
      const targetTpl = preselectedTemplate || loaded.templateId || 'spider-verse';
      if (loadSampleParam === 'true') {
        return getSamplePortfolio(targetTpl);
      }
      if (preselectedTemplate) {
        const tpl = TEMPLATES.find((t) => t.id === preselectedTemplate);
        return {
          ...loaded,
          templateId: preselectedTemplate,
          theme: { ...loaded.theme, ...(tpl?.defaultTheme ?? {}) },
        };
      }
      return loaded;
    }
    return loadPortfolio();
  });

  const [showAssistant, setShowAssistant] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Initialize behavior tracking
  useEffect(() => {
    initializeBehaviorTracking();
  }, []);

  // Auto-save on data change
  useEffect(() => {
    savePortfolio(data);
  }, [data]);

  // Build user context for intelligence
  const userContext = {
    currentPage: '/builder',
    currentStep: STEPS[step]?.id,
    portfolioData: data,
    templateId: data.templateId,
    sessionId: 'builder-session',
    sessionStart: new Date().toISOString(),
    sessionDuration: 0,
    actionsInSession: [],
    device: (typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : typeof window !== 'undefined' && window.innerWidth < 1024 ? 'tablet' : 'desktop') as 'mobile' | 'tablet' | 'desktop',
    viewport: typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 1920, height: 1080 },
    connection: 'fast' as 'fast' | 'slow' | 'offline',
    prefersReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersDarkMode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
    timeOfDay: (() => { const h = new Date().getHours(); if (h < 12) return 'morning'; if (h < 17) return 'afternoon'; if (h < 22) return 'evening'; return 'night'; })() as 'morning' | 'afternoon' | 'evening' | 'night',
    dayOfWeek: new Date().getDay(),
    isWeekend: [0, 6].includes(new Date().getDay()),
    isNewUser: false,
    isReturningUser: true,
    daysSinceLastVisit: 0,
    profileCompleteness: calculateCompleteness(data),
  };

  const updateData = (partial: Partial<PortfolioData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = () => {
    if (step === 0) {
      return !!(data.personal.firstName && data.personal.email);
    }
    if (step === 4) {
      return !!data.templateId;
    }
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1 && canProceed()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

function calculateCompleteness(portfolio: PortfolioData): number {
  const { personal, education, experience, skills, projects, achievements } = portfolio;
  let score = 0;

  if (personal.firstName && personal.lastName && personal.email && personal.title) score += 20;
  else if (personal.firstName || personal.lastName) score += 10;

  if (education.length > 0) score += 15;
  if (experience.length > 0) score += 20;
  if (skills.length >= 8) score += 15;
  else if (skills.length > 0) score += Math.round(15 * skills.length / 8);
  if (projects.length >= 4) score += 20;
  else if (projects.length > 0) score += Math.round(20 * projects.length / 4);
  if (achievements.length >= 3) score += 10;
  else if (achievements.length > 0) score += Math.round(10 * achievements.length / 3);

  return Math.min(score, 100);
}

return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40 h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="flex items-center gap-2 font-bold text-lg ml-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <span className="text-gradient text-sm font-poppins">PortCraft Builder</span>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/connect"
            className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 px-2.5 py-1.5 rounded-lg transition-all"
            title="Import data from GitHub, LeetCode, Codeforces"
          >
            <Sparkles size={12} className="text-violet-400" />
            <span className="hidden sm:inline">Connect Profiles</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              const sample = getSamplePortfolio(data.templateId || 'spider-verse');
              setData(sample);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/[0.06] hover:bg-violet-600/30 text-white/90 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-violet-500/40 transition-all"
            title="Populate builder with realistic sample data for testing"
          >
            <Sparkles size={12} className="text-violet-400" />
            <span className="hidden sm:inline">Load Sample</span>
          </button>
          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
              showAssistant ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
            }`}
            title="AI Assistant"
          >
            <Brain size={12} className="text-violet-400" />
            <span className="hidden sm:inline">Assistant</span>
          </button>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
              showRecommendations ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
            }`}
            title="Smart Recommendations"
          >
            <Lightbulb size={12} className="text-yellow-400" />
            <span className="hidden sm:inline">Recommend</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="hidden sm:inline">Auto-saved</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-white/5 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 md:gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    i === step
                      ? 'bg-violet-600 text-white'
                      : i < step
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 cursor-pointer'
                      : 'bg-white/[0.03] text-white/30 cursor-not-allowed'
                  }`}
                >
                  {i < step ? <Check size={12} /> : <span>{s.icon}</span>}
                  <span className="hidden md:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 md:w-8 ${i < step ? 'bg-green-600/40' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-28 pb-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <StepPersonal data={data} updateData={updateData} />}
              {step === 1 && <StepEducation data={data} updateData={updateData} />}
              {step === 2 && <StepExperience data={data} updateData={updateData} />}
              {step === 3 && <StepProjects data={data} updateData={updateData} />}
              {step === 4 && <StepTemplate data={data} updateData={updateData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-t border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  i === step ? 'w-6 h-2 bg-violet-500' : i < step ? 'w-2 h-2 bg-green-500' : 'w-2 h-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <Link
              href="/preview"
              className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${!data.templateId ? 'opacity-40 pointer-events-none' : ''}`}
            >
              Preview Portfolio
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Persistent AI Assistant */}
      <ChatWidget data={data} updateData={updateData} selectedTheme={data.templateId} />

      {/* Intelligence Assistant Widget */}
      <IntelligentAssistantWidget
        portfolioData={data}
        userContext={userContext}
        position="bottom-right"
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
      />

      {/* Recommendations Panel */}
      <RecommendationsPanel
        portfolioData={data}
        userContext={userContext}
        position="sidebar"
        onAction={(action) => {
          if (action.type === 'navigate' && action.payload.page) {
            window.location.href = action.payload.page;
          }
        }}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-violet-400 animate-pulse">Loading builder...</div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
