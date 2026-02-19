import React from 'react';
import { X, Check, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';

interface BasicEconomyWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBasic: () => void;
  onUpgrade: () => void;
  priceDifference: number;
}

export const BasicEconomyWarningModal: React.FC<BasicEconomyWarningModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirmBasic, 
  onUpgrade,
  priceDifference
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" hideHeader>
      <div className="p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-600">
            <AlertTriangle size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 tracking-tight">
            Does Basic Economy fit your travel needs?
          </h2>
          <p className="text-stone-500 text-lg">
            Review the restrictions before confirming your selection.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm mb-10">
           {/* Mobile Scroll Wrapper */}
           <div className="overflow-x-auto custom-scrollbar">
             <div className="min-w-[600px]">
               {/* Header Row */}
               <div className="grid grid-cols-3 bg-stone-50 border-b border-stone-200">
                  <div className="p-5"></div>
                  <div className="p-5 text-center font-bold text-stone-500 text-lg">Basic Economy</div>
                  <div className="p-5 text-center font-bold text-stone-900 text-lg bg-stone-100">Economy</div>
               </div>

               {/* Feature Rows */}
               <CompareRow 
                 label="Save company money" 
                 basic={<Check size={20} className="text-stone-900" />}
                 economy={<Check size={20} className="text-stone-900" />}
               />
               <CompareRow 
                 label="Choose, change or upgrade seats" 
                 basic={<X size={20} className="text-stone-300" />}
                 economy={<Check size={20} className="text-stone-900" />}
               />
               <CompareRow 
                 label="Full-sized carry-on bag" 
                 basic={<X size={20} className="text-stone-300" />}
                 economy={<Check size={20} className="text-stone-900" />}
               />
               <CompareRow 
                 label="Change flight (fee applies)" 
                 basic={<X size={20} className="text-stone-300" />}
                 economy={<Check size={20} className="text-stone-900" />}
               />
               <CompareRow 
                 label="Earn qualifying credit" 
                 basic={<X size={20} className="text-stone-300" />}
                 economy={<Check size={20} className="text-stone-900" />}
               />
               
               {/* Price Row */}
               <div className="grid grid-cols-3 border-t border-stone-200 bg-stone-50/50">
                 <div className="p-6 flex items-center font-bold text-stone-500">Price</div>
                 <div className="p-6 flex items-center justify-center font-bold text-stone-500 text-xl">
                   Included
                 </div>
                 <div className="p-6 flex items-center justify-center font-bold text-stone-900 text-xl bg-stone-100/50">
                   +${priceDifference}
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-6 items-center justify-between">
           <button 
             onClick={onClose}
             className="text-stone-500 font-bold hover:text-stone-900 flex items-center gap-3 px-4 py-3 transition-colors"
           >
             <ArrowLeft size={20} />
             Back to alternatives
           </button>

           <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             <Button 
               variant="outline" 
               onClick={onConfirmBasic}
               fullWidth
               className="border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300 md:w-auto h-14"
             >
               Basic Economy works for me
             </Button>
             <Button 
               onClick={onUpgrade}
               fullWidth
               className="bg-stone-900 hover:bg-black text-white shadow-xl md:min-w-[240px] h-14"
             >
               Upgrade to Economy
             </Button>
           </div>
        </div>
      </div>
    </Modal>
  );
};

const CompareRow: React.FC<{ label: string; basic: React.ReactNode; economy: React.ReactNode }> = ({ label, basic, economy }) => (
  <div className="grid grid-cols-3 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
    <div className="p-5 text-sm font-bold text-stone-600 flex items-center">
      {label}
    </div>
    <div className="p-5 flex items-center justify-center border-l border-stone-100">
      {basic}
    </div>
    <div className="p-5 flex items-center justify-center border-l border-stone-100 bg-stone-100/30">
      {economy}
    </div>
  </div>
);
