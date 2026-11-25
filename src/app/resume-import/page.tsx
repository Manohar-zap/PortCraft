'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Upload, FileText, Sparkles, Check, X,
  Loader2, AlertCircle, Eye, Edit2, Trash2, Download, ChevronDown, ChevronUp,
  User, Briefcase, GraduationCap, Code, Award, Star, Settings, Plus, Minus,
  Mail, Phone, MapPin, Globe, BookOpen, Calendar, Building,
  Folder, Trophy, CheckCircle, Star as StarIcon, Link2, Home
} from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import { GithubIcon } from '@/components/templates/worlds/WorldIcons';

// Simple LinkedIn icon component
const LinkedinIcon = ({ size = 16, className = '', ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { PortfolioData, Education, Experience, Skill, Project, Achievement, PersonalInfo, generateId, DEFAULT_THEME } from '@/lib/types';
import { TEMPLATES, getTemplate } from '@/lib/templates';
import { parseResumeFile, ParsedResumeData, parsedToPortfolioData } from '@/lib/resumeParser';
import { loadPortfolio, savePortfolio } from '@/lib/storage';

type Step = 'upload' | 'review' | 'template' | 'complete';

interface ParsedDataState {
  personal: Partial<PersonalInfo>;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Array<{ id: string; title: string; issuer: string; date: string; url: string }>;
  rawText: string;
  confidence: number;
}

const INITIAL_PARSED_DATA: ParsedDataState = {
  personal: {},
  education: [],
  experience: [],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
  rawText: '',
  confidence: 0,
};

const ICON_COLOR_MAP: Record<string, string> = {
  violet: 'text-violet-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  pink: 'text-pink-400',
  yellow: 'text-yellow-400',
  cyan: 'text-cyan-400',
};

export default function ResumeImportPage() {
  const [step, setStep] = useState<Step>('upload');
  const [parsedData, setParsedData] = useState<ParsedDataState>(INITIAL_PARSED_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('spider-verse');
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    education: true,
    experience: true,
    skills: true,
    projects: true,
    achievements: true,
    certifications: true,
  });
  const [generating, setGenerating] = useState(false);

  // ─── Step Navigation ────────────────────────────────────────────────

  const canProceed = useCallback(() => {
    if (step === 'upload') return !!parsedData.rawText;
    if (step === 'review') return !!parsedData.personal.firstName || !!parsedData.personal.email || parsedData.skills.length > 0 || parsedData.experience.length > 0 || parsedData.education.length > 0;
    if (step === 'template') return !!selectedTemplate;
    return true;
  }, [step, parsedData, selectedTemplate]);

  const handleNext = () => {
    if (step === 'upload' && canProceed()) setStep('review');
    else if (step === 'review' && canProceed()) setStep('template');
    else if (step === 'template' && canProceed()) handleGenerate();
  };

  const handleBack = () => {
    if (step === 'review') setStep('upload');
    else if (step === 'template') setStep('review');
    else if (step === 'complete') setStep('template');
  };

  // ─── File Upload & Parsing ──────────────────────────────────────────

  const handleFileUpload = async (file: File) => {
    setParsing(true);
    setError(null);

    try {
      const result = await parseResumeFile(file);
      if (result.success && result.data) {
        setParsedData(result.data);
        setStep('review');
      } else {
        setError(result.error || 'Failed to parse resume');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // ─── Data Editing Functions ─────────────────────────────────────────

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    setParsedData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const addEducation = () => {
    setParsedData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: generateId(),
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        gpa: '',
        description: '',
      }],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setParsedData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeEducation = (id: string) => {
    setParsedData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  };

  const addExperience = () => {
    setParsedData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: generateId(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        location: '',
        description: '',
        highlights: [],
      }],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean | string[]) => {
    setParsedData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeExperience = (id: string) => {
    setParsedData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  };

  const addSkill = () => {
    setParsedData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        id: generateId(),
        name: '',
        level: 0,
        category: 'General',
      }],
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setParsedData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const removeSkill = (id: string) => {
    setParsedData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  const addProject = () => {
    setParsedData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: generateId(),
        title: '',
        description: '',
        techStack: [],
        liveUrl: '',
        githubUrl: '',
        imageUrl: '',
        featured: false,
      }],
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[] | boolean) => {
    setParsedData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }));
  };

  const removeProject = (id: string) => {
    setParsedData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  };

  const addAchievement = () => {
    setParsedData(prev => ({
      ...prev,
      achievements: [...prev.achievements, {
        id: generateId(),
        title: '',
        issuer: '',
        date: new Date().getFullYear().toString(),
        description: '',
        url: '',
      }],
    }));
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setParsedData(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, [field]: value } : a),
    }));
  };

  const removeAchievement = (id: string) => {
    setParsedData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a.id !== id),
    }));
  };

  const addCertification = () => {
    setParsedData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: generateId(),
        title: '',
        issuer: '',
        date: new Date().getFullYear().toString(),
        url: '',
      }],
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setParsedData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  };

  const removeCertification = (id: string) => {
    setParsedData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ─── Portfolio Generation ───────────────────────────────────────────

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const existing = loadPortfolio();
      const portfolioData = parsedToPortfolioData(parsedData, selectedTemplate);
      const template = getTemplate(selectedTemplate);
      const finalData = {
        ...existing,
        ...portfolioData,
        platformProfiles: existing.platformProfiles,
        repositories: existing.repositories?.length ? existing.repositories : portfolioData.repositories,
        codingStats: existing.codingStats || portfolioData.codingStats,
        theme: { ...DEFAULT_THEME, ...template.defaultTheme },
      };
      savePortfolio(finalData);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate portfolio');
    } finally {
      setGenerating(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────

  const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: 'Upload', icon: <Upload size={16} /> },
    { id: 'review', label: 'Review', icon: <FileText size={16} /> },
    { id: 'template', label: 'Template', icon: <Sparkles size={16} /> },
    { id: 'complete', label: 'Done', icon: <Check size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Bar */}
      <AppHeader
        currentPath="/resume-import"
        pageTitle="Resume Import"
        rightActions={
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Auto-saves on complete</span>
          </div>
        }
      />

      {/* Progress Indicator */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-white/5 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 md:gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 md:gap-2">
                <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  STEPS.findIndex(st => st.id === step) >= i
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/[0.03] text-white/30'
                }`}>
                  {s.icon}
                  <span className="hidden md:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 md:w-8 ${
                    STEPS.findIndex(st => st.id === step) > i ? 'bg-violet-500' : 'bg-white/10'
                  }`} />
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
              {step === 'upload' && <UploadStep
                onUpload={handleFileUpload}
                parsing={parsing}
                error={error}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />}
              {step === 'review' && <ReviewStep
                data={parsedData}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
                onPersonalChange={updatePersonal}
                onEducationChange={updateEducation}
                onRemoveEducation={removeEducation}
                onAddEducation={addEducation}
                onExperienceChange={updateExperience}
                onRemoveExperience={removeExperience}
                onAddExperience={addExperience}
                onSkillChange={updateSkill}
                onRemoveSkill={removeSkill}
                onAddSkill={addSkill}
                onProjectChange={updateProject}
                onRemoveProject={removeProject}
                onAddProject={addProject}
                onAchievementChange={updateAchievement}
                onRemoveAchievement={removeAchievement}
                onAddAchievement={addAchievement}
                onCertificationChange={updateCertification}
                onRemoveCertification={removeCertification}
                onAddCertification={addCertification}
              />}
              {step === 'template' && <TemplateStep
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />}
              {step === 'complete' && <CompleteStep />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      {step !== 'complete' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-t border-white/5 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {step === 'upload' ? (
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
                    i === STEPS.findIndex(st => st.id === step) ? 'w-6 h-2 bg-violet-500'
                    : i < STEPS.findIndex(st => st.id === step) ? 'w-2 h-2 bg-green-500'
                    : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed() || parsing || generating}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            >
              {step === 'template' && generating && (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              )}
              {step === 'template' && !generating ? 'Generate Portfolio' : 'Next'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-t border-white/5 px-6 py-4">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all border border-white/10"
            >
              <Home size={16} />
              Home
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              <Settings size={16} />
              Continue Editing in Builder
            </Link>
            <Link
              href="/preview"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            >
              <Eye size={16} />
              View Live Portfolio
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────

function UploadStep({
  onUpload,
  parsing,
  error,
  onDragOver,
  onDrop,
}: {
  onUpload: (file: File) => void;
  parsing: boolean;
  error: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savedKeyMsg, setSavedKeyMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemini_api_key');
      if (saved) setApiKey(saved);
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    if (typeof window !== 'undefined') {
      if (val.trim()) {
        localStorage.setItem('gemini_api_key', val.trim());
        setSavedKeyMsg(true);
        setTimeout(() => setSavedKeyMsg(false), 2000);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
          <Upload size={40} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-poppins mb-4">
          Upload Your Resume
        </h1>
        <p className="text-white/50 text-lg mb-8 leading-relaxed">
          Drag & drop or click to upload a PDF, DOCX, TXT, or Image (PNG, JPG, WEBP) file.
          We'll extract your profile, experience, education, skills, and projects automatically.
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); onDragOver(e); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); onDrop(e); }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
            dragActive ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp,image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={parsing}
          />
          <div className="flex flex-col items-center gap-3">
            <FileText size={48} className="text-white/30" />
            <div className="text-lg font-medium text-white/80">
              {parsing ? 'Parsing your resume...' : 'Drop your resume here or click to browse'}
            </div>
            <div className="text-sm text-white/40">
              Supports PDF, DOCX, TXT, PNG, JPG, WEBP · Max 10MB
            </div>
            {parsing && (
              <div className="flex items-center gap-2 text-violet-400">
                <Loader2 size={20} className="animate-spin" />
                <span>Extracting resume data with OCR & parsing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Optional Gemini API Key for deep AI precision */}
        <div className="mt-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-left">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={13} className="text-violet-400" />
              <span>Gemini AI Key (optional — for deep AI understanding)</span>
            </span>
            {savedKeyMsg && <span className="text-green-400 text-[11px] font-semibold animate-pulse">✓ Saved to session</span>}
          </div>
          <input
            type="password"
            placeholder="Paste Gemini API key to enable multimodal AI precision (or leave blank to use built-in parser)..."
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500 font-mono"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { icon: User, title: 'Personal Info', desc: 'Name, title, contact, links, bio' },
            { icon: Briefcase, title: 'Experience', desc: 'Work history, roles, highlights' },
            { icon: GraduationCap, title: 'Education', desc: 'Degrees, institutions, honors' },
            { icon: Code, title: 'Skills', desc: 'Technical stack, proficiency levels' },
            { icon: Award, title: 'Projects', desc: 'Portfolio pieces with tech stack' },
            { icon: Star, title: 'Achievements', desc: 'Awards, certifications, honors' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="bg-white/[0.02] border border-white/5 rounded-xl p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
                <item.icon size={20} className="text-violet-400" />
              </div>
              <div className="font-semibold text-white">{item.title}</div>
              <div className="text-xs text-white/50 mt-1">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-xs text-white/30">
          All parsing happens locally in your browser. No data is sent to external AI services.
        </p>
      </motion.div>
    </div>
  );
}

function ReviewStep({
  data,
  expandedSections,
  onToggleSection,
  onPersonalChange,
  onEducationChange,
  onRemoveEducation,
  onAddEducation,
  onExperienceChange,
  onRemoveExperience,
  onAddExperience,
  onSkillChange,
  onRemoveSkill,
  onAddSkill,
  onProjectChange,
  onRemoveProject,
  onAddProject,
  onAchievementChange,
  onRemoveAchievement,
  onAddAchievement,
  onCertificationChange,
  onRemoveCertification,
  onAddCertification,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-poppins mb-2">Review & Edit Extracted Data</h2>
        <p className="text-white/50 text-sm">Review each section, make corrections, then choose a template to generate your portfolio.</p>
      </div>

      <div className="space-y-4" role="list" aria-label="Resume sections">
        {/* Personal Info */}
        <SectionCard
          title="Personal Information"
          icon={User}
          expanded={expandedSections.personal}
          onToggle={() => onToggleSection('personal')}
          count={Object.keys(data.personal).filter(k => data.personal[k as keyof typeof data.personal]).length}
          iconColor="violet"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="First Name"
                value={data.personal.firstName || ''}
                onChange={(v) => onPersonalChange('firstName', v)}
                placeholder="John"
                icon={User}
              />
              <EditableField
                label="Last Name"
                value={data.personal.lastName || ''}
                onChange={(v) => onPersonalChange('lastName', v)}
                placeholder="Doe"
                icon={User}
              />
              <EditableField
                label="Email"
                value={data.personal.email || ''}
                onChange={(v) => onPersonalChange('email', v)}
                placeholder="john@example.com"
                type="email"
                icon={Mail}
              />
              <EditableField
                label="Phone"
                value={data.personal.phone || ''}
                onChange={(v) => onPersonalChange('phone', v)}
                placeholder="+1 (555) 123-4567"
                icon={Phone}
              />
              <EditableField
                label="Location"
                value={data.personal.location || ''}
                onChange={(v) => onPersonalChange('location', v)}
                placeholder="San Francisco, CA"
                icon={MapPin}
              />
              <EditableField
                label="Website / Portfolio"
                value={data.personal.website || ''}
                onChange={(v) => onPersonalChange('website', v)}
                placeholder="https://johndoe.dev"
                icon={Globe}
              />
              <EditableField
                label="LinkedIn"
                value={data.personal.linkedin || ''}
                onChange={(v) => onPersonalChange('linkedin', v)}
                placeholder="https://linkedin.com/in/johndoe"
                icon={LinkedinIcon}
              />
              <EditableField
                label="GitHub"
                value={data.personal.github || ''}
                onChange={(v) => onPersonalChange('github', v)}
                placeholder="https://github.com/johndoe"
                icon={GithubIcon}
              />
            </div>
            <EditableField
              label="Professional Title"
              value={data.personal.title || ''}
              onChange={(v) => onPersonalChange('title', v)}
              placeholder="Senior Full Stack Developer"
              icon={Briefcase}
              fullWidth
            />
            <EditableField
              label="Bio / Summary"
              value={data.personal.bio || ''}
              onChange={(v) => onPersonalChange('bio', v)}
              placeholder="Passionate developer with 5+ years of experience..."
              icon={FileText}
              fullWidth
              textarea
              rows={3}
            />
          </div>
        </SectionCard>

        {/* Education */}
        <SectionCard
          title="Education"
          icon={GraduationCap}
          expanded={expandedSections.education}
          onToggle={() => onToggleSection('education')}
          count={data.education.length}
          iconColor="blue"
          onAdd={onAddEducation}
        >
          {data.education.length === 0 ? (
            <EmptyState text="No education entries found. Add manually or check your resume format." />
          ) : (
            data.education.map((edu: any) => (
              <EntryCard key={edu.id} onRemove={() => onRemoveEducation(edu.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Institution"
                    value={edu.institution}
                    onChange={(v) => onEducationChange(edu.id, 'institution', v)}
                    placeholder="Stanford University"
                    icon={GraduationCap}
                  />
                  <EditableField
                    label="Degree"
                    value={edu.degree}
                    onChange={(v) => onEducationChange(edu.id, 'degree', v)}
                    placeholder="Bachelor of Science"
                    icon={Award}
                  />
                  <EditableField
                    label="Field of Study"
                    value={edu.field}
                    onChange={(v) => onEducationChange(edu.id, 'field', v)}
                    placeholder="Computer Science"
                    icon={BookOpen}
                  />
                  <EditableField
                    label="Start Year"
                    value={edu.startYear}
                    onChange={(v) => onEducationChange(edu.id, 'startYear', v)}
                    placeholder="2020"
                    icon={Calendar}
                  />
                  <EditableField
                    label="End Year"
                    value={edu.endYear}
                    onChange={(v) => onEducationChange(edu.id, 'endYear', v)}
                    placeholder="2024 or Present"
                    icon={Calendar}
                  />
                  <EditableField
                    label="GPA"
                    value={edu.gpa}
                    onChange={(v) => onEducationChange(edu.id, 'gpa', v)}
                    placeholder="3.8/4.0"
                    icon={Star}
                  />
                </div>
                <EditableField
                  label="Description / Honors"
                  value={edu.description}
                  onChange={(v) => onEducationChange(edu.id, 'description', v)}
                  placeholder="Dean's List, relevant coursework, thesis..."
                  icon={FileText}
                  fullWidth
                  textarea
                  rows={2}
                />
              </EntryCard>
            ))
          )}
        </SectionCard>

        {/* Experience */}
        <SectionCard
          title="Work Experience"
          icon={Briefcase}
          expanded={expandedSections.experience}
          onToggle={() => onToggleSection('experience')}
          count={data.experience.length}
          iconColor="green"
          onAdd={onAddExperience}
        >
          {data.experience.length === 0 ? (
            <EmptyState text="No experience entries found. Add manually or check your resume format." />
          ) : (
            data.experience.map((exp: any) => (
              <EntryCard key={exp.id} onRemove={() => onRemoveExperience(exp.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Company"
                    value={exp.company}
                    onChange={(v) => onExperienceChange(exp.id, 'company', v)}
                    placeholder="Google"
                    icon={Building}
                  />
                  <EditableField
                    label="Position"
                    value={exp.position}
                    onChange={(v) => onExperienceChange(exp.id, 'position', v)}
                    placeholder="Software Engineer"
                    icon={Briefcase}
                  />
                  <EditableField
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(v) => onExperienceChange(exp.id, 'startDate', v)}
                    placeholder="Jan 2022"
                    icon={Calendar}
                  />
                  <EditableField
                    label="End Date"
                    value={exp.endDate}
                    onChange={(v) => onExperienceChange(exp.id, 'endDate', v)}
                    placeholder="Present or Dec 2023"
                    icon={Calendar}
                  />
                  <EditableField
                    label="Location"
                    value={exp.location}
                    onChange={(v) => onExperienceChange(exp.id, 'location', v)}
                    placeholder="Mountain View, CA (Remote)"
                    icon={MapPin}
                  />
                  <EditableField
                    label="Current Role"
                    value={exp.current ? 'true' : 'false'}
                    onChange={(v) => onExperienceChange(exp.id, 'current', v === 'true')}
                    placeholder=""
                    icon={CheckCircle}
                    type="checkbox"
                  />
                </div>
                <EditableField
                  label="Description"
                  value={exp.description}
                  onChange={(v) => onExperienceChange(exp.id, 'description', v)}
                  placeholder="Key responsibilities and achievements..."
                  icon={FileText}
                  fullWidth
                  textarea
                  rows={2}
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                    <StarIcon size={14} className="text-yellow-400" />
                    Highlights / Achievements
                  </div>
                  {(exp.highlights || []).map((highlight: string, hi: number) => (
                    <div key={hi} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => {
                          const newHighlights = [...(exp.highlights || [])];
                          newHighlights[hi] = e.target.value;
                          onExperienceChange(exp.id, 'highlights', newHighlights);
                        }}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                        placeholder="Key achievement or responsibility"
                      />
                      <button
                        onClick={() => {
                          const newHighlights = (exp.highlights || []).filter((_: any, i: number) => i !== hi);
                          onExperienceChange(exp.id, 'highlights', newHighlights);
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => onExperienceChange(exp.id, 'highlights', [...(exp.highlights || []), ''])}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Highlight
                  </button>
                </div>
              </EntryCard>
            ))
          )}
        </SectionCard>

        {/* Skills */}
        <SectionCard
          title="Skills"
          icon={Code}
          expanded={expandedSections.skills}
          onToggle={() => onToggleSection('skills')}
          count={data.skills.length}
          iconColor="orange"
          onAdd={onAddSkill}
        >
          {data.skills.length === 0 ? (
            <EmptyState text="No skills found. Add your technical skills manually." />
          ) : (
            <div className="space-y-3">
              {data.skills.map((skill: any) => (
                <div key={skill.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <EditableField
                    label="Skill"
                    value={skill.name}
                    onChange={(v) => onSkillChange(skill.id, 'name', v)}
                    placeholder="React"
                    icon={Code}
                    className="flex-1"
                  />
                  <EditableField
                    label="Category"
                    value={skill.category}
                    onChange={(v) => onSkillChange(skill.id, 'category', v)}
                    placeholder="Frontend"
                    icon={Folder}
                    className="w-40"
                  />
                  <EditableField
                    label="Level"
                    value={skill.level > 0 ? skill.level.toString() : ''}
                    onChange={(v) => onSkillChange(skill.id, 'level', v ? parseInt(v) || 0 : 0)}
                    placeholder="1-5"
                    icon={Star}
                    type="number"
                    min={1}
                    max={5}
                    className="w-20"
                  />
                  <button
                    onClick={() => onRemoveSkill(skill.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Projects */}
        <SectionCard
          title="Projects"
          icon={Award}
          expanded={expandedSections.projects}
          onToggle={() => onToggleSection('projects')}
          count={data.projects.length}
          iconColor="pink"
          onAdd={onAddProject}
        >
          {data.projects.length === 0 ? (
            <EmptyState text="No projects found. Add your portfolio projects manually." />
          ) : (
            data.projects.map((proj: any) => (
              <EntryCard key={proj.id} onRemove={() => onRemoveProject(proj.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Project Title"
                    value={proj.title}
                    onChange={(v) => onProjectChange(proj.id, 'title', v)}
                    placeholder="E-Commerce Platform"
                    icon={Award}
                  />
                  <EditableField
                    label="Live URL"
                    value={proj.liveUrl}
                    onChange={(v) => onProjectChange(proj.id, 'liveUrl', v)}
                    placeholder="https://project.demo"
                    icon={Globe}
                  />
                  <EditableField
                    label="GitHub URL"
                    value={proj.githubUrl}
                    onChange={(v) => onProjectChange(proj.id, 'githubUrl', v)}
                    placeholder="https://github.com/user/project"
                    icon={GithubIcon}
                  />
                  <EditableField
                    label="Featured"
                    value={proj.featured ? 'true' : 'false'}
                    onChange={(v) => onProjectChange(proj.id, 'featured', v === 'true')}
                    placeholder=""
                    icon={Star}
                    type="checkbox"
                  />
                </div>
                <EditableField
                  label="Description"
                  value={proj.description}
                  onChange={(v) => onProjectChange(proj.id, 'description', v)}
                  placeholder="Project description, technologies used, your role..."
                  icon={FileText}
                  fullWidth
                  textarea
                  rows={3}
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-white/50">Tech Stack:</span>
                  {(proj.techStack || []).map((tech: string, ti: number) => (
                    <span key={ti} className="bg-violet-500/20 border border-violet-500/30 text-violet-200 px-2.5 py-1 rounded-md text-xs flex items-center gap-1">
                      {tech}
                      <button onClick={() => {
                        const newStack = (proj.techStack || []).filter((_: any, i: number) => i !== ti);
                        onProjectChange(proj.id, 'techStack', newStack);
                      }} className="text-violet-400 hover:text-violet-300">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const tech = prompt('Enter technology:');
                      if (tech) onProjectChange(proj.id, 'techStack', [...(proj.techStack || []), tech]);
                    }}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 border border-violet-500/30 px-2 py-1 rounded"
                  >
                    <Plus size={12} /> Add Tech
                  </button>
                </div>
              </EntryCard>
            ))
          )}
        </SectionCard>

        {/* Achievements */}
        <SectionCard
          title="Achievements & Awards"
          icon={Star}
          expanded={expandedSections.achievements}
          onToggle={() => onToggleSection('achievements')}
          count={data.achievements.length}
          iconColor="yellow"
          onAdd={onAddAchievement}
        >
          {data.achievements.length === 0 ? (
            <EmptyState text="No achievements found. Add awards, honors, or recognition manually." />
          ) : (
            data.achievements.map((ach: any) => (
              <EntryCard key={ach.id} onRemove={() => onRemoveAchievement(ach.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Title"
                    value={ach.title}
                    onChange={(v) => onAchievementChange(ach.id, 'title', v)}
                    placeholder="Hackathon Winner 2023"
                    icon={Trophy}
                  />
                  <EditableField
                    label="Issuer"
                    value={ach.issuer}
                    onChange={(v) => onAchievementChange(ach.id, 'issuer', v)}
                    placeholder="Major League Hacking"
                    icon={Award}
                  />
                  <EditableField
                    label="Date"
                    value={ach.date}
                    onChange={(v) => onAchievementChange(ach.id, 'date', v)}
                    placeholder="2023"
                    icon={Calendar}
                  />
                  <EditableField
                    label="URL"
                    value={ach.url}
                    onChange={(v) => onAchievementChange(ach.id, 'url', v)}
                    placeholder="https://award.example.com"
                    icon={Globe}
                  />
                </div>
                <EditableField
                  label="Description"
                  value={ach.description}
                  onChange={(v) => onAchievementChange(ach.id, 'description', v)}
                  placeholder="Details about the achievement..."
                  icon={FileText}
                  fullWidth
                  textarea
                  rows={2}
                />
              </EntryCard>
            ))
          )}
        </SectionCard>

        {/* Certifications */}
        <SectionCard
          title="Certifications"
          icon={Award}
          expanded={expandedSections.certifications}
          onToggle={() => onToggleSection('certifications')}
          count={data.certifications.length}
          iconColor="cyan"
          onAdd={onAddCertification}
        >
          {data.certifications.length === 0 ? (
            <EmptyState text="No certifications found. Add professional certifications manually." />
          ) : (
            data.certifications.map((cert: any) => (
              <EntryCard key={cert.id} onRemove={() => onRemoveCertification(cert.id)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EditableField
                    label="Certification Name"
                    value={cert.title}
                    onChange={(v) => onCertificationChange(cert.id, 'title', v)}
                    placeholder="AWS Solutions Architect"
                    icon={Award}
                  />
                  <EditableField
                    label="Issuer"
                    value={cert.issuer}
                    onChange={(v) => onCertificationChange(cert.id, 'issuer', v)}
                    placeholder="Amazon Web Services"
                    icon={Building}
                  />
                  <EditableField
                    label="Date"
                    value={cert.date}
                    onChange={(v) => onCertificationChange(cert.id, 'date', v)}
                    placeholder="2023"
                    icon={Calendar}
                  />
                  <EditableField
                    label="Credential URL"
                    value={cert.url}
                    onChange={(v) => onCertificationChange(cert.id, 'url', v)}
                    placeholder="https://credly.com/..."
                    icon={Globe}
                    className="md:col-span-3"
                  />
                </div>
              </EntryCard>
            ))
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function TemplateStep({ selectedTemplate, onSelectTemplate }: { selectedTemplate: string; onSelectTemplate: (id: string) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-poppins mb-2">Choose Your Theme</h2>
        <p className="text-white/50 text-sm">Select from 30 fictional worlds. Each theme presents your data through its own unique design.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((t, i) => {
          const isSelected = selectedTemplate === t.id;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              onClick={() => onSelectTemplate(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectTemplate(t.id); } }}
              className={`text-left rounded-2xl overflow-hidden border-2 transition-all cursor-pointer focus:outline-none group relative ${
                isSelected
                  ? 'border-violet-500 shadow-xl shadow-violet-500/20'
                  : 'border-white/[0.08] hover:border-white/25 hover:bg-white/[0.01]'
              }`}
            >
              <div className={`h-36 bg-gradient-to-br ${t.previewBg} relative overflow-hidden flex flex-col justify-between p-3.5`}>
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded">
                    #{t.number < 10 ? `0${t.number}` : t.number}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                    {t.family}
                  </span>
                </div>
                <div className="z-10">
                  <div className="w-8 h-1.5 rounded-full mb-1.5" style={{ background: t.accentColor }} />
                  <div className="font-black text-white text-base leading-tight drop-shadow-md">{t.name}</div>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-violet-600/30 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center shadow-lg border-2 border-white">
                      <Check size={18} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className={`p-4 transition-colors ${isSelected ? 'bg-violet-950/20' : 'bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-violet-400">{t.category}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/[0.05] text-white/40 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedTemplate && (
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
                {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || selectedTemplate} selected
              </div>
              <div className="text-violet-400/60 text-xs">Click "Generate Portfolio" to create your complete portfolio with this theme.</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-600/20 border border-green-500/40 flex items-center justify-center">
          <Check size={48} className="text-green-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-poppins mb-4">
          Portfolio Generated!
        </h1>
        <p className="text-white/60 text-lg mb-8 leading-relaxed">
          Your resume has been transformed into a complete portfolio with your selected theme.
          All 30+ themes are now available to preview with your data.
        </p>
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-left space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Check size={16} className="text-violet-400" />
            </div>
            <span>Personal info, experience, education, skills, projects, achievements & certifications imported</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center">
              <Check size={16} className="text-green-400" />
            </div>
            <span>Theme applied with custom terminology, colors & layout</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Check size={16} className="text-emerald-400" />
            </div>
            <span>Saved to localStorage — works offline, no account needed</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Check size={16} className="text-blue-400" />
            </div>
            <span>All 30 themes ready to preview with your data</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  expanded: boolean;
  onToggle: () => void;
  count: number;
  iconColor: string;
  children: React.ReactNode;
  onAdd?: () => void;
}

function SectionCard({ title, icon: Icon, expanded, onToggle, count, iconColor, children, onAdd }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ICON_COLOR_MAP[iconColor] || 'text-violet-400'} bg-white/[0.03] border border-white/10`}>
            <Icon size={20} />
          </div>
          <div>
            <div className="font-semibold text-white">{title}</div>
            <div className="text-xs text-white/40">{count} {count === 1 ? 'entry' : 'entries'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20"
            >
              <Plus size={12} /> Add
            </button>
          )}
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${ICON_COLOR_MAP[iconColor] || 'text-violet-400'} bg-white/[0.03] border border-white/10`}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-5 pb-5"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EntryCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white/[0.03] border border-white/5 rounded-xl p-4 relative"
    >
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition-colors p-1"
      >
        <Trash2 size={16} />
      </button>
      <div className="pr-8">{children}</div>
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
      <p className="text-white/40 text-sm">{text}</p>
    </div>
  );
}

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  fullWidth?: boolean;
  textarea?: boolean;
  rows?: number;
  type?: string;
  min?: number;
  max?: number;
  className?: string;
}

function EditableField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  fullWidth,
  textarea,
  rows = 2,
  type = 'text',
  min,
  max,
  className = '',
}: EditableFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'md:col-span-2' : ''} ${className}`}>
      <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-white/40" />}
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 resize-none"
        />
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
            className="w-4 h-4 rounded border-white/30 bg-white/[0.03] text-violet-600 focus:ring-violet-500"
          />
          <span className="text-sm text-white/80">Current position</span>
        </label>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
        />
      )}
    </div>
  );
}