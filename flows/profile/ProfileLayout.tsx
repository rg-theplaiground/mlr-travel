import React from 'react';
import { 
  Sparkles, Phone, UserPlus, User, CreditCard, 
  Plane, Star, Leaf, Calendar, Bell, Sliders 
} from 'lucide-react';
import { UserData, ProfileTab } from '../../types';

interface ProfileLayoutProps {
  children: React.ReactNode;
  userData: UserData;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, userData, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'rewards', icon: Sparkles, label: 'Rewards' },
    { id: 'contact-info', icon: Phone, label: 'Contact info' },
    { id: 'guest-traveler', icon: UserPlus, label: 'Guest traveler info' },
    { id: 'traveler-info', icon: User, label: 'Traveler info' },
    { id: 'payment-methods', icon: CreditCard, label: 'Payment methods' },
    { id: 'airline-credits', icon: Plane, label: 'Airline credits' },
    { id: 'loyalty-programs', icon: Star, label: 'Loyalty programs' },
    { id: 'carbon', icon: Leaf, label: 'Carbon footprint' },
    { id: 'calendar', icon: Calendar, label: 'Calendar sync' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Sliders, label: 'Other settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Profile Summary */}
        <div className="flex items-center gap-6 mb-12 animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 shadow-inner">
             <User size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">{userData.firstName} {userData.lastName}</h1>
            <p className="text-stone-500">{userData.email}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 animate-slide-up">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 sticky top-28">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id as ProfileTab)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-left
                      ${activeTab === item.id
                        ? 'bg-stone-100 text-stone-900 shadow-sm' 
                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}
                    `}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {activeTab === item.id && <div className="ml-auto w-1 h-4 bg-stone-900 rounded-full" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-stone-100">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
};