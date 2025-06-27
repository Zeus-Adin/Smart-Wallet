import { NFTBalanceResponse } from "@/components/send/NFTSelectionStep";
import { TokenBalanceInfo } from "@/components/send/TokenSelectionStep";
import axios from "axios";
import { getClientConfig } from "@/utils/chain-config";

export interface AccountBalance {
   stxBalance: StxBalance;
	nftBalance: NFTBalanceResponse[];
	ftBalance: TokenBalanceInfo[]
}
export interface StxBalance {
	actual_balance: string
	balance: string
	burnchain_lock_height: number
	burnchain_unlock_height: number
	decimals: number
	image: string
	lock_height: number
	lock_tx_id: string
	locked: string
	name: string
	symbol: string
	total_miner_rewards_received: string
 }

export interface nftResponseBalanceValues {
   asset_identifier: string;
   block_height: number;
   value: { repr: string };
   tx: {
      block_time_iso: string;
      tx_status: string;
      tx_id: string;
   };
};

export class AccountBalanceService {
   private handleGetMeta = async (
      walletAddress: string | undefined,
      asset_identifiers: string,
      id: number,
      asset: "ft" | "nft"
   ) => {
      let response;
      try {
         const { api } = getClientConfig(walletAddress)
         let res;
         if (asset === "ft") {
            response = (
               await axios.get(
                  `${api}/metadata/v1/${asset}/${asset_identifiers}`
               )
            ).data;
         } else {
            response = (
               await axios.get(
                  `${api}/metadata/v1/${asset_identifiers.split(".")[0]}/${asset_identifiers.split(".")[1]}`
               )
            ).data?.metadata;
         }
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

   async getStxBalance(walletAddress: string, offset: number): Promise<StxBalance> {
      const { api } = getClientConfig(walletAddress);
      const response = (
         await axios.get(
            `${api}/extended/v2/addresses/${walletAddress}/balances/stx?offset=${offset}`
         )
      )?.data;
      const stxDecimal = 6;
      const stxBalance = {
         ...response,
         image: "/stx-logo.svg",
         decimals: stxDecimal,
         actual_balance: this.formatDecimals(
            response?.balance,
            stxDecimal,
            false
         ),
         name: "Stacks",
         symbol: "STX",
      };

      return stxBalance;
   }

   async getNftBalance(
      walletAddress: string,
      asset_identifiers: string,
      offset: number
   ): Promise<NFTBalanceResponse[]> {
      try {
         const { api } = getClientConfig(walletAddress);

         const nftBalanceResponse = (
            await axios.get(
               `${api}/extended/v1/tokens/nft/holdings?principal=${walletAddress}&${
                  asset_identifiers
                     ? `asset_identifiers=${asset_identifiers}`
                     : ""
               }&offset=${offset}&tx_metadata=true`
            )
         )?.data?.results;

         const nftBalance = await Promise.all(
            nftBalanceResponse.map(async (res: nftResponseBalanceValues) => {
               const id = res?.value?.repr?.replace("u", "");
               const asset = res?.asset_identifier;
					console.log("asset", asset)
               const tokenMeta = await this.handleGetMeta(
                  walletAddress,
                  asset,
                  Number(id),
                  "nft"
               );
               const tokenMetadata = await axios.get(tokenMeta?.token_uri);
					const [asset_address, asset_name] = asset.split("::");
					const [_, contract_name] = asset_address.split(".");
					
               return {
                  asset_name,
                  asset_address,
                  contract_name,
                  id,
                  ...tokenMeta,
                  ...tokenMetadata,
                  tx: res?.tx?.tx_id,
                  status: res?.tx?.tx_status,
                  time: res?.tx?.block_time_iso,
               };
            })
         );

         return nftBalance;
      } catch (error) {
         throw Error(error);
      }
   }

   async getFtBalance(
      walletAddress: string,
      offset: number
   ): Promise<TokenBalanceInfo[]> {
      const { api } = getClientConfig(walletAddress);
      try {
         let ftBalance = (
            await axios.get(
               `${api}/extended/v2/addresses/${walletAddress}/balances/ft?offset=${offset}`
            )
         )?.data?.results;
         ftBalance = await Promise.all(
            ftBalance.map(async (res: { balance: string; token: string }) => {
               if (!res) return;
               const tokenAddress = res?.token?.split("::")[0];
               const tokenMeta = await this.handleGetMeta(
                  walletAddress,
                  tokenAddress,
                  0,
                  "ft"
               );
               const tokenMetadata = await axios.get(tokenMeta?.token_uri);
               return {
                  ...res,
                  ...tokenMeta,
                  ...tokenMetadata?.data,
                  actual_balance: this.formatDecimals(
                     res?.balance ?? 0,
                     tokenMeta?.decimals ?? 0,
                     false
                  ),
               };
            })
         );

         return ftBalance;
      } catch (error) {
         throw Error(error);
      }
   }

   async getAccountBalances(
      walletAddress: string,
      asset_identifiers: string
   ): Promise<AccountBalance> {
      console.log("Fetching account balances for:", walletAddress);
      const stxBalance = await this.getStxBalance(walletAddress, 0);
      const ftBalance = await this.getFtBalance(walletAddress, 0);
      const nftBalance = await this.getNftBalance(
         walletAddress,
         asset_identifiers,
         0
      );

      return {stxBalance, ftBalance, nftBalance};
   }
}
