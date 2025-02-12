import { useState, useCallback } from 'react';
import { SeiNetworkService } from '../services/seiNetwork';
import { AIAnalysisService } from '../services/aiAnalysis';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

const seiService = new SeiNetworkService();
const aiService = new AIAnalysisService();

export function useTrading() {
  const [isLoading, setIsLoading] = useState(false);
  const { settings, addTrade } = useStore();
  
  const executeTrade = useCallback(async (
    type: 'BUY' | 'SELL',
    asset: string,
    amount: number,
    price: number
  ) => {
    setIsLoading(true);
    try {
      // Execute trade on Sei Network
      const result = await seiService.executeTrade({
        type,
        asset,
        amount,
        price,
      });

      // Add trade to history
      addTrade({
        id: result.transactionHash,
        type,
        asset,
        amount,
        price,
        timestamp: Date.now(),
        status: 'COMPLETED',
      });

      toast.success(`${type} order executed successfully`);
    } catch (error) {
      console.error('Trade execution failed:', error);
      toast.error('Failed to execute trade');
    } finally {
      setIsLoading(false);
    }
  }, [addTrade]);

  const analyzeMarket = useCallback(async (asset: string) => {
    try {
      // Get AI trading signal
      const signal = await aiService.generateTradingSignal(asset);
      
      // If auto-trade is enabled and confidence is high, execute trade
      if (settings.autoTrade && signal.confidence > 80) {
        const marketData = await seiService.getMarketData(asset);
        
        if (signal.type !== 'HOLD') {
          await executeTrade(
            signal.type,
            asset,
            1, // Default amount, should be configurable
            marketData.price
          );
        }
      }

      return signal;
    } catch (error) {
      console.error('Market analysis failed:', error);
      toast.error('Failed to analyze market');
      throw error;
    }
  }, [settings.autoTrade, executeTrade]);

  return {
    executeTrade,
    analyzeMarket,
    isLoading,
  };
}