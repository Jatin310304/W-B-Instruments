import { PRODUCTS, SOLUTIONS } from '../data/catalog'
import { INDUSTRIES } from '../data/industries'
import { BUSINESSES } from '../data/businesses'
import { NEWS } from '../data/news'
import { LEGAL_IDS, RESOURCES } from '../data/site'
import { COMPANY } from '../data/company'

/** All indexable paths. Placeholder news articles are left out of the sitemap. */
export function allPaths(): string[] {
  return [
    '/', '/industries', '/products', '/businesses', '/news', '/resources', '/support', '/about', '/careers', '/contact',
    ...INDUSTRIES.map((i) => `/industries/${i.id}`),
    ...SOLUTIONS.map((s) => `/solutions/${s.id}`),
    ...PRODUCTS.map((p) => `/products/${p.id}`),
    ...BUSINESSES.map((b) => `/businesses/${b.id}`),
    ...NEWS.filter((n) => !n.placeholder).map((n) => `/news/${n.id}`),
    ...RESOURCES.map((r) => `/resources/${r}`),
    ...LEGAL_IDS.map((l) => `/legal/${l}`),
  ]
}

export function sitemapXml() {
  const urls = allPaths().map((p) => `  <url><loc>${COMPANY.siteUrl}${p === '/' ? '/' : p}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: ${COMPANY.siteUrl}/sitemap.xml\n`
}
