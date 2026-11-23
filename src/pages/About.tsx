import { Check } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { BRANDS } from '@/data/catalog'
import { COMPANY } from '@/data/company'
import { ArrowLink, CTABand, ExternalLink, ICON, Img, Notice, PageHero } from "@/components/ui"

export default function AboutPage() {
  const { m } = useI18n()
  const A = m.about
  usePageMeta(A.title, A.overview[0])
  const toc: [string, string][] = Object.entries(A.sections) as [string, string][]
  return (
    <>
      <PageHero crumbs={[[m.nav.about]]} title={A.title} intro={A.intro} />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <nav aria-label={m.common.onThisPage} className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">{m.common.onThisPage}</p>
            <ol className="mt-4 space-y-1 border-l border-line text-[15px]">
              {toc.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="-ms-px block border-s-2 border-transparent py-1 ps-4 text-ink-muted hover:border-signal hover:text-navy">{label}</a></li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="space-y-16 lg:col-span-9">
          <section id="overview" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.overview}</h2>
            {A.overview.map((p) => <p key={p} className="mt-4 text-lg text-ink-muted">{p}</p>)}
          </section>
          <section id="history" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.history}</h2>
            {A.history.map((p) => <p key={p} className="mt-4 text-lg text-ink-muted">{p}</p>)}
            <Notice className="mt-6">{A.historyPlaceholder}</Notice>
          </section>
          <section id="purpose" className="on-light hero-light scroll-mt-40 rounded-md p-8 text-white sm:p-10">
            <p className="eyebrow">{A.sections.purpose}</p>
            <p className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">{A.purpose}</p>
          </section>
          <section id="values" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.values}</h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
              {A.values.map((v, i) => (
                <li key={v.h} className="bg-white p-5">
                  <span className={['text-navy-500', 'text-blue', 'text-signal-700', 'text-amber-700', 'text-ember-700'][i] + ' font-display text-2xl font-semibold'}>{v.h}</span>
                  <p className="mt-2 text-[15px] text-ink-muted">{v.p}</p>
                </li>
              ))}
            </ul>
          </section>
          <section id="expertise" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.expertise}</h2>
            <p className="mt-4 text-lg text-ink-muted">{A.expertise}</p>
          </section>
          <section id="partners" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.partners}</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {BRANDS.map((b) => (
                <li key={b.id} className="card p-6">
                  <div className="flex h-10 items-center"><Img name={b.logo} alt={b.name} fit="contain" className="h-8 w-auto max-w-[150px]" imgClassName="object-left" /></div>
                  <p className="mt-4 font-semibold text-navy">{b.name}</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">{m.brands[b.id].where}</p>
                  <p className="mt-3 text-[15px] text-ink-muted">{m.brands[b.id].does}</p>
                  <ExternalLink href={b.url} className="mt-4 text-[15px] font-semibold text-blue">{new URL(b.url).host.replace('www.', '')}</ExternalLink>
                </li>
              ))}
            </ul>
          </section>
          <section id="capabilities" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.capabilities}</h2>
            <p className="mt-4 text-lg text-ink-muted">{A.capabilitiesText}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {A.capabilities.map((c) => <li key={c} className="rounded-sm border border-line bg-graphite-100 px-3 py-1.5 font-mono text-sm text-navy">{c}</li>)}
            </ul>
            <ArrowLink to={to.products()} className="mt-6">{m.nav.allProducts}</ArrowLink>
          </section>
          <section id="support" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.support}</h2>
            <p className="mt-4 text-lg text-ink-muted">{A.supportText}</p>
            <ArrowLink to={to.support()} className="mt-6">{m.nav.support}</ArrowLink>
          </section>
          <section id="quality" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.quality}</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto]">
              <ul className="grid gap-4 sm:grid-cols-2">
                {A.quality.map((q) => (
                  <li key={q.h} className="card p-5">
                    <p className="flex items-center gap-2 font-semibold text-navy"><Check {...ICON} className="h-5 w-5 text-signal-700" aria-hidden />{q.h}</p>
                    <p className="mt-2 text-[15px] text-ink-muted">{q.p}</p>
                  </li>
                ))}
              </ul>
              <div className="card flex flex-col items-center justify-center p-6 text-center">
                <Img name="bsi-iso9001-fs604761" alt={A.certificateAlt} fit="contain" className="h-24 w-36" />
                {COMPANY.isoCertificateUrl ? <ExternalLink href={COMPANY.isoCertificateUrl} className="mt-3 text-sm font-semibold text-blue">{COMPANY.iso.standard} · {COMPANY.iso.certificate}</ExternalLink> : <p className="mt-3 text-sm text-ink-muted">{A.certificatePending}</p>}
              </div>
            </div>
          </section>
          <section id="why" className="scroll-mt-40">
            <h2 className="t-h2">{A.sections.why}</h2>
            <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {A.why.map((w, i) => (
                <li key={w.h} className="card p-6">
                  <span className="reading text-sm text-signal-700">{String(i + 1).padStart(2, '0')}</span>
                  <p className="t-h3 mt-2">{w.h}</p>
                  <p className="mt-2 text-[15px] text-ink-muted">{w.p}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <CTABand />
    </>
  )
}
