import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { buildIndex, search } from '@/lib/search'
import { to } from '@/lib/routes'
import { ICON, PageHero, Section } from '@/components/ui'

export default function SearchPage() {
  const { m, fmt } = useI18n()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [draft, setDraft] = useState(q)
  useEffect(() => setDraft(q), [q])
  usePageMeta(q ? fmt(m.search.resultsFor, { q }) : m.search.title)
  const index = useMemo(() => buildIndex(m), [m])
  const results = useMemo(() => search(index, q), [index, q])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setParams(draft.trim() ? { q: draft.trim() } : {})
  }
  return (
    <>
      <PageHero crumbs={[[m.search.title]]} title={q ? fmt(m.search.resultsFor, { q }) : m.search.title}>
        <form role="search" onSubmit={submit} className="mt-8 flex max-w-2xl gap-2">
          <label htmlFor="sp-q" className="sr-only">{m.search.label}</label>
          <input id="sp-q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={m.search.placeholder} className="field flex-1 rounded-full" />
          <button type="submit" className="btn-primary rounded-full">
            <SearchIcon {...ICON} className="h-4 w-4" aria-hidden />
            {m.search.submit}
          </button>
        </form>
      </PageHero>
      <Section>
        {!q ? (
          <div className="max-w-2xl">
            <h2 className="t-h3">{m.search.emptyTitle}</h2>
            <p className="mt-2 text-ink-muted">{m.search.emptyText}</p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">{m.search.suggestions}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {m.search.suggestionList.map((s) => (
                <li key={s}><Link to={to.search(s)} onClick={() => setDraft(s)} className="block rounded-full border border-line px-3.5 py-1.5 text-sm text-navy hover:border-navy-300">{s}</Link></li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <div className="max-w-2xl" role="status">
            <h2 className="t-h3">{fmt(m.search.noResultsTitle, { q })}</h2>
            <p className="mt-2 text-ink-muted">{m.search.noResultsText}</p>
            <Link to={to.contact()} className="btn-navy mt-6">{m.common.contactTeam}</Link>
          </div>
        ) : (
          <>
            <p className="text-ink-muted" role="status">{results.length === 1 ? m.search.resultCountOne : fmt(m.search.resultCount, { n: results.length })}</p>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {results.map((r) => (
                <li key={r.to + r.title}>
                  <Link to={r.to} className="group block py-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal-700">{m.search.types[r.type]}</span>
                    <span className="mt-1 block font-display text-xl font-semibold text-navy group-hover:text-blue group-hover:underline">{r.title}</span>
                    <span className="mt-1 block text-ink-muted">{r.text}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )}
      </Section>
    </>
  )
}
