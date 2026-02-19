import React from 'react';
import { Clock } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';

interface RefreshPromptModalProps {
  isOpen: boolean;
  onRefresh: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export const RefreshPromptModal: React.FC<RefreshPromptModalProps> = ({ isOpen, onRefresh, onEdit, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader size="md">
      <div className="flex flex-col items-center text-center p-8 md:p-12">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-400 animate-pulse">
           <Clock size={40} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-2xl font-bold text-stone-900 mb-3 tracking-tight">
          Prices may have changed
        </h3>
        
        <p className="text-stone-500 mb-8 leading-relaxed max-w-sm">
          We're constantly searching to find you the best deals because prices and availability can change quickly.
        </p>

        <div className="w-full space-y-3">
           <Button 
             fullWidth 
             size="lg" 
             onClick={onRefresh}
             className="bg-stone-900 hover:bg-black text-white shadow-lg hover:shadow-xl transition-all"
           >
             See newest results
           </Button>
           
           <Button 
             fullWidth 
             size="lg" 
             variant="outline"
             onClick={onEdit}
             className="border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300"
           >
             Edit search
           </Button>
        </div>
      </div>
    </Modal>
  );
};