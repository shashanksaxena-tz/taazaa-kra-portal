import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { X, Lock, Key } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useKRA();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError('Please provide administrative passcode');
      return;
    }

    const success = loginAdmin(passcode);
    if (success) {
      setPasscode('');
      setError('');
      onClose();
    } else {
      setError(import.meta.env.DEV ? 'Invalid admin passcode. (Default demo: taazaa2026)' : 'Invalid admin passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            ER Admin Authentication
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Authorized ER and HR team members only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder={import.meta.env.DEV ? 'Enter passcode (taazaa2026)...' : 'Enter passcode...'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-rose-500 mt-1.5">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-primary !py-3"
          >
            Authenticate & Access Workspace
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Default demo passcode: <code className="font-bold text-brand-600 dark:text-brand-400">taazaa2026</code>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
