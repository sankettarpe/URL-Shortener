import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { FaShieldAlt, FaFilter } from 'react-icons/fa'

const AuditLogs = () => {
  const { user } = useContext(AuthContext)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterAction, setFilterAction] = useState('')
  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const actionLabels = {
    BLOCK_USER: 'Block User',
    UNBLOCK_USER: 'Unblock User',
    PROMOTE_ADMIN: 'Promote Admin',
    DEMOTE_ADMIN: 'Demote Admin',
    DELETE_LINK: 'Delete Link',
    MARK_MALICIOUS: 'Mark Malicious',
    VIEW_USERS: 'View Users',
    VIEW_LINKS: 'View Links',
    VIEW_STATS: 'View Statistics',
    SEARCH_USERS: 'Search Users'
  }

  const getActionColor = (action) => {
    if (action.includes('BLOCK')) return 'bg-red-50 text-red-700'
    if (action.includes('PROMOTE') || action.includes('DEMOTE')) return 'bg-blue-50 text-blue-700'
    if (action.includes('DELETE') || action.includes('MALICIOUS')) return 'bg-orange-50 text-orange-700'
    return 'bg-slate-50 text-slate-700'
  }

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${backendBase}/api/admin/audit-logs?page=${page}&limit=15`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setLogs(res.data.data)
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages)
        }
        setError('')
      } catch (err) {
        console.error('Error fetching audit logs:', err)
        setError(err.response?.data?.message || 'Failed to load audit logs')
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) {
      fetchLogs()
    }
  }, [user, page, backendBase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Audit Logs</h1>
          <p className="mt-2 text-slate-600">Track all admin actions and activities</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <FaShieldAlt className="mx-auto w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-600">No audit logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Admin</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Target</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Details</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-slate-900">{log.admin?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{log.admin?.email || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {log.targetUser ? (
                          <div>
                            <p className="text-sm text-slate-900">{log.targetUser.name}</p>
                            <p className="text-xs text-slate-500">{log.targetUser.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {log.details || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === 'SUCCESS' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-slate-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogs
