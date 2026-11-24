'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, Check, Ban, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import type { PortfolioData } from '@/lib/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  actions?: ProposedAction[];
}

interface ProposedAction {
  type: string;
  description: string;
  currentValue?: string;
  proposedValue?: string;
  field?: string;
}

interface Props {
  data: PortfolioData;
  updateData: (patch: Partial<PortfolioData>) => void;
  selectedTheme?: string;
}

export default function ChatWidget({ data, updateData, selectedTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm PortCraft AI. I can help you improve your bio, rewrite project descriptions, suggest themes, and analyze your portfolio. What would you like to work on?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check AI availability
  useEffect(() => {
    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', portfolioContext: {} }),
    }).then(r => {
      if (r.status === 503) setAiAvailable(false);
      else setAiAvailable(true);
    }).catch(() => setAiAvailable(false));
  }, []);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open, minimized]);

  const handleSend = async (overridePrompt?: string | React.SyntheticEvent) => {
    const userMessage = (typeof overridePrompt === 'string' ? overridePrompt : input).trim();
    if (!userMessage || loading) return;
    setInput('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: history.slice(0, -1),
          portfolioContext: {
            personal: data.personal,
            skills: data.skills.map(s => s.name),
            projects: data.projects.map(p => ({ id: p.id, title: p.title, description: p.description })),
            education: data.education,
            templateId: data.templateId,
          },
          selectedTheme: selectedTheme || data.templateId,
        }),
      });

      const result = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.message || 'I encountered an issue. Please try again.',
        actions: result.actions || [],
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.',
      }]);
    }

    setLoading(false);
  };

  const applyAction = (action: ProposedAction, actionKey?: string) => {
    if (action.type === 'update_bio' && action.proposedValue) {
      updateData({ personal: { ...data.personal, bio: action.proposedValue } });
    } else if (action.type === 'update_headline' && action.proposedValue) {
      updateData({ personal: { ...data.personal, title: action.proposedValue } });
    } else if (action.type === 'update_project' && action.field && action.proposedValue) {
      const updatedProjects = data.projects.map(p =>
        p.id === action.field ? { ...p, description: action.proposedValue! } : p
      );
      updateData({ projects: updatedProjects });
    } else if (action.type === 'switch_theme' && (action.proposedValue || action.field)) {
      const targetTheme = action.proposedValue || action.field;
      if (targetTheme) {
        updateData({ templateId: targetTheme });
      }
    } else if (action.type === 'add_skill' && action.proposedValue) {
      const exists = data.skills.some(s => s.name.toLowerCase() === action.proposedValue!.toLowerCase());
      if (!exists) {
        updateData({
          skills: [
            ...data.skills,
            { id: `skill-${Date.now()}`, name: action.proposedValue, level: 3, category: 'Technical' }
          ]
        });
      }
    }
    if (actionKey) {
      setAppliedActions(prev => ({ ...prev, [actionKey]: true }));
    }
  };

  if (aiAvailable === false) return null;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 rounded-full shadow-2xl shadow-violet-500/40 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-[#0d0d14] border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            style={{ maxHeight: minimized ? '56px' : '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.08] bg-black/30 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Sparkles size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">PortCraft AI</div>
                <div className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Ready to help
                </div>
              </div>
              <button onClick={() => setMinimized(m => !m)} className="text-white/40 hover:text-white p-1 transition-colors">
                {minimized ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white p-1 transition-colors">
                <X size={15} />
              </button>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 0 }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>
                        {msg.role === 'assistant' && (
                          <div className="w-5 h-5 rounded bg-violet-600/40 flex items-center justify-center mb-1.5">
                            <Sparkles size={10} className="text-violet-300" />
                          </div>
                        )}
                        <div className={`text-xs leading-relaxed rounded-xl px-3 py-2 ${
                          msg.role === 'user'
                            ? 'bg-violet-600 text-white rounded-tr-sm'
                            : 'bg-white/[0.06] text-white/80 rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>

                        {/* Proposed Actions */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {msg.actions.map((action, ai) => (
                              <div key={ai} className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-2.5 text-xs">
                                <div className="text-white/60 mb-1.5 font-medium">{action.description}</div>
                                {action.proposedValue && (
                                  <div className="bg-violet-500/10 border border-violet-500/20 rounded p-1.5 text-violet-200 mb-2 text-[11px] leading-relaxed">
                                    {action.proposedValue.substring(0, 120)}
                                    {action.proposedValue.length > 120 ? '...' : ''}
                                  </div>
                                )}
                                <div className="flex gap-1.5">
                                  {appliedActions[`${msg.content}-${ai}`] ? (
                                    <span className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2.5 py-1 rounded text-[10px] font-semibold border border-green-500/30">
                                      <Check size={10} /> Applied
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => applyAction(action, `${msg.content}-${ai}`)}
                                      className="flex items-center gap-1 bg-green-600/30 hover:bg-green-600/50 text-green-300 px-2 py-1 rounded text-[10px] font-semibold transition-all"
                                    >
                                      <Check size={10} /> Apply
                                    </button>
                                  )}
                                  <button className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/50 px-2 py-1 rounded text-[10px] transition-all">
                                    <Ban size={10} /> Skip
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2.5 flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin text-violet-400" />
                        <span className="text-xs text-white/50">PortCraft AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick prompts */}
                {messages.length === 1 && (
                  <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                    {[
                      'Rewrite my bio',
                      'Analyze my portfolio',
                      'Suggest a theme',
                      'Improve my projects',
                    ].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="text-[10px] bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 px-2.5 py-1 rounded-full border border-violet-500/20 transition-all hover:scale-105 active:scale-95"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-white/[0.08] flex gap-2 shrink-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }}
                    placeholder="Ask PortCraft AI..."
                    className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 rounded-lg flex items-center justify-center transition-all"
                  >
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
