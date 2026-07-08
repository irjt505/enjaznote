export const categoryIcons: Record<string, string> = {
  office: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h8M8 11h6M8 15h4',
  student: 'M12 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2a7 7 0 0 1 7 7c0 3.5-2 6.5-5 8.5M12 2a7 7 0 0 0-7 7c0 3.5 2 6.5 5 8.5 M3 21h18',
  digital: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z M21 16a2 2 0 0 0-2-2h-2.5',
  government: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3 M12 2v4',
}

export const validCategories = ['office', 'student', 'digital', 'government'] as const
export type CategoryKey = typeof validCategories[number]
