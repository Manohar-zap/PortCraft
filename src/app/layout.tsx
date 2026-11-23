import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PortCraft — Build Your Portfolio, No Coding Required',
  description:
    'PortCraft is a free, browser-based portfolio builder. Add your info, choose a design, customize, and download your portfolio website — no AI, no backend, no account.',
  keywords: ['portfolio builder', 'free portfolio', 'resume website', 'no code portfolio'],
  openGraph: {
    title: 'PortCraft — Your Portfolio. Your Rules.',
    description: 'Build a professional portfolio in minutes. No coding. No AI. 100% free.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased bg-[#0a0a0f] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
