import React, { useState, useEffect } from 'react';
import { RoleCharter, MetricOKR } from '../../types';
import { useKRA } from '../../context/KRAContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Award,
  Layers,
  Clock,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleEditorModalProps {
  isOpen: boolean;
  roleToEdit: RoleCharter | null;
  defaultDeptId?: string;
  onClose: () => void;
}

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({
  isOpen,
  roleToEdit,
  defaultDeptId,
  onClose,
}) => {
  const { portalData, updateRole, addRole, showToast } = useKRA();

  const isNew = !roleToEdit;

  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState(defaultDeptId || 'engineering');
  const [level, setLevel] = useState('Mid-Level (L2)');
  const [experienceYears, setExperienceYears] = useState('2-4 Years');
  const [mission, setMission] = useState('');
  const [accountabilities, setAccountabilities] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [behavioralComp, setBehavioralComp] = useState<string[]>([]);
  const [technicalComp, setTechnicalComp] = useState<string[]>([]);
  const [domainComp, setDomainComp] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<MetricOKR[]>([]);

  // Temp string inputs for adding array items
  const [newAcc, setNewAcc] = useState('');
  const [newResp, setNewResp] = useState('');
  const [newBeh, setNewBeh] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newDomain, setNewDomain] = useState('');

  const [activeTab, setActiveTab] = useState<'basics' | 'accountability' | 'competencies' | 'metrics'>('basics');

  useEffect(() => {
    if (roleToEdit) {
      setTitle(roleToEdit.title);
      setDepartmentId(roleToEdit.departmentId);
      setLevel(roleToEdit.level);
      setExperienceYears(roleToEdit.experienceYears);
      setMission(roleToEdit.mission || '');
      setAccountabilities(roleToEdit.accountabilities || []);
      setResponsibilities(roleToEdit.responsibilities || []);
      setBehavioralComp(roleToEdit.competencies?.behavioral || []);
      setTechnicalComp(roleToEdit.competencies?.technical || []);
      setDomainComp(roleToEdit.competencies?.domain || []);
      setMetrics(roleToEdit.metricsAndOkrs || []);
    } else {
      setTitle('');
      setDepartmentId(defaultDeptId || portalData.departments[0]?.id || 'engineering');
      setLevel('Mid-Level (L2)');
      setExperienceYears('2-4 Years');
      setMission('');
      setAccountabilities(['', '']);
      setResponsibilities(['', '']);
      setBehavioralComp([]);
      setTechnicalComp([]);
      setDomainComp([]);
      setMetrics([
        { outcomeArea: 'Delivery & Quality', metric: 'On-time delivery rate', target: '>90%', frequency: 'Quarterly', sourceData: 'Jira' }
      ]);
    }
  }, [roleToEdit, defaultDeptId, portalData]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Role title is required', 'error');
      return;
    }

    const cleanRole: RoleCharter = {
      id: roleToEdit?.id || `role-${Date.now()}`,
      title: title.trim(),
      departmentId,
      level,
      experienceYears,
      mission: mission.trim(),
      accountabilities: accountabilities.filter((a) => a.trim().length > 0),
      responsibilities: responsibilities.filter((r) => r.trim().length > 0),
      competencies: {
        behavioral: behavioralComp.filter((b) => b.trim().length > 0),
        technical: technicalComp.filter((t) => t.trim().length > 0),
        domain: domainComp.filter((d) => d.trim().length > 0),
      },
      metricsAndOkrs: metrics.filter((m) => m.metric?.trim().length > 0),
      careerPath: roleToEdit?.careerPath || { previousRoles: [], nextRoles: [] },
      summary: roleToEdit?.summary || '',
    };

    if (isNew) {
      addRole(departmentId, cleanRole);
      showToast(`Created role: "${cleanRole.title}"`, 'success');
    } else {
      updateRole(departmentId, cleanRole);
      showToast(`Updated role: "${cleanRole.title}"`, 'success');
    }

    onClose();
  };

  const addMetricRow = () => {
    setMetrics([
      ...metrics,
      { outcomeArea: 'New Objective', metric: '', target: '', frequency: 'Quarterly', sourceData: 'Direct Measurement' }
    ]);
  };

  const removeMetricRow = (idx: number) => {
    setMetrics(metrics.filter((_, i) => i !== idx));
  };

  const handleMetricChange = (idx: number, field: keyof MetricOKR, value: string) => {
    const updated = [...metrics];
    updated[idx] = { ...updated[idx], [field]: value };
    setMetrics(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div>
            <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400">
              {isNew ? 'New Specification' : 'Modify Charter'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {isNew ? 'Create New Role Charter' : `Editing: ${roleToEdit?.title}`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('basics')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'basics'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border-t-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('accountability')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'accountability'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border-t-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Accountabilities & Duties
          </button>
          <button
            onClick={() => setActiveTab('competencies')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'competencies'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border-t-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skills & Values
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              activeTab === 'metrics'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border-t-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            OKRs & Targets ({metrics.length})
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tab: Basics */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Role Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {portalData.departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Level Tag</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Associate (L1)">Associate (L1)</option>
                    <option value="Mid-Level (L2)">Mid-Level (L2)</option>
                    <option value="Senior (L3)">Senior (L3)</option>
                    <option value="Lead (L4)">Lead (L4)</option>
                    <option value="Management (L4-L5)">Management (L4-L5)</option>
                    <option value="Principal / Architect (L5)">Principal / Architect (L5)</option>
                    <option value="Executive / Director (L6)">Executive / Director (L6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Experience Years</label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 4-6 Years"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Core Mission Statement</label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Summarize the core purpose and organizational outcome of this charter..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Tab: Accountability */}
          {activeTab === 'accountability' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Core Accountabilities (Outcomes Owned)</label>
                <div className="space-y-2">
                  {accountabilities.map((acc, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={acc}
                        onChange={(e) => {
                          const updated = [...accountabilities];
                          updated[idx] = e.target.value;
                          setAccountabilities(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                        placeholder="e.g. Ownership of architecture stability..."
                      />
                      <button
                        type="button"
                        onClick={() => setAccountabilities(accountabilities.filter((_, i) => i !== idx))}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAccountabilities([...accountabilities, ''])}
                    className="btn-secondary !py-1.5 !px-3 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Accountability
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Day-to-Day Responsibilities (Tactical Execution)</label>
                <div className="space-y-2">
                  {responsibilities.map((res, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={res}
                        onChange={(e) => {
                          const updated = [...responsibilities];
                          updated[idx] = e.target.value;
                          setResponsibilities(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                        placeholder="e.g. Conduct daily standups..."
                      />
                      <button
                        type="button"
                        onClick={() => setResponsibilities(responsibilities.filter((_, i) => i !== idx))}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setResponsibilities([...responsibilities, ''])}
                    className="btn-secondary !py-1.5 !px-3 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Responsibility
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Competencies */}
          {activeTab === 'competencies' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-600 dark:text-brand-400 mb-2">Technical Competencies</label>
                <div className="space-y-2">
                  {technicalComp.map((t, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => {
                          const updated = [...technicalComp];
                          updated[idx] = e.target.value;
                          setTechnicalComp(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setTechnicalComp(technicalComp.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTechnicalComp([...technicalComp, ''])}
                    className="btn-secondary !py-1.5 !px-3 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Technical Skill
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-2">Behavioral & Values</label>
                <div className="space-y-2">
                  {behavioralComp.map((b, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...behavioralComp];
                          updated[idx] = e.target.value;
                          setBehavioralComp(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setBehavioralComp(behavioralComp.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBehavioralComp([...behavioralComp, ''])}
                    className="btn-secondary !py-1.5 !px-3 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Behavioral Trait
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Metrics */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-500">Measurable OKRs & Targets</label>
                <button
                  type="button"
                  onClick={addMetricRow}
                  className="btn-primary !py-1.5 !px-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Target Benchmark
                </button>
              </div>

              <div className="space-y-3">
                {metrics.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Metric #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeMetricRow(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Outcome Area</label>
                        <input
                          type="text"
                          value={m.outcomeArea}
                          onChange={(e) => handleMetricChange(idx, 'outcomeArea', e.target.value)}
                          placeholder="e.g. Code Quality"
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Key Metric</label>
                        <input
                          type="text"
                          value={m.metric}
                          onChange={(e) => handleMetricChange(idx, 'metric', e.target.value)}
                          placeholder="e.g. SonarQube Rating A"
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Benchmark</label>
                        <input
                          type="text"
                          value={m.target}
                          onChange={(e) => handleMetricChange(idx, 'target', e.target.value)}
                          placeholder="e.g. 100% compliant"
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={m.frequency || 'Quarterly'}
                          onChange={(e) => handleMetricChange(idx, 'frequency', e.target.value)}
                          placeholder="Quarterly"
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2 !px-4 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary !py-2 !px-6 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isNew ? 'Create Role Charter' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
