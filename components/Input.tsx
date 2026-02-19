
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full bg-white text-stone-900 rounded-xl border
            ${error ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-mlr-red'}
            px-4 py-3.5 outline-none transition-all duration-200 shadow-sm
            placeholder:text-stone-400 text-sm font-medium
            ${icon ? 'pl-11' : ''}
            focus:ring-4 focus:ring-red-500/10
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-mlr-red transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs ml-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
