import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { WalletState } from '../types/wallet';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: null,
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialState);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);
      
      setWalletState({
        isConnected: true,
        address: accounts[0],
        chainId: network.chainId.toString(),
        balance: ethers.formatEther(balance),
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState(initialState);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [disconnectWallet]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
}