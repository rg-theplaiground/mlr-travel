
import React, { useEffect, useState } from 'react';
import { X, Star, MapPin, CheckCircle, Clock, Phone, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Hotel } from './HotelCard';
import { getHotelContent, getHotelDetails, HotelContentDTO, hotelPriceCheck } from '../../../../services/sabre';

interface HotelDetailsModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  onBook: () => void;
  searchCriteria?: {
    checkIn: Date;
    checkOut: Date;
    adults: number;
  };
}

export const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({ hotel, onClose, onBook, searchCriteria }) => {
  const [content, setContent] = useState<HotelContentDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [verifyingPrice, setVerifyingPrice] = useState(false);
  const [priceChangeData, setPriceChangeData] = useState<any | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!hotel) return;
      setLoading(true);
      setPriceChangeData(null);
      
      let data: HotelContentDTO | null = null;

      if (searchCriteria && searchCriteria.checkIn && searchCriteria.checkOut) {
         try {
           const checkInStr = searchCriteria.checkIn.toISOString().split('T')[0];
           const checkOutStr = searchCriteria.checkOut.toISOString().split('T')[0];
           data = await getHotelDetails(hotel.id, checkInStr, checkOutStr, searchCriteria.adults);
         } catch (e) {
           data = await getHotelContent(hotel.id);
         }
      } else {
         data = await getHotelContent(hotel.id);
      }

      setContent(data);
      setLoading(false);
    };

    if (hotel) {
      fetchContent();
    } else {
      setContent(null);
    }
  }, [hotel, searchCriteria]);

  const handleBookRoom = async () => {
    if (!content?.rateKey) {
        onBook(); 
        return;
    }

    setVerifyingPrice(true);
    setPriceChangeData(null);

    try {
        const priceCheckData = await hotelPriceCheck(content.rateKey);
        if (priceCheckData?.PriceChange) {
            setPriceChangeData(priceCheckData);
        } else {
            onBook();
        }
    } catch (e) {
        onBook();
    } finally {
        setVerifyingPrice(false);
    }
  };

  if (!hotel) return null;

  const displayImages = content?.images && content.images.length > 0 
    ? content.images 
    : (hotel.image ? [hotel.image] : []);

  const displayPrice = priceChangeData 
      ? parseFloat(priceChangeData.HotelRateInfo?.RateInfos?.ConvertedRateInfo?.[0]?.AverageNightlyRate || '0')
      : (content?.rate ? content.rate.amount : hotel.price);

  return (
    <Modal isOpen={!!hotel} onClose={onClose} size="xl" hideHeader>
      <div className="relative flex flex-col h-[90vh] bg-white text-stone-900 rounded-[2rem] overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white text-stone-500 hover:text-stone-900 transition-colors shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div className="h-72 md:h-96 relative bg-stone-200 shrink-0">
           {displayImages.length > 0 ? (
             <img 
               src={displayImages[activeImageIndex]} 
               alt={hotel.name}
               className="w-full h-full object-cover"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-stone-400">
               No Image Available
             </div>
           )}
           
           {/* Gallery */}
           {displayImages.length > 1 && (
             <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide z-10">
               {displayImages.map((img, idx) => (
                 <button
                   key={idx}
                   onClick={() => setActiveImageIndex(idx)}
                   className={`
                     w-16 h-12 md:w-20 md:h-14 overflow-hidden border-2 transition-all shrink-0 rounded-lg
                     ${activeImageIndex === idx ? 'border-mlr-red shadow-lg' : 'border-white opacity-80 hover:opacity-100'}
                   `}
                 >
                   <img src={img} className="w-full h-full object-cover" alt={`view ${idx}`} />
                 </button>
               ))}
             </div>
           )}

           <div className="absolute top-6 left-6">
              {hotel.rating > 0 && (
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <Star size={14} className="fill-stone-900 text-stone-900" />
                  <span className="text-sm font-bold text-stone-900">{hotel.rating}</span>
                </div>
              )}
           </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-white">
           <div className="flex flex-col md:flex-row gap-12">
              
              <div className="flex-1 space-y-8">
                 <div>
                   <h2 className="text-4xl font-black text-stone-900 mb-2 leading-none tracking-tight uppercase italic">{hotel.name}</h2>
                   <div className="flex items-center gap-2 text-stone-500 font-medium text-sm">
                     <MapPin size={16} />
                     <span>{hotel.address}</span>
                   </div>
                 </div>

                 {loading ? (
                   <div className="space-y-4 animate-pulse">
                     <div className="h-4 bg-stone-100 w-full rounded"></div>
                     <div className="h-4 bg-stone-100 w-5/6 rounded"></div>
                     <div className="h-4 bg-stone-100 w-4/6 rounded"></div>
                   </div>
                 ) : (
                   <>
                     <div className="text-stone-600 text-sm leading-relaxed font-medium">
                       {content?.description}
                     </div>

                     <div>
                       <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2">Amenities</h3>
                       <div className="grid grid-cols-2 gap-4">
                          {(content?.amenities || hotel.amenities || []).slice(0, 8).map((amenity, i) => (
                            <div key={i} className="flex items-start gap-3 text-xs font-bold uppercase text-stone-500">
                               <CheckCircle size={14} className="text-stone-300 mt-0.5 shrink-0" />
                               <span>{amenity}</span>
                            </div>
                          ))}
                       </div>
                     </div>
                   </>
                 )}
              </div>

              <div className="w-full md:w-80 space-y-6">
                 {/* Price Card */}
                 <div className="p-6 bg-stone-50 border border-stone-100 rounded-3xl">
                    
                    {priceChangeData ? (
                       <div className="mb-4 bg-red-50 border border-red-100 p-3 rounded-xl">
                          <div className="flex items-start gap-2">
                             <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                             <div className="text-xs text-red-600 font-bold uppercase">
                                <p>Price changed</p>
                             </div>
                          </div>
                       </div>
                    ) : null}

                    <div className="flex items-end gap-2 mb-6">
                       <span className={`text-4xl font-black tracking-tight ${priceChangeData ? 'text-red-600' : 'text-stone-900'}`}>${Math.floor(displayPrice || 0)}</span>
                       <span className="text-stone-400 text-xs font-bold uppercase mb-1.5">/ night</span>
                    </div>
                    
                    <Button 
                      fullWidth 
                      className={`h-14 text-base rounded-xl ${priceChangeData ? 'bg-red-600 hover:bg-red-700' : 'bg-mlr-red hover:bg-red-700 text-white'}`}
                      onClick={priceChangeData ? onBook : handleBookRoom}
                      disabled={verifyingPrice}
                    >
                      {verifyingPrice ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Checking...
                        </>
                      ) : priceChangeData ? (
                        <>
                          Confirm New Price <ArrowRight size={16} className="ml-2" />
                        </>
                      ) : (
                        'Request Booking'
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-stone-400 mt-3 font-medium">
                      Agent will confirm availability
                    </p>
                 </div>

                 {/* Info Details */}
                 {!loading && content && (
                   <div className="space-y-4">
                      <div className="p-4 border border-stone-100 flex items-center gap-3 bg-white rounded-2xl shadow-sm">
                         <div className="w-8 h-8 flex items-center justify-center text-stone-400">
                           <Clock size={18} />
                         </div>
                         <div className="text-sm">
                           <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Check-in / Out</p>
                           <p className="font-bold text-stone-900">{content.policies.checkIn} / {content.policies.checkOut}</p>
                         </div>
                      </div>

                      {content.contact.phone && (
                        <div className="p-4 border border-stone-100 flex items-center gap-3 bg-white rounded-2xl shadow-sm">
                           <div className="w-8 h-8 flex items-center justify-center text-stone-400">
                             <Phone size={18} />
                           </div>
                           <div className="text-sm">
                             <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Phone</p>
                             <p className="font-bold text-stone-900">{content.contact.phone}</p>
                           </div>
                        </div>
                      )}
                   </div>
                 )}
              </div>

           </div>
        </div>

      </div>
    </Modal>
  );
};
