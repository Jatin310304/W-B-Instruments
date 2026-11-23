import { Link, useParams } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { cn } from '@/lib/cn'
import { COMPANY, LEGAL, telHref } from '@/data/company'
import { FOOTER_LEGAL, LEGAL_IDS, type LegalId } from '@/data/site'
import { LEGAL_DOCS } from '@/content/legal'
import { Notice, PageHero, Rich } from '@/components/ui'
import NotFound from './NotFound'

export default function LegalPage() {
  const { id = '' } = useParams()
  const { m } = useI18n()
  const valid = LEGAL_IDS.includes(id as LegalId)
  const title = valid ? m.legal.titles[id as LegalId] : m.notFound.title
  const doc = valid ? LEGAL_DOCS[id as LegalId] : null
  usePageMeta(title, doc?.lead)
  if (!doc) return <NotFound />
  return (
    <>
      <PageHero crumbs={[[title]]} title={title} intro={doc.lead} />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <nav aria-label={m.footer.legalNav} className="lg:col-span-3">
          <ul className="space-y-1 border-l border-line text-[15px]">
            {[...FOOTER_LEGAL, 'copyright' as const].map((l) => (
              <li key={l}>
                <Link to={to.legal(l)} aria-current={l === id ? 'page' : undefined} className={cn('-ms-px block border-s-2 py-1.5 ps-4', l === id ? 'border-signal font-semibold text-navy' : 'border-transparent text-ink-muted hover:text-navy')}>
                  {m.legal.titles[l]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="prose-legal lg:col-span-8 lg:col-start-5">
          <Notice>{doc.kind === 'placeholder' ? m.legal.placeholderNotice : m.legal.draftNotice}</Notice>
          <p className="!mt-4 text-sm text-ink-muted">{m.legal.englishOnly}</p>
          {doc.kind === 'draft' && (
            <p className="text-sm font-semibold text-ink-muted">
              {m.legal.effective}: <Rich text={LEGAL.effectiveDate || '[[TBC: effective date]]'} />
            </p>
          )}
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="mt-10 scroll-mt-40 border-t border-line pt-8">
              <h2>{s.id === 'contains' ? m.legal.willContain : s.id === 'facts' ? m.legal.facts : s.title}</h2>
              {s.body.map((b, i) =>
                'p' in b ? <p key={i}><Rich text={b.p} /></p> : 'ul' in b ? <ul key={i}>{b.ul.map((x) => <li key={x}><Rich text={x} /></li>)}</ul> : <h3 key={i} className="t-h3 mt-6">{b.h}</h3>,
              )}
            </section>
          ))}
          <section className="mt-10 border-t border-line pt-8">
            <h2>{m.legal.questions}</h2>
            <p>
              <Rich text={m.legal.questionsText} parts={{ email: <a href={`mailto:${COMPANY.email}`} className="link">{COMPANY.email}</a>, phone: <a href={telHref(COMPANY.phone)} className="link">{COMPANY.phone}</a> }} />
            </p>
            {id === 'machine-readable-files' && (
              <ul>
                <li><a href="/sitemap.xml" className="link">sitemap.xml</a></li>
                <li><a href="/robots.txt" className="link">robots.txt</a></li>
              </ul>
            )}
          </section>
        </article>
      </div>
    </>
  )
}
