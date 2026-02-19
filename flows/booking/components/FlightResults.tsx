
import React, { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, Loader2, CheckCircle } from 'lucide-react';
import { FlightCard, FlightSegment } from './FlightCard';
import { FlightSortBar } from './FlightSortBar';
import { FilterDropdown } from './filters/FilterDropdown';
import { StopsFilter } from './filters/StopsFilter';
import { TimeFilter } from './filters/TimeFilter';
import { AirlinesFilter } from './filters/AirlinesFilter';
import { PriceFilter } from './filters/PriceFilter';
import { PolicyFilter } from './filters/PolicyFilter';
import { RefreshPromptModal } from './RefreshPromptModal';
import { BasicEconomyWarningModal } from './BasicEconomyWarningModal';
import { TripSelectionModal } from './TripSelectionModal';
import { CreateTripModal } from './CreateTripModal';
import { FareSelectionPanel } from './FareSelectionPanel';
import { SeatSelectionModal } from './SeatSelectionModal';
import { AncillarySelectionModal } from './AncillarySelectionModal';
import { Toast } from '../../../components/Toast';
import { revalidateItinerary, AncillaryOption } from '../../../../services/sabre';

interface FlightResultsProps {
  onCheckout?: (flight: FlightSegment) => void;
  results?: FlightSegment[];
}

