import React from 'react';
import { Plane, Lightbulb } from 'lucide-react';
import { Modal } from '../../../components/Modal';

interface ProcessingHoldModalProps {
  isOpen: boolean;
  origin: string;
  destination: string;
}

export const ProcessingHoldModal: React.FC<ProcessingHoldModalProps> = ({ 
  isOpen,
  origin,
  destination
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="md" hideHeader>
      <div className="flex flex-col items-center justify-center p-12 text-center">
        
        <div className="mb-6 relative">
           <Plane size={48} className="text-stone-900" />
        </div>

        <h3 className="text-lg font-medium text-stone-900 mb-1">
          Processing flight hold
        </h3>
        
        <div className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-2">
          {origin} <span className="text-stone-400">→</span> {destination}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs h-1.5 bg-stone-100 rounded-full overflow-hidden mb-12">
           <div className="h-full bg-purple-600 rounded-full animate-[progress_2s_ease-in-out_infinite] w-1/2 origin-left"></div>
        </div>

        <div className="flex gap-4 text-left p-4 bg-stone-50 rounded-xl border border-stone-100 max-w-sm">
           <Lightbulb size={24} className="text-stone-400 flex-shrink-0" />
           <p className="text-xs text-stone-500 leading-relaxed">
             If you need assistance while you're on the road, you can contact our support team 24/7
           </p>
        </div>

      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Modal>
  );
};