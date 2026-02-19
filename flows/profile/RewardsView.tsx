import React, { useState } from 'react';
import { Gift, ArrowRight, ChevronRight, Check, X } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';

interface Promotion {
  id: string;
  type: 'cash' | 'giveaway';
  title: string;
  highlight: string;
  cta: string;
  image: string;
  bgColor: string;
  accentColor: string;
  modalTitle: string;
  modalDesc: string;
  expiry: string;
}

const PROMOTIONS: Promotion[] = [
  {
    id: 'spring-savings',
    type: 'cash',
    title: 'Spring savings',
    highlight: 'Get $20 in rewards',
    cta: 'Claim now',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800', // Credit card/Abstract
    bgColor: 'bg-orange-50',
    accentColor: 'text-orange-600',
    modalTitle: 'Getaway for less with Camina Rewards',
    modalDesc: 'Claim this offer to earn $20 in rewards and use them before May 31, 2025 on your next personal hotel booking.',
    expiry: 'Expires in 2 days'
  },
  {
    id: 'united-club',
    type: 'giveaway',
    title: 'Win a United Club membership',
    highlight: 'Enter giveaway',
    cta: 'Enter giveaway',
    image: 'https://images.unsplash.com/photo-1565514020176-db7044dfc4ae?auto=format&fit=crop&q=80&w=800', // Luggage
    bgColor: 'bg-sky-50',
    accentColor: 'text-sky-600',
    modalTitle: 'Win a United Club membership',
    modalDesc: 'Book any personal flight by Jul 4, 2025 for a chance to win a United Club membership and use it on a future United flight.',
    expiry: 'Expires in 1 month'
  }
];

export const RewardsView: React.FC = () => {
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [claimedPromos, setClaimedPromos] = useState<Set<string>>(new Set());
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    if (!selectedPromo) return;
    setIsClaiming(true);
    setTimeout(() => {
      setClaimedPromos(prev => new Set(prev).add(selectedPromo.id));
      setIsClaiming(false);
    }, 1500);
  };

  return (
    <div className="space-y-12">
      
      {/* Active Promotions Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-stone-900">Active promotions</h2>
           <button className="text-stone-400 hover:text-stone-900 transition-colors">
             <X size={20} className="opacity-0" /> {/* Spacer */}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROMOTIONS.map((promo) => (
            <div 
              key={promo.id}
              onClick={() => setSelectedPromo(promo)}
              className="bg-white rounded-[2rem] p-2 pr-0 border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex overflow-hidden h-48"
            >
              {/* Text Content */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="space-y-1 mb-6">
                  <h3 className="font-bold text-stone-900 text-lg leading-tight">{promo.title}</h3>
                  <p className={`font-bold ${promo.accentColor} text-lg`}>{promo.highlight}</p>
                </div>
                
                {claimedPromos.has(promo.id) ? (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <div className="bg-green-100 p-1 rounded-full"><Check size={12} /></div>
                    Claimed
                  </div>
                ) : (
                  <div className={`flex items-center gap-1 font-bold text-sm ${promo.accentColor} group-hover:translate-x-2 transition-transform`}>
                    {promo.cta} <ChevronRight size={16} />
                  </div>
                )}
              </div>

              {/* Image Section */}
              <div className="w-2/5 h-full relative">
                 <div className={`absolute inset-0 ${promo.bgColor}`}></div>
                 {/* Decorative Card/Object */}
                 <div className="absolute inset-2 rounded-2xl overflow-hidden shadow-inner">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent"></div>
                 </div>
                 {/* Floating Icon Badge */}
                 <div className="absolute top-4 right-4 bg-white p-2 rounded-xl shadow-lg">
                    <Gift size={16} className={promo.accentColor} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative w-full rounded-[2.5rem] overflow-hidden min-h-[400px] flex items-end shadow-2xl">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-orange-400"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[80px] opacity-40 translate-y-1/2 -translate-x-1/4"></div>

        {/* Content Curve */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'ellipse(70% 100% at 30% 0%)' }}></div>

        <div className="relative z-10 p-12 md:p-16 max-w-2xl text-white space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Camina<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white">Rewards</span></h2>
          </div>
          <div className="space-y-4">
             <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
               Rewards you'll actually want to use,
             </h3>
             <p className="text-lg text-white/80 leading-relaxed max-w-lg">
               Earn rewards when you make eligible bookings on Camina and redeem them for personal travel.
             </p>
          </div>
        </div>
      </section>

      {/* Promotion Detail Modal */}
      {selectedPromo && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedPromo(null)} 
          size="lg"
          hideHeader
        >
          <div className="flex flex-col md:flex-row h-full min-h-[500px]">
            {/* Left Content */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
               {claimedPromos.has(selectedPromo.id) && (
                 <div className="absolute top-8 left-12 animate-scale-in">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Check size={12} /> Claimed
                    </span>
                 </div>
               )}

               <div className="space-y-6">
                 <div>
                    <p className="text-sm font-bold text-stone-500 mb-2">Limited-time offer</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                      {selectedPromo.modalTitle}
                    </h2>
                 </div>
                 
                 <p className="text-stone-600 leading-relaxed text-lg">
                   {selectedPromo.modalDesc}
                 </p>

                 <div className="pt-4">
                    {claimedPromos.has(selectedPromo.id) ? (
                      <Button 
                        fullWidth 
                        size="lg" 
                        className="bg-purple-700 hover:bg-purple-800 shadow-purple-200"
                        onClick={() => setSelectedPromo(null)}
                      >
                         {selectedPromo.id === 'spring-savings' ? 'Book a personal hotel' : 'View entry status'}
                      </Button>
                    ) : (
                      <Button 
                        fullWidth 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 shadow-lg text-white border-0"
                        onClick={handleClaim}
                        isLoading={isClaiming}
                      >
                        {selectedPromo.cta}
                      </Button>
                    )}
                 </div>

                 <p className="text-xs text-stone-400 mt-4">
                   Rewards are subject to Camina Terms and Conditions
                 </p>
               </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full md:w-[45%] bg-stone-100 min-h-[300px] md:min-h-full overflow-hidden">
               {/* Curved Mask */}
               <div className="absolute top-0 bottom-0 -left-1 w-24 bg-white z-10 hidden md:block" style={{ clipPath: 'ellipse(60% 120% at 0% 50%)' }}></div>
               <div className="absolute top-0 left-0 right-0 h-24 bg-white z-10 md:hidden" style={{ clipPath: 'ellipse(100% 70% at 50% 0%)' }}></div>
               
               <img 
                 src={selectedPromo.image} 
                 alt="Reward visual" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

               {/* Overlay Card for styling matching screenshot */}
               {selectedPromo.id === 'spring-savings' && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-2xl flex flex-col p-6 text-white justify-between animate-slide-up hover:scale-105 transition-transform duration-500">
                    <span className="font-bold tracking-tight">Camina<br/>Rewards</span>
                    <span className="text-4xl font-bold self-end">$20</span>
                 </div>
               )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};