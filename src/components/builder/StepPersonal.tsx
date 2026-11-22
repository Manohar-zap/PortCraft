'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, User } from 'lucide-react';
import { PortfolioData } from '@/lib/types';

interface Props {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
}

function Field({
  label, name, value, onChange, type = 'text', placeholder, required, hint
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/70">
        {label} {required && <span className="text-violet-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
      />
      {hint && <p className="text-xs text-white/30">{hint}</p>}
    </div>
  );
}

export default function StepPersonal({ data, updateData }: Props) {
  const { personal } = data;
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) =>
    updateData({ personal: { ...personal, [field]: value } });

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('avatar', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">Personal Information</h1>
        <p className="text-white/50 text-sm">Start with your basic details. Fields marked with <span className="text-violet-400">*</span> are required.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/[0.03] overflow-hidden cursor-pointer hover:border-violet-500/50 transition-all"
              onClick={() => fileRef.current?.click()}
            >
              {personal.avatar ? (
                <img src={personal.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <>
                  <User size={32} className="text-white/20 mb-2" />
                  <span className="text-xs text-white/30">Click to upload</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div className="text-center">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Upload size={12} />
              {personal.avatar ? 'Change photo' : 'Upload photo'}
            </button>
            <p className="text-xs text-white/25 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="First Name" name="firstName" value={personal.firstName} onChange={(v) => update('firstName', v)} placeholder="Alex" required />
          <Field label="Last Name" name="lastName" value={personal.lastName} onChange={(v) => update('lastName', v)} placeholder="Johnson" required />
          <div className="md:col-span-2">
            <Field label="Professional Title" name="title" value={personal.title} onChange={(v) => update('title', v)} placeholder="Full Stack Developer · UI Designer · Data Scientist" />
          </div>
          <Field label="Email" name="email" type="email" value={personal.email} onChange={(v) => update('email', v)} placeholder="alex@example.com" required />
          <Field label="Phone" name="phone" type="tel" value={personal.phone} onChange={(v) => update('phone', v)} placeholder="+1 (555) 000-0000" />
          <Field label="Location" name="location" value={personal.location} onChange={(v) => update('location', v)} placeholder="San Francisco, CA" />
          <Field label="Website" name="website" type="url" value={personal.website} onChange={(v) => update('website', v)} placeholder="https://alexjohnson.dev" />
          <Field label="LinkedIn URL" name="linkedin" type="url" value={personal.linkedin} onChange={(v) => update('linkedin', v)} placeholder="https://linkedin.com/in/alexjohnson" />
          <Field label="GitHub URL" name="github" type="url" value={personal.github} onChange={(v) => update('github', v)} placeholder="https://github.com/alexjohnson" />
          <Field label="Twitter/X URL" name="twitter" type="url" value={personal.twitter} onChange={(v) => update('twitter', v)} placeholder="https://twitter.com/alexjohnson" />
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Professional Bio</label>
            <textarea
              value={personal.bio}
              onChange={(e) => update('bio', e.target.value)}
              placeholder="Write 2-3 sentences about yourself, your expertise, and what drives you..."
              rows={4}
              className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
            />
            <p className="text-xs text-white/30" suppressHydrationWarning>{personal.bio.length} characters</p>
          </div>
        </div>
      </div>

      {!personal.firstName && (
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm">
          💡 Tip: At minimum, add your name and email to continue to the next step.
        </div>
      )}
    </div>
  );
}
