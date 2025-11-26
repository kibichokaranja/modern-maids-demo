'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    
    if (user) {
      router.replace(user.role === 'admin' ? '/admin/dashboard' : '/cleaner/dashboard')
    } else {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  return null
}