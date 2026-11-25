'use client';

import { motion, type Variants, type Easing } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowRight, Sparkles, Download, Palette, Eye,
  Globe, Shield, Zap, Code2, ChevronDown, Star,
  CheckCircle, ExternalLink, Link2, Share2, Layers,
  FileText, Brain, Menu, X, LayoutDashboard
} from 'lucide-react';
import { TEMPLATES, THEME_CATEGORIES, ThemeCategory } from '@/lib/templates';
import SamplePreviewModal from '@/components/preview/SamplePreviewModal';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as Easing },
  }),
};

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0f] text-white overflow-x-hidden" suppressHydrationWarning>
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Templates />
      <FAQ />
      <Footer />
    </div>
  );
}

/* ─── Navigation ─────────────────────────────────────────── */
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-700/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-gradient font-poppins">PortCraft</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5 text-sm text-white/70">
          <Link href="/connect" className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors">
            <Sparkles size={13} />
            Connect
          </Link>
          <Link href="/resume-import" className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
            <FileText size={13} />
            Resume Import
          </Link>
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors">
            <LayoutDashboard size={13} />
            Dashboard
          </Link>
          <Link href="/intelligence" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors">
            <Brain size={13} />
            Intelligence
          </Link>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#templates" className="hover:text-white transition-colors">Templates (30)</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/connect"
            className="hidden sm:flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
          >
            <Sparkles size={13} className="text-violet-400" />
            Connect
          </Link>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-md shadow-violet-600/30"
          >
            Create Portfolio
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mounted && mobileOpen && (
        <div className="lg:hidden bg-[#0c0c14]/95 border-b border-white/10 backdrop-blur-2xl px-5 py-4 space-y-2">
          <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
            Navigation Menu
          </div>
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            <Sparkles size={15} className="text-violet-400" />
            Home (Current)
          </Link>
          <Link
            href="/builder"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            <Layers size={15} className="text-violet-400" />
            Portfolio Builder
          </Link>
          <Link
            href="/resume-import"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-300 hover:bg-white/5 transition-colors"
          >
            <FileText size={15} className="text-green-400" />
            Resume to Portfolio (AI)
          </Link>
          <Link
            href="/connect"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-violet-300 hover:bg-white/5 transition-colors"
          >
            <Sparkles size={15} className="text-violet-400" />
            Connect Profiles (GitHub, etc.)
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-300 hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard size={15} className="text-amber-400" />
            Profile Dashboard
          </Link>
          <Link
            href="/preview"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-300 hover:bg-white/5 transition-colors"
          >
            <Eye size={15} className="text-cyan-400" />
            Live Preview
          </Link>
          <Link
            href="/intelligence"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-300 hover:bg-white/5 transition-colors"
          >
            <Brain size={15} className="text-blue-400" />
            Intelligence Hub
          </Link>
          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-3 text-xs text-white/50 px-2">
            <a href="#features" onClick={() => setMobileOpen(false)} className="hover:text-white">Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="hover:text-white">How It Works</a>
            <a href="#templates" onClick={() => setMobileOpen(false)} className="hover:text-white">Templates (30)</a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="hover:text-white">FAQ</a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 bg-grid overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-violet-900/40 border border-violet-500/30 text-violet-300 text-sm px-4 py-2 rounded-full mb-8"
        >
          <Sparkles size={14} />
          Profile Aggregator · Gemini AI Builder · 30 Fictional Themes
          <Sparkles size={14} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight font-poppins"
        >
          Your Portfolio.
          <br />
          <span className="text-gradient">Your Rules.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Connect GitHub, LeetCode, Codeforces, and HackerRank to auto-generate a verified student portfolio.
          Customize with PortCraft AI across 30 fictional universe themes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/connect"
            className="flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-base md:text-lg px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 glow-purple-sm shadow-xl"
          >
            <Sparkles size={19} />
            Connect & Auto-Build
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/resume-import"
            className="flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-base md:text-lg px-7 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 glow-green-sm shadow-xl"
          >
            <FileText size={19} />
            Resume → Portfolio
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base md:text-lg px-7 py-4 rounded-xl transition-all"
          >
            Manual Builder
          </Link>
          <a
            href="#templates"
            className="flex items-center gap-1.5 text-white/60 hover:text-white font-medium text-sm px-4 py-2 transition-colors"
          >
            <Eye size={16} />
            Explore 30 Themes
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 text-white/50 text-sm"
        >
          {[
            { label: 'Fictional Themes', value: '30' },
            { label: 'No Account Required', value: '✓' },
            { label: 'Export Format', value: 'HTML/CSS/JS' },
            { label: 'Cost', value: 'Free' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Template previews */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 20 }}
        transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 mt-20 w-full max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {TEMPLATES.slice(0, 6).map((t) => (
            <Link
              key={t.id}
              href={`/builder?template=${t.id}`}
              className={`h-28 md:h-36 rounded-xl bg-gradient-to-br ${t.previewBg} border border-white/10 overflow-hidden relative group cursor-pointer transition-transform hover:scale-105 hover:-translate-y-1 block`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white/80 font-mono mb-1">#{t.number}</span>
                <div className="w-5 h-5 rounded-full mb-1.5" style={{ background: t.accentColor }} />
                <div className="text-xs font-bold leading-tight text-white/90 drop-shadow">
                  {t.name.split('/')[0].trim()}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-semibold">Select →</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center text-white/40 text-xs mt-4">
          Choose from 30 fictional world themes — <a href="#templates" className="text-violet-400 hover:underline">Explore all themes below</a>
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: <Globe size={22} />,
      title: '100% Browser-Based',
      desc: 'Everything runs in your browser. No servers, no uploads, no waiting.',
    },
    {
      icon: <Shield size={22} />,
      title: 'No AI Required',
      desc: 'Your portfolio is generated from your data, not from AI-generated fluff.',
    },
    {
      icon: <Palette size={22} />,
      title: 'Live Customization',
      desc: 'Change colors, fonts, layouts and see the result instantly in real-time.',
    },
    {
      icon: <Download size={22} />,
      title: 'Free HTML/CSS Export',
      desc: 'Download a complete, production-ready website package. Host anywhere.',
    },
    {
      icon: <Zap size={22} />,
      title: 'Multiple Designs',
      desc: '5 professionally crafted templates — minimalist, tech, creative and more.',
    },
    {
      icon: <Code2 size={22} />,
      title: 'No Coding Needed',
      desc: 'Fill in a form, pick a design, done. No HTML or CSS knowledge required.',
    },
    {
      icon: <Eye size={22} />,
      title: 'Responsive Portfolios',
      desc: 'Every generated portfolio looks great on desktop, tablet and mobile.',
    },
    {
      icon: <Star size={22} />,
      title: 'No Account Required',
      desc: 'Start immediately. Your data stays in your browser — not on our servers.',
    },
  ];

  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Why PortCraft</span>
          <h2 className="text-4xl md:text-5xl font-black font-poppins">Everything you need,<br /><span className="text-gradient">nothing you don't.</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.5}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-600/30 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Add Your Information',
      desc: 'Fill in your personal details, work experience, education, skills, projects and achievements using our guided multi-step form.',
      icon: '📝',
    },
    {
      num: '02',
      title: 'Select a Design',
      desc: 'Browse our collection of professionally crafted portfolio templates and choose the one that fits your personality and industry.',
      icon: '🎨',
    },
    {
      num: '03',
      title: 'Customize Your Portfolio',
      desc: 'Fine-tune colors, fonts, layouts and content in real-time. See changes instantly in the live preview panel.',
      icon: '⚡',
    },
    {
      num: '04',
      title: 'Download & Publish',
      desc: 'Export a complete HTML/CSS/JS package. Upload it to GitHub Pages, Vercel, Netlify, or any web host — for free.',
      icon: '🚀',
    },
  ];

  return (
    <section id="how-it-works" className="py-28 px-6 bg-white/[0.02] border-y border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">The Process</span>
          <h2 className="text-4xl md:text-5xl font-black font-poppins">
            Four steps to your<br /><span className="text-gradient">dream portfolio.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.5}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-6 h-px bg-gradient-to-r from-violet-500/50 to-transparent z-10" />
              )}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 h-full hover:border-violet-500/30 transition-all">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-violet-500 font-mono text-sm font-bold mb-2">{step.num}</div>
                <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 glow-purple-sm"
          >
            Start Building Now
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Template Showcase ───────────────────────────────────── */
function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('All');
  const [familyFilter, setFamilyFilter] = useState<'all' | 'inspired' | 'original'>('all');
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (familyFilter !== 'all' && t.family !== familyFilter) return false;
    return true;
  });

  return (
    <section id="templates" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">30 Fictional Worlds Collection</span>
          <h2 className="text-4xl md:text-5xl font-black font-poppins">
            Designs for every<br /><span className="text-gradient">universe and profession.</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            15 franchise/genre-inspired aesthetics + 15 original PortCraft fictional worlds. Every theme features custom layout composition, typography, and terminology.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {THEME_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Family Filter */}
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1 shrink-0">
            {(['all', 'inspired', 'original'] as const).map((fam) => (
              <button
                key={fam}
                onClick={() => setFamilyFilter(fam)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  familyFilter === fam
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {fam === 'all' ? 'All (30)' : fam === 'inspired' ? 'Inspired (15)' : 'Original (15)'}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((t, i) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={Math.min(i * 0.1, 0.4)}
              className="group cursor-pointer rounded-2xl border border-white/[0.08] overflow-hidden hover:border-violet-500/40 transition-all flex flex-col bg-white/[0.02]"
            >
              <div className={`h-48 bg-gradient-to-br ${t.previewBg} relative overflow-hidden flex flex-col justify-between p-4`}>
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded">
                    #{t.number < 10 ? `0${t.number}` : t.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplateId(t.id);
                      }}
                      className="text-[10px] uppercase font-bold tracking-wider bg-violet-600/80 hover:bg-violet-500 text-white px-2.5 py-1 rounded-full backdrop-blur-md transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Eye size={11} />
                      Live Sample
                    </button>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                      {t.family}
                    </span>
                  </div>
                </div>

                <div className="z-10">
                  <div className="w-8 h-1.5 rounded-full mb-1.5" style={{ background: t.accentColor }} />
                  <div className="font-black text-white text-xl leading-tight drop-shadow-md">
                    {t.name}
                  </div>
                  <div className="text-white/70 text-xs font-medium mt-1">{t.category}</div>
                </div>

                {/* Hover overlay with dual buttons */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplateId(t.id);
                    }}
                    className="w-full max-w-[200px] bg-white text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-violet-100 transition-all shadow-md hover:scale-105"
                  >
                    <Eye size={14} />
                    Explore Live Sample
                  </button>
                  <Link
                    href={`/builder?template=${t.id}`}
                    className="w-full max-w-[200px] bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-105"
                  >
                    Use This Template
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{t.description}</p>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 mb-3 text-xs text-white/50">
                    <span className="text-white/40">Projects:</span> <span className="text-violet-300 font-medium">{t.terms.projects}</span>
                    <span className="mx-2 text-white/20">|</span>
                    <span className="text-white/40">Skills:</span> <span className="text-violet-300 font-medium">{t.terms.skills}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {t.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-white/[0.05] text-white/40 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplateId(t.id)}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    <Eye size={12} />
                    Sample
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Sample Modal */}
      <SamplePreviewModal
        templateId={previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
      />
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    {
      q: 'Is PortCraft completely free?',
      a: 'Yes! PortCraft is 100% free, forever. No hidden fees, no premium plans, no credit card required. You can build and export as many portfolios as you like.',
    },
    {
      q: 'Does PortCraft use AI to generate content?',
      a: 'No. PortCraft does not use any AI or LLM services. Your portfolio is built entirely from the information you provide. This ensures your portfolio is authentic and accurately represents you.',
    },
    {
      q: 'Do I need coding knowledge to use PortCraft?',
      a: 'Not at all. PortCraft is designed for non-technical users. Simply fill in your information, choose a design, and customize using simple controls. No HTML, CSS, or JavaScript knowledge needed.',
    },
    {
      q: 'Can I download and self-host my portfolio?',
      a: 'Yes! PortCraft exports a complete HTML/CSS/JavaScript package as a ZIP file. You can host it on GitHub Pages, Netlify, Vercel, or any web hosting service — many of which are free.',
    },
    {
      q: 'Can I edit my portfolio later?',
      a: "Your portfolio data is saved in your browser's localStorage, so you can return and continue editing anytime as long as you're using the same browser and device.",
    },
    {
      q: 'Does PortCraft work on mobile devices?',
      a: 'The builder works best on desktop for the full editing experience. However, the exported portfolios are fully responsive and work beautifully on all device sizes.',
    },
    {
      q: 'Is my data private and secure?',
      a: 'Absolutely. All your data is stored only in your browser\'s localStorage. Nothing is sent to any server. PortCraft has no backend, so your personal information never leaves your device.',
    },
    {
      q: 'Can I use custom fonts or colors?',
      a: 'Yes! The customizer lets you choose from multiple font families and freely set any color using the color picker for primary, secondary and accent colors.',
    },
  ];

  return (
    <section id="faq" className="py-28 px-6 bg-white/[0.02] border-y border-white/[0.05]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-black font-poppins">
            Frequently Asked<br /><span className="text-gradient">Questions.</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={faq.q}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden group open:border-violet-500/30 transition-all"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-white/90 hover:text-white transition-colors">
                <span className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-violet-500 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown size={18} className="text-white/40 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="px-5 pb-5 text-white/55 leading-relaxed text-sm border-t border-white/[0.05] pt-4">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-gradient font-poppins">PortCraft</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              A free, browser-based portfolio builder. Build, customize, and export your professional portfolio in minutes.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://github.com" target="_blank" rel="noopener" className="text-white/40 hover:text-white transition-colors">
                <Code2 size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" className="text-white/40 hover:text-white transition-colors">
                <Share2 size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white/80 mb-4 text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-2 text-sm text-white/40">
              {['Features', 'Templates', 'How It Works', 'FAQ'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/80 mb-4 text-sm uppercase tracking-widest">Get Started</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="/builder" className="hover:text-white transition-colors">Create Portfolio</Link></li>
              <li><Link href="/builder" className="hover:text-white transition-colors">Explore Templates</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2026 PortCraft. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built with Next.js · No AI · No Backend · 100% Free</p>
        </div>
      </div>
    </footer>
  );
}
