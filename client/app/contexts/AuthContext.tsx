'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'cleaner'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return
    const isAuthPage = pathname === '/login'
    const isProtectedRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/cleaner')
    if (!user && isProtectedRoute) {
      router.push('/login')
    } else if (user && isAuthPage) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/cleaner/dashboard')
      }
    }
  }, [user, pathname, isLoading, router])

  const login = async (email: string, password: string) => {
    let API_URL = 'http://localhost:4002'
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        API_URL = 'http://localhost:4002'
      }
    }
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      let error
      try {
        error = await response.json()
      } catch {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      throw new Error(error.error || 'Login failed')
    }
    const data = await response.json()
    setToken(data.token)
    setUser(data.user)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
    }
    if (data.user.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/cleaner/dashboard')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}