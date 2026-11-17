'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-black text-gradient font-poppins mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-white/50 mb-8">
          The page you're looking for doesn't exist. Maybe you were building your portfolio?
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white px-5 py-2.5 rounded-xl transition-all"
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl transition-all font-semibold"
          >
            <Sparkles size={16} />
            Build Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
