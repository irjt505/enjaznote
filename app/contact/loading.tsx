export default function ContactLoading() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-3 w-32 bg-white/5 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 w-48 bg-white/5 rounded-full mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-gradient rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/5 animate-pulse" />
                  <div>
                    <div className="h-3 w-16 bg-white/5 rounded-full mb-2 animate-pulse" />
                    <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card-gradient rounded-2xl p-8">
            <div className="h-6 w-32 bg-white/5 rounded-full mb-6 animate-pulse" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-4">
                <div className="h-3 w-20 bg-white/5 rounded-full mb-2 animate-pulse" />
                <div className="h-10 w-full bg-white/5 rounded-xl animate-pulse" />
              </div>
            ))}
            <div className="h-10 w-full bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
