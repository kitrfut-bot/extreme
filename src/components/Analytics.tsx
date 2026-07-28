import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../lib/utils';

export function Analytics() {
  const { trades, settings } = useAppContext();

  const chartData = useMemo(() => {
    // Sort trades chronologically
    const sortedTrades = [...trades].sort((a, b) => (a.date < b.date ? -1 : 1));
    
    let cumulativePnl = 0;
    
    // Group by date for daily PnL and Equity Curve
    const dailyData: Record<string, { date: string; displayDate: string; pnl: number; cumulative: number }> = {};

    sortedTrades.forEach(trade => {
      cumulativePnl += trade.pnl;
      
      if (!dailyData[trade.date]) {
        dailyData[trade.date] = {
          date: trade.date,
          displayDate: format(parseISO(trade.date), 'MMM d'),
          pnl: trade.pnl,
          cumulative: cumulativePnl
        };
      } else {
        dailyData[trade.date].pnl += trade.pnl;
        dailyData[trade.date].cumulative = cumulativePnl; // Update to latest cumulative for the day
      }
    });

    return Object.values(dailyData);
  }, [trades]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visualize your trading journey and equity curve.</p>
        </div>
      </header>

      {trades.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Not enough data to show analytics. Add some trades first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Equity Curve */}
          <div className="bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white mb-6">Equity Curve</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12}
                    tickFormatter={(val) => `${val}`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value, settings.currency), 'Net P&L']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily P&L Bar Chart */}
          <div className="bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white mb-6">Daily P&L</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12}
                    tickFormatter={(val) => `${val}`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    formatter={(value: number) => [formatCurrency(value, settings.currency), 'Daily P&L']}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 4, 4]}>
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
