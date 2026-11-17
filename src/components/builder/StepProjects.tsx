'use client';

import { useRef, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X, Image, Star } from 'lucide-react';
import { PortfolioData, Project, Achievement, generateId } from '@/lib/types';

interface Props {
  data: PortfolioData;
  updateData: (partial: Partial<PortfolioData>) => void;
}

function ProjectCard({
  project,
  onUpdate,
  onDelete,
}: {
  project: Project;
  onUpdate: (p: Project) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [newTag, setNewTag] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const u = (field: keyof Project, value: unknown) => onUpdate({ ...project, [field]: value });

  const addTag = () => {
    if (!newTag.trim()) return;
    u('techStack', [...project.techStack, newTag.trim()]);
    setNewTag('');
  };

  const removeTag = (i: number) =>
    u('techStack', project.techStack.filter((_, idx) => idx !== i));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => u('imageUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-all ${project.featured ? 'border-violet-500/40' : 'border-white/[0.07]'}`}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
        <GripVertical size={16} className="text-white/20" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-white text-sm truncate flex items-center gap-2">
            {project.title || 'New Project'}
            {project.featured && <Star size={12} className="text-yellow-400" fill="currentColor" />}
          </div>
          <div className="text-xs text-white/40 truncate">{project.techStack.join(', ')}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-400/60 hover:text-red-400 p-1 transition-colors">
          <Trash2 size={14} />
        </button>
        {expanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.05] pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Project image */}
            <div
              className="h-28 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500/40 transition-all overflow-hidden"
              onClick={() => fileRef.current?.click()}
            >
              {project.imageUrl ? (
                <img src={project.imageUrl} alt="Project" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Image size={24} className="text-white/20 mb-1" />
                  <span className="text-xs text-white/30">Add screenshot</span>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            {/* Fields */}
            <div className="md:col-span-2 space-y-3">
              <input value={project.title} onChange={(e) => u('title', e.target.value)} placeholder="Project Title *" className="input-field" />
              <input value={project.liveUrl} onChange={(e) => u('liveUrl', e.target.value)} placeholder="Live URL (https://...)" className="input-field" type="url" />
              <input value={project.githubUrl} onChange={(e) => u('githubUrl', e.target.value)} placeholder="GitHub URL (https://github.com/...)" className="input-field" type="url" />
            </div>
          </div>

          <textarea
            value={project.description}
            onChange={(e) => u('description', e.target.value)}
            placeholder="Describe what this project does, the problem it solves, and your role..."
            rows={3}
            className="input-field resize-none w-full"
          />

          {/* Tech stack */}
          <div>
            <div className="text-xs text-white/50 mb-2 font-medium">Tech Stack</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.techStack.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 bg-violet-900/30 text-violet-300 text-xs px-2 py-1 rounded-full border border-violet-500/20">
                  {tag}
                  <button onClick={() => removeTag(i)} className="hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tech (React, Node.js, Python...)"
                className="input-field flex-1 text-sm"
              />
              <button onClick={addTag} className="btn-secondary text-xs px-3">Add</button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) => u('featured', e.target.checked)}
              className="w-4 h-4 rounded accent-violet-500"
            />
            <Star size={14} className="text-yellow-400" />
            Feature this project (show prominently)
          </label>
        </div>
      )}
    </div>
  );
}

function AchievementCard({
  achievement,
  onUpdate,
  onDelete,
}: {
  achievement: Achievement;
  onUpdate: (a: Achievement) => void;
  onDelete: () => void;
}) {
  const u = (field: keyof Achievement, value: string) => onUpdate({ ...achievement, [field]: value });

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <input value={achievement.title} onChange={(e) => u('title', e.target.value)} placeholder="Award / Certificate title *" className="input-field" />
      <input value={achievement.issuer} onChange={(e) => u('issuer', e.target.value)} placeholder="Issued by (e.g. Google, AWS, Harvard)" className="input-field" />
      <input value={achievement.date} onChange={(e) => u('date', e.target.value)} placeholder="Date (e.g. June 2024)" className="input-field" />
      <input value={achievement.url} onChange={(e) => u('url', e.target.value)} placeholder="Certificate URL (optional)" className="input-field" type="url" />
      <div className="md:col-span-2 flex items-start gap-3">
        <textarea value={achievement.description} onChange={(e) => u('description', e.target.value)} placeholder="Brief description..." rows={2} className="input-field flex-1 resize-none" />
        <button onClick={onDelete} className="text-red-400/60 hover:text-red-400 transition-colors mt-2">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function StepProjects({ data, updateData }: Props) {
  const { projects, achievements } = data;

  const addProject = () =>
    updateData({
      projects: [
        ...projects,
        { id: generateId(), title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', imageUrl: '', featured: false },
      ],
    });

  const addAchievement = () =>
    updateData({
      achievements: [
        ...achievements,
        { id: generateId(), title: '', issuer: '', date: '', description: '', url: '' },
      ],
    });

  const updateProject = (id: string, p: Project) =>
    updateData({ projects: projects.map((pr) => (pr.id === id ? p : pr)) });

  const deleteProject = (id: string) =>
    updateData({ projects: projects.filter((p) => p.id !== id) });

  const updateAchievement = (id: string, a: Achievement) =>
    updateData({ achievements: achievements.map((ach) => (ach.id === id ? a : ach)) });

  const deleteAchievement = (id: string) =>
    updateData({ achievements: achievements.filter((a) => a.id !== id) });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-2">Projects & Achievements</h1>
        <p className="text-white/50 text-sm">Showcase your best work and certifications.</p>
      </div>

      {/* Projects */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/90">Projects</h2>
          <button onClick={addProject} className="btn-secondary text-xs flex items-center gap-1.5">
            <Plus size={13} /> Add Project
          </button>
        </div>
        {projects.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl p-12 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <div className="text-white/50 text-sm mb-4">No projects yet. Add your best work!</div>
            <button onClick={addProject} className="btn-secondary text-sm flex items-center gap-2 mx-auto">
              <Plus size={15} /> Add your first project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onUpdate={(proj) => updateProject(p.id, proj)}
                onDelete={() => deleteProject(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/90">Achievements & Certifications</h2>
          <button onClick={addAchievement} className="btn-secondary text-xs flex items-center gap-1.5">
            <Plus size={13} /> Add Achievement
          </button>
        </div>
        {achievements.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-white/30 text-sm">
            Add awards, certifications, publications, or other recognitions.
          </div>
        ) : (
          <div className="space-y-3">
            {achievements.map((a) => (
              <AchievementCard
                key={a.id}
                achievement={a}
                onUpdate={(ach) => updateAchievement(a.id, ach)}
                onDelete={() => deleteAchievement(a.id)}
              />
            ))}
          </div>
        )}
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
