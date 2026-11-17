'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react';
import { PortfolioData, Experience, generateId } from '@/lib/types';

interface Props {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
}

function ExperienceCard({
  exp,
  onUpdate,
  onDelete,
}: {
  exp: Experience;
  onUpdate: (exp: Experience) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [newHighlight, setNewHighlight] = useState('');
  const u = (field: keyof Experience, value: unknown) => onUpdate({ ...exp, [field]: value });

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    u('highlights', [...exp.highlights, newHighlight.trim()]);
    setNewHighlight('');
  };

  const removeHighlight = (i: number) =>
    u('highlights', exp.highlights.filter((_, idx) => idx !== i));

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
        <GripVertical size={16} className="text-white/20" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white text-sm truncate">
            {exp.position || 'New Experience'} {exp.company && `· ${exp.company}`}
          </div>
          <div className="text-xs text-white/40">
            {exp.startDate && `${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}`}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-400/60 hover:text-red-400 p-1 transition-colors">
          <Trash2 size={14} />
        </button>
        {expanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.05] pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={exp.position} onChange={(e) => u('position', e.target.value)} placeholder="Job Title / Position *" className="input-field" />
            <input value={exp.company} onChange={(e) => u('company', e.target.value)} placeholder="Company Name *" className="input-field" />
            <input value={exp.location} onChange={(e) => u('location', e.target.value)} placeholder="Location (Remote / City, Country)" className="input-field" />
            <div className="flex items-center gap-3">
              <input value={exp.startDate} onChange={(e) => u('startDate', e.target.value)} placeholder="Start (e.g. Jan 2022)" className="input-field flex-1" />
              {!exp.current && (
                <input value={exp.endDate} onChange={(e) => u('endDate', e.target.value)} placeholder="End Date" className="input-field flex-1" />
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => u('current', e.target.checked)}
              className="w-4 h-4 rounded accent-violet-500"
            />
            I currently work here
          </label>

          <textarea
            value={exp.description}
            onChange={(e) => u('description', e.target.value)}
            placeholder="Describe your role, responsibilities and impact..."
            rows={3}
            className="input-field resize-none w-full"
          />

          {/* Highlights/Bullets */}
          <div>
            <div className="text-xs text-white/50 mb-2 font-medium">Key Highlights / Achievements</div>
            {exp.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                <span className="text-sm text-white/80 flex-1">{h}</span>
                <button onClick={() => removeHighlight(i)} className="text-red-400/50 hover:text-red-400 transition-colors mt-0.5">
                  <X size={12} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addHighlight()}
                placeholder="Add a highlight (press Enter)..."
                className="input-field flex-1 text-sm"
              />
              <button onClick={addHighlight} className="btn-secondary text-xs px-3">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepExperience({ data, updateData }: Props) {
  const { experience } = data;

  const addExperience = () => {
    updateData({
      experience: [
        ...experience,
        {
          id: generateId(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          location: '',
          description: '',
          highlights: [],
        },
      ],
    });
  };

  const updateExperience = (id: string, exp: Experience) =>
    updateData({ experience: experience.map((e) => (e.id === id ? exp : e)) });

  const deleteExperience = (id: string) =>
    updateData({ experience: experience.filter((e) => e.id !== id) });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">Work Experience</h1>
        <p className="text-white/50 text-sm">Add your professional work history. Most recent first.</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 text-sm">{experience.length} {experience.length === 1 ? 'entry' : 'entries'}</span>
        <button onClick={addExperience} className="btn-secondary text-xs flex items-center gap-1.5">
          <Plus size={13} /> Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">💼</div>
          <div className="text-white/50 text-sm mb-4">No experience added yet.</div>
          <button onClick={addExperience} className="btn-secondary text-sm flex items-center gap-2 mx-auto">
            <Plus size={15} /> Add your first job
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((exp) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              onUpdate={(e) => updateExperience(exp.id, e)}
              onDelete={() => deleteExperience(exp.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-300 text-xs">
        💡 Tip: You can skip this step if you're a student or new to the workforce. Add internships, freelance work, or personal projects instead.
      </div>

      <style jsx>{`
        .input-field {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px 12px;
          color: white;
          font-size: 14px;
          width: 100%;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 12px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .btn-secondary:hover {
          background: rgba(124,58,237,0.2);
          border-color: rgba(124,58,237,0.4);
          color: white;
        }
      `}</style>
    </div>
  );
}
