import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export interface AdvancedFilters {
  refundableOnly: boolean;
  stops: 'any' | '1-stop' | 'nonstop';
  cabin: 'economy' | 'business' | 'first';
}

interface AdvancedFilterProps {
  filters: AdvancedFilters;
  onChange: (filters: AdvancedFilters) => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ filters, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  const toggleRefundable = () => {
    onChange({ ...filters, refundableOnly: !filters.refundableOnly });
  };

  const setStops = (stops: AdvancedFilters['stops']) => {
    onChange({ ...filters, stops });
  };

  const setCabin = (cabin: AdvancedFilters['cabin']) => {
    onChange({ ...filters, cabin });
  };

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
        <span>Advanced</span>
        {filters.refundableOnly || filters.stops !== 'any' ? (
          <div className="w-2 h-2 rounded-full bg-hyrox-yellow shadow-[0_0_5px_#FFFF00]"></div>
        ) : (
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} />
        )}
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="w-72 bg-stone-900 border border-stone-800 shadow-2xl animate-scale-in origin-top-left"
        >

          {/* Refundable Section */}
          <div className="p-4 border-b border-stone-800">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`
                  w-5 h-5 border-2 flex items-center justify-center transition-colors
                  ${filters.refundableOnly
                    ? 'bg-hyrox-yellow border-hyrox-yellow text-black'
                    : 'border-stone-600 bg-stone-900 group-hover:border-white'}
                `}
                onClick={toggleRefundable}
              >
                {filters.refundableOnly && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className="text-stone-300 font-bold text-sm select-none uppercase tracking-wide group-hover:text-white" onClick={toggleRefundable}>Refundable only</span>
            </label>
          </div>

          {/* Stops Section */}
          <div className="p-4 space-y-3 border-b border-stone-800">
            <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Number of stops</h4>
            <div className="space-y-2">
              {[
                { id: 'any', label: 'Any number of stops' },
                { id: '1-stop', label: '1 stop max' },
                { id: 'nonstop', label: 'Nonstop only' }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="stops"
                      className="peer appearance-none w-5 h-5 rounded-full border-2 border-stone-600 checked:border-hyrox-yellow checked:border-[6px] transition-all bg-stone-900"
                      checked={filters.stops === opt.id}
                      onChange={() => setStops(opt.id as AdvancedFilters['stops'])}
                    />
                  </div>
                  <span className="text-stone-400 font-bold text-sm uppercase tracking-wide group-hover:text-white">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cabin Section */}
          <div className="p-4 space-y-3 bg-black">
            <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Cabin Class</h4>
            <div className="flex gap-2">
              {(['economy', 'business', 'first'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCabin(c)}
                  className={`
                            px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border transition-all
                            ${filters.cabin === c
                      ? 'bg-white border-white text-black'
                      : 'bg-transparent border-stone-800 text-stone-500 hover:text-white hover:border-stone-600'}
                        `}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </div>,
        document.body
      )}
    </>
  );
};
