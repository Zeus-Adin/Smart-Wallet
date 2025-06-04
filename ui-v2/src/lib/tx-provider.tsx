import { request } from "@stacks/connect"
import { createContext, useContext, useState, type ReactNode } from "react"
import { } from "@stacks/transactions"
import type { CallContractParams, DeployContractParams, TransferFungibleParams, TransferNonFungibleParams, TransferStxParams } from "@stacks/connect/dist/types/methods"

interface TxContextType {
    userData: object | null
    authenticated: boolean
    handleStxSend: (params: TransferStxParams) => Promise<any>
    handleFtSend: (params: TransferFungibleParams) => Promise<any>
    handleNftSend: (params: TransferNonFungibleParams) => Promise<any>
    handleContractDeploy: (params: DeployContractParams) => Promise<any>
    handleContractCall: (params: CallContractParams) => Promise<any>
}

type PendingTx = {
    txId: string,
    tx_status: string
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export function TxProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<object | null>(null)
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [] = useState<PendingTx[]>([])

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

    return (
        <TxContext.Provider
            value={{
                userData,
                authenticated,
                handleStxSend,
                handleFtSend,
                handleNftSend,
                handleContractDeploy,
                handleContractCall
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