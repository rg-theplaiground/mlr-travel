// Sabre Credentials (from environment variables)
const CLIENT_ID = process.env.SABRE_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.SABRE_CLIENT_SECRET ?? '';

// Sabre Endpoints
const AUTH_ENDPOINT = 'https://api.cert.platform.sabre.com/v2/auth/token';
// These were unused and causing TS6133 errors
// const HOTEL_AVAIL_ENDPOINT = 'https://api.cert.platform.sabre.com/v5/get/hotelavail';
// const HOTEL_CONTENT_ENDPOINT = 'https://api.cert.platform.sabre.com/v4.0.0/get/hotelcontent';
// const HOTEL_DETAILS_ENDPOINT = 'https://api.cert.platform.sabre.com/v5/get/hoteldetails';
// const HOTEL_PRICE_CHECK_ENDPOINT = 'https://api.cert.platform.sabre.com/v5/hotel/pricecheck';
// const CREATE_BOOKING_ENDPOINT = 'https://api.cert.platform.sabre.com/v1/trip/orders/createBooking';

// Interfaces
export interface HotelSearchCriteria {
    destination: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
}

export interface HotelContentDTO {
    images: string[];
    description: string;
    amenities: string[];
    address: string;
    contact: { phone: string; email: string };
    policies: { checkIn: string; checkOut: string };
    services: string[];
    rate?: { amount: number; currency: string };
    rateKey?: string;
}

export interface AncillaryOption {
    id: string;
    name: string;
    type: string;
    price: number;
    description: string;
}

export interface GeoDoc {
    id: string;
    name: string;
    category: string;
    city?: string;
    countryName: string;
}

export interface HotelAutocompleteItem {
    hotelName: string;
    city: string;
    countryName: string;
}

export interface GeoCodeItem {
    name: string;
    formattedAddress?: string;
    city?: string;
    country?: string;
}

export interface SeasonalityItem {
    YearWeekNumber: number;
    SeasonalityIndicator: string;
}

export interface SeasonalityResponse {
    Seasonality: SeasonalityItem[];
}

export interface SeatMapResponse {
    response: {
        priceDefinitions: { id: string; totalPrice: { amount: number; currencyCode: string } }[];
        seatMaps: {
            cabinCompartments: {
                cabinName: string;
                seatRows: {
                    row: number;
                    seats: {
                        column: string;
                        occupationStatusCode: string;
                        offerItemRefIds?: string[];
                    }[];
                }[];
            }[];
        }[];
    }
}

