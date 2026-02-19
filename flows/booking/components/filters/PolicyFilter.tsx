import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export const PolicyFilter: React.FC = () => {
  const [inPolicyOnly, setInPolicyOnly] = useState(false);

  return (
    <div className="w-80">
      <div className="mb-6">
        <label className="flex items-start gap-4 cursor-pointer group">
           <div 
             className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${inPolicyOnly ? 'bg-purple-600 border-purple-600' : 'border-stone-300 bg-white'}`}
             onClick={(e) => { e.preventDefault(); setInPolicyOnly(!inPolicyOnly); }}
           >
              {inPolicyOnly && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
           </div>
           <div>
              <span className="text-stone-900 font-bold block">In policy prices only <span className="text-stone-400 font-normal">(0)</span></span>
              <p className="text-xs text-stone-500 mt-1">Hide options that require approval</p>
           </div>
        </label>
      </div>

      <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
         <h4 className="text-sm font-bold text-stone-900 mb-3">Flight policy for this route</h4>
         
         <div className="space-y-4 text-sm">
            <div>
               <span className="text-stone-500 block text-xs mb-0.5">Book in advance:</span>
               <span className="font-medium text-stone-900">7 days or more</span>
            </div>
            <div>
               <span className="text-stone-500 block text-xs mb-0.5">Max fare type:</span>
               <span className="font-medium text-stone-900">Economy</span>
            </div>
            <div>
               <span className="text-stone-500 block text-xs mb-0.5">Paid seats:</span>
               <span className="font-medium text-stone-900">Allowed with conditions</span>
            </div>
         </div>

         <div className="mt-4 flex items-start gap-2 text-orange-600 bg-orange-50 p-2 rounded-lg">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium">Can I book out of Policy?</span>
         </div>
         <p className="text-[10px] text-stone-400 mt-2 leading-relaxed">
            You'll have the ability to book out of policy, but will need to submit a reason for booking, and your travel approver will be notified.
         </p>
      </div>
    </div>
  );
};