'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { textToHtml } from '@/lib/emailFormatter'
import { d } from './dict'

interface Review {
  id: number
  name: string
  text: string
  stars: number
  approved: boolean
  created_at: string
}

interface Order {
  id: number
  service_name: string
  category_name: string
  notes: string
  phone: string
  created_at: string
}

interface Subscriber {
  id: number
  email: string
  created_at: string
}

interface Newsletter {
  id: number
  subject: string
  text_content?: string
  html_content: string
  recipient_count: number
  created_at: string
}

type Tab = 'stats' | 'reviews' | 'orders' | 'newsletter'

const PER_PAGE = 10

const sidebarItems: { key: Tab; label: string; icon: string }[] = [
  { key: 'stats', label: d.sidebar.stats, icon: 'M3 3v18h18M7 16l4-8 4 4 4-6' },
  { key: 'reviews', label: d.sidebar.reviews, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { key: 'orders', label: d.sidebar.orders, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'newsletter', label: d.sidebar.newsletter, icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
]

const quickActions = [
  { label: d.quickActions.site, href: '/', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { label: d.quickActions.reviews, tab: 'reviews' as Tab, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: d.quickActions.orders, tab: 'orders' as Tab, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={d.modal.confirmLabel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#001a35] border border-white/[0.08] rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
        <svg className="size-10 mx-auto mb-3 text-[#c49027]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-white text-sm mb-5">{message}</p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-600/20 hover:bg-red-600/30 transition-all cursor-pointer text-sm font-medium">{d.modal.confirmLabel}</button>
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer text-sm font-medium">{d.modal.cancelLabel}</button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2.5 animate-slide-in-right backdrop-blur-md ${
      type === 'success' ? 'bg-green-600/90 text-white border border-green-500/30' : 'bg-red-600/90 text-white border border-red-500/30'
    }`}>
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {type === 'success'
          ? <polyline points="20 6 9 17 4 12" />
          : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
      </svg>
      {message}
    </div>
  )
}

function StatCard({ label, value, icon, sub, trend }: { label: string; value: string | number; icon: string; sub?: string; trend?: { value: string; up: boolean } }) {
  const [displayValue, setDisplayValue] = useState(0)
  const targetValue = typeof value === 'string' ? parseFloat(value) || 0 : value

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (prefersReduced || targetValue === 0) { setDisplayValue(targetValue); return }
    const duration = 800
    const steps = 25
    const increment = targetValue / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) { setDisplayValue(targetValue); clearInterval(timer) }
      else setDisplayValue(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [targetValue])

  return (
    <div className="group relative bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-2.5 border border-white/[0.06] hover:border-[#c49027]/20 transition-all duration-500">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c49027]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start justify-between mb-1.5">
        <div className="size-8 rounded-xl bg-gradient-to-br from-[#c49027]/20 to-[#c49027]/5 flex items-center justify-center ring-1 ring-[#c49027]/10 group-hover:ring-[#c49027]/30 transition-all">
          <svg className="size-3.5 text-[#c49027]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 px-1 py-0.5 text-[9px] font-medium rounded-lg border ${
            trend.up ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <svg className={`size-2 ${trend.up ? '' : 'rotate-180'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-white group-hover:text-[#c49027] transition-colors">{displayValue}</p>
      <p className="text-[10px] text-gray-300 mt-0.5">{label}</p>
      {sub && <p className="text-[8px] text-gray-300">{sub}</p>}
    </div>
  )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const h = 40
  const w = 120
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

function Pagination({ page, totalPages, onPageChange, total }: { page: number; totalPages: number; onPageChange: (p: number) => void; total?: number }) {
  if (totalPages <= 1) return null
  const from = (page - 1) * PER_PAGE + 1
  const to = Math.min(page * PER_PAGE, total ?? page * PER_PAGE)
  return (
    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/[0.04]">
      {total && <span className="text-[9px] text-gray-300">{d.pagination.showing(from, to, total)}</span>}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2 py-1 text-[10px] rounded-lg bg-white/[0.03] text-gray-300 border border-white/[0.06] hover:text-white hover:border-white/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {d.pagination.prev}
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`size-6 text-[10px] rounded-lg border transition-all cursor-pointer ${
              p === page
                ? 'bg-[#c49027]/15 text-[#c49027] border-[#c49027]/20'
                : 'bg-white/[0.03] text-gray-300 border-white/[0.06] hover:text-white hover:border-white/20'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2 py-1 text-[10px] rounded-lg bg-white/[0.03] text-gray-300 border border-white/[0.06] hover:text-white hover:border-white/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {d.pagination.next}
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<Tab>('stats')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const [composeSubject, setComposeSubject] = useState('')
  const [composeContent, setComposeContent] = useState('')
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  const handleTabChange = useCallback((newTab: Tab) => {
    setTab(newTab)
    setSearch('')
  }, [])
  const [reviewPage, setReviewPage] = useState(1)
  const [orderPage, setOrderPage] = useState(1)
  const [subscriberPage, setSubscriberPage] = useState(1)

  const showToast = useCallback((message: string, type: 'success' | 'error') => setToast({ message, type }), [])

  const fetchData = useCallback(async () => {
    try {
      const [reviewsRes, ordersRes, subsRes, newsRes] = await Promise.all([
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        fetch('/api/subscribers'),
        fetch('/api/newsletter/history'),
      ])
      if (reviewsRes.data) setReviews(reviewsRes.data)
      if (ordersRes.data) setOrders(ordersRes.data)
      if (subsRes.ok) { const d = await subsRes.json(); setSubscribers(d); setSubscriberPage(1) }
      if (newsRes.ok) { const d = await newsRes.json(); setNewsletters(d) }
      setFetchError(false)
    } catch {
      setFetchError(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        if (!data?.user) return router.push('/admin/login')
        setUser(data.user)
        fetchData()
      })
      .catch(() => router.push('/admin/login'))
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [router, fetchData])

  const approveReview = async (id: number) => {
    const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', id)
    if (error) return showToast(d.reviews.approveError, 'error')
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)))
    showToast(d.reviews.approveSuccess, 'success')
  }

  const deleteReview = async (id: number) => {
    setConfirmModal({
      message: d.reviews.confirmDeleteOne,
      onConfirm: async () => {
        setConfirmModal(null)
        const { error } = await supabase.from('reviews').delete().eq('id', id)
        if (error) return showToast(d.reviews.deleteError, 'error')
        setReviews((prev) => prev.filter((r) => r.id !== id))
        showToast(d.reviews.deleteSuccess, 'success')
      },
    })
  }

  const deleteOrder = async (id: number) => {
    setConfirmModal({
      message: d.orders.deleteConfirm,
      onConfirm: async () => {
        setConfirmModal(null)
        const { error } = await supabase.from('orders').delete().eq('id', id)
        if (error) return showToast(d.orders.deleteError, 'error')
        setOrders((prev) => prev.filter((o) => o.id !== id))
        showToast(d.orders.deleteSuccess, 'success')
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const pendingReviews = reviews.filter((r) => !r.approved)
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString())

  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [orderFilter, setOrderFilter] = useState<'all' | 'today' | 'week'>('all')

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'pending' && r.approved) return false
    if (reviewFilter === 'approved' && !r.approved) return false
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase())
    )
  })
  const filteredOrders = orders.filter((o) => {
    const created = new Date(o.created_at)
    const now = new Date()
    if (orderFilter === 'today') {
      if (created.toDateString() !== now.toDateString()) return false
    }
    if (orderFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (created < weekAgo) return false
    }
    return (
      o.service_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.toLowerCase().includes(search.toLowerCase())
    )
  })

  const sparklineData = [4, 7, 5, 10, 8, 12, 9, 15, 11, 14, 13, 18, 16, 20]

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#002248] text-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin size-10 mx-auto mb-4 text-[#c49027]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" fill="currentColor" />
          </svg>
          <p className="text-gray-300">{d.shared.loading}</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const userInitial = user.email?.charAt(0).toUpperCase() || 'A'
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return d.greeting.morning
    return d.greeting.evening
  })()

  const renderTabContent = () => {
    switch (tab) {
      case 'stats':
        return (
          <div className="animate-fade-in">
            <div className="grid grid-cols-4 gap-1 mb-1.5">
              <StatCard
                label={d.stats.reviews}
                value={reviews.length}
                icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
              <StatCard
                label={d.stats.pending}
                value={pendingReviews.length}
                icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <StatCard
                label={d.stats.orders}
                value={orders.length}
                icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
              <StatCard
                label={d.stats.rating}
                value={reviews.length ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : '0'}
                icon="M2 20h20M4 16h4m0 0V8m0 8h4m0 0V4m0 12h4m0 0v-4m0 4h4"
              />
            </div>

            <div className="grid grid-cols-2 gap-1 mb-1.5">
              <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-2.5 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[9px] font-semibold text-white">{d.stats.activityReviews}</h3>
                  <span className="text-[7px] text-gray-300">{d.stats.last14Days}</span>
                </div>
                <Sparkline data={sparklineData} color="#c49027" />
              </div>
              <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-2.5 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[9px] font-semibold text-white">{d.stats.activityOrders}</h3>
                  <span className="text-[7px] text-gray-300">{d.stats.last14Days}</span>
                </div>
                <Sparkline data={[...sparklineData].reverse()} color="#3b82f6" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {quickActions.map((action) => {
                const isExternal = 'href' in action
                const isTab = 'tab' in action && action.tab
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      if (isExternal && 'href' in action) window.open(action.href, '_blank')
                      else if (isTab && 'tab' in action) handleTabChange(action.tab!)
                    }}
                    className="group flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-[#c49027]/5 hover:border-[#c49027]/20 transition-all cursor-pointer"
                  >
                    <div className="size-7 rounded-xl bg-gradient-to-br from-[#c49027]/15 to-[#c49027]/5 flex items-center justify-center ring-1 ring-[#c49027]/10 group-hover:ring-[#c49027]/30 transition-all">
                      <svg className="size-3 text-[#c49027]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={action.icon} />
                      </svg>
                    </div>
                    <span className="text-[9px] text-gray-300 group-hover:text-[#c49027] transition-colors">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className="animate-fade-in space-y-3">
            {pendingReviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#c49027] animate-pulse" />
                    <h2 className="text-xs font-semibold text-white">{d.reviews.awaitingApproval}</h2>
                    <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-300 border border-white/10">{pendingReviews.length}</span>
                  </div>
                  <button
                    onClick={async () => {
                      const ids = pendingReviews.map((r) => r.id)
                      const { error } = await supabase.from('reviews').update({ approved: true }).in('id', ids)
                      if (error) return showToast(d.reviews.approveAllError, 'error')
                      setReviews((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, approved: true } : r))
                      showToast(d.reviews.approveAllSuccess(ids.length), 'success')
                    }}
                    className="px-2 py-1 text-[10px] rounded-lg bg-green-600/15 text-green-400 border border-green-600/20 hover:bg-green-600/30 transition-all cursor-pointer"
                  >
                    {d.reviews.approveAll(pendingReviews.length)}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="group bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-[#c49027]/10 hover:border-[#c49027]/30 transition-all">
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className="size-7 rounded-full bg-gradient-to-br from-[#c49027]/30 to-[#c49027]/10 flex items-center justify-center text-[#c49027] font-bold text-[10px] shrink-0 ring-1 ring-[#c49027]/20">
                          {review.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-white text-[11px] truncate">{review.name}</p>
                            <span className="text-[9px] text-gray-300 shrink-0">{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} className={`size-2 ${s <= review.stars ? 'text-[#c49027]' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-300 mb-2 line-clamp-2">{review.text}</p>
                      <div className="flex gap-1.5">
                          <button onClick={() => approveReview(review.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] rounded-xl bg-green-600/15 text-green-400 hover:bg-green-600/30 border border-green-600/20 transition-all cursor-pointer">
                            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            {d.reviews.approve}
                          </button>
                          <button onClick={() => deleteReview(review.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] rounded-xl bg-red-600/15 text-red-400 hover:bg-red-600/30 border border-red-600/20 transition-all cursor-pointer">
                            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                            {d.reviews.reject}
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-semibold text-white">{d.reviews.allReviews}</h2>
                  <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-300 border border-white/10">{reviews.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  {reviews.length > 0 && (
                    <button
                      onClick={() => setConfirmModal({
                        message: d.reviews.confirmDeleteAll,
                        onConfirm: async () => {
                          setConfirmModal(null)
                          const ids = reviews.map((r) => r.id)
                          const { error } = await supabase.from('reviews').delete().in('id', ids)
                          if (error) return showToast(d.reviews.deleteAllError, 'error')
                          setReviews([])
                          showToast(d.reviews.deleteAllSuccess, 'success')
                        },
                      })}
                      className="px-2 py-1 text-[9px] rounded-lg bg-red-600/15 text-red-400 border border-red-600/20 hover:bg-red-600/30 transition-all cursor-pointer"
                    >
                      {d.reviews.deleteAll}
                    </button>
                  )}
                  <div className="flex gap-1" role="tablist" aria-label={d.reviews.filterLabel}>
                  {(['all', 'pending', 'approved'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setReviewFilter(f); setReviewPage(1) }}
                      className={`px-2 py-1 text-[10px] rounded-lg border transition-all cursor-pointer ${
                        reviewFilter === f
                          ? 'bg-[#c49027]/15 text-[#c49027] border-[#c49027]/20'
                          : 'text-gray-300 border-white/[0.06] hover:text-white hover:border-white/20'
                      }`}
                    >
                      {f === 'all' ? d.reviews.filterAll : f === 'pending' ? d.reviews.filterPending : d.reviews.filterApproved}
                    </button>
                  ))}
                </div>
              </div>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="size-10 mx-auto text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-gray-300 text-xs">{d.reviews.empty}</p>
                </div>
              ) : (
                <div>
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PER_PAGE))
                    const safePage = Math.min(reviewPage, totalPages)
                    const paginatedReviews = filteredReviews.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
                    return (
                      <>
                        <div className="space-y-1.5">
                          {paginatedReviews.map((review) => (
                            <div key={review.id} className={`group bg-gradient-to-br from-[#001a35]/80 to-[#002248]/80 rounded-xl p-3 border border-white/[0.04] hover:border-white/[0.08] transition-all ${!review.approved ? 'opacity-50' : ''}`}>
                              <div className="flex items-start gap-2.5">
                                <div className="size-7 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                                  {review.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <p className="font-medium text-white text-[11px] truncate">{review.name}</p>
                                      {review.approved && (
                                        <span className="px-1 py-[1px] text-[9px] rounded bg-green-600/15 text-green-400 border border-green-600/20 shrink-0">✓</span>
                                      )}
                                    </div>
                                    <span className="text-[9px] text-gray-300 shrink-0">{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <svg key={s} className={`size-2 ${s <= review.stars ? 'text-[#c49027]' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">{review.text}</p>
                                </div>
                              </div>
                              <div className="flex gap-1.5 mt-2 mr-9">
                                {!review.approved ? (
                                  <>
                                    <button onClick={() => approveReview(review.id)} className="inline-flex items-center justify-center gap-1 px-2 py-1 text-[9px] rounded-lg bg-green-600/15 text-green-400 hover:bg-green-600/30 border border-green-600/20 transition-all cursor-pointer">
                                      <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                      {d.reviews.approve}
                                    </button>
                                    <button onClick={() => deleteReview(review.id)} className="inline-flex items-center justify-center gap-1 px-2 py-1 text-[9px] rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600/30 border border-red-600/20 transition-all cursor-pointer">
                                      <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                      {d.reviews.reject}
                                    </button>
                                  </>
                                ) : (
                                  <button onClick={() => deleteReview(review.id)} className="inline-flex items-center justify-center gap-1 px-2 py-1 text-[9px] rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600/30 border border-red-600/20 transition-all cursor-pointer">
                                    <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                    {d.reviews.delete}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Pagination page={safePage} totalPages={totalPages} onPageChange={setReviewPage} total={filteredReviews.length} />
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
          </div>
        )

      case 'orders':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-semibold text-white">{d.orders.allOrders}</h2>
                <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-300 border border-white/10">{orders.length}</span>
              </div>
              <div className="flex gap-1" role="tablist" aria-label={d.orders.filterLabel}>
                {(['all', 'today', 'week'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setOrderFilter(f); setOrderPage(1) }}
                    className={`px-2 py-1 text-[10px] rounded-lg border transition-all cursor-pointer ${
                      orderFilter === f
                        ? 'bg-[#c49027]/15 text-[#c49027] border-[#c49027]/20'
                        : 'text-gray-300 border-white/[0.06] hover:text-white hover:border-white/20'
                    }`}
                  >
                    {f === 'all' ? d.orders.filterAll : f === 'today' ? d.orders.filterToday : d.orders.filterWeek}
                  </button>
                ))}
              </div>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <svg className="size-10 mx-auto text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-300 text-xs">{d.orders.empty}</p>
              </div>
            ) : (
              <div>
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE))
                  const safePage = Math.min(orderPage, totalPages)
                  const paginatedOrders = filteredOrders.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
                  return (
                    <>
                      <div className="space-y-1.5">
                        {paginatedOrders.map((order) => (
                          <div key={order.id} className="group bg-gradient-to-br from-[#001a35]/80 to-[#002248]/80 rounded-xl p-3 border border-white/[0.04] hover:border-blue-500/20 transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center text-blue-400 shrink-0 ring-1 ring-blue-500/10">
                                  <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-semibold text-white text-xs">{order.service_name}</p>
                                  <p className="text-[10px] text-gray-300">{order.category_name}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[9px] text-gray-300">{new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
                                <button onClick={() => deleteOrder(order.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-600/10 transition-all cursor-pointer" title={d.orders.deleteTitle}>
                                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {(order.phone || order.notes) && (
                              <div className="flex flex-wrap gap-2 mt-2 mr-11 text-[10px] text-gray-300">
                                {order.phone && (
                                  <span className="inline-flex items-center gap-1">
                                    <svg className="size-2.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                    {order.phone}
                                  </span>
                                )}
                                {order.notes && (
                                  <span className="inline-flex items-center gap-1">
                                    <svg className="size-2.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    {order.notes}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <Pagination page={safePage} totalPages={totalPages} onPageChange={setOrderPage} total={filteredOrders.length} />
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        )

      case 'newsletter':
        return (
          <div className="animate-fade-in space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <StatCard
                label={d.newsletter.subscribers}
                value={subscribers.length}
                icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
              <StatCard
                label={d.newsletter.sentCount}
                value={newsletters.length}
                icon="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
              />
              <StatCard
                label={d.newsletter.totalSent}
                value={newsletters.reduce((a, n) => a + n.recipient_count, 0)}
                icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </div>

            {/* Compose */}
            <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-white">{d.newsletter.newNewsletter}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-2 py-1 text-[10px] rounded-lg border transition-all cursor-pointer ${
                      showPreview
                        ? 'bg-[#c49027]/15 text-[#c49027] border-[#c49027]/20'
                        : 'bg-white/[0.03] text-gray-300 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {showPreview ? d.newsletter.edit : d.newsletter.preview}
                  </button>
                  <button
                    disabled={sendingNewsletter || !composeSubject || !composeContent}
                    onClick={() => setConfirmModal({
                        message: d.newsletter.confirmSend(composeSubject, subscribers.length),
                      onConfirm: async () => {
                        setConfirmModal(null)
                        setSendingNewsletter(true)
                        try {
                          const res = await fetch('/api/newsletter/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ subject: composeSubject, textContent: composeContent }),
                          })
                          const data = await res.json()
                          if (res.ok) {
                            showToast(d.newsletter.sendSuccess(data.sent, data.failed || 0), 'success')
                            setComposeSubject('')
                            setComposeContent('')
                            setShowPreview(false)
                            fetchData()
                          } else {
                            showToast(data.error || d.newsletter.sendError, 'error')
                          }
                        } catch {
                          showToast(d.newsletter.connectionError, 'error')
                        } finally {
                          setSendingNewsletter(false)
                        }
                      },
                    })}
                    className="px-3 py-1.5 text-[10px] rounded-lg bg-[#c49027] text-white hover:bg-[#c49027]/80 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {sendingNewsletter ? d.newsletter.sending : d.newsletter.sendTo(subscribers.length)}
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="bg-[#002248] rounded-xl p-4 border border-white/[0.06] min-h-[200px]">
                  <div className="text-center mb-3 pb-2 border-b border-white/[0.06]">
                    <h3 className="text-[#c49027] text-sm font-bold">انجاز نوت</h3>
                    <p className="text-[10px] text-gray-300" style={{ direction: 'ltr' }}>{composeSubject}</p>
                  </div>
                  <div className="text-sm leading-relaxed text-white" dangerouslySetInnerHTML={{ __html: textToHtml(composeContent) }} />
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="newsletter-subject" className="sr-only">{d.newsletter.subjectPlaceholder}</label>
                  <input
                    id="newsletter-subject"
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder={d.newsletter.subjectPlaceholder}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#c49027]/30 transition-colors rtl:text-right"
                  />
                  <label htmlFor="newsletter-content" className="sr-only">{d.newsletter.contentPlaceholder}</label>
                  <textarea
                    id="newsletter-content"
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    placeholder={d.newsletter.contentPlaceholder}
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#c49027]/30 transition-colors resize-y rtl:text-right"
                  />
                  <div className="flex items-center gap-3 text-[9px] text-gray-300">
                    <span>{d.newsletter.hintBold}</span>
                    <span>{d.newsletter.hintList}</span>
                    <span>{d.newsletter.hintLink}</span>
                    <span>{d.newsletter.hintParagraph}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Subscribers list */}
            <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-white/[0.06]">
              <h2 className="text-xs font-semibold text-white mb-2">{d.newsletter.subscribers} ({subscribers.length})</h2>
              {subscribers.length === 0 ? (
                <p className="text-gray-300 text-xs text-center py-4">{d.newsletter.emptySubscribers}</p>
              ) : (
                <div>
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil(subscribers.length / PER_PAGE))
                    const safePage = Math.min(subscriberPage, totalPages)
                    const paginatedSubs = subscribers.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
                    return (
                      <>
                        <div className="space-y-1">
                          {paginatedSubs.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                              <span className="text-xs text-gray-300" style={{ direction: 'ltr' }}>{sub.email}</span>
                              <span className="text-[9px] text-gray-300">{new Date(sub.created_at).toLocaleDateString('ar-SA')}</span>
                            </div>
                          ))}
                        </div>
                        <Pagination page={safePage} totalPages={totalPages} onPageChange={setSubscriberPage} total={subscribers.length} />
                      </>
                    )
                  })()}
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-white/[0.06]">
              <h2 className="text-xs font-semibold text-white mb-2">{d.newsletter.sentCount} ({newsletters.length})</h2>
              {newsletters.length === 0 ? (
                <p className="text-gray-300 text-xs text-center py-4">{d.newsletter.noHistory}</p>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {newsletters.map((nl) => (
                    <div key={nl.id} className="py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-white truncate">{nl.subject}</p>
                          <p className="text-[9px] text-gray-300 mt-0.5">
                            {d.newsletter.sentTo(nl.recipient_count, new Date(nl.created_at).toLocaleDateString('ar-SA'))}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setComposeSubject(nl.subject)
                            setComposeContent(nl.text_content || '')
                            setShowPreview(false)
                            handleTabChange('newsletter')
                          }}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-[#c49027] hover:bg-[#c49027]/10 transition-all cursor-pointer"
                          title={d.newsletter.reuseTitle}
                        >
                          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

    }
  }

  return (
    <div dir="rtl" className="h-dvh bg-[#002248] text-white flex overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-40 h-full bg-gradient-to-b from-[#001220] to-[#001a35] border-l border-white/[0.04] flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-64 right-0' : 'w-0 md:w-64 -right-64 md:right-0'
      }`}>
        <div className="px-4 pb-2.5 border-b border-white/[0.04] flex items-center gap-2 shrink-0">
          <div className="size-8 rounded-xl bg-gradient-to-br from-[#c49027]/20 to-[#c49027]/5 flex items-center justify-center ring-1 ring-[#c49027]/10">
            <svg className="size-[18px] text-[#c49027]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-white text-sm">انجاز نوت</span>
            <p className="text-[10px] text-gray-300">{d.sidebar.dashboard}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { handleTabChange(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                tab === item.key
                  ? 'bg-gradient-to-r from-[#c49027]/15 to-transparent text-[#c49027] border border-[#c49027]/15'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
              {item.key === 'reviews' && pendingReviews.length > 0 && (
                <span className="mr-auto px-1.5 py-0.5 text-[10px] rounded-md bg-red-500/15 text-red-400 border border-red-500/20 font-medium">
                  {pendingReviews.length}
                </span>
              )}
              {item.key === 'orders' && todayOrders.length > 0 && (
                <span className="mr-auto px-1.5 py-0.5 text-[10px] rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20 font-medium">
                  {todayOrders.length}
                </span>
              )}
              {item.key === 'newsletter' && subscribers.length > 0 && (
                <span className="mr-auto px-1.5 py-0.5 text-[10px] rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/20 font-medium">
                  {subscribers.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.04]">
          <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] mb-2 border border-white/[0.04]">
            <p className="text-xs text-gray-300 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>{d.sidebar.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <main className="flex-1 overflow-y-auto overscroll-y-contain min-h-0">
          <div className="px-3 py-1.5">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-1.5 -mr-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <svg className="size-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                  <p className="text-gray-300 text-[11px] truncate">{greeting}، {user.email?.split('@')[0] || d.shared.userLabel}</p>
                </div>
                <h1 className="text-white font-bold text-sm mt-0.5">
                  {tab === 'stats' ? d.tabs.overview : tab === 'reviews' ? d.tabs.manageReviews : tab === 'orders' ? d.tabs.manageOrders : d.tabs.manageNewsletter}
                </h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(tab === 'reviews' || tab === 'orders') && (
                  <div className="relative">
                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <label htmlFor="admin-search" className="sr-only">{d.shared.searchPlaceholder}</label>
                    <input
                      id="admin-search"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={d.shared.searchPlaceholder}
                      className="w-28 md:w-36 pr-7 pl-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-[10px] placeholder-gray-700 focus:outline-none focus:border-[#c49027]/30 transition-all"
                    />
                  </div>
                )}
                <div className="size-7 rounded-full bg-gradient-to-br from-[#c49027]/20 to-[#c49027]/5 flex items-center justify-center text-[#c49027] text-[10px] font-bold ring-1 ring-[#c49027]/10">
                  {userInitial}
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              {fetchError && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-red-600/15 border border-red-600/20 text-red-400 text-[11px] flex items-center gap-2" role="alert">
                  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{d.shared.fetchError}</span>
                </div>
              )}
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmModal && <ConfirmModal message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(null)} />}
    </div>
  )
}
