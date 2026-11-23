import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CircleAlert, CircleCheck, Info, LoaderCircle, Paperclip } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import type { Messages } from '@/i18n/locales/en'
import { PRODUCTS, SERVICES, SOLUTIONS } from '@/data/catalog'
import { BUSINESSES } from '@/data/businesses'
import { COMPANY, telHref } from '@/data/company'
import { to } from '@/lib/routes'
import { cn } from '@/lib/cn'
import { ICON, Rich } from './ui'

/** The live site posts to the W&B backend in /server; the single-file preview only validates. `.env.production` sets VITE_ENQUIRY_ENABLED=true. */
const enabled = () => import.meta.env.VITE_ENQUIRY_ENABLED === 'true'

const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/
const PHONE = /^[+()\d\s.\-/]{6,30}$/
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const clean = (v: string) => v.replace(CONTROL, '').trim()

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; ref: string } | { kind: 'preview' } | { kind: 'error' }

const newRef = () => 'WB-' + Date.now().toString(36).toUpperCase().slice(-6)

/* ---------- Field primitives ---------- */

function Field({ id, label, required, error, hint, children }: { id: string; label: string; required?: boolean; error?: string; hint?: string; children: ReactNode }) {
  const { m } = useI18n()
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required ? <span className="text-ember-700" aria-hidden>*</span> : <span className="font-normal text-ink-muted">({m.common.optional})</span>}
        {required && <span className="sr-only"> ({m.common.required})</span>}
      </label>
      {children}
      {hint && !error && <p id={id + '-hint'} className="mt-1.5 text-sm text-ink-muted">{hint}</p>}
      {error && (
        <p id={id + '-err'} className="field-error">
          <CircleAlert {...ICON} className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? id + '-err' : hint ? id + '-hint' : undefined)

function ErrorSummary({ errors, labels, focusRef }: { errors: Record<string, string>; labels: Record<string, string>; focusRef: React.RefObject<HTMLDivElement> }) {
  const { m, fmt } = useI18n()
  const keys = Object.keys(errors)
  if (!keys.length) return null
  return (
    <div ref={focusRef} tabIndex={-1} role="alert" className="rounded border-s-[3px] border-ember-700 bg-ember-100 p-4 text-[15px]">
      <p className="font-semibold text-ember-900">{keys.length === 1 ? m.form.summaryOne : fmt(m.form.summary, { n: keys.length })}</p>
      <ul className="mt-2 list-disc space-y-1 ps-5">
        {keys.map((k) => (
          <li key={k}>
            <a href={`#${k}`} className="text-ember-900 underline" onClick={(e) => { e.preventDefault(); document.getElementById(k)?.focus() }}>
              {labels[k]}: {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Outcome({ status, onReset, sentText }: { status: Status; onReset: () => void; sentText?: string }) {
  const { m, fmt } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => ref.current?.focus(), [status.kind])
  if (status.kind !== 'sent' && status.kind !== 'preview' && status.kind !== 'error') return null
  const preview = status.kind === 'preview'
  const error = status.kind === 'error'
  return (
    <div ref={ref} tabIndex={-1} role="status" className={cn('rounded-md border p-6', error ? 'border-ember-300 bg-ember-100' : preview ? 'border-amber-300 bg-amber-100' : 'border-signal-300 bg-signal-100')}>
      <p className="flex items-center gap-2 font-display text-2xl font-semibold text-navy">
        {error ? <CircleAlert {...ICON} className="h-6 w-6 text-ember-700" aria-hidden /> : preview ? <Info {...ICON} className="h-6 w-6 text-amber-700" aria-hidden /> : <CircleCheck {...ICON} className="h-6 w-6 text-signal-700" aria-hidden />}
        {error ? m.form.errorTitle : preview ? m.form.previewTitle : m.form.sentTitle}
      </p>
      <p className="mt-2 text-ink">
        {error ? fmt(m.form.errorText, { phone: COMPANY.phone }) : preview ? m.form.previewText : sentText ?? fmt(m.form.sentText, { ref: status.kind === 'sent' ? status.ref : '' })}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={onReset} className="btn-outline">{m.form.another}</button>
        {error && <a href={telHref(COMPANY.phone)} className="btn-navy">{COMPANY.phone}</a>}
      </div>
    </div>
  )
}

function Consent({ id, checked, onChange, error }: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  const { m } = useI18n()
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error} aria-describedby={error ? id + '-err' : undefined} className="mt-1 h-5 w-5 shrink-0 rounded-sm border-graphite-300 accent-blue" />
        <label htmlFor={id} className="text-[15px] text-ink">
          <Rich text={m.form.consent} parts={{ privacy: <Link to={to.legal('privacy')} className="link" target="_blank">{m.form.consentLink}</Link> }} />
          <span className="text-ember-700" aria-hidden> *</span>
        </label>
      </div>
      {error && (
        <p id={id + '-err'} className="field-error ms-8">
          <CircleAlert {...ICON} className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

/** A hidden field people never see; bots fill it in. */
const Honeypot = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
    <label>
      Website
      <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  </div>
)

/* ---------- Enquiry form ---------- */

type EnquiryType = keyof Messages['form']['types']
const TYPES: EnquiryType[] = ['product', 'quote', 'technical', 'application', 'calibration', 'datasheet', 'business', 'general']
type V = { name: string; company: string; email: string; phone: string; type: string; subject: string; message: string; consent: boolean; website: string }
const EMPTY: V = { name: '', company: '', email: '', phone: '', type: '', subject: '', message: '', consent: false, website: '' }

/** All selectable "product or service" values, grouped. */
function subjectOptions(m: Messages) {
  return [
    { group: m.form.groups.services, items: SERVICES.map((s) => ['service:' + s.id, m.services.items[s.id].name]) },
    { group: m.form.groups.solutions, items: SOLUTIONS.map((s) => ['solution:' + s.id, m.solutions.items[s.id].name]) },
    { group: m.form.groups.products, items: PRODUCTS.map((p) => ['product:' + p.id, m.products.items[p.id as keyof typeof m.products.items].name]) },
    { group: m.form.groups.businesses, items: BUSINESSES.map((b) => ['business:' + b.id, m.businesses.items[b.id].name]) },
  ] as { group: string; items: [string, string][] }[]
}

function validateEnquiry(v: V, m: Messages) {
  const e: Record<string, string> = {}
  const name = clean(v.name), email = clean(v.email), phone = clean(v.phone), msg = clean(v.message)
  if (name.length < 2 || name.length > 120) e.name = name.length > 120 ? m.form.errors.tooLong : m.form.errors.name
  if (clean(v.company).length > 160) e.company = m.form.errors.tooLong
  if (!email) e.email = m.form.errors.email
  else if (email.length > 200 || !EMAIL.test(email)) e.email = m.form.errors.emailInvalid
  if (phone && !PHONE.test(phone)) e.phone = m.form.errors.phone
  if (!TYPES.includes(v.type as EnquiryType)) e.type = m.form.errors.type
  if (msg.length < 10) e.message = m.form.errors.message
  else if (msg.length > 5000) e.message = m.form.errors.messageLong
  if (!v.consent) e.consent = m.form.errors.consent
  return e
}

export function EnquiryForm() {
  const { m, locale } = useI18n()
  const [params] = useSearchParams()
  const [v, setV] = useState<V>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const summary = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/:/g, '')
  const ids = { name: `${uid}name`, company: `${uid}company`, email: `${uid}email`, phone: `${uid}phone`, type: `${uid}type`, subject: `${uid}subject`, message: `${uid}message`, consent: `${uid}consent` }
  const options = subjectOptions(m)
  const allValues = options.flatMap((g) => g.items.map(([val]) => val))

  // Prefill from links such as /contact?type=technical&subject=product:ir-metal
  useEffect(() => {
    const type = params.get('type')
    const subject = params.get('subject')
    setV((x) => ({ ...x, type: type && TYPES.includes(type as EnquiryType) ? type : x.type, subject: subject && allValues.includes(subject) ? subject : x.subject }))
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof V>(k: K, val: V[K]) => {
    const next = { ...v, [k]: val }
    setV(next)
    if (submitted) setErrors(validateEnquiry(next, m))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validateEnquiry(v, m)
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    if (v.website) { setStatus({ kind: 'sent', ref: newRef() }); return }
    if (!enabled()) { setStatus({ kind: 'preview' }); return }
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...v, name: clean(v.name), message: clean(v.message), locale: locale.code }) })
      const data = res.ok ? await res.json().catch(() => ({})) : null
      setStatus(res.ok ? { kind: 'sent', ref: data?.ref ?? newRef() } : { kind: 'error' })
    } catch {
      setStatus({ kind: 'error' })
    }
  }

  const reset = () => { setV(EMPTY); setErrors({}); setSubmitted(false); setStatus({ kind: 'idle' }) }
  if (status.kind === 'sent' || status.kind === 'preview' || status.kind === 'error') return <Outcome status={status} onReset={reset} />

  const labels: Record<string, string> = { [ids.name]: m.form.fullName, [ids.company]: m.form.company, [ids.email]: m.form.email, [ids.phone]: m.form.phone, [ids.type]: m.form.enquiryType, [ids.message]: m.form.message, [ids.consent]: m.form.consentLink }
  const idErrors = Object.fromEntries(Object.entries(errors).map(([k, val]) => [ids[k as keyof typeof ids], val]))

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-6">
      <ErrorSummary errors={idErrors} labels={labels} focusRef={summary} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={ids.name} label={m.form.fullName} required error={errors.name}>
          <input id={ids.name} className="field" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy(ids.name, errors.name)} maxLength={140} />
        </Field>
        <Field id={ids.company} label={m.form.company} error={errors.company}>
          <input id={ids.company} className="field" autoComplete="organization" value={v.company} onChange={(e) => set('company', e.target.value)} aria-invalid={!!errors.company} aria-describedby={describedBy(ids.company, errors.company)} maxLength={180} />
        </Field>
        <Field id={ids.email} label={m.form.email} required error={errors.email}>
          <input id={ids.email} type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy(ids.email, errors.email)} maxLength={220} />
        </Field>
        <Field id={ids.phone} label={m.form.phone} error={errors.phone}>
          <input id={ids.phone} type="tel" className="field" autoComplete="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={describedBy(ids.phone, errors.phone)} maxLength={30} />
        </Field>
        <Field id={ids.type} label={m.form.enquiryType} required error={errors.type}>
          <select id={ids.type} className="field" value={v.type} onChange={(e) => set('type', e.target.value)} aria-invalid={!!errors.type} aria-describedby={describedBy(ids.type, errors.type)}>
            <option value="">{m.form.choose}</option>
            {TYPES.map((t) => <option key={t} value={t}>{m.form.types[t]}</option>)}
          </select>
        </Field>
        <Field id={ids.subject} label={m.form.productService}>
          <select id={ids.subject} className="field" value={v.subject} onChange={(e) => set('subject', e.target.value)}>
            <option value="">{m.form.notSure}</option>
            {options.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.items.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
      </div>
      <Field id={ids.message} label={m.form.message} required error={errors.message}>
        <textarea id={ids.message} rows={6} className="field resize-y" value={v.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={describedBy(ids.message, errors.message)} maxLength={5200} />
      </Field>
      <Consent id={ids.consent} checked={v.consent} onChange={(c) => set('consent', c)} error={errors.consent} />
      <Honeypot value={v.website} onChange={(x) => set('website', x)} />
      <button type="submit" className="btn-navy w-full sm:w-auto" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' && <LoaderCircle {...ICON} className="h-4 w-4 animate-spin" aria-hidden />}
        {status.kind === 'sending' ? m.form.sending : m.form.submit}
      </button>
    </form>
  )
}

/* ---------- Careers expression of interest ---------- */

type CV = { name: string; email: string; phone: string; area: string; message: string; consent: boolean; website: string }
const CV_EMPTY: CV = { name: '', email: '', phone: '', area: '', message: '', consent: false, website: '' }
const CV_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const CV_MAX = 5 * 1024 * 1024

export function CareersForm({ role }: { role?: string }) {
  const { m, locale } = useI18n()
  const [v, setV] = useState<CV>(CV_EMPTY)
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const summary = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/:/g, '')
  const ids = { name: `${uid}n`, email: `${uid}e`, phone: `${uid}p`, area: `${uid}a`, cv: `${uid}cv`, message: `${uid}m`, consent: `${uid}c` }
  const areas = Object.entries(m.careers.form.areas)

  const validate = (x: CV, f: File | null) => {
    const e: Record<string, string> = {}
    if (clean(x.name).length < 2) e.name = m.form.errors.name
    if (!clean(x.email)) e.email = m.form.errors.email
    else if (!EMAIL.test(clean(x.email))) e.email = m.form.errors.emailInvalid
    if (x.phone && !PHONE.test(clean(x.phone))) e.phone = m.form.errors.phone
    if (!x.area) e.area = m.form.errors.area
    if (f && !CV_TYPES.includes(f.type) && !/\.(pdf|docx?)$/i.test(f.name)) e.cv = m.form.errors.cvType
    else if (f && f.size > CV_MAX) e.cv = m.form.errors.cvSize
    if (clean(x.message).length < 10) e.message = m.form.errors.message
    if (!x.consent) e.consent = m.form.errors.consent
    return e
  }
  const set = <K extends keyof CV>(k: K, val: CV[K]) => {
    const next = { ...v, [k]: val }
    setV(next)
    if (submitted) setErrors(validate(next, file))
  }
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(v, file)
    setErrors(errs)
    if (Object.keys(errs).length) { requestAnimationFrame(() => summary.current?.focus()); return }
    if (v.website) { setStatus({ kind: 'sent', ref: newRef() }); return }
    if (!enabled()) { setStatus({ kind: 'preview' }); return }
    setStatus({ kind: 'sending' })
    try {
      const body = new FormData()
      Object.entries(v).forEach(([k, val]) => body.append(k, String(val)))
      body.append('locale', locale.code)
      if (role) body.append('role', role)
      if (file) body.append('cv', file)
      const res = await fetch('/api/careers', { method: 'POST', body })
      const data = res.ok ? await res.json().catch(() => ({})) : null
      setStatus(res.ok ? { kind: 'sent', ref: data?.ref ?? newRef() } : { kind: 'error' })
    } catch {
      setStatus({ kind: 'error' })
    }
  }
  const reset = () => { setV(CV_EMPTY); setFile(null); setErrors({}); setSubmitted(false); setStatus({ kind: 'idle' }) }
  if (status.kind === 'sent' || status.kind === 'preview' || status.kind === 'error') return <Outcome status={status} onReset={reset} sentText={m.careers.form.sent} />

  const labels: Record<string, string> = { [ids.name]: m.form.fullName, [ids.email]: m.form.email, [ids.phone]: m.form.phone, [ids.area]: m.careers.form.area, [ids.cv]: m.careers.form.cv, [ids.message]: m.form.message, [ids.consent]: m.form.consentLink }
  const idErrors = Object.fromEntries(Object.entries(errors).map(([k, val]) => [ids[k as keyof typeof ids], val]))

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-6">
      <ErrorSummary errors={idErrors} labels={labels} focusRef={summary} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={ids.name} label={m.form.fullName} required error={errors.name}>
          <input id={ids.name} className="field" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy(ids.name, errors.name)} />
        </Field>
        <Field id={ids.email} label={m.form.email} required error={errors.email}>
          <input id={ids.email} type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy(ids.email, errors.email)} />
        </Field>
        <Field id={ids.phone} label={m.form.phone} error={errors.phone}>
          <input id={ids.phone} type="tel" className="field" autoComplete="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={describedBy(ids.phone, errors.phone)} />
        </Field>
        <Field id={ids.area} label={m.careers.form.area} required error={errors.area}>
          <select id={ids.area} className="field" value={v.area} onChange={(e) => set('area', e.target.value)} aria-invalid={!!errors.area} aria-describedby={describedBy(ids.area, errors.area)}>
            <option value="">{m.form.choose}</option>
            {areas.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </Field>
      </div>
      <Field id={ids.cv} label={m.careers.form.cv} error={errors.cv} hint={m.careers.form.cvHint}>
        <label className="flex cursor-pointer items-center gap-3 rounded border border-dashed border-graphite-300 bg-graphite-100 px-4 py-3 text-[15px] hover:border-navy-300">
          <Paperclip {...ICON} className="h-5 w-5 text-navy" aria-hidden />
          <span className="truncate">{file ? file.name : m.careers.form.cvHint}</span>
          <input id={ids.cv} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" aria-invalid={!!errors.cv} aria-describedby={describedBy(ids.cv, errors.cv, m.careers.form.cvHint)} onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); if (submitted) setErrors(validate(v, f)) }} />
        </label>
      </Field>
      <Field id={ids.message} label={m.form.message} required error={errors.message}>
        <textarea id={ids.message} rows={5} className="field resize-y" value={v.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={describedBy(ids.message, errors.message)} />
      </Field>
      <Consent id={ids.consent} checked={v.consent} onChange={(c) => set('consent', c)} error={errors.consent} />
      <Honeypot value={v.website} onChange={(x) => set('website', x)} />
      <button type="submit" className="btn-navy w-full sm:w-auto" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' && <LoaderCircle {...ICON} className="h-4 w-4 animate-spin" aria-hidden />}
        {status.kind === 'sending' ? m.form.sending : m.careers.form.submit}
      </button>
    </form>
  )
}
