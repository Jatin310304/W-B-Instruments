import { Link } from 'react-router-dom'
import { ArrowRight, Headset, Mail, MessagesSquare, Wrench } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { COMPANY, telHref } from '@/data/company'
import { CTABand, ICON, PageHero, Section } from '@/components/ui'

export default function SupportPage() {
  const { m } = useI18n()
  usePageMeta(m.support.title, m.support.intro)
  const S = m.support.items
  const items = [
    { id: 'technical', icon: Wrench, href: to.contact({ type: 'technical' }), ...S.technical },
    { id: 'product', icon: MessagesSquare, href: to.contact({ type: 'product' }), ...S.product },
    { id: 'application', icon: Headset, href: to.contact({ type: 'application' }), ...S.application },
    { id: 'team', icon: Mail, href: to.contact(), ...S.team },
  ]
  return (
    <>
      <PageHero crumbs={[[m.support.title]]} title={m.support.title} intro={m.support.intro} />
      <Section>
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map(({ id, icon: Icon, href, name, text, cta }) => (
            <li key={id} id={id} className="card scroll-mt-40 p-7">
              <Icon {...ICON} className="h-8 w-8 text-signal-700" aria-hidden />
              <h2 className="t-h3 mt-4">{name}</h2>
              <p className="mt-2 text-ink-muted">{text}</p>
              {id === 'team' && (
                <p className="mt-3 font-mono text-sm">
                  <a href={telHref(COMPANY.phone)} className="link">{COMPANY.phone}</a> · <a href={`mailto:${COMPANY.email}`} className="link">{COMPANY.email}</a>
                </p>
              )}
              <Link to={href} className="btn-navy mt-6">
                {cta}
                <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CTABand />
    </>
  )
}
