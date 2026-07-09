const websiteUrl = process.env.WEBSITE_URL || 'https://www.enjaznote.com'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function linkify(text: string): string {
  return text.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" style="color:#c49027;text-decoration:underline">$1</a>'
  )
}

function formatBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#c49027">$1</strong>')
}

function formatInline(text: string): string {
  return linkify(formatBold(escapeHtml(text)))
}

export function textToHtml(text: string): string {
  const lines = text.split('\n')
  const bodyLines: string[] = []
  let inList = false

  function closeList() {
    if (inList) { bodyLines.push('</ul>'); inList = false }
  }

  for (const raw of lines) {
    const trimmed = raw.trim()

    if (!trimmed) {
      closeList()
      bodyLines.push('<div style="height:12px"></div>')
      continue
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        closeList()
        bodyLines.push('<ul style="margin:0;padding-right:20px">')
        inList = true
      }
      bodyLines.push(`<li style="margin-bottom:6px;line-height:1.8">${formatInline(trimmed.slice(2))}</li>`)
      continue
    }

    closeList()
    bodyLines.push(`<p style="margin:0 0 8px;line-height:1.8;font-size:15px">${formatInline(trimmed)}</p>`)
  }
  closeList()

  const bodyHtml = bodyLines.join('\n')

  return `
    <div style="font-family:'Segoe UI',Tahoma,sans-serif;background:#002248;color:#e0e0e0;padding:40px 20px">
      <div style="max-width:560px;margin:0 auto">
        <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08)">
          <h1 style="color:#c49027;margin:0;font-size:22px;letter-spacing:0.5px">انجاز نوت</h1>
          <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:6px 0 0">للاستشارات والخدمات العامة</p>
        </div>
        ${bodyHtml}
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;font-size:11px;color:rgba(255,255,255,0.3)">
          <p style="margin:0 0 6px">تابعنا على</p>
          <p style="margin:0 0 4px">
            <a href="https://www.snapchat.com/add/enjaznote" style="color:#c49027;text-decoration:none">سناب شات</a>
            <span style="margin:0 6px;color:rgba(255,255,255,0.15)">|</span>
            <a href="https://www.tiktok.com/@enjaznote" style="color:#c49027;text-decoration:none">تيك توك</a>
          </p>
          <p style="margin:0 0 12px">
            <a href="${websiteUrl}" style="color:rgba(255,255,255,0.4);text-decoration:none">www.enjaznote.com</a>
          </p>
          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.2)">
            تم إرسال هذه الرسالة لأنك مشترك في النشرة البريدية لـ انجاز نوت
          </p>
          <p style="margin:6px 0 0;font-size:10px">
            <a href="__UNSUBSCRIBE_URL__" style="color:rgba(255,255,255,0.3);text-decoration:underline">إلغاء الاشتراك</a>
          </p>
        </div>
      </div>
    </div>
  `.trim()
}
