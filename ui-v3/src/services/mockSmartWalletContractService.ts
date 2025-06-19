
import { SmartWallet, WalletActivity } from './smartWalletContractService';

export class MockSmartWalletContractService {
  async getSmartWallets(walletAddress: string): Promise<SmartWallet[]> {
    console.log('Mock: Fetching smart wallets for:', walletAddress);
    
    // Demo smart wallet data
    return [
      {
        id: "demo-wallet-1",
        name: "Personal Smart Wallet",
        contractId: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.demo-smart-wallet",
        balance: "10,000.00 STX",
        usdValue: "$20,000.00",
        extensions: ["Multi-sig", "Time-lock", "Treasury"],
        createdAt: "2024-06-19"
      },
      {
        id: "demo-wallet-2",
        name: "Business Smart Wallet", 
        contractId: "SP3ABC...DEMO456.business-smart-wallet",
        balance: "25,500.50 STX",
        usdValue: "$51,001.00",
        extensions: ["Multi-sig", "Governance", "Stacking"],
        createdAt: "2024-05-15"
      }
    ];
  }

  async getWalletActivity(walletAddress: string): Promise<WalletActivity[]> {
    console.log('Mock: Fetching wallet activity for:', walletAddress);
    
    // Demo activity data with higher amounts
    return [
      {
        id: 'demo-1',
        type: 'send',
        asset: 'STX',
        amount: '-500',
        timestamp: 'Demo transaction',
        description: 'Sent STX'
      },
      {
        id: 'demo-2',
        type: 'receive', 
        asset: 'STX',
        amount: '+2,000',
        timestamp: 'Demo transaction',
        description: 'Received STX'
      },
      {
        id: 'demo-3',
        type: 'stacking',
        asset: 'STX',
        amount: '+150', 
        timestamp: 'Demo transaction',
        description: 'Stacking Reward'
      }
    ];
  }
}