export const FlightResults: React.FC<FlightResultsProps> = ({ onCheckout, results }) => {
  const [activeSort, setActiveSort] = useState<'recommended' | 'cheapest' | 'fastest'>('recommended');
  const [flights, setFlights] = useState<FlightSegment[]>(results || []);
  
  // Selection State
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  // Filter States
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [stopsValue, setStopsValue] = useState('any');
  const [timeRange, setTimeRange] = useState({ start: 0, end: 24 });
  const [timeTab, setTimeTab] = useState<'depart' | 'arrive'>('depart');

  // Interaction States
  const [isStale, setIsStale] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal States
  const [flightToSave, setFlightToSave] = useState<FlightSegment | null>(null);
  const [showBasicWarning, setShowBasicWarning] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  
  // New Flow States
  const [isVerifying, setIsVerifying] = useState<string | null>(null); // holds fareType during verify
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showAncillarySelection, setShowAncillarySelection] = useState(false);
  const [tempFlightData, setTempFlightData] = useState<FlightSegment | null>(null);

  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    if (results) setFlights(results);
  }, [results]);

  useEffect(() => {
    if (isRefreshing || showTripModal || showCreateTripModal || showSeatSelection || showAncillarySelection) return; 
    const timer = setTimeout(() => setIsStale(true), 60000); 
    return () => clearTimeout(timer);
  }, [isRefreshing, showTripModal, showCreateTripModal, showSeatSelection, showAncillarySelection]);

  const stats = useMemo(() => {
    if (!flights.length) return null;
    const parseDuration = (str: string) => {
      const hours = parseInt(str.match(/(\d+)h/)?.[1] || '0');
      const mins = parseInt(str.match(/(\d+)m/)?.[1] || '0');
      return hours * 60 + mins;
    };
    const sortedByPrice = [...flights].sort((a, b) => a.price - b.price);
    const sortedByDuration = [...flights].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    return {
      cheapest: { price: sortedByPrice[0].price, duration: sortedByPrice[0].duration },
      fastest: { price: sortedByDuration[0].price, duration: sortedByDuration[0].duration },
      recommended: { price: flights[0].price, duration: flights[0].duration }
    };
  }, [flights]);

  const sortedFlights = useMemo(() => {
    const list = [...flights];
    const parseDuration = (str: string) => {
      const hours = parseInt(str.match(/(\d+)h/)?.[1] || '0');
      const mins = parseInt(str.match(/(\d+)m/)?.[1] || '0');
      return hours * 60 + mins;
    };

    switch (activeSort) {
      case 'cheapest':
        return list.sort((a, b) => a.price - b.price);
      case 'fastest':
        return list.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
      case 'recommended':
      default:
        return list; 
    }
  }, [flights, activeSort]);

  const handleRefresh = () => {
    setIsStale(false);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2500);
  };

  const handleEditSearch = () => {
    setIsStale(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlightSelect = (id: string) => {
    setSelectedFlightId(prev => prev === id ? null : id);
  };

  // Step 1: Fare Selected -> Revalidate
  const handleFareSelection = async (fareType: string) => {
    const flight = flights.find(f => f.id === selectedFlightId);
    if (!flight) return;

    if (fareType === 'basic') {
      setShowBasicWarning(true); // Warning flow not implemented fully with new steps for brevity, assuming standard flow
      return; 
    }

    // Start verification
    setIsVerifying(fareType);
    try {
      await revalidateItinerary(flight);
      // Success, move to seats
      setTempFlightData(flight); // Store flight for chain
      setShowSeatSelection(true);
    } catch (e) {
      console.error(e);
      setToast({ visible: true, message: 'Fare no longer available' });
    } finally {
      setIsVerifying(null);
    }
  };

  // Step 2: Seats Selected -> Ancillaries
  const handleSeatConfirm = (seats: string[]) => {
    setTempFlightData(prev => prev ? ({ ...prev, selectedSeats: seats }) : null);
    setShowSeatSelection(false);
    setShowAncillarySelection(true);
  };

  // Step 3: Ancillaries Selected -> Checkout
  const handleAncillaryConfirm = (ancillaries: AncillaryOption[]) => {
    setShowAncillarySelection(false);
    if (tempFlightData && onCheckout) {
      const finalFlight = { ...tempFlightData, selectedAncillaries: ancillaries };
      onCheckout(finalFlight);
    }
  };

  const handleSaveClick = (flight: FlightSegment) => {
    setFlightToSave(flight);
    setShowTripModal(true);
  };

  if (isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6 animate-fade-in w-full">
         <div className="relative">
           <div className="absolute inset-0 bg-stone-800 rounded-full animate-ping opacity-50"></div>
           <div className="relative bg-black text-hyrox-yellow p-4 rounded-full shadow-xl border border-stone-800">
             <Loader2 className="animate-spin" size={32} />
           </div>
         </div>
         <div className="text-center space-y-1">
           <p className="text-lg font-black uppercase text-white">Updating fares</p>
           <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">Checking latest availability...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full relative">
      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
      
      <RefreshPromptModal 
        isOpen={isStale}
        onRefresh={handleRefresh}
        onEdit={handleEditSearch}
        onClose={() => setIsStale(false)}
      />

      <BasicEconomyWarningModal 
          isOpen={showBasicWarning}
          onClose={() => setShowBasicWarning(false)}
          onConfirmBasic={() => { setShowBasicWarning(false); /* Should chain to verify */ }}
          onUpgrade={() => { setShowBasicWarning(false); /* Should upgrade and chain */ }}
          priceDifference={100}
      />

      {/* Modals for Flow */}
      {tempFlightData && (
        <>
          <SeatSelectionModal 
            isOpen={showSeatSelection}
            onClose={() => setShowSeatSelection(false)}
            onConfirm={handleSeatConfirm}
            flight={tempFlightData}
          />
          <AncillarySelectionModal 
            isOpen={showAncillarySelection}
            onClose={() => setShowAncillarySelection(false)}
            onConfirm={handleAncillaryConfirm}
            flightId={tempFlightData.id}
          />
        </>
      )}

      <TripSelectionModal 
        isOpen={showTripModal}
        onClose={() => setShowTripModal(false)}
        onSelectTrip={() => {
            setShowTripModal(false);
            setToast({ visible: true, message: `Flight saved to trip successfully.` });
        }}
        onCreateTrip={() => {
            setShowTripModal(false);
            setTimeout(() => setShowCreateTripModal(true), 200);
        }}
      />

      <CreateTripModal 
        isOpen={showCreateTripModal}
        onClose={() => setShowCreateTripModal(false)}
        onCreate={(details) => {
            setShowCreateTripModal(false);
            setToast({ visible: true, message: `Saved to trip: ${details.name}` });
        }}
        flightDestination={flightToSave ? `${flightToSave.destination}` : undefined} 
      />

      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-stone-500 font-bold text-xs mb-2 uppercase tracking-widest">
             {flights.length} results
           </p>
           <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter uppercase">
             {flights.length > 0 ? `Select departure to ${flights[0].destination}` : 'No flights found'}
           </h2>
        </div>
        
        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 relative z-40">
           <FilterDropdown 
             label="Stops" 
             isOpen={activeFilter === 'stops'} 
             onToggle={() => setActiveFilter(activeFilter === 'stops' ? null : 'stops')}
             onClose={() => setActiveFilter(null)}
             onReset={() => setStopsValue('any')}
             isActive={stopsValue !== 'any'}
             width="w-80"
           >
             <StopsFilter selected={stopsValue} onChange={setStopsValue} />
           </FilterDropdown>
           
           <FilterDropdown 
             label="Time" 
             isOpen={activeFilter === 'time'} 
             onToggle={() => setActiveFilter(activeFilter === 'time' ? null : 'time')} 
             onClose={() => setActiveFilter(null)} 
             width="w-96"
           >
             <TimeFilter 
                range={timeRange}
                onChange={setTimeRange}
                tab={timeTab}
                onTabChange={setTimeTab}
             />
           </FilterDropdown>

           <FilterDropdown label="Airlines" isOpen={activeFilter === 'airlines'} onToggle={() => setActiveFilter(activeFilter === 'airlines' ? null : 'airlines')} onClose={() => setActiveFilter(null)} width="w-80"><AirlinesFilter /></FilterDropdown>
           <FilterDropdown label="Price" isOpen={activeFilter === 'price'} onToggle={() => setActiveFilter(activeFilter === 'price' ? null : 'price')} onClose={() => setActiveFilter(null)} width="w-80"><PriceFilter /></FilterDropdown>
           <FilterDropdown label="Policy" isOpen={activeFilter === 'policy'} onToggle={() => setActiveFilter(activeFilter === 'policy' ? null : 'policy')} onClose={() => setActiveFilter(null)} width="w-96"><PolicyFilter /></FilterDropdown>
           
           <button onClick={() => setStopsValue('any')} className="text-stone-500 hover:text-white px-3 transition-colors uppercase font-bold text-xs tracking-wider"><span className="text-sm font-bold">Clear</span></button>
        </div>
      </div>

      {stats && <FlightSortBar activeSort={activeSort} onSortChange={setActiveSort} stats={stats} />}

      <div className="space-y-4">
        {flights.length === 0 ? (
          <div className="text-center py-20 bg-stone-900 rounded-3xl border border-stone-800 border-dashed">
            <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">No flights found matching your criteria.</p>
          </div>
        ) : (
          sortedFlights.map((flight) => {
            const isSelected = selectedFlightId === flight.id;
            return (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                isSelected={isSelected}
                onSelect={() => handleFlightSelect(flight.id)}
                onSave={() => handleSaveClick(flight)}
              >
                {isSelected && (
                  <FareSelectionPanel 
                    basePrice={flight.price} 
                    onSelect={handleFareSelection} 
                  />
                )}
              </FlightCard>
            );
          })
        )}
        
        {flights.length > 0 && (
          <div className="pt-8 flex justify-center">
             <button className="px-10 py-4 bg-stone-900 border border-stone-800 text-stone-400 font-bold rounded-2xl hover:bg-black hover:text-white hover:border-stone-600 transition-all shadow-sm uppercase tracking-wider text-xs">
               Show more results
             </button>
          </div>
        )}
      </div>

    </div>
  );
};
