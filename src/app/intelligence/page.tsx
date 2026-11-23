'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Shield, Brain, Lightbulb, BarChart2, Settings,
  Download, Trash2, FileText, CheckCircle, AlertCircle,
  ChevronRight, Sparkles, Zap, Target, Layers, Eye,
  RotateCcw, Lock, Unlock, Key, Database, History,
  Share2, Clock, User, Palette, Code2, Award, BookOpen,
  Briefcase, TrendingUp, ExternalLink, RefreshCw
} from 'lucide-react';
import { loadPortfolio } from '@/lib/storage';
import { PortfolioData } from '@/lib/types';
import { TEMPLATES, getTemplate } from '@/lib/templates';
import { getBehaviorTracker } from '@/lib/intelligence/behaviorTracker';
import { createRecommendationEngine } from '@/lib/intelligence/recommendationEngine';
import { createIntelligentAssistant, QUICK_ACTIONS } from '@/lib/intelligence/intelligentAssistant';
import { createUXEvaluationEngine, ABTestingFramework, generateDashboardMetrics, HeuristicEvaluator } from '@/lib/intelligence/uxEvaluation';
import { usePrivacy } from '@/lib/intelligence/privacy';
import { UserContext, Recommendation } from '@/lib/intelligence/types';
import IntelligentAssistantWidget from '@/components/intelligence/IntelligentAssistantWidget';
import RecommendationsPanel from '@/components/intelligence/RecommendationsPanel';
import PrivacyDashboard from '@/components/intelligence/PrivacyDashboard';

