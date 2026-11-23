import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronRight, Gauge, Phone, Play } from 'lucide-react'
import { DIMS, IMAGES, PHOTO_CREDITS, isProductPhoto, isRender } from '@/lib/assets'
import { cn } from '@/lib/cn'
import { useI18n } from '@/i18n/I18nProvider'
import { brandById, productById, type Product } from '@/data/catalog'
import { COMPANY, telHref } from '@/data/company'
import { to } from '@/lib/routes'
import type { NewsItem } from '@/data/news'
import { CATEGORY_IMAGE, postImage, type CmsPost } from '@/lib/cms'

export const ICON = { strokeWidth: 1.5 } as const

/* ---------- Images ---------- */

interface ImgProps {
  name: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  fit?: 'cover' | 'contain'
  /** Show the "Studio render" / "example from the range" label where it applies. */
  label?: boolean
}

export function Img({ name, alt, sizes = '100vw', priority, className, imgClassName, fit = 'cover', label }: ImgProps) {
  const { m } = useI18n()
  const src = IMAGES[name]
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(!!priority)
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])
  if (!src) return <PlaceholderTile className={className} />
  const [w, h] = DIMS[name] ?? [undefined, undefined]
  const tag = label && (isRender(name) ? m.common.studioRender : isProductPhoto(name) ? m.common.exampleImage : null)
  return (
    <span className={cn('relative block overflow-hidden', isProductPhoto(name) && 'is-photo', ['senseca', 'status', 'giussani', 'sensortherm'].includes(name) && 'brand-logo', className)}>
      <img
        ref={ref}
        src={src}
        sizes={sizes}
        width={w}
        height={h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        onLoad={() => setLoaded(true)}
        className={cn('block h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain', !priority && 'img-fade', loaded && 'is-loaded', imgClassName)}
      />
      {PHOTO_CREDITS[name] && (
        <span className="absolute bottom-2 right-2 rounded-sm bg-navy-900/75 px-1.5 py-0.5 font-mono text-[10px] text-white">
          {m.common.photoCredit} {PHOTO_CREDITS[name].by} · {PHOTO_CREDITS[name].licence}
        </span>
      )}
      {tag && <span className="absolute bottom-2 left-2 rounded-sm bg-navy-900/75 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">{tag}</span>}
    </span>
  )
}

/** Neutral tile used where no authentic image has been supplied. */
export function PlaceholderTile({ className, label }: { className?: string; label?: string }) {
  return (
    <span className={cn('graticule-light relative flex items-center justify-center text-navy-300', className)} role={label ? 'img' : undefined} aria-label={label}>
      <Gauge {...ICON} className="h-10 w-10" aria-hidden />
    </span>
  )
}

export function Logo({ variant = 'reversed', className }: { variant?: 'reversed' | 'colour'; className?: string }) {
  const { m } = useI18n()
  const name = variant === 'reversed' ? 'wb-logo-reversed' : 'wb-logo-colour'
  return <img src={IMAGES[name]} width={DIMS[name][0]} height={DIMS[name][1]} alt={m.meta.siteName} className={cn('block', className)} />
}

/* ---------- Text helpers ---------- */

/** Renders `[[TBC: what]]` markers as visible "to be confirmed" highlights, and {tokens} from `parts`. */
export function Rich({ text, parts }: { text: string; parts?: Record<string, ReactNode> }) {
  const { m } = useI18n()
  const bits = text.split(/(\[\[TBC:[^\]]+\]\]|\{\w+\})/g)
  return (
    <>
      {bits.map((b, i) => {
        const tbc = b.match(/^\[\[TBC:\s*([^\]]+)\]\]$/)
        if (tbc) return <mark key={i} className="tbc">[{m.common.tbc}: {tbc[1]}]</mark>
        const tok = b.match(/^\{(\w+)\}$/)
        if (tok && parts && tok[1] in parts) return <Fragment key={i}>{parts[tok[1]]}</Fragment>
        return <Fragment key={i}>{b}</Fragment>
      })}
    </>
  )
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const { m } = useI18n()
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn('inline-flex items-center gap-1', className)}>
      {children}
      <ArrowUpRight {...ICON} className="h-4 w-4 shrink-0" aria-hidden />
      <span className="sr-only"> {m.common.opensNewTab}</span>
    </a>
  )
}

