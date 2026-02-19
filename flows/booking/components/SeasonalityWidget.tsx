
import React, { useEffect, useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { getTravelSeasonality, SeasonalityItem } from '../../../../services/sabre';

interface SeasonalityWidgetProps {
  destination: string;
}

export const SeasonalityWidget: React.FC<SeasonalityWidgetProps> = ({ destination }) => {
  const [data, setData] = useState<SeasonalityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!destination || destination.length !== 3) return;
      
      setLoading(true);
      const response = await getTravelSeasonality(destination);
      setLoading(false);

      if (response && response.Seasonality && response.Seasonality.length > 0) {
        setData(response.Seasonality);
        setHasData(true);
      } else {
        setHasData(false);
      }
    };

    fetchData();
  }, [destination]);

  if (!destination || (!loading && !hasData)) return null;

  // Process data for chart
  // We'll show a simplified 12-bar view (one per month roughly) or 52 bars if small enough
  // Let's do 52 bars for a cool "DNA" look
  
  const getCurrentWeekIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return Math.floor(day / 7);
  };

  const currentWeek = getCurrentWeekIndex();

  const getBarColor = (indicator: string, isCurrent: boolean) => {
    if (isCurrent) return 'bg-stone-900';
    switch (indicator) {
      case 'Low': return 'bg-emerald-300';
      case 'Medium': return 'bg-yellow-300';
      case 'High': return 'bg-red-400';
      default: return 'bg-stone-200';
    }
  };

  const getHeight = (indicator: string) => {
    switch (indicator) {
      case 'Low': return 'h-4';
      case 'Medium': return 'h-8';
      case 'High': return 'h-12';
      default: return 'h-4';
    }
  };

  return (
    <div className="animate-slide-up mb-8">
      <div className="glass-panel rounded-3xl p-6 border border-white/50 relative overflow-hidden">
        
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-stone-100 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex items-start justify-between mb-6 relative z-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-900 shadow-sm border border-stone-100">
                 {loading ? (
                   <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div>
                 ) : (
                   <TrendingUp size={20} />
                 )}
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm md:text-base">Travel Insights: {destination}</h3>
                <p className="text-xs text-stone-500">Historical crowd levels</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-300"></div>Low</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-300"></div>Med</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div>High</div>
           </div>
        </div>

        {/* Chart */}
        <div className="relative h-16 flex items-end gap-[2px] md:gap-1 opacity-90">
           {loading ? (
             // Skeleton Loading
             Array.from({ length: 52 }).map((_, i) => (
               <div key={i} className="flex-1 bg-stone-100 rounded-t-sm animate-pulse" style={{ height: `${Math.random() * 100}%` }}></div>
             ))
           ) : (
             data.map((item, i) => {
               const isCurrent = i === currentWeek;
               return (
                 <div 
                   key={i} 
                   className={`flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80 group relative ${getBarColor(item.SeasonalityIndicator, isCurrent)} ${getHeight(item.SeasonalityIndicator)}`}
                 >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none transition-opacity">
                       Week {item.YearWeekNumber}: {item.SeasonalityIndicator}
                    </div>
                    {/* Current Week Marker */}
                    {isCurrent && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="text-[9px] font-bold text-stone-900 uppercase tracking-tighter mb-0.5">Now</span>
                        <div className="w-px h-2 bg-stone-900"></div>
                      </div>
                    )}
                 </div>
               );
             })
           )}
        </div>
        
        {!loading && (
          <div className="mt-4 pt-4 border-t border-stone-100 flex gap-4 text-xs text-stone-500">
             <div className="flex items-center gap-2">
               <Info size={14} />
               <span>Based on booking data from the last 12 months.</span>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
