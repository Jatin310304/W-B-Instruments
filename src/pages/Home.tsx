import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { BRANDS, SOLUTIONS } from '@/data/catalog'
import { INDUSTRIES } from '@/data/industries'
import { BUSINESSES } from '@/data/businesses'
import { NEWS } from '@/data/news'
import { useCms } from '@/lib/cms'
import { RESOURCES } from '@/data/site'
import { Counter, HeroModel, Reveal } from '@/components/Motion'
import { ArrowLink, Bullets, CTABand, ICON, Img, JsonLd, LinkCard, NewsCard, Reading, Section, SectionHeading, StatusTag } from '@/components/ui'

function Hero() {
  const { m } = useI18n()
  const h = m.home.hero
  return (
    <section className="on-light hero-light relative overflow-hidden text-white" aria-labelledby="hero-h">
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 id="hero-h" className="t-display mt-5 text-white">
            <span className="mb-4 block font-display text-xl font-semibold leading-snug tracking-normal text-navy sm:text-2xl">{h.lead}</span>
            {[h.titleA, h.titleB, h.titleC].map((w, i) => (
              <span key={i} className="rise block">
                <span>
                  <span style={{ '--i': i } as CSSProperties} className={i === 2 ? 'text-signal-700' : undefined}>{w}</span>
                </span>
              </span>
            ))}
          </h1>
          <p style={{ '--d': '420ms' } as CSSProperties} className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{h.text}</p>
          <div style={{ '--d': '560ms' } as CSSProperties} className="fade-up mt-9 flex flex-wrap gap-3">
            <Link to={to.contact({ type: 'calibration', subject: 'service:calibration' })} className="btn-primary">
              {h.primary}
              <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
            </Link>
            <Link to={to.products()} className="btn-outline">
              {h.secondary}
            </Link>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <HeroModel model="pyrometer" poster="ir-temperature" stage="grid" demo className="aspect-[4/3] w-full sm:aspect-[16/11]" />
          <p className="sr-only">{h.imageAlt}</p>
          <div className="float absolute -top-8 right-4 hidden rounded-md border border-line bg-white shadow-panel sm:block">
            <Reading value="1700" unit="°C" label={h.readingLabel} />
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-full w-[56px] xl:block">
        <div className="parallax h-1/2 bg-signal" style={{ '--speed': '-0.25' } as CSSProperties} />
        <div className="parallax ms-auto h-14 w-14 bg-amber" style={{ '--speed': '-0.5' } as CSSProperties} />
      </div>
      <div className="thermal-strip" aria-hidden />
    </section>
  )
}

function Marquee() {
  const { m } = useI18n()
  const items = [...m.about.capabilities, ...BRANDS.map((b) => b.name)]
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pe-10" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold uppercase tracking-wide text-navy sm:text-3xl">
          {t}
          <span className="h-2 w-2 rotate-45 bg-amber" aria-hidden />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-b border-line bg-white py-5">
      <div className="marquee flex w-max">{row(false)}{row(true)}</div>
    </div>
  )
}

