import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export function WalletConnect() {
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="px-4 py-2 bg-gray-800 rounded-lg">
          <span className="text-sm text-gray-300">
            {balance ? `${Number(balance).toFixed(4)} ETH` : '0 ETH'}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </button>
  );
}