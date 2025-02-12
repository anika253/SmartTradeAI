import React, { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { TradingView } from './components/TradingView';
import { TransactionHistory } from './components/TransactionHistory';
import { Settings } from './components/Settings';
import { BarChart3, Settings as SettingsIcon, History } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'trading' | 'history' | 'settings'>('trading');

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <TransactionHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <TradingView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">AI TradeFlow</h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('trading')}
                  className={`flex items-center px-4 py-2 w-full text-left rounded-lg ${
                    activeTab === 'trading'
                      ? 'text-gray-700 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Trading Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center px-4 py-2 w-full text-left rounded-lg ${
                    activeTab === 'history'
                      ? 'text-gray-700 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <History className="w-5 h-5 mr-3" />
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center px-4 py-2 w-full text-left rounded-lg ${
                    activeTab === 'settings'
                      ? 'text-gray-700 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SettingsIcon className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;