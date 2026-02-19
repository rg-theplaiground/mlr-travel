
import * as React from 'react';
import { Hotel as HotelIcon, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Toast } from '@/components/Toast';
import { DateRangePicker } from './components/DateRangePicker';
import { HotelResults } from './components/HotelResults';
import { HotelDetailsModal } from './components/HotelDetailsModal';
import { searchHotels } from '@/services/sabre';
import { Hotel } from './components/HotelCard';
import { LocationAutocomplete } from './components/LocationAutocomplete';

interface BookFlightProps {
  onNavigateToCheckout?: (item: Hotel) => void;
  initialSearchData?: { destination: string; date?: Date } | null;
  initialTab?: string;
}

export const BookFlight: React.FC<BookFlightProps> = ({ onNavigateToCheckout: _onNavigateToCheckout, initialSearchData }) => {
  // Always 'hotels'
  // const _activeTab = 'hotels';

  // View State
  const [viewState, setViewState] = React.useState<'search' | 'searching' | 'results'>('search');
  const [errorMessage, setErrorMessage] = React.useState('');

  // Search Configuration
  const [destination, setDestination] = React.useState('San Diego');

  // Date State
  const [dates, setDates] = React.useState<{ start: Date | null; end: Date | null }>({
    start: (() => { const d = new Date(); d.setDate(d.getDate() + 14); return d; })(),
    end: (() => { const d = new Date(); d.setDate(d.getDate() + 16); return d; })(),
  });

  // Results State
  const [hotelResults, setHotelResults] = React.useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);
  const [showToast, setShowToast] = React.useState({ visible: false, message: '' });

  // Race Condition Handling
  const lastSearchId = React.useRef(0);

  // Initial Data Effect
  React.useEffect(() => {
    if (initialSearchData) {
      if (initialSearchData.destination) setDestination(initialSearchData.destination);
      if (initialSearchData.date) {
        setDates({
          start: initialSearchData.date,
          end: new Date(new Date(initialSearchData.date).getTime() + 86400000 * 2)
        });
      }

      // Auto-search if data is present
      if (initialSearchData.destination && initialSearchData.date) {
        const timer = setTimeout(() => {
          handleSearch(initialSearchData.destination, initialSearchData.date);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [initialSearchData]);

  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async (overrideDest?: string, overrideDate?: Date) => {
    const currentDest = overrideDest || destination;
    const currentDate = overrideDate || dates.start;

    if (!currentDest || !currentDate) {
      setErrorMessage('Please fill in destination and check-in date.');
      return;
    }

    const currentSearchId = ++lastSearchId.current;
    setErrorMessage('');
    setViewState('searching');

    try {
      const formattedDepartDate = formatDateForApi(currentDate);
      const formattedReturnDate = dates.end ? formatDateForApi(dates.end) : "";

      // Hotel Search
      const data = await searchHotels({
        destination: currentDest,
        checkInDate: formattedDepartDate,
        checkOutDate: formattedReturnDate,
        adults: 1
      });

      if (currentSearchId === lastSearchId.current) {
        if (data && data.GetHotelAvailRS?.HotelAvailInfos?.HotelAvailInfo) {
          const hotels: Hotel[] = data.GetHotelAvailRS.HotelAvailInfos.HotelAvailInfo.map((h: { HotelInfo: any; HotelRateInfo: any; HotelImageInfo?: any }, index: number) => {
            // Mocking Package Data for Demo
            const isBundle = index % 2 === 0; // Every other hotel is a bundle

            return {
              id: h.HotelInfo.HotelCode,
              name: h.HotelInfo.HotelName,
              address: h.HotelInfo.LocationInfo.Address.AddressLine1,
              rating: parseFloat(h.HotelInfo.SabreRating),
              price: parseFloat(h.HotelRateInfo.RateInfos.ConvertedRateInfo[0].AverageNightlyRate) * (isBundle ? 1.5 : 1), // Bump price for bundle
              currency: h.HotelRateInfo.RateInfos.ConvertedRateInfo[0].CurrencyCode,
              image: h.HotelImageInfo?.ImageItem?.Image?.Url,
              amenities: h.HotelInfo.Amenities?.Amenity?.map((a: { Description: string }) => a.Description) || [],
              distance: h.HotelInfo.Distance,

              // Injected Package Properties
              packageType: isBundle ? 'bundle' : 'stay',
              matchTicketIncluded: isBundle,
              shuttleIncluded: isBundle || index % 3 === 0,
              fanEventAccess: isBundle,
              isPreferred: index < 2
            };
          });
          setHotelResults(hotels);
          setShowToast({ visible: true, message: `Found ${hotels.length} match packages` });
        }
        setViewState('results');
      }
    } catch (err: unknown) {
      if (currentSearchId === lastSearchId.current) {
        console.error(err);
        setViewState('search');
        setErrorMessage("Unable to fetch results. Please check your connection.");
      }
    }
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDates({ start, end });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans pt-28 pb-20 px-4 md:px-8 text-stone-900">
      <Toast
        message={showToast.message}
        isVisible={showToast.visible}
        onClose={() => setShowToast({ ...showToast, visible: false })}
      />

      {selectedHotel && (
        <HotelDetailsModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onBook={() => {
            setSelectedHotel(null);
            setShowToast({ visible: true, message: 'Package request sent to agent.' });
          }}
          searchCriteria={{
            checkIn: dates.start || new Date(),
            checkOut: dates.end || new Date(new Date().setDate(new Date().getDate() + 1)),
            adults: 1
          }}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Results Header */}
        <div className={`mb-8 animate-fade-in transition-all duration-500 ${viewState === 'results' ? 'block' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-6">
            <button onClick={() => setViewState('search')} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold uppercase text-xs tracking-wider">
              <ArrowLeft size={16} /> Modify Search
            </button>
            <div>
              <h1 className="text-3xl font-black italic uppercase text-stone-900 tracking-tighter">
                Match Packages: <span className="text-mlr-red">{destination}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className={`bg-white rounded-3xl shadow-soft p-2 transition-all duration-500 relative z-30 ${viewState === 'results' ? 'hidden' : 'animate-slide-up max-w-4xl mx-auto'}`}>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative bg-stone-50 rounded-2xl px-6 py-4 hover:bg-stone-100 transition-colors">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Destination</label>
              <div className="flex items-center gap-3">
                <HotelIcon className="text-mlr-red" size={20} />
                <LocationAutocomplete
                  placeholder="City or Stadium"
                  value={destination}
                  onChange={setDestination}
                  className="w-full bg-transparent outline-none font-bold text-stone-900 placeholder:text-stone-400 text-lg"
                  mode="hotel"
                />
              </div>
            </div>
            <div className="flex-[0.8] relative bg-stone-50 rounded-2xl px-6 py-4 hover:bg-stone-100 transition-colors">
              <DateRangePicker
                startDate={dates.start}
                endDate={dates.end}
                onChange={handleDateChange}
                tripType="roundtrip"
                minDate={new Date()}
                className="font-bold text-stone-900"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={viewState === 'searching'}
              className="px-10 bg-mlr-red hover:bg-red-700 text-white font-bold uppercase tracking-wide rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] shadow-lg shadow-red-500/20"
            >
              {viewState === 'searching' ? <Loader2 size={24} className="animate-spin" /> : <span>Search</span>}
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 mx-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2">
              <AlertTriangle size={16} />
              {errorMessage}
            </div>
          )}
        </div>

        {viewState === 'results' && (
          <div className="animate-fade-in">
            <HotelResults hotels={hotelResults} isLoading={false} onSelectHotel={setSelectedHotel} />
          </div>
        )}
      </div>
    </div>
  );
};
