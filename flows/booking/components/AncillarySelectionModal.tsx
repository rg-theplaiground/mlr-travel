
import * as React from 'react';
import { ShoppingBag, Wifi, Coffee, Armchair, Plus, Check } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { getAncillaries, AncillaryOption } from '@/services/sabre';

interface AncillarySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: AncillaryOption[]) => void;
  flightId: string;
}

export const AncillarySelectionModal: React.FC<AncillarySelectionModalProps> = ({
  isOpen, onClose, onConfirm, flightId
}) => {
  const [items, setItems] = React.useState<AncillaryOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAncillaries(flightId).then(data => {
        setItems(data);
        setLoading(false);
      });
    }
  }, [isOpen, flightId]);

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleConfirm = () => {
    const selected = items.filter((i: AncillaryOption) => selectedIds.has(i.id));
    onConfirm(selected);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BAG': return ShoppingBag;
      case 'WIFI': return Wifi;
      case 'MEAL': return Coffee;
      case 'LOUNGE': return Armchair;
      default: return Plus;
    }
  };

  const totalCost = items
    .filter((i: AncillaryOption) => selectedIds.has(i.id))
    .reduce((sum: number, item: AncillaryOption) => sum + item.price, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Enhance your trip" variant="dark">
      <div className="space-y-8 p-2">
        <div>
          <p className="text-stone-400 text-lg">Add extras to make your journey more comfortable.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-stone-900 rounded-2xl animate-pulse border border-stone-800"></div>)}
          </div>
        ) : (
          <div className="grid gap-4 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
            {items.map(item => {
              const Icon = getIcon(item.type);
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`
                     flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group
                     ${isSelected
                      ? 'border-hyrox-yellow bg-stone-900 shadow-[0_0_15px_rgba(255,255,0,0.1)]'
                      : 'border-stone-800 bg-black hover:border-stone-600 hover:bg-stone-900'}
                   `}
                >
                  <div className="flex items-center gap-5">
                    <div className={`
                         w-12 h-12 rounded-xl flex items-center justify-center transition-colors border
                         ${isSelected
                        ? 'bg-hyrox-yellow text-black border-hyrox-yellow'
                        : 'bg-stone-800 text-stone-400 border-stone-700 group-hover:text-white'}
                       `}>
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-stone-300 group-hover:text-white'}`}>{item.name}</h4>
                      <p className="text-sm text-stone-500">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-lg ${isSelected ? 'text-hyrox-yellow' : 'text-stone-300'}`}>
                      {item.price === 0 ? 'Free' : `$${item.price}`}
                    </p>
                    {isSelected && (
                      <div className="flex items-center justify-end gap-1 text-[10px] font-black text-hyrox-yellow mt-1 uppercase tracking-wider animate-scale-in">
                        <Check size={12} strokeWidth={4} /> Added
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-stone-800">
          <div>
            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Added cost</p>
            <p className="text-3xl font-black italic text-white tracking-tighter">${totalCost.toFixed(2)}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={handleConfirm} className="text-stone-400 hover:text-white">Skip</Button>
            <Button onClick={handleConfirm} className="bg-hyrox-yellow text-black hover:bg-white px-8 shadow-[0_0_20px_rgba(255,255,0,0.3)]">
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
