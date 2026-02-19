import * as React from 'react';

interface StopsFilterProps {
  selected: string;
  onChange: (value: string) => void;
  counts?: { nonstop: number; oneStop: number; any: number };
  prices?: { nonstop: number; oneStop: number; any: number };
}

export const StopsFilter: React.FC<StopsFilterProps> = ({
  selected,
  onChange,
  counts = { nonstop: 0, oneStop: 0, any: 0 },
  prices = { nonstop: 0, oneStop: 0, any: 0 }
}) => {
  const options = [
    { id: 'nonstop', label: 'Nonstop only', count: counts.nonstop, price: prices.nonstop },
    { id: '1-stop', label: '1 stop or fewer', count: counts.oneStop, price: prices.oneStop },
    { id: 'any', label: 'Any stops', count: counts.any, price: prices.any },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-stone-900 mb-4">Number of stops</h4>
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    name="stops"
                    className="peer appearance-none w-5 h-5 rounded-full border-2 border-stone-300 checked:border-camina-brand checked:border-[6px] transition-all"
                    checked={selected === option.id}
                    onChange={() => onChange(option.id)}
                  />
                </div>
                <div>
                  <span className="text-stone-900 font-medium mr-2">{option.label}</span>
                  <span className="text-stone-400 text-sm">({option.count})</span>
                </div>
              </div>
              {option.price > 0 && (
                <span className="text-stone-900 font-semibold">${Math.round(option.price)}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <h4 className="text-sm font-bold text-stone-900 mb-2">Layover duration</h4>
        <p className="text-xs text-stone-500">35m - 12h 52m</p>
        {/* Simplified visual for layover duration graph */}
        <div className="h-12 flex items-end gap-1 mt-2 opacity-50">
          {[20, 40, 30, 60, 80, 40, 30, 20, 10, 5, 20, 30, 40, 20, 10].map((h, i) => (
            <div key={i} className="flex-1 bg-camina-brand rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
