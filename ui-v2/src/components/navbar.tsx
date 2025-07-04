"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Wallet, Menu, X, ChevronDown, Bell } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAuth } from "../lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx"
import { Badge } from "../components/ui/badge.tsx"
import { ConnectWalletButton } from "../components/connect-wallet-button.tsx"
import { StacksNetworks } from "@stacks/network"
import type { SmartWallet } from "../lib/types.ts"

export function Navbar() {
  const { address } = useParams<SmartWallet>()
  const route = useNavigate()
  const { authenticated, handleSignOut, userData, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div className="w-full bg-yellow-500/10 py-2 px-4 text-center text-sm">
        <span className="inline-flex items-center">
          <Badge variant="outline" className="mr-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            BETA
          </Badge>
          Smart Wallet is currently in beta. Beware of scam apps claiming to be Smart Wallet in app stores.
        </span>
      </div>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-gray-800" : "bg-transparent"
          }`}
      >
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <Link className="flex items-center justify-center mr-6" to="/">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full blur-sm bg-primary/30"></div>
                <Wallet className="h-6 w-6 relative" />
              </div>
              <span className="font-bold text-xl ml-2 crypto-gradient-text">Smart Wallet</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {/* <Link className="text-sm font-medium hover:text-primary transition-colors" to="/feat">
                Features
              </Link> */}
              <Link className="text-sm font-medium hover:text-primary transition-colors" to="/docs">
                Documentation
              </Link>
              <div className="relative group">
                <button className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                  Products <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-900 border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link className="block px-4 py-2 text-sm hover:bg-gray-800" to="#">
                    Smart Wallet Extension
                  </Link>
                  <Link className="block px-4 py-2 text-sm hover:bg-gray-800" to="#">
                    Desktop App
                  </Link>
                  <Link className="block px-4 py-2 text-sm hover:bg-gray-800" to="#">
                    Mobile App (Coming Soon)
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                  Network <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-900 border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {StacksNetworks.map((network) => (
                    <Link className="block px-4 py-2 text-sm hover:bg-gray-800 capitalize" to={`?network=${network}`} key={network}>
                      {network}
                    </Link>
                  ))}
                </div>
              </div>
              <Link className="text-sm font-medium hover:text-primary transition-colors" to="/support">
                Support
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {!authenticated && !loading && (
              <Link to="docs" className="hidden md:block">
                <Button variant="outline" size="sm" className="crypto-button-outline">
                  Docs
                </Button>
              </Link>
            )}
            {authenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    2
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={userData?.bnsnames?.cached_thumbnail_image} alt={userData?.bnsnames?.[0]?.full_name || "User"} />
                        <AvatarFallback className="bg-gray-800">
                          {userData?.bnsnames?.[0]?.full_name.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-1 crypto-card text-white/30" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userData?.bnsnames?.[0]?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userData?.addresses?.stx?.[0]?.address.slice(0, 4)}...{userData?.addresses?.stx?.[0]?.address.slice(-4)}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <div className="crypto-divider my-1"></div>
                    <DropdownMenuItem asChild className="focus:bg-gray-800">
                      <Link to="/dashboard" className="flex items-center">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => route(`/dashboard/wallets/${address}/settings`)} className="focus:bg-gray-800">
                      Settings
                    </DropdownMenuItem>
                    <div className="crypto-divider my-1"></div>
                    <DropdownMenuItem onClick={handleSignOut} className="focus:bg-gray-800">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <ConnectWalletButton />
            )}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-gray-800 py-4">
            <nav className="flex flex-col space-y-4 px-4">
              {/* <Link className="text-sm font-medium hover:text-primary transition-colors" to="#">
                Features
              </Link> */}
              <Link className="text-sm font-medium hover:text-primary transition-colors" to="/docs">
                Documentation
              </Link>
              <details className="group">
                <summary className="flex cursor-pointer items-center text-sm font-medium hover:text-primary transition-colors">
                  Products{" "}
                  <ChevronDown className="h-4 w-4 ml-1 opacity-70 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2 ml-4 space-y-2">
                  <Link className="block text-sm hover:text-primary" to="#">
                    Smart Wallet Extension
                  </Link>
                  <Link className="block text-sm hover:text-primary" to="#">
                    Desktop App
                  </Link>
                  <Link className="block text-sm hover:text-primary" to="#">
                    Mobile App (Coming Soon)
                  </Link>
                </div>
              </details>
              <Link className="text-sm font-medium hover:text-primary transition-colors" to="/support">
                Support
              </Link>
              {!authenticated && !loading && (
                <Link to="/docs">
                  <Button variant="outline" size="sm" className="w-full crypto-button-outline">
                    Docs
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
