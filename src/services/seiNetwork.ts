import { SeiWallet } from '@sei-js/core';
import { z } from 'zod';
import axios from 'axios';

const SEI_RPC_URL = 'https://sei-testnet-rpc.polkachu.com';
const SEI_REST_URL = 'https://sei-testnet-rest.polkachu.com';

// Validation schemas
const TradeSchema = z.object({
  price: z.number().positive(),
  amount: z.number().positive(),
  type: z.enum(['BUY', 'SELL']),
  asset: z.string(),
});

export class SeiNetworkService {
  private wallet: SeiWallet | null = null;
  
  async connect(): Promise<void> {
    try {
      this.wallet = await SeiWallet.connect();
    } catch (error) {
      console.error('Failed to connect to Sei wallet:', error);
      throw new Error('Failed to connect to Sei wallet');
    }
  }

  async getBalance(): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    try {
      const balance = await this.wallet.getBalance();
      return balance.toString();
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async executeTrade(tradeParams: z.infer<typeof TradeSchema>) {
    // Validate trade parameters
    const validatedTrade = TradeSchema.parse(tradeParams);
    
    if (!this.wallet) throw new Error('Wallet not connected');

    try {
      // Create and sign the trade transaction
      const msg = {
        typeUrl: '/sei.dex.v1beta1.MsgPlaceOrders',
        value: {
          creator: await this.wallet.getAddress(),
          orders: [{
            price: validatedTrade.price.toString(),
            quantity: validatedTrade.amount.toString(),
            type: validatedTrade.type === 'BUY' ? 1 : 2,
            asset: validatedTrade.asset,
          }],
        },
      };

      const response = await this.wallet.signAndBroadcast([msg]);
      return response;
    } catch (error) {
      console.error('Failed to execute trade:', error);
      throw error;
    }
  }

  async getMarketData(asset: string) {
    try {
      const response = await axios.get(`${SEI_REST_URL}/sei-protocol/seichain/dex/get_price/${asset}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      throw error;
    }
  }

  async getOrderbook(asset: string) {
    try {
      const response = await axios.get(`${SEI_REST_URL}/sei-protocol/seichain/dex/get_orderbook/${asset}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orderbook:', error);
      throw error;
    }
  }
}