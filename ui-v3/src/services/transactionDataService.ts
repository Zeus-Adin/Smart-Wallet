
export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  asset: string;
  assetType: 'token' | 'nft';
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
}

export interface Recipient {
  address: string;
  lastSent: string;
  frequency: number;
}

export class TransactionDataService {
  async getRecentTransactions(walletAddress: string): Promise<Transaction[]> {
    console.log('Fetching recent transactions for:', walletAddress);
    
    // Mock data for recent transactions
    return [
      {
        id: '1',
        from: walletAddress,
        to: 'SP1ABC...XYZ123',
        amount: '100.50',
        asset: 'STX',
        assetType: 'token',
        timestamp: '2 days ago',
        status: 'confirmed',
        txHash: '0xabc123...'
      },
      {
        id: '2',
        from: walletAddress,
        to: 'SP2DEF...ABC456',
        amount: '1',
        asset: 'Cool NFT #123',
        assetType: 'nft',
        timestamp: '1 week ago',
        status: 'confirmed',
        txHash: '0xdef456...'
      }
    ];
  }

  async getRecentRecipients(walletAddress: string): Promise<Recipient[]> {
    console.log('Fetching recent recipients for:', walletAddress);
    
    // Mock data for recent recipients
    return [
      {
        address: 'SP1ABC...XYZ123',
        lastSent: '2 days ago',
        frequency: 5
      },
      {
        address: 'SP2DEF...ABC456',
        lastSent: '1 week ago',
        frequency: 2
      }
    ];
  }
}
