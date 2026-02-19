
import React, { useState } from 'react';
import { 
  X, Clock, Wifi, Zap, ArrowRight, 
  Check, Info, Luggage, Armchair, ArrowLeft, Loader2, AlertCircle, ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/Button';
import { FlightSegment } from './FlightCard';
import { revalidateItinerary } from '../../../../services/sabre';
import { SeatSelectionModal } from './SeatSelectionModal';

interface FlightDetailsModalProps {
  flight: FlightSegment | null;
  onClose: () => void; 
  onSelectFare: (fareType: string) => void;
}

export const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({ 
  flight, 
  onClose,
  onSelectFare
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'fares'>('fares');
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedFareType, setSelectedFareType] = useState<string | null>(null);

  if (!flight) return null;

  const handleFareSelectWithValidation = async (fareType: string) => {
    setIsVerifying(fareType);
    setErrorMsg(null);

    try {
      await revalidateItinerary(flight);
      setIsVerifying(null);
      setSelectedFareType(fareType);
      setShowSeatSelection(true);
    } catch (error) {
      console.error("Validation failed", error);
      setIsVerifying(null);
      setErrorMsg("Price is no longer available. Please select another flight.");
    }
  };

  const handleSeatConfirm = (seats: string[]) => {
    setShowSeatSelection(false);
    if (selectedFareType) {
      onSelectFare(selectedFareType);
    }
  };

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr || timeStr.includes('Invalid')) return '--:--';
    return timeStr.replace(/ [ap]m/i, ''); 
  };

  const FARE_OPTIONS = [
    {
      id: 'basic',
      title: "Basic Economy",
      price: flight.price,
      features: ['Meals provided'],
      unavailable: ['No carry-on', 'No changes', 'Last group boarding', 'No seat selection'],
      comparison: [
        { label: 'Carry-on bag', value: '$', isGood: false },
        { label: 'Checked bag', value: '$75', isGood: false },
        { label: 'Seat selection', value: 'At check-in', isGood: false },
        { label: 'Change fees', value: 'Not allowed', isGood: false },
        { label: 'Refundable', value: 'No', isGood: false },
        { label: 'Boarding', value: 'Group 5', isGood: false },
      ]
    },
    {
      id: 'economy',
      title: "Economy",
      price: flight.price + 100,
      recommended: true,
      features: ['Meals provided', 'Carry-on included', 'Standard boarding'],
      unavailable: ['Seat selection fees apply'],
      comparison: [
        { label: 'Carry-on bag', value: 'Free', isGood: true },
        { label: 'Checked bag', value: '$75', isGood: false },
        { label: 'Seat selection', value: 'Fee applies', isGood: false },
        { label: 'Change fees', value: '$199', isGood: false },
        { label: 'Refundable', value: 'No', isGood: false },
        { label: 'Boarding', value: 'Group 4', isGood: false },
      ]
    },
    {
      id: 'economy-flex',
      title: "Economy Flexible",
      price: flight.price + 225,
      features: ['Refundable for free', 'Meals provided', 'Carry-on included', 'Free seat selection'],
      unavailable: [],
      comparison: [
        { label: 'Carry-on bag', value: 'Free', isGood: true },
        { label: 'Checked bag', value: '$75', isGood: false },
        { label: 'Seat selection', value: 'Free', isGood: true },
        { label: 'Change fees', value: 'Free', isGood: true },
        { label: 'Refundable', value: 'Yes', isGood: true },
        { label: 'Boarding', value: 'Group 3', isGood: true },
      ]
    },
    {
      id: 'premium',
      title: "Premium Plus",
      price: flight.price * 2.5,
      features: ['Premium meals', '2 Checked bags', 'Priority boarding', 'Extra legroom'],
      unavailable: [],
      comparison: [
        { label: 'Carry-on bag', value: 'Free', isGood: true },
        { label: 'Checked bag', value: '2 Free', isGood: true },
        { label: 'Seat selection', value: 'Free', isGood: true },
        { label: 'Change fees', value: 'Free', isGood: true },
        { label: 'Refundable', value: 'Yes', isGood: true },
        { label: 'Boarding', value: 'Group 1', isGood: true },
      ]
    }
  ];

  return (
    <div className="animate-slide-up w-full max-w-7xl mx-auto px-4 md:px-0 pb-10">
      
      <SeatSelectionModal 
        isOpen={showSeatSelection}
        onClose={() => setShowSeatSelection(false)}
        onConfirm={handleSeatConfirm}
        flight={flight}
      />

      <div className="mb-6 md:mb-8 flex items-center gap-4 pt-4 md:pt-0">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-stone-900 text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
           <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
             <span className="flex items-center gap-2">{flight.origin} <ArrowRight className="text-stone-500" size={20} /> {flight.destination}</span>
           </h2>
           <p className="text-stone-500 font-bold uppercase tracking-widest text-xs md:text-sm">{formatDisplayTime(flight.departureTime)} - {formatDisplayTime(flight.arrivalTime)} • {flight.duration}</p>
        </div>
      </div>

      <div className="bg-stone-950 border border-stone-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Tab Switcher */}
        <div className="px-4 md:px-8 pt-6 md:pt-8 border-b border-stone-800 flex items-center justify-between bg-stone-950 sticky top-0 z-20">
           <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
             <TabButton 
               active={activeTab === 'fares'} 
               onClick={() => setActiveTab('fares')} 
               label="Compare Fares" 
             />
             <TabButton 
               active={activeTab === 'details'} 
               onClick={() => setActiveTab('details')} 
               label="Flight Details" 
             />
           </div>
        </div>

        <div className="flex-1 bg-black">
          
          {activeTab === 'details' ? (
            <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8 md:space-y-12 animate-fade-in">
               <FlightSegmentDetail 
                  airline={flight.airline}
                  airlineCode={flight.airlineCode}
                  flightNumber={flight.flightNumber}
                  origin={flight.origin}
                  destination={flight.destination} 
                  departTime={formatDisplayTime(flight.departureTime)}
                  arriveTime={formatDisplayTime(flight.arrivalTime)}
                  duration={flight.duration}
                  aircraft="Boeing 737"
                  seatPitch="31 inch seat pitch"
                  isLast={true}
               />

               {flight.stops > 0 && (
                 <div className="bg-stone-900 border border-stone-800 p-6 flex items-center gap-4">
                    <Info className="text-stone-400" />
                    <div>
                      <p className="font-bold text-white uppercase tracking-wide">Includes {flight.stops} stop(s)</p>
                      <p className="text-stone-500 text-xs">Detailed layover information is available at checkout.</p>
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="p-4 md:p-12 animate-fade-in">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-900 text-red-400 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span className="font-bold uppercase tracking-wide text-sm">{errorMsg}</span>
                </div>
              )}

              <div className="hidden lg:grid grid-cols-[200px_repeat(4,1fr)] gap-4">
                
                <div className="pt-24 pr-6">
                   <h3 className="text-3xl font-black italic uppercase text-white leading-none tracking-tighter">
                     Select<br/><span className="text-stone-500">Your Fare</span>
                   </h3>
                </div>

                {FARE_OPTIONS.map((fare) => (
                  <FareCardDesktop
                    key={fare.id}
                    {...fare}
                    onSelect={() => handleFareSelectWithValidation(fare.id)}
                    isLoading={isVerifying === fare.id}
                  />
                ))}

                <div className="col-span-5 h-px bg-stone-800 my-8"></div>
                <div className="col-span-5 grid grid-cols-[200px_repeat(4,1fr)] gap-4">
                   {FARE_OPTIONS[0].comparison.map((row, idx) => (
                     <React.Fragment key={idx}>
                       <div className="flex items-center py-4 border-b border-stone-800 font-bold text-stone-500 text-xs uppercase tracking-wider">
                         {row.label}
                       </div>
                       {FARE_OPTIONS.map((fare) => (
                         <div key={`${fare.id}-${idx}`} className="flex items-center justify-center py-4 border-b border-stone-800 lg:border-l lg:border-stone-800">
                           <span className={`text-sm font-bold uppercase ${fare.comparison[idx].isGood ? 'text-white' : 'text-stone-600'}`}>
                             {fare.comparison[idx].value}
                           </span>
                         </div>
                       ))}
                     </React.Fragment>
                   ))}
                </div>
              </div>

              <div className="lg:hidden space-y-6">
                {FARE_OPTIONS.map((fare) => (
                  <FareCardMobile
                    key={fare.id}
                    {...fare}
                    onSelect={() => handleFareSelectWithValidation(fare.id)}
                    isLoading={isVerifying === fare.id}
                  />
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`
      pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap italic
      ${active 
        ? 'text-hyrox-yellow border-hyrox-yellow' 
        : 'text-stone-500 border-transparent hover:text-white'}
    `}
  >
    {label}
  </button>
);

const FlightSegmentDetail: React.FC<any> = ({ airline, airlineCode, flightNumber, origin, destination, departTime, arriveTime, duration, aircraft, seatPitch, isLast }) => (
  <div className="flex gap-4 md:gap-8 relative">
    <div className="flex flex-col items-center w-8 md:w-12 flex-shrink-0">
       <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-stone-700 bg-black z-10"></div>
       <div className={`w-[1px] flex-1 ${isLast ? 'bg-transparent' : 'bg-stone-800'} my-2`}></div>
       {isLast && <div className="w-4 h-4 md:w-5 md:h-5 bg-hyrox-yellow z-10"></div>}
    </div>

    <div className="flex-1 pb-4 min-w-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-2">
         <div>
            <h4 className="text-3xl md:text-4xl font-black italic uppercase text-white mb-1 tracking-tighter">{departTime}</h4>
            <p className="text-stone-500 font-bold text-lg md:text-xl">{origin}</p>
         </div>
         <div className="text-left md:text-right">
             <p className="text-xs md:text-sm font-black text-black bg-white px-3 py-1 uppercase italic tracking-wider inline-block transform -skew-x-12">
                <span className="block transform skew-x-12">{duration}</span>
             </p>
         </div>
      </div>

      <div className="bg-stone-900 p-6 md:p-8 border border-stone-800 space-y-6">
         <div className="flex items-center gap-4 md:gap-5 pb-6 border-b border-stone-800">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white flex items-center justify-center p-2">
               <img 
                 src={`https://pics.avs.io/200/200/${airlineCode}.png`}
                 alt={airline}
                 className="w-full h-full object-contain"
                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
               />
            </div>
            <div>
               <p className="font-black text-white uppercase text-lg italic tracking-wider">{airline} <span className="text-stone-600 not-italic">|</span> {flightNumber}</p>
               <p className="text-xs text-stone-500 mt-1 font-bold uppercase tracking-widest">Operated by {airline}</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-5 gap-x-10 text-sm">
            <div className="space-y-4 md:space-y-5">
               <div className="flex items-center gap-3 text-stone-400">
                 <PlaneIcon size={20} />
                 <span className="font-bold uppercase tracking-wide text-white">{aircraft}</span>
               </div>
               <div className="flex items-center gap-3 text-stone-400">
                 <Armchair size={20} />
                 <span className="font-medium">{seatPitch}</span>
               </div>
            </div>
            <div className="space-y-4 md:space-y-5">
               <div className="flex items-center gap-3 text-stone-400">
                 <Zap size={20} />
                 <span className="font-medium">Power & USB</span>
               </div>
               <div className="flex items-center gap-3 text-stone-400">
                 <Wifi size={20} />
                 <span className="font-medium">Wi-Fi Available</span>
               </div>
            </div>
         </div>
      </div>
      
      {isLast && (
         <div className="mt-8 md:mt-12">
            <h4 className="text-3xl md:text-4xl font-black italic uppercase text-white mb-1 tracking-tighter">{arriveTime}</h4>
            <p className="text-stone-500 font-bold text-lg md:text-xl">{destination}</p>
         </div>
      )}
    </div>
  </div>
);

const FareCardDesktop: React.FC<any> = ({ title, price, features, unavailable, onSelect, recommended, isLoading }) => (
  <div className={`
    relative flex flex-col p-6 border-2 transition-all duration-300 h-full group
    ${recommended 
      ? 'border-hyrox-yellow bg-stone-900 z-10' 
      : 'border-stone-800 bg-stone-950 hover:border-stone-600'}
  `}>
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hyrox-yellow text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest shadow-[0_0_15px_rgba(255,255,0,0.4)]">
        Recommended
      </div>
    )}

    <div className="mb-8 text-center border-b border-stone-800 pb-8">
      <h3 className={`text-sm font-black uppercase tracking-widest mb-3 ${recommended ? 'text-white' : 'text-stone-400'}`}>{title}</h3>
      <div className={`text-3xl font-black italic tracking-tighter ${recommended ? 'text-hyrox-yellow' : 'text-white'}`}>${Math.round(price)}</div>
    </div>

    <div className="flex-1 space-y-4 mb-10">
      {features.map((feat: string, i: number) => (
        <div key={i} className="flex items-start gap-3 text-xs font-bold uppercase tracking-wide text-stone-300">
          <Check size={14} className="text-hyrox-yellow shrink-0" />
          <span>{feat}</span>
        </div>
      ))}
      {unavailable.map((feat: string, i: number) => (
        <div key={i} className="flex items-start gap-3 text-xs font-medium uppercase tracking-wide text-stone-600 line-through decoration-stone-600">
          <X size={14} className="text-stone-700 shrink-0" />
          <span>{feat}</span>
        </div>
      ))}
    </div>

    <button 
      onClick={onSelect}
      disabled={isLoading}
      className={`
        w-full py-4 font-black text-sm uppercase italic tracking-wider flex items-center justify-center gap-2 transition-all
        ${recommended 
            ? 'bg-hyrox-yellow text-black hover:bg-white shadow-[0_0_15px_rgba(255,255,0,0.2)]' 
            : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'}
        ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Select'}
    </button>
  </div>
);

const FareCardMobile: React.FC<any> = ({ title, price, features, comparison, onSelect, recommended, isLoading }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`
      relative bg-stone-900 border transition-all duration-300 overflow-hidden
      ${recommended ? 'border-hyrox-yellow' : 'border-stone-800'}
    `}>
      {recommended && (
        <div className="bg-hyrox-yellow text-black text-[9px] font-black text-center py-1 uppercase tracking-widest">
          Recommended
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-black uppercase italic text-white tracking-wide">{title}</h3>
           <div className="text-2xl font-black text-hyrox-yellow italic tracking-tighter">${Math.round(price)}</div>
        </div>

        <div className="space-y-3 mb-6">
           {features.slice(0, 3).map((feat: string, i: number) => (
             <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-stone-300">
               <Check size={14} className="text-hyrox-yellow" />
               {feat}
             </div>
           ))}
        </div>

        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${expanded ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}
        `}>
           <div className="pt-4 border-t border-stone-800 space-y-3">
              {comparison.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs uppercase tracking-wide">
                   <span className="text-stone-500 font-bold">{item.label}</span>
                   <span className={`font-black ${item.isGood ? 'text-white' : 'text-stone-600'}`}>{item.value}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="flex gap-3">
           <button 
             onClick={() => setExpanded(!expanded)}
             className="p-3 bg-stone-800 text-stone-400 hover:text-white transition-colors"
           >
             <ChevronDown size={20} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
           </button>
           <button 
             onClick={onSelect}
             disabled={isLoading}
             className={`
               flex-1 py-3 font-black uppercase italic tracking-wider transition-all flex items-center justify-center gap-2
               ${recommended ? 'bg-hyrox-yellow text-black hover:bg-white' : 'bg-stone-800 text-stone-400 hover:text-white'}
             `}
           >
             {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Select'}
           </button>
        </div>
      </div>
    </div>
  );
};

const PlaneIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20M2 12l5-5M2 12l5 5" transform="rotate(180 12 12)" />
  </svg>
);
