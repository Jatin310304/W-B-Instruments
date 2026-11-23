import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, FileText, X } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { cn } from '@/lib/cn'
import { BRANDS, CATEGORIES, PRODUCTS, SERVICES, SOLUTIONS, brandById, productById, solutionById, type BrandId, type CategoryId } from '@/data/catalog'
import { ArrowLink, Bullets, CTABand, ExternalLink, ICON, Img, JsonLd, LinkCard, Notice, PageHero, PlaceholderTile, ProductCard, ProductGrid, Section, SectionHeading, StatusTag } from '@/components/ui'
import { HeroModel } from '@/components/Motion'
import { COMPANY } from '@/data/company'
import NotFound from './NotFound'

type ProductKey = keyof ReturnType<typeof useI18n>['m']['products']['items']

/* ---------------- Landing + catalogue ---------------- */

export function ProductsPage() {
  const { m, fmt } = useI18n()
  usePageMeta(m.products.title, m.products.intro)
  const [params, setParams] = useSearchParams()
  const cat = params.get('category') as CategoryId | null
  const brand = params.get('brand') as BrandId | null
  const q = params.get('q') ?? ''
  const F = m.products.filters

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return PRODUCTS.filter((p) => {
      if (cat && p.cat !== cat) return false
      if (brand && p.brand !== brand) return false
      if (!words.length) return true
      const c = m.products.items[p.id as ProductKey]
      const hay = [c.name, c.desc, c.measures, c.uses, brandById(p.brand).name].join(' ').toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [cat, brand, q, m])

  const chip = (active: boolean) => cn('rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors', active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy-300')

  return (
    <>
      <PageHero crumbs={[[m.products.title]]} title={m.products.title} intro={m.products.intro} />
      <Section>
        <SectionHeading title={m.products.groupsTitle} />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s) => (
            <li key={s.id}>
              <LinkCard href={to.solution(s.id)} title={m.solutions.items[s.id].name} text={m.solutions.items[s.id].short} image={s.image} tag={s.status !== 'verified' ? <StatusTag status={s.status} /> : undefined} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mist" id="catalogue" labelledBy="cat-h">
        <SectionHeading id="cat-h" title={m.products.catalogueTitle} text={m.products.catalogueText} />
        <div role="group" aria-label={F.label} className="mt-8 space-y-4 rounded-md border border-line bg-white p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <span className="w-32 shrink-0 text-sm font-semibold text-navy">{F.category}</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={chip(!cat)} aria-pressed={!cat} onClick={() => setParam('category', null)}>{F.all}</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => setParam('category', cat === c.id ? null : c.id)}>
                  {m.categories[c.id].name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <span className="w-32 shrink-0 text-sm font-semibold text-navy">{F.brand}</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={chip(!brand)} aria-pressed={!brand} onClick={() => setParam('brand', null)}>{F.all}</button>
              {BRANDS.map((b) => (
                <button key={b.id} type="button" className={chip(brand === b.id)} aria-pressed={brand === b.id} onClick={() => setParam('brand', brand === b.id ? null : b.id)}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label htmlFor="pf-q" className="w-32 shrink-0 text-sm font-semibold text-navy">{F.search}</label>
            <input id="pf-q" type="search" className="field max-w-md" value={q} onChange={(e) => setParam('q', e.target.value || null)} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-sm text-ink-muted" role="status">{fmt(F.showing, { n: list.length, total: PRODUCTS.length })}</p>
            {(cat || brand || q) && (
              <button type="button" onClick={() => setParams({}, { replace: true, preventScrollReset: true })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
                <X {...ICON} className="h-4 w-4" aria-hidden />
                {F.clear}
              </button>
            )}
          </div>
        </div>
        {list.length ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-md border border-line bg-white p-8 text-center text-ink-muted">{F.none}</p>
        )}
      </Section>
      <CTABand />
    </>
  )
}

/* ---------------- Products & Services group ---------------- */

export function SolutionPage() {
  const { id = '' } = useParams()
  const { m } = useI18n()
  const s = solutionById(id)
  const c = s && m.solutions.items[s.id]
  usePageMeta(c ? c.name : m.notFound.title, c?.intro)
  if (!s || !c) return <NotFound />
  const L = m.solutions.labels
  const isCal = s.id === 'calibration-testing'
  return (
    <>
      {isCal && (
        <JsonLd
          id="service"
          data={{
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: c.name,
            serviceType: 'Instrument calibration',
            description: m.services.items.calibration.text,
            provider: { '@type': 'Organization', name: COMPANY.brand, url: COMPANY.siteUrl, telephone: COMPANY.phone },
            areaServed: { '@type': 'Country', name: 'Australia' },
            availableChannel: { '@type': 'ServiceChannel', serviceUrl: COMPANY.siteUrl + '/contact?type=calibration', servicePhone: COMPANY.phone },
          }}
        />
      )}
      <PageHero
        crumbs={[[m.products.title, to.products()], [c.name]]}
        eyebrow={m.nav.productsServices}
        title={c.name}
        intro={c.intro}
        aside={!s.image && s.model ? <HeroModel model={s.model} className="aspect-[4/3]" /> : <Img name={s.image} alt="" label className={cn('aspect-[4/3] rounded-md', s.image !== 'calibration-lab' && 'hero-photo')} fit={s.image === 'calibration-lab' ? 'cover' : 'contain'} imgClassName={s.image === 'calibration-lab' ? '' : 'p-8'} />}
      >
        <div className="mt-6">
          <StatusTag status={s.status} />
        </div>
      </PageHero>

      {c.note && (
        <div className="container-page pt-10">
          <Notice>
            <strong>{L.pendingTitle}.</strong> {c.note}
          </Notice>
        </div>
      )}

      <Section>
        <SectionHeading title={L.products} />
        <div className="mt-8">{s.products.length ? <ProductGrid ids={s.products} /> : <p className="text-ink-muted">{L.noProducts}</p>}</div>
      </Section>

      {isCal && (
        <Section tone="mist">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="t-h2">{m.services.calibration.title}</h2>
              <p className="mt-4 text-lg text-ink-muted">{m.services.items.calibration.text}</p>
              <p className="mt-4 text-ink">{m.services.calibration.mra}</p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                {(['equipment', 'brands', 'where'] as const).map((k) => (
                  <div key={k} className="card p-5">
                    <dt className="font-mono text-xs uppercase tracking-wider text-signal-700">{m.services.calibration.labels[k]}</dt>
                    <dd className="mt-2 text-[15px]">{m.services.calibration[k]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-5">
              <h2 className="t-h3">{m.services.processTitle}</h2>
              <ol className="mt-5 space-y-4">
                {m.services.process.map((p, i) => (
                  <li key={p.h} className="flex gap-4">
                    <span className="reading flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-navy text-sm text-signal">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-semibold text-navy">{p.h}</p>
                      <p className="text-[15px] text-ink-muted">{p.p}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Section>
      )}

      {s.ranges.length > 0 && (
        <Section tone={isCal ? 'white' : 'mist'}>
          <SectionHeading title={L.ranges} text={L.rangesText} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.ranges.map((r) => {
              const b = brandById(r.brand)
              return (
                <li key={r.brand + r.index} className="card flex items-start gap-3 p-5">
                  <Check {...ICON} className="mt-0.5 h-5 w-5 shrink-0 text-signal-700" aria-hidden />
                  <div>
                    <p className="font-semibold text-navy">{m.brands[r.brand].range[r.index]}</p>
                    <p className="text-sm text-ink-muted">{b.name}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      <Section tone={isCal || !s.ranges.length ? 'mist' : 'white'}>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-h3">{L.services}</h2>
            <ul className="mt-5 space-y-4">
              {s.services.map((sv) => {
                const svc = SERVICES.find((x) => x.id === sv)!
                return (
                  <li key={sv} className="card p-5">
                    <p className="font-semibold text-navy">{m.services.items[sv].name}</p>
                    <p className="mt-1 text-[15px] text-ink-muted">{m.services.items[sv].text}</p>
                    <ArrowLink to={to.contact({ type: sv === 'calibration' ? 'calibration' : sv === 'application-support' ? 'application' : 'product', subject: 'service:' + svc.id })} className="mt-3 text-[15px]">
                      {m.services.items[sv].cta}
                    </ArrowLink>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h2 className="t-h3">{L.next}</h2>
            <ol className="mt-5 space-y-3">
              {[s.id, ...s.next].map((n, i) => (
                <li key={n}>
                  <Link to={to.solution(n)} aria-current={n === s.id ? 'page' : undefined} className={cn('flex items-center gap-4 rounded-md border p-4 transition-colors', n === s.id ? 'border-navy bg-navy text-white' : 'border-line bg-white hover:border-navy-300')}>
                    <span className={cn('reading text-sm', n === s.id ? 'text-signal' : 'text-signal-700')}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-semibold">{m.solutions.items[n].name}</span>
                    <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
      <CTABand href={to.contact({ type: 'product', subject: 'solution:' + s.id })} />
    </>
  )
}

/* ---------------- Product detail ---------------- */

export function ProductPage() {
  const { id = '' } = useParams()
  const { m } = useI18n()
  const p = productById(id)
  const c = p && m.products.items[p.id as ProductKey]
  usePageMeta(c ? c.name : m.notFound.title, c?.desc)
  if (!p || !c) return <NotFound />
  const L = m.products.labels
  const brand = brandById(p.brand)
  const b = m.brands[p.brand]
  const enquire = to.contact({ type: 'product', subject: 'product:' + p.id })

  return (
    <>
      <header className="hero-light border-b border-line">
        <div className="container-page grid gap-10 py-10 lg:grid-cols-12 lg:py-14">
          <div className="lg:col-span-7">
            <nav aria-label={m.common.breadcrumb}>
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
                <li><Link to="/" className="hover:text-navy hover:underline">{m.common.home}</Link></li>
                <li aria-hidden>/</li>
                <li><Link to={to.products()} className="hover:text-navy hover:underline">{m.products.title}</Link></li>
                <li aria-hidden>/</li>
                <li><Link to={to.products({ category: p.cat })} className="hover:text-navy hover:underline">{m.categories[p.cat].name}</Link></li>
              </ol>
            </nav>
            <p className="eyebrow mt-8">{m.categories[p.cat].name}</p>
            <h1 className="t-h1 mt-3">{c.name}</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-muted">{c.desc}</p>
            <p className="mt-4 text-[15px]">
              <span className="text-ink-muted">{m.common.manufacturer}: </span>
              <span className="font-semibold text-navy">{brand.name}</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={enquire} className="btn-navy">
                {L.enquire}
                <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
              </Link>
              <Link to={to.contact({ type: 'datasheet', subject: 'product:' + p.id })} className="btn-outline">
                <FileText {...ICON} className="h-4 w-4" aria-hidden />
                {L.requestDatasheet}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-md">
              {p.image ? <Img name={p.image} alt={c.name} label fit="contain" priority className="hero-photo aspect-square w-full rounded-md" imgClassName="p-8" sizes="(min-width:1024px) 40vw, 100vw" /> : p.model ? <HeroModel model={p.model} initialZoom={1.5} className="aspect-square w-full rounded-none" /> : <PlaceholderTile className="aspect-square w-full" label={c.name} />}
            </div>
            <div>
            </div>
          </div>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <section aria-labelledby="ov-h">
              <h2 id="ov-h" className="t-h2">{L.overview}</h2>
              <p className="mt-4 text-lg">{c.desc}</p>
              <div className="mt-5 rounded-md border-s-[3px] border-signal bg-signal-100/60 p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-signal-900">{L.plain}</p>
                <p className="mt-1.5">{c.plain}</p>
              </div>
            </section>

            <section aria-labelledby="spec-h">
              <h2 id="spec-h" className="t-h2">{L.specs}</h2>
              <div className="mt-5 overflow-hidden rounded-md border border-line">
                <table className="w-full text-start text-[15px]">
                  <tbody className="divide-y divide-line">
                    <tr>
                      <th scope="row" className="w-1/3 bg-graphite-100 px-4 py-3 font-semibold text-navy">{L.measures}</th>
                      <td className="px-4 py-3 font-mono text-sm">{c.measures}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-graphite-100 px-4 py-3 font-semibold text-navy">{L.range}</th>
                      <td className="px-4 py-3 text-ink-muted">{m.products.rangeNone}</td>
                    </tr>
                    {(p.specs ?? []).map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className="bg-graphite-100 px-4 py-3 font-semibold text-navy">{k}</th>
                        <td className="px-4 py-3 font-mono text-sm">{v}</td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="bg-graphite-100 px-4 py-3 font-semibold text-navy">{m.common.manufacturer}</th>
                      <td className="px-4 py-3">{brand.name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {!p.specs?.length && <p className="mt-3 text-sm text-ink-muted">{m.products.specsNone}</p>}
            </section>

            {c.uses && (
              <section aria-labelledby="app-h">
                <h2 id="app-h" className="t-h3">{L.applications}</h2>
                <Bullets items={c.uses.split(/,\s*/)} className="mt-4" />
              </section>
            )}

            <section aria-labelledby="cfg-h">
              <h2 id="cfg-h" className="t-h3">{L.configurations}</h2>
              <p className="mt-3 text-ink-muted">{m.products.configNone}</p>
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="card p-6">
              <h2 className="t-h3">{L.manufacturer}</h2>
              <div className="mt-4 flex h-10 items-center">
                <Img name={brand.logo} alt={brand.name} fit="contain" className="h-8 w-auto max-w-[150px]" imgClassName="object-left" />
              </div>
              <p className="mt-3 font-semibold text-navy">{brand.name}</p>
              <p className="text-sm text-ink-muted">{L.country}: {b.where}</p>
              <p className="mt-3 text-[15px] text-ink-muted">{b.does}</p>
              <ExternalLink href={p.url ?? brand.url} className="mt-4 font-semibold text-blue">{L.visitManufacturer}</ExternalLink>
            </div>
            <div className="card p-6">
              <h2 className="t-h3">{L.datasheet}</h2>
              {p.downloads?.length ? (
                <ul className="mt-3 space-y-2">
                  {p.downloads.map((d) => <li key={d.url}><a href={d.url} className="link" download>{d.label}</a></li>)}
                </ul>
              ) : (
                <>
                  <p className="mt-3 text-[15px] text-ink-muted">{m.products.datasheetNone}</p>
                  <ArrowLink to={to.contact({ type: 'datasheet', subject: 'product:' + p.id })} className="mt-3 text-[15px]">{L.requestDatasheet}</ArrowLink>
                </>
              )}
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="mist" labelledBy="rel-h">
        <SectionHeading id="rel-h" title={L.related} text={L.relatedText} />
        <div className="mt-8">
          <ProductGrid ids={p.related} compact />
        </div>
        {p.solutions.length > 0 && (
          <>
            <h2 className="t-h3 mt-14">{L.chain}</h2>
            <p className="mt-2 text-ink-muted">{L.chainText}</p>
            <ul className="mt-5 flex flex-wrap items-center gap-2">
              {Array.from(new Set([...p.solutions, ...p.solutions.flatMap((s) => solutionById(s)!.next)])).map((s, i, all) => (
                <li key={s} className="flex items-center gap-2">
                  <Link to={to.solution(s)} className={cn('rounded-full border px-4 py-2 text-sm font-semibold transition-colors', p.solutions.includes(s) ? 'border-navy bg-navy text-white hover:bg-navy-500' : 'border-line bg-white text-navy hover:border-navy-300')}>
                    {m.solutions.items[s].name}
                  </Link>
                  {i < all.length - 1 && <ArrowRight {...ICON} className="h-4 w-4 text-graphite-500" aria-hidden />}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
      <CTABand title={L.enquireTitle} text={L.enquireText} cta={L.enquire} href={enquire} />
    </>
  )
}
