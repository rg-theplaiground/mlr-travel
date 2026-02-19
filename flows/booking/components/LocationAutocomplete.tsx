
import * as React from 'react';
import { createPortal } from 'react-dom';
import { getGeoAutocomplete, GeoDoc, autocompleteHotelName, HotelAutocompleteItem, geoCodeLocation, GeoCodeItem } from '@/services/sabre';
import { searchAirports, Airport } from '@/services/airports';
import { Loader2, Hotel, MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  mode?: 'flight' | 'hotel';
}

// Union type to handle various suggestion shapes
type Suggestion = GeoDoc | HotelAutocompleteItem | GeoCodeItem | Airport;

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  className,
  mode = 'flight'
}) => {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  // Debounced Search Effect
  React.useEffect(() => {
    let active = true; // Prevents race conditions

    // Don't search if value is too short
    if (!value || value.length < 2) {
      setSuggestions([]);
      setLoading(false);
      // Close dropdown if cleared
      if (!value) setShowDropdown(false);
      return;
    }

    if (document.activeElement !== inputRef.current) {
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    const timer = setTimeout(async () => {
      try {
        let combinedResults: Suggestion[] = [];

        if (mode === 'hotel') {
          // Parallel fetch for speed
          const [hotelProperties, geoCodeResults] = await Promise.all([
            autocompleteHotelName(value),
            geoCodeLocation(value)
          ]);
          combinedResults = [...hotelProperties, ...geoCodeResults];
        } else {
          // Flight Mode Logic (Keeping existing logic just in case, though this app is mostly hotels now)
          const localResults = searchAirports(value);
          let remoteResults: Suggestion[] = [];
          try {
            const [airports, cities] = await Promise.all([
              getGeoAutocomplete(value, 'AIR'),
              getGeoAutocomplete(value, 'CITY')
            ]);
            remoteResults = [...airports, ...cities];
          } catch (e) {
            console.warn("Sabre Geo Lookup failed", e);
          }

          const allItems = [...localResults, ...remoteResults];
          const unique = new Map();

          allItems.forEach(item => {
            let id = '';
            if (isAirport(item)) id = item.code;
            else if (isGeoDoc(item)) id = item.id;
            else return;

            if (!unique.has(id)) {
              unique.set(id, item);
            }
          });

          combinedResults = Array.from(unique.values());
        }

        if (active) {
          setSuggestions(combinedResults);
        }
      } catch (error) {
        console.error("Autocomplete failed", error);
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [value, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    // Explicitly show on typing
    if (val.length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: Suggestion) => {
    if (isHotelItem(item)) {
      onChange(item.hotelName);
    } else if (isGeoCodeItem(item)) {
      onChange(item.name || item.formattedAddress || '');
    } else if (isAirport(item)) {
      onChange(item.code);
    } else if (isGeoDoc(item)) {
      onChange(item.id || item.name);
    }
    setShowDropdown(false);
    setSuggestions([]);
  };

  // Type Guards
  const isHotelItem = (item: Suggestion): item is HotelAutocompleteItem => (item as HotelAutocompleteItem).hotelName !== undefined;
  const isGeoCodeItem = (item: Suggestion): item is GeoCodeItem => (item as GeoCodeItem).formattedAddress !== undefined;
  const isAirport = (item: Suggestion): item is Airport => (item as Airport).code !== undefined;
  const isGeoDoc = (item: Suggestion): item is GeoDoc => (item as GeoDoc).category !== undefined;



  React.useEffect(() => {
    if (showDropdown && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 12}px`,
        left: `${rect.left}px`,
        width: `${Math.max(rect.width, 320)}px`,
        zIndex: 9999,
      });
    }
  }, [showDropdown]);

  React.useEffect(() => {
    const handleInteraction = (event: Event) => {
      if (event.type === 'scroll' || event.type === 'resize') {
        setShowDropdown(false);
        return;
      }
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        wrapperRef.current && !wrapperRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleInteraction);
      window.addEventListener('scroll', handleInteraction, true);
      window.addEventListener('resize', handleInteraction);
    }
    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction, true);
      window.removeEventListener('resize', handleInteraction);
    };
  }, [showDropdown]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        onFocus={() => {
          if (value && value.length >= 2) setShowDropdown(true);
        }}
        autoComplete="off"
        spellCheck="false"
      />

      {showDropdown && (suggestions.length > 0 || loading) && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden animate-scale-in origin-top-left"
        >
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex items-center justify-center">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
              {loading && <Loader2 size={10} className="animate-spin text-mlr-red" />}
              {loading ? 'Searching...' : (mode === 'hotel' ? 'Properties & Locations' : 'Airports & Cities')}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto custom-scrollbar">
            {suggestions.map((item, idx) => {
              if (isHotelItem(item)) {
                return (
                  <button key={`hotel-${idx}`} onClick={() => handleSelect(item)} className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-center justify-between group border-b border-stone-50 last:border-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-mlr-red flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all"><Hotel size={16} /></div>
                      <div className="min-w-0">
                        <div className="block font-bold text-stone-900 truncate text-sm uppercase tracking-wide">{item.hotelName}</div>
                        <div className="flex items-center gap-1 text-xs text-stone-400 truncate font-medium uppercase"><MapPin size={10} />{item.city}, {item.countryName}</div>
                      </div>
                    </div>
                  </button>
                );
              } else if (isGeoCodeItem(item)) {
                return (
                  <button key={`geocode-${idx}`} onClick={() => handleSelect(item)} className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-center justify-between group border-b border-stone-50 last:border-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all"><MapPin size={16} /></div>
                      <div className="min-w-0">
                        <div className="block font-bold text-stone-900 text-sm truncate uppercase tracking-wide">{item.name}</div>
                        <span className="block text-xs text-stone-400 truncate font-medium uppercase">{item.formattedAddress || `${item.city}, ${item.country}`}</span>
                      </div>
                    </div>
                  </button>
                );
              } else {
                return (
                  <button key={`other-${idx}`} onClick={() => handleSelect(item)} className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex items-center justify-between group border-b border-stone-50 last:border-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 flex-shrink-0"><MapPin size={16} /></div>
                      <div className="min-w-0">
                        <span className="block font-bold text-stone-900 text-sm truncate">
                          {isAirport(item) ? item.code : (isGeoDoc(item) ? (item.name || item.id) : '')}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }
            })}

            {suggestions.length === 0 && !loading && (
              <div className="p-6 text-center text-stone-400 text-xs font-bold uppercase tracking-widest">No results found</div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
