'use client'

import { useState, KeyboardEvent } from 'react'

export default function TagInput({ tags, onChange, placeholder }: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder: string
}) {
  const [input, setInput] = useState('')

  const addTag = (raw: string) => {
    const val = raw.replace(/,/g, '').trim()
    if (!val) return
    if (tags.includes(val)) return
    onChange([...tags, val])
  }

  const removeTag = (i: number) => {
    onChange(tags.filter((_, idx) => idx !== i))
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
      setInput('')
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-[#c49027]/30 transition-all cursor-text min-h-[32px]" onClick={() => document.getElementById(`tag-input-${placeholder.replace(/\s/g, '')}`)?.focus()}>
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-md bg-[#c49027]/10 text-[#c49027] border border-[#c49027]/15">
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(i) }}
            className="size-3 flex items-center justify-center rounded-full hover:bg-[#c49027]/20 transition-colors cursor-pointer"
            aria-label={`حذف ${tag}`}
          >
            <svg className="size-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </span>
      ))}
      <input
        id={`tag-input-${placeholder.replace(/\s/g, '')}`}
        value={input}
        onChange={(e) => {
          const v = e.target.value
          if (v.endsWith(',')) {
            addTag(v.slice(0, -1))
            setInput('')
          } else {
            setInput(v)
          }
        }}
        onKeyDown={handleKey}
        onBlur={() => {
          if (input.trim()) {
            addTag(input)
            setInput('')
          }
        }}
        className="flex-1 min-w-[80px] bg-transparent text-[11px] text-white placeholder-gray-500 focus:outline-none"
        placeholder={tags.length ? '' : placeholder}
      />
    </div>
  )
}
