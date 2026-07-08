export default function ProductLoading() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-4 w-48 bg-white/5 rounded-full mb-6 animate-pulse" />
        <div className="h-10 w-72 bg-white/5 rounded-full mb-3 animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-white/5 rounded-full mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card-gradient rounded-2xl p-8">
              <div className="h-4 w-full bg-white/5 rounded-full mb-3 animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded-full mb-3 animate-pulse" />
              <div className="h-4 w-3/4 bg-white/5 rounded-full mb-6 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-10 w-40 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
          <div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="h-5 w-32 bg-white/5 rounded-full mb-4 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <div className="size-2 rounded-full bg-white/5" />
                  <div className="h-3 w-24 bg-white/5 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
