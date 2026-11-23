import { useI18n } from '@/i18n/I18nProvider'
import { usePageMeta } from '@/lib/seo'
import { JOBS } from '@/data/site'
import { CareersForm } from '@/components/Forms'
import { Notice, PageHero, Section } from '@/components/ui'
import { useState } from 'react'
import { blocks, useCms } from '@/lib/cms'

export default function CareersPage() {
  const { m, formatDate } = useI18n()
  const C = m.careers
  const { jobs } = useCms()
  const [role, setRole] = useState<string | undefined>()
  const apply = (title: string) => { setRole(title); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  usePageMeta(C.title, C.intro)
  return (
    <>
      <PageHero crumbs={[[C.title]]} title={C.title} intro={C.intro} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <section id="working" className="scroll-mt-40">
            <h2 className="t-h2">{C.sections.working}</h2>
            <p className="mt-4 text-lg text-ink-muted">{C.working}</p>
          </section>
          <section id="culture" className="scroll-mt-40">
            <h2 className="t-h2">{C.sections.culture}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {m.about.values.map((v) => <li key={v.h} className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-navy">{v.h}</li>)}
            </ul>
            <Notice className="mt-6">{C.culturePlaceholder}</Notice>
          </section>
        </div>
      </Section>
      <Section tone="mist" id="openings">
        <h2 className="t-h2">{C.sections.openings}</h2>
        {jobs.length || JOBS.length ? (
          <ul className="mt-8 space-y-4">
            {jobs.map((j) => (
              <li key={j.id} className="card p-6 sm:p-8">
                <h3 className="t-h3">{j.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {C.job.location}: {j.location} · {C.job.type}: {j.type}
                  {j.closingDate && <> · {C.job.closes}: <time dateTime={j.closingDate}>{formatDate(j.closingDate)}</time></>}
                </p>
                <details className="mt-4 group">
                  <summary className="cursor-pointer font-semibold text-navy">{C.job.description}</summary>
                  <div className="mt-3 space-y-3 text-ink">
                    {blocks(j.description).map((b, i) => ('p' in b ? <p key={i}>{b.p}</p> : <ul key={i} className="list-disc space-y-1 ps-6">{b.ul.map((li) => <li key={li}>{li}</li>)}</ul>))}
                  </div>
                </details>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button type="button" className="btn-navy" onClick={() => apply(j.title)}>{C.job.apply}</button>
                  {j.applyEmail && <span className="text-sm text-ink-muted">{C.job.orEmail} <a className="link" href={`mailto:${j.applyEmail}?subject=${encodeURIComponent(j.title)}`}>{j.applyEmail}</a></span>}
                </div>
              </li>
            ))}
            {JOBS.map((j) => (
              <li key={j.id} className="card p-6">
                <p className="t-h3">{j.id}</p>
                <p className="mt-1 text-sm text-ink-muted">{C.job.location}: {j.location} · {C.job.type}: {j.type}</p>
                <a href="#apply" className="btn-navy mt-4">{C.job.apply}</a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 max-w-3xl">
            <p className="text-lg font-semibold text-navy">{C.noOpenings}</p>
            <p className="mt-2 text-ink-muted">{C.noOpeningsText}</p>
          </div>
        )}
      </Section>
      <Section id="apply">
        <div className="mx-auto max-w-3xl">
          <h2 className="t-h2">{C.form.title}</h2>
          {role && <p className="mt-4 text-lg font-semibold text-navy">{C.job.applyingFor}: {role}</p>}
          <div className="mt-8">
            <CareersForm key={role ?? 'general'} role={role} />
          </div>
        </div>
      </Section>
    </>
  )
}
