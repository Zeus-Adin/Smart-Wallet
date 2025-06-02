"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { useAuth } from "../lib/auth-provider"

export function ConnectWalletButton() {
  const { handleSignIn, loading } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)

  const onClick = async () => {
    if (loading || isConnecting) return

    setIsConnecting(true)
    try {
      handleSignIn()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button onClick={onClick} className="crypto-button" disabled={loading || isConnecting}>
      {loading || isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
