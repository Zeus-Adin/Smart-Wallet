import { getClientConfig } from "@/utils/chain-config";
import { formatDecimals } from "@/utils/numbers";
import { ContractCallArgument, request } from "@stacks/connect";
import { CallContractParams, DeployContractParams, TransactionResult } from "@stacks/connect/dist/types/methods";
import { Cl, Pc, serializeCV } from '@stacks/transactions'
import { hexToBytes } from '@noble/hashes/utils';


export interface TransactionParams {
   from: string;
   to: string;
   amount: string;
   asset: string;
   assetType: "token" | "nft";
   tokenId?: string;
   contractAddress?: string;
}

export type ExtensionCallParams = {
   action: string
   extension: string
   "amount-ustx": number
   decimal: number
   "delegate-to": string
   "until-burn-ht": number
   "pox-addr": {
      version: string
      hashbytes: string
   }
}

export class BlockchainService {
   async callExtensionContract(walletId: `${string}.${string}`, params: ExtensionCallParams) {
      const delegateAmount = formatDecimals(params["amount-ustx"], params.decimal, true)
      const postConditions = [
         Pc.principal(walletId).willSendLte(delegateAmount).ustx(),
         Pc.principal(walletId).willSendLte(1).ft(walletId, 'ect')
      ]

      let serializedPayload: any
      if (params?.["pox-addr"]?.version && params?.["pox-addr"]?.hashbytes) {
         serializedPayload = hexToBytes(serializeCV(
            Cl.tuple({
               "action": Cl.stringAscii(params.action),
               "amount-ustx": Cl.uint(delegateAmount),
               "delegate-to": Cl.principal(params["delegate-to"]),
               "until-burn-ht": Cl.none(),
               "pox-addr": Cl.tuple({
                  'version': Cl.bufferFromAscii(params["pox-addr"].version),
                  'hashbytes': Cl.bufferFromAscii(params["pox-addr"].hashbytes)
               })
            })
         ))
      } else {
         serializedPayload = hexToBytes(serializeCV(
            Cl.tuple({
               "action": Cl.stringAscii(params.action),
               "amount-ustx": Cl.uint(delegateAmount),
               "delegate-to": Cl.principal(params["delegate-to"]),
               "until-burn-ht": Cl.none(),
               "pox-addr": Cl.none(),
            })
         ))
      }
      const txoptions: CallContractParams = {
         contract: walletId,
         functionName: 'extension-call',
         functionArgs: [
            Cl.principal(params.extension),
            Cl.buffer(serializedPayload)
         ]
      }
      await request('stx_callContract', txoptions)
         .then((tx) => tx)
         .catch((e) => { console.log({ e }) })
   }
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
}
