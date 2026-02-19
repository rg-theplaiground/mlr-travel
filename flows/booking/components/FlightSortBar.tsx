
import React from 'react';

type SortOption = 'recommended' | 'cheapest' | 'fastest';

interface SortStats {
  cheapest: { price: number; duration: string };
  fastest: { price: number; duration: string };
  recommended: { price: number; duration: string };
}

interface FlightSortBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  stats: SortStats;
}

export const FlightSortBar: React.FC<FlightSortBarProps> = ({ activeSort, onSortChange, stats }) => {
  const options = [
    { 
      id: 'recommended' as SortOption, 
      label: 'Recommended', 
      price: stats.recommended.price, 
      duration: stats.recommended.duration 
    },
    { 
      id: 'cheapest' as SortOption, 
      label: 'Cheapest', 
      price: stats.cheapest.price, 
      duration: stats.cheapest.duration 
    },
    { 
      id: 'fastest' as SortOption, 
      label: 'Fastest', 
      price: stats.fastest.price, 
      duration: stats.fastest.duration 
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-6 mb-10 w-full">
      {options.map((option) => {
        const isActive = activeSort === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSortChange(option.id)}
            className={`
              relative flex-1 flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300 group
              ${isActive 
                ? 'glass-panel shadow-md scale-[1.02] border-camina-brand/20' 
                : 'bg-transparent hover:bg-white/40 opacity-60 hover:opacity-100'}
            `}
          >
             {/* Label */}
             <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isActive ? 'text-camina-brand' : 'text-camina-secondary'}`}>
               {option.label}
             </span>
             
             {/* Values */}
             <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${isActive ? 'text-camina-primary' : 'text-camina-primary/80'}`}>
                  ${Math.floor(option.price).toLocaleString()}
                </span>
                <span className={`text-sm font-medium ${isActive ? 'text-camina-secondary' : 'text-camina-secondary/70'}`}>
                  • {option.duration}
                </span>
             </div>
          </button>
        );
      })}
    </div>
  );
};
