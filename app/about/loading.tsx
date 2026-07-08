export default function AboutLoading() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-3 w-24 bg-white/5 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 w-56 bg-white/5 rounded-full mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="card-gradient rounded-2xl p-8">
              <div className="h-6 w-32 bg-white/5 rounded-full mb-4 animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded-full mb-2 animate-pulse" />
              <div className="h-4 w-5/6 bg-white/5 rounded-full mb-2 animate-pulse" />
              <div className="h-4 w-4/6 bg-white/5 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
