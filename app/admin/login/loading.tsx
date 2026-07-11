export default function LoginLoading() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#002248] text-white flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin size-10 mx-auto mb-4 text-[#c49027]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" fill="currentColor" />
        </svg>
        <p className="text-gray-300">جاري التحميل...</p>
      </div>
    </div>
  )
}
