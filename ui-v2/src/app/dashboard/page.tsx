"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Wallet } from "lucide-react"
import { Navbar } from "../../components/navbar"
import { useAuth } from "../../lib/auth-provider"
// import ProtectedRoute from "../../components/protected-route"

export default function Dashboard() {
  const router = useNavigate()
  const { userData } = useAuth()

  useEffect(() => {
    const sws_found = userData?.sws?.found
    if (sws_found) {
      router("/dashboard/wallets/1")
    } else {
      router("/dashboard/no-wallets")
    }
  }, [router])

  return (
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
  )
}
