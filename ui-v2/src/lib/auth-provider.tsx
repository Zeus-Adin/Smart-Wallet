import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { disconnect, isConnected, getLocalStorage, request } from "@stacks/connect"
import axios, { type AxiosResponse } from "axios"
import type { AddressEntry } from "@stacks/connect/dist/types/methods"

type Accounts = {
  stx: Omit<AddressEntry, "publicKey">[]
  btc: Omit<AddressEntry, "publicKey">[]
} | undefined

export type UsersData = {
  addresses: Accounts | undefined
  bnsnames: any
  sws: any
}

interface AuthContextType {
  userData: UsersData | undefined
  authenticated: boolean
  loading: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  handleSWS: (contractId: string) => void
  handleGetName: (address: string) => any
}

export const smartWalletContractName: string = 'smart-wallet';

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UsersData | undefined>(undefined)
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

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
          const swsres = await handleSWS(`${data?.stx?.[0]?.address}.${smartWalletContractName}`)
          setUserData({ addresses: data, bnsnames, sws: swsres })
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

  const handleGetName = async (address: string | undefined) => {
    if (!address) return

    let namesres = await axios.get(`https://api.bnsv2.com/names/address/${address}/valid`)
    namesres = namesres?.data?.names
    let namemetares = await handleGetNftMeta('SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2', 1)
    return { ...namesres, ...namemetares }
  }

  const handleGetNftMeta = async (contract: string, id: number) => {
    const res = (await axios.get(`https://api.hiro.so/metadata/v1/nft/${contract}/${id}`)).data
    console.log({ res })
    return res?.metadata
  }

  const handleSWS = async (contractId: string) => {
    let contractInfo = (await axios.get(`https://api.hiro.so/extended/v2/smart-contracts/status?contract_id=${contractId}`)).data
    contractInfo = contractInfo?.[contractId]
    console.log({ contractInfo })
    return { found: contractInfo?.found, ...contractInfo?.result }
  }

  const handleSignIn = async () => {
    setLoading(true)

    request({ forceWalletSelect: true }, 'getAddresses')
      .then(async () => {
        const addresses: Accounts = getLocalStorage()?.addresses
        const bnsnames = await handleGetName(addresses?.stx?.[0]?.address);
        const swsres = await handleSWS(`${addresses?.stx?.[0]?.address}.${smartWalletContractName}`)
        setUserData({ addresses, bnsnames: bnsnames, sws: swsres })
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
        handleSWS,
        handleGetName
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
