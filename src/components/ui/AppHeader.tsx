'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home, ArrowLeft, Sparkles, FileText, Brain,
  LayoutDashboard, Eye, Menu, X, ChevronDown, Layers
} from 'lucide-react';

export interface AppHeaderProps {
  currentPath: string;
  pageTitle?: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
  isFixed?: boolean;
  centerContent?: React.ReactNode;
  rightActions?: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home, desc: 'Landing page & templates' },
  { href: '/builder', label: 'Builder', icon: Layers, desc: 'Create & edit portfolio' },
  { href: '/resume-import', label: 'Resume Import', icon: FileText, desc: 'PDF / DOCX AI parser' },
  { href: '/connect', label: 'Connect Profiles', icon: Sparkles, desc: 'GitHub, LeetCode, Codeforces' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Profile & stats overview' },
  { href: '/preview', label: 'Live Preview', icon: Eye, desc: 'Test all 30 fictional worlds' },
  { href: '/intelligence', label: 'Intelligence', icon: Brain, desc: 'Smart recommendations & AI' },
];

export default function AppHeader({
  currentPath,
  pageTitle,
  badge,
  backHref,
  backLabel = 'Back',
  isFixed = true,
  centerContent,
  rightActions,
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerClasses = isFixed
    ? 'fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/60 h-14 flex items-center px-3 sm:px-6 gap-2 sm:gap-3'
    : 'flex-shrink-0 h-14 border-b border-white/5 backdrop-blur-xl bg-black/60 flex items-center px-3 sm:px-6 gap-2 sm:gap-3 z-50';

  return (
    <>
      <header className={containerClasses} suppressHydrationWarning>
        {/* Left: Home / Back Link */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/[0.05] hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
              title={`Go back to ${backLabel}`}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          ) : (
            currentPath !== '/' && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors bg-white/[0.06] hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 shadow-sm"
                title="Go to Home"
              >
                <Home size={14} className="text-violet-400" />
                <span className="hidden xs:inline">Home</span>
              </Link>
            )
          )}

          {/* Logo & Section Title */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 font-bold text-sm md:text-base hover:opacity-90 transition-opacity ml-1"
            title="PortCraft Home"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-sm">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-gradient font-poppins hidden sm:inline">PortCraft</span>
            {pageTitle && (
              <span className="text-white/40 text-xs hidden sm:inline">/</span>
            )}
            {pageTitle && (
              <span className="text-white/80 text-xs sm:text-sm font-medium">
                {pageTitle}
              </span>
            )}
          </Link>

          {badge && (
            <span className="hidden md:inline text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/20">
              {badge}
            </span>
          )}

          {/* Desktop Navigation Switcher Dropdown */}
          <div className="relative hidden lg:block ml-2">
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              onBlur={() => setTimeout(() => setNavDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/[0.05] transition-colors"
            >
              <span>Explore Pages</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${navDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {navDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-[#12121a] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-2xl">
                <div className="px-3 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                  Jump to Section
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-start gap-2.5 px-3.5 py-2 text-xs transition-colors ${
                        isActive
                          ? 'bg-violet-600/20 text-violet-300'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon size={14} className={`mt-0.5 ${isActive ? 'text-violet-400' : 'text-white/40'}`} />
                      <div className="flex-1">
                        <div className="font-medium flex items-center justify-between">
                          <span>{item.label}</span>
                          {isActive && <span className="text-[10px] text-violet-400">Current</span>}
                        </div>
                        <div className="text-[10px] text-white/40">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center slot (e.g. Viewport switcher on /preview) */}
        {centerContent && (
          <div className="flex-1 flex justify-center items-center">
            {centerContent}
          </div>
        )}

        {/* Right Actions & Mobile Hamburger */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
          {rightActions}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mounted && mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-50 bg-[#0e0e17]/95 border-b border-white/10 backdrop-blur-2xl p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-md mx-auto space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Quick Navigation
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-white/40 hover:text-white"
              >
                Close
              </button>
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-violet-400'} />
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className={`text-[11px] ${isActive ? 'text-white/70' : 'text-white/40'}`}>{item.desc}</div>
                    </div>
                  </div>
                  {isActive ? (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Current</span>
                  ) : (
                    <span className="text-white/30 text-xs">→</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
