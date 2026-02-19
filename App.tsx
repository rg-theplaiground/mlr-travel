
import React, { useState, useEffect } from 'react';
import { Dashboard } from './flows/dashboard/Dashboard';
import { ProfileLayout } from './flows/profile/ProfileLayout';
import { TravelerInfo } from './flows/profile/TravelerInfo';
import { LoyaltyPrograms } from './flows/profile/LoyaltyPrograms';
import { RewardsView } from './flows/profile/RewardsView';
import { BookFlight } from './flows/booking/BookFlight';
import { Checkout } from './flows/checkout/Checkout';
import { MatchBookingWizard } from './flows/match-booking/MatchBookingWizard';
import { Navbar } from './components/Navbar';
import { AppView, UserData, ProfileTab, Match } from './types';
import { authenticateSabre } from './services/sabre';
import { FlightSegment } from './flows/booking/components/FlightCard';

function App() {
  // Defaulting to dashboard, skipping login/onboarding
  const [view, setView] = useState<AppView>('dashboard');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('traveler-info');
  const [bookingTab, setBookingTab] = useState<'flights' | 'hotels' | 'trains' | 'cars'>('flights');
  
  // Mock User Data
  const [userData, setUserData] = useState<UserData>({
    role: 'traveler',
    email: 'athlete@hyrox.com',
    firstName: 'ALEX',
    lastName: 'CROSSFIT',
    companyName: 'HYROX COMMUNITY'
  });
  
  const [isSabreConnected, setIsSabreConnected] = useState<boolean>(false);
  const [bookingFlight, setBookingFlight] = useState<FlightSegment | null>(null);
  const [initialBookingData, setInitialBookingData] = useState<{ destination: string; date?: Date } | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Initialize Sabre Session on App Load
  useEffect(() => {
    const initSabre = async () => {
      const token = await authenticateSabre();
      setIsSabreConnected(!!token);
    };
    initSabre();
  }, []);

  const navigateToProfile = () => {
    setView('profile');
    setActiveProfileTab('traveler-info');
  };

  const handleNavigateToBooking = (data?: { destination: string; date?: Date }) => {
    if (data) {
      setInitialBookingData(data);
    } else {
      setInitialBookingData(null);
    }
    setView('booking');
    setBookingTab('flights'); // Default to flights when coming from dashboard search usually
    window.scrollTo(0, 0);
  };

  const handleNavigateToService = (service: 'flights' | 'hotels') => {
    setBookingTab(service);
    setInitialBookingData(null); // Clear specific search data when just switching tabs
    setView('booking');
    window.scrollTo(0, 0);
  };

  const handleFlightSelection = (flight: FlightSegment) => {
    setBookingFlight(flight);
    setView('checkout');
    window.scrollTo(0, 0);
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setView('match-booking');
  };

  // Determine active nav item
  const activeNavItem = view === 'dashboard' 
    ? 'races' 
    : view === 'booking' 
      ? (bookingTab === 'hotels' ? 'hotels' : 'flights')
      : view === 'profile' 
        ? 'requests' 
        : undefined;

  // Don't show navbar in the immersive match booking flow
  const showNavbar = view !== 'match-booking';

  return (
    <div className="antialiased text-white bg-hyrox-charcoal min-h-screen relative font-sans">
      
      {showNavbar && (
        <Navbar 
          userData={userData} 
          onNavigateToProfile={navigateToProfile}
          onNavigateToDashboard={() => setView('dashboard')}
          onNavigateToService={handleNavigateToService}
          activeItem={activeNavItem}
        />
      )}
      
      {view === 'dashboard' && (
        <Dashboard 
          userData={userData} 
          onNavigateToProfile={navigateToProfile} 
          onNavigateToBooking={handleNavigateToBooking}
          onMatchSelect={handleMatchSelect}
        />
      )}
      {view === 'booking' && (
        <BookFlight 
          initialSearchData={initialBookingData}
          onNavigateToCheckout={handleFlightSelection}
          initialTab={bookingTab}
        />
      )}
      {view === 'checkout' && (
        <Checkout 
          flight={bookingFlight}
          onBack={() => setView('booking')} 
          onFinish={() => setView('dashboard')} 
        />
      )}
      {view === 'match-booking' && selectedMatch && (
        <MatchBookingWizard 
          match={selectedMatch}
          userData={userData}
          onClose={() => setView('dashboard')}
        />
      )}
      {view === 'profile' && (
        <ProfileLayout 
          userData={userData} 
          activeTab={activeProfileTab} 
          onTabChange={setActiveProfileTab}
        >
          {activeProfileTab === 'traveler-info' && <TravelerInfo initialData={userData} />}
          {activeProfileTab === 'loyalty-programs' && <LoyaltyPrograms />}
          {activeProfileTab === 'rewards' && <RewardsView />}
          
          {/* Placeholder for other tabs */}
          {activeProfileTab !== 'traveler-info' && activeProfileTab !== 'loyalty-programs' && activeProfileTab !== 'rewards' && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mb-4 text-hyrox-yellow border border-stone-800">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-xl font-bold text-white uppercase italic">Coming Soon</h3>
                <p className="text-stone-500">This section is under development.</p>
            </div>
          )}
        </ProfileLayout>
      )}
    </div>
  );
}

export default App;
