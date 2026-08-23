import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  PortalData, 
  RoleCharter, 
  Department, 
  GitHubConfig, 
  AdminSession, 
  RaciItem, 
  KRAVersion 
} from '../types';
import { storageService, normalizePortalData } from '../services/storageService';
import { DEFAULT_VERSION_ID, ADMIN } from '../constants';
import { sha256Hex } from '../utils';
import { githubService, CommitResult } from '../services/githubService';
import { excelService } from '../services/excelService';
import { portalDataSchema } from '../schemas';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface KRAContextType {
  portalData: PortalData;
  activeDepartmentId: string;
  searchQuery: string;
  selectedLevel: string;
  selectedRole: RoleCharter | null;
  comparisonRoles: RoleCharter[];
  adminSession: AdminSession;
  gitHubConfig: GitHubConfig;
  isDarkMode: boolean;
  activeTab: 'kras' | 'raci' | 'frameworks' | 'admin';
  toasts: ToastInfo[];
  
  // Versioning
  activeVersionId: string;
  activeVersion?: KRAVersion;
  isHistoricalVersion: boolean;
  switchVersion: (versionId: string) => void;
  createVersionSnapshot: (name: string, effectiveDate: string, notes?: string) => void;

  // Setters
  setActiveDepartmentId: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedLevel: (lvl: string) => void;
  setSelectedRole: (role: RoleCharter | null) => void;
  toggleCompareRole: (role: RoleCharter) => void;
  removeCompareRole: (roleId: string) => void;
  clearComparison: () => void;
  toggleDarkMode: () => void;
  setActiveTab: (tab: 'kras' | 'raci' | 'frameworks' | 'admin') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Admin & Data operations
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateRole: (departmentId: string, updatedRole: RoleCharter) => void;
  addRole: (departmentId: string, newRole: RoleCharter) => void;
  deleteRole: (departmentId: string, roleId: string) => void;
  updateDepartmentInfo: (departmentId: string, info: Partial<Department>) => void;
  updateRaciMatrix: (newMatrix: RaciItem[]) => void;
  saveGitHubConfig: (config: GitHubConfig) => void;
  commitToGitHub: (message?: string) => Promise<CommitResult>;

  // Multi-Format Export & Import
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
  exportExcel: () => void;
  exportCSV: () => void;
  downloadTemplate: (format?: 'xlsx' | 'csv') => void;
  importSpreadsheet: (file: File) => Promise<boolean>;
  resetToDefaults: () => void;
}

const KRAContext = createContext<KRAContextType | undefined>(undefined);

