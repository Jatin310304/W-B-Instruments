import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type DeepPartial, type Messages } from './locales/en'
import { DEFAULT_LOCALE, DEFAULT_REGION, LOCALES, REGIONS, visibleLocales, type LocaleDef, type RegionDef } from './config'
import { pseudoize } from './pseudo'

const LS_LOCALE = 'wb-locale'
const LS_REGION = 'wb-region'
const LS_QA = 'wb-i18n-qa'

const read = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
}

/** Deep merge: every key missing from the translation falls back to English. Arrays are replaced whole. */
function merge<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (over === undefined || over === null) return base
  if (typeof base !== 'object' || Array.isArray(base)) return (over as T) ?? base
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = merge((base as Record<string, unknown>)[k], v as never)
  return out as T
}

/** Fills {name} placeholders. */
export function fmt(s: string, vars?: Record<string, string | number>) {
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s
}

interface I18n {
  locale: LocaleDef
  locales: LocaleDef[]
  setLocale: (code: string) => void
  region: RegionDef
  setRegion: (code: RegionDef['code']) => void
  m: Messages
  fmt: typeof fmt
  formatDate: (iso: string, opts?: Intl.DateTimeFormatOptions) => string
  formatNumber: (n: number, opts?: Intl.NumberFormatOptions) => string
}

const Ctx = createContext<I18n | null>(null)

const initialLocale = () => {
  const q = new URLSearchParams(location.search).get('lang')
  if (q && LOCALES.some((l) => l.code === q)) {
    if (LOCALES.find((l) => l.code === q)!.status === 'qa') write(LS_QA, '1')
    return q
  }
  const saved = read(LS_LOCALE)
  return saved && LOCALES.some((l) => l.code === saved) ? saved : DEFAULT_LOCALE
}
const savedRegion = (): RegionDef['code'] | null => {
  const saved = read(LS_REGION)
  return REGIONS.some((r) => r.code === saved) ? (saved as RegionDef['code']) : null
}
/** Without a saved choice, the device time zone gives a first guess until the IP lookup answers. */
const timeZoneRegion = (): RegionDef['code'] => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
    return tz.startsWith('Australia/') || tz === 'Antarctica/Macquarie' ? 'AU' : 'INT'
  } catch {
    return DEFAULT_REGION
  }
}
const initialRegion = (): RegionDef['code'] => savedRegion() ?? timeZoneRegion()

/** Country from the visitor's IP address (server/geo.mjs). Australia and its external territories are served from Australia. */
const AU_COUNTRIES = ['AU', 'CX', 'CC', 'NF', 'HM']
async function ipRegion(): Promise<RegionDef['code'] | null> {
  if (location.protocol === 'file:') return null
  try {
    const r = await fetch('/api/geo', { headers: { accept: 'application/json' } })
    if (!r.ok) return null
    const j = (await r.json()) as { country?: string | null }
    return j.country ? (AU_COUNTRIES.includes(j.country) ? 'AU' : 'INT') : null
  } catch {
    return null
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState(initialLocale)
  const [regionCode, setRegionCode] = useState(initialRegion)
  const [loaded, setLoaded] = useState<Record<string, DeepPartial<Messages>>>({})
  const locale = LOCALES.find((l) => l.code === code) ?? LOCALES[0]
  const region = REGIONS.find((r) => r.code === regionCode) ?? REGIONS[0]
  const qa = read(LS_QA) === '1' || code === 'qps'

  // Region follows the visitor's IP address until they choose one themselves (the choice is saved and wins).
  useEffect(() => {
    if (savedRegion()) return
    let live = true
    ipRegion().then((r) => {
      if (live && r && !savedRegion()) setRegionCode(r)
    })
    return () => {
      live = false
    }
  }, [])

  useEffect(() => {
    if (locale.load && !loaded[locale.code]) locale.load().then((d) => setLoaded((x) => ({ ...x, [locale.code]: d })))
  }, [locale, loaded])

  useEffect(() => {
    document.documentElement.lang = locale.code === 'qps' ? 'en-AU' : locale.code
    document.documentElement.dir = locale.dir
  }, [locale])

  const m = useMemo<Messages>(() => {
    if (locale.code === 'qps') return pseudoize(en as Messages)
    return merge(en as Messages, loaded[locale.code])
  }, [locale.code, loaded])

  const setLocale = useCallback((c: string) => {
    setCode(c)
    write(LS_LOCALE, c)
  }, [])
  const setRegion = useCallback((c: RegionDef['code']) => {
    setRegionCode(c)
    write(LS_REGION, c)
  }, [])

  const intl = locale.code === 'en-AU' ? region.intl : locale.intl
  const value = useMemo<I18n>(
    () => ({
      locale,
      locales: visibleLocales(qa),
      setLocale,
      region,
      setRegion,
      m,
      fmt,
      formatDate: (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => new Intl.DateTimeFormat(intl, opts).format(new Date(iso + 'T00:00:00')),
      formatNumber: (n, opts) => new Intl.NumberFormat(intl, opts).format(n),
    }),
    [locale, qa, setLocale, region, setRegion, m, intl],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useI18n outside I18nProvider')
  return c
}
