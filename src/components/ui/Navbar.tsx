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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  } = useKRA();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'kras', label: 'Role Charters', icon: Layers },
    { id: 'raci', label: 'RACI Governance', icon: FileSpreadsheet },
    { id: 'frameworks', label: 'Frameworks & OD', icon: BookOpen },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#07091E]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Official Taazaa Logo Mark */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none active:scale-[0.98] transition-transform duration-150"
            onClick={() => setActiveTab('kras')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#FF5B22] via-[#FF5B22] to-[#E54510] shadow-lg shadow-[#FF5B22]/20 text-white font-black text-xl tracking-tight transition-transform group-hover:scale-105 duration-200">
              <span>T</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#29E8AE] rounded-full border-2 border-white dark:border-[#07091E] animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  taazaa<span className="text-[#FF5B22]">.</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 text-[#FF5B22] border border-[#FF5B22]/20">
                  ER Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                KRA & Role Charter Governance
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs with Sliding Animated Pill */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-navy-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors z-10 select-none active:scale-[0.97] ${
                    isActive
                      ? 'text-[#FF5B22] dark:text-[#29E8AE]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white dark:bg-navy-900 rounded-xl shadow-sm -z-10 border border-slate-200/60 dark:border-slate-700/60"
                      transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Compare Drawer Trigger */}
            <button
              onClick={onOpenCompareModal}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-[0.96] ${
                comparisonRoles.length > 0
                  ? 'bg-orange-500/10 border-[#FF5B22]/40 text-[#FF5B22] dark:text-[#29E8AE] shadow-sm'
                  : 'bg-white dark:bg-navy-800/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <GitCompare className="w-4 h-4 text-[#FF5B22]" />
              <span className="hidden sm:inline">Compare</span>
              {comparisonRoles.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-black text-white bg-[#FF5B22] rounded-full animate-bounce">
                  {comparisonRoles.length}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 dark:text-slate-300 transition-colors active:scale-[0.92] border border-transparent dark:border-slate-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Admin Portal Button */}
            {adminSession.isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.96] ${
                    activeTab === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FF5B22] hover:bg-[#E54510] text-white shadow-md shadow-[#FF5B22]/20 transition-all active:scale-[0.96]"
              >
                <Lock className="w-3.5 h-3.5 opacity-90" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 active:scale-[0.92]"
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
                        ? 'bg-orange-50 dark:bg-navy-800 text-[#FF5B22] dark:text-[#29E8AE]'
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
