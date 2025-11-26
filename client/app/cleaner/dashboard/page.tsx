'use client'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
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
}

export default function CleanerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [completedJobs, setCompletedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingJobId, setProcessingJobId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id])

  const loadData = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const [allJobs, completed] = await Promise.all([
        apiRequest('/api/jobs'),
        apiRequest('/api/jobs/completed'),
      ])
      const myJobs = allJobs.filter((job: Job) => job.assignedCleanerId === user.id)
      const myCompleted = completed.filter((job: Job) => job.assignedCleanerId === user.id)
      setJobs(myJobs)
      setCompletedJobs(myCompleted)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckIn = async (jobId: string) => {
    setProcessingJobId(jobId)
    try {
      await apiRequest(`/api/jobs/${jobId}/checkin`, { method: 'POST' })
      await loadData()
    } catch (error: any) {
      alert(error.message || 'Failed to check in')
    } finally {
      setProcessingJobId(null)
    }
  }

  const handleCheckOut = async (jobId: string) => {
    setProcessingJobId(jobId)
    try {
      await apiRequest(`/api/jobs/${jobId}/checkout`, { method: 'POST' })
      await loadData()
    } catch (error: any) {
      alert(error.message || 'Failed to check out')
    } finally {
      setProcessingJobId(null)
    }
  }

  const handleComplete = async (jobId: string) => {
    setProcessingJobId(jobId)
    try {
      await apiRequest(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Completed' }),
      })
      await loadData()
    } catch (error: any) {
      alert(error.message || 'Failed to complete job')
    } finally {
      setProcessingJobId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: jobs.length,
    scheduled: jobs.filter(j => j.status === 'Scheduled').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    completed: completedJobs.length,
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Your cleaning job schedule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs assigned yet</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{job.customerName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.serviceType}</p>
                      <p className="text-sm text-gray-500 mt-1">{job.address}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span> {new Date(job.scheduledDate).toLocaleDateString()}</span>
                        <span> {job.scheduledTime}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  {job.checkInTime && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                       Checked in at {new Date(job.checkInTime).toLocaleTimeString()}
                    </div>
                  )}
                  {job.checkOutTime && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                       Checked out at {new Date(job.checkOutTime).toLocaleTimeString()}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {job.status === 'Scheduled' && !job.checkInTime && (
                      <button
                        onClick={() => handleCheckIn(job.id)}
                        disabled={processingJobId === job.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingJobId === job.id ? 'Processing...' : 'Check In'}
                      </button>
                    )}
                    {job.status === 'In Progress' && job.checkInTime && !job.checkOutTime && (
                      <>
                        <button
                          onClick={() => handleCheckOut(job.id)}
                          disabled={processingJobId === job.id}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingJobId === job.id ? 'Processing...' : 'Check Out'}
                        </button>
                        <button
                          onClick={() => handleComplete(job.id)}
                          disabled={processingJobId === job.id}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingJobId === job.id ? 'Processing...' : 'Mark Complete'}
                        </button>
                      </>
                    )}
                    {job.status === 'In Progress' && !job.checkInTime && (
                      <button
                        onClick={() => handleCheckIn(job.id)}
                        disabled={processingJobId === job.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingJobId === job.id ? 'Processing...' : 'Check In'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {completedJobs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Completed</h2>
            <div className="space-y-3">
              {completedJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{job.customerName}</p>
                      <p className="text-sm text-gray-500">{job.serviceType}</p>
                      {job.completedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Completed: {new Date(job.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}