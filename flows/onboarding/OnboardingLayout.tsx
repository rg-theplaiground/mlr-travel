import React from 'react';
import { Globe2, Star, TrendingUp } from 'lucide-react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, step }) => {
  return (
    <div className="min-h-screen w-full flex bg-camina-bg font-sans text-camina-primary overflow-hidden">
      
      {/* Left Side - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-4">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          {/* Background Image / Gradient */}
          <div className="absolute inset-0 bg-stone-900">
             {/* Using a placeholder image that fits the 'travel' theme but keeping it dark/sleek */}
             <img 
               src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
               alt="Travel Texture" 
               className="w-full h-full object-cover opacity-60 mix-blend-overlay"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                 <Globe2 size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">Camina AI</span>
            </div>

            <div className="space-y-8 max-w-lg">
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Business travel and expense, <span className="text-stone-400">reinvented.</span>
                </h2>
                <p className="text-lg text-stone-300 leading-relaxed">
                  Join thousands of forward-thinking companies saving time and money with Camina's intelligent travel platform.
                </p>
              </div>

              {/* Social Proof / Trust Cards */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <Star size={16} fill="white" />
                    <span className="font-bold">4.9/5</span>
                  </div>
                  <p className="text-stone-400 text-sm">User Rating</p>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <TrendingUp size={16} />
                    <span className="font-bold">30%</span>
                  </div>
                  <p className="text-stone-400 text-sm">Avg. Savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto">
        <header className="p-6 lg:hidden flex items-center justify-between">
            <div className="flex items-center gap-2 text-camina-primary">
              <div className="p-2 bg-stone-100 rounded-xl">
                 <Globe2 size={20} />
              </div>
              <span className="font-bold text-lg">Camina AI</span>
            </div>
            <div className="text-sm font-medium text-camina-secondary">
               Step {step + 1} of 3
            </div>
        </header>

        <main className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-24">
            {children}
        </main>

        <footer className="p-6 text-center lg:text-left lg:px-24">
           <div className="flex gap-1 justify-center lg:justify-start mb-4">
             {[0, 1, 2].map((i) => (
               <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-camina-primary' : 'w-2 bg-stone-200'}`} 
               />
             ))}
           </div>
        </footer>
      </div>
    </div>
  );
};