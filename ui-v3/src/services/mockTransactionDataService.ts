
import { Transaction, Recipient } from './transactionDataService';

export class MockTransactionDataService {
  async getRecentTransactions(walletAddress: string): Promise<Transaction[]> {
    console.log('Mock: Fetching recent transactions for:', walletAddress);
    
    // Rich demo data for transactions
    return [
      {
        id: 'demo-1',
        type: 'send',
        from: walletAddress,
        to: 'SP1ABC...DEMO123',
        amount: '500.00',
        asset: 'STX',
        assetType: 'token',
        timestamp: '1 hour ago',
        status: 'confirmed',
        txHash: '0xdemo123abc...'
      },
      {
        id: 'demo-2',
        type: 'receive',
        from: 'SP2DEF...DEMO456',
        to: walletAddress,
        amount: '1,250.75',
        asset: 'STX',
        assetType: 'token',
        timestamp: '6 hours ago',
        status: 'confirmed',
        txHash: '0xdemo456def...'
      },
      {
        id: 'demo-3',
        type: 'send',
        from: walletAddress,
        to: 'SP3GHI...DEMO789',
        amount: '1',
        asset: 'Demo NFT Collection #42',
        assetType: 'nft',
        timestamp: '2 days ago',
        status: 'confirmed',
        txHash: '0xdemo789ghi...'
      },
      {
        id: 'demo-4',
        type: 'send',
        from: walletAddress,
        to: 'SP4JKL...DEMO000',
        amount: '100.00',
        asset: 'STX',
        assetType: 'token',
        timestamp: '1 week ago',
        status: 'confirmed',
        txHash: '0xdemo000jkl...'
      }
    ];
  }

  async getRecentRecipients(walletAddress: string): Promise<Recipient[]> {
    console.log('Mock: Fetching recent recipients for:', walletAddress);
    
    // Demo recipients data
    return [
      {
        address: 'SP1ABC...DEMO123',
        lastSent: '1 hour ago',
        frequency: 12
      },
      {
        address: 'SP2DEF...DEMO456',
        lastSent: '2 days ago',
        frequency: 8
      },
      {
        address: 'SP3GHI...DEMO789',
        lastSent: '1 week ago',
        frequency: 3
      },
      {
        address: 'SP4JKL...DEMO000',
        lastSent: '2 weeks ago',
        frequency: 1
      }
    ];
  }
}
