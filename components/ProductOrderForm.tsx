'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { whatsappUrl } from '@/lib/whatsapp'

export default function ProductOrderForm({ productName, categoryTitle }: { productName: string; categoryTitle: string }) {
  const { dict, lang } = useLanguage()
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fullMessage = lang === 'ar'
    ? `مرحباً، أود طلب خدمة: ${productName}\n\nالقسم: ${categoryTitle}\nالخدمة: ${productName}\nرقم الجوال: ${phone}\n${notes ? `ملاحظات: ${notes}\n` : ''}الرجاء تأكيد السعر والتوفر`
    : `Hello, I would like to request: ${productName}\n\nCategory: ${categoryTitle}\nProduct: ${productName}\nPhone: ${phone}\n${notes ? `Notes: ${notes}\n` : ''}Please confirm price and availability`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card-gradient rounded-2xl p-8 md:p-10 text-center border-accent/20">
        <h2 className="text-2xl font-bold text-white mb-2">
          {dict.services.orderNow}
        </h2>
        <p className="text-text-muted text-sm mb-6">{dict.services.requestBtn}</p>

        <div className="mb-6 space-y-4 text-start">
          <div>
            <label htmlFor="phone-input" className="block text-sm font-medium text-text-light mb-2">
              {lang === 'ar' ? 'رقم الجوال' : 'Phone Number'} <span className="text-red-400">*</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError('') }}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:ring-2 outline-none transition-all text-white placeholder:text-text-dim/50 text-center ${
                phoneError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-accent focus:ring-accent/20'
              }`}
              placeholder={lang === 'ar' ? '05XXXXXXXX' : '05XXXXXXXX'}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? 'phone-error-msg' : undefined}
            />
          </div>
          <div>
            <label htmlFor="notes-input" className="block text-sm font-medium text-text-light mb-2">
              {dict.services.notes}
            </label>
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 resize-none"
              placeholder={dict.services.notesPlaceholder}
            />
          </div>
        </div>

        {phoneError && <p id="phone-error-msg" className="text-red-400 text-xs -mt-4" role="alert">{phoneError}</p>}
        <button
          type="button"
          disabled={submitting}
          onClick={async () => {
            if (submitting) return
            const p = phone.trim()
            if (!p) { setPhoneError(lang === 'ar' ? 'يرجى إدخال رقم الجوال' : 'Please enter your phone number'); return }
            if (!/^05[0-9]{8}$/.test(p)) { setPhoneError(lang === 'ar' ? 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Phone must start with 05 and be 10 digits'); return }
            setPhoneError('')
            setSubmitting(true)
            try {
              await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service_name: productName, category_name: categoryTitle, notes, phone: p }),
              })
            } catch {
              // silently save
            }
            window.open(whatsappUrl(fullMessage), '_blank')
            setSubmitting(false)
          }}
          className="inline-flex items-center justify-center gap-3 w-full px-8 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all hover:shadow-2xl hover:shadow-accent/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg aria-hidden="true" focusable="false" className="size-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {dict.services.orderViaWhatsapp}
        </button>
      </div>
    </div>
  )
}
