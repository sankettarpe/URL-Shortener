import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Profile = () => {
  const { user } = useContext(AuthContext)

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Your profile</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Account details</h1>
            <p className="mt-3 text-slate-600">Quick summary of your signed-in account and profile information.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">Name</h2>
              <p className="mt-3 text-xl font-semibold text-slate-900">{user?.name || 'Guest User'}</p>
            </div>
            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">Email</h2>
              <p className="mt-3 text-xl font-semibold text-slate-900">{user?.email || 'Not available'}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-4xl border border-slate-200 bg-white p-6">
            <div>
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Account access</h3>
              <p className="mt-2 text-slate-700">Manage your login, update your details, and return to the dashboard anytime.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-4xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-2 text-slate-800 font-semibold">Active</p>
              </div>
              <div className="rounded-4xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="mt-2 text-slate-800 font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
