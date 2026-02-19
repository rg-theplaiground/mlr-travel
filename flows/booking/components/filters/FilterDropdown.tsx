import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onReset?: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  width?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  isOpen,
  onToggle,
  onClose,
  onReset,
  isActive = false,
  children,
  width = 'w-80'
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleInteraction = (event: Event) => {
      if (event.type === 'scroll' || event.type === 'resize') {
        onClose();
        return;
      }

      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleInteraction);
      window.addEventListener('scroll', handleInteraction, true);
      window.addEventListener('resize', handleInteraction);
    }
    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction, true);
      window.removeEventListener('resize', handleInteraction);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all border shadow-sm whitespace-nowrap
          ${isOpen || isActive
            ? 'bg-hyrox-yellow text-black border-hyrox-yellow shadow-[0_0_10px_rgba(255,255,0,0.3)]'
            : 'bg-black text-stone-400 border-stone-800 hover:border-stone-600 hover:text-white'}
        `}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isOpen || isActive ? 'text-black' : 'text-stone-500'}`} />
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className={`${width} bg-stone-900 shadow-2xl border border-stone-800 animate-scale-in origin-top-left overflow-hidden`}
        >
          {onReset && (
            <div className="flex justify-end px-5 pt-4">
              <button
                onClick={onReset}
                className="text-[10px] font-black text-stone-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Reset
              </button>
            </div>
          )}

          <div className="p-6">
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
