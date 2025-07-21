import { NFTBalanceResponse } from "@/components/send/NFTSelectionStep";
import { TokenBalanceInfo } from "@/components/send/TokenSelectionStep";
import axios from "axios";
import { getClientConfig } from "@/utils/chain-config";

interface StxResponseBalance {
   balance: string
   burnchain_lock_height: number
   burnchain_unlock_height: number
   estimated_balance: string
   lock_height: number
   lock_tx_id: string
   locked: string
   pending_balance_inbound: string
   pending_balance_outbound: string
   total_fees_sent: string
   total_miner_rewards_received: string
   total_received: string
   total_sent: string
}
export interface FtResponseBalance {
   balance: string
   total_sent: string
   total_received: string,
   asset_identifier: string
}
export interface NftResponseBalance {
   count: string | number
   total_sent: string
   total_received: string
   asset_identifier: string

}

export type AccountResponseBalanceType = {
   stx: StxResponseBalance,
   fungible_tokens: Record<string, FtResponseBalance>,
   non_fungible_tokens: Record<string, NftResponseBalance>
}
export type AccountBalanceType = {
   raw: AccountResponseBalanceType,
   ft: FtResponseBalance[],
   nft: NftResponseBalance[],
   stx: FungibleType,
   sbtc: FungibleType,
}

export type FungibleType = {
   umicro: number | string
   balance: number | string
   decimal: number
   name: string
   symbol: string
   icon: string
   contract: string,
   asset_identifier: string
}
export type NftBalanceType = {
   count: number,
   total_sent: string
   total_received: string
   asset_identifier: string
}

export type metaDataType = {
   sip: number
   name: string
   description: string
   image: string
   cached_image: string
   cached_thumbnail_image: string
   attributes: {
      trait_type: string
      display_type: string
      value: string
   }[]
   properties: {
      collection: string
      total_supply: string
   }
   localization: {
      uri: string
      default: string
      locales: string[]
   }
}
export type ftInfoType = {
   name: string
   symbol: string
   decimals: number
   total_supply: string
   token_uri: string
   description: string
   image_uri: string
   image_thumbnail_uri: string
   image_canonical_uri: string
   tx_id: string
   sender_address: string
   asset_identifier: string
   metadata: metaDataType
}
export type nftAssetType = {
   asset_identifier: string
   value: {
      hex: string
      repr: string
   },
   block_height: number
   tx_id: string
}
export type nftInfoType = {
   count: number | string,
   token_uri: string
   metadata: metaDataType
   assets: Promise<nftAssetType[]>
}

type GetFungibleTokenMeta = ftInfoType | null
type GetNoneFungibleTokenMeta = nftInfoType | null

export class AccountBalanceService {
   private handleGetFtMeta = async (walletAddress: string, asset_identifiers: string): Promise<GetFungibleTokenMeta> => {
      let response: GetFungibleTokenMeta
      try {
         const { api } = getClientConfig(walletAddress)
         response = (await axios.get(`${api}/metadata/v1/ft/${asset_identifiers}`)).data;
      } catch (error) { console.log({ error }); }
      return response;
   };
   private handleGetNftMeta = async (walletAddress: string, asset_identifiers: string, id: number): Promise<GetNoneFungibleTokenMeta> => {
      let response: GetNoneFungibleTokenMeta
      try {
         const { api } = getClientConfig(walletAddress)
         response = (await axios.get(`${api}/metadata/v1/nft/${asset_identifiers}/${id}`)).data?.metadata;
      } catch (error) {
         console.log({ error });
      }
      return response;
   };
   private formatDecimals = (
      value: number | string,
      decimals: number,
      isUmicro: boolean
   ): string => {
      if (isUmicro) {
         return (Number(value) * 10 ** decimals).toFixed(0);
      } else {
         return (Number(value) / 10 ** decimals).toFixed(4);
      }
   };

   constructStxBalance(stxRes: StxResponseBalance): FungibleType {
      return {
         umicro: stxRes.balance,
         balance: this.formatDecimals(stxRes.balance, 6, false),
         decimal: 6,
         name: "Stacks",
         symbol: "STX",
         icon: "/icons/stx.png",
         contract: '.stacks',
         asset_identifier: '.stacks::stx'
      }
   };
   async constructFtBalance(address: string, ftRes: FtResponseBalance): Promise<FungibleType> {
      const tokenMeta = await this.handleGetFtMeta(address, ftRes.asset_identifier.split("::")[0])
      return {
         umicro: ftRes.balance,
         balance: this.formatDecimals(ftRes.balance, tokenMeta.decimals, false),
         decimal: tokenMeta.decimals,
         name: tokenMeta.name,
         symbol: tokenMeta.symbol,
         icon: tokenMeta.image_thumbnail_uri,
         contract: tokenMeta.asset_identifier.split('::')[0],
         asset_identifier: tokenMeta.asset_identifier
      }
   }
   async constructNftBalance(address: string, nftRes: NftResponseBalance): Promise<nftInfoType> {
      const { api } = getClientConfig(address)
      const nftMeta = await this.handleGetNftMeta(address, nftRes.asset_identifier.split("::")[0], 1)
      const assets: Promise<nftAssetType[]> = await (await axios.get(`${api}extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${nftRes.asset_identifier}&offset=0`)).data
      return {
         count: nftRes.count,
         token_uri: nftMeta.token_uri,
         metadata: nftMeta.metadata,
         assets
      }
   }

   async getAccountBalances(address: string): Promise<AccountBalanceType> {
      if (!address) return;

      let rawBalance: AccountResponseBalanceType = null;
      let ftBalance: FtResponseBalance[] = [];
      let nftBalance: NftResponseBalance[] = [];
      let stxBalance: FungibleType = null;
      let sBtcBalance: FungibleType = null;

      try {
         const { api } = getClientConfig(address);
         rawBalance = (await axios.get(`${api}/extended/v1/address/${address}/balances`)).data;
      } catch (e) {
         console.error("Failed to fetch raw balance", e);
      }

      if (rawBalance) {
         try {
            ftBalance = Object.keys(rawBalance.fungible_tokens || {}).map((key) => ({ ...rawBalance.fungible_tokens[key], asset_identifier: key }));
         } catch (e) {
            console.error("Failed to process FT balances", e);
         }
         try {
            nftBalance = Object.keys(rawBalance.non_fungible_tokens || {}).map((key) => ({ ...rawBalance.non_fungible_tokens[key], asset_identifier: key }));
         } catch (e) {
            console.error("Failed to process NFT balances", e);
         }
         try {
            stxBalance = this.constructStxBalance(rawBalance.stx);
         } catch (e) {
            console.error("Failed to process STX balance", e);
         }
         try {
            const sbtc = ftBalance.find(t => t.asset_identifier === "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token");
            if (sbtc) {
               sBtcBalance = await this.constructFtBalance(address, sbtc);
            }
         } catch (e) {
            console.error("Failed to process sBTC balance", e);
         }
      }

      return {
         raw: rawBalance,
         ft: ftBalance,
         nft: nftBalance,
         stx: stxBalance,
         sbtc: sBtcBalance
      };
   }
}