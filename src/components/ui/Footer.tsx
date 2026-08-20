import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { Building2, Heart, ShieldCheck, FileSpreadsheet, BookOpen, Layers } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { setActiveTab, setActiveDepartmentId, portalData, adminSession } = useKRA();

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Taazaa Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-base flex items-center justify-center shadow-md shadow-orange-500/20">
                T
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Taazaa Inc.
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Employee Relations & Performance Governance Portal. Standardizing role charters, growth pathways, and measurable OKRs across all departments.
            </p>
            <div className="text-[11px] text-slate-400 font-medium">
              Version {portalData.version} • Last updated: {portalData.lastUpdated}
            </div>
          </div>

          {/* Col 2: Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {portalData.departments.map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      setActiveDepartmentId(dept.id);
                      setActiveTab('kras');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {dept.name} ({dept.roles.length})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Governance & RACI */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Governance & Frameworks
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('raci');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>RACI Matrix (Delivery vs PMO)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('frameworks');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Org Design & Frameworks</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('kras');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse All 29 Role Charters</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: ER / HR Admin Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              ER / HR Portal Administration
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Authorized ER and HR team members can log in to modify KRAs, add roles, and publish changes directly to GitHub Pages.
            </p>
            {adminSession.isAuthenticated ? (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Workspace</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-orange-600 dark:hover:bg-orange-500 text-xs font-bold transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login (ER Team)</span>
              </button>
            )}
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Taazaa Inc. Confidential & Proprietary for internal organizational use.
        </div>
      </div>
    </footer>
  );
};
