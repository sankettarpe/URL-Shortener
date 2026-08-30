import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handlesubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', {
        email,
        password,
      })
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      navigate('/dashboard')
    } catch (error) {
      alert(error?.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 px-4'>
      <div className='w-full max-w-sm rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200'>
        <div className='mb-8 text-center'>
          <p className='inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700'>
            Welcome back
          </p>
          <h1 className='mt-4 text-3xl font-semibold text-slate-900'>Login to your account</h1>
        </div>

        <form onSubmit={handlesubmit} className='space-y-5'>
          <label className='block text-sm font-medium text-slate-700'>Email address</label>
          <div className='relative'>
            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400'>
              <svg width='18' height='18' fill='none' viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11z' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M4.5 6.75L12 12.25l7.5-5.5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </span>
            <input
              className='w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className='block text-sm font-medium text-slate-700'>Password</label>
          <div className='relative'>
            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400'>
              <svg width='18' height='18' fill='none' viewBox='0 0 24 24' aria-hidden='true'>
                <rect x='6' y='11' width='12' height='8' rx='2' stroke='currentColor' strokeWidth='1.8' />
                <path d='M8 11V8a4 4 0 018 0v3' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
              </svg>
            </span>
            <input
              className='w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className='w-full rounded-3xl bg-linear-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login