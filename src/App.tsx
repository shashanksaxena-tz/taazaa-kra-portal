import React, { useEffect, useState } from 'react';
import { KRAProvider, useKRA } from './context/KRAContext';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { DepartmentTabs } from './components/kras/DepartmentTabs';
import { RoleGrid } from './components/kras/RoleGrid';
import { RoleDetailPage } from './components/kras/RoleDetailPage';
import { RoleComparatorModal } from './components/kras/RoleComparatorModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { Footer } from './components/ui/Footer';
import { RoleCharter } from './types';
import { getSection } from './config/navigation';
import { SECTION_REGISTRY } from './components/sections/registry';
import { EmptyState } from './components/shared/EmptyState';
import { HomePage } from './components/home/HomePage';

const MainPortalContent: React.FC = () => {
  const {
    activeTab,
    activeSubTab,
    selectedRole,
    setSelectedRole,
    portalData,
    setActiveTab,
  } = useKRA();

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleSelectRole = (role: RoleCharter) => {
    setSelectedRole(role);
  };

  const handleEditInAdmin = () => {
    setActiveTab('admin');
  };

  const selectedDepartment = selectedRole
    ? portalData.departments.find((d) => d.id === selectedRole.departmentId) || portalData.departments[0]
    : portalData.departments[0];

  // Global search shortcut (Cmd+K / Ctrl+K / "/") — works from any page, not just
  // once already on Roles > Charters, since Home (not Roles) is now the default view.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTypingTarget =
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('roles', 'charters');
      } else if (e.key === '/' && !isTypingTarget) {
        e.preventDefault();
        setActiveTab('roles', 'charters');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-[#07091E] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      {selectedRole ? (
        <main className="flex-1">
          <RoleDetailPage
            role={selectedRole}
            department={selectedDepartment}
            onClose={() => setSelectedRole(null)}
            onOpenAdminEdit={handleEditInAdmin}
          />
        </main>
      ) : (
        <main className="flex-1 print:hidden">
          {activeTab === 'home' && <HomePage onSelectRole={handleSelectRole} />}

          {activeTab === 'roles' && activeSubTab === 'charters' && (
            <>
              <HeroSection />
              <DepartmentTabs />
              <RoleGrid onSelectRole={handleSelectRole} />
            </>
          )}

          {activeTab !== 'admin' && activeTab !== 'home' && !(activeTab === 'roles' && activeSubTab === 'charters') && (() => {
            const key = `${activeTab}.${activeSubTab}`;
            const Registered = SECTION_REGISTRY[key];
            if (Registered) return <Registered />;
            const subTab = getSection(activeTab).subTabs.find((s) => s.id === activeSubTab);
            return (
              <EmptyState
                title={subTab?.label ?? 'Not documented yet'}
                description={subTab?.emptyDescription}
              />
            );
          })()}

          {activeTab === 'admin' && <AdminPanel />}
        </main>
      )}

      <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Role Comparator Modal */}
      <RoleComparatorModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <KRAProvider>
      <MainPortalContent />
    </KRAProvider>
  );
}
