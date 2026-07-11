'use client'

export default function LoginError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#002248] text-white flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <svg className="size-12 mx-auto mb-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-lg font-bold mb-2">حدث خطأ</h2>
        <p className="text-gray-300 text-sm mb-4">تعذر تحميل صفحة تسجيل الدخول. حاول مرة أخرى.</p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-xl bg-[#c49027] text-white text-sm font-medium hover:bg-[#c49027]/80 transition-all cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  )
}
