export default function AdminLoading() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#002248]">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white/5 p-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 rounded-full bg-white/5 animate-pulse" />
            <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-full bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="h-8 w-48 bg-white/5 rounded-full mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-gradient rounded-2xl p-6">
                <div className="h-3 w-16 bg-white/5 rounded-full mb-2 animate-pulse" />
                <div className="h-8 w-12 bg-white/5 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
          <div className="card-gradient rounded-2xl p-6">
            <div className="h-5 w-32 bg-white/5 rounded-full mb-4 animate-pulse" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full bg-white/5 rounded-xl mb-2 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
