import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { FaUsers, FaLink, FaMousePointer, FaTrash } from 'react-icons/fa'

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${backendBase}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setStats(res.data.data)
        setError('')
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err.response?.data?.message || 'Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) {
      fetchStats()
    }
  }, [user, backendBase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, bgColor, textColor }) => (
    <div className={`rounded-lg p-6 text-white shadow-lg ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <Icon className="w-12 h-12 opacity-30" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-10">
      <div className="mx-auto max-w-7xl">
       
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Platform overview and management</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={FaUsers}
            label="Total Users"
            value={stats?.users.total || 0}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            textColor="text-blue-600"
          />
          <StatCard
            icon={FaUsers}
            label="Active Users"
            value={stats?.users.active || 0} 
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
            textColor="text-green-600"
          />
          <StatCard
            icon={FaLink}
            label="Total URLs"
            value={stats?.urls.total || 0}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            textColor="text-purple-600"
          />
          <StatCard
            icon={FaMousePointer}
            label="Total Clicks"
            value={stats?.clicks.total || 0}
            bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
            textColor="text-orange-600"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600">Blocked Users</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats?.users.blocked || 0}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600">Deleted URLs</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.urls.deleted || 0}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600">Malicious URLs</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.urls.malicious || 0}</p>
          </div>
        </div>

        
        {stats?.dailyUrls && stats.dailyUrls.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">URLs Created (Last 7 Days)</h2>
            <div className="flex items-end gap-2 h-48">
              {stats.dailyUrls.map((day) => (
                <div key={day._id} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition"
                    style={{ height: `${Math.max(day.count * 20, 30)}px` }}
                    title={`${day.count} URLs`}
                  ></div>
                  <p className="text-xs text-slate-600 mt-2 text-center truncate">{day._id}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats?.topUsers && stats.topUsers.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Top Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">URLs Created</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Total Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topUsers.map((user) => (
                    <tr key={user.userId} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-900">{user.userName}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{user.userEmail}</td>
                      <td className="py-3 px-4 text-sm text-center text-indigo-600 font-semibold">{user.urlCount}</td>
                      <td className="py-3 px-4 text-sm text-center text-slate-600">{user.totalClicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
