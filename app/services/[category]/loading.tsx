export default function CategoryLoading() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-4 w-32 bg-white/5 rounded-full mb-6 animate-pulse" />
        <div className="h-8 w-48 bg-white/5 rounded-full mb-2 animate-pulse" />
        <div className="h-4 w-80 max-w-full bg-white/5 rounded-full mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-gradient rounded-2xl p-5">
              <div className="h-4 w-3/4 bg-white/5 rounded-full mb-3 animate-pulse" />
              <div className="h-3 w-full bg-white/5 rounded-full mb-2 animate-pulse" />
              <div className="h-3 w-2/3 bg-white/5 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
