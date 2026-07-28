import React, { useState } from 'react';
import { ShieldAlert, Calculator, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../lib/utils';

export function RiskManager() {
  const { settings } = useAppContext();
  
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  // Calculations
  const riskAmount = (parseFloat(accountSize) || 0) * ((parseFloat(riskPercent) || 0) / 100);
  
  let positionSize = 0;
  let shares = 0;
  if (entryPrice && stopLoss) {
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const riskPerShare = Math.abs(entry - sl);
    
    if (riskPerShare > 0) {
      shares = riskAmount / riskPerShare;
      positionSize = shares * entry;
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Risk Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Calculate position sizing and manage daily limits.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Size Calculator */}
        <div className="bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Position Size Calculator</h3>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Size</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{settings.currency === 'USD' ? '$' : settings.currency}</span>
                  <input
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Risk % per Trade</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stop Loss Price</label>
                <input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-6 p-5 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-[#e5e5e5] dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Risk Amount:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(riskAmount, settings.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Recommended Shares/Qty:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{shares > 0 ? shares.toFixed(4) : '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Position Value:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(positionSize, settings.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Limits */}
        <div className="bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Daily Loss Limit</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Your currently configured max daily loss limit is <strong className="text-red-500">{formatCurrency(settings.dailyLossLimit, settings.currency)}</strong>. 
              Once hit, you should stop trading for the day to prevent tilt.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Target</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Your configured monthly profit target is <strong className="text-green-500">{formatCurrency(settings.monthlyTarget, settings.currency)}</strong>.
            </p>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-center text-slate-500">
            You can modify these limits in the Settings panel.
          </div>
        </div>
      </div>
    </div>
  );
}
