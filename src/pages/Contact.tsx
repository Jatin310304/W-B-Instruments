import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { COMPANY, telHref } from '@/data/company'
import { EnquiryForm } from '@/components/Forms'
import { ExternalLink, ICON, PageHero, Section } from '@/components/ui'

export default function ContactPage() {
  const { m } = useI18n()
  const C = m.contact
  usePageMeta(C.title, C.intro)
  const routes = [
    { k: 'product', ...C.routes.product },
    { k: 'technical', ...C.routes.technical },
    { k: 'general', ...C.routes.general },
  ]
  return (
    <>
      <PageHero crumbs={[[C.title]]} title={C.title} intro={C.intro} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <aside className="space-y-8 lg:col-span-4">
            <div className="card p-6">
              <h2 className="t-h3">{C.office}</h2>
              <p className="mt-1 text-sm text-ink-muted">{COMPANY.legalName} · {C.abn} {COMPANY.acn}</p>
              <dl className="mt-5 space-y-4 text-[15px]">
                <div className="flex gap-3">
                  <dt><MapPin {...ICON} className="mt-0.5 h-5 w-5 text-signal-700" aria-hidden /><span className="sr-only">{C.address}</span></dt>
                  <dd>
                    <address className="not-italic">{COMPANY.address.street}<br />{COMPANY.address.locality} {COMPANY.address.region} {COMPANY.address.postcode}<br />{COMPANY.address.country}</address>
                    <ExternalLink href={COMPANY.mapsUrl} className="mt-1 text-sm font-semibold text-blue">{C.map}</ExternalLink>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt><Phone {...ICON} className="mt-0.5 h-5 w-5 text-signal-700" aria-hidden /><span className="sr-only">{C.phone}</span></dt>
                  <dd><a href={telHref(COMPANY.phone)} className="link font-mono">{COMPANY.phone}</a></dd>
                </div>
                <div className="flex gap-3">
                  <dt><Printer {...ICON} className="mt-0.5 h-5 w-5 text-signal-700" aria-hidden /><span className="sr-only">{C.fax}</span></dt>
                  <dd className="font-mono">{COMPANY.fax} <span className="font-sans text-sm text-ink-muted">({C.fax})</span></dd>
                </div>
                <div className="flex gap-3">
                  <dt><Mail {...ICON} className="mt-0.5 h-5 w-5 text-signal-700" aria-hidden /><span className="sr-only">{C.email}</span></dt>
                  <dd><a href={`mailto:${COMPANY.email}`} className="link break-all">{COMPANY.email}</a></dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="t-h3">{C.routesTitle}</h2>
              <ul className="mt-4 space-y-3">
                {routes.map((r) => (
                  <li key={r.k}>
                    <Link to={to.contact({ type: r.k })} preventScrollReset className="block rounded-md border border-line p-4 hover:border-navy-300">
                      <span className="font-semibold text-navy">{r.h}</span>
                      <span className="block text-sm text-ink-muted">{r.p}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <h2 className="t-h2">{C.formTitle}</h2>
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
