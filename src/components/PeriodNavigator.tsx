import React, { useState, useEffect } from 'react';
import { TimePeriod } from '../types';
import { ChevronLeft, ChevronRight, Calendar, X, Check } from 'lucide-react';

interface PeriodNavigatorProps {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  startDate?: string;
  endDate?: string;
  selectedDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
  onNavDateChange?: (newDateStr: string) => void;
}

// Calculate ISO Week Number
function getISOWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export const PeriodNavigator: React.FC<PeriodNavigatorProps> = ({
  period,
  onPeriodChange,
  startDate = '2026-08-01',
  endDate = '2026-08-31',
  selectedDate = '2026-08-08',
  onCustomDateChange,
  onNavDateChange,
}) => {
  // Reference date state
  const [navDate, setNavDate] = useState<Date>(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date(2026, 7, 8) : d;
  });

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  // Keep navDate synced if selectedDate prop changes from parent
  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        setNavDate(d);
      }
    }
  }, [selectedDate]);

  const updateNavDate = (newDate: Date) => {
    setNavDate(newDate);
    // Format YYYY-MM-DD
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    if (onNavDateChange) {
      onNavDateChange(dateStr);
    }
  };

  // Navigate Previous
  const handlePrev = () => {
    const next = new Date(navDate);
    switch (period) {
      case 'DAILY':
        next.setDate(next.getDate() - 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() - 7);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() - 1);
        break;
      case 'QUARTERLY':
        next.setMonth(next.getMonth() - 3);
        break;
      case 'YEARLY':
        next.setFullYear(next.getFullYear() - 1);
        break;
      case 'CUSTOM': {
        const s = new Date(tempStart);
        const e = new Date(tempEnd);
        const diffMs = e.getTime() - s.getTime();
        const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        s.setDate(s.getDate() - diffDays);
        e.setDate(e.getDate() - diffDays);
        const sStr = s.toISOString().split('T')[0];
        const eStr = e.toISOString().split('T')[0];
        setTempStart(sStr);
        setTempEnd(eStr);
        if (onCustomDateChange) {
          onCustomDateChange(sStr, eStr);
        }
        return;
      }
    }
    updateNavDate(next);
  };

  // Navigate Next
  const handleNext = () => {
    const next = new Date(navDate);
    switch (period) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'QUARTERLY':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'YEARLY':
        next.setFullYear(next.getFullYear() + 1);
        break;
      case 'CUSTOM': {
        const s = new Date(tempStart);
        const e = new Date(tempEnd);
        const diffMs = e.getTime() - s.getTime();
        const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        s.setDate(s.getDate() + diffDays);
        e.setDate(e.getDate() + diffDays);
        const sStr = s.toISOString().split('T')[0];
        const eStr = e.toISOString().split('T')[0];
        setTempStart(sStr);
        setTempEnd(eStr);
        if (onCustomDateChange) {
          onCustomDateChange(sStr, eStr);
        }
        return;
      }
    }
    updateNavDate(next);
  };

  // Reset to Today
  const handleToday = () => {
    const today = new Date(2026, 7, 8);
    updateNavDate(today);
  };

  // Format main date display label
  const getDisplayLabel = () => {
    if (period === 'CUSTOM') {
      return `${tempStart} to ${tempEnd}`;
    }
    if (period === 'DAILY') {
      return navDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (period === 'WEEKLY' || period === 'MONTHLY') {
      return navDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
    if (period === 'QUARTERLY') {
      const q = Math.floor(navDate.getMonth() / 3) + 1;
      return `Q${q} ${navDate.getFullYear()}`;
    }
    if (period === 'YEARLY') {
      return `${navDate.getFullYear()}`;
    }
    return navDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Format optional pill badge (e.g., "Week 32")
  const getBadgeText = () => {
    if (period === 'WEEKLY') {
      return `Week ${getISOWeekNumber(navDate)}`;
    }
    if (period === 'QUARTERLY') {
      const q = Math.floor(navDate.getMonth() / 3) + 1;
      const quarters = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'];
      return quarters[q - 1];
    }
    if (period === 'CUSTOM') {
      return 'Custom Range';
    }
    return null;
  };

  const badge = getBadgeText();

  const handleApplyCustom = () => {
    if (onCustomDateChange) {
      onCustomDateChange(tempStart, tempEnd);
    }
    onPeriodChange('CUSTOM');
    setShowCustomModal(false);
  };

  return (
    <div className="relative flex items-center flex-wrap gap-2 sm:gap-3">
      {/* 1. Nav Arrows Group matching Screenshot exact layout */}
      <div className="inline-flex items-center rounded-lg bg-slate-200/90 p-0.5 border border-slate-300/60 shadow-2xs">
        <button
          onClick={handlePrev}
          className="p-1.5 hover:bg-slate-300/80 rounded-md text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          title="Previous Period"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <div className="w-[1px] h-4 bg-slate-300/80 my-auto mx-0.5" />
        <button
          onClick={handleNext}
          className="p-1.5 hover:bg-slate-300/80 rounded-md text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          title="Next Period"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Period Type Selector Dropdown matching Screenshot 1 & 2 */}
      <div className="relative">
        <select
          value={period}
          onChange={(e) => {
            const val = e.target.value as TimePeriod;
            if (val === 'CUSTOM') {
              setShowCustomModal(true);
            } else {
              onPeriodChange(val);
            }
          }}
          className="bg-slate-200/90 hover:bg-slate-300/80 text-slate-800 font-bold text-xs px-3 py-2 rounded-lg border border-slate-300/60 appearance-none pr-7 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cyan-500 shadow-2xs"
        >
          <option value="DAILY">Day</option>
          <option value="WEEKLY">Week</option>
          <option value="MONTHLY">Month</option>
          <option value="QUARTERLY">Quarter</option>
          <option value="YEARLY">Year</option>
          <option value="CUSTOM">Custom Range</option>
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-700 text-[10px]">
          ▼
        </span>
      </div>

      {/* 3. Today Button matching Screenshot 1 & 2 */}
      <button
        onClick={handleToday}
        className="bg-slate-200/90 hover:bg-slate-300/80 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-lg border border-slate-300/60 transition-colors shadow-2xs cursor-pointer"
      >
        Today
      </button>

      {/* 4. Dedicated Custom Button */}
      <button
        onClick={() => setShowCustomModal(true)}
        className={`px-3 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
          period === 'CUSTOM'
            ? 'bg-cyan-600 text-white border-cyan-700'
            : 'bg-slate-200/90 text-slate-800 border-slate-300/60 hover:bg-slate-300/80'
        }`}
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Custom</span>
      </button>

      {/* 5. Date Label & Pill Badge matching Screenshot 1 (e.g., "August 2026 Week 32") */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-0 sm:ml-1">
        <span className="font-bold text-slate-900 text-xs sm:text-sm md:text-base tracking-tight">
          {getDisplayLabel()}
        </span>
        {badge && (
          <span className="bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs shrink-0">
            {badge}
          </span>
        )}
      </div>

      {/* 6. Custom Date Range Selection Modal / Popover */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600" />
                Select Custom Date Range
              </h4>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  From Date (Start)
                </label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  To Date (End)
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg shadow-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
