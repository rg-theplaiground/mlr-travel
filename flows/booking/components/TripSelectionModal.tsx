import * as React from 'react';
import { X, Plus, Calendar, Sparkles } from 'lucide-react';
import { Modal } from '@/components/Modal';

interface TripSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: () => void;
}

// Mock trips data
const UPCOMING_TRIPS = [
  {
    id: 'trip-1',
    destination: 'London, UK',
    dates: 'May 31 - Jun 5',
    items: 2,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'trip-2',
    destination: 'New York, USA',
    dates: 'Aug 12 - Aug 15',
    items: 1,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&q=80&w=400'
  }
];

export const TripSelectionModal: React.FC<TripSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectTrip,
  onCreateTrip
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" hideHeader>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-stone-900">Upcoming trips</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-stone-50 rounded-2xl p-4 mb-6 border border-stone-100 flex gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-stone-900 text-sm">Planning made easier</h4>
              <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Beta</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Compare before you commit by saving hotel and flight options to your trips. Only available for business trips on desktop, for now.
            </p>
          </div>
        </div>

        {/* Create New Trip Button */}
        <button
          onClick={onCreateTrip}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-stone-200 text-stone-500 font-bold hover:border-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all mb-6 group"
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          New trip
        </button>

        {/* Trips List */}
        <div className="space-y-3">
          {UPCOMING_TRIPS.map((trip) => (
            <button
              key={trip.id}
              onClick={() => onSelectTrip(trip.id)}
              className="w-full flex items-center gap-4 p-3 rounded-2xl border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all text-left group bg-white"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0 relative">
                <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-stone-900 group-hover:text-black">{trip.destination}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{trip.dates}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                  <span>{trip.items} items saved</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full border-2 border-stone-100 flex items-center justify-center text-transparent group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                <Plus size={14} strokeWidth={3} />
              </div>
            </button>
          ))}
        </div>

      </div>
    </Modal>
  );
};