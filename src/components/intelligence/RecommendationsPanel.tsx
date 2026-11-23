'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, ThumbsUp, ThumbsDown,
  Palette, Code2, Award, BookOpen, Briefcase, TrendingUp,
  Settings, Target, Lightbulb, Sparkles, ExternalLink,
  RefreshCw, Eye, Check, Clock, Star, Brain, Zap,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { useBehaviorTracker, calculatePortfolioCompleteness } from '@/lib/intelligence';
import { createRecommendationEngine } from '@/lib/intelligence/recommendationEngine';
import { Recommendation, RecommendationType, PortfolioData, UserContext } from '@/lib/intelligence/types';
import { getRecommendations, addRecommendationFeedback, dismissRecommendation } from '@/lib/intelligence/storage';

interface Props {
  portfolioData: PortfolioData | null;
  userContext: UserContext;
  position?: 'sidebar' | 'modal' | 'inline';
  maxRecommendations?: number;
  onAction?: (action: { type: string; label: string; payload: Record<string, any> }) => void;
}

const TYPE_CONFIG: Record<RecommendationType, { icon: React.ReactNode; color: string; label: string }> = {
  theme: { icon: <Palette size={16} />, color: 'text-pink-400', label: 'Theme' },
  skill: { icon: <Code2 size={16} />, color: 'text-blue-400', label: 'Skill' },
  project: { icon: <Award size={16} />, color: 'text-yellow-400', label: 'Project' },
  'learning-resource': { icon: <BookOpen size={16} />, color: 'text-green-400', label: 'Learn' },
  'career-path': { icon: <Briefcase size={16} />, color: 'text-orange-400', label: 'Career' },
  'portfolio-improvement': { icon: <TrendingUp size={16} />, color: 'text-emerald-400', label: 'Improve' },
  'template-customization': { icon: <Settings size={16} />, color: 'text-cyan-400', label: 'Customize' },
  'section-completion': { icon: <Target size={16} />, color: 'text-red-400', label: 'Complete' },
};

const PRIORITY_COLORS = {
  high: 'bg-red-500/20 border-red-500/30 text-red-400',
  medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  low: 'bg-white/5 border-white/10 text-white/60',
};

