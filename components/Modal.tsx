
import * as React from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  hideHeader?: boolean;
  variant?: 'default' | 'dark'; // 'default' is now Dark Hyrox style
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideHeader = false,
  variant: _variant = 'default'
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const widthClasses = {
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  // Enforcing Dark Theme as primary brand
  const themeClasses = 'bg-stone-950 border border-stone-800 text-white';
  const closeButtonClasses = 'text-stone-400 hover:text-white hover:bg-white/10';
  const borderClasses = 'border-stone-800';

  return createPortal(
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Content */}
      <div className={`
        ${themeClasses} rounded-[2rem] w-full ${widthClasses[size]} shadow-2xl relative z-10 flex flex-col max-h-[90vh]
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}
      `}>
        {!hideHeader && (
          <div className={`flex items-center justify-between p-6 border-b ${borderClasses} shrink-0`}>
            <h3 className="text-xl font-black italic uppercase tracking-wide">{title}</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${closeButtonClasses}`}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {hideHeader && (
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 z-50 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${closeButtonClasses} bg-black/20`}
          >
            <X size={20} />
          </button>
        )}

        <div className={`overflow-y-auto custom-scrollbar ${!hideHeader ? 'p-6' : ''}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
