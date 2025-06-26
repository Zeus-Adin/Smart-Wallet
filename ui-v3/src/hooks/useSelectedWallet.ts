
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWalletConnection } from "./useWalletConnection";
import { useBlockchainService } from "./useBlockchainService";

interface SelectedWallet {
  id: string;
  name: string;
  contractId: string;
  balance: string;
  usdValue: string;
  address: string;
  extensions?: string[];
  isImported?: boolean;
}

export const useSelectedWallet = () => {
  const { walletData } = useWalletConnection();
  const { loadSmartWallets } = useBlockchainService();
  const [selectedWallet, setSelectedWallet] = useState<SelectedWallet | null>(null);
  const { walletId } = useParams<{ walletId: `${string}.${string}` }>()

  useEffect(() => {

    const isImportedWallet = walletId?.includes('.') && walletId?.length > 20;

    const wallet: SelectedWallet = {
      id: walletId || "default-wallet",
      name: isImportedWallet ? "Imported Smart Wallet" : "Personal Wallet",
      contractId: walletId || "SP1ABC...XYZ123.smart-wallet-v1",
      balance: isImportedWallet ? "0.00 STX" : "1,234.56 STX",
      usdValue: isImportedWallet ? "$0.00" : "$2,469.12",
      address: walletData?.addresses?.stx?.[0]?.address || walletId || "SP1ABC...XYZ123",
      extensions: isImportedWallet ? ["Multi-sig"] : ["Multi-sig", "Time-lock"],
      isImported: isImportedWallet
    };

    setSelectedWallet(wallet);
  }, [walletId, walletData]);

  const switchWallet = (walletId: string) => {
    // This would typically navigate to the new wallet or update the selected wallet
    console.log(`Switching to wallet: ${walletId}`);
  };

  return {
    selectedWallet,
    switchWallet,
    isLoading: !selectedWallet
  };
};
