'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import ScrollReveal from './ScrollReveal'

interface Review {
  name: string
  text: string
  stars: number
  date: number
}

interface SupabaseReview {
  id: number
  name: string
  text: string
  stars: number
  approved: boolean
  created_at: string
}

const STORAGE_KEY = 'injaznote-reviews'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-2xl transition-all cursor-pointer ${star <= value ? 'text-accent scale-110' : 'text-white/20'} ${onChange ? 'hover:scale-125' : ''}`}
          aria-label={`${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { dict, lang } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [active, setActive] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [stars, setStars] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    fetch('/api/reviews?approved=true')
      .then((res) => res.json())
      .then((data: SupabaseReview[]) => {
        const serverReviews: Review[] = data.map((r) => ({
          name: r.name,
          text: r.text,
          stars: r.stars,
          date: new Date(r.created_at).getTime(),
        }))
        setReviews(serverReviews)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverReviews))
        setFetchError(false)
      })
      .catch(() => {
        setFetchError(true)
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try { const local = JSON.parse(stored); if (local.length > 0) setReviews(local) } catch {}
        }
      })
  }, [lang])

  const saveReviews = useCallback((r: Review[]) => {
    setReviews(r)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(r))
  }, [])

  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    if (reviews.length === 0 || paused) return
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [reviews.length, paused])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitted) return
    if (!name.trim() || !text.trim()) return
    const newReview: Review = {
      name: name.trim(),
      text: text.trim(),
      stars,
      date: Date.now(),
    }
    saveReviews([newReview, ...reviews])
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), text: text.trim(), stars }),
    }).catch(() => {})
    setName('')
    setText('')
    setStars(5)
    setSubmitted(true)
    setShowForm(false)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const current = reviews[active] || { name: '', text: '', stars: 5 }

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center text-white mb-2">{dict.testimonials.title}</h2>
          <p className="text-text-muted text-center mb-8 max-w-xl mx-auto">{dict.testimonials.subtitle}</p>
        </ScrollReveal>

        {submitted && (
          <div className="max-w-md mx-auto mb-8 px-6 py-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-center font-medium text-sm animate-fade-in-up">
            {dict.testimonials.form.success}
          </div>
        )}
        {fetchError && (
          <div className="max-w-md mx-auto mb-8 px-6 py-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-center font-medium text-sm">
            تعذر تحميل التقييمات. يتم عرض التقييمات المحفوظة.
          </div>
        )}

        {reviews.length > 0 && (
          <ScrollReveal>
            <div className="relative max-w-3xl mx-auto mb-10">
              <div className="relative overflow-hidden rounded-2xl card-gradient border border-white/10"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                <div className="p-8 md:p-10">
                  <StarRating value={current.stars} />
                  <p className="text-lg md:text-xl text-text-light/80 leading-relaxed mt-4 mb-6 transition-all duration-500">
                    {current.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                      {current.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{current.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {reviews.slice(0, 7).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`size-2.5 rounded-full transition-all cursor-pointer ${
                      i === active ? 'bg-accent w-8' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-dashed border-accent/40 text-accent font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all cursor-pointer"
            >
              ✍️ {showForm
                ? dict.testimonials.close
                : (lang === 'ar' ? 'أضف تقييمك' : 'Add Your Review')}
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <form onSubmit={handleSubmit} className="card-gradient rounded-2xl p-6 md:p-8 border-accent/20 space-y-4">
                <h3 className="text-xl font-bold text-white text-center">{dict.testimonials.form.title}</h3>

                <div className="text-center">
                  <p className="text-sm text-text-muted mb-2">{dict.testimonials.form.ratingLabel}</p>
                  <StarRating value={stars} onChange={setStars} />
                </div>

                <label htmlFor="review-name" className="sr-only">{dict.testimonials.form.namePlaceholder}</label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={dict.testimonials.form.namePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 text-center"
                />

                <label htmlFor="review-text" className="sr-only">{dict.testimonials.form.textPlaceholder}</label>
                <textarea
                  id="review-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={3}
                  placeholder={dict.testimonials.form.textPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 resize-none text-center"
                />

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full px-6 py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  <svg aria-hidden="true" focusable="false" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {dict.testimonials.form.submit}
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
