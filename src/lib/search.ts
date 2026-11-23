import type { Messages } from '@/i18n/locales/en'
import { CATEGORIES, PRODUCTS, SOLUTIONS, brandById } from '@/data/catalog'
import { INDUSTRIES } from '@/data/industries'
import { BUSINESSES } from '@/data/businesses'
import { NEWS } from '@/data/news'
import { RESOURCES } from '@/data/site'
import { to } from './routes'

export type ResultType = keyof Messages['search']['types']
export interface SearchEntry { type: ResultType; title: string; text: string; to: string; keywords: string }

/** Builds the search index in the active language, so results match what the visitor reads. */
export function buildIndex(m: Messages): SearchEntry[] {
  const e: SearchEntry[] = []
  for (const p of PRODUCTS) {
    const c = m.products.items[p.id as keyof typeof m.products.items]
    e.push({ type: 'product', title: c.name, text: c.desc, to: to.product(p.id), keywords: [c.plain, c.measures, c.uses, brandById(p.brand).name, m.categories[p.cat].name].join(' ') })
  }
  for (const s of SOLUTIONS) {
    const c = m.solutions.items[s.id]
    e.push({ type: 'solution', title: c.name, text: c.short, to: to.solution(s.id), keywords: c.intro })
  }
  for (const c of CATEGORIES) e.push({ type: 'category', title: m.categories[c.id].name, text: m.categories[c.id].desc, to: to.products({ category: c.id }), keywords: '' })
  for (const i of INDUSTRIES) {
    const c = m.industries.items[i.id as keyof typeof m.industries.items]
    e.push({ type: 'industry', title: c.name, text: c.summary, to: to.industry(i.id), keywords: c.overview + ' ' + c.challenges.join(' ') })
  }
  for (const b of BUSINESSES) {
    const c = m.businesses.items[b.id]
    e.push({ type: 'business', title: c.name, text: c.short, to: to.business(b.id), keywords: [c.overview, ...c.products, ...c.materials].join(' ') })
  }
  for (const r of RESOURCES) {
    const c = m.resources.items[r]
    e.push({ type: 'resource', title: c.name, text: c.short, to: to.resource(r), keywords: c.intro })
  }
  for (const g of m.resources.glossary) e.push({ type: 'resource', title: g.t, text: g.d, to: to.resource('insights'), keywords: '' })
  for (const n of NEWS.filter((x) => !x.placeholder)) {
    const c = m.news.items[n.id as keyof typeof m.news.items]
    e.push({ type: 'news', title: c.title, text: c.excerpt, to: to.article(n.id), keywords: c.body.join(' ') })
  }
  const pages: [string, string, string][] = [
    [m.nav.about, m.about.intro, to.about()],
    [m.nav.careers, m.careers.intro, to.careers()],
    [m.nav.contact, m.contact.intro, to.contact()],
    [m.nav.support, m.support.intro, to.support()],
    [m.nav.news, m.news.intro, to.news()],
    [m.services.items.calibration.name, m.services.items.calibration.text, to.solution('calibration-testing')],
  ]
  for (const [title, text, path] of pages) e.push({ type: 'page', title, text, to: path, keywords: '' })
  return e
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[–—]/g, '-')

/** Ranks by whole-query and per-word matches, weighting the title highest. Every word must match somewhere. */
export function search(index: SearchEntry[], q: string, limit = 50): SearchEntry[] {
  const query = norm(q.trim())
  if (!query) return []
  const words = query.split(/\s+/).filter(Boolean)
  return index
    .map((x) => {
      const t = norm(x.title), d = norm(x.text), k = norm(x.keywords)
      let score = 0
      for (const w of words) {
        const s = (t.includes(w) ? 6 : 0) + (d.includes(w) ? 2 : 0) + (k.includes(w) ? 1 : 0)
        if (!s) return { x, score: 0 }
        score += s + (t.startsWith(w) ? 2 : 0)
      }
      if (t.includes(query)) score += 5
      return { x, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.x)
}
