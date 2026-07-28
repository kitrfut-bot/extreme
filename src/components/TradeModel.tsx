import React, { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Trade, Position } from '../types';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

export function TradeModal({ isOpen, onClose, date }: TradeModalProps) {
  const { addTrade, settings } = useAppContext();
  
  const [symbol, setSymbol] = useState('');
  const [position, setPosition] = useState<Position>('Long');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  const [fees, setFees] = useState('');
  const [notes, setNotes] = useState('');

  // Auto calculate PnL based on position, entry, exit, qty, fees
  const calculatePnl = () => {
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const qty = parseFloat(quantity) || 0;
    const f = parseFloat(fees) || 0;
    
    if (!entry || !exit || !qty) return 0;
    
    let grossPnl = 0;
    if (position === 'Long') {
      grossPnl = (exit - entry) * qty;
    } else {
      grossPnl = (entry - exit) * qty;
    }
    
    return grossPnl - f;
  };

  const pnl = calculatePnl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !entryPrice || !exitPrice || !quantity) return;

    addTrade({
      date: format(date, 'yyyy-MM-dd'),
      symbol: symbol.toUpperCase(),
      position,
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      quantity: parseFloat(quantity),
      stopLoss: parseFloat(stopLoss) || 0,
      target: parseFloat(target) || 0,
      fees: parseFloat(fees) || 0,
      pnl,
      notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-[#e5e5e5] dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#f0f0f0] dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white">Add Trade</h3>
            <p className="text-sm text-gray-500">{format(date, 'MMMM d, yyyy')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Symbol / Asset</label>
              <input
                required
                type="text"
                placeholder="e.g. AAPL, BTC/USD"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e5e5] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Position</label>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPosition('Long')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${position === 'Long' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('Short')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${position === 'Short' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Short
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Entry Price</label>
              <input
                required
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Exit Price</label>
              <input
                required
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input
                required
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fees / Commissions</label>
              <input
                type="number"
                step="any"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stop Loss (Optional)</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target (Optional)</label>
              <input
                type="number"
                step="any"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes & Setup</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What was your reasoning for this trade?"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between border border-[#e5e5e5] dark:border-slate-700">
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Calculated P&L</span>
            <span className={`text-2xl font-bold ${pnl > 0 ? 'text-emerald-600 dark:text-emerald-400' : pnl < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-[#1a1a1a] dark:text-white'}`}>
              {pnl > 0 ? '+' : ''}{pnl.toFixed(2)} {settings.currency}
            </span>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-[#e5e5e5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              Save Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
