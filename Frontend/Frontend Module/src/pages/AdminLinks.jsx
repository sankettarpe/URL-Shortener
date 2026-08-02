import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { FaSearch, FaTrash, FaCheck } from 'react-icons/fa'

const AdminLinks = () => {
  const { user } = useContext(AuthContext)
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [isMalicious, setIsMalicious] = useState(false)
  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const fetchLinks = async (pageNum = 1) => {
    try {
      setLoading(true)
      let url = `${backendBase}/api/admin/urls?page=${pageNum}&limit=15`

      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      setLinks(res.data.data)
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages)
        setPage(pageNum)
      }
      setError('')
    } catch (err) {
      console.error('Error fetching links:', err)
      setError(err.response?.data?.message || 'Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchLinks(1)
    }
  }, [user?.token])

  const handleFilter = () => {
    fetchLinks(1)
  }

  const handleDeleteLink = async () => {
    if (!selectedLink || !deleteReason.trim()) {
      setError('Please provide a deletion reason')
      return
    }

    try {
      await axios.delete(`${backendBase}/api/admin/urls/${selectedLink._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        data: {
          reason: deleteReason,
          isMalicious
        }
      })
      fetchLinks(page)
      setDeleteModal(false)
      setSelectedLink(null)
      setDeleteReason('')
      setIsMalicious(false)
      setError('')
    } catch (err) {
      console.error('Error deleting link:', err)
      setError(err.response?.data?.message || 'Failed to delete link')
    }
  }

  const openDeleteModal = (link) => {
    setSelectedLink(link)
    setDeleteModal(true)
    setDeleteReason('')
    setIsMalicious(false)
  }

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Links Management</h1>
          <p className="mt-2 text-slate-600">Manage all shortened URLs and delete malicious links</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Apply Filter
              </button>
              <button
                onClick={() => {
                  setStartDate('')
                  setEndDate('')
                  fetchLinks(1)
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        
        <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
          {links.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No links found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Short URL</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Created By</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Clicks</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 truncate block"
                          title={link.shortUrl}
                        >
                          {link.shortUrl.split('/').pop()}
                        </a>
                        <p className="text-xs text-slate-500 mt-1 truncate">{link.originalUrl}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <p className="text-slate-900 font-medium">{link.user.name}</p>
                        <p className="text-xs text-slate-500">{link.user.email}</p>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-semibold text-slate-900">
                        {link.clicks}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-slate-600">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openDeleteModal(link)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <FaTrash /> Delete
                        </button>
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
              onClick={() => fetchLinks(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchLinks(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        )}

        {deleteModal && selectedLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaWarning className="text-3xl text-red-600" />
                <h2 className="text-2xl font-bold text-slate-900">Delete Link</h2>
              </div>

              <div className="mb-4 p-3 bg-slate-100 rounded-lg">
                <p className="text-sm text-slate-600">Short URL:</p>
                <p className="text-slate-900 font-mono text-sm break-all">{selectedLink.shortUrl}</p>
                <p className="text-sm text-slate-600 mt-2">Original URL:</p>
                <p className="text-slate-900 text-sm break-all truncate">{selectedLink.originalUrl}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deletion Reason</label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Enter reason for deletion..."
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMalicious}
                    onChange={(e) => setIsMalicious(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">Mark as malicious</span>
                </label>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleDeleteLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  <FaTrash /> Delete Link
                </button>
                <button
                  onClick={() => {
                    setDeleteModal(false)
                    setSelectedLink(null)
                    setDeleteReason('')
                    setIsMalicious(false)
                  }}
                  className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLinks
