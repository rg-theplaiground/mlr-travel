import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';

interface CancelCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void; // Action to stay on checkout
  onConfirm: () => void; // Action to leave checkout
}

export const CancelCheckoutModal: React.FC<CancelCheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [reason, setReason] = useState('');

  const reasons = [
    { value: 'browsing', label: 'Just checking prices will book later' },
    { value: 'price', label: 'Found a better price elsewhere' },
    { value: 'plans', label: 'Travel plans changed' },
    { value: 'technical', label: 'Technical issues' },
    { value: 'approval', label: 'Need manager approval' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" hideHeader>
      <div className="p-8 md:p-10">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-stone-900 mb-3 tracking-tight">Are you sure?</h3>
          <p className="text-stone-500 text-lg leading-relaxed">
            Book now to secure your current price. Prices may frequently increase due to availability and demand.
          </p>
        </div>

        <div className="mb-10">
           <Select
             label="Reason for not completing (optional):"
             options={[{ value: '', label: 'Select reason' }, ...reasons]}
             value={reason}
             onChange={(e) => setReason(e.target.value)}
             className="bg-stone-50 border-stone-100 focus:bg-white"
           />
        </div>

        <div className="flex items-center gap-4">
           <Button
             variant="secondary"
             onClick={onConfirm}
             className="px-8 border-stone-200 text-stone-600 font-bold hover:bg-stone-50 min-w-[100px]"
           >
             Yes
           </Button>
           <Button
             fullWidth
             className="bg-purple-600 hover:bg-purple-700 shadow-purple-200 font-bold"
             onClick={onClose}
           >
             Back to checkout
           </Button>
        </div>
      </div>
    </Modal>
  );
};