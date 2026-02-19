import * as React from 'react';
import { Briefcase, Settings } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

interface SwitchToPersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SwitchToPersonalModal: React.FC<SwitchToPersonalModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" hideHeader>
      <div className="p-8 flex flex-col items-center text-center">

        {/* Icon */}
        <div className="w-24 h-24 bg-purple-50 rounded-[2rem] flex items-center justify-center mb-6 text-purple-600 relative">
          <Briefcase size={32} strokeWidth={1.5} />
          <div className="absolute top-6 right-5 text-purple-400">
            <Settings size={16} className="animate-spin-slow" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900 mb-3">
          Switch to booking personal travel
        </h3>

        <p className="text-stone-500 mb-8 max-w-sm leading-relaxed">
          If you meant to book a personal trip, change your booking type from business to personal.
        </p>

        {/* Warning Box */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 w-full text-left">
          <p className="text-orange-800 text-sm font-medium leading-relaxed">
            This business booking will be lost and you'll need to begin your search again.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button
            fullWidth
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 shadow-purple-200"
            onClick={onConfirm}
          >
            Book personal travel
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="secondary"
            className="border-stone-200 font-bold"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>

      </div>
    </Modal>
  );
};