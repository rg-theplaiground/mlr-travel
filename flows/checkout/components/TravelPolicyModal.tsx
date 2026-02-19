import React, { useState } from 'react';
import { Plane, Hotel, Train, Car, X } from 'lucide-react';
import { Modal } from '../../../components/Modal';

interface TravelPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

export const TravelPolicyModal: React.FC<TravelPolicyModalProps> = ({ 
  isOpen, 
  onClose,
  companyName = "your company"
}) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'trains' | 'cars'>('flights');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" hideHeader>
      <div className="p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-2">Your travel policy</h2>
          <p className="text-stone-500 font-medium">Assigned to you by {companyName}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-8">
           <PolicyTab 
             active={activeTab === 'flights'} 
             onClick={() => setActiveTab('flights')} 
             icon={Plane} 
             label="Flights" 
           />
           <PolicyTab 
             active={activeTab === 'hotels'} 
             onClick={() => setActiveTab('hotels')} 
             icon={Hotel} 
             label="Hotels" 
           />
           <PolicyTab 
             active={activeTab === 'trains'} 
             onClick={() => setActiveTab('trains')} 
             icon={Train} 
             label="Trains" 
           />
           <PolicyTab 
             active={activeTab === 'cars'} 
             onClick={() => setActiveTab('cars')} 
             icon={Car} 
             label="Cars" 
           />
        </div>

        {/* Content */}
        <div className="animate-fade-in">
           {activeTab === 'flights' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Column Headers */}
                   <div className="hidden md:block"></div>
                   <div className="font-bold text-stone-900">Under 8 hours</div>
                   <div className="font-bold text-stone-900">Over 8 hours</div>

                   {/* Row 1: Price */}
                   <div className="font-bold text-stone-900">Price</div>
                   <div className="text-stone-600 text-sm">Book up to the maximum price shown at the top of your search</div>
                   <div className="text-stone-600 text-sm">Book up to the maximum price shown at the top of your search</div>

                   {/* Divider */}
                   <div className="col-span-1 md:col-span-3 h-px bg-stone-100"></div>

                   {/* Row 2: Cabin max */}
                   <div className="font-bold text-stone-900">Cabin max</div>
                   <div className="text-stone-600 text-sm">Economy</div>
                   <div className="text-stone-600 text-sm">Economy</div>

                   {/* Divider */}
                   <div className="col-span-1 md:col-span-3 h-px bg-stone-100"></div>

                   {/* Row 3: Cabin upgrades */}
                   <div className="font-bold text-stone-900">Cabin upgrades</div>
                   <div className="text-stone-600 text-sm">If cheaper than cabin max</div>
                   <div className="text-stone-600 text-sm">If cheaper than cabin max and on red-eye flights</div>
                </div>

                <div className="pt-6 border-t border-stone-100">
                   <h4 className="font-bold text-stone-900 mb-1">Booking review</h4>
                   <p className="text-stone-600 text-sm">Your manager or travel approver will review, and may cancel, out-of-policy bookings.</p>
                </div>
             </div>
           )}

           {/* Placeholders for other tabs */}
           {activeTab !== 'flights' && (
             <div className="py-12 text-center text-stone-400">
               <p>Policy details for {activeTab} go here.</p>
             </div>
           )}
        </div>

      </div>
    </Modal>
  );
};

const PolicyTab: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string; 
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-bold text-sm
      ${active 
        ? 'border-purple-600 text-purple-600' 
        : 'border-transparent text-stone-500 hover:text-stone-800'}
    `}
  >
    <Icon size={18} />
    {label}
  </button>
);