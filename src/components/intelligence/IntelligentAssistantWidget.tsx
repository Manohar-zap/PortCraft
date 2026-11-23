'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Sparkles, Loader2, ChevronUp, ChevronDown,
  Lightbulb, BookOpen, Zap, Target, TrendingUp, HelpCircle,
  Copy, ThumbsUp, ThumbsDown, Flag, MessageSquare, Bot,
  Settings, Download, Shield, Eye, Palette, Code2, Briefcase,
  GraduationCap, Award, Star, Menu, Link2, ExternalLink
} from 'lucide-react';
import { useBehaviorTracker } from '@/lib/intelligence/behaviorTracker';
import { createIntelligentAssistant, QUICK_ACTIONS } from '@/lib/intelligence/intelligentAssistant';
import { AssistantMessage, AssistantAction, UserContext } from '@/lib/intelligence/types';
import { PortfolioData } from '@/lib/types';

interface Props {
  portfolioData: PortfolioData | null;
  userContext: UserContext;
  isOpen?: boolean;
  onClose?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'sidebar-right' | 'sidebar-left';
}

export default function IntelligentAssistantWidget({
  portfolioData,
  userContext,
  isOpen: controlledIsOpen,
  onClose,
  position = 'bottom-right',
}: Props) {
  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tracker = useBehaviorTracker();
  const assistantRef = useRef<ReturnType<typeof createIntelligentAssistant> | null>(null);

  // Initialize assistant
  useEffect(() => {
    if (!assistantRef.current) {
      assistantRef.current = createIntelligentAssistant(portfolioData, userContext);
      
      // Subscribe to new messages
      const unsubscribe = assistantRef.current.onMessage((message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });
      
      return () => unsubscribe();
    } else {
      assistantRef.current.updateContext(portfolioData, userContext);
    }
  }, [portfolioData, userContext]);

  // Sync with assistant history
  useEffect(() => {
    if (assistantRef.current) {
      const history = assistantRef.current.getConversationHistory();
      setMessages(history);
    }
  }, []);

  // Handle controlled open state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Send message
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const message = inputValue.trim();
    if (!message || isProcessing) return;

    setInputValue('');
    setIsProcessing(true);
    setShowQuickActions(false);

    tracker.trackAIChat(message.length, 0);

    try {
      const response = await assistantRef.current?.processMessage(message);
      if (response) {
        tracker.trackAIChat(message.length, response.content.length);
      }
    } catch (error) {
      console.error('Assistant error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick action
  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSend();
  };

  // Handle recommendation feedback
  const handleFeedback = async (recId: string, feedback: 'helpful' | 'not-helpful' | 'irrelevant' | 'already-done') => {
    await assistantRef.current?.provideFeedback(recId, feedback);
    tracker.trackRecommendationFeedback(recId, feedback);
  };

  // Handle action
  const handleAction = (action: any) => {
    switch (action.type) {
      case 'navigate':
        if (action.payload.page) {
          window.location.href = action.payload.page;
        }
        break;
      case 'open-modal':
        // Would trigger modal
        console.log('Open modal:', action.payload);
        break;
      case 'apply':
        console.log('Apply:', action.payload);
        break;
      case 'create':
        console.log('Create:', action.payload);
        break;
      case 'show':
        console.log('Show:', action.payload);
        break;
      case 'explain':
        handleQuickAction(`Explain more about ${action.payload.topic || 'this'}`);
        break;
    }
  };

  // Toggle category
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Copy message
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'sidebar-right': 'top-0 right-0 h-full',
    'sidebar-left': 'top-0 left-0 h-full',
  };

  const widgetWidth = position.includes('sidebar') ? 'w-96' : 'w-96 max-w-[calc(100vw-2rem)]';
  const widgetHeight = position.includes('sidebar') ? 'h-full' : 'h-[600px] max-h-[calc(100vh-8rem)]';

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setIsOpen(true)}
            className={`fixed z-50 ${positionClasses[position]} p-3 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all`}
            aria-label="Open AI Assistant"
          >
            <Bot size={24} className="animate-pulse" />
            <span className="sr-only">Open AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Assistant Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 ${positionClasses[position]} ${widgetWidth} ${widgetHeight} bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">PortCraft AI</h3>
                  <p className="text-xs text-white/50">Your portfolio intelligence assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  title={showQuickActions ? 'Hide quick actions' : 'Show quick actions'}
                >
                  {showQuickActions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button
                  onClick={() => { setIsOpen(false); onClose?.(); }}
                  className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-violet-600' : 'bg-gradient-to-br from-violet-600 to-purple-700'}`}>
                      {message.role === 'user' ? (
                        <MessageSquare size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`bg-white/[0.03] border border-white/5 rounded-2xl p-4 ${message.role === 'user' ? 'bg-violet-900/30 border-violet-500/20' : ''}`}>
                        {message.type === 'recommendation' && message.metadata?.recommendations && (
                          <RecommendationList
                            recommendations={message.metadata.recommendations}
                            onFeedback={handleFeedback}
                            onAction={handleAction}
                          />
                        )}
                        {message.type === 'action' && message.metadata?.actions && (
                          <ActionButtons actions={message.metadata.actions} onAction={handleAction} />
                        )}
                        <div className={`whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-white/90'}`}>
                          {message.content}
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleCopy(message.content)}
                            className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={12} />
                            Copy
                          </button>
                          {message.role === 'assistant' && (
                            <>
                              <button
                                onClick={() => handleFeedback(message.id!, 'helpful')}
                                className="text-xs text-white/40 hover:text-green-400 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                                title="Helpful"
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id!, 'not-helpful')}
                                className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-white/30 mt-1 px-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <Loader2 size={16} className="animate-spin text-violet-400" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {showQuickActions && !isProcessing && messages.length < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-4 border-t border-white/10 bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-violet-400" />
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Quick Actions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(QUICK_ACTIONS).map(([key, action]) => (
                      <button
                        key={key}
                        onClick={() => handleQuickAction(action)}
                        className="p-3 text-left bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-sm text-white/80"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything about your portfolio..."
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 resize-none min-h-[44px] max-h-32"
                  disabled={isProcessing}
                  rows={1}
                />
                <button
                  type="submit"
                  onClick={handleSend}
                  disabled={isProcessing || !inputValue.trim()}
                  className="p-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center"
                  aria-label="Send message"
                >
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                Press Enter to send · Shift+Enter for new line
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Recommendation List Component ────────────────────────────────────────

interface RecommendationListProps {
  recommendations: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    confidence: number;
    priority: string;
    action?: { type: string; label: string; payload: Record<string, any> };
  }>;
  onFeedback: (recId: string, feedback: 'helpful' | 'not-helpful' | 'irrelevant' | 'already-done') => void;
  onAction: (action: { type: string; label: string; payload: Record<string, any> }) => void;
}

function RecommendationList({ recommendations, onFeedback, onAction }: RecommendationListProps) {
  const typeIcons: Record<string, React.ReactNode> = {
    theme: <Palette size={14} className="text-pink-400" />,
    skill: <Code2 size={14} className="text-blue-400" />,
    project: <Award size={14} className="text-yellow-400" />,
    'learning-resource': <BookOpen size={14} className="text-green-400" />,
    'career-path': <Briefcase size={14} className="text-orange-400" />,
    'portfolio-improvement': <TrendingUp size={14} className="text-emerald-400" />,
    'template-customization': <Settings size={14} className="text-cyan-400" />,
    'section-completion': <Target size={14} className="text-red-400" />,
  };

  const priorityColors: Record<string, string> = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-white/50',
  };

  return (
    <div className="space-y-3 mt-2">
      {recommendations.slice(0, 3).map((rec) => (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-xl p-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
              {typeIcons[rec.type] || <Lightbulb size={14} className="text-violet-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white text-sm">{rec.title}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityColors[rec.priority]}`}>
                  {rec.priority.toUpperCase()}
                </span>
                <span className="text-[10px] text-white/40">•</span>
                <span className="text-[10px] text-white/40">{Math.round(rec.confidence * 100)}%</span>
              </div>
              <p className="text-white/60 text-sm mb-2">{rec.description}</p>
              <div className="flex flex-wrap gap-2">
                {rec.action && (
                  <button
                    onClick={() => onAction(rec.action!)}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 transition-colors"
                  >
                    <ExternalLink size={10} />
                    {rec.action.label}
                  </button>
                )}
                <button
                  onClick={() => onFeedback(rec.id, 'helpful')}
                  className="text-[10px] text-white/40 hover:text-green-400 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                  title="Helpful"
                >
                  <ThumbsUp size={10} />
                </button>
                <button
                  onClick={() => onFeedback(rec.id, 'not-helpful')}
                  className="text-[10px] text-white/40 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded transition-colors"
                  title="Not helpful"
                >
                  <ThumbsDown size={10} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      {recommendations.length > 3 && (
        <p className="text-xs text-white/40 text-center">+ {recommendations.length - 3} more recommendations</p>
      )}
    </div>
  );
}

// ─── Action Buttons Component ────────────────────────────────────────────

interface ActionButtonsProps {
  actions: AssistantAction[];
  onAction: (action: AssistantAction) => void;
}

function ActionButtons({ actions, onAction }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {actions.map((action) => (
        <button
          key={action.type + action.label}
          onClick={() => onAction(action)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            action.requiresConfirmation
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
              : 'bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30'
          }`}
        >
          {action.requiresConfirmation && <HelpCircle size={10} />}
          {action.label}
        </button>
      ))}
    </div>
  );
}