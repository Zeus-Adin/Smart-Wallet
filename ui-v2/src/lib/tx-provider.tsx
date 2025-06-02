import { request } from "@stacks/connect"
import { createContext, useState, type ReactNode } from "react"


interface TxContextType {
    userData: object | null
    authenticated: boolean
    handleStxSend: (amount: number, sender: string, recipient: string, memo: string | null) => void
    handleFtSend: (amount: number, sender: string, recipient: string, memo: string | null) => void
    handleNftSend: (id: number, sender: string, recipient: string, memo: string | null) => void
    handleContractDeploy: (contract: string) => void
    handleContractCall: (data: object) => void
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export function TxProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<object | null>(null)
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    const handleStxSend = (amount: number, sender: string, recipient: string, memo: string | null) => {
        request('stx_transferStx', {
            amount,
            recipient,
        })
            .then((tx) => {
                console.log({ tx });
            })
            .catch((e) => {
                console.log({ e });
            })
            .finally(() => {
                console.log('Tx broadcasted');
            })
    }
    const handleFtSend = (amount: number, sender: string, recipient: string, memo: string | null) => {

    }
    const handleNftSend = (id: number, sender: string, recipient: string, memo: string | null) => {

    }
    const handleContractDeploy = (contract: string) => {

    }
    const handleContractCall = (data: object) => {

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