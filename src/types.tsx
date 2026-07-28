export type Position = 'Long' | 'Short';
export type TradeStatus = 'Win' | 'Loss' | 'Breakeven';

export interface Trade {
  id: string;
  date: string; // YYYY-MM-DD format
  symbol: string;
  position: Position;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss: number;
  target: number;
  fees: number;
  pnl: number;
  notes: string;
}

export interface Settings {
  currency: string;
  theme: 'light' | 'dark';
  dailyLossLimit: number;
  monthlyTarget: number;
}

export interface AppState {
  trades: Trade[];
  settings: Settings;
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}
