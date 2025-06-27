import { getClientConfig } from "@/utils/chain-config";
import { request } from "@stacks/connect";
import { DeployContractParams, TransactionResult } from "@stacks/connect/dist/types/methods";
import { Cl } from '@stacks/transactions'

export interface TransactionParams {
   from: string;
   to: string;
   amount: string;
   asset: string;
   assetType: "token" | "nft";
   tokenId?: string;
   contractAddress?: string;
}

export class BlockchainService {
   // Handles contract deploys
   async deployContract(params: DeployContractParams) {
      await request('stx_deployContract', params)
         .then((tx) => tx)
         .catch((e) => { console.log({ e }) })
   }

   async sendTransaction(
      params: TransactionParams
   ): Promise<TransactionResult> {
		const [address, contractName] = params.contractAddress.split(".")

      const data = await request(
         {},
         "stx_callContract",
         {
            contract: `${address}.${contractName}`,
				functionName: "sip009-transfer",
				functionArgs: [Cl.uint(params.tokenId), Cl.principal(params.to), Cl.contractPrincipal(address, contractName)]
         }
      );

      return data;
   }

   async addAdmin(params: {
      contractAddress: string;
      adminAddress: string;
   }): Promise<TransactionResult> {
      const [address, contractName] = params.contractAddress.split(".");
      const network = getClientConfig(address).network;
      console.log("Adding admin:", params.adminAddress, "to contract:", `${address}.${contractName}`);
      const data = await request(
         "stx_callContract",
         {
            contract: `${address}.${contractName}`,
            functionName: "enable-admin",
            functionArgs: [Cl.principal(params.adminAddress), Cl.bool(true)],
            network,
         }
      );
      return data;
   }

   async transferOwnership(params: {
      contractAddress: string; 
      newOwnerAddress: string;
   }): Promise<TransactionResult> {
      const [address, contractName] = params.contractAddress.split(".");
      const network = getClientConfig(address).network;
      console.log("Transferring ownership of contract:", `${address}.${contractName}`, "to new owner:", params.newOwnerAddress);
      const data = await request(
         "stx_callContract",
         {
            contract: `${address}.${contractName}`,
            functionName: "transfer-wallet",
            functionArgs: [Cl.principal(params.newOwnerAddress)],
            network,
         }
      );
      return data;
   }

   async getTransactionStatus(txHash: string): Promise<string> {
      console.log("Checking transaction status for:", txHash);

      // Simulate status check
      return new Promise((resolve) => {
         setTimeout(() => {
            const statuses = ["pending", "confirmed", "failed"];
            const randomStatus =
               statuses[Math.floor(Math.random() * statuses.length)];
            resolve(randomStatus);
         }, 1000);
      });
   }
}
