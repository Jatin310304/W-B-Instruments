import { Link, useParams } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { BRANDS, PRODUCTS, brandById } from '@/data/catalog'
import { RESOURCES, type ResourceId } from '@/data/site'
import { CTABand, ExternalLink, ICON, LinkCard, Notice, PageHero, Section } from '@/components/ui'
import NotFound from './NotFound'

export function ResourcesPage() {
  const { m } = useI18n()
  usePageMeta(m.resources.title, m.resources.intro)
  return (
    <>
      <PageHero crumbs={[[m.resources.title]]} title={m.resources.title} intro={m.resources.intro} />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <li key={r}><LinkCard href={to.resource(r)} title={m.resources.items[r].name} text={m.resources.items[r].short} /></li>
          ))}
          <li><LinkCard href={to.news()} title={m.nav.news} text={m.news.intro} /></li>
        </ul>
      </Section>
      <CTABand />
    </>
  )
}

export function ResourcePage() {
  const { id = '' } = useParams()
  const { m } = useI18n()
  const valid = RESOURCES.includes(id as ResourceId)
  const c = valid ? m.resources.items[id as ResourceId] : null
  usePageMeta(c ? c.name : m.notFound.title, c?.intro)
  if (!c) return <NotFound />
  return (
    <>
      <PageHero crumbs={[[m.resources.title, to.resources()], [c.name]]} eyebrow={m.resources.title} title={c.name} intro={c.intro} />
      <Section>
        {id === 'documentation' && (
          <>
            <h2 className="t-h2">{m.resources.manufacturerDocs}</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BRANDS.map((b) => (
                <li key={b.id} className="card p-6">
                  <p className="font-semibold text-navy">{b.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{m.brands[b.id].where}</p>
                  <ExternalLink href={b.url} className="mt-4 font-semibold text-blue">{new URL(b.url).host.replace('www.', '')}</ExternalLink>
                </li>
              ))}
            </ul>
          </>
        )}
        {id === 'datasheets' && (
          <div className="relative overflow-x-auto rounded-md border border-line">
            <table className="w-full min-w-[560px] text-start text-[15px]">
              <thead className="bg-graphite-100 text-sm text-navy">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{m.common.category}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{m.products.labels.datasheet}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{m.common.manufacturer}</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">{m.resources.request}</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PRODUCTS.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-ink-muted">{m.categories[p.cat].name}</td>
                    <td className="px-4 py-3"><Link to={to.product(p.id)} className="link">{m.products.items[p.id as keyof typeof m.products.items].name}</Link></td>
                    <td className="px-4 py-3 text-ink-muted">{brandById(p.brand).name}</td>
                    <td className="px-4 py-3 text-end">
                      <Link to={to.contact({ type: 'datasheet', subject: 'product:' + p.id })} className="inline-flex items-center gap-1.5 font-semibold text-blue">
                        <FileText {...ICON} className="h-4 w-4" aria-hidden />
                        {m.products.labels.requestDatasheet}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {id === 'insights' && (
          <>
            <h2 className="t-h2">{m.resources.glossaryTitle}</h2>
            <dl className="mt-8 grid gap-5 md:grid-cols-2">
              {m.resources.glossary.map((g) => (
                <div key={g.t} className="card p-6">
                  <dt className="font-display text-xl font-semibold text-navy">{g.t}</dt>
                  <dd className="mt-2 text-ink-muted">{g.d}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        {c.placeholder && <Notice className={id === 'articles' ? '' : 'mt-10'}>{c.placeholder}</Notice>}
      </Section>
      <CTABand />
    </>
  )
}
