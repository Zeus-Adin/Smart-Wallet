
import { useState, useEffect, useCallback } from 'react';
import { priceService, TokenPrice } from '@/services/priceService';

export const usePriceService = () => {
  const [prices, setPrices] = useState<{ [symbol: string]: TokenPrice }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async (symbols: string[]) => {
    if (symbols.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedPrices = await priceService.getMultipleTokenPrices(symbols);
      setPrices(prev => ({ ...prev, ...fetchedPrices }));
    } catch (err) {
      setError('Failed to fetch token prices');
      console.error('Price fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTokenPrice = useCallback((symbol: string): TokenPrice | null => {
    return prices[symbol.toLowerCase()] || null;
  }, [prices]);

  const calculateUsdValue = useCallback((amount: string, symbol: string): string => {
    const tokenPrice = getTokenPrice(symbol);
    if (!tokenPrice) return '$0.00';
    
    return priceService.calculateUsdValue(amount, tokenPrice.price);
  }, [getTokenPrice]);

  return {
    prices,
    isLoading,
    error,
    fetchPrices,
    getTokenPrice,
    calculateUsdValue
  };
};
