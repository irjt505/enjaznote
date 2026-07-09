'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { whatsappUrl } from '@/lib/whatsapp'

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
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(form: HTMLFormElement) {
    const errs: Record<string, string> = {}
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim()
    const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value.trim()
    const message = (form.elements.namedItem('message') as HTMLInputElement)?.value.trim()
    if (!name) errs.name = lang === 'ar' ? 'يرجى إدخال الاسم' : 'Please enter your name'
    if (!email) errs.email = lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = lang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'
    if (!phone) errs.phone = lang === 'ar' ? 'يرجى إدخال رقم الجوال' : 'Please enter your phone number'
    else if (!/^05[0-9]{8}$/.test(phone)) errs.phone = lang === 'ar' ? 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Phone must start with 05 and be 10 digits'
    if (!message) errs.message = lang === 'ar' ? 'يرجى إدخال الرسالة' : 'Please enter your message'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const honeypot = new FormData(form).get('website') as string
    if (honeypot) return
    if (!validate(form)) return

    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
    const service = (form.elements.namedItem('service') as HTMLSelectElement).value
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim()

    const msg = lang === 'ar'
      ? `مرحباً، طلب استفسار جديد:\n\nالاسم: ${name}\nالبريد: ${email}\nالجوال: ${phone}\nالخدمة: ${service}\nالرسالة: ${message}`
      : `Hello, new inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`

    window.open(whatsappUrl(msg), '_blank')
    setSubmitted(true)
    setToast(lang === 'ar' ? 'تم تحويلك إلى واتساب ✓' : 'Redirected to WhatsApp ✓')
    formRef.current?.reset()
    setErrors({})
    setTimeout(() => setSubmitted(false), 3000)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const name = e.target.name
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
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
          <label className="block text-sm font-medium text-text-light mb-1.5" htmlFor="contact-name">{dict.contact.form.name} <span className="text-red-400">*</span></label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            onChange={onInputChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:ring-2 outline-none transition-all text-white placeholder:text-text-dim/50 ${
              errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-accent focus:ring-accent/20'
            }`}
          />
          {errors.name && <p id="name-error" className="text-red-400 text-xs mt-1.5" role="alert">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5" htmlFor="contact-email">{dict.contact.form.email} <span className="text-red-400">*</span></label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            onChange={onInputChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:ring-2 outline-none transition-all text-white placeholder:text-text-dim/50 ${
              errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-accent focus:ring-accent/20'
            }`}
          />
          {errors.email && <p id="email-error" className="text-red-400 text-xs mt-1.5" role="alert">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5" htmlFor="contact-phone">
            {lang === 'ar' ? 'رقم الجوال' : 'Phone Number'} <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            dir="ltr"
            onChange={onInputChange}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            placeholder={lang === 'ar' ? '05XXXXXXXX' : '05XXXXXXXX'}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:ring-2 outline-none transition-all text-white placeholder:text-text-dim/50 ${
              errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-accent focus:ring-accent/20'
            }`}
          />
          {errors.phone && <p id="phone-error" className="text-red-400 text-xs mt-1.5" role="alert">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5" htmlFor="contact-service">
            {lang === 'ar' ? 'نوع الخدمة' : 'Service Type'} <span className="text-red-400">*</span>
          </label>
          <select
            id="contact-service"
            name="service"
            required
            onChange={onInputChange}
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
          <label className="block text-sm font-medium text-text-light mb-1.5" htmlFor="contact-message">{dict.contact.form.message} <span className="text-red-400">*</span></label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            onChange={onInputChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:ring-2 outline-none transition-all text-white placeholder:text-text-dim/50 resize-none ${
              errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-accent focus:ring-accent/20'
            }`}
          />
          {errors.message && <p id="message-error" className="text-red-400 text-xs mt-1.5" role="alert">{errors.message}</p>}
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
