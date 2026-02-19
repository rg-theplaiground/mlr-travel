import * as React from 'react';
import { Search } from 'lucide-react';

interface AirlineItem {
  name: string;
  count: number;
  price: string;
  checked?: boolean;
}

export const AirlinesFilter: React.FC = () => {
  const alliances: AirlineItem[] = [
    { name: 'Oneworld', count: 156, price: '$1,780' },
    { name: 'SkyTeam', count: 181, price: '$3,121' },
    { name: 'Star Alliance', count: 170, price: '$717', checked: true },
  ];

  const airlines: AirlineItem[] = [
    { name: 'Aer Lingus', count: 26, price: '$1,200' },
    { name: 'Air Canada', count: 11, price: '$1,727' },
    { name: 'Air France', count: 30, price: '$3,144' },
    { name: 'Alaska Airlines', count: 63, price: '$3,289' },
    { name: 'American Airlines', count: 71, price: '$1,780' },
    { name: 'British Airways', count: 18, price: '$1,782' },
  ];

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
        <input
          placeholder="Search airlines"
          className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-stone-300"
        />
      </div>

      <div className="max-h-80 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-6">
        {/* Alliances */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Alliances</h4>
          {alliances.map((item) => (
            <CheckboxRow key={item.name} item={item} />
          ))}
        </div>

        {/* Airlines */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Airlines</h4>
          {airlines.map((item) => (
            <CheckboxRow key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckboxRow: React.FC<{ item: AirlineItem }> = ({ item }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-purple-600 border-purple-600' : 'border-stone-300 bg-white'}`}>
        {item.checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <div>
        <span className="text-stone-900 font-medium mr-2">{item.name}</span>
        <span className="text-stone-400 text-sm">({item.count})</span>
      </div>
    </div>
    <span className="text-stone-900 font-medium text-sm">{item.price}</span>
  </label>
);