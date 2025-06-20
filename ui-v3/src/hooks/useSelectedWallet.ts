
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { useSelectedWalletContext } from "@/contexts/SelectedWalletContext";

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
  const { walletId } = useParams();
  const { isDemoMode, walletData } = useWalletConnection();
  const { selectedWallet, setSelectedWallet, switchWallet, isLoading: contextLoading } = useSelectedWalletContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWallet = () => {
      // Handle special "demo" wallet ID
      if (walletId === "demo" || isDemoMode) {
        const demoWallet: SelectedWallet = {
          id: "demo",
          name: "Demo Smart Wallet",
          contractId: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.demo-smart-wallet",
          balance: "10,000.00 STX",
          usdValue: "$20,000.00",
          address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
          extensions: ["Multi-sig", "Time-lock", "Treasury", "Stacking"]
        };
        setSelectedWallet(demoWallet);
      } else if (walletId) {
        // Check if this is an imported wallet by looking for imported wallet indicators
        const isImportedWallet = walletId.includes('.') && walletId.length > 20;
        
        const wallet: SelectedWallet = {
          id: walletId,
          name: isImportedWallet ? "Imported Smart Wallet" : "Personal Wallet",
          contractId: walletId,
          balance: isImportedWallet ? "0.00 STX" : "1,234.56 STX",
          usdValue: isImportedWallet ? "$0.00" : "$2,469.12",
          address: walletData?.addresses?.stx?.[0]?.address || walletId,
          extensions: isImportedWallet ? ["Multi-sig"] : ["Multi-sig", "Time-lock"],
          isImported: isImportedWallet
        };
        setSelectedWallet(wallet);
      }
      setIsLoading(false);
    };

    if (!contextLoading) {
      loadWallet();
    }
  }, [walletId, isDemoMode, walletData, contextLoading, setSelectedWallet]);

  return {
    selectedWallet,
    switchWallet,
    isLoading: isLoading || contextLoading
  };
};
