import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { disconnect, isConnected, getLocalStorage, request } from "@stacks/connect"
import { defaultUrlFromNetwork, StacksNetworks, type StacksNetworkName } from '@stacks/network'
import axios from "axios"
import type { AddressEntry } from "@stacks/connect/dist/types/methods"
import { useSearchParams } from "react-router-dom"

type Accounts = {
  stx: Omit<AddressEntry, "publicKey">[]
  btc: Omit<AddressEntry, "publicKey">[]
} | undefined

type Cs = {
  found: boolean
  result?: Record<string, unknown>
}

export type UsersData = {
  addresses: Accounts | undefined
  bnsnames: any
}

interface AuthContextType {
  userData: UsersData | undefined
  authenticated: boolean
  loading: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  handleCCS: (address: string | undefined, contractId: string) => Promise<Cs>
  handleGetName: (address: string) => any
  handleGetClientConfig: (address: string | undefined) => { network?: string, chain?: string, api?: string, explorer?: string }
}

export const smartWalletContractName: string = 'smart-wallet';

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UsersData | undefined>(undefined)
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams();

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    // Check Auth State
    const checkAuth = async () => {
      try {
        if (isConnected()) {
          const data: Accounts = getLocalStorage()?.addresses
          const bnsnames = await handleGetName(data?.stx[0]?.address);
          setUserData({ addresses: data, bnsnames })
          setAuthenticated(isConnected())
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setLoading(false)
      }
    }

    // Auth State check re-ocurrence
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleGetClientConfig = (address: string | undefined) => {
    const network: StacksNetworkName = searchParams.get("network") || address?.startsWith('SP') ? 'mainnet' : 'testnet'
    const api: string | undefined = searchParams.get("api") || defaultUrlFromNetwork(network)
    const chain: string | undefined = searchParams.get("chain") || 'mannet'
    const explorer: string | undefined = searchParams.get("explorer") || 'https://explorer.hiro.so/'
    return { network, chain, api, explorer }
  }

  const handleGetName = async (address: string | undefined) => {
    let namesres, namemetares

    try {
      namesres = await axios.get(`https://api.bnsv2.com/names/address/${address}/valid`)
      namesres = namesres?.data?.names
      const bnsname_contract = address?.startsWith('SP') ? 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2' : 'ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M.BNS-V2'
      namemetares = await handleGetNftMeta(address, bnsname_contract, 1)
    } catch (error) {
      console.log({ error })
    }
    return { ...namesres, ...namemetares }
  }

  const handleGetNftMeta = async (address: string | undefined, contract: string, id: number) => {
    let response

    try {
      const { api } = handleGetClientConfig(address)
      const res = (await axios.get(`${api}/metadata/v1/nft/${contract}/${id}`)).data
      response = res?.metadata
    } catch (error) {
      console.log({ error })
    }
    return response
  }

  const handleCCS = async (address: string | undefined, contractId: string) => {
    let contractInfo

    try {
      const { api } = handleGetClientConfig(address)
      contractInfo = (await axios.get(`${api}/extended/v2/smart-contracts/status?contract_id=${contractId}`)).data
      contractInfo = contractInfo?.[contractId]
    } catch (error) {
      console.log({ error })
    }
    return { found: contractInfo?.found, ...contractInfo?.result }
  }

  const handleSignIn = async () => {
    setLoading(true)

    request({ forceWalletSelect: true }, 'getAddresses')
      .then(async () => {
        const addresses: Accounts = getLocalStorage()?.addresses
        const bnsnames = await handleGetName(addresses?.stx?.[0]?.address);
        setUserData({ addresses, bnsnames: bnsnames })
        setAuthenticated(isConnected())
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        console.log("Finalized");
        setLoading(false)
      })
  }

  const handleSignOut = () => {
    try {
      // Disconnect and clear authentication state
      disconnect()
      setUserData(undefined)
      setAuthenticated(isConnected())
    } catch (e) {
      console.error("Sign out error:", { e })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userData,
        authenticated,
        loading,
        handleSignIn,
        handleSignOut,
        handleCCS,
        handleGetName,
        handleGetClientConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
