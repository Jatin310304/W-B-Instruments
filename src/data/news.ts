/**
 * News & Events. One article is published on the current site; the rest are clearly labelled placeholders
 * that show the layout. Replace an entry's copy in the locale file and set `placeholder: false` and a real `date`.
 */
export type NewsCategory = 'announcement' | 'launch' | 'industry' | 'exhibition' | 'technical' | 'insight' | 'event'

export interface NewsItem {
  id: string
  category: NewsCategory
  /** ISO date (YYYY-MM-DD) once published. */
  date: string | null
  placeholder: boolean
  author?: string
  source?: string
  /** Picture on the card and article (a name from src/assets/img). Defaults to the category picture. */
  image?: string
}

export const NEWS_CATEGORIES: NewsCategory[] = ['announcement', 'launch', 'industry', 'exhibition', 'technical', 'insight', 'event']

export const NEWS: NewsItem[] = [
  /** Published on wandbinstruments.com.au/news, 29 May 2019. Summarised, not copied. */
  { id: 'new-website-2019', category: 'announcement', date: '2019-05-29', placeholder: false, image: 'gauge-check-poster', author: 'Jonathan Wolfe', source: 'https://www.wandbinstruments.com.au/news/Blog%20Post%20Title%20One-lt9ms' },
  { id: 'company-announcement', category: 'announcement', date: null, placeholder: true, image: 'calibration-lab' },
  { id: 'product-launch', category: 'launch', date: null, placeholder: true, image: 'ir-temperature' },
  { id: 'exhibition', category: 'exhibition', date: null, placeholder: true, image: 'hero' },
  { id: 'industry-update', category: 'industry', date: null, placeholder: true, image: 'photo-metals' },
  { id: 'technical-development', category: 'technical', date: null, placeholder: true, image: 'macro' },
  { id: 'engineering-insight', category: 'insight', date: null, placeholder: true, image: 'pipes' },
  { id: 'company-event', category: 'event', date: null, placeholder: true, image: 'photo-glass' },
]

export const newsById = (id: string) => NEWS.find((n) => n.id === id)
