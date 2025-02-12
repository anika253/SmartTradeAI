import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function TransactionHistory() {
  const trades = useStore((state) => state.trades);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {trade.type === 'BUY' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                      {trade.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{trade.asset}</td>
                <td className="px-6 py-4">{trade.amount}</td>
                <td className="px-6 py-4">${trade.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    trade.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : trade.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(trade.timestamp, 'MMM d, yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}