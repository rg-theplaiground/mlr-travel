
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export type TripType = 'roundtrip' | 'one-way' | 'multi-city';

interface TripTypeSelectorProps {
  value: TripType;
  onChange: (type: TripType) => void;
}

export const TripTypeSelector: React.FC<TripTypeSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const options: { value: TripType; label: string }[] = [
    { value: 'roundtrip', label: 'Roundtrip' },
    { value: 'one-way', label: 'One-way' },
    { value: 'multi-city', label: 'Multi-city' }
  ];

  const currentLabel = options.find(o => o.value === value)?.label;

  useEffect(() => {
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

  useEffect(() => {
    const handleInteraction = (event: Event) => {
      if (event.type === 'scroll' || event.type === 'resize') {
        setIsOpen(false);
        return;
      }
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
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
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 font-black uppercase text-sm tracking-wider
          px-4 py-2.5 transition-all duration-200 border-2
          ${isOpen 
            ? 'bg-stone-900 border-stone-700 text-white' 
            : 'bg-black border-stone-800 text-stone-400 hover:border-stone-600 hover:text-white'}
        `}
      >
        <span>{currentLabel}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="w-48 bg-stone-900 border border-stone-800 shadow-2xl animate-scale-in origin-top-left"
        >
          <div className="p-1 space-y-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors
                  ${value === option.value 
                    ? 'bg-hyrox-yellow text-black' 
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'}
                `}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={14} className="text-black" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
