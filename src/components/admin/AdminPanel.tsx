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
    } catch (err: any) {
      setGhStatus({ valid: false, message: err.message || 'Verification failed' });
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
        if (res.commitUrl) setLastCommitUrl(res.commitUrl);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Commit failed', 'error');
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDelete = (deptId: string, id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete role "${title}"?`)) {
      deleteRole(deptId, id);
    }
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10 text-left">
      
      {/* Top Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>ER & HR Governance Admin Panel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Role Charter & KRA Management
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Logged in as: <strong>{adminSession.username}</strong> ({adminSession.role}). Modify role specifications, update OKR benchmarks, and publish commits directly to GitHub Pages.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingRole(null);
              setIsEditorOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Role Charter</span>
          </button>

          <button
            onClick={handlePublishCommit}
            disabled={isCommitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-[0.97]"
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
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 max-w-xl">
        <button
          onClick={() => setActiveAdminTab('roles')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'roles'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Roles & KRAs ({allRoles.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('github')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'github'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          GitHub Pages Sync
        </button>

        <button
          onClick={() => setActiveAdminTab('data')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'data'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Data Backup
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

      {/* Tab 2: GitHub Direct Sync */}
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

      {/* Tab 3: Data Backup */}
      {activeAdminTab === 'data' && (
        <div className="max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Data Archive & Recovery
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Export entire portal configuration as JSON or import backup schemas.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={exportJSON}
              className="w-full btn-secondary flex items-center justify-center gap-2 !py-3"
            >
              <Download className="w-4 h-4 text-brand-500" />
              <span>Export Full Portal Backup (JSON)</span>
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full btn-secondary flex items-center justify-center gap-2 !py-3"
              >
                <Upload className="w-4 h-4 text-accent-cyan" />
                <span>Import Backup JSON</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all roles and configurations to default?')) {
                  resetToDefaults();
                }
              }}
              className="w-full p-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Roles to Factory Default</span>
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

    </div>
  );
};
