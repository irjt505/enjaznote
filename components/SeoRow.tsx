'use client'

import { useState, useEffect, startTransition, useCallback } from 'react'
import type { SeoEntry } from '@/lib/seo'
import TagInput from './TagInput'
import { d } from '@/app/admin/dict'

function charColor(len: number, max: number): string {
  if (len > max) return 'text-red-400'
  if (len > max * 0.9) return 'text-[#c49027]'
  return 'text-gray-400'
}

export default function SeoRow({ entry, onSave, onDeleteRequest }: {
  entry: SeoEntry
  onSave: (id: number, u: Partial<SeoEntry>) => Promise<boolean>
  onDeleteRequest: (id: number) => void
}) {
  const [title, setTitle] = useState(entry.title || '')
  const [description, setDescription] = useState(entry.description || '')
  const [keywordTags, setKeywordTags] = useState<string[]>(() =>
    entry.keywords ? entry.keywords.split(',').map((k) => k.trim()).filter(Boolean) : []
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setTitle(entry.title || '')
      setDescription(entry.description || '')
      setKeywordTags(
        entry.keywords ? entry.keywords.split(',').map((k) => k.trim()).filter(Boolean) : []
      )
    })
  }, [entry.id, entry.title, entry.description, entry.keywords])

  const isChanged =
    title !== (entry.title || '') ||
    description !== (entry.description || '') ||
    keywordTags.join(', ') !== ((entry.keywords || '').split(',').map((k) => k.trim()).filter(Boolean).join(', '))

  const handleSave = useCallback(async () => {
    setSaving(true)
    await onSave(entry.id!, {
      title: title || null,
      description: description || null,
      keywords: keywordTags.length ? keywordTags.join(', ') : null,
    })
    setSaving(false)
  }, [onSave, entry.id, title, description, keywordTags])

  const tLen = title.length
  const dLen = description.length

  return (
    <div className="bg-gradient-to-br from-[#001a35] to-[#002248] rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="size-3.5 text-[#c49027] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <code className="text-[11px] font-mono text-[#c49027] bg-[#c49027]/10 px-1.5 py-0.5 rounded-md truncate">{entry.page_path}</code>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onDeleteRequest(entry.id!)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-600/10 transition-all cursor-pointer"
            title={d.seo.deleteTooltip}
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged || saving}
            className={`px-3 py-1 text-[10px] rounded-lg border transition-all cursor-pointer ${
              isChanged
                ? 'bg-[#c49027]/15 text-[#c49027] border-[#c49027]/20 hover:bg-[#c49027]/25'
                : 'bg-white/[0.03] text-gray-400 border-white/[0.06] cursor-not-allowed'
            }`}
          >
            {saving ? d.seo.savingBtn : d.seo.saveBtn}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="text-[9px] text-gray-300">{d.seo.labelTitle}</label>
            <div className="flex items-center gap-1.5 text-[9px]">
              {tLen > 60 && <span className="text-red-400">{d.seo.titleTooLong}</span>}
              <span className={charColor(tLen, 60)}>{d.seo.titleLength(tLen)}</span>
            </div>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className={`w-full px-2 py-1 text-[11px] rounded-lg bg-white/[0.04] border text-white placeholder-gray-500 focus:outline-none focus:border-[#c49027]/30 transition-all ${
              tLen > 60 ? 'border-red-500/30' : 'border-white/[0.06]'
            }`}
            placeholder={d.seo.titlePlaceholder}
          />
          {title && (
            <div className="mt-1 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[11px] text-blue-400 leading-tight truncate">
                {title} | انجاز نوت
              </p>
              {description && (
                <p className="text-[10px] text-gray-400 leading-tight line-clamp-1 mt-[1px]">{description}</p>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="text-[9px] text-gray-300">{d.seo.labelDescription}</label>
            <div className="flex items-center gap-1.5 text-[9px]">
              {dLen > 160 && <span className="text-red-400">{d.seo.descTooLong}</span>}
              <span className={charColor(dLen, 160)}>{d.seo.titleLength(dLen)}</span>
            </div>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={320}
            className={`w-full px-2 py-1 text-[11px] rounded-lg bg-white/[0.04] border text-white placeholder-gray-500 focus:outline-none focus:border-[#c49027]/30 transition-all resize-none ${
              dLen > 160 ? 'border-red-500/30' : 'border-white/[0.06]'
            }`}
            placeholder={d.seo.descriptionPlaceholder}
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-[9px] text-gray-300 mb-0.5">{d.seo.labelKeywords}</label>
          <TagInput
            tags={keywordTags}
            onChange={setKeywordTags}
            placeholder={d.seo.keywordsAddPlaceholder}
          />
          {keywordTags.length > 0 && (
            <p className="text-[9px] text-gray-400 mt-0.5">{d.seo.keywordsCount(keywordTags.length)}</p>
          )}
        </div>
      </div>
    </div>
  )
}
