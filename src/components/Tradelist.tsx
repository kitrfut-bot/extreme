import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, ArrowUpDown, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { Trade } from '../types';

export function TradeList() {
  const { trades, deleteTrade, settings } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Trade>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredAndSortedTrades = trades
    .filter(t => 
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Trade History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review and analyze your past trades.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search symbol or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full md:w-64 rounded-lg border border-[#e5e5e5] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0f0f0] dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/20">
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <button onClick={() => handleSort('symbol')} className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300">
                    Asset <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Qty</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Entry</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Exit</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                  <button onClick={() => handleSort('pnl')} className="flex items-center gap-1 justify-end w-full hover:text-gray-600 dark:hover:text-gray-300">
                    P&L <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No trades found. Start by adding some trades to your calendar.
                  </td>
                </tr>
              ) : (
                filteredAndSortedTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-[#f0f0f0] dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {format(parseISO(trade.date), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#1a1a1a] dark:text-white">
                      {trade.symbol}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        trade.position === 'Long' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                      )}>
                        {trade.position}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">{trade.quantity}</td>
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">{trade.entryPrice}</td>
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">{trade.exitPrice}</td>
                    <td className={cn(
                      "p-4 text-sm font-bold text-right",
                      trade.pnl > 0 ? "text-emerald-600 dark:text-emerald-400" : trade.pnl < 0 ? "text-rose-600 dark:text-rose-400" : "text-gray-500"
                    )}>
                      {trade.pnl > 0 ? '+' : ''}{formatCurrency(trade.pnl, settings.currency)}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteTrade(trade.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete Trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
