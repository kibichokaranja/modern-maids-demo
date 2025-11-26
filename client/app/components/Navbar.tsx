'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const isAdmin = user.role === 'admin'
  const isCleaner = user.role === 'cleaner'

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/jobs', label: 'Jobs' },
    { href: '/admin/cleaners', label: 'Cleaners' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/timesheets', label: 'Timesheets' },
    { href: '/admin/activity', label: 'Activity Log' },
  ]

  const cleanerLinks = [
    { href: '/cleaner/dashboard', label: 'Dashboard' },
  ]

  const links = isAdmin ? adminLinks : cleanerLinks

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={isAdmin ? '/admin/dashboard' : '/cleaner/dashboard'} className="text-xl font-bold text-green-600">
              Modern Maids
            </Link>
            <div className="flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}