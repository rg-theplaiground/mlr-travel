import React from 'react';
import { X, CreditCard } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';

interface PaymentErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePayment: () => void;
}

export const PaymentErrorModal: React.FC<PaymentErrorModalProps> = ({ 
  isOpen, 
  onClose,
  onChangePayment
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" hideHeader>
      <div className="p-8 md:p-10 flex flex-col items-center text-center">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Glitched Card Visual */}
        <div className="w-full max-w-[200px] aspect-[1.58] bg-stone-100 rounded-xl mb-8 relative overflow-hidden flex items-center justify-center border border-stone-200">
           {/* Mocking the pixelated/glitch effect from screenshot */}
           <div className="absolute inset-0 opacity-50">
              <div className="absolute top-4 left-4 w-8 h-8 bg-stone-300 rounded-sm"></div>
              <div className="absolute bottom-8 right-8 w-12 h-2 bg-stone-300 rounded-sm"></div>
              {/* Random blocks */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-indigo-900/20 backdrop-blur-sm"></div>
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-stone-300"></div>
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-stone-300"></div>
           </div>
           <CreditCard size={48} className="text-stone-400 relative z-10" />
           
           {/* Error Overlay */}
           <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900 mb-4">
          Payment not completed
        </h3>
        
        <p className="text-stone-500 mb-8 leading-relaxed">
          Your payment could not be processed with the card selected. To complete your booking, please choose a different payment method.
        </p>

        <Button 
          fullWidth 
          className="bg-purple-600 hover:bg-purple-700 shadow-purple-200"
          onClick={() => {
            onClose();
            onChangePayment();
          }}
        >
          Change payment
        </Button>

      </div>
    </Modal>
  );
};