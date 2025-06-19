
export interface SmartWallet {
  id: string;
  name: string;
  contractId: string;
  balance: string;
  usdValue: string;
  extensions: string[];
  createdAt: string;
}

export interface WalletActivity {
  id: string;
  type: 'send' | 'receive' | 'stacking';
  asset: string;
  amount: string;
  timestamp: string;
  description: string;
}

export class SmartWalletContractService {
  async getSmartWallets(walletAddress: string): Promise<SmartWallet[]> {
    console.log('Fetching smart wallets for:', walletAddress);
    
    // Mock smart wallet data
    return [
      {
        id: "SP1ABC...XYZ123.smart-wallet-v1",
        name: "Personal Wallet",
        contractId: "SP1ABC...XYZ123.smart-wallet-v1",
        balance: "1,234.56 STX",
        usdValue: "$2,469.12",
        extensions: ["Multi-sig", "Time-lock"],
        createdAt: "2024-01-15"
      },
      {
        id: "SP2DEF...ABC456.smart-wallet-v2", 
        name: "Business Wallet",
        contractId: "SP2DEF...ABC456.smart-wallet-v2",
        balance: "5,678.90 STX",
        usdValue: "$11,357.80",
        extensions: ["Treasury", "Governance"],
        createdAt: "2024-02-20"
      }
    ];
  }

  async getWalletActivity(walletAddress: string): Promise<WalletActivity[]> {
    console.log('Fetching wallet activity for:', walletAddress);
    
    // Mock activity data
    return [
      {
        id: '1',
        type: 'send',
        asset: 'STX',
        amount: '-100',
        timestamp: '2 hours ago',
        description: 'Sent STX'
      },
      {
        id: '2', 
        type: 'receive',
        asset: 'STX',
        amount: '+500',
        timestamp: '1 day ago',
        description: 'Received STX'
      },
      {
        id: '3',
        type: 'stacking',
        asset: 'STX', 
        amount: '+25',
        timestamp: '3 days ago',
        description: 'Stacking Reward'
      }
    ];
  }
}
