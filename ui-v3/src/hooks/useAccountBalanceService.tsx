import { useEffect, useState } from "react";
import { AccountBalanceService, StxBalance } from "@/services/accountBalanceService";
import { NFTBalanceResponse } from "@/components/send/NFTSelectionStep";
import { TokenBalanceInfo } from "@/components/send/TokenSelectionStep";

export function useAccountBalanceService(walletAddress: string) {
  const [stxBalance, setStxBalance] = useState<StxBalance>(null);
  const [nftBalance, setNftBalance] = useState<NFTBalanceResponse[]>(null);
  const [ftBalance, setFtBalance] = useState<TokenBalanceInfo[]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletAddress) return;
    const balancesService = new AccountBalanceService();
    setLoading(true);
    setError(null);

    // Fetch balances in parallel
    Promise.all([
      balancesService.getStxBalance(walletAddress, 0),
      balancesService.getNftBalance(walletAddress, "", 0),
      balancesService.getFtBalance(walletAddress, 0),
    ])
      .then(([stx, nft, ft]) => {
        setStxBalance(stx);
        setNftBalance(nft);
        setFtBalance(ft);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [walletAddress]);

  return { stxBalance, nftBalance, ftBalance, loading, error };
}