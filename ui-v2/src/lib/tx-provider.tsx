import { request } from "@stacks/connect"
import { createContext, useContext, useState, type ReactNode } from "react"
import { makeContractCall, type SignedContractCallOptions } from "@stacks/transactions"
import type { CallContractParams, DeployContractParams, SendTransferParams, TransferFungibleParams, TransferNonFungibleParams, TransferStxParams } from "@stacks/connect/dist/types/methods"
import axios from "axios"
import { useAuth } from "./auth-provider"
import { fetchFeeEstimate } from '@stacks/transactions'
import { formatDistanceToNow } from 'date-fns';
import type { TxInfo } from "./types"

interface TxContextType {
    swTx: TxInfo[]
    eFees: bigint | number
    handleGetSwTx: (address: string, offset: number) => Promise<void>
    handleStxSend: (params: TransferStxParams) => Promise<void>
    handleSend: (params: SendTransferParams) => Promise<void>
    handleFtSend: (params: TransferFungibleParams) => Promise<void>
    handleNftSend: (params: TransferNonFungibleParams) => Promise<void>
    handleContractDeploy: (params: DeployContractParams) => Promise<void>
    handleContractCall: (params: CallContractParams) => Promise<void>
    handleGetTxEstimates: (address: string, params: SignedContractCallOptions) => Promise<void>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export function TxProvider({ children }: { children: ReactNode }) {
    const [swTx, setSwTx] = useState<TxInfo[]>([])
    const [eFees] = useState<bigint | number>(0)
    const { handleGetClientConfig } = useAuth()

    const handleStxSend = async (params: TransferStxParams) => {
        request('stx_transferStx', params)
            .then((tx) => tx)
            .catch((e) => { console.log({ e }) })
    }
    const handleSend = async (params: SendTransferParams) => {
        request('sendTransfer', params)
            .then((tx) => tx)
            .catch((e) => { console.log({ e }) })
    }
    const handleFtSend = async (params: TransferFungibleParams) => {
        request('stx_transferSip10Ft', params)
            .then((tx) => tx)
            .catch((e) => { console.log({ e }) })
    }
    const handleNftSend = async (params: TransferNonFungibleParams) => {
        request('stx_transferSip10Nft', params)
            .then((tx) => tx)
            .catch((e) => { console.log({ e }) })
    }
    const handleContractDeploy = async (params: DeployContractParams) => {
        request('stx_deployContract', params)
            .then((tx) => tx)
            .catch((e) => { console.log({ e }) })
    }
    const handleContractCall = async (params: CallContractParams) => {
        request('stx_callContract', params)
            .then((tx) => tx)
            .catch((e) => { console.log({ e }) })
    }

    const handleGetSwTx = async (address: string, offset: number) => {
        const { api } = handleGetClientConfig(address)
        axios.get(`${api}/extended/v2/addresses/${address}/transactions?limit=20&offset=${offset}`)
            .then((res) => {
                console.log({ results: res?.data?.results })
                if (res?.data?.results) {
                    const { results } = res.data
                    const constructTx = results.map((info: {
                        events: {},
                        stx_received: string,
                        stx_sent: string,
                        tx: {
                            token_transfer?: {
                                amount: string
                            }
                            tx_id: string,
                            tx_status: string,
                            tx_type: string,
                            block_time_iso: string,
                            sender_address: string,
                            contract_call: {
                                function_name: string
                                function_args: {
                                    repr: string
                                }[]
                            },
                            post_conditions: {
                                asset?: {
                                    asset_name: string,
                                    contract_address: string,
                                    contract_name: string
                                },
                                amount?: string,
                                principal: {
                                    address: string,
                                    contract_name?: string
                                }
                            }[]
                        }
                    }) => {
                        const { stx_sent, stx_received, tx } = info

                        const stxsent = Number(stx_sent)
                        const stxreceived = Number(stx_received)
                        const pcAssetsAndAmounts = tx?.post_conditions?.length > 0
                            ? tx?.post_conditions.map((c) => {
                                const asset = c?.asset?.contract_address
                                    ? `${c?.asset?.contract_address}.${c?.asset?.contract_name}`
                                    : 'STX'
                                const symbol = c?.asset?.asset_name?.replace('-token', '')
                                return {
                                    name: c?.asset?.asset_name ?? 'Stacks',
                                    amount: c.amount,
                                    asset,
                                    symbol: symbol ?? 'STX'
                                }
                            }) : tx?.tx_type === "token_transfer"
                                ? [
                                    {
                                        name: 'Stacks',
                                        amount: tx?.token_transfer?.amount,
                                        asset: 'STX',
                                        symbol: 'STX'
                                    }
                                ] : []
                        const pcSender = tx?.post_conditions?.[0]?.principal?.contract_name ? `${tx?.post_conditions?.[0]?.principal?.address}.${tx?.post_conditions?.[0]?.principal?.contract_name}` : tx?.post_conditions?.[0]?.principal?.address
                        const txSender = tx?.contract_call?.function_args[1]?.repr?.replace("'", '') ?? tx?.sender_address
                        const isStx = stxsent > 0 || stxreceived > 0
                        if (isStx) {
                            return {
                                action: stxsent > 0 ? 'sent' : 'receive',
                                sender: stxreceived > 0 ? txSender : stxsent > 0 ? txSender : pcSender,
                                stamp: formatDistanceToNow(tx?.block_time_iso),
                                assets: pcAssetsAndAmounts,
                                tx: tx?.tx_id,
                                tx_status: tx?.tx_status
                            }
                        } else {
                            return {
                                action: tx?.post_conditions?.length === 0 ? tx?.contract_call?.function_name ? tx?.contract_call?.function_name : tx?.tx_type : pcSender === address ? 'sent' : 'receive',
                                sender: tx?.post_conditions?.length > 0 ? pcSender : txSender,
                                stamp: formatDistanceToNow(tx?.block_time_iso),
                                time: tx?.block_time_iso,
                                assets: pcAssetsAndAmounts,
                                tx: tx?.tx_id,
                                tx_status: tx?.tx_status
                            }
                        }
                    })
                    setSwTx(prev => {
                        const newTxs = (constructTx ?? []).filter((tx: TxInfo) => !prev.some(existing => existing?.tx === tx.tx))
                        return [...prev, ...newTxs]
                    });
                }
            })
            .catch((e) => {
                console.log({ e })
            })
    }

    const handleGetTxEstimates = async (address: string, params: SignedContractCallOptions) => {
        const { network } = handleGetClientConfig(address)
        const tx = await makeContractCall(params)
        const res = await fetchFeeEstimate({ transaction: tx, network })
        console.log({ res, network, address, params })
    }

    return (
        <TxContext.Provider
            value={{
                swTx,
                eFees,
                handleGetSwTx,
                handleStxSend,
                handleSend,
                handleFtSend,
                handleNftSend,
                handleContractDeploy,
                handleContractCall,
                handleGetTxEstimates
            }}
        >
            {children}
        </TxContext.Provider>
    )
}

export function useTx() {
    const context = useContext(TxContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}