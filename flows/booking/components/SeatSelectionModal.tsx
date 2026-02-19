
import * as React from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { getSeatMap, SeatMapResponse } from '@/services/sabre';
import { FlightSegment } from './FlightCard';

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSeats: string[]) => void;
  flight: FlightSegment;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  flight
}) => {
  const [loading, setLoading] = React.useState(true);
  const [seatMap, setSeatMap] = React.useState<SeatMapResponse['response'] | null>(null);
  const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null);
  const [selectedSeatPrice, setSelectedSeatPrice] = React.useState<string>('Free');

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getSeatMap(flight).then((data: SeatMapResponse) => {
        setSeatMap(data.response);
        setLoading(false);
      });
    }
  }, [isOpen, flight]);

  const handleSeatClick = (seatId: string, isOccupied: boolean, priceId?: string) => {
    if (isOccupied) return;

    if (selectedSeat === seatId) {
      setSelectedSeat(null);
      setSelectedSeatPrice('Free');
    } else {
      setSelectedSeat(seatId);

      // Find Price
      if (priceId && seatMap?.priceDefinitions) {
        const priceDef = seatMap.priceDefinitions.find((p: { id: string; totalPrice: { amount: number } }) => p.id === priceId);
        if (priceDef) {
          setSelectedSeatPrice(`$${priceDef.totalPrice.amount}`);
        } else {
          setSelectedSeatPrice('Free');
        }
      } else {
        setSelectedSeatPrice('Free');
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      onConfirm([selectedSeat]);
    } else {
      onConfirm([]); // Skip seat selection
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" hideHeader variant="dark">
      <div className="flex flex-col h-[85vh] bg-stone-950 text-white">

        {/* Header */}
        <div className="bg-stone-900/50 p-6 border-b border-stone-800 flex justify-between items-center shadow-lg z-20 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-wider text-white">Select Seats</h3>
            <p className="text-stone-400 text-sm font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              {flight.origin} <ArrowRight size={14} /> {flight.destination}
              <span className="text-stone-600">•</span>
              {flight.flightNumber}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Left Legend / Info (Desktop) */}
          <div className="w-72 bg-stone-900 border-r border-stone-800 p-8 hidden md:flex flex-col overflow-y-auto z-10">
            <h4 className="font-bold text-stone-500 uppercase tracking-widest text-xs mb-6">Seat Key</h4>
            <div className="space-y-5 text-sm">
              <LegendItem color="border-2 border-stone-600 bg-stone-800" label="Available" />
              <LegendItem color="bg-stone-800 text-stone-600" label="Occupied" icon={<X size={12} />} />
              <LegendItem color="bg-hyrox-yellow text-black border-2 border-hyrox-yellow" label="Selected" icon={<Check size={12} strokeWidth={3} />} />
              <LegendItem color="border-2 border-indigo-500 bg-indigo-500/10 text-indigo-400" label="Premium ($49+)" />
              <LegendItem color="border-2 border-purple-500 bg-purple-500/10 text-purple-400" label="Business ($150+)" />
            </div>

            <div className="mt-auto pt-8 border-t border-stone-800">
              <div className="bg-black border border-stone-800 p-5 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Selected Seat</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black italic text-white tracking-tighter">
                    {selectedSeat || '--'}
                  </span>
                  <span className="text-xl font-bold text-hyrox-yellow">{selectedSeatPrice}</span>
                </div>
                {!selectedSeat && (
                  <p className="text-xs text-stone-600 mt-2">Select a seat from the map</p>
                )}
              </div>
            </div>
          </div>

          {/* Seat Map Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black relative flex justify-center">

            {/* Background Grid/Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1c1917_0%,_#000000_100%)]"></div>

            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                <div className="animate-spin w-10 h-10 border-2 border-stone-800 border-t-hyrox-yellow rounded-full"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Loading Configuration...</span>
              </div>
            ) : (
              <div className="py-20 px-4 min-h-full z-10 relative">
                {/* Fuselage Container */}
                <div className="bg-stone-900 rounded-[6rem] px-8 py-24 shadow-2xl border border-stone-800 relative max-w-[340px] md:max-w-[400px] w-full mx-auto">

                  {/* Cockpit Visual */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-40 h-32 bg-stone-800 rounded-t-[5rem] border-t border-x border-stone-700/50 clip-path-cockpit"></div>

                  {/* Wings Visuals (Decorative) */}
                  <div className="absolute top-1/3 -left-32 w-32 h-64 bg-stone-900/50 border-l border-t border-stone-800 transform -skew-y-12 rounded-l-3xl -z-10 hidden md:block"></div>
                  <div className="absolute top-1/3 -right-32 w-32 h-64 bg-stone-900/50 border-r border-t border-stone-800 transform skew-y-12 rounded-r-3xl -z-10 hidden md:block"></div>

                  <div className="space-y-16 relative z-10">
                    {seatMap?.seatMaps[0].cabinCompartments.map((cabin: { cabinName: string; seatRows: any[] }, cabinIdx: number) => (
                      <div key={cabinIdx} className="space-y-3">
                        <div className="flex items-center justify-center mb-6">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 bg-black/50 px-4 py-1.5 rounded-full border border-stone-800">
                            {cabin.cabinName}
                          </span>
                        </div>

                        {cabin.seatRows.map((row: { row: number; seats: any[] }) => (
                          <div key={row.row} className="flex justify-center gap-5 md:gap-8">
                            {/* Left Side */}
                            <div className="flex gap-2 md:gap-3">
                              {row.seats.filter((s: { column: string }) => ['A', 'B', 'C'].includes(s.column)).map((seat: { column: string; occupationStatusCode: string; offerItemRefIds?: string[] }) => (
                                <Seat
                                  key={`${row.row}${seat.column}`}
                                  id={`${row.row}${seat.column}`}
                                  status={seat.occupationStatusCode === 'O' ? 'occupied' : selectedSeat === `${row.row}${seat.column}` ? 'selected' : 'available'}
                                  type={seat.offerItemRefIds?.includes('premium-seat-offer') ? 'business' : seat.offerItemRefIds?.includes('extra-legroom-offer') ? 'premium' : 'standard'}
                                  onClick={() => handleSeatClick(`${row.row}${seat.column}`, seat.occupationStatusCode === 'O', seat.offerItemRefIds?.[0])}
                                />
                              ))}
                            </div>

                            {/* Aisle - Row Number */}
                            <div className="w-6 flex items-center justify-center text-[10px] font-bold text-stone-600 font-mono">
                              {row.row}
                            </div>

                            {/* Right Side */}
                            <div className="flex gap-2 md:gap-3">
                              {row.seats.filter((s: { column: string }) => ['D', 'E', 'F'].includes(s.column)).map((seat: { column: string; occupationStatusCode: string; offerItemRefIds?: string[] }) => (
                                <Seat
                                  key={`${row.row}${seat.column}`}
                                  id={`${row.row}${seat.column}`}
                                  status={seat.occupationStatusCode === 'O' ? 'occupied' : selectedSeat === `${row.row}${seat.column}` ? 'selected' : 'available'}
                                  type={seat.offerItemRefIds?.includes('premium-seat-offer') ? 'business' : seat.offerItemRefIds?.includes('extra-legroom-offer') ? 'premium' : 'standard'}
                                  onClick={() => handleSeatClick(`${row.row}${seat.column}`, seat.occupationStatusCode === 'O', seat.offerItemRefIds?.[0])}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-900 p-6 border-t border-stone-800 flex justify-between items-center z-20">
          <div className="md:hidden">
            {selectedSeat ? (
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase">Seat {selectedSeat}</p>
                <p className="font-bold text-hyrox-yellow">{selectedSeatPrice}</p>
              </div>
            ) : (
              <p className="text-sm text-stone-500 font-medium">Select a seat</p>
            )}
          </div>
          <div className="flex gap-4 ml-auto w-full md:w-auto">
            <Button variant="ghost" onClick={() => onConfirm([])} className="hidden md:flex text-stone-400 hover:text-white">Skip for now</Button>
            <Button
              onClick={handleConfirm}
              className="bg-hyrox-yellow text-black hover:bg-white flex-1 md:flex-none px-8 shadow-[0_0_15px_rgba(255,255,0,0.2)]"
            >
              {selectedSeat ? 'Confirm Seat' : 'Continue without Seat'}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};

const LegendItem: React.FC<{ color: string; label: string; icon?: React.ReactNode }> = ({ color, label, icon }) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <span className="text-stone-400 font-medium">{label}</span>
  </div>
);

const Seat: React.FC<{
  id: string;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'premium' | 'business';
  onClick: () => void;
}> = ({ id, status, type, onClick }) => {

  const getStyles = () => {
    if (status === 'occupied') return 'bg-stone-800 border border-stone-700 text-stone-600 cursor-not-allowed';
    if (status === 'selected') return 'bg-hyrox-yellow border-2 border-hyrox-yellow text-black shadow-[0_0_15px_rgba(255,255,0,0.4)] scale-110 z-10';

    // Available styles by type
    if (type === 'business') return 'bg-purple-500/10 border border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/20 text-purple-300';
    if (type === 'premium') return 'bg-indigo-500/10 border border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/20 text-indigo-300';

    return 'bg-stone-800 border border-stone-600 hover:border-stone-400 hover:bg-stone-700 text-stone-400';
  };

  return (
    <button
      onClick={onClick}
      disabled={status === 'occupied'}
      className={`
        w-8 h-10 md:w-10 md:h-12 rounded-t-lg rounded-b-md transition-all duration-200 relative flex items-center justify-center group
        ${getStyles()}
      `}
    >
      {status === 'occupied' && <X size={12} />}
      {/* Tooltip on Hover */}
      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 ${status === 'occupied' ? 'hidden' : ''}`}>
        {id}
      </div>
    </button>
  );
};
