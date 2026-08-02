import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { FaSearch, FaTrash, FaBan, FaUnlock, FaEye } from 'react-icons/fa'

const AdminUsers = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const fetchUsers = async (pageNum = 1, search = '') => {
    try {
      setLoading(true)
      let url = `${backendBase}/api/admin/users?page=${pageNum}&limit=10`

      if (search) {
        url = `${backendBase}/api/admin/users/search?query=${search}`
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      setUsers(res.data.data)
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages)
        setPage(pageNum)
      }
      setError('')
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      if (searchQuery) {
        fetchUsers(1, searchQuery)
      } else {
        fetchUsers(page)
      }
    }
  }, [user?.token])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 0) {
      fetchUsers(1, query)
    } else {
      fetchUsers(1)
    }
  }

  const handleViewDetails = async (userId) => {
    try {
      const res = await axios.get(`${backendBase}/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setSelectedUser(res.data.data)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching user details:', err)
      setError(err.response?.data?.message || 'Failed to load user details')
    }
  }

  const handleBlockUnblock = async (userId, shouldBlock) => {
    try {
      const res = await axios.put(
        `${backendBase}/api/admin/users/${userId}/block`,
        { isBlocked: shouldBlock },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      fetchUsers(page)
      setShowModal(false)
      setError('')
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err.response?.data?.message || 'Failed to update user')
    }
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
      <div className="mx-auto max-w-6xl">
       
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Users Management</h1>
          <p className="mt-2 text-slate-600">Manage platform users and block/unblock access</p>
        </div>

        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

     
        <div className="mb-6 relative">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

 
        <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Mobile</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Joined</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{u.email}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{u.mobile || 'N/A'}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            u.isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 text-center">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleViewDetails(u._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <FaEye /> Views
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
              onClick={() => fetchUsers(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchUsers(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        )}

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedUser.user.name}</h2>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-slate-900 font-medium">{selectedUser.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Mobile</p>
                  <p className="text-slate-900 font-medium">{selectedUser.user.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <p className="text-slate-900 font-medium">
                    {selectedUser.user.isBlocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">{selectedUser.activeUrls}</p>
                    <p className="text-xs text-slate-600">Active URLs</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedUser.deletedUrls}</p>
                    <p className="text-xs text-slate-600">Deleted URLs</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedUser.totalClicks}</p>
                    <p className="text-xs text-slate-600">Total Clicks</p>
                  </div>
                </div>
              </div>

              
              <div className="space-y-2">
                {selectedUser.user.isBlocked ? (
                  <button
                    onClick={() => handleBlockUnblock(selectedUser.user._id, false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    <FaUnlock /> Unblock User
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlockUnblock(selectedUser.user._id, true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    <FaBan /> Block User
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
