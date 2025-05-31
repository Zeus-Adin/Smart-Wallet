import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { connect, disconnect, isConnected, getLocalStorage, request } from "@stacks/connect"

interface AuthContextType {
  userData: object | null
  authenticated: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<object | null>(null)
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
          const data: object | null = getLocalStorage();
          setUserData(data)
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

  const handleSignIn = async () => {
    setLoading(true)

    request({ forceWalletSelect: true }, 'getAddresses')
      .then((res) => {
        console.log({ res });
        setUserData(res)
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
      setUserData(null)
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
        handleSignIn,
        handleSignOut,
        loading,
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