const INTELLIGENCE_FEATURES = [
  {
    id: 'profiling',
    title: 'User Profiling',
    description: 'Builds a comprehensive profile from your interests, skills, career goals, and behavior patterns.',
    icon: <User size={24} />,
    color: 'violet',
  },
  {
    id: 'recommendations',
    title: 'Smart Recommendations',
    description: 'AI-powered suggestions for themes, skills, projects, learning resources, and career paths.',
    icon: <Lightbulb size={24} />,
    color: 'blue',
  },
  {
    id: 'assistant',
    title: 'Intelligent Assistant',
    description: 'Context-aware chat assistant that understands your portfolio and provides actionable guidance.',
    icon: <Brain size={24} />,
    color: 'purple',
  },
  {
    id: 'tracking',
    title: 'Behavior Tracking',
    description: 'Privacy-conscious analytics that learn from your interactions to improve personalization.',
    icon: <BarChart2 size={24} />,
    color: 'green',
  },
  {
    id: 'ux-evaluation',
    title: 'UX Evaluation',
    description: 'Heuristic evaluation, A/B testing, and usability metrics to continuously improve the experience.',
    icon: <Target size={24} />,
    color: 'orange',
  },
  {
    id: 'privacy',
    title: 'Privacy & Control',
    description: 'Full data ownership with local storage, granular consent, export, and deletion controls.',
    icon: <Shield size={24} />,
    color: 'red',
  },
];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'recommendations' | 'assistant' | 'ux' | 'privacy'>('overview');
  const [data, setData] = useState<PortfolioData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [uxMetrics, setUxMetrics] = useState<ReturnType<typeof generateDashboardMetrics> | null>(null);
  const tracker = getBehaviorTracker();
  const privacy = usePrivacy();

  useEffect(() => {
    setData(loadPortfolio());
    ABTestingFramework.initializeTests();
  }, []);

  const generateRecommendations = async () => {
    if (!data || isGenerating) return;
    setIsGenerating(true);
    try {
      const userContext = buildUserContext();
      const engine = createRecommendationEngine(data, {
        page: '/intelligence',
        portfolioCompleteness: calculateCompleteness(data),
        currentTemplate: data.templateId,
      });
      const recs = await engine.generateAllRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const runUXEvaluation = async () => {
    if (!data) return;
    const userContext = buildUserContext();
    const engine = createUXEvaluationEngine(userContext.userId || 'anonymous', userContext.sessionId);
    // Simulate some metrics
    engine.recordPageView('/intelligence');
    engine.recordInteraction('/intelligence', 'view');
    engine.recordTaskStart('view_dashboard');
    engine.recordTaskComplete('view_dashboard', true, 5000, 3);
    engine.recordFeatureAdoption('recommendations');
    engine.recordFeatureAdoption('assistant');
    engine.saveMetrics();
    
    const metrics = generateDashboardMetrics(userContext.userId);
    setUxMetrics(metrics);
  };

  const buildUserContext = (): UserContext => ({
    currentPage: '/intelligence',
    sessionId: 'intelligence-session',
    sessionStart: new Date().toISOString(),
    sessionDuration: Date.now() - Date.now(),
    actionsInSession: [],
    device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
    viewport: typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 1920, height: 1080 },
    connection: 'fast',
    prefersReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersDarkMode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
    timeOfDay: (() => { const h = new Date().getHours(); if (h < 12) return 'morning'; if (h < 17) return 'afternoon'; if (h < 22) return 'evening'; return 'night'; })(),
    dayOfWeek: new Date().getDay(),
    isWeekend: [0, 6].includes(new Date().getDay()),
    isNewUser: false,
    isReturningUser: true,
    daysSinceLastVisit: 0,
    profileCompleteness: data ? calculateCompleteness(data) : 0,
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Sparkles size={16} /> },
    { id: 'demo', label: 'Live Demo', icon: <Zap size={16} /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb size={16} /> },
    { id: 'assistant', label: 'AI Assistant', icon: <Brain size={16} /> },
    { id: 'ux', label: 'UX Evaluation', icon: <BarChart2 size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40 h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="flex items-center gap-2 font-bold text-lg ml-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Brain size={12} />
          </div>
          <span className="text-gradient text-sm font-poppins">Intelligence System</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <OverviewTab features={INTELLIGENCE_FEATURES} />}
              {activeTab === 'demo' && <DemoTab data={data} onGenerate={generateRecommendations} isGenerating={isGenerating} recommendations={recommendations} />}
              {activeTab === 'recommendations' && <RecommendationsTab data={data} recommendations={recommendations} isGenerating={isGenerating} onGenerate={generateRecommendations} />}
              {activeTab === 'assistant' && <AssistantTab data={data} />}
              {activeTab === 'ux' && <UxTab uxMetrics={uxMetrics} onRunEvaluation={runUXEvaluation} />}
              {activeTab === 'privacy' && <PrivacyTab onClose={() => setShowPrivacy(false)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Assistant Widget */}
      <AnimatePresence>
        {showAssistant && data && (
          <IntelligentAssistantWidget
            portfolioData={data}
            userContext={buildUserContext()}
            position="bottom-right"
            isOpen={showAssistant}
            onClose={() => setShowAssistant(false)}
          />
        )}
      </AnimatePresence>

      {/* Privacy Dashboard */}
      <AnimatePresence>
        {showPrivacy && (
          <PrivacyDashboard isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab Components ────────────────────────────────────────────────────────

function OverviewTab({ features }: { features: typeof INTELLIGENCE_FEATURES }) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 bg-violet-900/40 border border-violet-500/30 text-violet-300 text-sm px-4 py-2 rounded-full mb-6">
          <Brain size={14} />
          PortCraft Intelligence System
          <Brain size={14} />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight font-poppins">
          Your Portfolio,<br />
          <span className="text-gradient">Intelligently Crafted.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          A comprehensive personalized intelligence system that learns from your behavior,
          understands your goals, and provides actionable recommendations — all while keeping
          your data private and under your control.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-base md:text-lg px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <Brain size={19} />
            Try It Now
          </Link>
          <Link
            href="/resume-import"
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-base md:text-lg px-7 py-4 rounded-xl transition-all hover:scale-105"
          >
            <Lightbulb size={19} />
            Resume → Smart Portfolio
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl md:text-4xl font-black font-poppins text-center mb-4">
          Core Intelligence <span className="text-gradient">Capabilities</span>
        </h2>
        <p className="text-white/50 text-center max-w-2xl mx-auto mb-12">
          Six integrated systems working together to create the most personalized portfolio builder.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/[0.05] transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}-500/20 border border-${feature.color}-500/30 group-hover:border-${feature.color}-500/50 transition-colors`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-black font-poppins text-center mb-8">
          How Intelligence <span className="text-gradient">Works Together</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Profile Building', desc: 'Tracks interests, skills, goals, and behavior to build your unique profile', icon: <User size={24} /> },
            { step: 2, title: 'Pattern Recognition', desc: 'Identifies patterns in your interactions, preferences, and portfolio content', icon: <Brain size={24} /> },
            { step: 3, title: 'Smart Recommendations', desc: 'Generates personalized suggestions for themes, skills, projects, and careers', icon: <Lightbulb size={24} /> },
            { step: 4, title: 'Continuous Learning', desc: 'Adapts based on your feedback, improving suggestions over time', icon: <RotateCcw size={24} /> },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 violet-500/20 border border-violet-500/30`}>
                {item.icon}
              </div>
              <div className="text-violet-400 font-mono text-sm font-bold mb-2">Step {item.step}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoTab({ data, onGenerate, isGenerating, recommendations }: { data: PortfolioData | null; onGenerate: () => void; isGenerating: boolean; recommendations: Recommendation[] }) {
  return (
    <div className="space-y-8">
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-poppins">Live Intelligence Demo</h2>
            <p className="text-white/50">See the intelligence system analyze your portfolio and generate recommendations.</p>
          </div>
          <button
            onClick={onGenerate}
            disabled={isGenerating || !data}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl transition-all"
          >
            {isGenerating ? <RotateCcw size={18} className="animate-spin" /> : <Zap size={18} />}
            {isGenerating ? 'Analyzing...' : 'Generate Recommendations'}
          </button>
        </div>
        {!data && (
          <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
            <p className="text-white/40">No portfolio found. <Link href="/builder" className="text-violet-400 hover:underline">Create one</Link> or <Link href="/resume-import" className="text-violet-400 hover:underline">import your resume</Link>.</p>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-bold font-poppins mb-4">Generated Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 6).map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-pink-400">{rec.type}</span>
                  <span className="text-xs px-2 py-0.5 bg-white/10 rounded">{rec.priority}</span>
                </div>
                <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                <p className="text-white/60 text-sm mb-3">{rec.description}</p>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
                  <span>•</span>
                  <span>Source: {rec.metadata.source}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationsTab({ data, recommendations, isGenerating, onGenerate }: { data: PortfolioData | null; recommendations: Recommendation[]; isGenerating: boolean; onGenerate: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-poppins">Recommendations Engine</h2>
          <p className="text-white/50">Personalized suggestions based on your profile and behavior.</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating || !data}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl transition-all"
        >
          {isGenerating ? 'Generating...' : 'Generate New'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded">{rec.type}</span>
                <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">{rec.priority}</span>
              </div>
              <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
              <p className="text-white/60 text-sm mb-3">{rec.description}</p>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span>{Math.round(rec.confidence * 100)}% confidence</span>
                <span>{rec.metadata.source}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-xl">
            <p className="text-white/40">No recommendations yet. Generate some above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantTab({ data }: { data: PortfolioData | null }) {
  const [showWidget, setShowWidget] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-poppins">Intelligent Assistant</h2>
        <p className="text-white/50">Context-aware AI that understands your portfolio and provides actionable guidance.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Try the Assistant</h3>
            <p className="text-white/50">Ask questions, get portfolio analysis, or request recommendations.</p>
          </div>
          <button
            onClick={() => setShowWidget(!showWidget)}
            className={`px-4 py-2 rounded-xl transition-all ${showWidget ? 'bg-violet-600 text-white' : 'bg-white/[0.05] text-white/70 hover:text-white'}`}
          >
            {showWidget ? 'Hide Assistant' : 'Open Assistant'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(QUICK_ACTIONS).map(([key, action]) => (
            <button
              key={key}
              className="p-4 text-left bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-sm text-white/80"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {showWidget && data && (
        <IntelligentAssistantWidget
          portfolioData={data}
          userContext={{
            currentPage: '/intelligence',
            sessionId: 'assistant-demo',
            sessionStart: new Date().toISOString(),
            sessionDuration: 0,
            actionsInSession: [],
            device: 'desktop',
            viewport: { width: 1920, height: 1080 },
            connection: 'fast',
            prefersReducedMotion: false,
            prefersDarkMode: true,
            timeOfDay: 'afternoon',
            dayOfWeek: new Date().getDay(),
            isWeekend: false,
            isNewUser: false,
            isReturningUser: true,
            daysSinceLastVisit: 0,
            profileCompleteness: calculateCompleteness(data),
          }}
          position="bottom-right"
          isOpen={true}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
}

function UxTab({ uxMetrics, onRunEvaluation }: { uxMetrics: ReturnType<typeof generateDashboardMetrics> | null; onRunEvaluation: () => void }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-poppins">UX Evaluation Framework</h2>
          <p className="text-white/50">Heuristic evaluation, A/B testing, and usability metrics.</p>
        </div>
        <button
          onClick={onRunEvaluation}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all"
        >
          Run Evaluation
        </button>
      </div>

      {uxMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Total Users" value={uxMetrics.overview.totalUsers} icon={<User size={20} />} />
          <MetricCard title="Active Users" value={uxMetrics.overview.activeUsers} icon={<CheckCircle size={20} color="green" />} />
          <MetricCard title="Avg Session" value={`${uxMetrics.overview.avgSessionDuration} min`} icon={<Clock size={20} />} />
          <MetricCard title="Completion Rate" value={`${Math.round(uxMetrics.overview.completionRate * 100)}%`} icon={<Target size={20} />} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard title="Heuristic Evaluation" desc="Nielsen's 10 heuristics with severity scoring" icon={<Shield size={24} />} />
        <FeatureCard title="A/B Testing" desc="Statistical significance testing with lift calculation" icon={<BarChart2 size={24} />} />
        <FeatureCard title="Usability Testing" desc="Task-based testing with success criteria" icon={<Target size={24} />} />
        <FeatureCard title="Metrics Collection" desc="Engagement, satisfaction, effort, and behavioral metrics" icon={<BarChart2 size={24} />} />
      </div>
    </div>
  );
}

function PrivacyTab({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-poppins">Privacy & Data Control</h2>
        <p className="text-white/50">Complete ownership and transparency over your data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard title="Local-First Storage" desc="All data in your browser's localStorage. No cloud sync." icon={<Database size={24} />} />
        <FeatureCard title="Granular Consent" desc="Control analytics, personalization, AI training independently" icon={<Settings size={24} />} />
        <FeatureCard title="Data Export" desc="Download complete JSON export or transparency report" icon={<Download size={24} />} />
        <FeatureCard title="Selective Deletion" desc="Delete analytics, recommendations, or all data" icon={<Trash2 size={24} />} />
        <FeatureCard title="No Third-Party Sharing" desc="Your data never leaves your browser without consent" icon={<Shield size={24} />} />
        <FeatureCard title="Transparency Reports" desc="Auto-generated markdown reports of all data processing" icon={<FileText size={24} />} />
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
        <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Shield size={20} />
          Privacy by Design
        </h3>
        <ul className="text-green-400/80 space-y-2 list-disc list-inside">
          <li>Zero server-side data collection by default</li>
          <li>All AI processing happens locally in your browser</li>
          <li>Third-party APIs (GitHub, LeetCode) called directly from browser</li>
          <li>No cookies, tracking pixels, or fingerprinting</li>
          <li>Open source — audit the code yourself</li>
        </ul>
      </div>

      <PrivacyDashboard isOpen={true} onClose={onClose} />
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-violet-500/30 transition-all">
      <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-white/50 text-sm">{desc}</p>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/50">{title}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Helper ────────────────────────────────────────────────────────────────

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