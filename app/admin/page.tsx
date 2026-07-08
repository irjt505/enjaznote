'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

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

type Tab = 'stats' | 'reviews' | 'orders'

const sidebarItems: { key: Tab; label: string; icon: string }[] = [
  { key: 'stats', label: 'الإحصائيات', icon: 'M3 3v18h18M7 16l4-8 4 4 4-6' },
  { key: 'reviews', label: 'التقييمات', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { key: 'orders', label: 'الطلبات', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

const quickActions = [
  { label: 'الموقع', href: '/', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { label: 'التقييمات', tab: 'reviews' as Tab, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: 'الطلبات', tab: 'orders' as Tab, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

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
    <div className="group relative bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-white/[0.06] hover:border-[#c49027]/20 transition-all duration-500">
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
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-[8px] text-gray-600">{sub}</p>}
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

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<Tab>('stats')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const showToast = useCallback((message: string, type: 'success' | 'error') => setToast({ message, type }), [])

  const fetchData = useCallback(async () => {
    const [reviewsRes, ordersRes] = await Promise.all([
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    if (reviewsRes.data) setReviews(reviewsRes.data)
    if (ordersRes.data) setOrders(ordersRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) return router.push('/admin/login')
      setUser(data.user)
      fetchData()
    })
  }, [router, fetchData])

  const approveReview = async (id: number) => {
    const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', id)
    if (error) return showToast('فشل في الموافقة على التقييم', 'error')
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)))
    showToast('تم قبول التقييم بنجاح', 'success')
  }

  const deleteReview = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return showToast('فشل في حذف التقييم', 'error')
    setReviews((prev) => prev.filter((r) => r.id !== id))
    showToast('تم حذف التقييم', 'success')
  }

  const deleteOrder = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) return showToast('فشل في حذف الطلب', 'error')
    setOrders((prev) => prev.filter((o) => o.id !== id))
    showToast('تم حذف الطلب', 'success')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const pendingReviews = reviews.filter((r) => !r.approved)
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString())

  const filteredReviews = reviews.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.text.toLowerCase().includes(search.toLowerCase())
  )
  const filteredOrders = orders.filter((o) =>
    o.service_name.toLowerCase().includes(search.toLowerCase()) ||
    o.phone.toLowerCase().includes(search.toLowerCase())
  )

  const sparklineData = [4, 7, 5, 10, 8, 12, 9, 15, 11, 14, 13, 18, 16, 20]

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#002248] text-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin size-10 mx-auto mb-4 text-[#c49027]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" fill="currentColor" />
          </svg>
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const userInitial = user.email?.charAt(0).toUpperCase() || 'A'
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'صباح الخير'
    return 'مساء الخير'
  })()

  const renderTabContent = () => {
    switch (tab) {
      case 'stats':
        return (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 mb-2">
              <StatCard
                label="إجمالي التقييمات"
                value={reviews.length}
                icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                trend={reviews.length > 0 ? { value: `${reviews.length}`, up: true } : undefined}
                sub="جميع التقييمات"
              />
              <StatCard
                label="معلقة"
                value={pendingReviews.length}
                icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                sub="في انتظار الموافقة"
              />
              <StatCard
                label="إجمالي الطلبات"
                value={orders.length}
                icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                trend={todayOrders.length > 0 ? { value: `${todayOrders.length} اليوم`, up: true } : undefined}
                sub="جميع الطلبات"
              />
              <StatCard
                label="متوسط التقييم"
                value={reviews.length ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : '0'}
                icon="M2 20h20M4 16h4m0 0V8m0 8h4m0 0V4m0 12h4m0 0v-4m0 4h4"
                sub="من 5 نجوم"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 mb-2">
              <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[10px] font-semibold text-white">نشاط التقييمات</h3>
                  <span className="text-[8px] text-gray-600">آخر 14 يوم</span>
                </div>
                <Sparkline data={sparklineData} color="#c49027" />
              </div>
              <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl p-3 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[10px] font-semibold text-white">نشاط الطلبات</h3>
                  <span className="text-[8px] text-gray-600">آخر 14 يوم</span>
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
                      else if (isTab && 'tab' in action) setTab(action.tab!)
                    }}
                    className="group flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-[#c49027]/5 hover:border-[#c49027]/20 transition-all cursor-pointer"
                  >
                    <div className="size-7 rounded-xl bg-gradient-to-br from-[#c49027]/15 to-[#c49027]/5 flex items-center justify-center ring-1 ring-[#c49027]/10 group-hover:ring-[#c49027]/30 transition-all">
                      <svg className="size-3 text-[#c49027]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={action.icon} />
                      </svg>
                    </div>
                    <span className="text-[9px] text-gray-500 group-hover:text-[#c49027] transition-colors">{action.label}</span>
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="size-1.5 rounded-full bg-[#c49027] animate-pulse" />
                  <h2 className="text-xs font-semibold text-white">في انتظار الموافقة</h2>
                  <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-500 border border-white/10">{pendingReviews.length}</span>
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
                            <span className="text-[9px] text-gray-600 shrink-0">{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} className={`size-2 ${s <= review.stars ? 'text-[#c49027]' : 'text-gray-700'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-2 line-clamp-2">{review.text}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => approveReview(review.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] rounded-xl bg-green-600/15 text-green-400 hover:bg-green-600/30 border border-green-600/20 transition-all cursor-pointer">
                          <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          قبول
                        </button>
                        <button onClick={() => deleteReview(review.id)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] rounded-xl bg-red-600/15 text-red-400 hover:bg-red-600/30 border border-red-600/20 transition-all cursor-pointer">
                          <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                          حذف
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
                  <h2 className="text-xs font-semibold text-white">جميع التقييمات</h2>
                  <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-500 border border-white/10">{reviews.length}</span>
                </div>
              </div>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="size-10 mx-auto text-gray-700 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-gray-600 text-xs">لا توجد تقييمات بعد</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredReviews.map((review) => (
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
                            <span className="text-[9px] text-gray-700 shrink-0">{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} className={`size-2 ${s <= review.stars ? 'text-[#c49027]' : 'text-gray-800'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 line-clamp-1">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 'orders':
        return (
          <div className="animate-fade-in">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <svg className="size-10 mx-auto text-gray-700 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-600 text-xs">لا توجد طلبات بعد</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredOrders.map((order) => (
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
                          <p className="text-[10px] text-gray-600">{order.category_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] text-gray-700">{new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
                        <button onClick={() => deleteOrder(order.id)} className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-600/10 transition-all cursor-pointer" title="حذف">
                          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {(order.phone || order.notes) && (
                      <div className="flex flex-wrap gap-2 mt-2 mr-11 text-[10px] text-gray-600">
                        {order.phone && (
                          <span className="inline-flex items-center gap-1">
                            <svg className="size-2.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            {order.phone}
                          </span>
                        )}
                        {order.notes && (
                          <span className="inline-flex items-center gap-1">
                            <svg className="size-2.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            )}
          </div>
        )
    }
  }

  return (
    <div dir="rtl" className="h-screen bg-[#002248] text-white flex overflow-hidden">
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
            <p className="text-[10px] text-gray-600">لوحة التحكم</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                tab === item.key
                  ? 'bg-gradient-to-r from-[#c49027]/15 to-transparent text-[#c49027] border border-[#c49027]/15'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
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
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.04]">
          <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] mb-2 border border-white/[0.04]">
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto overscroll-y-contain">
          <div className="px-4 py-2">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-1.5 -mr-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <svg className="size-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                  <p className="text-gray-500 text-[11px] truncate">{greeting}، {user.email?.split('@')[0] || 'مستخدم'}</p>
                </div>
                <h1 className="text-white font-bold text-sm mt-0.5">
                  {tab === 'stats' ? 'نظرة عامة' : tab === 'reviews' ? 'إدارة التقييمات' : 'إدارة الطلبات'}
                </h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(tab === 'reviews' || tab === 'orders') && (
                  <div className="relative">
                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="بحث..."
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
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
