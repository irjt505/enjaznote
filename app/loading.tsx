export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin size-10 mx-auto mb-4 text-accent" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" fill="currentColor" />
        </svg>
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  )
}
