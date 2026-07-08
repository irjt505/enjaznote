'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { whatsappUrl } from '@/components/WhatsAppButton'
import ScrollReveal from './ScrollReveal'

interface Props {
  title?: string
  desc?: string
  btnLabel?: string
}

export default function CustomServiceRequest({ title, desc, btnLabel }: Props) {
  const { lang, dict } = useLanguage()
  const [open, setOpen] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const t = title || dict.services.customService.title
  const d = desc || dict.services.customService.desc
  const b = btnLabel || dict.services.customService.button

  function handleOpen() {
    setOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleSend() {
    if (!serviceName.trim()) return
    const msg = `${
      lang === 'ar' ? 'مرحباً، أود طلب خدمة مخصصة:\n\nالخدمة المطلوبة' : 'Hello, I would like to request a custom service:\n\nService requested'
    }: ${serviceName.trim()}`
    window.open(whatsappUrl(msg), '_blank')
    setOpen(false)
    setServiceName('')
  }

  function handleCancel() {
    setOpen(false)
    setServiceName('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-dark" />
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/5 blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div className="card-gradient rounded-3xl p-10 md:p-14 border-accent/20" style={{ animation: 'borderGlow 3s ease-in-out infinite' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t}</h2>
            <p className="text-text-muted text-lg mb-6 max-w-xl mx-auto">{d}</p>

            <div id="custom-service-panel" className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 text-center text-lg"
                  placeholder={dict.services.customService.inputPlaceholder}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSend}
                    disabled={!serviceName.trim()}
                    className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer ${
                      serviceName.trim()
                        ? 'bg-accent text-white hover:bg-accent-light hover:shadow-2xl hover:shadow-accent/30'
                        : 'bg-white/10 text-text-dim cursor-not-allowed'
                    }`}
                  >
                    <svg aria-hidden="true" focusable="false" className="size-6 inline me-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {dict.services.customService.send}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-4 rounded-xl border border-white/20 text-text-muted hover:bg-white/10 hover:text-white transition-all font-medium cursor-pointer"
                  >
                    {dict.services.customService.cancel}
                  </button>
                </div>
              </div>
            </div>

            {!open && (
              <button
                onClick={handleOpen}
                aria-expanded={open}
                aria-controls="custom-service-panel"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all hover:shadow-2xl hover:shadow-accent/30 cursor-pointer"
              >
                <svg aria-hidden="true" focusable="false" className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                {b}
              </button>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
