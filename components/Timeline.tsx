'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Timeline() {
  const { dict } = useLanguage()
  const events = dict.about.timeline.events

  return (
    <section className="py-20 bg-primary-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-16">{dict.about.timeline.title}</h2>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[23px] md:left-1/2 w-0.5 bg-accent/30 -translate-x-1/2" />
          {events.map((event, i) => {
            const isLeft = i % 2 === 0
            return (
              <div key={`${event.year}-${i}`} className="relative flex items-start gap-6 md:gap-0 mb-12 last:mb-0 md:odd:flex-row-reverse">
                <div className="hidden md:block md:w-1/2 md:px-8">
                  <div className={`${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                    <p className="text-text-muted">{event.desc}</p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center shrink-0">
                  <div className="size-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-accent/25">
                    {event.year}
                  </div>
                </div>
                <div className="md:hidden flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-text-muted text-sm">{event.desc}</p>
                </div>
                <div className="hidden md:block md:w-1/2 md:px-8">
                  <div className={`${isLeft ? 'md:text-left' : 'md:text-right'}`}>
                    <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                    <p className="text-text-muted">{event.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
