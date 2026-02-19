
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  X, ArrowRight, ArrowLeft, CheckCircle2, Ticket, Building2, 
  User, Mail, Smartphone, Users, MapPin, Calendar, Bed, 
  Flag, Trophy, ChevronDown, Search
} from 'lucide-react';
import { Match, UserData } from '../../types';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { Confetti } from '../../components/Confetti';
import { DateRangePicker } from '../../flows/booking/components/DateRangePicker';

interface MatchBookingWizardProps {
  match: Match;
  userData: UserData;
  onClose: () => void;
}

type Step = 'intro' | 'dates' | 'package' | 'details' | 'contact' | 'review' | 'success';

// --- Data Constants ---

const PACKAGES = [
  {
    id: 'bronze',
    name: 'Match Day Pass',
    tier: 'Bronze',
    description: 'Local & Budget',
    includes: ['Reserved match ticket', 'Fan festival access', 'Team scarf'],
    duration: '1 day',
    price: 150,
    color: 'bg-orange-50 border-orange-200 text-orange-900',
    badge: 'bg-orange-100 text-orange-800',
    icon: Ticket
  },
  {
    id: 'silver',
    name: 'Weekend Getaway',
    tier: 'Silver',
    description: 'Traveling Fans',
    includes: ['Premium sideline ticket', '2-night hotel stay', 'Stadium transport'],
    duration: '2-3 days',
    price: 650,
    color: 'bg-slate-50 border-slate-200 text-slate-900',
    badge: 'bg-slate-200 text-slate-800',
    icon: Building2
  },
  {
    id: 'gold',
    name: 'Rivalry Experience',
    tier: 'Gold',
    description: 'Derby Games',
    includes: ['Lower-bowl seating', '3-night 4★ hotel', 'Welcome dinner'],
    duration: '3 days',
    price: 1500,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    badge: 'bg-yellow-100 text-yellow-800',
    icon: Trophy
  }
];

const TEAMS = {
  Eastern: [
    'New England Free Jacks',
    'New York Ironworkers',
    'Old Glory DC',
    'Chicago Hounds',
    'Miami Sharks'
  ],
  Western: [
    'Seattle Seawolves',
    'San Diego Legion',
    'Utah Warriors',
    'Houston SaberCats',
    'Dallas Jackals'
  ],
  Expansion: [
    'Anthem RC'
  ]
};

