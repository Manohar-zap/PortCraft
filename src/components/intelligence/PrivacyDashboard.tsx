'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, Download, Trash2, Settings, Eye, EyeOff,
  CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp,
  Database, History, Share2, Clock, FileText, User,
  ToggleLeft, ToggleRight, Copy, ExternalLink, AlertTriangle,
  RotateCcw, Lock, Unlock, Key, BarChart2, Layers, Lightbulb
} from 'lucide-react';
import { usePrivacy } from '@/lib/intelligence/privacy';
import { ConsentSettings, DataCategory, ConsentChange, ThirdPartyShare, RetentionPolicy } from '@/lib/intelligence/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyDashboard({ isOpen, onClose }: Props) {
  const privacy = usePrivacy();
  const [activeTab, setActiveTab] = useState<'overview' | 'consent' | 'data' | 'deletion' | 'transparency'>('overview');
  const [consent, setConsentState] = useState<ConsentSettings>(privacy.getConsent());
  const [dataCategories] = useState<DataCategory[]>(privacy.getDataCategories());
  const [consentHistory] = useState<ConsentChange[]>(privacy.getConsentHistory());
  const [thirdPartyShares] = useState<ThirdPartyShare[]>(privacy.getThirdPartyShares());
  const [retentionPolicies] = useState<RetentionPolicy[]>(privacy.getRetentionPolicies());
  const [deletionStatus, setDeletionStatus] = useState<{ scope: string; status: 'idle' | 'processing' | 'success' | 'error'; message?: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Sync consent state
  useEffect(() => {
    setConsentState(privacy.getConsent());
  }, [privacy]);

  const handleConsentChange = (key: keyof ConsentSettings, value: boolean) => {
    const updated = privacy.updateConsent({ [key]: value });
    setConsentState(updated);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await privacy.downloadDataExport();
    } finally {
      setExporting(false);
    }
  };

  const handleReport = async () => {
    privacy.downloadTransparencyReport();
  };

  const handleDeletion = async (scope: 'all' | 'analytics' | 'recommendations' | 'profile' | 'events') => {
    if (!confirm(`Are you sure you want to delete ${scope} data? This action cannot be undone.`)) return;
    
    setDeletionStatus({ scope, status: 'processing', message: 'Deleting data...' });
    try {
      let success = false;
      switch (scope) {
        case 'all':
          success = await privacy.deleteAllData();
          break;
        case 'analytics':
          success = await privacy.deleteAnalyticsData();
          break;
        case 'recommendations':
          success = await privacy.deleteRecommendations();
          break;
        default:
          success = false;
      }
      
      if (success) {
        setDeletionStatus({ scope, status: 'success', message: `${scope} data deleted successfully` });
      } else {
        setDeletionStatus({ scope, status: 'error', message: 'Failed to delete data' });
      }
    } catch {
      setDeletionStatus({ scope, status: 'error', message: 'An error occurred' });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Shield size={16} /> },
    { id: 'consent', label: 'Consent', icon: <Settings size={16} /> },
    { id: 'data', label: 'Data Collected', icon: <Database size={16} /> },
    { id: 'deletion', label: 'Delete Data', icon: <Trash2 size={16} /> },
    { id: 'transparency', label: 'Transparency', icon: <FileText size={16} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-4xl bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Privacy Dashboard</h2>
                  <p className="text-xs text-white/50">Control your data and privacy settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-white/5 bg-white/[0.02] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <OverviewTab consent={consent} onConsentChange={handleConsentChange} />
                    <QuickStatsTab />
                    <DataSummaryTab categories={dataCategories} />
                  </motion.div>
                )}
                {activeTab === 'consent' && (
                  <motion.div
                    key="consent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <ConsentTab consent={consent} onConsentChange={handleConsentChange} history={consentHistory} />
                  </motion.div>
                )}
                {activeTab === 'data' && (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <DataCategoriesTab categories={dataCategories} />
                    <RetentionTab policies={retentionPolicies} />
                    <ThirdPartyTab shares={thirdPartyShares} />
                  </motion.div>
                )}
                {activeTab === 'deletion' && (
                  <motion.div
                    key="deletion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <DeletionTab onDeletion={handleDeletion} status={deletionStatus} />
                  </motion.div>
                )}
                {activeTab === 'transparency' && (
                  <motion.div
                    key="transparency"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <TransparencyTab onExport={handleExport} onReport={handleReport} exporting={exporting} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Tab Components ────────────────────────────────────────────────────────

function OverviewTab({ consent, onConsentChange }: { consent: ConsentSettings; onConsentChange: (key: keyof ConsentSettings, value: boolean) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ConsentToggleCard
        title="Analytics"
        description="Track usage to improve the product"
        icon={<BarChart2 size={20} />}
        enabled={consent.analytics}
        onChange={(v) => onConsentChange('analytics', v)}
        recommended={true}
      />
      <ConsentToggleCard
        title="Personalization"
        description="Tailor themes, recommendations & content"
        icon={<Layers size={20} />}
        enabled={consent.personalization}
        onChange={(v) => onConsentChange('personalization', v)}
        recommended={true}
      />
      <ConsentToggleCard
        title="AI Training"
        description="Use your data to improve AI features"
        icon={<Key size={20} />}
        enabled={consent.aiTraining}
        onChange={(v) => onConsentChange('aiTraining', v)}
        recommended={false}
      />
      <ConsentToggleCard
        title="Third-Party Sharing"
        description="Share anonymized data with partners"
        icon={<Share2 size={20} />}
        enabled={consent.thirdPartySharing}
        onChange={(v) => onConsentChange('thirdPartySharing', v)}
        recommended={false}
      />
      <ConsentToggleCard
        title="Marketing Emails"
        description="Receive product updates and tips"
        icon={<ExternalLink size={20} />}
        enabled={consent.marketingEmails}
        onChange={(v) => onConsentChange('marketingEmails', v)}
        recommended={false}
      />
    </div>
  );
}

function ConsentToggleCard({ title, description, icon, enabled, onChange, recommended }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onChange: (value: boolean) => void;
  recommended: boolean;
}) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white">{title}</h4>
              {recommended && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-white/50 mt-1">{description}</p>
          </div>
        </div>
        <button
          onClick={() => onChange(!enabled)}
          className={`relative w-12 h-7 rounded-full transition-all flex items-center ${
            enabled ? 'bg-violet-600' : 'bg-white/10'
          }`}
          role="switch"
          aria-checked={enabled}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>
    </div>
  );
}

function QuickStatsTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Data Stored Locally" value="100%" icon={<Database size={20} />} desc="No cloud sync" />
      <StatCard title="Third-Party Shares" value="0" icon={<Share2 size={20} />} desc="No external sharing" />
      <StatCard title="Retention Control" value="Full" icon={<Clock size={20} />} desc="You decide" />
      <StatCard title="Export Format" value="JSON/MD" icon={<FileText size={20} />} desc="Machine readable" />
    </div>
  );
}

function StatCard({ title, value, icon, desc }: { title: string; value: string; icon: React.ReactNode; desc: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/50">{title}</p>
        </div>
      </div>
      <p className="text-[10px] text-white/40">{desc}</p>
    </div>
  );
}

function DataSummaryTab({ categories }: { categories: DataCategory[] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-white flex items-center gap-2">
        <Layers size={16} className="text-violet-400" />
        Data Categories Summary
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/50 border-b border-white/10">
              <th className="pb-2">Category</th>
              <th className="pb-2">Items</th>
              <th className="pb-2">Retention</th>
              <th className="pb-2">Deletable</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.category} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 font-medium text-white">{cat.category}</td>
                <td className="py-3 text-white/60">{cat.examples.length} types</td>
                <td className="py-3 text-white/60">{cat.retentionDays > 365 ? `${cat.retentionDays / 365} years` : `${cat.retentionDays} days`}</td>
                <td className="py-3">
                  {cat.canDelete ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle size={12} /> Yes
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Lock size={12} /> Legal hold
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConsentTab({ consent, onConsentChange, history }: { consent: ConsentSettings; onConsentChange: (key: keyof ConsentSettings, value: boolean) => void; history: ConsentChange[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-white mb-4">Consent Settings</h4>
        <div className="space-y-3">
          {Object.entries(consent).map(([key, value]) => {
            if (key === 'lastUpdated' || key === 'version') return null;
            return (
              <ConsentToggleCard
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                description={getConsentDescription(key)}
                icon={<Settings size={20} />}
                enabled={value as boolean}
                onChange={(v) => onConsentChange(key as keyof ConsentSettings, v)}
                recommended={key === 'analytics' || key === 'personalization'}
              />
            );
          })}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <History size={16} className="text-violet-400" />
            Consent History
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(0, 20).map((change, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${change.newValue ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {change.newValue ? <CheckCircle size={14} className="text-green-400" /> : <AlertCircle size={14} className="text-red-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-white capitalize">{change.setting}</p>
                      <p className="text-xs text-white/50">
                        {change.newValue ? 'Enabled' : 'Disabled'} • {change.source}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-white/40">
                    {new Date(change.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getConsentDescription(key: string): string {
  const descriptions: Record<string, string> = {
    analytics: 'Track page views, clicks, and feature usage to improve the product',
    personalization: 'Customize themes, recommendations, and content based on your behavior',
    aiTraining: 'Use your interactions to improve AI responses and suggestions',
    thirdPartySharing: 'Share anonymized aggregate data with trusted partners',
    marketingEmails: 'Receive occasional product updates, tips, and announcements',
  };
  return descriptions[key] || '';
}

function DataCategoriesTab({ categories }: { categories: DataCategory[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-white flex items-center gap-2">
        <Database size={16} className="text-violet-400" />
        What Data We Collect
      </h4>
      <p className="text-white/50 text-sm">
        All data is stored locally in your browser. Nothing is sent to our servers.
      </p>
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.category} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-semibold text-white">{cat.category}</h5>
                  {cat.canDelete ? (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/30">
                      Deletable
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                      Legal Hold
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm mb-2">{cat.description}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.examples.map((ex) => (
                    <span key={ex} className="text-[10px] bg-white/[0.05] text-white/40 px-2 py-0.5 rounded">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/40">
                  {cat.retentionDays > 365 ? `${cat.retentionDays / 365} years` : `${cat.retentionDays} days`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetentionTab({ policies }: { policies: RetentionPolicy[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-white flex items-center gap-2">
        <Clock size={16} className="text-violet-400" />
        Retention Policies
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/50 border-b border-white/10">
              <th className="pb-2">Category</th>
              <th className="pb-2">Retention</th>
              <th className="pb-2">Auto-Delete</th>
              <th className="pb-2">Legal Basis</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.dataCategory} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 font-medium text-white">{p.dataCategory}</td>
                <td className="py-3 text-white/60">
                  {p.retentionDays > 365 ? `${p.retentionDays / 365} years` : `${p.retentionDays} days`}
                </td>
                <td className="py-3">
                  {p.autoDelete ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle size={12} /> Yes
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Lock size={12} /> No
                    </span>
                  )}
                </td>
                <td className="py-3 text-white/60">{p.legalBasis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ThirdPartyTab({ shares }: { shares: ThirdPartyShare[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-white flex items-center gap-2">
        <Share2 size={16} className="text-violet-400" />
        Third-Party Data Sharing
      </h4>
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Shield size={20} className="text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-green-400">No Third-Party Data Sharing</p>
            <p className="text-green-400/80 text-sm mt-1">
              PortCraft does not share your personal data with any third parties.
              All processing happens locally in your browser.
            </p>
          </div>
        </div>
      </div>

      {shares.length > 0 && (
        <div className="space-y-3">
          {shares.map((share, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{share.recipient}</p>
                  <p className="text-white/60 text-sm mt-1">{share.purpose}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {share.dataCategories.map((cat) => (
                      <span key={cat} className="text-[10px] bg-white/[0.05] text-white/40 px-2 py-0.5 rounded">{cat}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">{new Date(share.timestamp).toLocaleDateString()}</p>
                  <p className="text-[10px] text-white/50">{share.legalBasis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeletionTab({ onDeletion, status }: { onDeletion: (scope: "all" | "analytics" | "recommendations" | "profile" | "events") => void; status: { scope: string; status: string; message?: string } | null }) {
  const deletionOptions = [
    { scope: 'analytics', title: 'Analytics Data', description: 'Page views, clicks, session data', icon: <BarChart2 size={20} />, warning: false },
    { scope: 'recommendations', title: 'Recommendations', description: 'Theme, skill, project, and career suggestions', icon: <Lightbulb size={20} />, warning: false },
    { scope: 'profile', title: 'Profile Data', description: 'Personal info, skills, experience, projects', icon: <User size={20} />, warning: true },
    { scope: 'all', title: 'All Data', description: 'Complete account deletion - cannot be undone', icon: <AlertTriangle size={20} />, warning: true },
  ];

  return (
    <div className="space-y-6">
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            status.status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            status.status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}
        >
          {status.status === 'success' && <CheckCircle size={20} />}
          {status.status === 'error' && <AlertCircle size={20} />}
          {status.status === 'processing' && <RotateCcw size={20} className="animate-spin" />}
          <div>
            <p className="font-medium">{status.message || `${status.scope} deletion ${status.status}`}</p>
            <p className="text-xs text-white/60">Scope: {status.scope}</p>
          </div>
        </motion.div>
      )}

      <div>
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Trash2 size={16} className="text-red-400" />
          Delete Your Data
        </h4>
        <p className="text-white/50 text-sm mb-4">
          Choose what data to delete. This action is irreversible. Your portfolio content in the builder is separate and can be cleared from there.
        </p>
        <div className="space-y-3">
          {deletionOptions.map((opt) => (
            <button
              key={opt.scope}
              onClick={() => onDeletion(opt.scope as any)}
              disabled={status?.status === 'processing'}
              className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                opt.warning
                  ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-violet-500/30 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/10">
                {opt.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{opt.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{opt.description}</p>
              </div>
              {opt.warning && (
                <AlertTriangle size={16} className="text-amber-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-400">Important Notes</p>
            <ul className="text-amber-400/80 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Deleted data cannot be recovered</li>
              <li>Your builder portfolio content is separate</li>
              <li>Consent records are kept for legal compliance</li>
              <li>Export your data first if you want a backup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransparencyTab({ onExport, onReport, exporting }: { onExport: () => void; onReport: () => void; exporting: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={16} className="text-violet-400" />
          Data Export & Transparency
        </h4>
        <p className="text-white/50 text-sm mb-4">
          Download a complete copy of your data or generate a transparency report.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onExport}
            disabled={exporting}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Download size={24} className="text-violet-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Download All Data</p>
                <p className="text-xs text-white/50">Complete JSON export</p>
              </div>
            </div>
            <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
              <li>Profile, skills, experience, projects</li>
              <li>Analytics events & behavior data</li>
              <li>Recommendations & feedback history</li>
              <li>A/B test assignments</li>
            </ul>
          </button>

          <button
            onClick={onReport}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <FileText size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Transparency Report</p>
                <p className="text-xs text-white/50">Markdown format</p>
              </div>
            </div>
            <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
              <li>Data summary & consent status</li>
              <li>Processing purposes & legal basis</li>
              <li>Your rights & how to exercise them</li>
              <li>Third-party sharing details</li>
            </ul>
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h5 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <Info size={16} />
          Your Rights Under Privacy Laws
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-400/80">
          <div>
            <p className="font-medium">GDPR (EU)</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Right to access</li>
              <li>Right to rectification</li>
              <li>Right to erasure</li>
              <li>Right to portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">CCPA (California)</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Right to know</li>
              <li>Right to delete</li>
              <li>Right to opt-out of sale</li>
              <li>Right to non-discrimination</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
        <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Lock size={16} className="text-violet-400" />
          Data Security
        </h5>
        <ul className="text-white/60 text-sm space-y-2 list-disc list-inside">
          <li>All data stored locally in your browser (localStorage)</li>
          <li>No data transmitted to external servers by default</li>
          <li>Third-party API calls (GitHub, LeetCode) are direct browser-to-API</li>
          <li>No cookies, tracking pixels, or fingerprinting</li>
          <li>Open source - audit the code yourself</li>
        </ul>
      </div>
    </div>
  );
}