export const KRAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portalData, setPortalData] = useState<PortalData>(() => storageService.getInitialData());
  const [activeDepartmentId, setActiveDepartmentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<RoleCharter | null>(null);
  const [comparisonRoles, setComparisonRoles] = useState<RoleCharter[]>([]);
  const [activeTab, setActiveTab] = useState<'kras' | 'raci' | 'frameworks' | 'admin'>('kras');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Versioning state
  const [activeVersionId, setActiveVersionId] = useState<string>(
    () => portalData.activeVersionId || portalData.versions?.[0]?.id || DEFAULT_VERSION_ID
  );

  const [adminSession, setAdminSession] = useState<AdminSession>(() => storageService.getAdminSession());
  const [gitHubConfig, setGitHubConfigState] = useState<GitHubConfig>(() => storageService.getGitHubConfig());

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('taazaa_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taazaa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taazaa_theme', 'light');
    }
  }, [isDarkMode]);

  const toastSeqRef = useRef(0);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toastSeqRef.current += 1;
    const id = `toast-${toastSeqRef.current}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleCompareRole = (role: RoleCharter) => {
    setComparisonRoles((prev) => {
      const exists = prev.some((r) => r.id === role.id);
      if (exists) {
        showToast(`Removed "${role.title}" from comparison`, 'info');
        return prev.filter((r) => r.id !== role.id);
      } else {
        if (prev.length >= 3) {
          showToast('You can compare a maximum of 3 roles simultaneously', 'error');
          return prev;
        }
        showToast(`Added "${role.title}" to comparison`, 'success');
        return [...prev, role];
      }
    });
  };

  const removeCompareRole = (roleId: string) => {
    setComparisonRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  const clearComparison = () => {
    setComparisonRoles([]);
    showToast('Comparison cleared', 'info');
  };

  // Switch between Active and Historical Versions
  const activeVersion = portalData.versions?.find((v) => v.id === activeVersionId) || portalData.versions?.[0];
  const isHistoricalVersion = Boolean(activeVersion && activeVersion.id !== portalData.versions?.[0]?.id);

  const switchVersion = (versionId: string) => {
    const targetVersion = portalData.versions?.find((v) => v.id === versionId);
    if (!targetVersion) {
      showToast('Selected version snapshot not found', 'error');
      return;
    }

    setActiveVersionId(versionId);
    setPortalData((prev) => ({
      ...prev,
      activeVersionId: versionId,
      departments: targetVersion.departments,
      raciMatrix: targetVersion.raciMatrix || prev.raciMatrix,
    }));

    if (versionId === portalData.versions?.[0]?.id) {
      showToast(`Switched to Live Active Version (${targetVersion.name})`, 'success');
    } else {
      showToast(`Time Travel: Viewing Historical Archive "${targetVersion.name}"`, 'info');
    }
  };

  // Create a new Version Snapshot
  const createVersionSnapshot = (name: string, effectiveDate: string, notes?: string) => {
    const newVersionId = `v${effectiveDate.replace('-', '.')}.${Date.now().toString().slice(-4)}`;
    const newSnapshot: KRAVersion = {
      id: newVersionId,
      versionNumber: newVersionId,
      name: name.trim(),
      effectiveDate: effectiveDate.trim(),
      createdAt: new Date().toISOString(),
      createdBy: adminSession?.username || 'ER Governance Admin',
      notes: notes?.trim(),
      departments: JSON.parse(JSON.stringify(portalData.departments)),
      raciMatrix: JSON.parse(JSON.stringify(portalData.raciMatrix)),
    };

    const updatedVersions = [newSnapshot, ...(portalData.versions || [])];
    const updatedData: PortalData = {
      ...portalData,
      version: newVersionId,
      lastUpdated: new Date().toISOString().split('T')[0],
      versions: updatedVersions,
      activeVersionId: newVersionId,
    };

    setPortalData(updatedData);
    setActiveVersionId(newVersionId);
    storageService.saveData(updatedData);
    showToast(`Version Snapshot "${name}" created and saved as active!`, 'success');
  };

  // Admin Auth
  const loginAdmin = async (password: string): Promise<boolean> => {
    const digest = await sha256Hex(password);
    if (digest === ADMIN.passcodeSha256) {
      const session: AdminSession = {
        isAuthenticated: true,
        username: 'ER Governance Lead',
        role: 'admin',
      };
      setAdminSession(session);
      storageService.saveAdminSession(session);
      showToast('Admin workspace unlocked. Welcome!', 'success');
      return true;
    }
    showToast('Invalid passcode', 'error');
    return false;
  };

  const logoutAdmin = () => {
    const session: AdminSession = { isAuthenticated: false, username: '', role: 'editor' };
    setAdminSession(session);
    storageService.clearAdminSession();
    setActiveTab('kras');
    showToast('Logged out of Admin workspace', 'info');
  };

  // Role CRUD
  const updateRole = (departmentId: string, updatedRole: RoleCharter) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        const roleExists = dept.roles.some((r) => r.id === updatedRole.id);
        const roles = roleExists
          ? dept.roles.map((r) => (r.id === updatedRole.id ? updatedRole : r))
          : [...dept.roles, updatedRole];
        return { ...dept, roles };
      }
      return {
        ...dept,
        roles: dept.roles.filter((r) => r.id !== updatedRole.id),
      };
    });

    const updatedData: PortalData = {
      ...portalData,
      departments: updatedDepartments,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPortalData(updatedData);
    storageService.saveData(updatedData);
    showToast(`Charter for "${updatedRole.title}" saved successfully`, 'success');
  };

  const addRole = (departmentId: string, newRole: RoleCharter) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          roles: [...dept.roles, newRole],
        };
      }
      return dept;
    });

    const updatedData: PortalData = {
      ...portalData,
      departments: updatedDepartments,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPortalData(updatedData);
    storageService.saveData(updatedData);
    showToast(`New role "${newRole.title}" added to ${departmentId}`, 'success');
  };

  const deleteRole = (departmentId: string, roleId: string) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          roles: dept.roles.filter((r) => r.id !== roleId),
        };
      }
      return dept;
    });

    const updatedData: PortalData = {
      ...portalData,
      departments: updatedDepartments,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPortalData(updatedData);
    storageService.saveData(updatedData);
    showToast('Role deleted', 'info');
  };

  const updateDepartmentInfo = (departmentId: string, info: Partial<Department>) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        return { ...dept, ...info };
      }
      return dept;
    });

    const updatedData: PortalData = {
      ...portalData,
      departments: updatedDepartments,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPortalData(updatedData);
    storageService.saveData(updatedData);
  };

  const updateRaciMatrix = (newMatrix: RaciItem[]) => {
    const updatedData: PortalData = {
      ...portalData,
      raciMatrix: newMatrix,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setPortalData(updatedData);
    storageService.saveData(updatedData);
    showToast('RACI Matrix saved', 'success');
  };

  const saveGitHubConfig = (config: GitHubConfig) => {
    setGitHubConfigState(config);
    storageService.saveGitHubConfig(config);
  };

  const commitToGitHub = async (customMessage?: string): Promise<CommitResult> => {
    return await githubService.commitChanges(gitHubConfig, portalData, customMessage);
  };

  // Export / Import Operations
  const exportJSON = () => {
    storageService.exportJSON(portalData);
    showToast('Exported backup JSON bundle', 'success');
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      const validated = portalDataSchema.safeParse(parsed);
      if (validated.success) {
        const merged: PortalData = { ...parsed, ...validated.data };
        const normalized = normalizePortalData(merged);
        setPortalData(normalized);
        setActiveVersionId(normalized.activeVersionId || DEFAULT_VERSION_ID);
        storageService.saveData(normalized);
        showToast(`Successfully imported ${normalized.departments.length} departments`, 'success');
        return true;
      }
      showToast(`Invalid JSON schema: ${validated.error.issues[0]?.message ?? 'unknown error'}`, 'error');
      return false;
    } catch (err: unknown) {
      showToast(`Import failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
      return false;
    }
  };

  const exportExcel = () => {
    excelService.exportToExcel(portalData, activeVersion);
    showToast('Generated and exported formatted Excel workbook (.xlsx)', 'success');
  };

  const exportCSV = () => {
    excelService.exportToCSV(portalData, activeVersion);
    showToast('Exported Role Charters as CSV', 'success');
  };

  const downloadTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
    excelService.downloadTemplate(format);
    showToast(`Downloaded KRA import template (${format.toUpperCase()})`, 'info');
  };

  const importSpreadsheet = async (file: File): Promise<boolean> => {
    try {
      const { roles, count } = await excelService.parseSpreadsheet(file);
      if (count === 0) {
        showToast('No valid roles detected in spreadsheet', 'error');
        return false;
      }

      // Group roles by department
      const deptMap: Record<string, RoleCharter[]> = {};
      roles.forEach((r) => {
        if (!deptMap[r.departmentId]) deptMap[r.departmentId] = [];
        deptMap[r.departmentId].push(r);
      });

      const updatedDepartments = portalData.departments.map((dept) => {
        const importedRolesForDept = deptMap[dept.id] || [];
        if (importedRolesForDept.length === 0) return dept;

        // Merge: update existing by title/id, append new
        const existingRoles = [...dept.roles];
        importedRolesForDept.forEach((impRole) => {
          const matchIndex = existingRoles.findIndex(
            (er) => er.id === impRole.id || er.title.toLowerCase() === impRole.title.toLowerCase()
          );
          if (matchIndex >= 0) {
            existingRoles[matchIndex] = impRole;
          } else {
            existingRoles.push(impRole);
          }
        });

        return { ...dept, roles: existingRoles };
      });

      const updatedData: PortalData = {
        ...portalData,
        departments: updatedDepartments,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      setPortalData(updatedData);
      storageService.saveData(updatedData);
      showToast(`Successfully imported & merged ${count} roles from ${file.name}!`, 'success');
      return true;
    } catch (err: unknown) {
      showToast(`Spreadsheet import error: ${err instanceof Error ? err.message : String(err)}`, 'error');
      return false;
    }
  };

  const resetToDefaults = () => {
    const data = storageService.resetToDefault();
    setPortalData(data);
    setActiveVersionId(data.activeVersionId || DEFAULT_VERSION_ID);
    showToast('Reset all roles to factory bundle', 'info');
  };

  return (
    <KRAContext.Provider
      value={{
        portalData,
        activeDepartmentId,
        searchQuery,
        selectedLevel,
        selectedRole,
        comparisonRoles,
        adminSession,
        gitHubConfig,
        isDarkMode,
        activeTab,
        toasts,
        activeVersionId,
        activeVersion,
        isHistoricalVersion,
        switchVersion,
        createVersionSnapshot,
        setActiveDepartmentId,
        setSearchQuery,
        setSelectedLevel,
        setSelectedRole,
        toggleCompareRole,
        removeCompareRole,
        clearComparison,
        toggleDarkMode,
        setActiveTab,
        showToast,
        removeToast,
        loginAdmin,
        logoutAdmin,
        updateRole,
        addRole,
        deleteRole,
        updateDepartmentInfo,
        updateRaciMatrix,
        saveGitHubConfig,
        commitToGitHub,
        exportJSON,
        importJSON,
        exportExcel,
        exportCSV,
        downloadTemplate,
        importSpreadsheet,
        resetToDefaults,
      }}
    >
      {children}
    </KRAContext.Provider>
  );
};

export const useKRA = () => {
  const context = useContext(KRAContext);
  if (!context) {
    throw new Error('useKRA must be used within a KRAProvider');
  }
  return context;
};
