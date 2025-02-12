import create from 'zustand';
import { format } from 'date-fns';
import type { Trade, AIRecommendation } from '../types/wallet';

interface AppState {
  trades: Trade[];
  recommendations: AIRecommendation[];
  settings: {
    autoTrade: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    notifications: boolean;
  };
  addTrade: (trade: Trade) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  updateRecommendations: (recommendations: AIRecommendation[]) => void;
}

export const useStore = create<AppState>((set) => ({
  trades: [],
  recommendations: [],
  settings: {
    autoTrade: false,
    riskLevel: 'medium',
    notifications: true,
  },
  addTrade: (trade) =>
    set((state) => ({
      trades: [trade, ...state.trades],
    })),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  updateRecommendations: (recommendations) =>
    set(() => ({
      recommendations,
    })),
}));