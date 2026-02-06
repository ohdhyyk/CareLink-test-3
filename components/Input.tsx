import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  darkMode?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', darkMode = false, ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
          error 
            ? (darkMode ? 'border-red-500 bg-red-900/20 text-red-200' : 'border-red-500 bg-red-50') 
            : (darkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-slate-200 bg-white')
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};