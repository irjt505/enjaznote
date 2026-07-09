'use client'

export default function AdminError(props: { error: Error & { digest?: string }; reset: () => void }) {
  const reset = props.reset
  return (
    <div dir="rtl" className="min-h-screen bg-[#002248] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <svg className="size-12 mx-auto mb-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h1 className="text-lg font-bold mb-2">حدث خطأ في لوحة التحكم</h1>
        <p className="text-gray-400 text-sm mb-6">Admin dashboard error</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2 rounded-xl bg-[#c49027] text-white font-semibold hover:bg-[#c49027]/80 transition-all cursor-pointer text-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    </div>
  )
}
