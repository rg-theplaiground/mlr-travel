
import * as React from 'react';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { LocationAutocomplete } from '../flows/booking/components/LocationAutocomplete';
import { DateRangePicker } from '../flows/booking/components/DateRangePicker';

interface SearchCommandProps {
  onSearch: (data: { destination: string; date?: Date; type: 'business' | 'personal' }) => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({ onSearch }) => {
  const [destination, setDestination] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(null);

  const handleSearchClick = () => {
    if (destination) {
      onSearch({
        destination,
        date: startDate || undefined,
        type: 'personal'
      });
    }
  };

  return (
    <div className="w-full">
      {/* Glassmorphism Container */}
      <div className="bg-white p-3 rounded-[2.5rem] shadow-float border border-white/50 backdrop-blur-xl flex flex-col lg:flex-row gap-3 relative">

        {/* Location Input */}
        <div className="flex-1 bg-stone-50/80 rounded-[2rem] px-8 py-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-stone-100 group cursor-text overflow-hidden">
          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 group-hover:text-mlr-red transition-colors">Destination</label>
          <div className="flex items-center gap-4">
            <MapPin size={18} className="text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
            <div className="flex-1">
              <LocationAutocomplete
                value={destination}
                onChange={setDestination}
                placeholder="Where are you going?"
                className="w-full bg-transparent outline-none text-lg font-bold placeholder:text-stone-300 text-stone-900"
                mode="hotel"
              />
            </div>
          </div>
        </div>

        {/* Date Input */}
        <div className="flex-1 bg-stone-50/80 rounded-[2rem] px-8 py-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-stone-100 group cursor-pointer overflow-hidden">
          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 group-hover:text-mlr-red transition-colors">Check-in</label>
          <div className="flex items-center gap-4">
            <Calendar size={18} className="text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
            <div className="flex-1">
              <DateRangePicker
                startDate={startDate}
                endDate={null}
                onChange={(start: Date | null) => setStartDate(start)}
                tripType="one-way"
                placeholder="Add dates"
                className="text-lg font-bold text-stone-900 placeholder:text-stone-300"
                hideIcon={true}
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="bg-mlr-red hover:bg-red-700 text-white px-10 py-6 rounded-[2rem] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl hover:shadow-red-500/20 lg:w-auto w-full active:scale-95"
          disabled={!destination}
        >
          <span>Search</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </button>

      </div>
    </div>
  );
};
