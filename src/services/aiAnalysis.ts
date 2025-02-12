import axios from 'axios';
import { z } from 'zod';

// Validation schemas
const MarketDataSchema = z.object({
  price: z.number(),
  volume: z.number(),
  timestamp: z.number(),
});

const TechnicalIndicatorsSchema = z.object({
  rsi: z.number(),
  macd: z.object({
    value: z.number(),
    signal: z.number(),
    histogram: z.number(),
  }),
  movingAverages: z.object({
    sma20: z.number(),
    sma50: z.number(),
    sma200: z.number(),
  }),
});

export class AIAnalysisService {
  private async calculateTechnicalIndicators(prices: number[]): Promise<z.infer<typeof TechnicalIndicatorsSchema>> {
    // Calculate RSI
    const rsi = this.calculateRSI(prices);
    
    // Calculate MACD
    const macd = this.calculateMACD(prices);
    
    // Calculate Moving Averages
    const movingAverages = {
      sma20: this.calculateSMA(prices, 20),
      sma50: this.calculateSMA(prices, 50),
      sma200: this.calculateSMA(prices, 200),
    };

    return { rsi, macd, movingAverages };
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    // RSI calculation logic
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period + 1; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    
    return {
      value: macdLine,
      signal: signalLine,
      histogram: macdLine - signalLine,
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
  }

  async generateTradingSignal(asset: string): Promise<{
    type: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
  }> {
    try {
      // Fetch historical data
      const marketData = await this.getHistoricalData(asset);
      const prices = marketData.map(d => d.price);
      
      // Calculate technical indicators
      const indicators = await this.calculateTechnicalIndicators(prices);
      
      // AI decision making
      const signal = this.analyzeIndicators(indicators);
      
      return signal;
    } catch (error) {
      console.error('Failed to generate trading signal:', error);
      throw error;
    }
  }

  private async getHistoricalData(asset: string): Promise<z.infer<typeof MarketDataSchema>[]> {
    try {
      const response = await axios.get(`/api/historical-data/${asset}`);
      return MarketDataSchema.array().parse(response.data);
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      throw error;
    }
  }

  private analyzeIndicators(indicators: z.infer<typeof TechnicalIndicatorsSchema>): {
    type: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
  } {
    let buySignals = 0;
    let sellSignals = 0;
    const reasons: string[] = [];

    // RSI Analysis
    if (indicators.rsi < 30) {
      buySignals += 2;
      reasons.push('RSI indicates oversold conditions');
    } else if (indicators.rsi > 70) {
      sellSignals += 2;
      reasons.push('RSI indicates overbought conditions');
    }

    // MACD Analysis
    if (indicators.macd.histogram > 0 && indicators.macd.value > indicators.macd.signal) {
      buySignals += 1;
      reasons.push('MACD shows bullish momentum');
    } else if (indicators.macd.histogram < 0 && indicators.macd.value < indicators.macd.signal) {
      sellSignals += 1;
      reasons.push('MACD shows bearish momentum');
    }

    // Moving Averages Analysis
    if (indicators.movingAverages.sma20 > indicators.movingAverages.sma50) {
      buySignals += 1;
      reasons.push('Short-term MA above mid-term MA');
    } else {
      sellSignals += 1;
      reasons.push('Short-term MA below mid-term MA');
    }

    // Calculate confidence and determine signal type
    const totalSignals = buySignals + sellSignals;
    const confidence = Math.round((Math.max(buySignals, sellSignals) / totalSignals) * 100);

    if (buySignals > sellSignals) {
      return {
        type: 'BUY',
        confidence,
        reasoning: reasons.join('. '),
      };
    } else if (sellSignals > buySignals) {
      return {
        type: 'SELL',
        confidence,
        reasoning: reasons.join('. '),
      };
    }

    return {
      type: 'HOLD',
      confidence,
      reasoning: 'Technical indicators show mixed signals',
    };
  }
}