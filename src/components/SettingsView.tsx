import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, Save } from 'lucide-react';

export function SettingsView() {
  const { settings, updateSettings } = useAppContext();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ currency: e.target.value });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
  };

  const handleLimitsChange = (field: 'dailyLossLimit' | 'monthlyTarget', value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      updateSettings({ [field]: parsed });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your application preferences.</p>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800 border border-[#e5e5e5] dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-8">
        
        {/* Theme Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white">Appearance</h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                settings.theme === 'light' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              <Sun className="w-5 h-5" />
              Light Mode
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                settings.theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              <Moon className="w-5 h-5" />
              Dark Mode
            </button>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700/50" />

        {/* Currency Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white">Currency & Localization</h3>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Currency</label>
            <select
              value={settings.currency}
              onChange={handleCurrencyChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700/50" />

        {/* Limits & Targets */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-white">Trading Goals & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Daily Loss Limit</label>
              <input
                type="number"
                value={settings.dailyLossLimit}
                onChange={(e) => handleLimitsChange('dailyLossLimit', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-slate-500">Warning threshold for daily losses.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Profit Target</label>
              <input
                type="number"
                value={settings.monthlyTarget}
                onChange={(e) => handleLimitsChange('monthlyTarget', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-slate-500">Your monthly performance goal.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
