import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { FaUser, FaCrown, FaTrash, FaPlus } from 'react-icons/fa'

const AdminsList = () => {
  const { user } = useContext(AuthContext)
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${backendBase}/api/super-admin/admins`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setAdmins(res.data.data)
        setError('')
      } catch (err) {
        console.error('Error fetching admins:', err)
        setError(err.response?.data?.message || 'Failed to load admins')
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) {
      fetchAdmins()
    }
  }, [user, backendBase])

  const handlePromoteUser = async () => {
    console.log('Promote user functionality would go here')
  }

  const handleDemoteAdmin = async (adminId, adminName) => {
    if (user._id === adminId) {
      setError('You cannot demote yourself')
      return
    }

    if (!window.confirm(`Are you sure you want to demote ${adminName} from admin?`)) {
      return
    }

    try {
      await axios.put(
        `${backendBase}/api/admin/users/${adminId}/demote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      setAdmins(admins.filter(a => a._id !== adminId))
      setError('')
    } catch (err) {
      console.error('Error demoting admin:', err)
      setError(err.response?.data?.message || 'Failed to demote admin')
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
          <h1 className="text-4xl font-bold text-slate-900">Admin Management</h1>
          <p className="mt-2 text-slate-600">Promote users to admin or demote admins (Super Admin only)</p>
        </div>

       
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        
        <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
          {admins.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No admins found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Role</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Promoted</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">{admin.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{admin.email}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold">
                          {admin.role === 'SUPER_ADMIN' ? (
                            <>
                              <FaCrown className="w-3 h-3 text-yellow-600" />
                              <span className="text-yellow-800 bg-yellow-100 px-2 py-1 rounded">Super Admin</span>
                            </>
                          ) : (
                            <>
                              {/* <FaShield className="w-3 h-3 text-blue-600" /> */}
                              <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded">Admin</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 text-center">
                        {admin.promotedAt ? new Date(admin.promotedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {admin.role !== 'SUPER_ADMIN' && user._id !== admin._id && (
                          <button
                            onClick={() => handleDemoteAdmin(admin._id, admin.name)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <FaTrash /> Demote
                          </button>
                        )}
                        {admin.role === 'SUPER_ADMIN' && (
                          <span className="text-xs text-slate-500 font-medium">Super Admin - Cannot Demote</span>
                        )}
                        {user._id === admin._id && (
                          <span className="text-xs text-slate-500 font-medium">This is you</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-lg bg-white shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Promote User to Admin</h2>
          <p className="text-sm text-slate-600 mb-4">
            Go to the Users Management page to find a user and promote them to admin role.
          </p>
          <button
            onClick={() => window.location.href = '/admin/users'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            <FaPlus /> Go to Users Management
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminsList
