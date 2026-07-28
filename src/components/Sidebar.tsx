import React from 'react';
import { cn, formatCurrency } from '../lib/utils';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ListOrdered, 
  LineChart, 
  ShieldAlert, 
  Settings 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'trades', label: 'Trades', icon: ListOrdered },
  { id: 'analytics', label: 'Analytics', icon: LineChart },
  { id: 'risk', label: 'Risk Manager', icon: ShieldAlert },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { settings, trades } = useAppContext();
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPnl = trades
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.pnl, 0);
  const progressPercent = Math.min(Math.max((monthlyPnl / settings.monthlyTarget) * 100, 0), 100);

  return (
    <aside className="w-64 flex flex-col h-full bg-[#f9f9f9]/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-[#e5e5e5] dark:border-slate-800 transition-colors duration-200">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-[#1a1a1a] dark:text-white">
          Profit Calendar Pro
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left font-medium",
                isActive 
                  ? "bg-white dark:bg-slate-800 shadow-sm border border-[#e5e5e5] dark:border-slate-700 text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e5e5e5] dark:border-slate-800 mt-auto space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1 tracking-wider">Monthly Goal</div>
          <div className="text-sm font-medium mb-2 text-slate-800 dark:text-slate-200">
            {formatCurrency(monthlyPnl, settings.currency)} / {formatCurrency(settings.monthlyTarget, settings.currency)}
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left font-medium",
            activeTab === 'settings'
              ? "bg-white dark:bg-slate-800 shadow-sm border border-[#e5e5e5] dark:border-slate-700 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </aside>
  );
}
