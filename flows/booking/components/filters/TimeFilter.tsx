import * as React from 'react';

interface TimeFilterProps {
  range: { start: number; end: number };
  onChange: (range: { start: number; end: number }) => void;
  tab: 'depart' | 'arrive';
  onTabChange: (tab: 'depart' | 'arrive') => void;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({ range, onChange, tab, onTabChange }) => {
  const [localRange, setLocalRange] = React.useState(range);
  const [isDragging, setIsDragging] = React.useState<'start' | 'end' | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLocalRange(range);
  }, [range]);

  // Mock volume data
  const bars = [10, 20, 15, 40, 60, 80, 90, 40, 20, 10, 5, 10, 20, 30, 50, 70, 60, 40, 20, 10, 5, 5, 5, 5];

  React.useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        onChange(localRange);
        setIsDragging(null);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const value = Math.round(percent * 24); // 0-24 hours

      if (isDragging === 'start') {
        const newStart = Math.min(value, localRange.end - 1);
        setLocalRange((prev: { start: number; end: number }) => ({ ...prev, start: Math.max(0, newStart) }));
      } else {
        const newEnd = Math.max(value, localRange.start + 1);
        setLocalRange((prev: { start: number; end: number }) => ({ ...prev, end: Math.min(24, newEnd) }));
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, localRange, onChange]);

  const handleMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(type);
  };

  const formatTime = (hour: number) => {
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div>
      <div className="flex border-b border-stone-100 mb-6">
        <button
          onClick={() => onTabChange('depart')}
          className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${tab === 'depart' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Depart
        </button>
        <button
          onClick={() => onTabChange('arrive')}
          className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${tab === 'arrive' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Arrive
        </button>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-stone-500">
            {localRange.start === 0 && localRange.end === 24 ? 'Anytime' : `${formatTime(localRange.start)} – ${formatTime(localRange.end)}`}
          </p>
        </div>

        {/* Histogram bars */}
        <div className="flex items-end gap-px h-12 mb-2">
          {bars.map((value, i) => {
            const inRange = i >= localRange.start && i < localRange.end;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-colors ${inRange ? 'bg-stone-800' : 'bg-stone-200'}`}
                style={{ height: `${value}%` }}
              />
            );
          })}
        </div>

        {/* Slider track */}
        <div ref={sliderRef} className="relative h-6 cursor-pointer select-none">
          {/* Background track */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-stone-200 rounded-full" />

          {/* Active range track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 bg-stone-800 rounded-full"
            style={{
              left: `${(localRange.start / 24) * 100}%`,
              right: `${100 - (localRange.end / 24) * 100}%`,
            }}
          />

          {/* Start handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-stone-800 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
            style={{ left: `${(localRange.start / 24) * 100}%` }}
            onMouseDown={handleMouseDown('start')}
          />

          {/* End handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-stone-800 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
            style={{ left: `${(localRange.end / 24) * 100}%` }}
            onMouseDown={handleMouseDown('end')}
          />
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-stone-400">12 AM</span>
          <span className="text-xs text-stone-400">12 PM</span>
          <span className="text-xs text-stone-400">12 AM</span>
        </div>
      </div>
    </div>
  );
};