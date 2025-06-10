"use client"

import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft, Wallet, } from "lucide-react"
import { Button } from "../../../../../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../../../..//components/ui/tabs"
import ProtectedRoute from "../../../../..//components/protected-route"
import { Navbar } from "../../../../..//components/navbar"
import { useAuth } from "../../../../../lib/auth-provider"
import AdvancedTab from "./advanced"


export default function WalletSettings() {
  const router = useNavigate()
  const { address } = useParams<{ address: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('settings') ?? 'advanced'
  const { walletInfo, getWalletInfo } = useAuth()

  const refresh = async () => {
    if (!address) {
      router('/dashboard/no-wallets')
      return
    }
    await getWalletInfo(address)
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!walletInfo?.found) {
      router('/dashboard/no-wallets')
    }
  }, [walletInfo])

  if (!walletInfo) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-black crypto-blur-bg">
            <div className="text-center">
              <div className="inline-block rounded-full bg-gray-800 p-3 mb-4">
                <Wallet className="h-6 w-6 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Loading wallet settings...</h2>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col p-4 md:p-8 bg-black crypto-blur-bg">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-2 text-gray-400 hover:text-white"
              onClick={() => router(`/dashboard/wallets/${address}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{walletInfo.name} Settings</h1>
                <p className="text-gray-400">Manage your wallet configuration and security</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="advanced" value={currentTab} className="space-y-6" onValueChange={(val) => {
            searchParams.set('settings', val);
            setSearchParams(searchParams);
          }}>
            <TabsList className="crypto-tab-list grid w-full grid-cols-3 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger disabled value="general" className="crypto-tab data-[state=active]:crypto-tab-active">
                General
              </TabsTrigger>
              <TabsTrigger disabled value="admins" className="crypto-tab data-[state=active]:crypto-tab-active">
                Admins & Signers
              </TabsTrigger>
              <TabsTrigger value="advanced" className="crypto-tab data-[state=active]:crypto-tab-active">
                Advanced
              </TabsTrigger>
            </TabsList>




            <AdvancedTab />

          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
