import React, { useState } from 'react';
import { KRAProvider, useKRA } from './context/KRAContext';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { DepartmentTabs } from './components/kras/DepartmentTabs';
import { RoleGrid } from './components/kras/RoleGrid';
import { RoleDetailModal } from './components/kras/RoleDetailModal';
import { RoleComparatorModal } from './components/kras/RoleComparatorModal';
import { RaciMatrixView } from './components/kras/RaciMatrixView';
import { FrameworksView } from './components/kras/FrameworksView';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { Footer } from './components/ui/Footer';
import { TaazaaBackgroundLayer } from './components/ui/TaazaaBackgroundLayer';
import { RoleCharter } from './types';

const MainPortalContent: React.FC = () => {
  const {
    activeTab,
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

  const handleEditInAdmin = (role: RoleCharter) => {
    setActiveTab('admin');
  };

  const selectedDepartment = selectedRole
    ? portalData.departments.find((d) => d.id === selectedRole.departmentId) || portalData.departments[0]
    : portalData.departments[0];

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50/70 dark:bg-[#07091E] text-slate-900 dark:text-slate-100 transition-colors">
      <TaazaaBackgroundLayer />
      <Navbar
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'kras' && (
          <>
            <HeroSection />
            <DepartmentTabs />
            <RoleGrid onSelectRole={handleSelectRole} />
          </>
        )}

        {activeTab === 'raci' && <RaciMatrixView />}

        {activeTab === 'frameworks' && <FrameworksView />}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Role Detail Modal */}
      {selectedRole && (
        <RoleDetailModal
          role={selectedRole}
          department={selectedDepartment}
          onClose={() => setSelectedRole(null)}
          onOpenAdminEdit={handleEditInAdmin}
        />
      )}

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
