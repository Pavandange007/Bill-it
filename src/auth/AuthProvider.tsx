import React from 'react'
import * as authClient from './authClient'
import type { ApiUser } from './authClient'

export interface AuthContextValue {
  user: ApiUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext missing')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = React.useState<ApiUser | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const refresh = React.useCallback(async () => {
    try {
      const next = await authClient.me()
      setUser(next)
    } catch {
      setUser(null)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        await refresh()
      } finally {
        if (isMounted) setIsLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [refresh])

  const login = React.useCallback(async (email: string, password: string) => {
    const u = await authClient.login(email, password)
    setUser(u)
  }, [])

  const signup = React.useCallback(async (email: string, password: string) => {
    const u = await authClient.signup(email, password)
    setUser(u)
  }, [])

  const logout = React.useCallback(async () => {
    await authClient.logout()
    setUser(null)
  }, [])

  const value: AuthContextValue = { user, isLoading, login, signup, logout, refresh }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

