import React from 'react';

export const PriceFilter: React.FC = () => {
  // Mock histogram data
  const bars = [5, 10, 20, 45, 80, 100, 60, 40, 20, 15, 10, 5, 5, 20, 40, 30, 10];

  return (
    <div>
      <div className="flex items-end gap-[2px] h-20 mb-2 px-2">
         {bars.map((h, i) => (
           <div 
             key={i} 
             className={`flex-1 rounded-t-sm ${i >= 3 && i <= 12 ? 'bg-purple-400' : 'bg-stone-200'}`}
             style={{ height: `${h}%` }}
           ></div>
         ))}
      </div>

      {/* Slider Track */}
      <div className="relative h-6 mb-6 select-none">
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-stone-100 rounded-full -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 h-1.5 bg-purple-600 rounded-full -translate-y-1/2"
            style={{ left: '15%', right: '25%' }}
          ></div>
          <div 
            className="absolute top-1/2 w-6 h-6 bg-white border-2 border-purple-600 rounded-full shadow-md -translate-y-1/2 cursor-grab"
            style={{ left: '15%', transform: 'translate(-50%, -50%)' }}
          ></div>
           <div 
            className="absolute top-1/2 w-6 h-6 bg-white border-2 border-purple-600 rounded-full shadow-md -translate-y-1/2 cursor-grab"
            style={{ right: '25%', transform: 'translate(50%, -50%)' }}
          ></div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 border border-stone-200 rounded-xl px-3 py-2">
           <label className="text-xs text-stone-400 font-bold block">Min</label>
           <div className="flex items-center">
             <span className="text-stone-900 font-medium mr-1">$</span>
             <input className="w-full outline-none text-stone-900 font-bold" defaultValue="716" />
           </div>
        </div>
        <div className="text-stone-300">-</div>
        <div className="flex-1 border border-stone-200 rounded-xl px-3 py-2">
           <label className="text-xs text-stone-400 font-bold block">Max</label>
           <div className="flex items-center">
             <span className="text-stone-900 font-medium mr-1">$</span>
             <input className="w-full outline-none text-stone-900 font-bold" defaultValue="15627" />
           </div>
        </div>
      </div>
    </div>
  );
};