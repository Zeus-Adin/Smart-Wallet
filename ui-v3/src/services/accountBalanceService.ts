import { NFTBalanceResponse } from "@/components/send/NFTSelectionStep";
import { TokenBalanceInfo } from "@/components/send/TokenSelectionStep";
import axios from "axios";

export interface AccountBalance {
   asset: string;
   symbol: string;
   balance: string;
   usdValue: string;
   icon: string;
}

export type nftResponseBalanceValues = {
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
   private getClientConfig(walletAddress: string) {
      // Automatic detection based on address prefix
      // Mainnet: SP, SM; Testnet: ST, SN
      if (/^(ST|SN)/i.test(walletAddress)) {
         return {
            api: "https://api.testnet.hiro.so",
            chain: "testnet",
         };
      } else {
         return {
            api: "https://api.mainnet.hiro.so", // fixed mainnet endpoint
            chain: "mainnet",
         };
      }
   }

   private handleGetMeta = async (
      walletAddress: string | undefined,
      asset_identifiers: string,
      id: number,
      asset: "ft" | "nft"
   ) => {
      let response;
      try {
         const { api } = this.getClientConfig(walletAddress);
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
                  `${api}/metadata/v1/${asset}/${asset_identifiers}/${id}`
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

   async getSTXBalance(walletAddress: string, offset: number) {
      const { api, chain } = this.getClientConfig(walletAddress);
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

   async getNFTBalance(
      walletAddress: string,
      asset_identifiers: string,
      offset: number
   ): Promise<NFTBalanceResponse[]> {
      try {
         const { api } = this.getClientConfig(walletAddress);

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
               const tokenMeta = await this.handleGetMeta(
                  walletAddress,
                  asset?.split("::")[0],
                  Number(id),
                  "nft"
               );
               const tokenMetadata = await axios.get(tokenMeta?.token_uri);
               return {
                  asset_name: asset?.split("::")[1],
                  asset_address: asset?.split("::")[0],
                  contract_name: asset?.split("::")[0]?.split(".")[1],
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

   async getFTBalance(
      walletAddress: string,
      offset: number
   ): Promise<TokenBalanceInfo[]> {
      const { api, chain } = this.getClientConfig(walletAddress);
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
   ): Promise<AccountBalance[]> {
      console.log("Fetching account balances for:", walletAddress);
      const stxBalance = await this.getSTXBalance(walletAddress, 0);
      const ftBalances = await this.getFTBalance(walletAddress, 0);
      const nftBalances = await this.getNFTBalance(
         walletAddress,
         asset_identifiers,
         0
      );

      return [stxBalance, ftBalances, nftBalances];
   }
}
