
import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { UserData } from '../types';

interface NavbarProps {
  userData: UserData;
  onNavigateToProfile?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToService?: (service: 'flights' | 'hotels') => void;
  activeItem?: 'races' | 'hotels' | 'flights' | 'requests';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  userData, 
  onNavigateToProfile, 
  onNavigateToDashboard, 
  activeItem
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we should show the solid "light background" version of the header.
  // We show solid if the user has scrolled OR if we are on a page that isn't the dashboard (hero).
  // We exclude 'undefined' activeItem (Checkout) to prevent conflicting with its own header, defaulting to scroll behavior there.
  const isSolid = scrolled || (activeItem && activeItem !== 'races');

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid 
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm text-black' 
          : 'bg-transparent py-6 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        
        {/* Logo Area */}
        <button 
          onClick={onNavigateToDashboard}
          className="flex items-center gap-3 group"
        >
          <img 
            src="https://724fta3143.ufs.sh/f/MTE58BV23upXgV6A1ejrws4cYgLUiunyW13XKFv5fNSPZlJD"
            alt="Major League Rugby"
            className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col items-start leading-none">
            <span className={`text-xl font-bold tracking-tight ${isSolid ? 'text-black' : 'text-white'}`}>
              MAJOR LEAGUE <span className={isSolid ? 'text-mlr-red' : 'text-white/80'}>RUGBY</span>
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isSolid ? 'text-stone-500' : 'text-white/60'}`}>Travel Portal</span>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className={`hidden lg:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-colors ${isSolid ? 'bg-stone-50 text-stone-600' : 'bg-white/10 text-white border border-white/20'}`}>
             <Phone size={14} className={isSolid ? 'text-mlr-red' : 'text-white'} />
             <span>1.866.359.2867</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
