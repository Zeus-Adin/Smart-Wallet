"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Copy, ExternalLink, Shield, Wallet, ArrowUpRight, ArrowDownRight, Clock, BarChart3, Zap, Settings, PlusCircle, ChevronDown, } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Badge } from "../../../../components/ui/badge"
import ProtectedRoute from "../../../../components/protected-route"
import { useAuth, type Balance, type UsersData } from "../../../../lib/auth-provider"
import { Navbar } from "../../../../components/navbar"
import { presetContracts } from "../../../../lib/constants"
import { useTx } from "../../../../lib/tx-provider"
import SendTab from "./sendtab"
import AssetsTab from "./assetstab"
import ExtensionTab from "./extensiontab"
import Activities from "./activities"

// Mock wallet data
type WalletType = "Personal" | "Multi-Signature"

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
const mockWallets: Wallet[] = [
  {
    id: 1,
    name: "Personal Wallet",
    address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    balance: 125.75,
    usdBalance: 156.25,
    type: "Personal",
    signers: 1,
    threshold: 1,
  },
  {
    id: 2,
    name: "Business Wallet",
    address: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
    balance: 2450.00,
    usdBalance: 3062.50,
    type: "Multi-Signature",
    signers: 3,
    threshold: 2,
  },
  {
    id: 3,
    name: "Savings Wallet",
    address: "SP2X0TZ59D5SZ8ACQ6PEHZ72CZQB8XFGDYB5SKE5Z",
    balance: 500.00,
    usdBalance: 625.00,
    type: "Personal",
    signers: 1,
    threshold: 1,
  },
]

export default function WalletDashboard() {
  const router = useNavigate()
  const { address } = useParams<{ address: string }>();
  const [wallet, setWallet] = useState<UsersData | undefined>(undefined)
  const [walletBalance, setWalletBalance] = useState<Balance>()
  const [walletAssets, setWalletAssets] = useState<any[]>([])
  const [walletTx, setWalletTx] = useState<[]>([])


  const [copied, setCopied] = useState(false)
  const { userData, balance, rates, handleGetBalance, getRates } = useAuth()
  const { swTx, handleGetSwTx } = useTx()

  // Find the wallet with the matching ID
  const refresh = async () => {
    if (address) {
      handleGetBalance(address, '', 0)
      setWallet(userData)
    }
  }
  useEffect(() => {
    console.log({ address })
    refresh()
    if (address) handleGetSwTx(address, 0)
    getRates()

  }, [userData, address])

  useEffect(() => {
    setWalletBalance(balance)
    const allBalances = [
      balance?.stxBalance,
      ...(balance?.ftBalance ?? []),
    ];
    console.log({ allBalances, balance })
    setWalletAssets(allBalances)
  }, [balance, rates])

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function stringToColor(str?: string): string {
    if (!str) return "hsl(0, 0%, 60%)"; // default neutral gray

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`; // bright and vibrant
  }

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
              <h1 className="text-2xl font-bold">{mockWallets[0]?.name}</h1>
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
                {mockWallets.map((w) => (
                  <DropdownMenuItem
                    key={w.id}
                    className={`cursor-pointer ${w.address === address ? "bg-gray-800" : ""}`}
                    onClick={() => router(`/dashboard/wallets/${w.id}`)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-white/30">{w.name}</span>
                      <span className="text-xs text-gray-400">{w.balance}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
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
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="hover:bg-gray-800">
                  {copied ? <span className="text-xs text-primary">Copied!</span> : <Copy className="h-4 w-4 text-white" />}
                </Button>
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
              <div className="text-2xl font-bold crypto-gradient-text">{walletBalance?.stxBalance?.actual_balance} {walletBalance?.stxBalance?.symbol}</div>
              <p className="text-xs text-gray-400 mt-2">≈ {walletBalance?.sbtcBalance?.balance ?? 0 / walletBalance?.sbtcBalance?.decimal} sBTC</p>
              <p className="text-xs text-gray-400 mt-2"> ≈ {(Number(walletBalance?.stxBalance.actual_balance) * rates?.['stx'].current_price)?.toFixed(4)} USD</p>
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Zap className="h-3 w-3 mr-1" /> Rate {rates?.['stx'].current_price ?? 0.00} | USD
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="crypto-card-highlight hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Protected</div>
              <p className="text-xs text-gray-400 mt-1">Recovery keys configured</p>
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  <Shield className="h-3 w-3 mr-1" /> Secure
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assets" className="space-y-4">
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
          <Activities txHistory={walletTx} />

        </Tabs>
      </main>
    </div>
  )
}
