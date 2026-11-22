'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Sparkles } from 'lucide-react';
import { PortfolioData, Education, Skill, generateId } from '@/lib/types';
import LinkedInImportModal from './LinkedInImportModal';

interface Props {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
}

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data Science', 'Mobile', 'Tools', 'Languages', 'Other'];
const FONT_FAMILIES = [
  { label: 'Inter (Modern)', value: 'Inter, sans-serif' },
  { label: 'Poppins (Friendly)', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display (Elegant)', value: '"Playfair Display", serif' },
  { label: 'JetBrains Mono (Dev)', value: '"JetBrains Mono", monospace' },
  { label: 'Georgia (Classic)', value: 'Georgia, serif' },
];

function EducationCard({
  edu,
  onUpdate,
  onDelete,
}: {
  edu: Education;
  onUpdate: (edu: Education) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const u = (field: keyof Education, value: string) => onUpdate({ ...edu, [field]: value });

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
        <GripVertical size={16} className="text-white/20" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white text-sm truncate">
            {edu.institution || 'New Education Entry'}
          </div>
          <div className="text-xs text-white/40 truncate">{edu.degree}{edu.field && ` · ${edu.field}`}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-400/60 hover:text-red-400 p-1 transition-colors">
          <Trash2 size={14} />
        </button>
        {expanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.05] pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={edu.institution} onChange={(e) => u('institution', e.target.value)} placeholder="University / School name *" className="col-span-2 input-field" />
          <input value={edu.degree} onChange={(e) => u('degree', e.target.value)} placeholder="Degree (e.g. Bachelor of Science)" className="input-field" />
          <input value={edu.field} onChange={(e) => u('field', e.target.value)} placeholder="Field of Study" className="input-field" />
          <input value={edu.startYear} onChange={(e) => u('startYear', e.target.value)} placeholder="Start Year (e.g. 2020)" className="input-field" />
          <input value={edu.endYear} onChange={(e) => u('endYear', e.target.value)} placeholder="End Year (e.g. 2024 or Present)" className="input-field" />
          <input value={edu.gpa} onChange={(e) => u('gpa', e.target.value)} placeholder="GPA (optional)" className="input-field" />
          <textarea value={edu.description} onChange={(e) => u('description', e.target.value)} placeholder="Brief description, honors, relevant coursework..." rows={2} className="input-field col-span-2 resize-none" />
        </div>
      )}
    </div>
  );
}

export default function StepEducation({ data, updateData }: Props) {
  const { education, skills } = data;
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);

  const handleLinkedInApply = (extracted: { education: Education[]; skills: Skill[]; mode: 'append' | 'replace' }) => {
    if (extracted.mode === 'replace') {
      updateData({
        education: extracted.education.length > 0 ? extracted.education : education,
        skills: extracted.skills.length > 0 ? extracted.skills : skills,
      });
    } else {
      updateData({
        education: [...education, ...extracted.education],
        skills: [...skills, ...extracted.skills],
      });
    }
  };

  const addEducation = () => {
    updateData({
      education: [
        ...education,
        { id: generateId(), institution: '', degree: '', field: '', startYear: '', endYear: '', gpa: '', description: '' },
      ],
    });
  };

  const updateEducation = (id: string, edu: Education) =>
    updateData({ education: education.map((e) => (e.id === id ? edu : e)) });

  const deleteEducation = (id: string) =>
    updateData({ education: education.filter((e) => e.id !== id) });

  const addSkill = () => {
    updateData({
      skills: [
        ...skills,
        { id: generateId(), name: '', level: 3, category: 'Frontend' },
      ],
    });
  };

  const updateSkill = (id: string, skill: Skill) =>
    updateData({ skills: skills.map((s) => (s.id === id ? skill : s)) });

  const deleteSkill = (id: string) =>
    updateData({ skills: skills.filter((s) => s.id !== id) });

  const skillsByCategory = SKILL_CATEGORIES.reduce<Record<string, Skill[]>>((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    if (catSkills.length > 0) acc[cat] = catSkills;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">Education & Skills</h1>
        <p className="text-white/50 text-sm">Add your educational background and skill set manually, or import automatically from LinkedIn.</p>
      </div>

      {/* LinkedIn Import Banner */}
      <div className="mb-8 p-4 bg-gradient-to-r from-[#0077b5]/20 via-[#0077b5]/10 to-transparent border border-[#0077b5]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0077b5]/30 border border-[#0077b5]/40 flex items-center justify-center font-bold text-white text-sm shrink-0">
            in
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Import from LinkedIn
              <span className="text-[10px] bg-[#0077b5]/40 text-[#99d6ff] px-2 py-0.5 rounded-full font-semibold">
                Fast & Auto-Categorized
              </span>
            </div>
            <div className="text-xs text-white/50">
              Extract your universities, degrees, and categorized skills with one click.
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowLinkedInModal(true)}
          className="flex items-center gap-1.5 bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105 shrink-0"
        >
          <Sparkles size={13} />
          Import from LinkedIn
        </button>
      </div>

      {/* Education */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/90">Education</h2>
          <button onClick={addEducation} className="btn-secondary text-xs flex items-center gap-1.5">
            <Plus size={13} /> Add Education
          </button>
        </div>
        {education.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-white/30 text-sm">
            No education added yet. Click the button above to add your educational background.
          </div>
        ) : (
          <div className="space-y-3">
            {education.map((edu) => (
              <EducationCard
                key={edu.id}
                edu={edu}
                onUpdate={(e) => updateEducation(edu.id, e)}
                onDelete={() => deleteEducation(edu.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Skills */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/90">Skills</h2>
          <button onClick={addSkill} className="btn-secondary text-xs flex items-center gap-1.5">
            <Plus size={13} /> Add Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-white/30 text-sm">
            No skills added yet. Add your technical and soft skills.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick add row */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <div className="grid grid-cols-1 gap-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { ...skill, name: e.target.value })}
                      placeholder="Skill name (e.g. React, Python...)"
                      className="flex-1 input-field text-sm"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, { ...skill, category: e.target.value })}
                      className="input-field text-sm w-36"
                    >
                      {SKILL_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => updateSkill(skill.id, { ...skill, level: n })}
                          className={`w-5 h-5 rounded text-xs transition-all ${n <= skill.level ? 'bg-violet-500 text-white' : 'bg-white/[0.07] text-white/30'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => deleteSkill(skill.id)} className="text-red-400/60 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-violet-900/20 border border-violet-500/20 rounded-lg text-violet-300 text-xs">
          💡 Skill levels: 1 = Beginner, 2 = Basic, 3 = Intermediate, 4 = Advanced, 5 = Expert
        </div>
      </section>

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
        .input-field option { background: #1a1a2e; }
        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 12px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(124,58,237,0.2);
          border-color: rgba(124,58,237,0.4);
          color: white;
        }
      `}</style>

      {/* LinkedIn Import Modal */}
      <LinkedInImportModal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
        onApply={handleLinkedInApply}
      />
    </div>
  );
}
