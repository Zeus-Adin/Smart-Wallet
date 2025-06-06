import type { AddressEntry, CallContractParams, ContractIdString, DeployContractParams, TransferFungibleParams, TransferNonFungibleParams, TransferStxParams } from "@stacks/connect/dist/types/methods"
import type { Dispatch, SetStateAction } from "react"

export type SmartWallet = { address: `${string}.${string}` }
export type presetType = {
    id: string
    name: string
    description: string
    signers: number
    threshold: number
    features: string[]
    recommended: boolean
    state: string
    extension: boolean
    deployable: boolean
    contractName: string
    contractSrc: string
    customConfig: boolean
}

export type Accounts = {
    stx: Omit<AddressEntry, "publicKey">[]
    btc: Omit<AddressEntry, "publicKey">[]
} | undefined

export type Balance = {
    stxBalance: any
    ftBalance: any
    sbtcBalance: any
    nftBalance: any
}

export interface Token {
    symbol: string;
    name: string;
    balance: number;
    decimal: number
    [key: string]: any;
}

export type Cs = {
    found: boolean
    result?: Record<string, unknown>
    tx_info: any
}

export type UsersData = {
    addresses: Accounts | undefined
    bnsnames: any
}

export type ExecuteValues = {
    action?: string
    amount?: number
    id?: number
    symbol?: string
    name?: string
    cycles?: number
    asset_address?: ContractIdString
    asset_name?: string
    poxAddress?: {
        version?: string,
        hashbytes?: string
    }
    decimal?: number
    recipient?: string
    memo?: string
    extension_address?: ContractIdString
}

export type ExecuteValuesProps = {
    dc_exists: boolean
    setValues: Dispatch<SetStateAction<ExecuteValues | undefined>>
}

export type ExecuteTxPayload = {
    action: string
    values: ExecuteValues
}

export type ExecuteTxProps = {
    props: ExecuteTxPayload;
};

export type Info = {
    name: string
    tx: string
    type: string
    deployer: string
    owner: string
    creation: string
    sponsored: string
    version: number,
    status: string
}