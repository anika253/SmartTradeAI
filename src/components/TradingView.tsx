import React, { useEffect, useState } from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight, Loader } from 'lucide-react';
import { Chart } from './Chart';
import { useStore } from '../store/useStore';
import { useTrading } from '../hooks/useTrading';
import type { AIRecommendation } from '../types/wallet';
import { toast } from 'react-hot-toast';

export function TradingView() {
  const { recommendations, updateRecommendations } = useStore();
  const { analyzeMarket, executeTrade, isLoading } = useTrading();
  const [selectedAsset, setSelectedAsset] = useState('SEI/USDT');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Analyze market and update recommendations
        const signal = await analyzeMarket(selectedAsset);
        updateRecommendations([{
          type: signal.type === 'HOLD' ? 'BUY' : signal.type,
          asset: selectedAsset,
          confidence: signal.confidence,
          price: 0, // Will be updated with real market data
          reasoning: signal.reasoning,
        }]);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
        toast.error('Failed to update market analysis');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [selectedAsset, analyzeMarket, updateRecommendations]);

  const handleTrade = async (type: 'BUY' | 'SELL', asset: string, price: number) => {
    try {
      await executeTrade(type, asset, 1, price);
      toast.success(`${type} order placed successfully`);
    } catch (error) {
      console.error('Trade failed:', error);
      toast.error('Failed to execute trade');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Market Analysis</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="SEI/USDT">SEI/USDT</option>
              <option value="ATOM/USDT">ATOM/USDT</option>
            </select>
            <LineChart className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <Chart data={chartData} />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">AI Recommendations</h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {rec.type === 'BUY' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className="font-semibold">{rec.asset}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    rec.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {rec.type}
                  </span>
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <button
                      onClick={() => handleTrade(rec.type, rec.asset, rec.price)}
                      className={`px-4 py-1 rounded-lg text-white text-sm ${
                        rec.type === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Execute {rec.type}
                    </button>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Confidence: {rec.confidence}% | Price: ${rec.price.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">{rec.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}