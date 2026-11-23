import { useEffect, useState } from 'react'
import { IMAGES } from '@/lib/assets'
import type { NewsCategory } from '@/data/news'

/** Content published by staff in the content panel (server/cms.mjs), read from GET /api/content. */
export interface CmsPost {
  id: string
  title: string
  category: NewsCategory
  date: string
  author?: string
  excerpt: string
  body: string
  /** "/uploads/…" (uploaded) or "site:<name>" (one of the site's own pictures). Empty: the category picture. */
  image?: string
  imageAlt?: string
  /** YouTube or Vimeo link, or an uploaded "/uploads/….mp4". */
  video?: string
}
export interface CmsJob { id: string; title: string; location: string; type: string; description: string; applyEmail?: string; closingDate?: string }
interface Content { posts: CmsPost[]; jobs: CmsJob[]; ready: boolean }

let cache: Promise<Content> | null = null
function load(): Promise<Content> {
  if (location.protocol === 'file:') return Promise.resolve({ posts: [], jobs: [], ready: true })
  cache ??= fetch('/api/content', { headers: { accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : { posts: [], jobs: [] }))
    .then((j) => ({ posts: Array.isArray(j.posts) ? j.posts : [], jobs: Array.isArray(j.jobs) ? j.jobs : [], ready: true }))
    .catch(() => ({ posts: [], jobs: [], ready: true }))
  return cache
}

export function useCms(): Content {
  const [c, setC] = useState<Content>({ posts: [], jobs: [], ready: false })
  useEffect(() => {
    let live = true
    load().then((x) => live && setC(x))
    return () => { live = false }
  }, [])
  return c
}

/** Picture shown for each news category when a post has none, so no card is ever blank. */
export const CATEGORY_IMAGE: Record<NewsCategory, string> = {
  announcement: 'calibration-lab', launch: 'instrument-poster', industry: 'photo-metals', exhibition: 'hero', technical: 'macro', insight: 'pipes', event: 'tanks',
}

/** Resolves a post image to a site image name (for <Img>) or an uploaded file URL. */
export function postImage(image: string | undefined, category: NewsCategory): { name?: string; src?: string } {
  if (image?.startsWith('/uploads/')) return { src: image }
  const name = image?.startsWith('site:') ? image.slice(5) : ''
  return { name: name && IMAGES[name] ? name : CATEGORY_IMAGE[category] }
}

/** YouTube/Vimeo link to a privacy-friendly embed URL; uploaded files play in a <video>. */
export function videoEmbed(url?: string): { iframe?: string; file?: string } | null {
  if (!url) return null
  if (url.startsWith('/uploads/')) return { file: url }
  const yt = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,20})/.exec(url)
  if (yt) return { iframe: `https://www.youtube-nocookie.com/embed/${yt[1]}` }
  const vm = /vimeo\.com\/(?:video\/)?(\d{5,12})/.exec(url)
  if (vm) return { iframe: `https://player.vimeo.com/video/${vm[1]}?dnt=1` }
  return null
}

/** Plain text to paragraphs and bullet lists ("- " lines). Never rendered as HTML. */
export function blocks(text: string): ({ p: string } | { ul: string[] })[] {
  return text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const lines = b.split('\n').map((l) => l.trim())
    return lines.every((l) => /^[-•*]\s+/.test(l)) ? { ul: lines.map((l) => l.replace(/^[-•*]\s+/, '')) } : { p: lines.join(' ') }
  })
}