// Token Cache
let cachedToken: string | null = null;
let tokenExpiration: number = 0;

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> => {
    try {
        const response = await fetch(url, options);
        if ((response.status === 429 || response.status >= 500) && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
};

export const authenticateSabre = async (): Promise<string | null> => {
    if (cachedToken && Date.now() < tokenExpiration - 60000) {
        return cachedToken;
    }

    try {
        const encodedClientId = btoa(CLIENT_ID);
        const encodedClientSecret = btoa(CLIENT_SECRET);
        const encodedData = btoa(`${encodedClientId}:${encodedClientSecret}`);

        const response = await fetchWithRetry(AUTH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedData}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) return null;
        const data = await response.json();

        cachedToken = data.access_token;
        tokenExpiration = Date.now() + (data.expires_in * 1000);
        return data.access_token;
    } catch (error) {
        console.error('Sabre Auth Error', error);
        return null;
    }
};

// --- Mock Data for MLR ---
const MOCK_HOTELS = [
    {
        id: "10001",
        name: "The Rugby Grand Hotel",
        address: "12 Scrum Lane, San Diego, CA",
        city: "San Diego",
        rating: "5.0",
        price: "245.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
        distance: 0.5,
        description: "Official partner hotel for the San Diego Legion. Located steps from the stadium with exclusive fan lounges.",
        amenities: ["Fan Zone", "Pool", "Gym", "Bar", "Free Wifi"]
    },
    {
        id: "10002",
        name: "Stadium View Suites",
        address: "400 Try Line Blvd, Chicago, IL",
        city: "Chicago",
        rating: "4.0",
        price: "185.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800",
        distance: 1.2,
        description: "Modern suites perfect for match weekend. Includes shuttle service to the Hounds' stadium.",
        amenities: ["Shuttle", "Restaurant", "Meeting Rooms", "Breakfast"]
    },
    {
        id: "10003",
        name: "Seawolves Lodge",
        address: "88 Ruck Street, Seattle, WA",
        city: "Seattle",
        rating: "4.5",
        price: "210.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
        distance: 2.0,
        description: "Cozy, upscale lodge themed for the true rugby enthusiast. Great bar atmosphere post-match.",
        amenities: ["Rooftop Bar", "Spa", "Valet", "Free Wifi"]
    },
    {
        id: "10004",
        name: "Free Jacks Inn",
        address: "10 Quincy Ave, Boston, MA",
        city: "Boston",
        rating: "3.5",
        price: "155.00",
        currency: "USD",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800",
        distance: 3.5,
        description: "Affordable and comfortable. The go-to spot for traveling supporters.",
        amenities: ["Parking", "Restaurant", "Wifi"]
    }
];

const generateMockHotelResponse = () => {
    return {
        "GetHotelAvailRS": {
            "HotelAvailInfos": {
                "HotelAvailInfo": MOCK_HOTELS.map(hotel => ({
                    "HotelInfo": {
                        "HotelCode": hotel.id,
                        "HotelName": hotel.name,
                        "LocationInfo": {
                            "Address": { "AddressLine1": hotel.address, "CityName": { "value": hotel.city } },
                        },
                        "Amenities": { "Amenity": hotel.amenities.map(d => ({ "Description": d })) },
                        "SabreRating": hotel.rating,
                        "Distance": hotel.distance
                    },
                    "HotelRateInfo": {
                        "RateInfos": {
                            "ConvertedRateInfo": [{ "AverageNightlyRate": hotel.price, "CurrencyCode": hotel.currency }]
                        }
                    },
                    "HotelImageInfo": {
                        "ImageItem": {
                            "Image": { "Url": hotel.image }
                        }
                    }
                }))
            }
        }
    };
}

export const searchHotels = async (_criteria: HotelSearchCriteria) => {
    // Always return mock data for this demo to ensure stability
    await new Promise(r => setTimeout(r, 800)); // Simulate network
    return generateMockHotelResponse();
};

export const getHotelDetails = async (hotelCode: string, _checkIn: string, _checkOut: string, _adults: number): Promise<HotelContentDTO | null> => {
    // Fixed: MOCK_HOTEL_DATA not defined
    const hotel = MOCK_HOTELS.find(h => h.id === hotelCode);
    await new Promise(resolve => setTimeout(resolve, 600));

    const baseDetails: HotelContentDTO = {
        images: [
            hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"
        ],
        description: hotel?.description || "Experience match day in comfort. This property offers premium amenities and close proximity to the stadium.",
        amenities: hotel?.amenities || ["Wifi", "Bar", "Pool"],
        address: hotel?.address || "123 Rugby Road",
        contact: { phone: "+1 800 MLR RUGBY", email: "concierge@mlr-travel.com" },
        policies: { checkIn: "15:00", checkOut: "11:00" },
        services: ["Concierge", "Match Shuttle", "Laundry"],
        rate: { amount: parseFloat(hotel?.price ?? "200"), currency: "USD" },
        rateKey: "MOCK_KEY"
    };
    return baseDetails;
};

export const createBooking = async (_req: any) => { return { success: true, pnr: "MLR" + Math.floor(Math.random() * 10000) }; };
export const searchLowFares = async (_c: any) => { return {}; };

export const getSeatMap = async (_f: any): Promise<SeatMapResponse> => {
    return {
        response: {
            priceDefinitions: [
                { id: 'premium-seat-offer', totalPrice: { amount: 49, currencyCode: 'USD' } },
                { id: 'business-seat-offer', totalPrice: { amount: 150, currencyCode: 'USD' } }
            ],
            seatMaps: [{
                cabinCompartments: [{
                    cabinName: "Economy",
                    seatRows: Array.from({ length: 20 }).map((_, i) => ({
                        row: i + 1,
                        seats: ['A', 'B', 'C', 'D', 'E', 'F'].map(col => ({
                            column: col,
                            occupationStatusCode: Math.random() > 0.7 ? 'O' : 'F',
                            offerItemRefIds: i < 3 ? ['premium-seat-offer'] : undefined
                        }))
                    }))
                }]
            }]
        }
    };
};

export const revalidateItinerary = async (_f: any) => { return { success: true }; };

export const getAncillaries = async (_f: string): Promise<AncillaryOption[]> => {
    return [
        { id: 'bag1', name: 'Checked Bag', type: 'BAG', price: 35, description: 'Up to 23kg' },
        { id: 'wifi', name: 'In-flight Wi-Fi', type: 'WIFI', price: 15, description: 'Stream quality' },
        { id: 'lounge', name: 'Lounge Access', type: 'LOUNGE', price: 50, description: 'Relax before you fly' }
    ];
};

export const getGeoAutocomplete = async (_q: string, category?: string): Promise<GeoDoc[]> => {
    // Mock response matching GeoDoc interface
    if (category === 'AIR') {
        return [
            { id: 'LHR', name: 'Heathrow', category: 'AIR', city: 'London', countryName: 'UK' },
            { id: 'JFK', name: 'John F Kennedy', category: 'AIR', city: 'New York', countryName: 'USA' }
        ];
    }
    return [
        { id: 'NYC', name: 'New York City', category: 'CITY', city: 'New York', countryName: 'USA' }
    ];
};

export const autocompleteHotelName = async (_q: string): Promise<HotelAutocompleteItem[]> => {
    return [
        { hotelName: "Hilton " + _q, city: "San Diego", countryName: "USA" }
    ];
};

export const geoCodeLocation = async (_q: string): Promise<GeoCodeItem[]> => {
    return [
        { name: _q + " Stadium", formattedAddress: "123 Stadium Way", city: "San Diego", country: "USA" }
    ];
};

export const getHotelContent = async (c: string) => { return getHotelDetails(c, "", "", 1); };

export const hotelPriceCheck = async (_k: string) => { return { PriceChange: false }; };

export const getTravelSeasonality = async (_d: string): Promise<SeasonalityResponse | null> => {
    // Mock 52 weeks
    const data: SeasonalityItem[] = Array.from({ length: 52 }).map((_, i) => ({
        YearWeekNumber: i + 1,
        SeasonalityIndicator: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
    }));
    return { Seasonality: data };
};
