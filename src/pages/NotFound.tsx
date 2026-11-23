import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { to } from '@/lib/routes'
import { Reading } from '@/components/ui'

export default function NotFound() {
  const { m } = useI18n()
  usePageMeta(m.notFound.title)
  return (
    <section className="on-light hero-light text-white">
      <div className="container-page flex flex-col items-start gap-8 py-20 sm:py-28">
        <Reading value="404" tone="amber" />
        <h1 className="t-h1 text-white">{m.notFound.title}</h1>
        <p className="max-w-xl text-lg text-white/80">{m.notFound.text}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">{m.notFound.home}</Link>
          <Link to={to.search()} className="btn-outline">{m.notFound.search}</Link>
        </div>
      </div>
    </section>
  )
}
