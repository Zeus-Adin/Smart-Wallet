
export interface AccountBalance {
  asset: string;
  symbol: string;
  balance: string;
  usdValue: string;
  icon: string;
}

export class AccountBalanceService {
  async getAccountBalances(walletAddress: string): Promise<AccountBalance[]> {
    console.log('Fetching account balances for:', walletAddress);
    
    // Mock account balance data
    return [
      {
        asset: 'Stacks (STX)',
        symbol: 'STX',
        balance: '1,234.56',
        usdValue: '$2,469.12',
        icon: 'S'
      },
      {
        asset: 'Bitcoin (BTC)', 
        symbol: 'BTC',
        balance: '0.05',
        usdValue: '$3,250.00',
        icon: 'B'
      }
    ];
  }
}
