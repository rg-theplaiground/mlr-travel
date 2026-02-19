
import React from 'react';
import { CheckCircle2, Circle, ChevronRight, X } from 'lucide-react';
import { UserData } from '../types';

interface WelcomeWidgetProps {
  userData: UserData;
  onDismiss: () => void;
  onAddTravelerInfo: () => void;
}

export const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ userData, onDismiss, onAddTravelerInfo }) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group animate-fade-in">
      {/* Decorative gradient blob */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-stone-800 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-black italic uppercase text-white tracking-tight">Welcome to Hyrox Travel</h3>
            <p className="text-stone-400 max-w-lg font-medium">
              Complete your profile to unlock race-ready bookings.
              <br />
              <span className="text-stone-500 text-sm">0 / 3 tasks completed</span>
            </p>
            <div className="w-32 h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
               <div className="w-0 h-full bg-hyrox-yellow rounded-full"></div>
            </div>
          </div>
          <button onClick={onDismiss} className="p-2 hover:bg-stone-800 rounded-full text-stone-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Primary Task - Highlighted */}
          <div 
            onClick={onAddTravelerInfo}
            className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl bg-black border border-stone-800 cursor-pointer hover:border-hyrox-yellow/50 transition-all duration-300 group/item"
          >
             <div className="flex items-start gap-4 flex-1">
               <div className="w-6 h-6 rounded-full border-2 border-hyrox-yellow flex items-center justify-center flex-shrink-0 mt-0.5 bg-black">
                 <div className="w-0 h-0 bg-hyrox-yellow rounded-full group-hover/item:w-3 group-hover/item:h-3 transition-all duration-300" />
               </div>
               <div>
                  <h4 className="font-bold text-white uppercase tracking-wide">Add your traveler info</h4>
                  <p className="text-sm text-stone-500 mt-1">Required for booking. Add passport & preferences.</p>
               </div>
             </div>
             
             <button className="flex items-center justify-center gap-2 bg-stone-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm border border-stone-800 group-hover/item:bg-hyrox-yellow group-hover/item:text-black transition-all">
               Get started
               <ChevronRight size={14} />
             </button>
          </div>

          <ChecklistItem 
            title="Add your loyalty programs" 
            status="pending" 
            subtitle="Connect airline & hotel memberships"
            actionLabel="Connect"
          />
          <ChecklistItem 
            title="Learn about Hyrox Rewards" 
            status="pending" 
            subtitle="Earn points on race travel"
            actionLabel="View"
          />
        </div>
      </div>
    </div>
  );
};

const ChecklistItem: React.FC<{ 
  title: string; 
  subtitle: string; 
  status: 'completed' | 'pending';
  actionLabel?: string;
  onClick?: () => void;
}> = ({ title, subtitle, status, actionLabel, onClick }) => {
  const isCompleted = status === 'completed';

  return (
    <div 
      onClick={onClick}
      className={`
      flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer
      ${isCompleted 
        ? 'bg-stone-900 border-transparent opacity-50' 
        : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900'}
    `}>
      <div className={`
        flex-shrink-0 transition-colors
        ${isCompleted ? 'text-green-500' : 'text-stone-600'}
      `}>
        {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </div>
      
      <div className="flex-1">
        <h4 className={`font-bold uppercase tracking-wide text-sm ${isCompleted ? 'text-stone-600 line-through' : 'text-stone-300'}`}>
          {title}
        </h4>
        <p className="text-sm text-stone-600 mt-0.5">{subtitle}</p>
      </div>

      {!isCompleted && (
        <div className="flex items-center gap-2 text-stone-400 group-hover:text-white font-bold text-xs uppercase tracking-wider bg-black border border-stone-800 px-4 py-2 rounded-xl transition-colors">
          {actionLabel || 'Start'}
          <ChevronRight size={14} />
        </div>
      )}
    </div>
  );
};
