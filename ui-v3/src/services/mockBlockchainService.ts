
export interface TransactionParams {
  from: string;
  to: string;
  amount: string;
  asset: string;
  assetType: 'token' | 'nft';
  tokenId?: string;
  contractAddress?: string;
}

export class MockBlockchainService {
  async sendTransaction(params: TransactionParams): Promise<{ txHash: string; status: string }> {
    console.log('Mock: Sending transaction with params:', params);
    
    // Simulate blockchain interaction with demo data
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `0xdemo${Math.random().toString(16).substr(2, 60)}`;
        resolve({
          txHash,
          status: 'pending'
        });
      }, 1500);
    });
  }

  async getTransactionStatus(txHash: string): Promise<string> {
    console.log('Mock: Checking transaction status for:', txHash);
    
    // Always return confirmed for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('confirmed');
      }, 500);
    });
  }
}

// Re-export types for backward compatibility
export type { Transaction, Recipient } from './transactionDataService';
