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
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Layers,
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    resetToDefaults,
    showToast,
  } = useKRA();

  const [activeAdminTab, setActiveAdminTab] = useState<'roles' | 'github' | 'data'>('roles');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Role Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleCharter | null>(null);

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
  const [lastCommitUrl, setLastCommitUrl] = useState<string | null>(null);

  // File upload ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!adminSession.isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center mb-4">
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
    const config: GitHubConfig = {
      owner: ghOwner.trim(),
      repo: ghRepo.trim(),
      branch: ghBranch.trim() || 'main',
      filePath: ghPath.trim() || 'src/data/kras.json',
      token: ghToken.trim(),
    };
    saveGitHubConfig(config);
    const res = await githubService.verifyRepoAccess(config);
    setGhStatus(res);
    setIsTestingGH(false);
  };

  const handlePublishToGitHub = async () => {
    setIsCommitting(true);
    setLastCommitUrl(null);
    const config: GitHubConfig = {
      owner: ghOwner.trim(),
      repo: ghRepo.trim(),
      branch: ghBranch.trim() || 'main',
      filePath: ghPath.trim() || 'src/data/kras.json',
      token: ghToken.trim(),
    };
    saveGitHubConfig(config);
    const res = await commitToGitHub(commitMessage.trim() || undefined);
    if (res.success && res.commitUrl) {
      setLastCommitUrl(res.commitUrl);
    }
    setIsCommitting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Workspace Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ER & HR Administration Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Taazaa KRA Content & Release Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Add or modify role charters, update OKR metrics, and publish updates directly to GitHub Pages.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingRole(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Role Charter</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div>
            <div className="text-2xl font-black text-white">{allRoles.length}</div>
            <div className="text-xs text-slate-400 font-medium">Total Role Charters</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{portalData.departments.length}</div>
            <div className="text-xs text-slate-400 font-medium">Active Departments</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">Live</div>
            <div className="text-xs text-slate-400 font-medium">Workspace Status</div>
          </div>
          <div>
            <div className="text-2xl font-black text-orange-400">
              {gitHubConfig.owner && gitHubConfig.repo ? 'Connected' : 'Config Needed'}
            </div>
            <div className="text-xs text-slate-400 font-medium">GitHub Repository</div>
          </div>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveAdminTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'roles'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Role Charters List ({allRoles.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('github')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'github'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Github className="w-4 h-4" />
          <span>GitHub Direct Sync & Publish</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('data')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'data'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & JSON Restore</span>
        </button>
      </div>

      {/* Tab 1: Roles List */}
      {activeAdminTab === 'roles' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by title or department..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
            >
              <option value="all">All Departments ({allRoles.length})</option>
              {portalData.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.roles.length})
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
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
                  <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {role.title}
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {role.departmentName}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {role.level}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500 font-medium">
                      {role.experienceYears}
                    </td>
                    <td className="p-4 text-center text-xs font-bold text-orange-600 dark:text-orange-400">
                      {role.metricsAndOkrs?.length || 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingRole(role);
                            setIsEditorOpen(true);
                          }}
                          className="p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 dark:text-slate-300 dark:hover:bg-orange-950/40 transition-colors"
                          title="Edit Role"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete role "${role.title}"?`)) {
                              deleteRole(role.departmentId, role.id);
                            }
                          }}
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

      {/* Tab 2: GitHub Direct Sync */}
      {activeAdminTab === 'github' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Github className="w-5 h-5" />
                <span>GitHub Repository & Token Settings</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your repository details and GitHub Personal Access Token (with <code>repo</code> scope) to commit updates directly to GitHub Pages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Repository Owner (User or Org)
                </label>
                <input
                  type="text"
                  value={ghOwner}
                  onChange={(e) => setGhOwner(e.target.value)}
                  placeholder="e.g. shashanksaxena"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={ghRepo}
                  onChange={(e) => setGhRepo(e.target.value)}
                  placeholder="e.g. taazaa-kras"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={ghBranch}
                  onChange={(e) => setGhBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Data File Path
                </label>
                <input
                  type="text"
                  value={ghPath}
                  onChange={(e) => setGhPath(e.target.value)}
                  placeholder="src/data/kras.json"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                GitHub Personal Access Token (PAT)
              </label>
              <input
                type="password"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Stored safely in your browser LocalStorage only. Never sent to any third-party server.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestGitHub}
                disabled={isTestingGH}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
              >
                {isTestingGH ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Test Connection</span>
              </button>

              {ghStatus && (
                <div
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    ghStatus.valid ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {ghStatus.valid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{ghStatus.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Commit Action Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-orange-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Publish Live Changes to GitHub
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              This will create a new git commit directly in your repository. GitHub Pages will build and deploy the update automatically within ~1 minute.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Optional Commit Message
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="e.g. chore(kras): update Senior SDET OKRs and competency matrix"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
              />
            </div>

            <button
              onClick={handlePublishToGitHub}
              disabled={isCommitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all"
            >
              {isCommitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isCommitting ? 'Committing to GitHub...' : 'Publish to GitHub Pages Now'}</span>
            </button>

            {lastCommitUrl && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Commit published successfully!</span>
                <a
                  href={lastCommitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-bold underline hover:opacity-80"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Backup & Data Restore */}
      {activeAdminTab === 'data' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-500" />
              <span>Export & Backup Dataset</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Download the current active KRA database as a standalone formatted JSON file for offline backups or manual repository commits.
            </p>
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-orange-600 dark:hover:bg-orange-500 text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download kras.json Backup</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              <span>Import & Restore Dataset</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload a previously exported JSON backup file to overwrite and restore your KRA charters.
            </p>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Select JSON File to Restore</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3">
            <h3 className="text-lg font-black text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <span>Reset to Factory Defaults</span>
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
              Caution: This will reset all role charters, OKRs, and RACI matrices back to the original parsed Word documents dataset.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data back to the default factory state? Custom edits will be cleared.')) {
                  resetToDefaults();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
            >
              Reset to Original Data
            </button>
          </div>
        </div>
      )}

      {/* Role Editor Modal */}
      <RoleEditorModal
        isOpen={isEditorOpen}
        roleToEdit={editingRole}
        defaultDeptId={selectedDeptFilter !== 'all' ? selectedDeptFilter : 'engineering'}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingRole(null);
        }}
      />
    </div>
  );
};
