
import React from 'react';
import { Star, MapPin, Award, Ticket, Bus, Beer, Check } from 'lucide-react';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: number;
  currency: string;
  image?: string;
  amenities?: string[];
  distance?: number;
  latitude?: number;
  longitude?: number;
  isPreferred?: boolean;
  sellRating?: number;
  ranking?: number;
  // Package specific fields
  packageType?: 'bundle' | 'stay';
  matchTicketIncluded?: boolean;
  shuttleIncluded?: boolean;
  fanEventAccess?: boolean;
}

interface HotelCardProps {
  hotel: Hotel;
  onSelect: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  const isBundle = hotel.packageType === 'bundle';

  return (
    <div 
      onClick={onSelect}
      className="group bg-white rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative hover:border-stone-300"
    >
      {/* Image Area */}
      <div className="relative h-64 w-full overflow-hidden bg-stone-200">
        {hotel.image ? (
          <img 
            src={hotel.image} 
            alt={hotel.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-[0.85] group-hover:saturate-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
           {isBundle && (
             <div className="bg-mlr-red text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-wider border border-red-500 transform group-hover:scale-105 transition-transform">
               <Ticket size={12} fill="currentColor" />
               Match Ticket Included
             </div>
           )}
           {hotel.isPreferred && !isBundle && (
             <div className="bg-white/90 backdrop-blur text-stone-900 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
               <Award size={12} className="text-mlr-red" />
               Official Partner
             </div>
           )}
        </div>

        {/* Bottom Info on Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white transform group-hover:translate-y-[-4px] transition-transform duration-300">
           <h3 className="font-black text-xl leading-tight line-clamp-2 uppercase italic tracking-wide mb-1 drop-shadow-md">{hotel.name}</h3>
           <div className="flex items-center gap-1.5 text-stone-200 text-xs font-bold uppercase tracking-wide">
             <MapPin size={12} className="text-mlr-red" />
             <p className="line-clamp-1">{hotel.distance?.toFixed(1)} miles from venue</p>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white relative z-10">
        
        {/* Package Perks */}
        <div className="mb-6 space-y-3">
           <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Package Includes</span>
              {hotel.rating > 0 && (
                <div className="flex items-center gap-1">
                   <Star size={10} className="fill-stone-900 text-stone-900" />
                   <span className="text-xs font-bold text-stone-900">{hotel.rating}</span>
                </div>
             )}
           </div>

           <div className="space-y-2">
              {hotel.matchTicketIncluded && (
                <div className="flex items-center gap-3 text-stone-700">
                   <div className="w-6 h-6 rounded-full bg-red-50 text-mlr-red flex items-center justify-center shrink-0">
                     <Ticket size={12} />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wide">Premium Match Ticket</span>
                </div>
              )}
              {hotel.shuttleIncluded && (
                <div className="flex items-center gap-3 text-stone-700">
                   <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                     <Bus size={12} />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wide">Game Day Shuttle</span>
                </div>
              )}
              {hotel.fanEventAccess && (
                <div className="flex items-center gap-3 text-stone-700">
                   <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                     <Beer size={12} />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wide">Post-Match Social Access</span>
                </div>
              )}
              {/* Fallback amenities if not a full bundle */}
              {!isBundle && (hotel.amenities || []).slice(0, 2).map((amenity, idx) => (
                 <div key={idx} className="flex items-center gap-3 text-stone-500">
                    <div className="w-6 h-6 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide">{amenity}</span>
                 </div>
              ))}
           </div>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-stone-100">
           <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">
                {isBundle ? 'Package Total' : 'Per Night'}
              </span>
              {isBundle ? (
                 <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide bg-green-50 px-2 py-0.5 rounded-md w-fit">
                   Save 15%
                 </span>
              ) : (
                 <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                   Room Only
                 </span>
              )}
           </div>
           <div className="text-right">
              <p className="text-3xl font-black text-stone-900 tracking-tighter italic group-hover:text-mlr-red transition-colors">
                ${Math.floor(hotel.price)}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
