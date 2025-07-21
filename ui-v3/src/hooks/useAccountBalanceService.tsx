import { useEffect, useState } from "react";
import { AccountBalanceService, FungibleType, NftResponseBalance, FtResponseBalance } from "@/services/accountBalanceService";
import { NFTBalanceResponse } from "@/components/send/NFTSelectionStep";
import { TokenBalanceInfo } from "@/components/send/TokenSelectionStep";
import { toast } from "./use-toast";

export function useAccountBalanceService(walletAddress: string) {
  const [stxBalance, setStxBalance] = useState<FungibleType>(null);
  const [sBtcBalance, setSBtcBalance] = useState<FungibleType>(null);
  const [nftBalance, setNftBalance] = useState<NftResponseBalance[]>(null);
  const [ftBalance, setFtBalance] = useState<FtResponseBalance[]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletAddress) return;
    const balancesService = new AccountBalanceService();
    setLoading(true);
    setError(null);

    balancesService.getAccountBalances(walletAddress)
      .then((result) => {
        setStxBalance(result.stx);
        setSBtcBalance(result.sbtc);
        setNftBalance(result.nft);
        setFtBalance(result.ft);
      })
      .catch((e) => {
        toast({ title: "Error", description: e.message, });
      })
      .finally(() => setLoading(false));
  }, [walletAddress]);

  console.log({ walletAddress, loading, error })

  return { stxBalance, sBtcBalance, nftBalance, ftBalance, loading, error };
}