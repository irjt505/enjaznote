export default function Loading() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-3 w-32 bg-white/5 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 w-64 bg-white/5 rounded-full mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-white/5 rounded-full mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-gradient rounded-2xl p-6">
              <div className="size-14 rounded-2xl bg-white/5 mx-auto mb-4 animate-pulse" />
              <div className="h-4 w-24 bg-white/5 rounded-full mx-auto mb-2 animate-pulse" />
              <div className="h-3 w-40 max-w-full bg-white/5 rounded-full mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
