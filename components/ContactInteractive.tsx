'use client'

import SocialLinks from '@/components/SocialLinks'
import ScrollReveal from '@/components/ScrollReveal'
import LazySection from '@/components/LazySection'
import dynamic from 'next/dynamic'
import { useState, useEffect, startTransition } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { whatsappUrl } from '@/lib/whatsapp'

const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false })

function WorkHoursIndicator({ schedule }: { schedule: { weekdays: string; weekend: string } }) {
  const [state, setState] = useState<'open' | 'closed' | null>(null)

  useEffect(() => {
    startTransition(() => {
      const now = new Date()
      const day = now.getDay()
      const hour = now.getHours()
      const minute = now.getMinutes()
      const currentMinutes = hour * 60 + minute
      const isFriday = day === 5
      const isThursday = day === 4
      const isOpen = isFriday || (isThursday ? currentMinutes >= 480 && currentMinutes < 1020 : currentMinutes >= 480 && currentMinutes < 1380)
      setState(isOpen ? 'open' : 'closed')
    })
  }, [])

  if (!state) return <div className="size-3 rounded-full bg-white/20 animate-pulse" />

  const isOpen = state === 'open'

  return (
    <div className="flex items-center gap-3">
      <div className={`relative size-3 ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
        <div className={`absolute inset-0 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'} animate-ping opacity-60`} />
        <div className={`absolute inset-0 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>
      <span className="font-semibold text-white">
        {isOpen
          ? schedule.weekdays.split(' – ')[0]
          : schedule.weekdays.split(' – ')[1]}
      </span>
    </div>
  )
}

export default function ContactInteractive() {
  const { dict } = useLanguage()

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="card-gradient rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{dict.contact.info}</h2>
                  {dict.contact.schedule && (
                    <WorkHoursIndicator schedule={dict.contact.schedule} />
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <svg aria-hidden="true" focusable="false" className="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{dict.contact.address}</p>
                      <a href="https://maps.app.goo.gl/Wj46ttgQZsYpL1Fr5" target="_blank" rel="noopener noreferrer" className="text-text-muted text-sm hover:text-accent transition-colors inline-flex items-center gap-1">
                        {dict.contact.addressText}
                        <svg aria-hidden="true" focusable="false" className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <svg aria-hidden="true" focusable="false" className="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{dict.contact.phone}</p>
                      <p className="text-text-muted text-sm" dir="ltr">{dict.contact.phoneText}</p>
                      <a href={whatsappUrl('مرحباً، أود الاستفسار عن خدماتكم')} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline inline-flex items-center gap-1 mt-1">
                        <svg aria-hidden="true" focusable="false" className="size-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {dict.contact.form.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <svg aria-hidden="true" focusable="false" className="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{dict.contact.email}</p>
                      <p className="text-text-muted text-sm">{dict.contact.emailText}</p>
                    </div>
                  </div>
                </div>

                {dict.contact.schedule && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="font-semibold text-white mb-2">{dict.contact.hours}</p>
                    <div className="text-sm text-text-muted space-y-1">
                      <p>{dict.contact.schedule.weekdays}</p>
                      <p>{dict.contact.schedule.weekend}</p>
                    </div>
                  </div>
                )}
              </div>

              {dict.contact.mapUrl && (
                <LazySection>
                  <div className="rounded-2xl overflow-hidden border border-white/10 h-[300px]">
                    <iframe
                      src={dict.contact.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={dict.contact.address}
                    />
                  </div>
                </LazySection>
              )}

              <div className="card-gradient rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">{dict.contact.followUs}</h3>
                <SocialLinks />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card-gradient rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">{dict.contact.form.title}</h2>
              <p className="text-text-muted text-sm mb-6">{dict.contact.form.desc}</p>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
