
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-black text-hyrox-yellow uppercase tracking-widest ml-1 mb-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={`
            w-full bg-black text-white rounded-none border-2 appearance-none cursor-pointer
            ${error ? 'border-red-500 focus:border-red-400' : 'border-stone-800 focus:border-stone-500'}
            px-4 py-4 pr-10 outline-none transition-all duration-300
            text-base font-bold uppercase placeholder:text-stone-700
            shadow-sm group-hover:border-stone-700
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 group-hover:text-white transition-colors">
          <ChevronDown size={20} />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs ml-1 font-bold uppercase animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};
