
import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] animate-slide-up">
      <div className="bg-stone-900 text-white px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-stone-800 flex items-center gap-4 min-w-[300px]">
        <CheckCircle2 size={22} className="text-hyrox-yellow" />
        <p className="font-bold text-sm flex-1 uppercase tracking-wide">{message}</p>
        <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
