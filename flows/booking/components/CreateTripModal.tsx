import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Calendar } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (details: { name: string; destination: string; startDate: string; endDate: string }) => void;
  flightDestination?: string; // To auto-fill
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate,
  flightDestination 
}) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tripName: '',
    traveler: 'John Smith Jr'
  });

  // Auto-fill based on flight destination if provided
  useEffect(() => {
    if (isOpen && flightDestination) {
      // flightDestination might be "LHR London" or similar
      // Let's try to extract city name roughly
      const city = flightDestination.split(' ').slice(1).join(' ') || flightDestination;
      
      setFormData(prev => ({
        ...prev,
        destination: city,
        tripName: `${city} Trip`
      }));
    }
  }, [isOpen, flightDestination]);

  // Auto-update trip name when destination changes if user hasn't manually edited name (simple heuristic)
  const handleDestinationChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      destination: val,
      tripName: val ? `${val} Trip` : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name: formData.tripName,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" hideHeader>
      <div className="p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-stone-900">New trip</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-stone-50 rounded-2xl p-4 mb-8 border border-stone-100 flex gap-4">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
             <Sparkles size={18} />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <h4 className="font-bold text-stone-900 text-sm">Planning made easier</h4>
                 <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Beta</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Compare before you commit by saving hotel and flight options to your trips. Only available for business trips on desktop, for now.
              </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Destination"
            placeholder="e.g. London, UK"
            icon={<MapPin size={20} />}
            value={formData.destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Start date"
               type="date"
               value={formData.startDate}
               onChange={(e) => setFormData({...formData, startDate: e.target.value})}
               required
             />
             <Input 
               label="End date"
               type="date"
               value={formData.endDate}
               onChange={(e) => setFormData({...formData, endDate: e.target.value})}
               required
             />
          </div>

          <Input 
            label="Trip name"
            placeholder="e.g. London Trip"
            value={formData.tripName}
            onChange={(e) => setFormData({...formData, tripName: e.target.value})}
            required
          />

          <Select 
            label="Traveler"
            options={[
              { value: 'John Smith Jr', label: 'John Smith Jr' },
              { value: 'Sarah Connors', label: 'Sarah Connors' }
            ]}
            value={formData.traveler}
            onChange={(e) => setFormData({...formData, traveler: e.target.value})}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-stone-100 mt-8">
             <Button 
               type="button" 
               variant="secondary" 
               fullWidth 
               onClick={onClose}
               className="font-bold"
             >
               Cancel
             </Button>
             <Button 
               type="submit" 
               fullWidth
               className="bg-purple-600 hover:bg-purple-700 shadow-purple-200 font-bold"
             >
               Create trip
             </Button>
          </div>
        </form>

      </div>
    </Modal>
  );
};