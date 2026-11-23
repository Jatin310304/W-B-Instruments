import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { INDUSTRIES, industryById } from '@/data/industries'
import { SERVICES, productById } from '@/data/catalog'
import { Bullets, CTABand, ICON, Img, LinkCard, PageHero, ProductGrid, Section, SectionHeading } from '@/components/ui'
import { IMAGES } from '@/lib/assets'
import { cn } from '@/lib/cn'
import NotFound from './NotFound'

export function IndustriesPage() {
  const { m } = useI18n()
  usePageMeta(m.industries.title, m.industries.intro)
  return (
    <>
      <PageHero crumbs={[[m.industries.title]]} title={m.industries.title} intro={m.industries.intro} />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => {
            const c = m.industries.items[i.id as keyof typeof m.industries.items]
            return (
              <li key={i.id}>
                <LinkCard href={to.industry(i.id)} title={c.name} text={c.summary} image={i.image} />
              </li>
            )
          })}
        </ul>
      </Section>
      <CTABand title={m.industries.labels.enquire} text={m.industries.labels.enquireText} href={to.contact({ type: 'application' })} cta={m.industries.labels.enquire} />
    </>
  )
}

export function IndustryPage() {
  const { id = '' } = useParams()
  const { m, fmt } = useI18n()
  const ind = industryById(id)
  const c = ind && m.industries.items[ind.id as keyof typeof m.industries.items]
  usePageMeta(c ? c.name : m.notFound.title, c?.overview)
  if (!ind || !c) return <NotFound />
  const L = m.industries.labels
  // "Relevant instrumentation" = what the applicable product ranges measure, de-duplicated.
  const measures = Array.from(new Set(ind.products.map((p) => m.products.items[p as keyof typeof m.products.items]?.measures).filter(Boolean)))
  return (
    <>
      <PageHero
        crumbs={[[m.industries.title, to.industries()], [c.name]]}
        eyebrow={m.industries.title}
        title={c.name}
        intro={c.summary}
        aside={<Img name={ind.image.startsWith('photo-') && IMAGES[ind.products[0]] ? ind.products[0] : ind.image} alt="" label className={cn('aspect-[4/3] rounded-md', ind.image !== 'calibration-lab' && 'hero-photo')} fit={ind.image === 'calibration-lab' ? 'cover' : 'contain'} imgClassName={ind.image === 'calibration-lab' ? '' : 'p-6'} />}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-h2">{L.overview}</h2>
            <p className="mt-4 text-lg text-ink-muted">{c.overview}</p>
            <h2 className="t-h3 mt-10">{L.challenges}</h2>
            <Bullets items={c.challenges} className="mt-4" />
            {ind.image.startsWith('photo-') ? (
              <Img name={ind.image} alt={fmt(L.photoAlt, { industry: c.name })} className="mt-8 aspect-[3/2] rounded-md" sizes="(min-width:1024px) 55vw, 100vw" />
            ) : (
              <p className="mt-8 text-sm text-ink-muted">{L.noImage}</p>
            )}
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div className="card p-6">
              <h2 className="t-h3">{L.instrumentation}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {measures.map((x) => (
                  <li key={x} className="rounded-sm border border-line bg-graphite-100 px-2.5 py-1 font-mono text-xs text-navy">{x}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="t-h3">{L.services}</h2>
              <ul className="mt-4 space-y-3">
                {ind.services.map((s) => {
                  const svc = SERVICES.find((x) => x.id === s)!
                  return (
                    <li key={s}>
                      <Link to={s === 'calibration' ? to.solution('calibration-testing') : to.contact({ type: s === 'application-support' ? 'application' : 'product', subject: 'service:' + svc.id })} className="arrow-link">
                        {m.services.items[s].name}
                        <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
      <Section tone="mist">
        <SectionHeading title={L.products} />
        <div className="mt-8">
          <ProductGrid ids={ind.products.filter((p) => productById(p))} />
        </div>
        {ind.solutions.length > 0 && (
          <>
            <h2 className="t-h3 mt-14">{L.solutions}</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ind.solutions.map((s) => (
                <li key={s}>
                  <LinkCard href={to.solution(s)} title={m.solutions.items[s].name} text={m.solutions.items[s].short} />
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
      <CTABand title={L.enquire} text={L.enquireText} href={to.contact({ type: 'application' })} cta={L.enquire} />
    </>
  )
}
