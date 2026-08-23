import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { 
  Layers, 
  GitCompare, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  FileSpreadsheet, 
  BookOpen, 
  Sun, 
  Moon, 
  Menu, 
  X,
  History,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaazaaLogo } from './TaazaaLogo';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenCompareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin, onOpenCompareModal }) => {
  const {
    activeTab,
    setActiveTab,
    comparisonRoles,
    adminSession,
    logoutAdmin,
    isDarkMode,
    toggleDarkMode,
    portalData,
    activeVersionId,
    activeVersion,
    switchVersion,
    isHistoricalVersion,
  } = useKRA();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  const navItems = [
    { id: 'kras', label: 'Role Charters', icon: Layers },
    { id: 'raci', label: 'RACI Matrix', icon: FileSpreadsheet },
    { id: 'frameworks', label: 'Frameworks & OD', icon: BookOpen },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo (Official Taazaa SVG from taazaa.com) */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none active:scale-[0.98] transition-transform duration-150"
            onClick={() => setActiveTab('kras')}
          >
            <div className="flex items-center gap-2">
              <TaazaaLogo className="h-6 sm:h-7 w-auto" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 hidden xs:inline-block">
                ER Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.97] ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility Actions & Version Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Version Display: Interactive for Admin only; Read-Only badge for Public employees */}
            {adminSession.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-[0.96] ${
                    isHistoricalVersion
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                  title="Admin: Switch Historical KRA Snapshot"
                >
                  <History className="w-3.5 h-3.5 text-brand-500" />
                  <span className="max-w-[85px] sm:max-w-[110px] truncate">
                    {activeVersion?.name || activeVersionId}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu (Admin Only) */}
                <AnimatePresence>
                  {isVersionDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-left"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                          Admin Version Switcher
                        </span>
                        <span className="text-[9px] font-bold text-brand-500 uppercase">
                          Time-Travel
                        </span>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                        {portalData.versions?.map((ver, idx) => {
                          const isSelected = ver.id === activeVersionId;
                          const isLive = idx === 0;
                          return (
                            <button
                              key={ver.id}
                              onClick={() => {
                                switchVersion(ver.id);
                                setIsVersionDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                                isSelected
                                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span>{ver.name}</span>
                                  {isLive && (
                                    <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-black uppercase">
                                      Live
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  Effective: {ver.effectiveDate}
                                </div>
                              </div>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-brand-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Public View: Clean Read-only Active Version Badge
              <div 
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 select-none"
                title={`Active Governance Version: ${activeVersion?.name || activeVersionId}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono">{activeVersion?.versionNumber || portalData.version || activeVersionId}</span>
              </div>
            )}

            {/* Compare Trigger */}
            <button
              onClick={onOpenCompareModal}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-[0.96] ${
                comparisonRoles.length > 0
                  ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <GitCompare className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Compare</span>
              {comparisonRoles.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-black text-white bg-brand-600 rounded-full">
                  {comparisonRoles.length}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 transition-colors active:scale-[0.92]"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Admin Portal Button */}
            {adminSession.isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.96] ${
                    activeTab === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Logout from Admin"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors active:scale-[0.92]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="btn-primary !px-3 sm:!px-5 !py-2 sm:!py-2.5 text-xs sm:text-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Admin Login</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1 overflow-hidden"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] ${
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
