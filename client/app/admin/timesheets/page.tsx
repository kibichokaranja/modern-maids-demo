'use client'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { apiRequest } from '../../lib/api'

interface Timesheet {
  id: string
  cleanerId: string
  cleanerName: string
  date: string
  checkInTime: string
  checkOutTime: string | null
  totalHours: string
  jobsCompleted: number
  status: string
}

export default function AdminTimesheets() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'submitted' | 'in-progress'>('all')

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const data = await apiRequest('/api/timesheets')
      setTimesheets(data)
    } catch (error) {
      console.error('Failed to load timesheets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTimesheets = timesheets.filter(ts => {
    if (filter === 'submitted') return ts.status === 'Submitted'
    if (filter === 'in-progress') return ts.status === 'In Progress'
    return true
  })

  const totalHours = filteredTimesheets
    .filter(ts => ts.status === 'Submitted')
    .reduce((sum, ts) => sum + parseFloat(ts.totalHours || '0'), 0)

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
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600 mt-1">View and manage cleaner timesheets</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-2">
            {(['all', 'submitted', 'in-progress'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Timesheets</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{filteredTimesheets.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Hours (Submitted)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalHours.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Timesheets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimesheets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No timesheets found
                    </td>
                  </tr>
                ) : (
                  filteredTimesheets.map((timesheet) => (
                    <tr key={timesheet.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{timesheet.cleanerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(timesheet.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timesheet.checkInTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {timesheet.checkOutTime || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timesheet.totalHours || '0'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timesheet.jobsCompleted}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          timesheet.status === 'Submitted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {timesheet.status}
                        </span>
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