import React, { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
    : (user?.email || 'U')[0].toUpperCase()

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-semibold text-indigo-600">URL Shortener App</Link>
            <nav className="hidden md:flex gap-4 text-gray-600">
              <Link to="/" className="hover:text-indigo-600">Home</Link>
              <Link to="/about" className="hover:text-indigo-600">About</Link>
              <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4" ref={navRef}>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setOpen(o => !o)} 
                    aria-haspopup="true"
                    aria-expanded={open}
                    className="flex items-center gap-2 px-3 py-1 rounded-full hover:shadow-sm border"
                  >
                    <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${
                      user.role === 'SUPER_ADMIN' ? 'bg-red-500' : user.role === 'ADMIN' ? 'bg-orange-500' : 'bg-indigo-500'
                    }`}>{initials}</div>
                    <div className="text-left">
                      <span className="text-gray-800 cursor-pointer text-sm">{user.name || user.email}</span>
                      {user.role !== 'USER' && (
                        <p className="text-xs font-semibold text-gray-500">{user.role}</p>
                      )}
                    </div>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg py-1 z-50">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-200">Dashboard</Link>
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-200">Profile</Link>
                      {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                        <>
                          <div className="border-t border-gray-200 my-1"></div>
                          <p className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase">Admin Panel</p>
                          <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50">Admin Dashboard</Link>
                          <Link to="/admin/users" className="block px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50">Manage Users</Link>
                          <Link to="/admin/links" className="block px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50">Manage Links</Link>
                          {user.role === 'SUPER_ADMIN' && (
                            <>
                              <Link to="/admin/admins" className="block px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50">Manage Admins</Link>
                              <Link to="/admin/audit-logs" className="block px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50">Audit Logs</Link>
                            </>
                          )}
                        </>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200 border-t border-gray-200 mt-1">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-50">Login</Link>
                  <Link to="/register" className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Register</Link>
                </>
              )}
            </div>

            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 pb-4">
            <nav className="space-y-1">
              <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-100">Home</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-100">About</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
                  <Link to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-100">Profile</Link>
                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <p className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase">Admin Panel</p>
                      <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-indigo-600 font-medium hover:bg-indigo-50">Admin Dashboard</Link>
                      <Link to="/admin/users" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-indigo-600 font-medium hover:bg-indigo-50">Manage Users</Link>
                      <Link to="/admin/links" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-indigo-600 font-medium hover:bg-indigo-50">Manage Links</Link>
                      {user.role === 'SUPER_ADMIN' && (
                        <>
                          <Link to="/admin/admins" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-red-600 font-medium hover:bg-red-50">Manage Admins</Link>
                          <Link to="/admin/audit-logs" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-red-600 font-medium hover:bg-red-50">Audit Logs</Link>
                        </>
                      )}
                    </>
                  )}
                  <button onClick={() => { setOpen(false); handleLogout() }} className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-gray-100">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-100">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded bg-indigo-600 text-white text-center">Register</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar