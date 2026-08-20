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

  // Temp string input holders for list items
  const [newAcc, setNewAcc] = useState('');
  const [newResp, setNewResp] = useState('');
  const [newBehav, setNewBehav] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newDomain, setNewDomain] = useState('');

  // Active form section tab
  const [activeFormTab, setActiveFormTab] = useState<'core' | 'accountabilities' | 'competencies' | 'metrics'>('core');

  useEffect(() => {
    if (roleToEdit) {
      setTitle(roleToEdit.title || '');
      setDepartmentId(roleToEdit.departmentId || 'engineering');
      setLevel(roleToEdit.level || 'Mid-Level (L2)');
      setExperienceYears(roleToEdit.experienceYears || '2-4 Years');
      setMission(roleToEdit.mission || '');
      setAccountabilities(roleToEdit.accountabilities ? [...roleToEdit.accountabilities] : []);
      setResponsibilities(roleToEdit.responsibilities ? [...roleToEdit.responsibilities] : []);
      setBehavioralComp(roleToEdit.competencies?.behavioral ? [...roleToEdit.competencies.behavioral] : []);
      setTechnicalComp(roleToEdit.competencies?.technical ? [...roleToEdit.competencies.technical] : []);
      setDomainComp(roleToEdit.competencies?.domain ? [...roleToEdit.competencies.domain] : []);
      setMetrics(roleToEdit.metricsAndOkrs ? [...roleToEdit.metricsAndOkrs] : []);
    } else {
      setTitle('');
      setDepartmentId(defaultDeptId || 'engineering');
      setLevel('Mid-Level (L2)');
      setExperienceYears('2-4 Years');
      setMission('');
      setAccountabilities([
        'Drive high-quality deliverables aligned with organizational and client goals.',
        'Proactively resolve technical and functional blockers within sprint cycles.',
      ]);
      setResponsibilities([
        'Execute assigned roadmap milestones with predictable velocity and high quality.',
        'Collaborate across cross-functional teams and actively participate in reviews.',
      ]);
      setBehavioralComp([
        'Owns It (Taazaa Owner Level): Takes full accountability for delivery outcomes.',
        'Continuous Improvement: Champions innovation and knowledge sharing.',
      ]);
      setTechnicalComp([
        'Demonstrates deep expertise in relevant domain tools and frameworks.',
      ]);
      setDomainComp([
        'Understands client business objectives and Agile best practices.',
      ]);
      setMetrics([
        {
          outcomeArea: 'Delivery & Quality',
          metric: 'On-time milestone completion with zero critical production defects',
          target: '>= 95% on-time',
          sourceData: 'Jira Reports / Sprint Velocity',
          frequency: 'Quarterly',
        },
      ]);
    }
  }, [roleToEdit, defaultDeptId, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a role title.', 'error');
      return;
    }
    if (!mission.trim()) {
      showToast('Please enter a core mission statement.', 'error');
      return;
    }

    const roleId = roleToEdit
      ? roleToEdit.id
      : title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

    const updatedRoleObj: RoleCharter = {
      id: roleId,
      title: title.trim(),
      departmentId,
      level,
      experienceYears: experienceYears.trim(),
      mission: mission.trim(),
      summary: `Key role in driving high performance and excellence.`,
      accountabilities,
      responsibilities,
      competencies: {
        behavioral: behavioralComp,
        technical: technicalComp,
        domain: domainComp,
      },
      metricsAndOkrs: metrics,
      careerPath: roleToEdit?.careerPath || { previousRoles: [], nextRoles: [] },
      sourceDoc: roleToEdit?.sourceDoc || 'Created in Taazaa Admin Portal',
    };

    if (isNew) {
      addRole(departmentId, updatedRoleObj);
    } else {
      updateRole(departmentId, updatedRoleObj);
    }

    onClose();
  };

  const handleAddMetric = () => {
    setMetrics((prev) => [
      ...prev,
      {
        outcomeArea: 'New Performance Area',
        metric: 'Metric description and standard',
        target: 'Target benchmark',
        sourceData: 'Jira / CSAT',
        frequency: 'Quarterly',
      },
    ]);
  };

  const handleMetricChange = (index: number, field: keyof MetricOKR, value: string) => {
    setMetrics((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isNew ? 'Create New Role Charter' : `Edit: ${roleToEdit.title}`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Changes are saved instantly to your workspace and can be published directly to GitHub.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFormTab('core')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFormTab === 'core'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            1. Core Info & Mission
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('accountabilities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFormTab === 'accountabilities'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            2. Accountabilities & Activities ({accountabilities.length + responsibilities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('competencies')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFormTab === 'competencies'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            3. Competencies
          </button>
          <button
            type="button"
            onClick={() => setActiveFormTab('metrics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFormTab === 'metrics'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            4. OKRs & Metrics ({metrics.length})
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Core Info */}
          {activeFormTab === 'core' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead Software Engineer"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  >
                    {portalData.departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Experience Level *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
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
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Experience Years *
                  </label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 4-6 Years"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Core Mission Statement *
                </label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={4}
                  placeholder="Define the primary mission and core purpose of this designation..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Section 2: Accountabilities & Responsibilities */}
          {activeFormTab === 'accountabilities' && (
            <div className="space-y-6">
              {/* Accountabilities */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Primary Accountabilities
                </label>
                <div className="space-y-2">
                  {accountabilities.map((acc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={acc}
                        onChange={(e) => {
                          const next = [...accountabilities];
                          next[idx] = e.target.value;
                          setAccountabilities(next);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setAccountabilities(accountabilities.filter((_, i) => i !== idx))}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAcc}
                    onChange={(e) => setNewAcc(e.target.value)}
                    placeholder="Add an accountability statement..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newAcc.trim()) {
                          setAccountabilities([...accountabilities, newAcc.trim()]);
                          setNewAcc('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAcc.trim()) {
                        setAccountabilities([...accountabilities, newAcc.trim()]);
                        setNewAcc('');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-700 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Key Activities & Responsibilities
                </label>
                <div className="space-y-2">
                  {responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => {
                          const next = [...responsibilities];
                          next[idx] = e.target.value;
                          setResponsibilities(next);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setResponsibilities(responsibilities.filter((_, i) => i !== idx))}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResp}
                    onChange={(e) => setNewResp(e.target.value)}
                    placeholder="Add a key activity or responsibility..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newResp.trim()) {
                          setResponsibilities([...responsibilities, newResp.trim()]);
                          setNewResp('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newResp.trim()) {
                        setResponsibilities([...responsibilities, newResp.trim()]);
                        setNewResp('');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-700 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Competencies */}
          {activeFormTab === 'competencies' && (
            <div className="space-y-6">
              {/* Behavioral */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-amber-600">
                  Behavioral Competencies (Taazaa Owner Level)
                </label>
                {behavioralComp.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const next = [...behavioralComp];
                        next[idx] = e.target.value;
                        setBehavioralComp(next);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setBehavioralComp(behavioralComp.filter((_, i) => i !== idx))}
                      className="p-2 text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBehav}
                    onChange={(e) => setNewBehav(e.target.value)}
                    placeholder="Add behavioral competency..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBehav.trim()) {
                        setBehavioralComp([...behavioralComp, newBehav.trim()]);
                        setNewBehav('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Technical */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase text-emerald-600">
                  Technical & Functional Competencies
                </label>
                {technicalComp.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={t}
                      onChange={(e) => {
                        const next = [...technicalComp];
                        next[idx] = e.target.value;
                        setTechnicalComp(next);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setTechnicalComp(technicalComp.filter((_, i) => i !== idx))}
                      className="p-2 text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technical competency..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTech.trim()) {
                        setTechnicalComp([...technicalComp, newTech.trim()]);
                        setNewTech('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Metrics & OKRs Table */}
          {activeFormTab === 'metrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Key Performance Indicators & OKR Benchmarks
                </label>
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add OKR Row</span>
                </button>
              </div>

              <div className="space-y-3">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-600">Metric #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Outcome Area</label>
                        <input
                          type="text"
                          value={m.outcomeArea}
                          onChange={(e) => handleMetricChange(idx, 'outcomeArea', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Benchmark</label>
                        <input
                          type="text"
                          value={m.target}
                          onChange={(e) => handleMetricChange(idx, 'target', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Metric Description</label>
                        <input
                          type="text"
                          value={m.metric}
                          onChange={(e) => handleMetricChange(idx, 'metric', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Source / Frequency</label>
                        <input
                          type="text"
                          value={m.sourceData}
                          onChange={(e) => handleMetricChange(idx, 'sourceData', e.target.value)}
                          placeholder="Jira / Quarterly"
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
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20"
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
