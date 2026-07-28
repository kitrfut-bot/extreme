/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { TradeList } from './components/TradeList';
import { Analytics } from './components/Analytics';
import { RiskManager } from './components/RiskManager';
import { SettingsView } from './components/SettingsView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen w-full bg-[#f3f3f3] dark:bg-slate-950 text-[#1a1a1a] dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'trades' && <TradeList />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'risk' && <RiskManager />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
