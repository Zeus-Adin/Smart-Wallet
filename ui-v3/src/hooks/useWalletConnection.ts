import { useState, useEffect } from "react";
import { connect, disconnect, isConnected, getLocalStorage, } from "@stacks/connect";
import { useSearchParams } from "react-router-dom";
import { StacksNetworkName, defaultUrlFromNetwork } from '@stacks/network'
import axios from 'axios'
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

export const useWalletConnection = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [searchParams] = useSearchParams();
  const network = searchParams.get('network')

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
          }
          setWalletData(transformedData)
        }
      } catch (error) {
        console.error("Error getting wallet data:", error)
      }
    }
  }, []);

  const handleGetClientConfig = (address: string | undefined) => {
    const network: StacksNetworkName = searchParams.get("network") || address?.startsWith('SP') ? 'mainnet' : 'testnet'
    const api: string | undefined = searchParams.get("api") || defaultUrlFromNetwork(network)
    const chain: string | undefined = searchParams.get("chain") || network
    const explorer: string | undefined = searchParams.get("explorer") || 'https://explorer.hiro.so/'
    return { network, chain, api, explorer }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const response = await connect();
      setIsWalletConnected(true);

      // Transform the response to match our interface
      if (response && response.addresses) {
        const stx = response.addresses.find((addr) => addr.symbol.toLowerCase() === "stx");
        const btc = response.addresses.find((addr) => addr.symbol.toLowerCase() === "btc");
        const transformedData: WalletData = {
          addresses: {
            stx: [stx],
            btc: [btc],
          },
        };
        setWalletData(transformedData);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  }
  const disconnectWallet = () => {
    disconnect()
    setIsWalletConnected(false)
    setWalletData(null)
    console.log("Wallet disconnected")
  }

  const handleCCS = async (address: string | undefined, contractId: string, txinfo: boolean) => {
    let contractInfo

    try {
      const { api } = handleGetClientConfig(address)
      contractInfo = (await axios.get(`${api}/extended/v2/smart-contracts/status?contract_id=${contractId}`)).data
      contractInfo = contractInfo?.[contractId]
      if (contractInfo?.result && txinfo) {
        const tx_info = (await axios.get(`${api}/extended/v1/tx/${contractInfo?.result?.tx_id}`)).data
        contractInfo = { ...contractInfo, tx_info }
      }
    } catch (error) {
      console.log({ error })
    }
    return contractInfo
  }

  return {
    isWalletConnected,
    walletData,
    isConnecting,
    searchParams,
    handleGetClientConfig,
    connectWallet,
    disconnectWallet,
    handleCCS
  }
};
