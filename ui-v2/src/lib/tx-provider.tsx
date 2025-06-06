import { request } from "@stacks/connect"
import { createContext, useContext, useState, type ReactNode } from "react"
import { makeContractCall, type SignedContractCallOptions } from "@stacks/transactions"
import type { CallContractParams, DeployContractParams, TransferFungibleParams, TransferNonFungibleParams, TransferStxParams } from "@stacks/connect/dist/types/methods"
import axios from "axios"
import { useAuth } from "./auth-provider"
import { fetchFeeEstimate } from '@stacks/transactions'

interface TxContextType {
    userData: object | null
    authenticated: boolean
    swTx: []
    eFees: bigint | number
    handleGetSwTx: (address: string, offset: number) => Promise<void>
    handleStxSend: (params: TransferStxParams) => Promise<void>
    handleFtSend: (params: TransferFungibleParams) => Promise<void>
    handleNftSend: (params: TransferNonFungibleParams) => Promise<void>
    handleContractDeploy: (params: DeployContractParams) => Promise<void>
    handleContractCall: (params: CallContractParams) => Promise<void>
    handleGetTxEstimates: (address: string, params: SignedContractCallOptions) => Promise<void>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export function TxProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<object | null>(null)
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [swTx, setSwTx] = useState<[]>([])
    const [eFees, setEFees] = useState<bigint | number>(0)
    const { handleGetClientConfig } = useAuth()

    const handleStxSend = async (params: TransferStxParams) => {
        request('stx_transferStx', params)
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
        axios.get(`${api}/extended/v2/addresses/${address}/transactions?offset=${offset}`)
            .then((res) => {
                setSwTx(res.data.results)
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
                userData,
                authenticated,
                swTx,
                eFees,
                handleGetSwTx,
                handleStxSend,
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