
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const POPULAR_AIRPORTS: Airport[] = [
  // --- United States ---
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'United States' },
  { code: 'MDW', name: 'Midway International', city: 'Chicago', country: 'United States' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', country: 'United States' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'United States' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'United States' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'United States' },
  { code: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', country: 'United States' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'United States' },
  { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'United States' },
  { code: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'United States' },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington D.C.', country: 'United States' },
  { code: 'IAD', name: 'Washington Dulles International', city: 'Washington D.C.', country: 'United States' },

  // --- Canada ---
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada' },
  { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau', city: 'Montreal', country: 'Canada' },
  { code: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada' },

  // --- Europe ---
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom' },
  { code: 'LCY', name: 'London City Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden' },

  // --- Asia Pacific ---
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'India' },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China' },

  // --- Middle East ---
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  { code: 'AUH', name: 'Zayed International', city: 'Abu Dhabi', country: 'UAE' },

  // --- South America ---
  { code: 'GRU', name: 'São Paulo/Guarulhos', city: 'São Paulo', country: 'Brazil' },
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia' },
  { code: 'EZE', name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'MEX', name: 'Benito Juárez International', city: 'Mexico City', country: 'Mexico' },
];

export const searchAirports = (query: string): Airport[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];

  return POPULAR_AIRPORTS.filter(airport => 
    airport.code.toLowerCase().includes(normalizedQuery) ||
    airport.name.toLowerCase().includes(normalizedQuery) ||
    airport.city.toLowerCase().includes(normalizedQuery) ||
    airport.country.toLowerCase().includes(normalizedQuery)
  ).sort((a, b) => {
    // Prioritize exact code match
    const aExact = a.code.toLowerCase() === normalizedQuery;
    const bExact = b.code.toLowerCase() === normalizedQuery;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Then prioritize city starts with
    const aCityStart = a.city.toLowerCase().startsWith(normalizedQuery);
    const bCityStart = b.city.toLowerCase().startsWith(normalizedQuery);
    if (aCityStart && !bCityStart) return -1;
    if (!aCityStart && bCityStart) return 1;

    return 0;
  }).slice(0, 8); // Limit to top 8 results
};
