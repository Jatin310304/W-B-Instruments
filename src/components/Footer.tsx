import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { COMPANY, DESIGNER, currentYear, telHref } from '@/data/company'
import { SOLUTIONS } from '@/data/catalog'
import { BUSINESSES } from '@/data/businesses'
import { FOOTER_LEGAL } from '@/data/site'
import { to } from '@/lib/routes'
import { ICON, LinkedInLink, Logo } from './ui'

interface Col { id: string; title: string; links: [string, string][] }

/** Footer columns; on small screens each column is an expandable section. */
function FooterColumn({ col }: { col: Col }) {
  const list = (
    <ul className="space-y-3 pb-2 md:pb-0">
      {col.links.map(([label, href]) => (
        <li key={label}>
          <Link to={href} className="text-[15px] text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
  return (
    <div>
      <details className="group border-b border-white/15 md:hidden">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between font-mono text-xs font-medium uppercase tracking-[0.16em] text-white [&::-webkit-details-marker]:hidden">
          {col.title}
          <ChevronDown {...ICON} className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="pb-4">{list}</div>
      </details>
      <div className="hidden md:block">
        <h2 className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white">{col.title}</h2>
        {list}
      </div>
    </div>
  )
}

export function Footer() {
  const { m, fmt } = useI18n()
  const f = m.footer
  const cols: Col[] = [
    { id: 'company', title: f.columns.company, links: [[f.company.about, to.about()], [f.company.history, to.about('history')], [f.company.purpose, to.about('purpose')], [f.company.careers, to.careers()], [f.company.contact, to.contact()]] },
    { id: 'news', title: f.columns.news, links: [[f.news.newsroom, to.news()], [f.news.events, to.news('event')], [f.news.insights, to.resource('insights')], [f.news.resources, to.resources()], [f.news.documentation, to.resource('documentation')], [f.news.datasheets, to.resource('datasheets')]] },
    { id: 'businesses', title: f.columns.businesses, links: BUSINESSES.map((b) => [m.businesses.items[b.id].name, to.business(b.id)]) },
    { id: 'products', title: f.columns.products, links: SOLUTIONS.filter((s) => s.id !== 'measurement-accessories').map((s) => [m.solutions.items[s.id].name, to.solution(s.id)]) },
    { id: 'connect', title: f.columns.connect, links: [[f.connect.contact, to.contact()], [f.connect.technical, to.contact({ type: 'technical' })], [f.connect.product, to.contact({ type: 'product' })], [f.connect.partnerships, to.about('partners')]] },
  ]
  return (
    <footer className="on-dark bg-carbon text-white">
      <div className="thermal-strip" aria-hidden />
      <div className="container-page">
        <div className="border-t border-white/0 pb-10 pt-12 md:pb-14 md:pt-16">
          <div className="h-px w-full bg-white/30" aria-hidden />
          <div className="mt-8 grid gap-x-8 md:mt-12 md:grid-cols-3 md:gap-y-12 lg:grid-cols-5">
            {cols.map((c) => (
              <FooterColumn key={c.id} col={c} />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#12171F]">
        <div className="container-page py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-6">
              <Logo className="h-16 w-auto" />
              <div>
                <p className="font-display text-2xl font-medium text-white">{f.tagline}</p>
                <p className="mt-1 text-sm text-white/85">{f.supporting}</p>
                <p className="mt-1 text-sm text-white/75">
                  {fmt(f.copyright, { year: currentYear(), company: COMPANY.legalName })} {m.contact.abn} {COMPANY.acn}
                </p>
              </div>
            </div>
            <div className="text-sm text-white/75 lg:text-end">
              <p>{COMPANY.addressLine}</p>
              <p className="mt-1">
                <a href={telHref(COMPANY.phone)} className="hover:text-white hover:underline">{COMPANY.phone}</a>
                <span aria-hidden> · </span>
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white hover:underline">{COMPANY.email}</a>
              </p>
              <p className="mt-1 font-mono text-xs text-white/60">{f.certified}</p>
              <div className="mt-3 flex items-center gap-2 lg:justify-end">
                <span className="text-white/75">{f.followUs}</span>
                <LinkedInLink size={28} />
              </div>
            </div>
          </div>
          <nav aria-label={f.legalNav} className="mt-8 border-t border-white/15 pt-6">
            <ul className="flex flex-wrap gap-y-2 text-sm">
              {FOOTER_LEGAL.map((id, i) => (
                <li key={id} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-3 h-4 w-px bg-white/40" />}
                  <Link to={to.legal(id)} className="text-white/85 hover:text-white hover:underline">
                    {m.legal.titles[id]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/10 pt-5 text-xs text-white/70">
            <span>{f.designedBy}</span>
            <a
              href={DESIGNER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={f.designerLink}
              title={f.designerLink}
              className="group inline-flex items-center rounded-sm outline-offset-2 transition hover:opacity-90"
            >
              <JsrLogo />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/** JSR monogram: signal-cyan block with a navy wordmark, set in the display face. */
function JsrLogo() {
  return (
    <svg viewBox="0 0 64 24" width="56" height="21" aria-hidden className="block" style={{ direction: 'ltr' }}>
      <rect x="0" y="0" width="64" height="24" rx="3" fill="#1FC0D4" />
      <rect x="0" y="20" width="21.3" height="4" fill="#F5A524" />
      <rect x="21.3" y="20" width="21.4" height="4" fill="#F26A21" />
      <rect x="42.7" y="20" width="21.3" height="4" fill="#1462BA" />
      <text x="32" y="15.5" textAnchor="middle" fontFamily="'Barlow Semi Condensed', 'Arial Narrow', sans-serif" fontWeight="700" fontSize="15" letterSpacing="1.5" fill="#16274F">JSR</text>
    </svg>
  )
}
