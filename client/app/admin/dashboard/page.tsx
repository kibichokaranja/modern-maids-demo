'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { apiRequest } from '../../lib/api'

interface Stats {
  totalJobs: number
  scheduledJobs: number
  inProgressJobs: number
  completedJobs: number
  activeCleaners: number
  totalCleaners: number
  completionRate: string
}

interface Job {
  id: string
  customerName: string
  address: string
  serviceType: string
  scheduledDate: string
  scheduledTime: string
  status: string
  assignedCleanerId: string | null
  createdAt: string
}

interface Cleaner {
  id: string
  name: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsData, jobsData, cleanersData] = await Promise.all([
        apiRequest('/api/dashboard/stats'),
        apiRequest('/api/jobs'),
        apiRequest('/api/cleaners'),
      ])
      setStats(statsData)
      const sortedJobs = jobsData.sort((a: Job, b: Job) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setRecentJobs(sortedJobs.slice(0, 5))
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading || !stats) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of cleaning operations</p>
          </div>
          <Link
            href="/admin/jobs"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Create Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Scheduled</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.scheduledJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgressJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedJobs}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Active Cleaners</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeCleaners} / {stats.totalCleaners}
            </p>
            <p className="text-xs text-gray-500 mt-1">Currently working</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Jobs completed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Quick Actions</p>
            <div className="mt-3 space-y-2">
              <Link
                href="/admin/jobs"
                className="block w-full bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 transition-colors text-center"
              >
                View All Jobs
              </Link>
              <Link
                href="/admin/cleaners"
                className="block w-full bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 transition-colors text-center"
              >
                Manage Cleaners
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <Link
              href="/admin/jobs"
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              View All 
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaner</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No jobs yet
                    </td>
                  </tr>
                ) : (
                  recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{job.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.serviceType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.scheduledDate).toLocaleDateString()} {job.scheduledTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCleanerName(job.assignedCleanerId)}</td>
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