export function StatusTag({ status }: { status: 'verified' | 'partial' | 'pending' | 'placeholder' }) {
  const { m } = useI18n()
  if (status === 'verified') return <span className="tag-verified">{m.common.verified}</span>
  if (status === 'placeholder') return <span className="tag-placeholder">{m.common.placeholder}</span>
  return <span className="tag-placeholder">{status === 'partial' ? m.common.partial : m.common.pending}</span>
}

/** Injects one JSON-LD block into <head> while the component is mounted. Only describe what is visible on the page. */
export function JsonLd({ id, data }: { id: string; data: object }) {
  const json = JSON.stringify(data)
  useEffect(() => {
    let el = document.getElementById('ld-' + id) as HTMLScriptElement | null
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = 'ld-' + id
      document.head.appendChild(el)
    }
    el.textContent = json
    return () => el?.remove()
  }, [id, json])
  return null
}

/** LinkedIn logo link to W&B's company page (opens in a new tab). */
export function LinkedInLink({ className, size = 22, tone = 'light' }: { className?: string; size?: number; tone?: 'light' | 'dark' }) {
  const { m } = useI18n()
  return (
    <a
      href={COMPANY.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={m.common.linkedin}
      title={m.common.linkedin}
      className={cn('inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal', className)}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="3" fill={tone === 'light' ? '#FFFFFF' : '#0A66C2'} />
        <path fill={tone === 'light' ? '#16274F' : '#FFFFFF'} d="M5.3 9.2h2.9V19H5.3V9.2Zm1.45-4.7a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM10 9.2h2.8v1.35h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V19h-2.92v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.84 1.25-1.84 2.54V19H10V9.2Z" />
      </svg>
    </a>
  )
}

/* ---------- Layout ---------- */

export function Breadcrumbs({ items, dark }: { items: [string, string?][]; dark?: boolean }) {
  const { m } = useI18n()
  const trail = [[m.common.home, '/'] as [string, string?], ...items]
  const here = typeof window !== 'undefined' ? window.location.pathname : '/'
  return (
    <nav aria-label={m.common.breadcrumb}>
      <JsonLd
        id="breadcrumbs"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: COMPANY.siteUrl + (href ?? here) })),
        }}
      />
      <ol className={cn('flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm', dark ? 'text-white/70' : 'text-ink-muted')}>
        {[[m.common.home, '/'] as [string, string], ...items].map(([label, href], i, all) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight {...ICON} className="h-3.5 w-3.5 opacity-60" aria-hidden />}
            {href && i < all.length - 1 ? (
              <Link to={href} className={cn('hover:underline', dark ? 'hover:text-white' : 'hover:text-navy')}>
                {label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? 'page' : undefined} className={dark ? 'text-white' : 'text-navy'}>
                {label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Interior page hero: navy graticule ground, breadcrumb, eyebrow, title, intro; optional figure on the right. */
export function PageHero({ crumbs, eyebrow, title, intro, aside, children }: { crumbs: [string, string?][]; eyebrow?: string; title: string; intro?: string; aside?: ReactNode; children?: ReactNode }) {
  return (
    <header className="on-light hero-light relative overflow-hidden text-white">
      <div className="container-page relative grid gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:py-16">
        <div className={aside ? 'lg:col-span-7' : 'lg:col-span-9'}>
          <Breadcrumbs items={crumbs} dark />
          {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
          <h1 className={cn('t-h1 text-white', eyebrow ? 'mt-3' : 'mt-8')}>{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>}
          {children}
        </div>
        {aside && <div className="lg:col-span-5 lg:ps-6">{aside}</div>}
      </div>
      <ColourBlocks />
    </header>
  )
}

/** Brand device: Signal and Amber colour blocks on the right edge (p. 21). */
export function ColourBlocks({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute right-0 top-0 hidden h-full w-[56px] xl:block', className)}>
      <div className="h-2/3 bg-signal" />
      <div className="ms-auto h-10 w-10 bg-amber" />
    </div>
  )
}

export function SectionHeading({ eyebrow, title, text, action, id, className }: { eyebrow?: string; title: string; text?: string; action?: ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-5 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="t-h2 mt-2">
          {title}
        </h2>
        {text && <p className="mt-3 text-lg text-ink-muted">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function ArrowLink({ to: href, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={href} className={cn('arrow-link', className)}>
      {children}
      <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
    </Link>
  )
}

/** A reading in IBM Plex Mono inside reticle corners (p. 21). */
export function Reading({ value, unit, label, tone = 'ember', className }: { value: string; unit?: string; label?: string; tone?: 'ember' | 'signal' | 'amber'; className?: string }) {
  const color = tone === 'ember' ? 'text-ember-700' : tone === 'amber' ? 'text-amber-700' : 'text-blue'
  return (
    <div className={cn('reticle inline-block px-7 py-5 text-signal-700', className)}>
      <span className="reticle-b" />
      <span className={cn('reading block whitespace-nowrap text-4xl sm:text-5xl', color)}>
        {value}
        {unit && <span className="ms-1.5 text-xl text-white/80 sm:text-2xl">{unit}</span>}
      </span>
      {label && <span className="mt-2 block max-w-[16rem] font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">{label}</span>}
    </div>
  )
}

/* ---------- Cards ---------- */

export function ProductCard({ product, compact }: { product: Product; compact?: boolean }) {
  const { m } = useI18n()
  const c = m.products.items[product.id as keyof typeof m.products.items]
  const brand = brandById(product.brand)
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className={cn('relative overflow-hidden border-b border-line bg-white', compact ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        {product.image ? <Img name={product.image} alt="" fit="contain" className="h-full w-full p-4" sizes="(min-width:1024px) 25vw, 50vw" /> : <PlaceholderTile className="h-full w-full" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-700">{m.categories[product.cat].name}</p>
        <h3 className="t-h3 mt-2 text-lg sm:text-xl">
          <Link to={to.product(product.id)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {c.name}
          </Link>
        </h3>
        {!compact && <p className="mt-2 line-clamp-3 text-[15px] text-ink-muted">{c.desc}</p>}
        <p className="mt-3 text-sm text-ink-muted">
          <span className="sr-only">{m.common.manufacturer}: </span>
          {brand.name}
        </p>
        <span className="arrow-link mt-auto pt-4 text-[15px]" aria-hidden>
          {m.common.viewProduct}
          <ArrowRight {...ICON} className="h-4 w-4" />
        </span>
      </div>
      {/* focus ring for the stretched link */}
      <span className="pointer-events-none absolute inset-0 rounded-md ring-blue group-focus-within:ring-2" aria-hidden />
    </article>
  )
}

export function ProductGrid({ ids, compact }: { ids: string[]; compact?: boolean }) {
  return (
    <ul className={cn('grid gap-5 sm:grid-cols-2', compact ? 'lg:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-4')}>
      {ids.map((id) => {
        const p = productById(id)
        return p ? (
          <li key={id}>
            <ProductCard product={p} compact={compact} />
          </li>
        ) : null
      })}
    </ul>
  )
}

/** Generic linked card used for industries, solutions, businesses and resources. */
export function LinkCard({ href, title, text, image, eyebrow, tag, reading }: { href: string; title: string; text?: string; image?: string; eyebrow?: string; tag?: ReactNode; reading?: string }) {
  const { m } = useI18n()
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      {image !== undefined && (
        <div className="aspect-[16/10] overflow-hidden border-b border-line bg-white">
          {image ? <Img name={image} alt="" className="h-full w-full" fit={isProductPhoto(image) ? 'contain' : 'cover'} imgClassName={isProductPhoto(image) ? 'p-4' : ''} sizes="(min-width:1024px) 33vw, 100vw" /> : <PlaceholderTile className="h-full w-full" />}
        </div>
      )}
      {reading && (
        <div className="hero-light flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-line">
          <Reading value={reading} tone="signal" className="scale-90" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-700">{eyebrow}</p>}
          {tag}
        </div>
        <h3 className="t-h3 mt-2">
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        {text && <p className="mt-2 text-[15px] text-ink-muted">{text}</p>}
        <span className="arrow-link mt-auto pt-4 text-[15px]" aria-hidden>
          {m.common.learnMore}
          <ArrowRight {...ICON} className="h-4 w-4" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-md ring-blue group-focus-within:ring-2" aria-hidden />
    </article>
  )
}

export function NewsCard({ item, post }: { item?: NewsItem; post?: CmsPost }) {
  const { m, formatDate } = useI18n()
  const c = item ? m.news.items[item.id as keyof typeof m.news.items] : null
  const category = (post?.category ?? item?.category)!
  const title = post ? post.title : c!.title
  const excerpt = post ? post.excerpt : c!.excerpt
  const date = post ? post.date : item!.date
  const href = to.article(post ? post.id : item!.id)
  const pic = post ? postImage(post.image, category) : { name: item!.image ?? CATEGORY_IMAGE[category] }
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
        {pic.src ? (
          <img src={pic.src} alt={post?.imageAlt ?? ''} loading="lazy" decoding="async" className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <Img name={pic.name!} alt={post?.imageAlt ?? ''} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="h-full w-full" imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" label />
        )}
        {post?.video && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900/80 text-white ring-2 ring-white/70"><Play {...ICON} className="ml-1 h-6 w-6" /></span>
          </span>
        )}
        <span aria-hidden className="absolute right-0 top-0 h-full w-2 bg-signal" />
        <span aria-hidden className="absolute right-2 top-0 h-2 w-8 bg-amber" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-700">{m.news.categories[category]}</span>
          <span className="font-mono text-xs text-ink-muted">{date ? <time dateTime={date}>{formatDate(date)}</time> : m.common.dateTbc}</span>
          {post?.video && <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ember-700">{m.news.video}</span>}
          {item?.placeholder && <StatusTag status="placeholder" />}
        </div>
        <h3 className="t-h3 mt-3">
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] text-ink-muted">{excerpt}</p>
        <span className="arrow-link mt-auto pt-4 text-[15px]" aria-hidden>
          {m.common.readMore}
          <ArrowRight {...ICON} className="h-4 w-4" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-md ring-blue group-focus-within:ring-2" aria-hidden />
    </article>
  )
}

export function CTABand({ title, text, cta, href }: { title?: string; text?: string; cta?: string; href?: string }) {
  const { m, fmt } = useI18n()
  return (
    <section className="on-light hero-light relative overflow-hidden text-white" aria-labelledby="cta-h">
      <div className="container-page relative flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between lg:py-16">
        <div className="max-w-2xl">
          <h2 id="cta-h" className="t-h2 text-white">
            {title ?? m.home.cta.title}
          </h2>
          <p className="mt-3 text-lg text-white/80">{text ?? m.home.cta.text}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:pe-16">
          <Link to={href ?? to.contact()} className="btn-primary">
            {cta ?? m.home.cta.primary}
            <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
          </Link>
          <a href={telHref(COMPANY.phone)} className="btn-outline">
            <Phone {...ICON} className="h-4 w-4" aria-hidden />
            {fmt(m.home.cta.call, { phone: COMPANY.phone })}
          </a>
        </div>
      </div>
      <ColourBlocks />
      <div className="thermal-strip" />
    </section>
  )
}

export function Section({ children, className, tone = 'white', id, labelledBy }: { children: ReactNode; className?: string; tone?: 'white' | 'mist'; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(tone === 'mist' ? 'bg-graphite-100' : 'bg-white', 'py-14 sm:py-16 lg:py-20', className)}>
      <div className="container-page">{children}</div>
    </section>
  )
}

export function Bullets({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('space-y-2.5', className)}>
      {items.map((x) => (
        <li key={x} className="flex gap-3">
          <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-signal-700" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  )
}

export function Notice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="note" className={cn('notice', className)}>
      {children}
    </div>
  )
}
