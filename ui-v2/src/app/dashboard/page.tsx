import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Wallet } from "lucide-react"
import { Navbar } from "../../components/navbar"
import { smartWalletContractName, useAuth } from "../../lib/auth-provider"
import ProtectedRoute from "../../components/protected-route"

export default function Dashboard() {
  const router = useNavigate()
  const { address } = useParams<{ address: string }>()
  const { userData, handleCCS } = useAuth()

  useEffect(() => {
    const init_cc = async () => {
      const usca = `${userData?.addresses?.stx?.[0]?.address}.${smartWalletContractName}`
      const sws = await handleCCS(address, `${address || usca}`) || { found: false }
      console.log({ address, sws, usca, checking: address || usca })
      if (sws?.found) {
        router(`/dashboard/wallets/${address || usca}`)
      } else {
        router("/dashboard/no-wallets")
      }
    }
    init_cc();
  }, [router, userData])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-black crypto-blur-bg">
          <div className="text-center">
            <div className="inline-block rounded-full bg-gray-800 p-3 mb-4">
              <Wallet className="h-6 w-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Loading your wallets...</h2>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
