
import * as React from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface FareSelectionPanelProps {
  basePrice: number;
  onSelect: (fareType: string) => void;
}

export const FareSelectionPanel: React.FC<FareSelectionPanelProps> = ({ basePrice, onSelect }) => {
  const [verifyingId, setVerifyingId] = React.useState<string | null>(null);

  const handleSelect = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifyingId(null);
      onSelect(id);
    }, 1000);
  };

  const FARE_OPTIONS = [
    {
      id: 'basic',
      title: "Basic Economy",
      price: basePrice,
      features: ['Meals provided'],
      unavailable: ['No carry-on', 'No changes', 'Last group boarding', 'No seat selection'],
    },
    {
      id: 'economy',
      title: "Economy",
      price: basePrice + 100,
      recommended: true,
      features: ['Meals provided', 'Carry-on included', 'Standard boarding'],
      unavailable: ['Seat selection fees apply'],
    },
    {
      id: 'economy-flex',
      title: "Economy Flexible",
      price: basePrice + 225,
      features: ['Refundable for free', 'Meals provided', 'Carry-on included', 'Free seat selection'],
      unavailable: [],
    },
    {
      id: 'premium',
      title: "Premium Plus",
      price: basePrice * 2.5,
      features: ['Premium meals', '2 Checked bags', 'Priority boarding', 'Extra legroom'],
      unavailable: [],
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-stone-50/50 rounded-[2rem] mt-2 animate-slide-up">
      {FARE_OPTIONS.map((fare) => (
        <div
          key={fare.id}
          className={`
            relative flex flex-col p-6 rounded-[2rem] border transition-all duration-300
            ${fare.recommended
              ? 'border-camina-brand shadow-lg bg-white ring-2 ring-camina-brand/10'
              : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-md'}
          `}
        >
          {fare.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-camina-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              Recommended
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-stone-900 mb-1">{fare.title}</h3>
            <div className={`text-2xl font-extrabold tracking-tight text-camina-primary`}>
              ${Math.round(fare.price)}
            </div>
          </div>

          <div className="flex-1 space-y-3 mb-6">
            {fare.features.map((feat: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs font-semibold">
                <div className="mt-0.5 text-camina-brand"><Check size={12} strokeWidth={3} /></div>
                <span className="text-stone-900 leading-tight">{feat}</span>
              </div>
            ))}
            {fare.unavailable.map((feat: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs font-medium opacity-50">
                <div className="mt-0.5 text-stone-400"><X size={12} strokeWidth={3} /></div>
                <span className="text-stone-500 leading-tight">{feat}</span>
              </div>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(fare.id);
            }}
            disabled={verifyingId !== null}
            className={`
              w-full py-3 rounded-xl font-bold text-sm transition-all tracking-wide flex items-center justify-center gap-2
              ${fare.recommended
                ? 'bg-gradient-to-r from-camina-brand to-camina-brand-dark text-white hover:brightness-110 shadow-md'
                : 'bg-stone-100 text-stone-900 hover:bg-stone-200'}
            `}
          >
            {verifyingId === fare.id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Select'
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
