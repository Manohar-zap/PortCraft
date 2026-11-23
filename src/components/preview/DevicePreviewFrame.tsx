'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface Props {
  viewport: ViewportMode;
  children: React.ReactNode;
  className?: string;
}

export default function DevicePreviewFrame({ viewport, children, className = '' }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (viewport === 'desktop') {
      setMountNode(null);
      return;
    }

    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Ensure fresh head
      doc.head.innerHTML = '<base target="_blank">';

      // Copy all style tags and stylesheets from main document
      const styleElements = document.querySelectorAll('link[rel="stylesheet"], style');
      styleElements.forEach((el) => {
        doc.head.appendChild(el.cloneNode(true));
      });

      // Synchronize root classes (fonts, variables, color scheme)
      doc.documentElement.className = document.documentElement.className;
      doc.body.className = `${document.body.className} m-0 p-0 overflow-x-hidden min-h-screen`;

      // Set mount node to trigger portal rendering
      setMountNode(doc.body);
    };

    // If iframe already loaded or needs load listener
    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframe();
    } else {
      iframe.addEventListener('load', setupIframe);
    }

    // Keep stylesheets updated if Next.js hot-reloads styles
    const observer = new MutationObserver(() => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const currentStyles = doc.head.querySelectorAll('link[rel="stylesheet"], style');
      const parentStyles = document.querySelectorAll('link[rel="stylesheet"], style');
      if (currentStyles.length !== parentStyles.length) {
        currentStyles.forEach((s) => s.remove());
        doc.head.innerHTML = '<base target="_blank">';
        parentStyles.forEach((el) => {
          doc.head.appendChild(el.cloneNode(true));
        });
      }
    });

    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      iframe.removeEventListener('load', setupIframe);
    };
  }, [viewport]);

  // Desktop renders directly in the main DOM without iframe overhead
  if (viewport === 'desktop') {
    return (
      <div className={`w-full min-h-screen bg-transparent ${className}`}>
        {children}
      </div>
    );
  }

  // Tablet View (iPad 768px native viewport)
  if (viewport === 'tablet') {
    return (
      <div className="flex flex-col items-center justify-start py-4 px-2 w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="relative w-[768px] max-w-full bg-[#1e1e24] p-3 rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 ring-1 ring-white/5">
          {/* Top Sensor / Camera Dot */}
          <div className="w-2.5 h-2.5 bg-black rounded-full mx-auto mb-2 border border-white/10 shadow-inner" />

          {/* Device Screen Iframe */}
          <iframe
            ref={iframeRef}
            title="Tablet Viewport Preview"
            className="w-full h-[880px] max-h-[78vh] rounded-[24px] border-0 bg-neutral-950 block shadow-inner"
          />

          {/* Bottom Home Indicator */}
          <div className="w-36 h-1 bg-white/20 rounded-full mx-auto mt-2.5" />
        </div>
        {mountNode && createPortal(children, mountNode)}
      </div>
    );
  }

  // Mobile View (iPhone 390px native viewport)
  return (
    <div className="flex flex-col items-center justify-start py-4 px-2 w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-[390px] max-w-full bg-[#18181c] p-3 rounded-[48px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] border border-white/10 ring-1 ring-white/5">
        {/* Dynamic Island / Speaker */}
        <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2 border border-white/5 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0f] border border-white/10" />
          <div className="w-2 h-2 rounded-full bg-blue-900/40" />
        </div>

        {/* Device Screen Iframe */}
        <iframe
          ref={iframeRef}
          title="Mobile Viewport Preview"
          className="w-full h-[760px] max-h-[76vh] rounded-[36px] border-0 bg-neutral-950 block shadow-inner"
        />

        {/* Bottom Home Bar */}
        <div className="w-32 h-1 bg-white/25 rounded-full mx-auto mt-2.5" />
      </div>
      {mountNode && createPortal(children, mountNode)}
    </div>
  );
}
