import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Settings, Trade } from '../types';

const defaultSettings: Settings = {
  currency: 'USD',
  theme: 'light',
  dailyLossLimit: 500,
  monthlyTarget: 5000,
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('profit_calendar_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('profit_calendar_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('profit_calendar_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('profit_calendar_settings', JSON.stringify(settings));
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade = { ...trade, id: uuidv4() };
    setTrades((prev) => [...prev, newTrade]);
  };

  const updateTrade = (updatedTrade: Trade) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === updatedTrade.id ? updatedTrade : t))
    );
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        trades,
        settings,
        addTrade,
        updateTrade,
        deleteTrade,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
