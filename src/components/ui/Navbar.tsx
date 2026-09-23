import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { NAVIGATION, SectionId } from '../../config/navigation';
import {
  GitCompare,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  History,
  ChevronDown,
  Search,
  Bell,
  UserCircle2,
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
    activeSubTab,
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
  const [openDesktopSection, setOpenDesktopSection] = useState<SectionId | null>(null);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo (Official Taazaa SVG from taazaa.com) */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none active:scale-[0.98] transition-transform duration-150"
            onClick={() => setActiveTab('home')}
          >
            <TaazaaLogo className="h-5 sm:h-[22px] w-auto" />
            <span className="hidden sm:inline-block w-px h-5 bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400 hidden sm:inline-block">
              People Architecture
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            <button
              onClick={() => setActiveTab('home')}
              className={`pb-1 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'home'
                  ? 'text-brand-600 dark:text-brand-400 border-brand-500'
                  : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>
            {NAVIGATION.map((section) => {
              const isActive = activeTab === section.id;
              return (
                <div
                  key={section.id}
                  className="relative"
                  onMouseEnter={() => setOpenDesktopSection(section.id)}
                  onMouseLeave={() => setOpenDesktopSection((cur) => (cur === section.id ? null : cur))}
                >
                  <button
                    onClick={() => setActiveTab(section.id)}
                    className={`pb-1 text-sm font-semibold border-b-2 transition-colors ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 border-brand-500'
                        : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {section.label}
                  </button>

                  <AnimatePresence>
                    {openDesktopSection === section.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 top-full pt-1 w-56 z-50"
                      >
                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5">
                          {section.subTabs.map((subTab) => (
                            <button
                              key={subTab.id}
                              onClick={() => {
                                setActiveTab(section.id, subTab.id);
                                setOpenDesktopSection(null);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                isActive && activeSubTab === subTab.id
                                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              {subTab.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Utility Actions & Version Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search */}
            <button
              onClick={() => setActiveTab('home')}
              aria-label="Search"
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Notifications (visual only — no fabricated unread state) */}
            <button
              aria-label="Notifications"
              title="No notifications"
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-[18px] h-[18px]" />
            </button>

            {/* Avatar — opens the admin session control */}
            <button
              onClick={adminSession.isAuthenticated ? logoutAdmin : onOpenAdminLogin}
              title={adminSession.isAuthenticated ? `Signed in as ${adminSession.username} — click to log out` : 'Admin sign in'}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 hover:bg-brand-500/25 transition-colors text-[11px] font-bold"
            >
              {adminSession.isAuthenticated && adminSession.username
                ? adminSession.username
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : <UserCircle2 className="w-5 h-5" />}
            </button>

            {/* Compare Trigger */}
            <button
              onClick={onOpenCompareModal}
              aria-label="Compare roles"
              title="Compare roles"
              className={`relative p-2 rounded-full transition-colors ${
                comparisonRoles.length > 0
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-[18px] h-[18px]" />
              {comparisonRoles.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-black text-white bg-brand-600 rounded-full">
                  {comparisonRoles.length}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-[18px] h-[18px] text-amber-400" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Admin-only: version switcher + admin mode indicator */}
            {adminSession.isAuthenticated && (
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
            )}

            {/* Admin mode indicator (shown only once signed in — avatar handles sign-in/out) */}
            {adminSession.isAuthenticated && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-[0.96] ${
                  activeTab === 'admin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Mode</span>
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
              className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-3 overflow-y-auto max-h-[70vh]"
            >
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] ${
                  activeTab === 'home' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Home
              </button>
              {NAVIGATION.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveTab(section.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] ${
                      activeTab === section.id ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {section.label}
                  </button>
                  <div className="pl-4 space-y-0.5 mt-0.5">
                    {section.subTabs.map((subTab) => (
                      <button
                        key={subTab.id}
                        onClick={() => {
                          setActiveTab(section.id, subTab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-1.5 rounded-lg text-xs font-semibold active:scale-[0.98] ${
                          activeTab === section.id && activeSubTab === subTab.id
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {subTab.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
