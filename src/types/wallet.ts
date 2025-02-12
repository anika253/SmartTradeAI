export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
}

export interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: number;
  price: number;
  timestamp: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface AIRecommendation {
  type: 'BUY' | 'SELL';
  asset: string;
  confidence: number;
  price: number;
  reasoning: string;
}