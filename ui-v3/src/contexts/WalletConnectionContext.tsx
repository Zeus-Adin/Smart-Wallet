import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
} from "@stacks/connect";

// Define the wallet data interface based on what @stacks/connect actually returns
interface WalletData {
  addresses: {
    stx: Array<{
      address: string;
      publicKey?: string;
    }>;
    btc: Array<{
      address: string;
      publicKey?: string;
    }>;
  };
  profile?: any;
  publicKey?: string;
}

interface WalletConnectionContextType {
  isWalletConnected: boolean;
  walletData: WalletData | null;
  isConnecting: boolean;
  isDemoMode: boolean;
  connectWallet: () => Promise<void>;
  connectDemoWallet: () => void;
  disconnectWallet: () => void;
}

const WalletConnectionContext = createContext<WalletConnectionContextType | undefined>(undefined);

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
};

interface WalletConnectionProviderProps {
  children: ReactNode;
}

export const WalletConnectionProvider = ({ children }: WalletConnectionProviderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo wallet data
  const demoWalletData: WalletData = {
    addresses: {
      stx: [
        {
          address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
          publicKey: "03abc123def456789",
        },
      ],
      btc: [
        {
          address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
          publicKey: "03def456abc123789",
        },
      ],
    },
    profile: {
      name: "Demo User",
    },
    publicKey: "03abc123def456789",
  };

  useEffect(() => {
    // Check if user is already connected on component mount
    const connected = isConnected();
    setIsWalletConnected(connected);

    if (connected) {
      try {
        const userData = getLocalStorage();
        // Transform the data to match our interface
        if (userData && userData.addresses) {
          const transformedData: WalletData = {
            addresses: {
              stx: Array.isArray(userData.addresses.stx)
                ? userData.addresses.stx
                : [],
              btc: Array.isArray(userData.addresses.btc)
                ? userData.addresses.btc
                : [],
            },
          };
          setWalletData(transformedData);
        }
      } catch (error) {
        console.error("Error getting wallet data:", error);
      }
    }

    // On mount, restore demo mode from localStorage
    const demo = localStorage.getItem("isDemoMode");
    if (demo === "true") {
      setIsDemoMode(true);
      setIsWalletConnected(true);
      setWalletData(demoWalletData);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const response = await connect();
      setIsWalletConnected(true);

      // Transform the response to match our interface
      if (response && response.addresses) {
        const stx = response.addresses.find((addr) => addr.symbol === "stx");
        const btc = response.addresses.find((addr) => addr.symbol === "btc");
        const transformedData: WalletData = {
          addresses: {
            stx: [stx],
            btc: [btc],
          },
        };
        setWalletData(transformedData);
      }
      console.log("Wallet connected successfully:", response);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectDemoWallet = () => {
    setIsDemoMode(true);
    setIsWalletConnected(true);
    setWalletData(demoWalletData);
    localStorage.setItem("isDemoMode", "true");
    console.log("Demo wallet connected");
  };

  const disconnectWallet = () => {
    if (!isDemoMode) {
      disconnect();
    }
    setIsWalletConnected(false);
    setWalletData(null);
    setIsDemoMode(false);
    localStorage.removeItem("isDemoMode");
    console.log("Wallet disconnected");
  };

  const value: WalletConnectionContextType = {
    isWalletConnected,
    walletData,
    isConnecting,
    isDemoMode,
    connectWallet,
    connectDemoWallet,
    disconnectWallet,
  };

  return (
    <WalletConnectionContext.Provider value={value}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
