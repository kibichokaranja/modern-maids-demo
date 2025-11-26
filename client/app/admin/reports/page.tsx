'use client'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { apiRequest } from '../../lib/api'

interface Job {
  id: string
  customerName: string
  address: string
  serviceType: string
  scheduledDate: string
  scheduledTime: string
  status: string
  assignedCleanerId: string | null
  checkInTime: string | null
  checkOutTime: string | null
  completedAt: string | null
  createdAt: string
}

interface Cleaner {
  id: string
  name: string
}

export default function AdminReports() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [jobsData, cleanersData] = await Promise.all([
        apiRequest('/api/jobs/completed'),
        apiRequest('/api/cleaners'),
      ])
      setJobs(jobsData)
      setCleaners(cleanersData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCleanerName = (cleanerId: string | null) => {
    if (!cleanerId) return 'Unassigned'
    const cleaner = cleaners.find(c => c.id === cleanerId)
    return cleaner?.name || 'Unknown'
  }

  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return 'N/A'
    const duration = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60)
    return `${duration.toFixed(1)} hours`
  }

  const filterJobs = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return jobs.filter(job => {
      if (!job.completedAt) return false
      const completedDate = new Date(job.completedAt)

      switch (filter) {
        case 'today':
          return completedDate >= today
        case 'week':
          return completedDate >= weekAgo
        case 'month':
          return completedDate >= monthAgo
        default:
          return true
      }
    })
  }

  const filteredJobs = filterJobs()

  const stats = {
    total: filteredJobs.length,
    totalHours: filteredJobs.reduce((sum, job) => {
      if (job.checkInTime && job.checkOutTime) {
        const hours = (new Date(job.checkOutTime).getTime() - new Date(job.checkInTime).getTime()) / (1000 * 60 * 60)
        return sum + hours
      }
      return sum
    }, 0),
    avgDuration: filteredJobs.length > 0
      ? filteredJobs.reduce((sum, job) => {
          if (job.checkInTime && job.checkOutTime) {
            const hours = (new Date(job.checkOutTime).getTime() - new Date(job.checkInTime).getTime()) / (1000 * 60 * 60)
            return sum + hours
          }
          return sum
        }, 0) / filteredJobs.filter(j => j.checkInTime && j.checkOutTime).length
      : 0,
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
          <h1 className="text-3xl font-bold text-gray-900">Completed Job Reports</h1>
          <p className="text-gray-600 mt-1">View completed cleaning jobs and performance metrics</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-2">
            {(['all', 'today', 'week', 'month'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Completed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Hours</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Avg Duration</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.avgDuration.toFixed(1)} hrs</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Completed Jobs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No completed jobs found
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.serviceType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCleanerName(job.assignedCleanerId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateDuration(job.checkInTime, job.checkOutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}