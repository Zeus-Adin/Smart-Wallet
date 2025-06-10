"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Copy, Shield, Wallet, BarChart3, Zap, Settings, PlusCircle, ChevronDown, SwitchCamera, } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Badge } from "../../../../components/ui/badge"
import ProtectedRoute from "../../../../components/protected-route"
import { useAuth } from "../../../../lib/auth-provider"
import { Navbar } from "../../../../components/navbar"
import { presetContracts } from "../../../../lib/constants"
import SendTab from "./sendtab"
import AssetsTab from "./assetstab"
import ExtensionTab from "./extensiontab"
import ActivitiesTab from "./activitiestab"
import InfoTab from "./infotab"
import type { Balance, UsersData } from "../../../../lib/types"
import DepositTab from "./deposittab"
import NftTab from "./nfttab"

interface Wallet {
  id: number
  name: string
  address: string
  balance: number // if you want to keep the formatted string like "125.75 STX"
  usdBalance: number // also formatted like "$156.25"
  type: string
  signers: number
  threshold: number
}

export default function WalletDashboard() {
  const router = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') ?? 'assets'
  const { address } = useParams<{ address: string }>();
  const [copiedStx, setStxCopied] = useState(false)
  const [copiedBtc, setBtcCopied] = useState(false)
  const [switchBtc, setSwitchBtc] = useState(0)
  const [wallet, setWallet] = useState<UsersData | undefined>()
  const [walletBalance, setWalletBalance] = useState<Balance>()
  const { userData, balance, rates, handleGetBalance, getRates } = useAuth()

  // Find the wallet with the matching ID
  const refresh = async () => {
    if (address) {
      handleGetBalance(address, '', 0)
      setWallet(userData)
    }
  }

  const copyStxToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setStxCopied(true)
      setTimeout(() => setStxCopied(false), 2000)
    }
  }

  const copyBtcToClipboard = () => {
    const btcAddress = userData?.addresses?.btc?.[0]?.address
    if (btcAddress) {
      navigator.clipboard.writeText(btcAddress)
      setBtcCopied(true)
      setTimeout(() => setBtcCopied(false), 2000)
    }
  }


  useEffect(() => {
    refresh()
    getRates()
  }, [userData, address])

  useEffect(() => {
    setWalletBalance(balance)
  }, [balance, rates, wallet])

  useEffect(() => {
    console.log({ switchBtc })
  }, [switchBtc])

  if (!wallet) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-black crypto-blur-bg">
            <div className="text-center">
              <div className="inline-block rounded-full bg-gray-800 p-3 mb-4">
                <Wallet className="h-6 w-6 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Loading wallet...</h2>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-black crypto-blur-bg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="flex items-center gap-2 text-white/30">
              <h1 className="text-2xl font-bold">{presetContracts[0]?.name}</h1>
              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                {wallet?.addresses?.stx?.[0]?.symbol}
              </Badge>
            </div>
            <p className="text-gray-400">Manage your assets and transactions</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="crypto-button-outline text-white/30">
                  Switch Wallet <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800">
                <DropdownMenuItem className="cursor-pointer "
                  onClick={() => router(`/dashboard/wallets/${address}`)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white/30">Personal Wallet</span>
                    <span className="text-xs text-gray-400">
                      {balance?.stxBalance?.actual_balance} ≈ {(balance?.stxBalance?.actual_balance * rates?.['stx']?.current_price)?.toFixed(4)} USD
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer border-t border-gray-800 mt-1 pt-1 text-white/30"
                  onClick={() => router("/dashboard/create-wallet")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create New Wallet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="crypto-button-outline text-white/30"
              onClick={() => router(`/dashboard/wallets/${address}/settings`)}
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="crypto-card-highlight hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/30">Wallet Address</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold truncate max-w-[180px] text-gray-400">{address}</div>
                <Button variant="ghost" size="icon" onClick={copyStxToClipboard} className="hover:bg-gray-800">
                  {copiedStx
                    ? <span className="text-xs text-primary">Copied!</span>
                    : <Copy className="h-4 w-4 text-white" />
                  }
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold truncate max-w-[180px] text-gray-400">{userData?.addresses?.btc?.[switchBtc]?.address}</div >
                <div>
                  <Button variant="ghost" size="icon" onClick={() => setSwitchBtc((res: number) => {
                    if (!userData?.addresses?.btc?.length) return 0
                    let result = res + 1
                    if (result > userData?.addresses?.btc?.length - 1) {
                      result = 0
                    }
                    return result
                  })} className="hover:bg-gray-800">
                    {copiedBtc
                      ? <span className="text-xs text-primary">switched!</span>
                      : <SwitchCamera className="h-4 w-4 text-white" />
                    }
                  </Button>
                  <Button variant="ghost" size="icon" onClick={copyBtcToClipboard} className="hover:bg-gray-800">
                    {copiedBtc ? <span className="text-xs text-primary">copied!</span> : <Copy className="h-4 w-4 text-white" />}
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  Active
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {presetContracts[0]?.threshold} of {presetContracts[0]?.signers} Signatures
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="crypto-card-highlight hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/30">Total Balance</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-1">
                <p className="text-2xl font-bold crypto-gradient-text flex gap-1">
                  {(Number(walletBalance?.stxBalance?.actual_balance ?? 0))?.toFixed(4)}
                  <span className="text-xs text-gray-400 mt-2">STX</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">≈ {
                  (
                    Number(walletBalance?.stxBalance?.actual_balance ?? 0) *
                    Number(rates?.['stx']?.current_price ?? 0)
                  ).toFixed(2)
                } USD</p>
              </div>
              <div className="flex gap-1">
                <p className="text-xs font-light text-transparent bg-clip-text bg-gradient-to-r from-[#f7931a] via-[#ffac33] to-[#ffe07d]">
                  {walletBalance?.sbtcBalance?.actual_balance ?? 0} sBTC
                </p>
                <p className="text-xs text-gray-400">≈ {
                  (
                    Number(walletBalance?.sbtcBalance?.actual_balance ?? 0) *
                    Number(rates?.['btc']?.current_price ?? 0)
                  ).toFixed(2)
                } USD</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Zap className="h-3 w-3 mr-1" /> Rate {(rates?.['stx']?.current_price ?? 0)?.toFixed(2)} USD/STX
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Zap className="h-3 w-3 mr-1" /> Rate {(rates?.['btc']?.current_price ?? 0)?.toLocaleString()} USD/BTC
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="crypto-card-highlight hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white/30">Protected</div>
              <p className="text-xs text-gray-400 mt-1">Recovery keys configured</p>
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  <Shield className="h-3 w-3 mr-1" /> Secure
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assets" value={currentTab} className="space-y-4" onValueChange={(val) => {
          searchParams.set('tab', val)
          setSearchParams(searchParams)
        }}>
          <TabsList className="crypto-tab-list grid w-full grid-cols-5 bg-gray-900/50 p-1 rounded-lg">
            <TabsTrigger value="assets" className="crypto-tab data-[state=active]:crypto-tab-active">
              Assets
            </TabsTrigger>
            <TabsTrigger value="send" className="crypto-tab data-[state=active]:crypto-tab-active">
              Send
            </TabsTrigger>
            <TabsTrigger value="extension" className="crypto-tab data-[state=active]:crypto-tab-active">
              Extension
            </TabsTrigger>
            <TabsTrigger value="activity" className="crypto-tab data-[state=active]:crypto-tab-active">
              Activity
            </TabsTrigger>
            <TabsTrigger value="info" className="crypto-tab data-[state=active]:crypto-tab-active">
              Info
            </TabsTrigger>
          </TabsList>

          <AssetsTab />
          <SendTab />
          <ExtensionTab />
          <ActivitiesTab />
          <InfoTab />
          c<DepositTab />
          <NftTab />
        </Tabs>
      </main>
    </div>
  )
}
