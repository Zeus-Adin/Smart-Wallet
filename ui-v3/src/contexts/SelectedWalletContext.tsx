
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface SelectedWalletContextType {
  selectedWallet: SelectedWallet | null;
  setSelectedWallet: (wallet: SelectedWallet | null) => void;
  switchWallet: (walletId: string) => void;
  isLoading: boolean;
}

const SelectedWalletContext = createContext<SelectedWalletContextType | undefined>(undefined);

export const useSelectedWalletContext = () => {
  const context = useContext(SelectedWalletContext);
  if (context === undefined) {
    throw new Error('useSelectedWalletContext must be used within a SelectedWalletProvider');
  }
  return context;
};

interface SelectedWalletProviderProps {
  children: ReactNode;
}

export const SelectedWalletProvider = ({ children }: SelectedWalletProviderProps) => {
  const [selectedWallet, setSelectedWallet] = useState<SelectedWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted wallet selection from localStorage
    const persistedWallet = localStorage.getItem('selectedWallet');
    if (persistedWallet) {
      try {
        const wallet = JSON.parse(persistedWallet);
        setSelectedWallet(wallet);
      } catch (error) {
        console.error('Failed to parse persisted wallet:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSelectedWallet = (wallet: SelectedWallet | null) => {
    setSelectedWallet(wallet);
    if (wallet) {
      localStorage.setItem('selectedWallet', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('selectedWallet');
    }
  };

  const switchWallet = (walletId: string) => {
    console.log(`Switching to wallet: ${walletId}`);
    // Navigate to the wallet dashboard
    window.location.href = `/dashboard/${walletId}`;
  };

  const value: SelectedWalletContextType = {
    selectedWallet,
    setSelectedWallet: updateSelectedWallet,
    switchWallet,
    isLoading,
  };

  return (
    <SelectedWalletContext.Provider value={value}>
      {children}
    </SelectedWalletContext.Provider>
  );
};
