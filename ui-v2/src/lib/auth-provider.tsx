import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { disconnect, isConnected, getLocalStorage, request } from "@stacks/connect"
import { defaultUrlFromNetwork, type StacksNetworkName } from '@stacks/network'
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import { sbtcMainnetAddress, sbtcTestnetAddress } from "./constants"
import type { Accounts, Balance, Cs, Info, UsersData } from "./types"
import { formatDistanceToNow } from "date-fns"

interface AuthContextType {
  userData: UsersData | undefined
  walletInfo: Info | undefined
  balance: Balance | undefined
  authUserBalance: Balance | undefined
  rates: any
  authenticated: boolean
  loading: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  handleGetSwBalance: (address: string, asset_identifiers: string | undefined, offset: number) => Promise<void>
  handleGetBalance: (address: string, asset_identifiers: string | undefined, offset: number) => Promise<void>
  getRates: () => Promise<any>
  handleCCS: (address: string | undefined, contractId: string, txinfo: boolean) => Promise<Cs>
  handleGetName: (address: string) => any
  handleGetMeta: (address: string | undefined, asset_identifiers: string, id: number, asset: 'ft' | 'nft') => Promise<any>
  handleGetClientConfig: (address: string | undefined) => { network?: StacksNetworkName, chain?: string, api?: string, explorer?: string }
  formatDecimals: (value: number | string, decimals: number, isUmicro: boolean) => string
  getWalletInfo: (address: string) => Promise<void>
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UsersData | undefined>(undefined)
  const [walletInfo, setWalletInfo] = useState<Info>()
  const [balance, setBalance] = useState<Balance>()
  const [authUserBalance, setAuthUserBalance] = useState<Balance>()
  const [rates, setRates] = useState<any>()
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams();
  const network = searchParams.get('network')
  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
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

    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [network])

  const handleGetClientConfig = (address: string | undefined) => {
    const network: StacksNetworkName = searchParams.get("network") || address?.startsWith('SP') ? 'mainnet' : 'testnet'
    const api: string | undefined = searchParams.get("api") || defaultUrlFromNetwork(network)
    const chain: string | undefined = searchParams.get("chain") || network
    const explorer: string | undefined = searchParams.get("explorer") || 'https://explorer.hiro.so/'
    return { network, chain, api, explorer }
  }

  const handleGetName = async (address: string | undefined) => {
    let namesres, namemetares

    try {
      namesres = await axios.get(`https://api.bnsv2.com/names/address/${address}/valid`)
      namesres = namesres?.data?.names
      const bnsname_contract = address?.startsWith('SP') ? 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2' : 'ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M.BNS-V2'
      namemetares = await handleGetMeta(address, bnsname_contract, 1, 'nft')
    } catch (error) {
      console.log({ error })
    }
    return { ...namesres, ...namemetares }
  }

  const handleGetMeta = async (address: string | undefined, asset_identifiers: string, id: number, asset: 'ft' | 'nft') => {
    let response
    try {
      const { api } = handleGetClientConfig(address)
      let res
      if (asset === 'ft') {
        res = (await axios.get(`${api}/metadata/v1/${asset}/${asset_identifiers}`)).data
        response = res
      } else {
        res = (await axios.get(`${api}/metadata/v1/${asset}/${asset_identifiers}/${id}`)).data
        response = res?.metadata
      }
    } catch (error) {
      console.log({ error })
    }
    return response
  }

  const handleCCS = async (address: string | undefined, contractId: string, txinfo: boolean) => {
    let contractInfo

    try {
      const { api } = handleGetClientConfig(address)
      contractInfo = (await axios.get(`${api}/extended/v2/smart-contracts/status?contract_id=${contractId}`)).data
      contractInfo = contractInfo?.[contractId]
      if (contractInfo?.result && txinfo) {
        const tx_info = (await axios.get(`${api}/extended/v1/tx/${contractInfo?.result?.tx_id}`)).data
        contractInfo = { ...contractInfo, tx_info }
      }
    } catch (error) {
      console.log({ error })
    }
    return contractInfo
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

  const formatDecimals = (value: number | string, decimals: number, isUmicro: boolean): string => {
    let result
    if (isUmicro) {
      result = (Number(value) * 10 ** decimals).toFixed(0);
    } else {
      result = (Number(value) / 10 ** decimals).toFixed(4);
    }
    return result
  }

  const handleGetSwBalance = async (address: string, asset_identifiers: string | undefined, offset: number) => {
    const { api, network } = handleGetClientConfig(address)
    const isMainnet = network === 'mainnet'
    const sbtcAddress = isMainnet ? sbtcMainnetAddress.split('.')[0] : sbtcTestnetAddress.split('.')[0]

    let stxBalance = (await axios.get(`${api}/extended/v2/addresses/${address}/balances/stx?offset=${offset}`))?.data
    const stxDecimal = 6
    stxBalance = { ...stxBalance, image: '/stx-logo.svg', decimals: stxDecimal, actual_balance: formatDecimals(stxBalance?.balance, stxDecimal, false), name: 'Stacks', symbol: 'STX' }

    const nftBalance = (await axios.get(`${api}/extended/v1/tokens/nft/holdings?principal=${address}&${asset_identifiers ? `asset_identifiers=${asset_identifiers}` : ''}&offset=${offset}&tx_metadata=true`))?.data?.results

    let ftBalance = (await axios.get(`${api}/extended/v2/addresses/${address}/balances/ft?offset=${offset}`))?.data?.results
    ftBalance = await Promise.all(ftBalance.map(async (res: { balance: string, token: string }) => {
      if (!res) return
      const tokenAddress = res?.token?.split('::')[0]
      const tokenMeta = await handleGetMeta(address, tokenAddress, 0, 'ft')
      const tokenMetadata = await axios.get(tokenMeta?.token_uri)
      return { ...res, ...tokenMeta, ...tokenMetadata?.data, actual_balance: formatDecimals(res?.balance ?? 0, tokenMeta?.decimals ?? 0, false) }
    }))

    const sbtcBalance = ftBalance.find((t: { sender_address: string }) => t.sender_address === sbtcAddress)

    const allBalances = [stxBalance, ...ftBalance,]

    setBalance({
      stxBalance,
      sbtcBalance,
      ftBalance,
      nftBalance,
      all: allBalances
    })
  }

  const handleGetBalance = async (address: string, asset_identifiers: string | undefined, offset: number) => {
    const { api, network } = handleGetClientConfig(address)
    const isMainnet = network === 'mainnet'
    const sbtcAddress = isMainnet ? sbtcMainnetAddress.split('.')[0] : sbtcTestnetAddress.split('.')[0]

    let stxBalance = (await axios.get(`${api}/extended/v2/addresses/${address}/balances/stx?offset=${offset}`))?.data
    const stxDecimal = 6
    stxBalance = { ...stxBalance, image: '/stx-logo.svg', decimals: stxDecimal, actual_balance: formatDecimals(stxBalance?.balance, stxDecimal, false), name: 'Stacks', symbol: 'STX' }

    const nftBalance = (await axios.get(`${api}/extended/v1/tokens/nft/holdings?principal=${address}&${asset_identifiers ? `asset_identifiers=${asset_identifiers}` : ''}&offset=${offset}&tx_metadata=true`))?.data?.results

    let ftBalance = (await axios.get(`${api}/extended/v2/addresses/${address}/balances/ft?offset=${offset}`))?.data?.results
    ftBalance = await Promise.all(ftBalance.map(async (res: { balance: string, token: string }) => {
      if (!res) return
      const tokenAddress = res?.token?.split('::')[0]
      const tokenMeta = await handleGetMeta(address, tokenAddress, 0, 'ft')
      const tokenMetadata = await axios.get(tokenMeta?.token_uri)
      return { ...res, ...tokenMeta, ...tokenMetadata?.data, actual_balance: formatDecimals(res?.balance ?? 0, tokenMeta?.decimals ?? 0, false) }
    }))

    const sbtcBalance = ftBalance.find((t: { sender_address: string }) => t.sender_address === sbtcAddress)

    const allBalances = [stxBalance, ...ftBalance,]

    setAuthUserBalance({
      stxBalance,
      sbtcBalance,
      ftBalance,
      nftBalance,
      all: allBalances
    })
  }

  const getRates = async () => {
    const response = (await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')).data;
    const formattedData = response.reduce((acc: any, item: any) => {
      if (!acc || !item) return
      acc[item.symbol] = item;
      return acc;
    }, {});
    setRates(formattedData)
  }

  const getWalletInfo = async (address: string) => {
    if (!address) return
    const wcc = await handleCCS(address, address, true)
    const date = new Date(wcc?.tx_info?.block_time_iso)
    const timeAgo = formatDistanceToNow(date, { addSuffix: true })
    setWalletInfo({
      name: address?.split('.')[1].replace('-', ' '),
      deployer: wcc?.tx_info?.sender_address,
      type: wcc?.tx_info?.tx_type.replace('_', ' '),
      sponsored: wcc?.tx_info?.sponsored,
      creation: timeAgo,
      owner: wcc?.tx_info?.sender_address,
      version: wcc?.tx_info?.smart_contract?.clarity_version,
      tx: wcc?.tx_info?.tx_id,
      status: wcc?.tx_info?.tx_status,
      found: wcc?.found,
      address: address
    })
  }

  return (
    <AuthContext.Provider
      value={{
        userData,
        walletInfo,
        balance,
        authUserBalance,
        rates,
        authenticated,
        loading,
        handleSignIn,
        handleSignOut,
        handleGetSwBalance,
        handleGetBalance,
        getRates,
        handleCCS,
        handleGetName,
        handleGetMeta,
        handleGetClientConfig,
        formatDecimals,
        getWalletInfo
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