function Why() {
  const { m } = useI18n()
  const w = m.home.why
  return (
    <section className="graticule relative overflow-hidden py-16 text-white lg:py-20" aria-labelledby="why-h">
      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal">{w.eyebrow}</p>
          <h2 id="why-h" className="t-h2 mt-2 text-white">{w.title}</h2>
          <p className="mt-4 text-lg text-white/85">{w.text}</p>
        </div>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-md bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
          {w.items.map((it, i) => (
            <Reveal as="li" key={it.h} delay={i * 70} className="flex flex-col bg-navy p-6">
              <span className="reading text-sm text-signal">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3 mt-3 text-white">{it.h}</h3>
              <p className="mt-2 flex-1 text-[15px] text-white/80">{it.p}</p>
              <p className="mt-5 border-t border-white/15 pt-3 font-mono text-sm text-amber">{it.proof}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-white/85">{w.proof}</p>
          <Link to={to.contact({ type: 'application' })} className="btn-primary shrink-0">
            {w.cta}
            <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="thermal-strip absolute bottom-0 left-0 right-0" aria-hidden />
    </section>
  )
}

function Faq() {
  const { m } = useI18n()
  const f = m.home.faq
  const href: Record<string, string> = {
    calibration: to.solution('calibration-testing'),
    book: to.contact({ type: 'calibration', subject: 'service:calibration' }),
    contact: to.contact(),
    partners: to.about('partners'),
    advice: to.contact({ type: 'application' }),
  }
  return (
    <Section tone="mist" labelledBy="faq-h">
      <JsonLd
        id="faq"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: f.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
        }}
      />
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-h" eyebrow={f.eyebrow} title={f.title} text={f.text} />
          <Link to={to.contact({ type: 'technical' })} className="btn-navy mt-6">{m.common.contactTeam}</Link>
        </div>
        <div className="lg:col-span-8">
          {f.items.map((it, i) => (
            <details key={it.q} className="group border-b border-line bg-white px-5 first:rounded-t-md first:border-t last:rounded-b-md [&:not(:first-child)]:border-t-0" open={i === 0}>
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold text-navy">
                <h3 className="font-display text-lg font-semibold">{it.q}</h3>
                <span aria-hidden className="text-2xl leading-none text-signal-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="pb-5 text-ink-muted">
                <p>{it.a}</p>
                <ArrowLink to={href[it.link]} className="mt-3">{f.links[it.link as keyof typeof f.links]}</ArrowLink>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default function Home() {
  const { m } = useI18n()
  usePageMeta(null)
  const featured = INDUSTRIES.filter((i) => i.featured)
  const { posts } = useCms()
  const latest = [...posts.map((p) => ({ id: `cms-${p.id}`, post: p, item: undefined })), ...(posts.length ? NEWS.filter((n) => !n.placeholder) : NEWS).map((n) => ({ id: n.id, item: n, post: undefined }))].slice(0, 3)

  return (
    <>
      <Hero />
      <Marquee />

      {/* 1. Introduction */}
      <Section labelledBy="intro-h">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{m.home.intro.eyebrow}</p>
            <h2 id="intro-h" className="t-h2 mt-2">{m.home.intro.title}</h2>
            <p className="mt-5 text-lg text-ink-muted">{m.home.intro.text}</p>
            <p className="mt-4 text-ink-muted">{m.home.intro.supporting}</p>
            <ArrowLink to={to.about()} className="mt-6">{m.home.intro.cta}</ArrowLink>
          </div>
          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-md border border-line bg-line lg:col-span-5">
            {m.home.stats.map((s) => (
              <div key={s.label} className="bg-white p-5 sm:p-6">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter value={s.value} className="reading text-4xl text-navy sm:text-5xl" />
                  <span className="ms-1 font-mono text-sm text-signal-700">{s.unit}</span>
                  <span className="mt-2 block text-sm text-ink-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 2. Industries */}
      <Section tone="mist" labelledBy="ind-h">
        <SectionHeading id="ind-h" eyebrow={m.home.industries.eyebrow} title={m.home.industries.title} text={m.home.industries.text} action={<ArrowLink to={to.industries()}>{m.home.industries.cta}</ArrowLink>} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((i) => {
            const c = m.industries.items[i.id as keyof typeof m.industries.items]
            return (
              <Reveal as="li" key={i.id} delay={(featured.indexOf(i) % 3) * 80}>
                <LinkCard href={to.industry(i.id)} title={c.name} text={c.summary} image={i.image} />
              </Reveal>
            )
          })}
        </ul>
      </Section>

      {/* 3. Products & Services */}
      <Section labelledBy="prod-h">
        <SectionHeading id="prod-h" eyebrow={m.home.products.eyebrow} title={m.home.products.title} text={m.home.products.text} action={<ArrowLink to={to.products()}>{m.home.products.cta}</ArrowLink>} />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => {
            const c = m.solutions.items[s.id]
            return (
              <li key={s.id} className="group relative bg-white p-6 transition-colors hover:bg-graphite-100">
                <span className="reading text-sm text-signal-700">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3 mt-3">
                  <Link to={to.solution(s.id)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{c.name}</Link>
                </h3>
                <p className="mt-2 text-[15px] text-ink-muted">{c.short}</p>
                {s.status !== 'verified' && <div className="mt-3"><StatusTag status={s.status} /></div>}
                <span className="pointer-events-none absolute inset-0 ring-inset ring-blue group-focus-within:ring-2" aria-hidden />
              </li>
            )
          })}
          <li className="relative flex flex-col justify-end bg-signal p-6 text-navy transition-colors hover:bg-amber">
            <p className="font-display text-xl font-semibold">{m.nav.allProducts}</p>
            <Link to={to.products()} className="arrow-link mt-3 text-navy after:absolute after:inset-0 after:content-['']">
              {m.common.viewAll}
              <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
            </Link>
          </li>
        </ul>
      </Section>

      {/* 4. Temperature expertise */}
      <section className="on-light hero-light relative overflow-hidden py-16 text-white lg:py-20" aria-labelledby="temp-h">
        <div className="container-page grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{m.home.temperature.eyebrow}</p>
            <h2 id="temp-h" className="t-h2 mt-2 text-white">{m.home.temperature.title}</h2>
            <p className="mt-4 text-lg text-white/85">{m.home.temperature.text}</p>
            <Bullets items={m.home.temperature.points} className="mt-6 text-white/90" />
            <Link to={to.solution('temperature-measurement')} className="btn-primary mt-8">
              {m.home.temperature.cta}
              <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="flex justify-center lg:col-span-5">
            <div data-fx className="w-full max-w-sm rounded-md border border-line bg-white p-6 shadow-panel">
              <Reading value={m.home.temperature.reading} unit={m.home.temperature.readingUnit} label={m.home.temperature.readingLabel} />
              <div className="mt-6 h-3 overflow-hidden rounded-sm bg-graphite-100">
                <div className="thermal-fill h-full" style={{ background: 'var(--thermal)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Calibration */}
      <Section labelledBy="cal-h">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Img name="calibration-lab" alt={m.home.calibration.imageAlt} className="aspect-[3/2] rounded-md" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">{m.home.calibration.eyebrow}</p>
            <h2 id="cal-h" className="t-h2 mt-2">{m.home.calibration.title}</h2>
            <p className="mt-4 text-lg text-ink-muted">{m.home.calibration.text}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {m.home.calibration.points.map((p) => (
                <li key={p} className="flex gap-3 rounded border border-line p-4 text-[15px]">
                  <Check {...ICON} className="mt-0.5 h-5 w-5 shrink-0 text-signal-700" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={to.contact({ type: 'calibration', subject: 'service:calibration' })} className="btn-navy">{m.home.calibration.cta}</Link>
              <Link to={to.solution('calibration-testing')} className="btn-outline">{m.home.calibration.more}</Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 5b. Why customers choose W&B (messaging pillars) */}
      <Why />

      {/* 6. Business divisions */}
      <Section tone="mist" labelledBy="biz-h">
        <SectionHeading id="biz-h" eyebrow={m.home.businesses.eyebrow} title={m.home.businesses.title} text={m.home.businesses.text} action={<ArrowLink to={to.businesses()}>{m.home.businesses.cta}</ArrowLink>} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BUSINESSES.map((b) => (
            <Reveal as="li" key={b.id} delay={BUSINESSES.indexOf(b) * 80}>
              <LinkCard href={to.business(b.id)} title={m.businesses.items[b.id].name} text={m.businesses.items[b.id].short} image={b.image} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 7. Brand partnerships */}
      <Section labelledBy="partners-h">
        <SectionHeading id="partners-h" eyebrow={m.home.partners.eyebrow} title={m.home.partners.title} text={m.home.partners.text} action={<ArrowLink to={to.about('partners')}>{m.home.partners.cta}</ArrowLink>} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((b) => (
            <Reveal as="li" key={b.id} delay={BRANDS.indexOf(b) * 80} className="card flex flex-col p-6">
              <div className="flex h-12 items-center">
                <Img name={b.logo} alt={b.name} fit="contain" className="h-9 w-auto max-w-[160px]" imgClassName="object-left" />
              </div>
              <p className="mt-5 font-semibold text-navy">{b.name}</p>
              <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">{m.brands[b.id].where}</p>
              <p className="mt-3 text-[15px] text-ink-muted">{m.brands[b.id].range.slice(0, 3).join(' · ')}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 8. News */}
      <Section tone="mist" labelledBy="news-h">
        <SectionHeading id="news-h" eyebrow={m.home.news.eyebrow} title={m.home.news.title} text={m.home.news.text} action={<ArrowLink to={to.news()}>{m.home.news.cta}</ArrowLink>} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((n) => (
            <Reveal as="li" key={n.id} delay={latest.indexOf(n) * 80}>
              <NewsCard item={n.item} post={n.post} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 9. Technical resources */}
      <Section labelledBy="res-h">
        <SectionHeading id="res-h" eyebrow={m.home.resources.eyebrow} title={m.home.resources.title} action={<ArrowLink to={to.resources()}>{m.home.resources.cta}</ArrowLink>} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((r) => (
            <Reveal as="li" key={r} delay={RESOURCES.indexOf(r) * 80}>
              <LinkCard href={to.resource(r)} title={m.resources.items[r].name} text={m.resources.items[r].short} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 9b. Common questions (AEO, FAQPage schema) */}
      <Faq />

      {/* 10. Enquiry CTA */}
      <CTABand />
    </>
  )
}
