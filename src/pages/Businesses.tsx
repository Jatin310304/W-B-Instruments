import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { BUSINESSES, METAVAL_URL, businessById } from '@/data/businesses'
import { Bullets, CTABand, ExternalLink, ICON, Img, LinkCard, Notice, PageHero, Rich, Section } from '@/components/ui'
import NotFound from './NotFound'

/** Related W&B instrumentation for each division, where a genuine link exists. */
const INSTRUMENTS: Record<string, string[]> = {
  forging: ['ir-metal'],
  casting: ['ir-metal', 'ir-temperature'],
  flow: ['digital-displays', 'signal-conditioners'],
  valves: ['pressure-measurement'],
}

export function BusinessesPage() {
  const { m } = useI18n()
  usePageMeta(m.businesses.title, m.businesses.intro)
  return (
    <>
      <PageHero crumbs={[[m.businesses.title]]} title={m.businesses.title} intro={m.businesses.intro}>
        <ExternalLink href={METAVAL_URL} className="btn-outline mt-8">{m.businesses.visit}</ExternalLink>
      </PageHero>
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2">
          {BUSINESSES.map((b) => (
            <li key={b.id}>
              <LinkCard href={to.business(b.id)} title={m.businesses.items[b.id].name} text={m.businesses.items[b.id].overview} image={b.image} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink-muted">
          <Rich text={m.businesses.sourceNote} parts={{ source: <a href={METAVAL_URL} className="link" target="_blank" rel="noopener noreferrer">metaval.com</a> }} />
        </p>
      </Section>
      <CTABand href={to.contact({ type: 'business' })} />
    </>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-7">
      <h2 className="t-h3">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function BusinessPage() {
  const { id = '' } = useParams()
  const { m, fmt } = useI18n()
  const b = businessById(id)
  const c = b && m.businesses.items[b.id]
  usePageMeta(c ? c.name : m.notFound.title, c?.overview)
  if (!b || !c) return <NotFound />
  const L = m.businesses.labels
  const host = new URL(b.source).host.replace(/^www\./, '')
  const enquire = to.contact({ type: 'business', subject: 'business:' + b.id })
  return (
    <>
      <PageHero
        crumbs={[[m.businesses.title, to.businesses()], [c.name]]}
        eyebrow={m.businesses.title}
        title={c.name}
        intro={c.short}
        aside={
          <figure className="flex flex-col gap-2">
            <Img name={b.image} alt={c.name} className="aspect-[16/10] rounded-md" priority sizes="(min-width:1024px) 40vw, 100vw" />
            <figcaption className="text-sm text-white/60">{m.businesses.imageNote}</figcaption>
          </figure>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={enquire} className="btn-primary">
            {fmt(L.enquire, { name: c.name })}
            <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
          </Link>
          <ExternalLink href={b.source} className="btn-outline">{host}</ExternalLink>
        </div>
      </PageHero>

      <div className="container-page pt-10">
        <Notice>
          <Rich text={m.businesses.sourceNote} parts={{ source: <a href={b.source} className="link" target="_blank" rel="noopener noreferrer">{host}</a> }} />
        </Notice>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-h2">{L.overview}</h2>
            <p className="mt-4 text-lg text-ink-muted">{c.overview}</p>
            <h2 className="t-h3 mt-10">{L.products}</h2>
            <Bullets items={c.products} className="mt-4" />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <Block title={L.process}>
              <ol className="space-y-3">
                {c.process.map((p, i) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className="reading flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-navy text-xs text-signal">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-medium text-navy">{p}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[15px] text-ink-muted">{c.processNote}</p>
            </Block>
            {c.materials.length > 0 && (
              <Block title={L.materials}>
                <ul className="flex flex-wrap gap-2">
                  {c.materials.map((x) => <li key={x} className="rounded-sm border border-line bg-graphite-100 px-2.5 py-1 font-mono text-xs text-navy">{x}</li>)}
                </ul>
              </Block>
            )}
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-6 lg:grid-cols-3">
          <Block title={L.quality}><Bullets items={c.quality} /></Block>
          <Block title={L.certifications}>
            <ul className="flex flex-wrap gap-2">
              {c.certifications.map((x) => <li key={x} className="tag-neutral">{x}</li>)}
            </ul>
            <p className="mt-4 text-sm text-ink-muted">
              {m.common.source}: <a href={b.source} className="link" target="_blank" rel="noopener noreferrer">{host}</a>
            </p>
          </Block>
          <Block title={L.applications}>
            <ul className="flex flex-wrap gap-2">
              {c.applications.map((x) => <li key={x} className="rounded-full border border-line bg-white px-3 py-1 text-sm">{x}</li>)}
            </ul>
          </Block>
        </div>
      </Section>

      <Section>
        <h2 className="t-h2">{L.related}</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {b.related.map((r) => (
            <li key={r}>
              <LinkCard href={to.business(r)} title={m.businesses.items[r].name} text={m.businesses.items[r].short} eyebrow={m.businesses.title} />
            </li>
          ))}
        </ul>
        {INSTRUMENTS[b.id]?.length > 0 && (
          <>
            <h3 className="t-h3 mt-12">{L.relatedInstruments}</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {INSTRUMENTS[b.id].map((p) => (
                <li key={p}>
                  <Link to={to.product(p)} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-navy-300">
                    {m.products.items[p as keyof typeof m.products.items].name}
                    <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
      <CTABand title={fmt(L.enquire, { name: c.name })} text={L.enquireText} cta={fmt(L.enquire, { name: c.name })} href={enquire} />
    </>
  )
}
