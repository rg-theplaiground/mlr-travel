
import React, { useState } from 'react';
import { HotelCard, Hotel } from './HotelCard';
import { Loader2, Sparkles, Ticket, Building2, LayoutGrid } from 'lucide-react';

interface HotelResultsProps {
  hotels: Hotel[];
  isLoading?: boolean;
  onSelectHotel?: (hotel: Hotel) => void;
}

export const HotelResults: React.FC<HotelResultsProps> = ({ hotels, isLoading, onSelectHotel }) => {
  const [filterType, setFilterType] = useState<'all' | 'bundle' | 'stay'>('all');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6 animate-fade-in w-full">
         <div className="relative">
           <div className="absolute inset-0 bg-stone-200 rounded-full animate-ping opacity-50"></div>
           <div className="relative bg-white text-mlr-red p-4 rounded-full shadow-xl border border-stone-100">
             <Loader2 className="animate-spin" size={32} />
           </div>
         </div>
         <div className="text-center space-y-1">
           <p className="text-lg font-bold text-stone-900">Finding the best packages</p>
           <p className="text-stone-500 font-medium text-xs uppercase tracking-wide">Searching properties...</p>
         </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 border-dashed animate-fade-in">
        <p className="text-stone-500 font-bold text-sm">No packages found matching your criteria.</p>
      </div>
    );
  }

  // Filter Logic
  const filteredHotels = hotels.filter(h => {
    if (filterType === 'all') return true;
    return h.packageType === filterType;
  });

  const aiRecommended = filteredHotels.filter(h => (h.sellRating && h.sellRating > 0.8) || (h.ranking !== undefined && h.ranking < 3));
  const standardHotels = filteredHotels.filter(h => !aiRecommended.includes(h));

  return (
    <div className="animate-slide-up w-full">
      
      {/* Filters Bar */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="bg-stone-200 p-1 rounded-2xl flex items-center">
            <FilterTab 
              label="All Options" 
              icon={LayoutGrid} 
              active={filterType === 'all'} 
              onClick={() => setFilterType('all')} 
            />
            <FilterTab 
              label="Ticket Bundles" 
              icon={Ticket} 
              active={filterType === 'bundle'} 
              onClick={() => setFilterType('bundle')} 
            />
            <FilterTab 
              label="Hotel Only" 
              icon={Building2} 
              active={filterType === 'stay'} 
              onClick={() => setFilterType('stay')} 
            />
         </div>
         <p className="text-stone-500 font-bold text-xs uppercase tracking-widest">
           {filteredHotels.length} packages found
         </p>
      </div>

      {aiRecommended.length > 0 && (
        <div className="mb-10">
           <div className="flex items-center gap-2 mb-4 text-mlr-red">
              <Sparkles size={18} className="fill-red-100" />
              <h3 className="font-black text-sm uppercase tracking-wide">Featured Packages</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aiRecommended.map((hotel) => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onSelect={() => onSelectHotel?.(hotel)} 
                />
              ))}
           </div>
           <div className="h-px bg-stone-200 w-full my-8"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {standardHotels.map((hotel) => (
          <HotelCard 
            key={hotel.id} 
            hotel={hotel} 
            onSelect={() => onSelectHotel?.(hotel)} 
          />
        ))}
      </div>
      
      <div className="pt-12 flex justify-center">
         <button className="px-8 py-3 bg-white border border-stone-200 text-stone-500 font-bold rounded-xl hover:border-stone-400 hover:text-stone-900 transition-all shadow-sm text-xs uppercase tracking-wide">
           Show more results
         </button>
      </div>
    </div>
  );
};

const FilterTab: React.FC<{ label: string; icon: any; active: boolean; onClick: () => void }> = ({ label, icon: Icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all
      ${active 
        ? 'bg-white text-stone-900 shadow-sm scale-105' 
        : 'text-stone-500 hover:text-stone-900'}
    `}
  >
    <Icon size={14} className={active ? 'text-mlr-red' : 'text-stone-400'} />
    {label}
  </button>
);
