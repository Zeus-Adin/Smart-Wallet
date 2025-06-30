import { getClientConfig } from "@/utils/chain-config";
import { request } from "@stacks/connect";
import { DeployContractParams, TransactionResult } from "@stacks/connect/dist/types/methods";
import { Cl, Pc } from '@stacks/transactions'

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

		if (params.assetType === "nft") {
			const txData = await request(
				{},
				"stx_callContract",
				{
					contract: `${address}.${contractName}`,
					functionName: "sip009-transfer",
					functionArgs: [Cl.uint(params.tokenId), Cl.principal(params.to), Cl.contractPrincipal(address, contractName)]
				}
			);
			return txData
		} else {
			const txData = await request(
				{},
				"stx_callContract",
				{
					contract: `${address}.${contractName}`,
					functionName: "sip010-transfer",
					functionArgs: [Cl.uint(+params.amount * 1000000), Cl.principal(params.to), Cl.some(Cl.stringUtf8("")), Cl.contractPrincipal(address, contractName)]
				}
			);
			return txData
		}
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

   async depositSTX(params: {
      to: string;
      amount: string;
   }): Promise<{ txid: string; network: string }> {

      const { network } = getClientConfig(params.to);

      const data = await request(
         "stx_transferStx",
         {
            recipient: params.to,
            amount: Number(params.amount),
            network,
         }
      );
      // Assume data.txid and network are returned
      return { txid: data.txid, network };
   }

   async depositFT(params: {
    token: string;
    to: string;
    amount: string; 
    decimals: number;
    sender:string
  }): Promise<{ txid: string; network: string }> {
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [contract, tokenName] = params.token.split('::') as any;
    const [address, contractName] = contract.split('.');
    const { network } = getClientConfig(params.to);
    
    const amount = params.amount;
    const sender = params.sender || params.to.split('.')[0];
   const postConditions = [Pc.principal(sender).willSendLte(amount).ft(contract, tokenName)]

    const data = await request(
      "stx_callContract",
      {
        contract: `${address}.${contractName}`,
        functionName: "transfer",
        functionArgs: [
          Cl.uint(amount),
          Cl.principal(sender), 
          Cl.principal(params.to),
          Cl.none()
        ],
        network,
        postConditions,
         postConditionMode: "deny"
      }
    );
    return { txid: data.txid, network };
  }
}