export default function RecommendationsPanel({
  portfolioData,
  userContext,
  position = 'sidebar',
  maxRecommendations = 10,
  onAction,
}: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<RecommendationType | 'all'>('all');
  const tracker = useBehaviorTracker();

  // Fingerprint to track changes to portfolio and trigger real-time refreshes
  const dataFingerprint = portfolioData ? JSON.stringify({
    templateId: portfolioData.templateId,
    skillsCount: portfolioData.skills?.length || 0,
    skills: portfolioData.skills?.map(s => `${s.name}:${s.level}`),
    projectsCount: portfolioData.projects?.length || 0,
    projects: portfolioData.projects?.map(p => p.title),
    experienceCount: portfolioData.experience?.length || 0,
    role: portfolioData.personal?.title || '',
  }) : '';

  // Generate recommendations
  const generate = useCallback(async () => {
    if (!portfolioData || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const engine = createRecommendationEngine(portfolioData, {
        page: userContext.currentPage,
        portfolioCompleteness: calculatePortfolioCompleteness(portfolioData),
        currentTemplate: portfolioData.templateId,
      });
      
      const newRecs = await engine.generateAllRecommendations();
      setRecommendations(newRecs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [portfolioData, userContext, isGenerating]);

  // Load recommendations and refresh whenever profile data, skills, goals or preferences change
  useEffect(() => {
    if (portfolioData) {
      generate();
    } else {
      const existing = getRecommendations()
        .filter(r => !r.dismissedAt && !r.clickedAt)
        .slice(0, maxRecommendations);
      setRecommendations(existing);
    }
  }, [dataFingerprint]);

  // Filter recommendations
  const filteredRecs = filterType === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === filterType);

  // Handle feedback
  const handleFeedback = async (recId: string, feedback: 'helpful' | 'not-helpful' | 'irrelevant' | 'already-done') => {
    addRecommendationFeedback(recId, { rating: feedback, timestamp: new Date().toISOString() });
    tracker.trackRecommendationFeedback(recId, feedback);
    
    // Remove dismissed or unhelpful recommendations immediately
    if (feedback !== 'helpful') {
      setRecommendations(prev => prev.filter(r => r.id !== recId));
    } else {
      // Re-generate recommendations taking into account learned preferences
      generate();
    }
  };

  // Handle action
  const handleAction = (action: { type: string; label: string; payload: Record<string, any> } | undefined) => {
    if (!action) return;
    
    tracker.trackRecommendationClick(
      action.payload.recommendationId || 'unknown',
      action.payload.recommendationType || 'unknown'
    );
    
    onAction?.(action);
  };

  // Toggle expand
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Dismiss
  const dismiss = (id: string, type: string = 'unknown') => {
    dismissRecommendation(id);
    setRecommendations(prev => prev.filter(r => r.id !== id));
    tracker.trackRecommendationDismiss(id, type);
  };

  if (position === 'modal') {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Personalized Recommendations</h2>
                  <p className="text-xs text-white/50">{filteredRecs.length} suggestions for you</p>
                </div>
              </div>
              <button
                onClick={() => onAction?.({ type: 'close', label: 'Close', payload: {} })}
                className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <RecommendationsContent
              recommendations={filteredRecs}
              onFeedback={handleFeedback}
              onAction={handleAction}
              onDismiss={dismiss}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              isGenerating={isGenerating}
              onGenerate={generate}
            />
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Sidebar or inline
  return (
    <div className={`bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden ${position === 'sidebar' ? 'h-full flex flex-col' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Recommendations</h3>
            <p className="text-xs text-white/50">{filteredRecs.length} for you</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RecommendationType | 'all')}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Types</option>
            {Object.entries(TYPE_CONFIG).map(([type, config]) => (
              <option key={type} value={type}>{config.label}</option>
            ))}
          </select>
          <button
            onClick={generate}
            disabled={isGenerating}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
            title="Refresh recommendations"
          >
            <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      <RecommendationsContent
        recommendations={filteredRecs}
        onFeedback={handleFeedback}
        onAction={handleAction}
        onDismiss={dismiss}
        expandedIds={expandedIds}
        onToggleExpand={toggleExpand}
        isGenerating={isGenerating}
        onGenerate={generate}
      />
    </div>
  );
}

function RecommendationsContent({
  recommendations,
  onFeedback,
  onAction,
  onDismiss,
  expandedIds,
  onToggleExpand,
  isGenerating,
  onGenerate,
}: {
  recommendations: Recommendation[];
  onFeedback: (recId: string, feedback: 'helpful' | 'not-helpful' | 'irrelevant' | 'already-done') => void;
  onAction: (action: { type: string; label: string; payload: Record<string, any> } | undefined) => void;
  onDismiss: (id: string, type?: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  if (recommendations.length === 0 && !isGenerating) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
        <Lightbulb size={48} className="text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No recommendations yet</p>
        <button
          onClick={onGenerate}
          className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors"
        >
          Generate Recommendations
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="p-8 text-center">
        <RefreshCw size={48} className="text-violet-400 animate-spin mx-auto mb-4" />
        <p className="text-white/50">Generating personalized recommendations...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <AnimatePresence>
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative ${PRIORITY_COLORS[rec.priority]} rounded-xl p-4`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_CONFIG[rec.type].color}`}>
                {TYPE_CONFIG[rec.type].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{rec.title}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${PRIORITY_COLORS[rec.priority].replace('bg-', '').replace('border-', '')}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/40">{Math.round(rec.confidence * 100)}%</span>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-3">{rec.description}</p>
                
                {/* Expandable details */}
                <AnimatePresence>
                  {expandedIds.has(rec.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/10 space-y-2"
                    >
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span className="px-2 py-0.5 bg-white/[0.05] rounded">{TYPE_CONFIG[rec.type].label}</span>
                        <span className="px-2 py-0.5 bg-white/[0.05] rounded">Source: {rec.metadata.source}</span>
                      </div>
                      <p className="text-white/60 text-sm">{rec.reasoning}</p>
                      {rec.metadata.factors.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-white/50">Why this recommendation:</p>
                          {rec.metadata.factors.map((factor, i) => (
                            <div key={i} className="text-[11px] text-white/50 bg-white/[0.03] px-2 py-1 rounded">
                              {factor.explanation}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/10">
                  {rec.action && (
                    <button
                      onClick={() => onAction(rec.action)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg transition-all"
                    >
                      <ExternalLink size={12} />
                      {rec.action.label}
                    </button>
                  )}
                  <button
                    onClick={() => onFeedback(rec.id, 'helpful')}
                    className="flex items-center gap-1 px-2 py-1.5 text-white/50 hover:text-green-400 rounded-lg transition-colors"
                    title="Helpful"
                  >
                    <ThumbsUp size={12} />
                  </button>
                  <button
                    onClick={() => onFeedback(rec.id, 'not-helpful')}
                    className="flex items-center gap-1 px-2 py-1.5 text-white/50 hover:text-red-400 rounded-lg transition-colors"
                    title="Not helpful"
                  >
                    <ThumbsDown size={12} />
                  </button>
                  <button
                    onClick={() => onFeedback(rec.id, 'irrelevant')}
                    className="flex items-center gap-1 px-2 py-1.5 text-white/50 hover:text-amber-400 rounded-lg transition-colors"
                    title="Irrelevant"
                  >
                    <Eye size={12} className="line-through" />
                  </button>
                  <button
                    onClick={() => onDismiss(rec.id, rec.type)}
                    className="flex items-center gap-1 px-2 py-1.5 text-white/50 hover:text-red-400 rounded-lg transition-colors ml-auto"
                    title="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
                
                {/* Expand toggle */}
                <button
                  onClick={() => onToggleExpand(rec.id)}
                  className="absolute top-3 right-3 p-1 text-white/40 hover:text-white rounded transition-colors"
                >
                  {expandedIds.has(rec.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {recommendations.length === 0 && (
        <div className="text-center py-8 text-white/40">
          <p>No recommendations match the current filter</p>
        </div>
      )}
    </div>
  );
}