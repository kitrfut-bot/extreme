import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatPercentage, cn } from '../lib/utils';
import { isToday, isThisMonth, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Target, Activity, DollarSign, Percent } from 'lucide-react';

export function Dashboard() {
  const { trades, settings } = useAppContext();

  const stats = useMemo(() => {
    let todayPnl = 0;
    let monthlyPnl = 0;
    let netPnl = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let totalWinAmount = 0;
    let totalLossAmount = 0;

    trades.forEach((trade) => {
      const date = parseISO(trade.date);
      netPnl += trade.pnl;

      if (isToday(date)) {
        todayPnl += trade.pnl;
      }
      if (isThisMonth(date)) {
        monthlyPnl += trade.pnl;
      }

      if (trade.pnl > 0) {
        winningTrades++;
        totalWinAmount += trade.pnl;
      } else if (trade.pnl < 0) {
        losingTrades++;
        totalLossAmount += Math.abs(trade.pnl);
      }
    });

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
    const avgWin = winningTrades > 0 ? totalWinAmount / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? totalLossAmount / losingTrades : 0;
    
    // Risk/Reward ratio estimate based on averages
    const rrRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

    return {
      todayPnl,
      monthlyPnl,
      netPnl,
      winRate,
      avgWin,
      avgLoss,
      rrRatio,
      totalTrades,
      winningTrades,
      losingTrades
    };
  }, [trades]);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white dark:border-slate-700 p-4 rounded-xl shadow-sm">
      <div className="text-xs text-gray-500 font-medium uppercase">{title}</div>
      <div className={cn(
        "text-xl font-bold mt-1",
        trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
        trend === 'down' ? 'text-rose-600 dark:text-rose-400' :
        'text-[#1a1a1a] dark:text-white'
      )}>
        {value}
      </div>
      <div className="text-[10px] text-gray-400 font-medium mt-1">{subtitle}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Performance Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back. Here is your trading performance overview.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's P&L"
          value={formatCurrency(stats.todayPnl, settings.currency)}
          subtitle={stats.todayPnl >= 0 ? 'Profitable today' : 'Loss today'}
          icon={DollarSign}
          trend={stats.todayPnl > 0 ? 'up' : stats.todayPnl < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Monthly P&L"
          value={formatCurrency(stats.monthlyPnl, settings.currency)}
          subtitle={`Target: ${formatCurrency(settings.monthlyTarget, settings.currency)}`}
          icon={TrendingUp}
          trend={stats.monthlyPnl > 0 ? 'up' : stats.monthlyPnl < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(stats.netPnl, settings.currency)}
          subtitle="All-time profit"
          icon={Activity}
          trend={stats.netPnl > 0 ? 'up' : stats.netPnl < 0 ? 'down' : 'neutral'}
        />
        <StatCard
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          subtitle={`${stats.winningTrades}W - ${stats.losingTrades}L out of ${stats.totalTrades} trades`}
          icon={Target}
          trend={stats.winRate >= 0.5 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white dark:border-slate-700 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase">Average Win</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.avgWin, settings.currency)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase">Average Loss</p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(stats.avgLoss, settings.currency)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase">Risk/Reward Ratio</p>
              <p className="text-xl font-bold text-[#1a1a1a] dark:text-white">
                1 : {stats.rrRatio.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase">Total Trades</p>
              <p className="text-xl font-bold text-[#1a1a1a] dark:text-white">{stats.totalTrades}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white dark:border-slate-700 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-4 flex items-center justify-center rounded-full border-8 border-gray-100 dark:border-slate-700">
            {/* Simple circular progress visualization could go here, using a static styling for now */}
            <div 
              className="absolute inset-0 rounded-full border-8 border-blue-600"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${stats.winRate * 100}%, 0 ${stats.winRate * 100}%)`,
                transform: 'rotate(-90deg)'
              }}
            ></div>
            <div className="z-10 bg-white dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{Math.round(stats.winRate * 100)}%</span>
            </div>
          </div>
          <h4 className="font-bold text-[#1a1a1a] dark:text-white">Win Rate</h4>
          <p className="text-[10px] text-gray-400 font-medium mt-1">Keep it above 50% for consistency.</p>
        </div>
      </div>
    </div>
  );
}
