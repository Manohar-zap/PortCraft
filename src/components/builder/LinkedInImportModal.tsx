'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Star, Check, ArrowRight, RefreshCw, Upload, FileText } from 'lucide-react';
import { Education, Skill } from '@/lib/types';
import { parseLinkedInText } from '@/lib/integrations/linkedin/parser';
import { parseResumeFile } from '@/lib/resumeParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (extracted: { education: Education[]; skills: Skill[]; mode: 'append' | 'replace' }) => void;
}

const SAMPLE_LINKEDIN_TEXT = `Education
Stanford University
Bachelor of Science - BS, Computer Science
2021 - 2025
Activities and societies: Stanford ACM Student Chapter, Stanford Robotics Club
Coursework: Distributed Systems, Operating Systems, Machine Learning, Data Structures & Algorithms.

San Francisco State University
Associate's degree, Mathematics and Computer Science
2019 - 2021
Dean's Honor List for Academic Excellence.

Top Skills
TypeScript · React.js · Next.js · Node.js · Python · PostgreSQL · Docker · Kubernetes · Amazon Web Services (AWS) · Tailwind CSS · GraphQL · Git · REST APIs · System Design`;

export default function LinkedInImportModal({ isOpen, onClose, onApply }: Props) {
  const [inputText, setInputText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [previewData, setPreviewData] = useState<{ education: Education[]; skills: Skill[] } | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = async (textToParse: string) => {
    if (!textToParse.trim()) {
      setError('Please paste your LinkedIn profile text or load the sample template.');
      return;
    }

    setParsing(true);
    setError(null);

    try {
      const res = await fetch('/api/integrations/linkedin/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParse }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.education?.length || result.skills?.length) {
          setPreviewData({ education: result.education, skills: result.skills });
        } else {
          // Fallback to client-side parse
          const local = parseLinkedInText(textToParse);
          setPreviewData(local);
        }
      } else {
        const local = parseLinkedInText(textToParse);
        setPreviewData(local);
      }
    } catch {
      const local = parseLinkedInText(textToParse);
      setPreviewData(local);
    }

    setParsing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isBinaryDocument = lowerName.endsWith('.pdf') || lowerName.endsWith('.docx') || file.type === 'application/pdf';

    if (isBinaryDocument) {
      setParsing(true);
      setError(null);
      try {
        const result = await parseResumeFile(file);
        if (result.success && result.data) {
          setInputText(result.data.rawText || '');
          setPreviewData({
            education: result.data.education,
            skills: result.data.skills,
          });
        } else {
          setError(result.error || 'Failed to extract text from document');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file');
      } finally {
        setParsing(false);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        handleParse(content);
      }
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    if (!previewData) return;
    onApply({
      education: previewData.education,
      skills: previewData.skills,
      mode: importMode,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0077b5]/20 border border-[#0077b5]/40 flex items-center justify-center text-sm font-bold text-[#0077b5]">
                in
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Import Education & Skills from LinkedIn</h2>
                <p className="text-xs text-white/50">Paste your profile text, upload an export, or load sample data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {!previewData ? (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/70">
                    LinkedIn Profile Content (Education & Skills sections)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(SAMPLE_LINKEDIN_TEXT);
                      handleParse(SAMPLE_LINKEDIN_TEXT);
                    }}
                    className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Sparkles size={12} />
                    Load Sample LinkedIn Data
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your LinkedIn profile text here...&#10;&#10;Tip: On LinkedIn, go to your profile, select and copy your 'Education' and 'Skills' sections, or download profile via 'More > Save to PDF' and copy text."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500 font-mono leading-relaxed resize-none"
                />

                <div className="flex items-center justify-between text-xs text-white/40 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-violet-400 hover:text-violet-300 transition-colors">
                    <Upload size={14} />
                    Upload Profile / Resume (.txt, .pdf export)
                    <input type="file" accept=".txt,.pdf,.md" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span>Auto-detects universities, degrees, and skills</span>
                </div>

                {error && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
                    {error}
                  </p>
                )}
              </>
            ) : (
              /* Preview Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                    <Check size={14} />
                    Extracted {previewData.education.length} Education & {previewData.skills.length} Skills
                  </span>
                  <button
                    onClick={() => setPreviewData(null)}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Edit / Re-paste
                  </button>
                </div>

                {/* Extracted Education */}
                {previewData.education.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="text-xs font-bold text-violet-300 flex items-center gap-1.5 mb-2">
                      <BookOpen size={13} />
                      Education Entries ({previewData.education.length})
                    </div>
                    {previewData.education.map((edu, idx) => (
                      <div key={idx} className="bg-white/[0.03] p-2.5 rounded-lg border border-white/5 text-xs">
                        <div className="font-semibold text-white">{edu.institution}</div>
                        <div className="text-white/60">
                          {edu.degree} {edu.field && `· ${edu.field}`}
                        </div>
                        <div className="text-white/40 text-[11px] mt-0.5">
                          {edu.startYear} - {edu.endYear || 'Present'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extracted Skills */}
                {previewData.skills.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="text-xs font-bold text-violet-300 flex items-center gap-1.5 mb-2">
                      <Star size={13} />
                      Skills ({previewData.skills.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {previewData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-violet-500/20 border border-violet-500/30 text-violet-200 px-2.5 py-1 rounded-md"
                        >
                          {skill.name}{' '}
                          <span className="text-[9px] text-white/40 uppercase">({skill.category})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Options */}
                <div className="pt-2">
                  <div className="text-xs text-white/60 mb-2 font-medium">How should this data be applied?</div>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setImportMode('append')}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center gap-2 ${
                        importMode === 'append'
                          ? 'border-violet-500 bg-violet-600/20 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/60'
                      }`}
                    >
                      <input type="radio" checked={importMode === 'append'} onChange={() => {}} className="hidden" />
                      <div>
                        <div className="font-semibold">Append to Existing</div>
                        <div className="text-[10px] text-white/40">Keep current entries and add these</div>
                      </div>
                    </label>

                    <label
                      onClick={() => setImportMode('replace')}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center gap-2 ${
                        importMode === 'replace'
                          ? 'border-violet-500 bg-violet-600/20 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/60'
                      }`}
                    >
                      <input type="radio" checked={importMode === 'replace'} onChange={() => {}} className="hidden" />
                      <div>
                        <div className="font-semibold">Replace Existing</div>
                        <div className="text-[10px] text-white/40">Overwrite Education & Skills with LinkedIn data</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-white/50 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>

            {!previewData ? (
              <button
                type="button"
                onClick={() => handleParse(inputText)}
                disabled={parsing || !inputText.trim()}
                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                {parsing ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {parsing ? 'Parsing LinkedIn Data...' : 'Parse & Preview'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg hover:scale-105"
              >
                <Check size={14} />
                Apply to Education & Skills
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
