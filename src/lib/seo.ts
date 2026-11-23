import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { COMPANY } from '@/data/company'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/** Sets the page title, description, canonical URL and Open Graph tags. */
export function usePageMeta(title: string | null, description?: string) {
  const { m } = useI18n()
  const { pathname } = useLocation()
  useEffect(() => {
    const override = m.seo[pathname.replace(/\/$/, '') || '/']
    const full = override?.title ?? (title ? title + m.meta.titleSuffix : m.meta.homeTitle)
    const desc = (override?.description ?? (description || m.meta.homeDescription)).slice(0, 300)
    document.title = full
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', COMPANY.siteUrl + pathname)
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = COMPANY.siteUrl + pathname
    // Internal search results are not indexed.
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (pathname.startsWith('/search')) {
      if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
      robots.content = 'noindex, follow'
    } else robots?.remove()
  }, [title, description, m, pathname])
}
