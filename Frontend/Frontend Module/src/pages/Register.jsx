import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mobile, setMobile] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useContext(AuthContext)
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
            await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', {
                name,
                email,
                password,
                mobile,
            })
            alert('Registration successful')
            navigate('/login')
        } catch (error) {
            alert(error?.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10'>
            <div className='w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200'>
                <div className='mb-8 text-center'>
                    <h2 className='text-3xl font-semibold text-slate-900'>Create your account</h2>
                </div>

                <form onSubmit={handlesubmit} className='space-y-5'>
                    <div>
                        <label className='mb-2 block text-sm font-medium text-slate-700'>Full name</label>
                        <div className='relative'>
                            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400'>
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                                    <path d='M4 20c0-2.761 4.029-5 8-5s8 2.239 8 5' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                                </svg>
                            </span>
                            <input
                                className='w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                                type='text'
                                placeholder='Enter your name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className='mb-2 block text-sm font-medium text-slate-700'>Email address</label>
                        <div className='relative'>
                            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400'>
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
                    </div>

                    <div>
                        <label className='mb-2 block text-sm font-medium text-slate-700'>Password</label>
                        <div className='relative'>
                            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400'>
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <rect x='6' y='11' width='12' height='8' rx='2' stroke='currentColor' strokeWidth='1.8' />
                                    <path d='M8 11V8a4 4 0 018 0v3' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                                </svg>
                            </span>
                            <input
                                className='w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                                type='password'
                                placeholder='Create a password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className='mb-2 block text-sm font-medium text-slate-700'>Mobile number</label>
                        <div className='relative'>
                            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400'>
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
                                    <path d='M12 17.5h.01' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                                </svg>
                            </span>
                            <input
                                className='w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                                type='tel'
                                placeholder='Enter your mobile number'
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full rounded-3xl bg-linear-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <p className='mt-4 text-center text-sm text-slate-500'>
                        Already registered?{' '}
                        <Link to='/login' className='font-semibold text-indigo-600 hover:text-indigo-700'>
                            Login directly
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register