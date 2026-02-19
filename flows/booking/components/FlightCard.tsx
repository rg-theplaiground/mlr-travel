
import React from 'react';
import { ArrowRight, Bookmark, ChevronDown } from 'lucide-react';
import { AncillaryOption } from '../../../../services/sabre';

export interface FlightSegment {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  duration: string;
  stops: number;
  price: number;
  emissions?: string; 
  tags?: string[];
  rawDepartureTime?: string;
  rawArrivalTime?: string;
  marketingCarrier?: string;
  marketingFlightNumber?: number;
  bookingCode?: string;
  selectedSeats?: string[];
  selectedAncillaries?: AncillaryOption[];
}

interface FlightCardProps {
  flight: FlightSegment;
  isSelected?: boolean;
  onSelect: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, isSelected = false, onSelect, onSave, children }) => {
  
  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr || timeStr.includes('Invalid')) return '--:--';
    return timeStr.replace(/ [ap]m/i, ''); 
  };

  const depTime = formatDisplayTime(flight.departureTime);
  const arrTime = formatDisplayTime(flight.arrivalTime);

  return (
    <div className={`relative transition-all duration-500 ease-in-out ${isSelected ? 'my-8' : ''}`}>
      
      {/* Main Card Container */}
      <div 
        onClick={onSelect}
        className={`
          relative rounded-[2rem] transition-all duration-300 group cursor-pointer overflow-hidden border
          ${isSelected 
            ? 'bg-stone-900 border-hyrox-yellow shadow-2xl scale-[1.01] z-20' 
            : 'bg-black border-stone-800 hover:border-stone-600 shadow-sm'}
        `}
      >
        
        {/* Selection Highlight Bar */}
        {isSelected && <div className="absolute top-0 left-0 bottom-0 w-2 bg-hyrox-yellow z-30"></div>}

        {/* Card Content */}
        <div className="p-6 md:px-10 md:py-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0 relative z-20">
          
          {/* Airline & Logo - Left */}
          <div className="flex items-center gap-5 lg:w-[30%]">
             <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={`https://pics.avs.io/200/200/${flight.airlineCode}.png`} 
                  alt={flight.airline}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
             </div>
             <div className="min-w-0">
               <h4 className="font-black text-white text-lg leading-tight truncate uppercase italic tracking-wide">{flight.airline}</h4>
               <p className="text-xs text-stone-500 font-bold mt-1 uppercase tracking-widest">{flight.flightNumber}</p>
             </div>
          </div>

          {/* Route Info - Middle Section */}
          <div className="flex-1 grid grid-cols-3 items-center gap-4 lg:gap-12">
             
             {/* Departure */}
             <div className="text-center lg:text-right">
                <p className="text-3xl font-black text-white tracking-tighter italic">{depTime}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-1.5">{flight.origin}</p>
             </div>

             {/* Duration / Visual */}
             <div className="flex flex-col items-center justify-center w-full px-4 relative">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">
                  {flight.duration}
                </span>
                
                <div className="w-full flex items-center gap-2 opacity-40">
                   <div className="h-[2px] bg-stone-600 flex-1 rounded-full"></div>
                   <ArrowRight size={14} className="text-stone-400" />
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${flight.stops === 0 ? 'text-hyrox-yellow' : 'text-stone-400'}`}>
                   {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                </span>
             </div>

             {/* Arrival */}
             <div className="text-center lg:text-left">
                <p className="text-3xl font-black text-white tracking-tighter italic">{arrTime}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-1.5">{flight.destination}</p>
             </div>

          </div>

          {/* Price & Action - Right */}
          <div className="flex items-center justify-between lg:justify-end lg:w-[25%] lg:pl-12 gap-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-stone-800 mt-2 lg:mt-0">
             
             <div className="hidden lg:block">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${isSelected ? 'bg-hyrox-yellow text-black' : 'bg-stone-900 text-stone-500 border border-stone-800'}`}>
                  Standard
                </span>
             </div>

             <div className="flex items-center gap-8">
                <div className="text-right">
                   <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">Total</p>
                   <p className={`text-4xl font-black transition-colors tracking-tighter italic ${isSelected ? 'text-hyrox-yellow' : 'text-white group-hover:text-stone-200'}`}>
                     ${Math.floor(flight.price).toLocaleString()}
                   </p>
                </div>

                {onSave && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSave();
                    }}
                    className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-white transition-colors bg-stone-900 shrink-0"
                  >
                    <Bookmark size={20} strokeWidth={2} />
                  </button>
                )}
             </div>
          </div>
          
          {/* Chevron Indicator */}
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-stone-500 transition-all duration-300 ${isSelected ? 'rotate-180 opacity-100 text-hyrox-yellow' : 'opacity-0 translate-y-2'}`}>
             <ChevronDown size={20} />
          </div>

        </div>
      </div>

      {/* Expanded Details Section */}
      <div 
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSelected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
         <div className="overflow-hidden">
            {children}
         </div>
      </div>

    </div>
  );
};
