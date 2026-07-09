'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '@/lib/usePageTitle'
import { d } from '../dict'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  usePageTitle(d.login.title)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.push('/admin')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? d.login.invalidCredentials
        : signInError.message)
      setLoading(false)
      return
    }
    router.push('/admin')
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#002248] overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#c49027]/5 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#c49027]/3 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-[#c49027]/20 to-[#c49027]/5 border border-[#c49027]/20 mb-5 ring-1 ring-[#c49027]/10 shadow-lg shadow-[#c49027]/10">
            <svg className="size-10 text-[#c49027]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{d.login.title}</h1>
          <p className="text-gray-300 text-sm mt-2">{d.login.subtitle}</p>
        </div>

        <div className="relative animate-fade-in-up stagger-1">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c49027]/5 to-transparent rounded-3xl opacity-50" />
          <div className="relative bg-[#001a35]/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/[0.06] shadow-2xl shadow-black/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="px-4 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-300">{d.login.emailLabel}</label>
                <div className="relative group">
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-300 group-focus-within:text-[#c49027] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                    <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#c49027]/50 focus:bg-[#c49027]/[0.03] focus:ring-2 focus:ring-[#c49027]/10 transition-all"
                    placeholder={d.login.emailPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-300">{d.login.passwordLabel}</label>
                <div className="relative group">
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-300 group-focus-within:text-[#c49027] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#c49027]/50 focus:bg-[#c49027]/[0.03] focus:ring-2 focus:ring-[#c49027]/10 transition-all"
                    placeholder={d.login.passwordPlaceholder}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c49027] to-[#d4a43e] text-white font-bold text-base hover:from-[#b07e20] hover:to-[#c49027] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#c49027]/25 hover:shadow-[#c49027]/40 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" fill="currentColor" />
                    </svg>
                    {d.login.loading}
                  </span>
                ) : d.login.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
