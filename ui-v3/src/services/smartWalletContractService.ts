import { type ContractType, ContractTypes } from "@/data/walletTypes";
import { getClientConfig } from "@/utils/chain-config";
import { defaultUrlFromNetwork, StacksNetworkName } from "@stacks/network";
import axios from "axios";

export interface SmartWallet {
  label: string
  id: number
  name: string
  contractId: string
  ext: boolean
  stxHolding: number
  btcHolding: number
  extensions: string[]
  createdAt: string
}
export interface WalletActivity {
  id: string;
  type: "send" | "receive" | "stacking";
  asset: string;
  amount: string;
  timestamp: string;
  description: string;
}

export type WalletType = {
  label: string
  id: number
  name: string
  contractId: string
  ext: boolean
  stxHolding: number
  btcHolding: number
  extensions: string[]
  createdAt: string
};

export const smartWalletName = "smart-wallet";
export const handleCCS = async (
  address: string,
  contractId: string,
  txinfo: boolean,
) => {
  let contractInfo;
  try {
    const { api } = getClientConfig(address);
    contractInfo = (
      await axios.get(
        `${api}/extended/v2/smart-contracts/status?contract_id=${contractId}`
      )
    ).data;
    contractInfo = contractInfo?.[contractId];
    if (contractInfo?.result && txinfo) {
      const tx_info = (
        await axios.get(`${api}/extended/v1/tx/${contractInfo?.result?.tx_id}`)
      ).data;
      contractInfo = { ...contractInfo, ...tx_info };
    }
  } catch (error) {
    contractInfo = { found: false }
    console.log({ error });
  }
  return contractInfo;
}
export const constructContractValues = (wr: any, wallets: ContractType) => {
  const w: WalletType = {
    id: wr.tx_index,
    name: wr.smart_contract.contract_id.split(".")[1],
    contractId: wr.smart_contract.contract_id,
    stxHolding: 0,
    btcHolding: 0,
    ...wallets,
    createdAt: wr.block_time_iso,
  };
  return w
}

export class SmartWalletContractService {
  async getSmartWallets(walletAddress: string): Promise<SmartWallet[]> {
    const allDeployedWallets: WalletType[] = (
      await Promise.all(
        ContractTypes.map(async (wallets) => {
          const wr = await handleCCS(walletAddress, `${walletAddress}.${wallets.name}`, true);
          if (!wr?.found) return null;
          const w = constructContractValues(wr, wallets)
          return w;
        })
      )
    ).filter(Boolean) as WalletType[]; // Remove nulls 
    return allDeployedWallets;
  }

  async getWalletActivity(walletAddress: string): Promise<WalletActivity[]> {
    console.log("Fetching wallet activity for:", walletAddress);

    // Mock activity data
    return [
      {
        id: "1",
        type: "send",
        asset: "STX",
        amount: "-100",
        timestamp: "2 hours ago",
        description: "Sent STX",
      },
      {
        id: "2",
        type: "receive",
        asset: "STX",
        amount: "+500",
        timestamp: "1 day ago",
        description: "Received STX",
      },
      {
        id: "3",
        type: "stacking",
        asset: "STX",
        amount: "+25",
        timestamp: "3 days ago",
        description: "Stacking Reward",
      },
    ];
  }
}
