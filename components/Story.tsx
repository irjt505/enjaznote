'use client'

import { useLanguage } from '@/lib/LanguageContext'
import ScrollReveal from './ScrollReveal'

export default function Story() {
  const { dict } = useLanguage()
  const paragraphs = dict.about.story.paragraphs

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center text-white mb-12">{dict.about.story.title}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6">
          {paragraphs.map((p, i) => (
            <ScrollReveal key={i}>
              <div className="card-gradient rounded-2xl p-8 text-center">
                <p className="text-text-muted leading-relaxed text-lg">{p}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
