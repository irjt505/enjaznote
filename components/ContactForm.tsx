'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { whatsappUrl } from '@/components/WhatsAppButton'

const serviceTypes = ['printing', 'scanning', 'government', 'student', 'design', 'other'] as const

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-green-600 text-white shadow-2xl text-sm font-medium flex items-center gap-2 animate-fade-in-up">
      <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  )
}

export default function ContactForm() {
  const { dict, lang } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const honeypot = form.get('website') as string
    if (honeypot) return

    const name = form.get('name') as string
    const email = form.get('email') as string
    const phone = form.get('phone') as string
    const service = form.get('service') as string
    const message = form.get('message') as string

    const msg = lang === 'ar'
      ? `مرحباً، طلب استفسار جديد:\n\nالاسم: ${name}\nالبريد: ${email}\nالجوال: ${phone}\nالخدمة: ${service}\nالرسالة: ${message}`
      : `Hello, new inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`

    window.open(whatsappUrl(msg), '_blank')
    setSubmitted(true)
    setToast(lang === 'ar' ? 'تم تحويلك إلى واتساب ✓' : 'Redirected to WhatsApp ✓')
    formRef.current?.reset()
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent-light text-center">
          {lang === 'ar'
            ? 'بعد إرسال النموذج، راح تتحول إلى واتساب لتأكيد الطلب'
            : 'After submitting, you will be redirected to WhatsApp to confirm'}
        </div>

        <input type="text" name="website" className="absolute opacity-0 pointer-events-none" tabIndex={-1} autoComplete="off" />

        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">{dict.contact.form.name} <span className="text-red-400">*</span></label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">{dict.contact.form.email} <span className="text-red-400">*</span></label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">
            {lang === 'ar' ? 'رقم الجوال' : 'Phone Number'} <span className="text-red-400">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">
            {lang === 'ar' ? 'نوع الخدمة' : 'Service Type'} <span className="text-red-400">*</span>
          </label>
          <select
            name="service"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white"
          >
            <option value="" className="bg-primary text-white/70">{lang === 'ar' ? 'اختر نوع الخدمة' : 'Select service type'}</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type} className="bg-primary text-white">
                {dict.contact.form[type] || type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">{dict.contact.form.message} <span className="text-red-400">*</span></label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitted}
          className="w-full px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitted ? '✓ ' + (lang === 'ar' ? 'تم الإرسال' : 'Sent') : dict.contact.form.submit}
        </button>
      </form>
    </>
  )
}
