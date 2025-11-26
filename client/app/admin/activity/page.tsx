'use client'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { apiRequest } from '../../lib/api'

interface ActivityEntry {
  id: string
  message: string
  timestamp: string
}

export default function AdminActivity() {
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadActivities()
    const interval = setInterval(loadActivities, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadActivities = async () => {
    try {
      const data = await apiRequest('/api/activity')
      setActivities(data)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleString()
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Real-time system activities and events</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-xs text-gray-500">Auto-refreshes every 5 seconds</span>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">No activity yet</div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}