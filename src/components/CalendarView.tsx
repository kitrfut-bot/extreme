import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn, formatCurrency } from '../lib/utils';
import { TradeModal } from './TradeModal';

export function CalendarView() {
  const { trades, settings } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get leading empty days for the grid (assuming Sunday start)
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const getTradesForDay = (day: Date) => {
    return trades.filter((trade) => isSameDay(parseISO(trade.date), day));
  };

  const getDayStats = (day: Date) => {
    const dayTrades = getTradesForDay(day);
    if (dayTrades.length === 0) return null;

    const pnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    return {
      pnl,
      count: dayTrades.length,
      isProfit: pnl > 0,
      isLoss: pnl < 0,
      isBreakeven: pnl === 0
    };
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Trading Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your daily trading performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-lg shadow-sm p-1">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-bold text-lg min-w-[140px] text-center text-[#1a1a1a] dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => { setSelectedDate(new Date()); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Log New Trade
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#f0f0f0] dark:border-slate-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="border-r border-b border-[#f0f0f0] dark:border-slate-700 p-2 bg-gray-50/50 dark:bg-slate-900/20" />
          ))}

          {daysInMonth.map((day) => {
            const stats = getDayStats(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "relative flex flex-col items-start p-2 border-r border-b border-[#f0f0f0] dark:border-slate-700 transition-colors text-left group cursor-pointer",
                  isCurrentMonth ? "hover:bg-gray-50 dark:hover:bg-slate-700/50" : "opacity-0 pointer-events-none",
                  isToday(day) ? "bg-blue-50/40 dark:bg-blue-900/10" : "",
                  stats?.isLoss ? "bg-rose-50/30 dark:bg-rose-900/10 hover:bg-rose-50 dark:hover:bg-rose-900/20" : ""
                )}
              >
                <div className="flex justify-between w-full">
                  <span className={cn(
                    "text-xs font-semibold",
                    isToday(day) ? "text-blue-600 font-bold" : "text-gray-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {isToday(day) && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                </div>
                
                {stats && (
                  <div className="mt-1 w-full">
                    <div className={cn(
                      "text-[10px] font-bold truncate",
                      stats.isProfit ? "text-emerald-600 dark:text-emerald-400" :
                      stats.isLoss ? "text-rose-600 dark:text-rose-400" : "text-gray-600 dark:text-gray-300"
                    )}>
                      {stats.pnl > 0 ? '+' : ''}{formatCurrency(stats.pnl, settings.currency)}
                    </div>
                    {stats.isProfit && (
                      <div className="flex gap-0.5 mt-1">
                        <div className="w-full h-1 bg-emerald-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    )}
                    {isToday(day) && (
                      <div className="text-[8px] text-gray-400 mt-0.5">{stats.count} Trades Logged</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <TradeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          date={selectedDate}
        />
      )}
    </div>
  );
}
