
import { AccountBalance } from './accountBalanceService';

export class MockAccountBalanceService {
  async getAccountBalances(walletAddress: string): Promise<AccountBalance[]> {
    console.log('Mock: Fetching account balances for:', walletAddress);
    
    // Demo account balance data with higher amounts
    return [
      {
        asset: 'Stacks (STX)',
        symbol: 'STX', 
        balance: '10,000.00',
        usdValue: '$20,000.00',
        icon: 'S'
      },
      {
        asset: 'Bitcoin (BTC)',
        symbol: 'BTC',
        balance: '0.25',
        usdValue: '$16,250.00',
        icon: 'B'
      }
    ];
  }
}
