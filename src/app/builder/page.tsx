'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ArrowRight, Check, Brain, Lightbulb, Home, Eye, FileText } from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import { loadPortfolio, savePortfolio } from '@/lib/storage';
import { PortfolioData, generateId, DEFAULT_PORTFOLIO } from '@/lib/types';
import { TEMPLATES, getTemplate } from '@/lib/templates';
import { getSamplePortfolio } from '@/lib/sampleProfiles';
import ChatWidget from '@/components/ai/ChatWidget';
import IntelligentAssistantWidget from '@/components/intelligence/IntelligentAssistantWidget';
import RecommendationsPanel from '@/components/intelligence/RecommendationsPanel';
import { initializeBehaviorTracking, getOrBuildUserContext } from '@/lib/intelligence';

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
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize behavior tracking, mount flag, and load portfolio from localStorage
  useEffect(() => {
    setMounted(true);
    initializeBehaviorTracking();

    const loaded = loadPortfolio();
    const targetTpl = preselectedTemplate || loaded.templateId || 'spider-verse';
    if (loadSampleParam === 'true') {
      setData(getSamplePortfolio(targetTpl));
    } else if (preselectedTemplate) {
      const tpl = TEMPLATES.find((t) => t.id === preselectedTemplate);
      setData({
        ...loaded,
        templateId: preselectedTemplate,
        theme: { ...loaded.theme, ...(tpl?.defaultTheme ?? {}) },
      });
    } else {
      setData(loaded);
    }
  }, [preselectedTemplate, loadSampleParam]);

  // Auto-save on data change only after mounted
  useEffect(() => {
    if (!mounted) return;
    savePortfolio(data);
  }, [data, mounted]);

  // Derived user context for intelligence (client-side only)
  const userContext = useMemo(() => {
    if (!mounted) return null;
    return getOrBuildUserContext('/builder', data, {
      currentStep: STEPS[step]?.id,
    });
  }, [mounted, data, step]);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-white/40">Loading PortCraft Builder...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <AppHeader
        currentPath="/builder"
        pageTitle="Builder"
        rightActions={
          <>
            <Link
              href="/preview"
              className="hidden xs:flex items-center gap-1.5 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-all"
              title="Preview portfolio with current data"
            >
              <Eye size={12} className="text-emerald-400" />
              <span className="hidden sm:inline">Preview</span>
            </Link>
            <Link
              href="/connect"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 px-2.5 py-1.5 rounded-lg transition-all"
              title="Import data from GitHub, LeetCode, Codeforces"
            >
              <Sparkles size={12} className="text-violet-400" />
              <span>Connect</span>
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
              <span className="hidden sm:inline">Sample</span>
            </button>
            <button
              onClick={() => setShowAssistant(!showAssistant)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                showAssistant ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
              }`}
              title="AI Assistant"
            >
              <Brain size={12} className="text-violet-400" />
              <span className="hidden sm:inline">AI</span>
            </button>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                showRecommendations ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'
              }`}
              title="Smart Recommendations"
            >
              <Lightbulb size={12} className="text-yellow-400" />
              <span className="hidden sm:inline">Tips</span>
            </button>
          </>
        }
      />

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
          {step === 0 ? (
            <Link
              href="/"
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] text-white/80 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-white/5"
            >
              <Home size={16} />
              Home
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

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
      {userContext && (
        <IntelligentAssistantWidget
          portfolioData={data}
          userContext={userContext}
          position="bottom-right"
          isOpen={showAssistant}
          onClose={() => setShowAssistant(false)}
        />
      )}

      {/* Recommendations Panel */}
      {showRecommendations && userContext && (
        <RecommendationsPanel
          portfolioData={data}
          userContext={userContext}
          position="modal"
          onAction={(action) => {
            if (action.type === 'close') {
              setShowRecommendations(false);
            } else if (action.type === 'apply-template' && action.payload.templateId) {
              const targetTpl = getTemplate(action.payload.templateId);
              updateData({
                templateId: targetTpl.id,
                theme: { ...data.theme, ...targetTpl.defaultTheme },
              });
              setShowRecommendations(false);
            } else if (action.type === 'add-skill') {
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
              setStep(1); // Jump to Education & Skills step
              setShowRecommendations(false);
            } else if (action.type === 'create-project') {
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
              setStep(3); // Jump to Projects step
              setShowRecommendations(false);
            } else if (action.type === 'open-resource') {
              if (action.payload.url) {
                window.open(action.payload.url, '_blank');
              }
            } else if (action.type === 'navigate') {
              if (action.payload.step) {
                const stepMap: Record<string, number> = { personal: 0, education: 1, skills: 1, experience: 2, projects: 3, template: 4 };
                if (stepMap[action.payload.step] !== undefined) {
                  setStep(stepMap[action.payload.step]);
                  setShowRecommendations(false);
                  return;
                }
              }
              if (action.payload.page && action.payload.page !== '/builder') {
                window.location.href = action.payload.page;
              }
            } else if (action.type === 'complete-section') {
              const stepMap: Record<string, number> = { personal: 0, education: 1, skills: 1, experience: 2, projects: 3, template: 4 };
              if (action.payload.section && stepMap[action.payload.section] !== undefined) {
                setStep(stepMap[action.payload.section]);
                setShowRecommendations(false);
              }
            } else {
              // Graceful fallback for any other action
              console.log('Action handled:', action);
              setShowRecommendations(false);
            }
          }}
        />
      )}
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
