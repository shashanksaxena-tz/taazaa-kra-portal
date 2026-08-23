import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { RoleCharter, GitHubConfig } from '../../types';
import { RoleEditorModal } from './RoleEditorModal';
import { githubService } from '../../services/githubService';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Github, 
  Download, 
  Upload, 
  RotateCcw, 
  Search, 
  Loader2, 
  FileSpreadsheet,
  FileText,
  History,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminPanel: React.FC = () => {
  const {
    portalData,
    adminSession,
    gitHubConfig,
    saveGitHubConfig,
    commitToGitHub,
    deleteRole,
    exportJSON,
    importJSON,
    exportExcel,
    exportCSV,
    downloadTemplate,
    importSpreadsheet,
    resetToDefaults,
    activeVersionId,
    switchVersion,
    createVersionSnapshot,
    showToast,
  } = useKRA();

  const [activeAdminTab, setActiveAdminTab] = useState<'roles' | 'versions' | 'import-export' | 'github'>('roles');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Role Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleCharter | null>(null);

  // Version snapshot creation modal state
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDate, setNewVersionDate] = useState(new Date().toISOString().slice(0, 7)); // e.g. 2026-08
  const [newVersionNotes, setNewVersionNotes] = useState('');

  // GitHub form state
  const [ghOwner, setGhOwner] = useState(gitHubConfig.owner || '');
  const [ghRepo, setGhRepo] = useState(gitHubConfig.repo || '');
  const [ghBranch, setGhBranch] = useState(gitHubConfig.branch || 'main');
  const [ghPath, setGhPath] = useState(gitHubConfig.filePath || 'src/data/kras.json');
  const [ghToken, setGhToken] = useState(gitHubConfig.token || '');
  const [commitMessage, setCommitMessage] = useState('');

  const [isTestingGH, setIsTestingGH] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [ghStatus, setGhStatus] = useState<{ valid: boolean; message: string } | null>(null);

  // File upload refs
  const spreadsheetInputRef = React.useRef<HTMLInputElement>(null);
  const jsonInputRef = React.useRef<HTMLInputElement>(null);

  if (!adminSession.isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Admin Authentication Required
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Please click "Admin Login" in the top bar to access the ER management workspace.
        </p>
      </div>
    );
  }

  // All roles flattened
  const allRoles = portalData.departments.flatMap((d) =>
    d.roles.map((r) => ({ ...r, departmentName: d.name }))
  );

  const filteredRoles = allRoles.filter((r) => {
    if (selectedDeptFilter !== 'all' && r.departmentId !== selectedDeptFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.departmentName.toLowerCase().includes(q) ||
        r.level.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTestGitHub = async () => {
    setIsTestingGH(true);
    setGhStatus(null);
    try {
      const config: GitHubConfig = {
        owner: ghOwner.trim(),
        repo: ghRepo.trim(),
        branch: ghBranch.trim(),
        filePath: ghPath.trim(),
        token: ghToken.trim(),
      };
      const res = await githubService.verifyRepoAccess(config);
      setGhStatus(res);
      if (res.valid) {
        saveGitHubConfig(config);
        showToast('GitHub Connection Verified & Config Saved', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: unknown) {
      setGhStatus({ valid: false, message: err instanceof Error ? err.message || 'Verification failed' : 'Verification failed' });
    } finally {
      setIsTestingGH(false);
    }
  };

  const handlePublishCommit = async () => {
    if (!ghToken) {
      showToast('Personal Access Token is required to commit to GitHub', 'error');
      setActiveAdminTab('github');
      return;
    }

    setIsCommitting(true);
    try {
      const config: GitHubConfig = {
        owner: ghOwner.trim(),
        repo: ghRepo.trim(),
        branch: ghBranch.trim(),
        filePath: ghPath.trim(),
        token: ghToken.trim(),
      };
      saveGitHubConfig(config);

      const msg = commitMessage.trim() || `update(kras): ER governance update via Portal [${new Date().toISOString()}]`;
      const res = await commitToGitHub(msg);
      if (res.success) {
        showToast('Changes committed directly to GitHub! Deploy workflow triggered.', 'success');
        setCommitMessage('');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Commit failed', 'error');
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDelete = (deptId: string, id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete role "${title}"?`)) {
      deleteRole(deptId, id);
    }
  };

  const handleSpreadsheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importSpreadsheet(file);
    if (spreadsheetInputRef.current) spreadsheetInputRef.current.value = '';
  };

  const handleJSONUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !window.confirm(
        `Importing "${file.name}" will REPLACE all current role charters, departments and version history. This cannot be undone. Continue?`
      )
    ) {
      if (jsonInputRef.current) jsonInputRef.current.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  const handleCreateSnapshotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) {
      showToast('Version name is required', 'error');
      return;
    }
    createVersionSnapshot(newVersionName, newVersionDate, newVersionNotes);
    setNewVersionName('');
    setNewVersionNotes('');
    setIsCreateVersionOpen(false);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-10 text-left">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>ER & HR Governance Admin Panel</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Role Charter & KRA Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Logged in as: <strong>{adminSession.username}</strong> ({adminSession.role}). Modify role specifications, track historical snapshots, import/export Excel & CSV files, and push commits to GitHub Pages.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setEditingRole(null);
              setIsEditorOpen(true);
            }}
            className="btn-primary !py-2.5 !px-4 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role Charter</span>
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-[0.97]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePublishCommit}
            disabled={isCommitting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-[0.97]"
          >
            {isCommitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            <span>Publish to GitHub</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto max-w-3xl">
        <button
          onClick={() => setActiveAdminTab('roles')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'roles'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Roles & KRAs ({allRoles.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('versions')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'versions'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Version History ({portalData.versions?.length || 0})
        </button>

        <button
          onClick={() => setActiveAdminTab('import-export')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'import-export'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Excel / CSV Sync
        </button>

        <button
          onClick={() => setActiveAdminTab('github')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'github'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          GitHub CI/CD
        </button>
      </div>

      {/* Tab 1: Roles Management */}
      {activeAdminTab === 'roles' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search charters..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Departments</option>
                {portalData.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Roles Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Role Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4 text-center">OKRs</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {role.title}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {role.departmentName}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                        {role.level}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {role.experienceYears}
                    </td>
                    <td className="p-4 text-center text-xs font-bold text-brand-600 dark:text-brand-400">
                      {role.metricsAndOkrs?.length || 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingRole(role);
                            setIsEditorOpen(true);
                          }}
                          className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 dark:text-slate-300 dark:hover:bg-brand-950/40 transition-colors"
                          title="Edit Charter"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(role.departmentId, role.id, role.title)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 2: Version History & Historical Snapshots */}
      {activeAdminTab === 'versions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-brand-500" />
                <span>KRA Version History & Time-Travel Snapshots</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Freeze and version KRA baselines by month or year (e.g. 2024 Archive, Q1 2026, Mid-Year Updates) so employees can review past expectations.
              </p>
            </div>

            <button
              onClick={() => setIsCreateVersionOpen(true)}
              className="btn-primary flex items-center gap-2 !py-2.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Version Snapshot</span>
            </button>
          </div>

          {/* Versions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portalData.versions?.map((ver, idx) => {
              const isActive = ver.id === activeVersionId;
              const isLive = idx === 0;
              const totalRolesCount = ver.departments.reduce((acc, d) => acc + d.roles.length, 0);

              return (
                <div
                  key={ver.id}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                    isActive
                      ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ver.versionNumber}
                        </span>
                        {isLive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Current Live
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                            Active in UI
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                        {ver.name}
                      </h4>
                    </div>

                    <div className="text-right text-xs text-slate-500 font-mono">
                      <div>Effective: <strong>{ver.effectiveDate}</strong></div>
                      <div className="text-[11px] text-slate-400">{ver.createdAt?.split('T')[0]}</div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {ver.notes || 'Organizational baseline snapshot.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-medium">
                      Archived: <strong>{totalRolesCount} Roles</strong> across <strong>{ver.departments.length} Pillars</strong>
                    </div>

                    <button
                      onClick={() => switchVersion(ver.id)}
                      disabled={isActive}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white cursor-default'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {isActive ? 'Currently Active' : 'Switch to This Snapshot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Format Import / Export (Excel, CSV, JSON) */}
      {activeAdminTab === 'import-export' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Export Panel */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
                <Download className="w-3.5 h-3.5" />
                <span>Multi-Format Export</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Export KRA & Role Charters
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Download structured organizational spreadsheets for HR distribution, executive reviews, or offline archiving.
              </p>
            </div>

            <div className="space-y-3.5">
              
              {/* Excel XLSX Export */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Microsoft Excel Workbook (.xlsx)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Multi-tab spreadsheet: Role Charters, OKR Targets & RACI Matrix.
                    </p>
                  </div>
                </div>

                <button
                  onClick={exportExcel}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap shadow-sm active:scale-[0.96]"
                >
                  Export .XLSX
                </button>
              </div>

              {/* CSV Export */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-700 text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Comma Separated Values (.csv)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Standard flat CSV format for Google Sheets & HR databases.
                    </p>
                  </div>
                </div>

                <button
                  onClick={exportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold whitespace-nowrap active:scale-[0.96]"
                >
                  Export .CSV
                </button>
              </div>

              {/* JSON Backup Export */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-600 text-white">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Full System JSON Backup (.json)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Complete database bundle with versions & framework specs.
                    </p>
                  </div>
                </div>

                <button
                  onClick={exportJSON}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold whitespace-nowrap active:scale-[0.96]"
                >
                  Export .JSON
                </button>
              </div>

            </div>
          </div>

          {/* Import Panel */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold mb-2">
                <Upload className="w-3.5 h-3.5" />
                <span>Bulk Import & Merge</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Upload Excel / CSV Spreadsheets
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload updated role specifications from Excel or CSV to instantly merge into the portal.
              </p>
            </div>

            {/* Template Download Helpers */}
            <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-slate-800/60 border border-brand-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                <Info className="w-4 h-4" />
                <span>Need a ready-made template to fill out?</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Download our formatted HR template with pre-built columns and sample data for easy editing.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadTemplate('xlsx')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-500 transition-colors"
                >
                  Download Excel Template (.xlsx)
                </button>
                <button
                  onClick={() => downloadTemplate('csv')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-500 transition-colors"
                >
                  Download CSV Template (.csv)
                </button>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="space-y-3">
              <input
                ref={spreadsheetInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleSpreadsheetUpload}
                className="hidden"
              />
              <button
                onClick={() => spreadsheetInputRef.current?.click()}
                className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Upload & Import Excel / CSV Spreadsheet</span>
              </button>

              <input
                ref={jsonInputRef}
                type="file"
                accept=".json"
                onChange={handleJSONUpload}
                className="hidden"
              />
              <button
                onClick={() => jsonInputRef.current?.click()}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import JSON Backup Schema</span>
              </button>
            </div>

            {/* Factory Reset */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  if (window.confirm('Reset all roles, versions, and configurations to default?')) {
                    resetToDefaults();
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Data to Factory Default Bundle</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Tab 4: GitHub Direct Sync */}
      {activeAdminTab === 'github' && (
        <div className="max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                GitHub Pages Remote Sync
              </h3>
              <p className="text-xs text-slate-500">
                Direct commits to your repository via GitHub REST API.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Repo Owner</label>
              <input
                type="text"
                value={ghOwner}
                onChange={(e) => setGhOwner(e.target.value)}
                placeholder="shashanksaxena-tz"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Repo Name</label>
              <input
                type="text"
                value={ghRepo}
                onChange={(e) => setGhRepo(e.target.value)}
                placeholder="taazaa-kra-portal"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Branch</label>
              <input
                type="text"
                value={ghBranch}
                onChange={(e) => setGhBranch(e.target.value)}
                placeholder="main"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">File Path</label>
              <input
                type="text"
                value={ghPath}
                onChange={(e) => setGhPath(e.target.value)}
                placeholder="src/data/kras.json"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">GitHub Personal Access Token (PAT)</label>
            <input
              type="password"
              value={ghToken}
              onChange={(e) => setGhToken(e.target.value)}
              placeholder="ghp_••••••••••••••••"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Requires <code>repo</code> or <code>contents:write</code> scope. Stored locally in your browser only.
            </p>
          </div>

          {ghStatus && (
            <div className={`p-4 rounded-2xl text-xs font-bold border ${ghStatus.valid ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
              {ghStatus.message}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleTestGitHub}
              disabled={isTestingGH}
              className="flex-1 btn-secondary"
            >
              {isTestingGH ? 'Verifying...' : 'Verify Connection'}
            </button>

            <button
              onClick={handlePublishCommit}
              disabled={isCommitting}
              className="flex-1 btn-primary"
            >
              {isCommitting ? 'Committing...' : 'Commit & Push Now'}
            </button>
          </div>
        </div>
      )}

      {/* Role Editor Modal */}
      {isEditorOpen && (
        <RoleEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          roleToEdit={editingRole}
        />
      )}

      {/* Create Version Snapshot Modal */}
      <AnimatePresence>
        {isCreateVersionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setIsCreateVersionOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Create KRA Version Snapshot
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Locks in the current state of all role charters and OKRs into a versioned historical archive.
                </p>
              </div>

              <form onSubmit={handleCreateSnapshotSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Version Name *
                  </label>
                  <input
                    type="text"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    placeholder="e.g. Mid-Year 2026 Revision (Aug 2026)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Effective Month / Year *
                  </label>
                  <input
                    type="month"
                    value={newVersionDate}
                    onChange={(e) => setNewVersionDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Release Notes / Context
                  </label>
                  <textarea
                    value={newVersionNotes}
                    onChange={(e) => setNewVersionNotes(e.target.value)}
                    placeholder="Describe what changed in this version snapshot (e.g. Added Principal Architect role, updated SDET automation targets)..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateVersionOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Save & Activate Snapshot
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
