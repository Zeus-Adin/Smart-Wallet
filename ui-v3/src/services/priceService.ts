
export interface TokenPrice {
  symbol: string;
  price: number;
  priceChange24h?: number;
}

export interface PriceResponse {
  [symbol: string]: TokenPrice;
}

export class PriceService {
  private cache: Map<string, { price: TokenPrice; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getTokenPrice(symbol: string): Promise<TokenPrice> {
    const cacheKey = symbol.toLowerCase();
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.price;
    }

    try {
      // For demo purposes, using mock data. In production, you'd use a real API like CoinGecko
      const mockPrices: { [key: string]: TokenPrice } = {
        stx: { symbol: 'STX', price: 2.15, priceChange24h: 3.2 },
        btc: { symbol: 'BTC', price: 65000, priceChange24h: -1.5 },
        usdc: { symbol: 'USDC', price: 1.0, priceChange24h: 0.1 },
        usdt: { symbol: 'USDT', price: 1.0, priceChange24h: 0.0 }
      };

      const price = mockPrices[symbol.toLowerCase()] || { symbol: symbol.toUpperCase(), price: 0, priceChange24h: 0 };
      
      this.cache.set(cacheKey, { price, timestamp: Date.now() });
      console.log(`Fetched price for ${symbol}:`, price);
      
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return { symbol: symbol.toUpperCase(), price: 0, priceChange24h: 0 };
    }
  }

  async getMultipleTokenPrices(symbols: string[]): Promise<PriceResponse> {
    const prices: PriceResponse = {};
    
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const price = await this.getTokenPrice(symbol);
          prices[symbol.toLowerCase()] = price;
        } catch (error) {
          console.error(`Failed to fetch price for ${symbol}:`, error);
          prices[symbol.toLowerCase()] = { symbol: symbol.toUpperCase(), price: 0 };
        }
      })
    );

    return prices;
  }

  calculateUsdValue(amount: string, tokenPrice: number): string {
    try {
      // Remove commas and parse the amount
      const numericAmount = parseFloat(amount.replace(/,/g, ''));
      const usdValue = numericAmount * tokenPrice;
      return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return '$0.00';
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const priceService = new PriceService();
