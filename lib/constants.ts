export const categoryIcons: Record<string, string> = {
  office: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h8M8 11h6M8 15h4',
  student: 'M12 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2a7 7 0 0 1 7 7c0 3.5-2 6.5-5 8.5M12 2a7 7 0 0 0-7 7c0 3.5 2 6.5 5 8.5 M3 21h18',
  digital: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z M21 16a2 2 0 0 0-2-2h-2.5',
  government: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3 M12 2v4',
}

export const itemIcons: Record<string, string> = {
  'web-dev': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  ecommerce: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  'menu-programming': 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5',
  'graphic-design': 'M17.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L17.5 3.5z M20 8l-4-4',
  'social-media': 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  'digital-marketing': 'M5 8h10l4-4v12l-4-4H5V8z',
  'data-entry': 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 12h6M9 16h6M9 8h1',
}

export const validCategories = ['office', 'student', 'digital', 'government'] as const
export type CategoryKey = typeof validCategories[number]
