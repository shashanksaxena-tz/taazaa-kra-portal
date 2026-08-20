import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { 
  Building2, 
  Search, 
  Sun, 
  Moon, 
  Layers, 
  GitCompare, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  FileSpreadsheet,
  BookOpen,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenCompareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin, onOpenCompareModal }) => {
  const {
    portalData,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    comparisonRoles,
    adminSession,
    logoutAdmin,
  } = useKRA();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('kras')}>
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-taazaa-500 to-amber-600 shadow-md shadow-orange-500/20 text-white font-black text-xl tracking-wider">
              <span>T</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-orange-600 via-taazaa-500 to-amber-600 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
                  Taazaa
                </span>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  ER Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                KRA & Role Charter System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('kras')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'kras'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Role Charters
            </button>
            <button
              onClick={() => setActiveTab('raci')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'raci'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              RACI Matrix
            </button>
            <button
              onClick={() => setActiveTab('frameworks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'frameworks'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Frameworks & OD
            </button>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Compare Drawer Trigger */}
            <button
              onClick={onOpenCompareModal}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                comparisonRoles.length > 0
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
              {comparisonRoles.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full animate-bounce">
                  {comparisonRoles.length}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Admin Portal Button */}
            {adminSession.isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Logout from Admin"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-orange-600 dark:hover:bg-orange-500 shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5 opacity-80" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
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
              className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1 overflow-hidden"
            >
              <button
                onClick={() => {
                  setActiveTab('kras');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === 'kras'
                    ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Layers className="w-4 h-4" />
                Role Charters
              </button>
              <button
                onClick={() => {
                  setActiveTab('raci');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === 'raci'
                    ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                RACI Matrix
              </button>
              <button
                onClick={() => {
                  setActiveTab('frameworks');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === 'frameworks'
                    ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Frameworks & Org Design
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
