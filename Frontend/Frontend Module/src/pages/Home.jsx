import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Home = () => {
  const { user } = useContext(AuthContext)

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-slate-100 via-white to-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <section className="space-y-8">
            <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">URL Shortener</p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Shorten links with speed, security, and style.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Create clean short URLs, manage your links from a secure dashboard, and view usage anytime. Built for teams who want a real-time app experience with a polished front-end.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {user ? (
                <Link to="/dashboard" className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
                  View dashboard
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
                  Get started
                </Link>
              )}
              <Link to="/about" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
                Learn more
              </Link>
            </div>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Quick overview</p>
                <p className="mt-4 text-slate-700">Use the dashboard to shorten URLs, organize them into branded links, and track click activity with intuitive navigation.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Create links</p>
                  <p className="mt-3 text-slate-700">Generate shareable short links instantly and copy them with one click.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Secure accounts</p>
                  <p className="mt-3 text-slate-700">Register, login, and access your link dashboard safely from anywhere.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Home