// Date Helpers
const dateFromStr = (s: string): Date | null => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const strFromDate = (d: Date | null): string => {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const MatchBookingWizard: React.FC<MatchBookingWizardProps> = ({ match, userData, onClose }) => {
  const [step, setStep] = useState<Step>('intro');
  const [direction, setDirection] = useState(0);

  // Expanded Form Data for Agent Accuracy
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    selectedPackageId: 'silver', // Default to silver
    rooms: 1,
    guests: 2,
    bedPreference: 'any' as 'king' | 'double' | 'any',
    supportedTeam: '',
    specialRequests: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Animation Variants
  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98
    })
  };

  const navigate = (newStep: Step, dir: number) => {
    setDirection(dir);
    setStep(newStep);
  };

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectedPackage = PACKAGES.find(p => p.id === formData.selectedPackageId) || PACKAGES[1];

  const renderProgress = () => {
    const steps: Step[] = ['intro', 'dates', 'package', 'details', 'contact', 'review', 'success'];
    const currentIndex = steps.indexOf(step);
    const progress = (currentIndex / (steps.length - 1)) * 100;

    return (
      <div className="fixed top-0 left-0 w-full h-1 bg-stone-100 z-50">
        <motion.div 
          className="h-full bg-mlr-red" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-stone-50 text-stone-900 z-50 flex flex-col overflow-hidden font-sans selection:bg-mlr-red/20 selection:text-mlr-red">
      <style>
        {`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
          .hide-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      {renderProgress()}

      {/* Brand Logo - Dark for Light Mode */}
      <div className="absolute top-8 left-8 z-50 animate-fade-in mix-blend-multiply pointer-events-none">
         <img 
           src="https://724fta3143.ufs.sh/f/MTE58BV23upXgV6A1ejrws4cYgLUiunyW13XKFv5fNSPZlJD" 
           alt="MLR" 
           className="h-10 md:h-12 w-auto object-contain transition-opacity drop-shadow-sm" 
         />
      </div>

      {/* Close Button */}
      {step !== 'success' && (
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X size={24} />
        </motion.button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full scrollbar-hide">
        <div className="min-h-full flex flex-col items-center justify-center p-6 pt-24 pb-20">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {/* STEP 1: INTRO */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-6xl relative z-10 flex flex-col items-center"
              >
                <TicketHero match={match} onStart={() => navigate('dates', 1)} />
              </motion.div>
            )}

            {/* STEP 2: DATES */}
            {step === 'dates' && (
              <motion.div
                key="dates"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl relative z-10"
              >
                <StepHeader title="When are you traveling?" subtitle={`Match Day: ${match.date}`} />
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Check In</label>
                         <DateRangePicker 
                            startDate={dateFromStr(formData.checkIn)}
                            endDate={null}
                            onChange={(start) => updateForm('checkIn', strFromDate(start))}
                            tripType="one-way"
                            placeholder="mm/dd/yyyy"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 transition-colors hover:border-stone-400 flex items-center"
                            iconPosition="right"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Check Out</label>
                         <DateRangePicker 
                            startDate={dateFromStr(formData.checkOut)}
                            endDate={null}
                            onChange={(start) => updateForm('checkOut', strFromDate(start))}
                            tripType="one-way"
                            placeholder="mm/dd/yyyy"
                            minDate={dateFromStr(formData.checkIn) || new Date()}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 transition-colors hover:border-stone-400 flex items-center"
                            iconPosition="right"
                         />
                      </div>
                   </div>
                   
                   <div className="mt-8 flex items-center gap-3 text-stone-500 bg-stone-50 p-4 rounded-xl text-sm">
                      <CheckCircle2 size={18} className="text-mlr-red shrink-0" />
                      <span>We'll confirm exact availability with our partner hotels.</span>
                   </div>
                </div>

                <NavButtons onBack={() => navigate('intro', -1)} onNext={() => navigate('package', 1)} valid={!!formData.checkIn && !!formData.checkOut} />
              </motion.div>
            )}

            {/* STEP 3: PACKAGE SELECTION */}
            {step === 'package' && (
              <motion.div
                key="package"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-7xl relative z-10 flex flex-col py-10"
              >
                <StepHeader title="Select Experience" subtitle="Choose your match weekend package" />
                
                {/* Horizontal Scroll Container - Increased Padding for Hover/Shadows */}
                <div className="w-full overflow-x-auto snap-x snap-mandatory flex items-stretch gap-6 px-6 py-12 hide-scroll">
                  {PACKAGES.map((pkg) => (
                    <div 
                      key={pkg.id}
                      onClick={() => updateForm('selectedPackageId', pkg.id)}
                      className={cn(
                        "snap-center shrink-0 w-[280px] md:w-[320px] relative p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-2",
                        formData.selectedPackageId === pkg.id 
                          ? `bg-white ring-4 ring-offset-4 ring-stone-900 ${pkg.color} z-10 transform scale-[1.02]` 
                          : "bg-white border-stone-100 text-stone-500 opacity-90 hover:opacity-100 hover:border-stone-300"
                      )}
                    >
                       <div className="flex justify-between items-start mb-4">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md", pkg.badge)}>
                            {pkg.tier}
                          </span>
                          {formData.selectedPackageId === pkg.id && (
                             <div className="bg-black text-white rounded-full p-1 shadow-md">
                                <CheckCircle2 size={12} />
                             </div>
                          )}
                       </div>
                       
                       <div className="mb-4">
                          <pkg.icon size={32} className="mb-3 opacity-80" strokeWidth={1.5} />
                          <h3 className="text-xl font-black uppercase italic leading-none tracking-wide text-stone-900">{pkg.name}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1">{pkg.description}</p>
                       </div>

                       <ul className="space-y-2 mb-6 flex-1">
                          {pkg.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs font-bold opacity-80 leading-snug">
                               <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                               <span>{item}</span>
                            </li>
                          ))}
                       </ul>

                       <div className="pt-4 border-t border-current/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-0.5">Per Person</p>
                          <div className="flex items-baseline gap-1">
                             <p className="text-3xl font-black italic tracking-tighter text-stone-900">${pkg.price}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                  
                  {/* Spacer for scroll padding */}
                  <div className="w-4 shrink-0"></div>
                </div>

                <div className="mt-8 flex justify-center md:justify-end px-6">
                   <div className="flex gap-4 w-full md:w-auto">
                      <button onClick={() => navigate('dates', -1)} className="px-6 py-4 rounded-xl font-bold text-stone-500 hover:bg-stone-100 transition-colors w-full md:w-auto">Back</button>
                      <Button onClick={() => navigate('details', 1)} size="lg" className="flex-1 md:flex-initial px-10 shadow-lg">
                        Continue
                      </Button>
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: DETAILS (GUESTS, BEDS, TEAM) */}
            {step === 'details' && (
              <motion.div
                key="details"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl relative z-10"
              >
                <StepHeader title="Trip Details" subtitle="Customize your stay" />
                
                <div className="space-y-6">
                   {/* Counts */}
                   <div className="grid grid-cols-2 gap-6">
                      <CounterInput label="Guests" value={formData.guests} onChange={(v) => updateForm('guests', v)} icon={Users} />
                      <CounterInput label="Rooms" value={formData.rooms} onChange={(v) => updateForm('rooms', v)} icon={Building2} />
                   </div>

                   {/* Bed Preference */}
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                      <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 block">Bed Preference</label>
                      <div className="flex gap-4">
                         {['any', 'king', 'double'].map((type) => (
                           <button
                             key={type}
                             onClick={() => updateForm('bedPreference', type)}
                             className={cn(
                               "flex-1 py-4 rounded-xl font-bold uppercase text-xs tracking-wider border-2 transition-all",
                               formData.bedPreference === type 
                                 ? "border-mlr-red bg-mlr-red/5 text-mlr-red" 
                                 : "border-stone-100 bg-stone-50 text-stone-500 hover:border-stone-300"
                             )}
                           >
                             {type === 'double' ? '2 Beds' : type}
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Team Allegiance Dropdown */}
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 relative z-20">
                      <label className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 block">Which team do you support?</label>
                      <TeamSelector 
                        selectedTeam={formData.supportedTeam} 
                        onSelect={(team) => updateForm('supportedTeam', team)} 
                      />
                   </div>
                </div>

                <NavButtons onBack={() => navigate('package', -1)} onNext={() => navigate('contact', 1)} valid={!!formData.supportedTeam} />
              </motion.div>
            )}

            {/* STEP 5: CONTACT */}
            {step === 'contact' && (
              <motion.div
                key="contact"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl relative z-10"
              >
                <StepHeader title="Contact Info" subtitle="Where should we send your quote?" />
                
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-stone-100 relative">
                   <div className="grid grid-cols-2 gap-6 mb-6">
                      <SimpleInput label="First Name" value={formData.firstName} onChange={(v) => updateForm('firstName', v)} icon={User} placeholder="Jane" />
                      <SimpleInput label="Last Name" value={formData.lastName} onChange={(v) => updateForm('lastName', v)} placeholder="Doe" />
                   </div>
                   <div className="space-y-6">
                     <SimpleInput label="Email" value={formData.email} onChange={(v) => updateForm('email', v)} icon={Mail} placeholder="jane@example.com" />
                     <SimpleInput label="Phone" value={formData.phone} onChange={(v) => updateForm('phone', v)} icon={Smartphone} placeholder="+1 (555) 000-0000" />
                     
                     <div className="space-y-2">
                        <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Special Requests</label>
                        <textarea 
                          className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 text-stone-900 font-medium focus:border-mlr-red outline-none resize-none h-24"
                          placeholder="Accessibility needs, dietary restrictions, etc."
                          value={formData.specialRequests}
                          onChange={(e) => updateForm('specialRequests', e.target.value)}
                        />
                     </div>
                   </div>
                </div>

                <NavButtons 
                  onBack={() => navigate('details', -1)} 
                  onNext={() => navigate('review', 1)} 
                  valid={!!formData.email && !!formData.firstName && !!formData.lastName} 
                />
              </motion.div>
            )}

            {/* STEP 6: REVIEW */}
            {step === 'review' && (
              <motion.div
                key="review"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg relative z-10"
              >
                <StepHeader title="Review Request" subtitle="Does everything look correct?" />
                
                <div className="bg-white rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden relative mb-8">
                   {/* Ticket Notch */}
                   <div className="absolute top-1/2 -left-3 w-6 h-6 bg-stone-50 rounded-full border-r border-stone-200 z-10" />
                   <div className="absolute top-1/2 -right-3 w-6 h-6 bg-stone-50 rounded-full border-l border-stone-200 z-10" />
                   
                   {/* Header Image */}
                   <div className="h-40 bg-stone-900 relative">
                      <img src={match.image} className="w-full h-full object-cover opacity-50 mix-blend-overlay grayscale" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                         <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-wider leading-tight">
                           {match.homeTeam} <br/>
                           <span className="text-stone-400">vs</span> {match.awayTeam}
                         </h3>
                      </div>
                   </div>

                   <div className="p-6 md:p-10 space-y-6 md:space-y-8 relative bg-white">
                      <div className="grid grid-cols-2 gap-4 md:gap-8 pb-6 md:pb-8 border-b-2 border-dashed border-stone-100">
                         <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Travel Dates</p>
                            <p className="font-bold text-stone-900 text-sm">{formData.checkIn || 'TBD'} → {formData.checkOut || 'TBD'}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Package</p>
                            <p className="font-bold text-stone-900 text-sm">{selectedPackage.name}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:gap-8 pb-6 md:pb-8 border-b-2 border-dashed border-stone-100">
                         <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Party</p>
                            <p className="font-bold text-stone-900 text-sm">{formData.guests} Guest(s), {formData.rooms} Room(s)</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Support</p>
                            <p className="font-bold text-stone-900 text-sm capitalize">{formData.supportedTeam || 'Neutral'}</p>
                         </div>
                      </div>

                      <div>
                         <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Contact</p>
                         <p className="font-bold text-stone-900 text-lg">{formData.firstName} {formData.lastName}</p>
                         <p className="text-sm text-stone-500 font-medium">{formData.email}</p>
                      </div>
                   </div>
                   
                   {/* Barcode Visual */}
                   <div className="bg-stone-50 p-6 flex justify-between items-center border-t border-stone-100">
                      <div className="h-8 w-48 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_39_barcode_2.svg/1200px-Code_39_barcode_2.svg.png')] bg-cover opacity-30 mix-blend-multiply"></div>
                      <span className="font-mono text-xs text-stone-400 font-bold tracking-widest">REQ-{Math.floor(Math.random()*10000)}</span>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                   <button onClick={() => navigate('contact', -1)} className="px-6 py-4 rounded-xl font-bold text-stone-500 hover:bg-stone-200 transition-colors w-full md:w-auto">Edit</button>
                   <Button onClick={() => navigate('success', 1)} size="lg" className="flex-1 bg-stone-900 text-white hover:bg-black shadow-xl w-full">
                     Submit Request
                   </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 7: SUCCESS */}
            {step === 'success' && (
               <motion.div
                 key="success"
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", duration: 0.8 }}
                 className="text-center max-w-2xl relative z-10"
               >
                  <Confetti manualstart={false} />
                  
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200 animate-bounce-short">
                     <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-6 leading-none tracking-tighter text-stone-900">
                    Request<br/>Received!
                  </h2>
                  
                  <p className="text-xl text-stone-500 mb-12 leading-relaxed font-medium max-w-md mx-auto">
                    Our travel team is building your quote. Keep an eye on <span className="text-stone-900 font-bold underline">{formData.email}</span>.
                  </p>

                  <Button onClick={onClose} size="lg" className="bg-stone-900 text-white hover:bg-black px-12 h-16 text-lg font-bold uppercase tracking-wide shadow-2xl">
                     Return to Dashboard
                  </Button>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const StepHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10 animate-slide-up">
    <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-2 tracking-tight text-stone-900">{title}</h2>
    <p className="text-stone-500 text-lg font-medium">{subtitle}</p>
  </div>
);

const NavButtons: React.FC<{ onBack: () => void; onNext: () => void; valid?: boolean }> = ({ onBack, onNext, valid = true }) => (
  <div className="mt-10 flex justify-between items-center">
     <button onClick={onBack} className="text-stone-400 hover:text-stone-900 font-bold uppercase tracking-wide flex items-center gap-3 transition-colors px-4 py-2 group">
       <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
     </button>
     <Button onClick={onNext} size="lg" className="px-12 h-14 text-base bg-mlr-red text-white hover:bg-red-700 shadow-lg shadow-red-200" disabled={!valid}>
       Continue
     </Button>
  </div>
);

const TeamSelector: React.FC<{ selectedTeam: string; onSelect: (team: string) => void }> = ({ selectedTeam, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300",
          isOpen ? "border-stone-900 bg-stone-50" : "border-stone-100 bg-stone-50 hover:border-stone-300"
        )}
      >
        <div className="flex items-center gap-3">
           <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", selectedTeam ? "bg-stone-900" : "bg-stone-300")}>
              <Flag size={18} />
           </div>
           <span className={cn("font-bold text-lg", selectedTeam ? "text-stone-900" : "text-stone-400")}>
             {selectedTeam || 'Select a Team'}
           </span>
        </div>
        <div className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}>
           <ChevronDown size={20} className="text-stone-400" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-stone-200 z-50 overflow-hidden max-h-[60vh] flex flex-col"
          >
             <div className="p-4 border-b border-stone-100 sticky top-0 bg-white z-10">
                <div className="relative">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                   <input 
                     placeholder="Search team..." 
                     className="w-full bg-stone-50 rounded-xl py-3 pl-12 pr-4 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-stone-200 transition-all placeholder:font-medium placeholder:text-stone-400"
                   />
                </div>
             </div>
             
             <div className="overflow-y-auto p-4 custom-scrollbar">
               {Object.entries(TEAMS).map(([conference, teams]) => (
                 <div key={conference} className="mb-6 last:mb-0">
                    <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-3 ml-2 sticky top-0 bg-white py-2">{conference}</h4>
                    <div className="space-y-1">
                      {teams.map((team) => (
                        <button
                          key={team}
                          onClick={() => {
                            onSelect(team);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group text-left",
                            selectedTeam === team ? "bg-stone-900 text-white" : "hover:bg-stone-50 text-stone-600"
                          )}
                        >
                          <span className="font-bold text-sm">{team}</span>
                          {selectedTeam === team && <CheckCircle2 size={16} className="text-white" />}
                        </button>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TicketHero: React.FC<{ match: Match; onStart: () => void }> = ({ match, onStart }) => (
  <div className="w-full flex flex-col items-center">
    <motion.div 
       initial={{ opacity: 0, scale: 0.95, y: 20 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
       className="w-full relative aspect-video md:aspect-[2.35/1] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 group cursor-pointer border-4 border-white ring-1 ring-stone-200"
    >
       <motion.img 
         src={match.image} 
         alt={match.homeTeam} 
         className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 saturate-[0.8] group-hover:saturate-100"
       />
       {/* Gradient Overlay */}
       <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent opacity-90"></div>
       
       {/* Ticket Stub Content */}
       <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                   <span className="bg-white text-stone-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg">Next Match</span>
                   <span className="text-white/80 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white"></div>
                      {match.date}
                   </span>
                </div>
                
                <div>
                   <h1 className="text-5xl md:text-8xl font-black italic uppercase text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                     {match.homeTeam}
                   </h1>
                   <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-2xl md:text-3xl font-bold text-stone-400 italic">vs</span>
                      <h2 className="text-3xl md:text-5xl font-black italic uppercase text-stone-200 tracking-tight leading-none">
                        {match.awayTeam}
                      </h2>
                   </div>
                </div>
             </div>

             <div className="md:text-right space-y-1">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-sm md:justify-end">
                   <MapPin size={16} className="text-mlr-red" />
                   {match.city}
                </div>
                <div className="text-stone-400 text-xs font-bold uppercase tracking-widest">{match.venue}</div>
             </div>
          </div>
       </div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col items-center gap-8 w-full max-w-lg text-center"
    >
       <p className="text-stone-500 text-lg font-medium leading-relaxed">
         Secure your match weekend experience. <br/>Exclusive rates for fans traveling to {match.city}.
       </p>

       <Button 
         size="lg" 
         onClick={onStart}
         className="h-16 px-16 text-lg bg-stone-900 text-white hover:bg-black hover:scale-105 transition-all duration-300 border-0 shadow-2xl w-full md:w-auto"
       >
         Start Booking <ArrowRight className="ml-3" size={20} />
       </Button>
    </motion.div>
  </div>
);

const CounterInput: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon: any;
}> = ({ label, value, onChange, icon: Icon }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-stone-200 shadow-sm"
  >
     <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-900 border border-stone-100">
           <Icon size={24} />
        </div>
        <div>
           <h4 className="text-lg font-black text-stone-900 uppercase tracking-wide italic">{label}</h4>
        </div>
     </div>
     
     <div className="flex items-center gap-3">
        <button 
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-8 h-8 rounded-full border-2 border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-all font-bold bg-transparent"
        >
          -
        </button>
        <span className="text-xl font-black italic w-8 text-center text-stone-900">{value}</span>
        <button 
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-black transition-all font-bold shadow-lg"
        >
          +
        </button>
     </div>
  </motion.div>
);

const SimpleInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon?: any;
  placeholder?: string;
}> = ({ label, value, onChange, icon: Icon, placeholder }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1 group-focus-within:text-mlr-red transition-colors">{label}</label>
    <div className="relative">
       <input 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-4 px-4 pl-12 text-lg font-bold text-stone-900 outline-none focus:border-mlr-red transition-all placeholder:text-stone-300"
       />
       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-mlr-red transition-colors">
          {Icon ? <Icon size={20} /> : <div className="w-5" />}
       </div>
    </div>
  </div>
);
