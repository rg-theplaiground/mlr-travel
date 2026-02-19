
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatePicker: React.FC<DatePickerProps> = ({ 
  label, 
  placeholder = 'Select date', 
  value, 
  onChange, 
  minDate,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calendar Navigation State
  const [viewDate, setViewDate] = useState(value || new Date());
  
  // Time Slider State
  const [timeRange, setTimeRange] = useState({ start: 0, end: 24 });
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setViewDate(value);
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Slider Logic
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(null);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const rawValue = percent * 24;
      
      // Snap to nearest half hour or integer? Integer for simplicity
      const value = Math.round(rawValue);

      if (isDragging === 'start') {
        const newStart = Math.min(value, timeRange.end - 1);
        setTimeRange(prev => ({ ...prev, start: Math.max(0, newStart) }));
      } else {
        const newEnd = Math.max(value, timeRange.start + 1);
        setTimeRange(prev => ({ ...prev, end: Math.min(24, newEnd) }));
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
  }, [isDragging, timeRange]);

  const handleMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    setIsDragging(type);
  };

  const formatTime = (hour: number) => {
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const formatRange = () => {
    if (timeRange.start === 0 && timeRange.end === 24) return 'Anytime';
    return `${formatTime(timeRange.start)} – ${formatTime(timeRange.end)}`;
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate);
    // Don't close immediately if they might want to adjust time
    // setIsOpen(false); 
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    return current < min;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isSelected = value && 
        value.getDate() === day && 
        value.getMonth() === viewDate.getMonth() && 
        value.getFullYear() === viewDate.getFullYear();
      
      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === viewDate.getMonth() && 
        new Date().getFullYear() === viewDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDisabled) handleDateClick(day);
          }}
          disabled={isDisabled}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${isSelected 
              ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' 
              : isDisabled 
                ? 'text-stone-300 cursor-not-allowed' 
                : 'text-stone-700 hover:bg-stone-100'}
            ${isToday && !isSelected ? 'border border-stone-300' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={`relative h-full ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-full flex flex-col justify-center cursor-pointer group"
      >
        {label && (
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 pointer-events-none">
            {label}
          </label>
        )}
        <div className="flex items-center gap-3">
          <Calendar className={`text-stone-400 transition-colors ${isOpen ? 'text-stone-900' : 'group-hover:text-stone-600'}`} size={20} />
          <span className={`text-base font-medium truncate ${value ? 'text-stone-900' : 'text-stone-400'}`}>
            {value ? formatDate(value) : placeholder}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-4 bg-white rounded-3xl shadow-xl border border-stone-100 p-6 z-[60] w-[340px] animate-scale-in origin-top-left">
          
          {/* Time Slider Section */}
          <div className="mb-6 px-1">
             <div className="flex justify-between items-center mb-6">
               <span className="text-sm font-bold text-stone-900">
                 {label ? `${label} time` : 'Time'}
               </span>
               <span className="text-sm font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                 {formatRange()}
               </span>
             </div>
             <div 
               className="relative h-6 flex items-center select-none cursor-pointer" 
               ref={sliderRef}
             >
                {/* Track Background */}
                <div className="absolute w-full h-1.5 bg-stone-100 rounded-full"></div>
                
                {/* Active Track */}
                <div 
                  className="absolute h-1.5 bg-stone-900 rounded-full"
                  style={{ 
                    left: `${(timeRange.start / 24) * 100}%`, 
                    right: `${100 - (timeRange.end / 24) * 100}%` 
                  }}
                ></div>
                
                {/* Start Thumb */}
                <div 
                   onMouseDown={handleMouseDown('start')}
                   className="absolute w-6 h-6 bg-white border-[3px] border-stone-900 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center top-0"
                   style={{ left: `calc(${(timeRange.start / 24) * 100}% - 12px)` }}
                >
                  <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                </div>

                {/* End Thumb */}
                <div 
                   onMouseDown={handleMouseDown('end')}
                   className="absolute w-6 h-6 bg-white border-[3px] border-stone-900 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center top-0"
                   style={{ left: `calc(${(timeRange.end / 24) * 100}% - 12px)` }}
                >
                   <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                </div>
             </div>
             
             {/* Time Labels */}
             <div className="flex justify-between mt-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
               <span>12AM</span>
               <span>Noon</span>
               <span>11PM</span>
             </div>
          </div>

          <div className="h-px bg-stone-100 w-full mb-6"></div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-stone-900 font-bold text-lg">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <button onClick={handleNextMonth} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2 place-items-center">
            {DAYS.map(day => (
              <div key={day} className="text-xs font-bold text-stone-400 w-10 text-center mb-2">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
          
          <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
             <button 
               onClick={() => {
                 setTimeRange({ start: 0, end: 24 });
                 // Note: Does not reset date, purely resets slider
               }}
               className="text-sm font-bold text-stone-400 hover:text-stone-600 transition-colors"
             >
               Reset time
             </button>
             
             <button 
               onClick={() => {
                 setIsOpen(false);
               }}
               className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors"
             >
               Done
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
