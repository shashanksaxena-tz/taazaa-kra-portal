import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortalData, RoleCharter, Department, GitHubConfig, AdminSession, RaciItem } from '../types';
import { storageService } from '../services/storageService';
import { githubService, CommitResult } from '../services/githubService';

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
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  updateRole: (departmentId: string, updatedRole: RoleCharter) => void;
  addRole: (departmentId: string, newRole: RoleCharter) => void;
  deleteRole: (departmentId: string, roleId: string) => void;
  updateDepartmentInfo: (departmentId: string, info: Partial<Department>) => void;
  updateRaciMatrix: (newMatrix: RaciItem[]) => void;
  saveGitHubConfig: (config: GitHubConfig) => void;
  commitToGitHub: (message?: string) => Promise<CommitResult>;
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
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
        return prev.filter((r) => r.id !== role.id);
      }
      if (prev.length >= 2) {
        showToast('You can compare maximum 2 roles at a time. Replacing the oldest one.', 'info');
        return [prev[1], role];
      }
      showToast(`Added "${role.title}" to comparison matrix`, 'success');
      return [...prev, role];
    });
  };

  const removeCompareRole = (roleId: string) => {
    setComparisonRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  const clearComparison = () => {
    setComparisonRoles([]);
  };

  const loginAdmin = (passcode: string): boolean => {
    // Standard passcode for Taazaa ER / HR admin
    if (passcode === 'taazaa2026' || passcode === 'admin123' || passcode === 'taazaa-er') {
      const session: AdminSession = { isAuthenticated: true, username: 'ER Admin', role: 'admin' };
      setAdminSession(session);
      storageService.saveAdminSession(session);
      showToast('Welcome to ER Admin Mode! You can now edit and manage KRAs.', 'success');
      return true;
    }
    showToast('Invalid admin passcode. Please verify your credentials.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    const session: AdminSession = { isAuthenticated: false, username: '', role: 'editor' };
    setAdminSession(session);
    storageService.clearAdminSession();
    setActiveTab('kras');
    showToast('Logged out of Admin Mode.', 'info');
  };

  const persistData = (newData: PortalData) => {
    setPortalData(newData);
    storageService.saveData(newData);
  };

  const updateRole = (departmentId: string, updatedRole: RoleCharter) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        const updatedRoles = dept.roles.map((r) => (r.id === updatedRole.id ? updatedRole : r));
        return { ...dept, roles: updatedRoles };
      }
      return dept;
    });

    const newData: PortalData = {
      ...portalData,
      lastUpdated: new Date().toISOString().split('T')[0],
      departments: updatedDepartments,
    };
    persistData(newData);
    showToast(`Role "${updatedRole.title}" updated successfully.`, 'success');

    if (selectedRole && selectedRole.id === updatedRole.id) {
      setSelectedRole(updatedRole);
    }
  };

  const addRole = (departmentId: string, newRole: RoleCharter) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        return { ...dept, roles: [...dept.roles, newRole] };
      }
      return dept;
    });

    const newData: PortalData = {
      ...portalData,
      lastUpdated: new Date().toISOString().split('T')[0],
      departments: updatedDepartments,
    };
    persistData(newData);
    showToast(`New role "${newRole.title}" added to ${departmentId}!`, 'success');
  };

  const deleteRole = (departmentId: string, roleId: string) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        return { ...dept, roles: dept.roles.filter((r) => r.id !== roleId) };
      }
      return dept;
    });

    const newData: PortalData = {
      ...portalData,
      lastUpdated: new Date().toISOString().split('T')[0],
      departments: updatedDepartments,
    };
    persistData(newData);
    showToast(`Role deleted successfully.`, 'info');
    if (selectedRole && selectedRole.id === roleId) {
      setSelectedRole(null);
    }
  };

  const updateDepartmentInfo = (departmentId: string, info: Partial<Department>) => {
    const updatedDepartments = portalData.departments.map((dept) => {
      if (dept.id === departmentId) {
        return { ...dept, ...info };
      }
      return dept;
    });

    const newData: PortalData = {
      ...portalData,
      lastUpdated: new Date().toISOString().split('T')[0],
      departments: updatedDepartments,
    };
    persistData(newData);
    showToast(`Department information updated.`, 'success');
  };

  const updateRaciMatrix = (newMatrix: RaciItem[]) => {
    const newData: PortalData = {
      ...portalData,
      lastUpdated: new Date().toISOString().split('T')[0],
      raciMatrix: newMatrix,
    };
    persistData(newData);
    showToast(`RACI Matrix updated.`, 'success');
  };

  const saveGitHubConfig = (config: GitHubConfig) => {
    setGitHubConfigState(config);
    storageService.saveGitHubConfig(config);
    showToast('GitHub configuration saved.', 'success');
  };

  const commitToGitHub = async (customMessage?: string): Promise<CommitResult> => {
    const result = await githubService.commitChanges(gitHubConfig, portalData, customMessage);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  };

  const exportJSON = () => {
    storageService.exportJSON(portalData);
    showToast('Backup JSON exported to your Downloads folder.', 'success');
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.departments)) {
        persistData(parsed);
        showToast('KRA dataset successfully imported and applied!', 'success');
        return true;
      }
      showToast('Invalid JSON file format. Missing departments array.', 'error');
      return false;
    } catch (e: any) {
      showToast(`Failed to parse JSON: ${e.message}`, 'error');
      return false;
    }
  };

  const resetToDefaults = () => {
    const def = storageService.resetToDefault();
    setPortalData(def);
    showToast('Reset all KRAs and role charters to default factory version.', 'info');
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
