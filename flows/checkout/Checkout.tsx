
import * as React from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Loader2, Send, FileText, Plane } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { FlightSegment } from '../booking/components/FlightCard';
import { createBooking } from '../../services/sabre';

interface CheckoutProps {
  onBack: () => void;
  onFinish: () => void;
  flight: FlightSegment | null;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack, onFinish, flight }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);
  const [pnr, setPnr] = React.useState('');

  // Form State
  const [travelerName, setTravelerName] = React.useState('');
  const [travelerEmail, setTravelerEmail] = React.useState('');
  const [notes, _setNotes] = React.useState('');

  if (!flight) return null;

  const handleBooking = async () => {
    setIsProcessing(true);

    // Construct Booking Request (Simplified for Demo)
    const bookingRequest = {
      flightId: flight.id,
      traveler: {
        name: travelerName,
        email: travelerEmail,
        notes: notes
      },
      ancillaries: flight.selectedAncillaries || [],
      seats: flight.selectedSeats || [],
      totalPrice: (flight.price + 124.50 + (flight.selectedAncillaries?.reduce((sum, i) => sum + i.price, 0) || 0))
    };

    try {
      const result = await createBooking(bookingRequest);
      if (result.success) {
        setPnr(result.pnr);
        setBookingConfirmed(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const ancillariesTotal = flight.selectedAncillaries?.reduce((sum, item) => sum + item.price, 0) || 0;
  const totalPrice = flight.price + 124.50 + ancillariesTotal;

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center text-white">
        <div className="max-w-lg w-full bg-stone-900 border border-stone-800 p-16 relative overflow-hidden animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-2 bg-hyrox-yellow"></div>
          <div className="w-24 h-24 bg-hyrox-yellow rounded-full flex items-center justify-center mx-auto mb-8 text-black shadow-[0_0_30px_rgba(255,255,0,0.3)]">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-5xl font-black italic uppercase text-white mb-2 tracking-tighter">Booking Confirmed</h2>
          <p className="text-stone-500 font-mono mb-6">PNR: {pnr}</p>
          <p className="text-stone-400 text-lg mb-10 leading-relaxed font-medium">
            Your flight to {flight.destination} is confirmed. A confirmation email has been sent to <span className="text-white border-b border-hyrox-yellow pb-0.5">{travelerEmail}</span>.
          </p>
          <Button onClick={onFinish} fullWidth className="bg-white text-black hover:bg-stone-200">
            RETURN TO DASHBOARD
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 pt-28 text-white font-sans">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-stone-800 z-40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors font-black text-sm uppercase tracking-wider group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Options
          </button>

          <div className="flex items-center gap-3 bg-stone-900 px-5 py-2 border border-stone-800">
            <FileText size={16} className="text-hyrox-yellow" />
            <span className="text-sm font-black text-white uppercase tracking-widest italic">
              Review & Pay
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-12 animate-slide-up">

          <div className="space-y-4">
            <h1 className="text-6xl font-black italic uppercase text-white tracking-tighter leading-none">
              Confirm Your<br /><span className="text-stone-600">Booking</span>
            </h1>
            <p className="text-stone-400 font-medium text-lg max-w-lg border-l-2 border-hyrox-yellow pl-4 ml-1">
              Review your flight and add-ons selection below.
            </p>
          </div>

          {/* 1. Trip Summary */}
          <section className="bg-stone-900 border border-stone-800 p-8 relative overflow-hidden group hover:border-stone-700 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plane size={120} />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-black italic uppercase text-hyrox-yellow tracking-wider">Selected Flight</h2>
            </div>

            <div className="flex flex-col gap-8 relative z-10">
              <div className="flex items-center justify-between border-b border-stone-800 pb-8">
                <div>
                  <p className="text-5xl font-black text-white tracking-tighter">{flight.departureTime}</p>
                  <p className="text-sm font-black text-stone-500 uppercase tracking-[0.2em] mt-2">{flight.origin}</p>
                </div>
                <div className="flex-1 px-12 text-center">
                  <p className="text-xs font-bold text-stone-500 uppercase mb-2 tracking-wider">{flight.duration}</p>
                  <div className="w-full h-0.5 bg-stone-800 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-stone-600 rounded-full"></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-white tracking-tighter">{flight.arrivalTime}</p>
                  <p className="text-sm font-black text-stone-500 uppercase tracking-[0.2em] mt-2">{flight.destination}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white p-2 flex items-center justify-center">
                  <img src={`https://pics.avs.io/200/200/${flight.airlineCode}.png`} alt={flight.airline} className="w-full object-contain" />
                </div>
                <div>
                  <p className="font-black text-white uppercase text-xl italic tracking-wide">{flight.airline}</p>
                  <p className="text-sm text-stone-500 font-mono tracking-widest">{flight.flightNumber}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Extras Summary */}
          {(flight.selectedSeats?.length || flight.selectedAncillaries?.length) && (
            <section className="bg-stone-900 border border-stone-800 p-8">
              <h2 className="text-xl font-black italic uppercase text-white mb-6 tracking-wider">Selected Extras</h2>
              <div className="space-y-4">
                {flight.selectedSeats?.map((seat, i) => (
                  <div key={`seat-${i}`} className="flex justify-between items-center text-stone-300 border-b border-stone-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold">Seat Selection: {seat}</span>
                    <span className="text-stone-500">Included</span>
                  </div>
                ))}
                {flight.selectedAncillaries?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-stone-300 border-b border-stone-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold">{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Details */}
          <section className="space-y-8">
            <h2 className="text-2xl font-black italic uppercase text-white tracking-wide border-b border-stone-800 pb-4">Traveler Details</h2>
            <div className="space-y-8">
              <Input
                label="FULL NAME"
                value={travelerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTravelerName(e.target.value)}
                className="bg-stone-900 border-stone-800 focus:border-hyrox-yellow"
                placeholder="ENTER YOUR FULL NAME"
              />
              <Input
                label="EMAIL ADDRESS"
                value={travelerEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTravelerEmail(e.target.value)}
                className="bg-stone-900 border-stone-800 focus:border-hyrox-yellow"
                placeholder="NAME@EXAMPLE.COM"
              />
            </div>
          </section>

        </div>

        {/* Right Column: Breakdown */}
        <div className="lg:col-span-5 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>

          <div className="bg-stone-900 border border-stone-800 p-10 sticky top-32">
            <h3 className="text-xl font-black italic uppercase text-white mb-8 tracking-wider">Price Breakdown</h3>

            <div className="space-y-6 mb-10 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 uppercase tracking-widest font-bold">Flight Fare</span>
                <span className="font-bold text-white text-lg">${flight.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 uppercase tracking-widest font-bold">Taxes & Fees</span>
                <span className="font-bold text-white text-lg">$124.50</span>
              </div>
              {ancillariesTotal > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 uppercase tracking-widest font-bold">Add-ons</span>
                  <span className="font-bold text-white text-lg">${ancillariesTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="h-px bg-stone-800 my-4 w-full"></div>

              <div className="flex justify-between items-center">
                <span className="font-black text-white uppercase italic text-xl">Total</span>
                <span className="font-black text-hyrox-yellow text-4xl tracking-tighter">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleBooking}
              disabled={isProcessing || !travelerName || !travelerEmail}
              className="h-20 text-xl bg-hyrox-yellow hover:bg-white text-black font-black uppercase italic tracking-wider shadow-[0_0_20px_rgba(255,255,0,0.2)]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={24} />
                  Processing...
                </>
              ) : (
                <>
                  CONFIRM BOOKING <Send className="ml-3" size={24} strokeWidth={3} />
                </>
              )}
            </Button>

            <div className="mt-8 flex gap-4 p-4 bg-black border border-stone-800">
              <ShieldCheck className="text-hyrox-yellow shrink-0" size={24} />
              <p className="text-xs text-stone-500 font-bold uppercase leading-relaxed tracking-wide">
                Secure booking powered by Sabre. Your PNR will be generated instantly.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
