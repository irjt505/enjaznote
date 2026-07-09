export const categoryIcons: Record<string, string> = {
  office: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h8M8 11h6M8 15h4',
  student: 'M12 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2a7 7 0 0 1 7 7c0 3.5-2 6.5-5 8.5M12 2a7 7 0 0 0-7 7c0 3.5 2 6.5 5 8.5 M3 21h18',
  digital: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z M21 16a2 2 0 0 0-2-2h-2.5',
  government: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3 M12 2v4',
}

export const itemIcons: Record<string, string> = {
  'web-dev': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  ecommerce: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  'menu-programming': 'M4 6h16M4 12h16M4 18h16 M20 7l-3 3M14 7l3 3',
  'graphic-design': 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z M15 14l3 4',
  'social-media': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  'digital-marketing': 'M22 12h-4l-3 9L9 3l-3 9H2',
  'data-entry': 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 12h6M9 16h6M9 8h1',
}

export const validCategories = ['office', 'student', 'digital', 'government'] as const
export type CategoryKey = typeof validCategories[number]
