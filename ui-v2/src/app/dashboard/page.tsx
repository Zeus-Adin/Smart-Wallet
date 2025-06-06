import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Wallet } from "lucide-react"
import { Navbar } from "../../components/navbar"
import { useAuth } from "../../lib/auth-provider"
import ProtectedRoute from "../../components/protected-route"

const smartWalletContractName = 'smart-wallet'
export default function Dashboard() {
  const router = useNavigate()
  const { userData, handleCCS } = useAuth()

  useEffect(() => {
    const init_cc = async () => {
      const address = userData?.addresses?.stx?.[0]?.address
      const swaddress = `${address}.${smartWalletContractName}`
      const sws = await handleCCS(address, swaddress) || { found: false }
      console.log({ address, swaddress, sws })
      if (sws?.found) {
        router(`/dashboard/wallets/${swaddress}`)
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
