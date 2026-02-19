
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TripType } from './TripTypeSelector';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  tripType: TripType;
  minDate?: Date;
  className?: string;
  placeholder?: string;
  hideIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onChange, 
  tripType,
  minDate = new Date(),
  className = '',
  placeholder = 'Select Dates',
  hideIcon = false,
  iconPosition = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  // Internal state for the calendar view (which month we are looking at)
  const [viewDate, setViewDate] = useState(startDate || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    if (startDate) setViewDate(startDate);
  }, [startDate]);

  // Positioning Logic for Portal
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownEstimatedHeight = 320; // approximate max height
      const dropdownWidth = 280;

      let style: React.CSSProperties = {
        position: 'fixed',
        zIndex: 9999,
        width: `${dropdownWidth}px`
      };

      // Horizontal Positioning
      let left = rect.left;
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 16;
      }
      style.left = `${left}px`;

      // Vertical Positioning (Flip if not enough space below)
      if (rect.bottom + dropdownEstimatedHeight > viewportHeight && rect.top > dropdownEstimatedHeight) {
        // Position above
        style.bottom = `${viewportHeight - rect.top + 8}px`;
        style.transformOrigin = 'bottom left';
      } else {
        // Position below
        style.top = `${rect.bottom + 8}px`;
        style.transformOrigin = 'top left';
      }

      setDropdownStyle(style);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleInteraction = (event: Event) => {
      // Close on scroll or resize to prevent floating element detachment
      if (event.type === 'scroll' || event.type === 'resize') {
        setIsOpen(false);
        return;
      }

      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleInteraction);
      window.addEventListener('scroll', handleInteraction, true);
      window.addEventListener('resize', handleInteraction);
    }
    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction, true);
      window.removeEventListener('resize', handleInteraction);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isBefore = (d1: Date, d2: Date) => {
    return new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()) < 
           new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    
    // One Way Logic
    if (tripType === 'one-way') {
      onChange(clickedDate, null);
      setIsOpen(false);
      return;
    }

    // Round Trip Logic
    if (!startDate || (startDate && endDate)) {
      onChange(clickedDate, null);
    } else if (startDate && !endDate) {
      if (isBefore(clickedDate, startDate)) {
        onChange(clickedDate, null);
      } else {
        onChange(startDate, clickedDate);
        setIsOpen(false);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
  };

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    onChange(today, null);
    setViewDate(today);
    if (tripType === 'one-way') setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-7 h-7" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      
      const isDisabled = minDate && isBefore(current, minDate);
      const isStart = isSameDay(current, startDate);
      const isEnd = isSameDay(current, endDate);
      
      let isInRange = false;
      if (startDate && endDate) {
        isInRange = current > startDate && current < endDate;
      } else if (startDate && !endDate && hoverDate) {
        if (hoverDate > startDate) {
          isInRange = current > startDate && current < hoverDate;
        }
      }

      days.push(
        <button
          key={day}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDisabled) handleDateClick(day);
          }}
          onMouseEnter={() => setHoverDate(current)}
          onMouseLeave={() => setHoverDate(null)}
          disabled={isDisabled}
          className={`
            w-7 h-7 relative flex items-center justify-center text-xs font-bold transition-all z-10 rounded-full
            ${isDisabled ? 'text-stone-300 cursor-not-allowed' : 'cursor-pointer'}
            ${isStart || isEnd 
                ? 'bg-mlr-red text-white shadow-sm shadow-red-200' 
                : (!isDisabled ? 'text-stone-700 hover:bg-stone-100 hover:text-black' : '')}
          `}
        >
          {isInRange && !isDisabled && !isStart && !isEnd && (
            <div className="absolute inset-0 bg-red-50 z-[-1] rounded-full scale-110"></div>
          )}
          {day}
        </button>
      );
    }
    return days;
  };

  const displayString = () => {
    if (!startDate) return placeholder;
    if (tripType === 'one-way') return formatDate(startDate);
    if (startDate && !endDate) return `${formatDate(startDate)}...`;
    return `${formatDate(startDate)} - ${formatDate(endDate!)}`;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer group h-full"
      >
        <div className="flex items-center gap-3 w-full">
          {iconPosition === 'left' && !hideIcon && (
            <Calendar className={`transition-colors ${isOpen ? 'text-mlr-red' : 'text-stone-400 group-hover:text-stone-900'}`} size={20} />
          )}
          
          <span className={`font-bold truncate flex-1 text-left ${startDate ? 'text-inherit' : 'text-stone-300'}`}>
            {displayString()}
          </span>

          {iconPosition === 'right' && !hideIcon && (
            <Calendar className={`transition-colors ${isOpen ? 'text-mlr-red' : 'text-stone-400 group-hover:text-stone-900'}`} size={20} />
          )}
        </div>
      </div>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="fixed bg-white rounded-2xl shadow-2xl border border-stone-100 p-3 animate-scale-in text-stone-900"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2 border-b border-stone-100 pb-2">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button 
              className="text-stone-900 font-bold text-sm uppercase tracking-wide hover:bg-stone-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </button>
            <button onClick={handleNextMonth} className="p-1 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-y-1 place-items-center mb-2">
            {DAYS.map((day, i) => (
              <div key={i} className="text-[9px] font-black text-stone-400 uppercase tracking-wider w-7 text-center mb-1">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-stone-100">
             <button 
               onClick={handleClear}
               className="text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-wider"
             >
               Clear
             </button>
             <button 
               onClick={handleToday}
               className="text-[10px] font-bold text-mlr-red hover:text-red-700 transition-colors uppercase tracking-wider"
             >
               Today
             </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
