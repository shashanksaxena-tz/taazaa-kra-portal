import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  onSuggestChange?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onSuggestChange }) => (
  <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 py-16 flex flex-col items-center text-center">
    <div className="w-full max-w-xl p-10 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
      )}
      {onSuggestChange && (
        <button
          onClick={onSuggestChange}
          className="mt-6 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:underline"
        >
          Suggest a change
        </button>
      )}
    </div>
  </div>
);
