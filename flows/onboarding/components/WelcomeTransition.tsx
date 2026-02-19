
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/Button';
import { UserData } from '../../../types';
import { ArrowRight } from 'lucide-react';

// --- Part 1: The UI Content (Logo, Text, Button) ---

interface WelcomeTransitionProps {
  userData: UserData;
  onFinish: () => void;
}

export const WelcomeTransition: React.FC<WelcomeTransitionProps> = ({ userData, onFinish }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#F5F5F7] flex items-center justify-center overflow-hidden font-sans">
       {/* Background Glow */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_#F5F5F7_100%)] pointer-events-none"></div>

       {/* Sabre Online Badge */}
       <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100 backdrop-blur-md shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Sabre Online</span>
          </div>
       </div>

       {/* Content Container */}
       <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mb-12 relative"
          >
             <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full scale-150 animate-pulse-slow"></div>
             <img 
               src="https://724fta3143.ufs.sh/f/MTE58BV23upXtMQDVH54ZdIQwYbBvk18XnD9VCeoRr7LUyfS" 
               alt="Camina Logo" 
               className="w-48 h-48 md:w-72 md:h-72 object-contain relative z-10 drop-shadow-2xl"
             />
          </motion.div>

          {/* Text */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight p-2"
            >
              Your journey starts here.
            </motion.h1>
          </div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Button 
              size="lg" 
              onClick={onFinish}
              className="bg-[#FF7D33] hover:bg-[#FF6B1A] text-white h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
       </div>
    </div>
  );
};


// --- Part 2: The Global Overlay Animation (Plane) ---

interface TransitionOverlayProps {
  onCovered: () => void;
  onComplete: () => void;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ onCovered, onComplete }) => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center">
      <motion.div
        initial={{ x: '-150vw' }}
        animate={{ x: '150vw' }}
        transition={{ 
          duration: 3.5, // Increased duration for a slower, smoother flight
          ease: [0.22, 1, 0.36, 1], // Custom easeOut-like curve
        }}
        onAnimationStart={() => {
            // Trigger view switch when plane covers screen (adjusted for slower duration)
            setTimeout(() => {
                onCovered();
            }, 1500);
        }}
        onAnimationComplete={() => {
            onComplete();
        }}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
      >
          <div className="relative w-full h-full flex items-center justify-center">
             
             {/* The Plane 
                 - w-[160vh]: Increased size for fuller coverage
                 - No rotation: Assumes original image points RIGHT.
             */}
             <img 
                 src="https://cdn.prod.website-files.com/661fdce3e735db03332bf817/66223004372c7c1124c1b0d1_Top-view2x-p-2000.webp"
                 alt="Plane"
                 className="w-[160vh] max-w-none object-contain drop-shadow-2xl relative z-20"
             />
             
             {/* Trailing White Curtain 
                 - Anchored to the TAIL of the plane.
                 - Plane points RIGHT. Tail is LEFT.
                 - Plane width ~160vh. Center to Tail ~80vh.
                 - Curtain Right Edge needs to be at (Center - Offset).
                 - right: 50% puts edge at Center.
                 - translate-x: -70vh moves it left to tuck under tail.
             */}
             <div className="absolute top-[-100vh] bottom-[-100vh] right-[50%] w-[300vw] bg-[#F5F5F7] z-10 transform -translate-x-[70vh]" />
          </div>
      </motion.div>
    </div>
  );
};
