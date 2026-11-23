import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { cn } from '@/lib/cn'
import { NEWS, NEWS_CATEGORIES, newsById, type NewsCategory, type NewsItem } from '@/data/news'
import { CTABand, ExternalLink, ICON, Img, NewsCard, Notice, PageHero, Section, StatusTag } from '@/components/ui'
import { blocks, CATEGORY_IMAGE, postImage, useCms, videoEmbed, type CmsPost } from '@/lib/cms'
import NotFound from './NotFound'

export function NewsPage() {
  const { m } = useI18n()
  usePageMeta(m.news.title, m.news.intro)
  const [params, setParams] = useSearchParams()
  const cat = params.get('category') as NewsCategory | null
  const { posts } = useCms()
  // Once staff publish real posts, the layout placeholders step aside.
  const statics = posts.length ? NEWS.filter((n) => !n.placeholder) : NEWS
  const cards = [
    ...posts.map((p) => ({ key: `cms-${p.id}`, category: p.category, date: p.date, post: p as CmsPost | undefined, item: undefined as NewsItem | undefined })),
    ...statics.map((n) => ({ key: n.id, category: n.category, date: n.date, item: n as NewsItem | undefined, post: undefined as CmsPost | undefined })),
  ].filter((x) => !cat || x.category === cat)
  const chip = (a: boolean) => cn('rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors', a ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy-300')
  return (
    <>
      <PageHero crumbs={[[m.news.title]]} title={m.news.title} intro={m.news.intro} />
      <Section>
        <div role="group" aria-label={m.news.filterLabel} className="flex flex-wrap gap-2">
          <button type="button" className={chip(!cat)} aria-pressed={!cat} onClick={() => setParams({}, { replace: true })}>{m.news.all}</button>
          {NEWS_CATEGORIES.map((c) => (
            <button key={c} type="button" className={chip(cat === c)} aria-pressed={cat === c} onClick={() => setParams(cat === c ? {} : { category: c }, { replace: true })}>
              {m.news.categories[c]}
            </button>
          ))}
        </div>
        {!posts.length && <Notice className="mt-8">{m.news.placeholderNote}</Notice>}
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {cards.map((x) => (
            <li key={x.key}>
              <NewsCard item={x.item} post={x.post} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

export function ArticlePage() {
  const { id = '' } = useParams()
  const { posts, ready } = useCms()
  const n = newsById(id)
  const post = n ? undefined : posts.find((p) => p.id === id)
  if (post) return <CmsArticle post={post} />
  if (!n && !ready) return <div className="min-h-[60vh]" aria-busy="true" />
  return <StaticArticle id={id} />
}

function MoreNews({ exclude }: { exclude: string }) {
  const { m } = useI18n()
  const { posts } = useCms()
  const more = [...posts.filter((p) => p.id !== exclude).map((p) => ({ key: p.id, post: p })), ...NEWS.filter((x) => x.id !== exclude && (!posts.length || !x.placeholder)).map((x) => ({ key: x.id, item: x }))].slice(0, 3)
  if (!more.length) return null
  return (
    <Section tone="mist">
      <h2 className="t-h2">{m.news.more}</h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {more.map((x) => <li key={x.key}><NewsCard item={'item' in x ? x.item : undefined} post={'post' in x ? x.post : undefined} /></li>)}
      </ul>
    </Section>
  )
}

function CmsArticle({ post }: { post: CmsPost }) {
  const { m, fmt, formatDate } = useI18n()
  usePageMeta(post.title, post.excerpt)
  const pic = postImage(post.image, post.category)
  const video = videoEmbed(post.video)
  return (
    <>
      <PageHero crumbs={[[m.news.title, to.news()], [post.title]]} eyebrow={m.news.categories[post.category]} title={post.title} intro={post.excerpt}>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-sm text-white/80">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.author && <span>· {fmt(m.news.by, { author: post.author })}</span>}
        </div>
      </PageHero>
      <Section>
        <article className="mx-auto max-w-3xl">
          {video?.iframe ? (
            <div className="relative mb-10 aspect-video overflow-hidden rounded-md bg-navy-900">
              <iframe src={video.iframe} title={`${m.news.watch}: ${post.title}`} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            </div>
          ) : video?.file ? (
            <video src={video.file} controls preload="metadata" poster={pic.src} className="mb-10 w-full rounded-md bg-navy-900" aria-label={`${m.news.watch}: ${post.title}`} />
          ) : pic.src ? (
            <img src={pic.src} alt={post.imageAlt ?? ''} className="mb-10 w-full rounded-md object-cover" />
          ) : (
            <Img name={pic.name!} alt={post.imageAlt ?? ''} className="mb-10 aspect-[16/9] w-full rounded-md" sizes="(min-width: 768px) 768px, 100vw" label />
          )}
          <div className="space-y-5 text-lg leading-relaxed">
            {blocks(post.body).map((b, i) => ('p' in b ? <p key={i}>{b.p}</p> : <ul key={i} className="list-disc space-y-1 ps-6">{b.ul.map((li) => <li key={li}>{li}</li>)}</ul>))}
          </div>
          <Link to={to.news()} className="arrow-link mt-10">
            <ArrowLeft {...ICON} className="h-4 w-4" aria-hidden />
            {m.news.title}
          </Link>
        </article>
      </Section>
      <MoreNews exclude={post.id} />
      <CTABand />
    </>
  )
}

function StaticArticle({ id }: { id: string }) {
  const { m, fmt, formatDate } = useI18n()
  const n = newsById(id)
  const c = n && m.news.items[n.id as keyof typeof m.news.items]
  usePageMeta(c ? c.title : m.notFound.title, c?.excerpt)
  if (!n || !c) return <NotFound />
  return (
    <>
      <PageHero crumbs={[[m.news.title, to.news()], [c.title]]} eyebrow={m.news.categories[n.category]} title={c.title} intro={c.excerpt}>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-sm text-white/80">
          {n.date ? <time dateTime={n.date}>{formatDate(n.date)}</time> : <span>{m.common.dateTbc}</span>}
          {n.author && <span>· {fmt(m.news.by, { author: n.author })}</span>}
          {n.placeholder && <StatusTag status="placeholder" />}
        </div>
      </PageHero>
      <Section>
        <article className="mx-auto max-w-3xl">
          {n.placeholder && <Notice className="mb-8">{m.news.articlePlaceholder}</Notice>}
          <Img name={n.image ?? CATEGORY_IMAGE[n.category]} alt="" className="mb-10 aspect-[16/9] w-full rounded-md" sizes="(min-width: 768px) 768px, 100vw" label />
          <div className="space-y-5 text-lg leading-relaxed">
            {c.body.map((p) => <p key={p}>{p}</p>)}
          </div>
          {n.source && (
            <p className="mt-8 text-sm text-ink-muted">
              {m.news.publishedOn}: <ExternalLink href={n.source} className="link">wandbinstruments.com.au</ExternalLink>
            </p>
          )}
          <Link to={to.news()} className="arrow-link mt-10">
            <ArrowLeft {...ICON} className="h-4 w-4" aria-hidden />
            {m.news.title}
          </Link>
        </article>
      </Section>
      <MoreNews exclude={n.id} />
      <CTABand />
    </>
  )
}
