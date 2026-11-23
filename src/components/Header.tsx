import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Globe, MapPin, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useI18n } from '@/i18n/I18nProvider'
import { REGIONS } from '@/i18n/config'
import { isActive, mainNav, utilityNav, type NavItem } from '@/lib/nav'
import { buildIndex, search, type SearchEntry } from '@/lib/search'
import { to } from '@/lib/routes'
import { cn } from '@/lib/cn'
import { currentTheme, setTheme, type Theme } from '@/lib/theme'
import { ICON, LinkedInLink, Logo } from './ui'

/* ---------------- Shared popover behaviour ---------------- */

function useDismiss(open: boolean, close: () => void, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close, ref])
}

/** A button that opens a small list of single-choice options (country, language). */
function ChoiceMenu({ label, buttonLabel, icon, options, value, onChange, footnote, align = 'left', tone = 'dark', size = 'sm' }: {
  label: string
  buttonLabel: ReactNode
  icon: ReactNode
  options: { value: string; label: string; note?: string }[]
  value: string
  onChange: (v: string) => void
  footnote?: string
  align?: 'left' | 'right'
  tone?: 'dark' | 'light'
  size?: 'sm' | 'lg'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const id = useId()
  const close = useCallback(() => setOpen(false), [])
  useDismiss(open, close, ref)
  const focusOption = (i: number) => ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')[i]?.focus()
  useEffect(() => {
    if (open) focusOption(Math.max(0, options.findIndex((o) => o.value === value)))
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  const onMenuKey = (e: ReactKeyboardEvent) => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus() }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus() }
    if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); if (e.key === 'Escape') btn.current?.focus() }
  }
  return (
    <div ref={ref} className="relative">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 rounded transition-colors',
          size === 'lg' ? 'px-2 py-2 font-display text-xl font-semibold' : 'px-2 py-1.5 text-[15px]',
          tone === 'dark' ? 'text-white hover:bg-white/10' : 'text-navy hover:bg-navy-100',
        )}
      >
        {icon}
        <span>{buttonLabel}</span>
        <ChevronDown {...ICON} className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div id={id} role="menu" aria-label={label} onKeyDown={onMenuKey} className={cn('fade-in absolute top-full z-50 mt-2 w-64 rounded-md border border-line bg-white p-1.5 text-ink shadow-panel', align === 'right' ? 'end-0' : 'start-0')}>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="menuitemradio"
              aria-checked={o.value === value}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
                btn.current?.focus()
              }}
              className="flex w-full items-start gap-2 rounded px-3 py-2 text-start text-[15px] hover:bg-graphite-100 focus-visible:bg-graphite-100"
            >
              <Check {...ICON} className={cn('mt-0.5 h-4 w-4 shrink-0 text-signal-700', o.value !== value && 'invisible')} aria-hidden />
              <span>
                <span className="block font-medium text-navy">{o.label}</span>
                {o.note && <span className="block text-xs text-ink-muted">{o.note}</span>}
              </span>
            </button>
          ))}
          {footnote && <p className="border-t border-line px-3 pb-1.5 pt-2.5 text-xs text-ink-muted">{footnote}</p>}
        </div>
      )}
    </div>
  )
}

export function CountrySelector(props: { tone?: 'dark' | 'light'; size?: 'sm' | 'lg' }) {
  const { m, region, setRegion } = useI18n()
  return (
    <ChoiceMenu
      {...props}
      label={m.header.countryChange}
      buttonLabel={<><span className="sr-only">{m.header.country}: </span>{m.regions[region.code]}</>}
      icon={props.size === 'lg' ? null : <MapPin {...ICON} className="h-4 w-4" aria-hidden />}
      options={REGIONS.map((r) => ({ value: r.code, label: m.regions[r.code] }))}
      value={region.code}
      onChange={(v) => setRegion(v as 'AU' | 'INT')}
    />
  )
}

export function LanguageSelector(props: { tone?: 'dark' | 'light'; align?: 'left' | 'right'; compact?: boolean }) {
  const { m, locale, locales, setLocale } = useI18n()
  return (
    <ChoiceMenu
      {...props}
      label={m.header.languageChange}
      buttonLabel={props.compact ? <span className="sr-only">{locale.label}</span> : <><span className="sr-only">{m.header.language}: </span>{m.header.global} · {locale.label}</>}
      icon={<Globe {...ICON} className="h-[18px] w-[18px]" aria-hidden />}
      options={locales.map((l) => ({ value: l.code, label: l.label, note: l.status === 'qa' ? m.languages.pseudoNote : undefined }))}
      value={locale.code}
      onChange={setLocale}
      footnote={m.languages.moreToCome}
    />
  )
}

/* ---------------- Search ---------------- */

function useSearch(q: string, limit: number) {
  const { m } = useI18n()
  const index = useMemo(() => buildIndex(m), [m])
  return useMemo(() => search(index, q, limit), [index, q, limit])
}

function ResultRow({ r, active, id, onPick }: { r: SearchEntry; active: boolean; id: string; onPick: () => void }) {
  const { m } = useI18n()
  return (
    <li role="option" id={id} aria-selected={active}>
      <Link to={r.to} onClick={onPick} tabIndex={-1} className={cn('block rounded px-3 py-2.5', active ? 'bg-graphite-100' : 'hover:bg-graphite-100')}>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal-700">{m.search.types[r.type]}</span>
        <span className="block font-medium text-navy">{r.title}</span>
        <span className="block truncate text-sm text-ink-muted">{r.text}</span>
      </Link>
    </li>
  )
}

/** Combobox search used in the desktop header and in the mobile search dialog. */
export function SearchBox({ variant, autoFocus, onDone }: { variant: 'header' | 'dialog'; autoFocus?: boolean; onDone?: () => void }) {
  const { m, fmt } = useI18n()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const results = useSearch(q, 6)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const close = useCallback(() => setOpen(false), [])
  useDismiss(open && variant === 'header', close, ref)

  useEffect(() => {
    if (variant !== 'header') return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [variant])

  const finish = () => {
    setOpen(false)
    setQ('')
    setActive(-1)
    onDone?.()
  }
  const submit = () => {
    if (active >= 0 && results[active]) navigate(results[active].to)
    else if (q.trim()) navigate(to.search(q.trim()))
    else return
    finish()
    input.current?.blur()
  }
  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)) }
    else if (e.key === 'Enter') { e.preventDefault(); submit() }
    else if (e.key === 'Escape') { setOpen(false); setActive(-1) }
  }
  const showPanel = variant === 'dialog' || (open && q.trim().length > 0)
  const dark = variant === 'header'

  return (
    <div ref={ref} className={cn('relative', variant === 'header' ? 'w-[300px] 2xl:w-[340px]' : 'w-full')}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit() }}>
        <label htmlFor={listId + '-in'} className="sr-only">{m.search.label}</label>
        <input
          ref={input}
          id={listId + '-in'}
          type="search"
          role="combobox"
          aria-expanded={showPanel && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={q}
          placeholder={m.search.placeholder}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          className={cn(
            'w-full rounded-full border py-2 ps-4 pe-11 text-[15px] transition-colors [&::-webkit-search-cancel-button]:hidden',
            dark ? 'peer border-white/25 bg-white/10 text-white placeholder:text-white/75 hover:bg-white/15 focus:border-signal focus:bg-white focus:text-navy focus:placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-signal/40' : 'field rounded-full py-3 text-lg',
          )}
        />
        <button type="submit" className={cn('absolute end-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full', dark ? 'text-white hover:bg-white/15 peer-focus:text-navy peer-focus:hover:bg-navy-100' : 'text-navy hover:bg-navy-100')} aria-label={m.search.submit}>
          <Search {...ICON} className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </form>
      {showPanel && (
        <div className={cn(variant === 'header' && 'fade-in absolute end-0 top-full z-50 mt-2 w-[420px] rounded-md border border-line bg-white p-2 text-ink shadow-panel', variant === 'dialog' && 'mt-4')}>
          {!q.trim() ? (
            <div className="p-2">
              <p className="font-display text-xl font-semibold text-navy">{m.search.emptyTitle}</p>
              <p className="mt-1 text-sm text-ink-muted">{m.search.emptyText}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{m.search.suggestions}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {m.search.suggestionList.map((s) => (
                  <button key={s} type="button" onClick={() => { setQ(s); setOpen(true); input.current?.focus() }} className="rounded-full border border-line px-3 py-1 text-sm text-navy hover:border-navy-300 hover:bg-graphite-100">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-3" role="status">
              <p className="font-semibold text-navy">{fmt(m.search.noResultsTitle, { q })}</p>
              <p className="mt-1 text-sm text-ink-muted">{m.search.noResultsText}</p>
              <Link to={to.contact()} onClick={finish} className="arrow-link mt-3 text-sm">{m.common.contactTeam}<ArrowRight {...ICON} className="h-4 w-4" aria-hidden /></Link>
            </div>
          ) : (
            <>
              <ul id={listId} role="listbox" aria-label={m.search.label}>
                {results.map((r, i) => <ResultRow key={r.to + r.title} r={r} id={`${listId}-${i}`} active={i === active} onPick={finish} />)}
              </ul>
              <Link to={to.search(q.trim())} onClick={finish} className="mt-1 flex items-center justify-between rounded border-t border-line px-3 py-2.5 text-sm font-semibold text-blue hover:bg-graphite-100">
                {fmt(m.search.seeAll, { q: q.trim() })}
                <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const { m } = useI18n()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={m.search.title} className="fixed inset-0 z-[60] overflow-y-auto bg-white">
      <div className="container-page flex items-center justify-between py-4">
        <p className="font-display text-2xl font-semibold text-navy">{m.search.title}</p>
        <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded text-navy hover:bg-navy-100" aria-label={m.common.close}>
          <X {...ICON} className="h-6 w-6" aria-hidden />
        </button>
      </div>
      <div className="container-page pb-10">
        <SearchBox variant="dialog" autoFocus onDone={onClose} />
      </div>
    </div>
  )
}

/* ---------------- Desktop main navigation ---------------- */

function MegaPanel({ item, id, onNavigate }: { item: NavItem; id: string; onNavigate: () => void }) {
  const many = (item.children?.length ?? 0) > 6
  return (
    <div id={id} className="fade-in absolute inset-x-0 top-full z-40 rounded-b-md border-t border-line bg-white text-ink shadow-panel">
      <div className="container-page grid grid-cols-12 gap-8 py-8">
        <div className="col-span-4 border-r border-line pe-8">
          <p className="font-display text-3xl font-semibold text-navy">{item.label}</p>
          {item.intro && <p className="mt-2 text-ink-muted">{item.intro}</p>}
          {item.overview && (
            <Link to={item.overview.to} onClick={onNavigate} className="arrow-link mt-5">
              {item.overview.label}
              <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
        <ul className={cn('col-span-8 grid gap-x-8 gap-y-1', many ? 'grid-cols-2' : 'grid-cols-2')}>
          {item.children!.map((c) => (
            <li key={c.to}>
              <NavLink to={c.to} onClick={onNavigate} className={({ isActive: a }) => cn('group block rounded px-3 py-2.5 hover:bg-graphite-100', a && 'bg-signal-100')}>
                <span className="flex items-center gap-2 font-semibold text-navy">
                  {c.label}
                  <ArrowRight {...ICON} className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                </span>
                {c.text && <span className="mt-0.5 block text-sm text-ink-muted">{c.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MainNav() {
  const { m } = useI18n()
  const { pathname } = useLocation()
  const items = mainNav(m)
  const [open, setOpen] = useState<string | null>(null)
  const timer = useRef<number>()
  const navRef = useRef<HTMLElement>(null)
  const close = useCallback(() => setOpen(null), [])
  useDismiss(open !== null, close, navRef)
  useEffect(() => setOpen(null), [pathname])
  const hover = (id: string | null, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(id), delay)
  }
  const onKey = (e: ReactKeyboardEvent, item: NavItem) => {
    if (e.key === 'ArrowDown' && item.children) {
      e.preventDefault()
      setOpen(item.id)
      requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#mega-${item.id} a`)?.focus())
    }
    if (e.key === 'Escape') setOpen(null)
  }
  return (
    <nav ref={navRef} aria-label={m.header.mainNav} onMouseLeave={() => hover(null, 180)} onBlur={(e) => { if (!navRef.current?.contains(e.relatedTarget as Node)) setOpen(null) }}>
      <ul className="flex items-stretch justify-end">
        {items.map((item) => {
          const active = isActive(item, pathname)
          const base = cn('relative flex h-14 items-center gap-1 whitespace-nowrap px-3 font-display text-[19px] font-medium text-white transition-colors hover:text-signal 2xl:px-4 2xl:text-xl', (active || open === item.id) && 'text-signal')
          const bar = <span aria-hidden className={cn('absolute inset-x-3 bottom-0 h-[3px] bg-signal transition-all duration-300 2xl:inset-x-4', active ? 'scale-x-100 opacity-100' : open === item.id ? 'scale-x-100 opacity-60' : 'scale-x-0 opacity-0')} />
          return (
            <li key={item.id} className="flex" onMouseEnter={() => (item.children ? hover(item.id, 120) : hover(null, 120))}>
              {item.children ? (
                <button type="button" className={base} aria-expanded={open === item.id} aria-controls={`mega-${item.id}`} aria-current={active ? 'page' : undefined} onClick={() => setOpen((o) => (o === item.id ? null : item.id))} onKeyDown={(e) => onKey(e, item)}>
                  {item.label}
                  <ChevronDown {...ICON} className={cn('h-4 w-4 opacity-80 transition-transform', open === item.id && 'rotate-180')} aria-hidden />
                  {bar}
                </button>
              ) : (
                <Link to={item.to} className={base} aria-current={active ? 'page' : undefined}>
                  {item.label}
                  {bar}
                </Link>
              )}
              {item.children && open === item.id && <MegaPanel item={item} id={`mega-${item.id}`} onNavigate={() => setOpen(null)} />}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ---------------- Mobile navigation ---------------- */

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { m } = useI18n()
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState<string | null>(() => mainNav(m).find((i) => i.children && isActive(i, pathname))?.id ?? null)
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a,button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return (
    <div ref={panel} id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-50 overflow-y-auto overscroll-contain bg-white xl:hidden">
      <nav aria-label={m.header.mainNav} className="container-page py-3">
        <ul className="divide-y divide-line">
          {mainNav(m).map((item) => {
            const active = isActive(item, pathname)
            if (!item.children)
              return (
                <li key={item.id}>
                  <Link to={item.to} onClick={onClose} aria-current={active ? 'page' : undefined} className={cn('flex min-h-[56px] items-center font-display text-xl font-semibold', active ? 'text-blue' : 'text-navy')}>
                    {item.label}
                  </Link>
                </li>
              )
            const isOpen = expanded === item.id
            return (
              <li key={item.id}>
                <button type="button" aria-expanded={isOpen} aria-controls={`m-${item.id}`} onClick={() => setExpanded(isOpen ? null : item.id)} className={cn('flex min-h-[56px] w-full items-center justify-between text-start font-display text-xl font-semibold', active ? 'text-blue' : 'text-navy')}>
                  {item.label}
                  <ChevronDown {...ICON} className={cn('h-5 w-5 transition-transform', isOpen && 'rotate-180')} aria-hidden />
                </button>
                <ul id={`m-${item.id}`} hidden={!isOpen} className="pb-3">
                  {item.overview && (
                    <li>
                      <Link to={item.overview.to} onClick={onClose} className="flex min-h-[44px] items-center gap-2 ps-3 font-semibold text-blue">
                        {item.overview.label}
                        <ArrowRight {...ICON} className="h-4 w-4" aria-hidden />
                      </Link>
                    </li>
                  )}
                  {item.children.map((c) => (
                    <li key={c.to}>
                      <NavLink to={c.to} onClick={onClose} className={({ isActive: a }) => cn('flex min-h-[44px] items-center border-s-2 ps-3', a ? 'border-signal font-semibold text-navy' : 'border-line text-ink')}>
                        {c.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
        <ul className="mt-4 grid grid-cols-1 gap-1 border-t border-line pt-4 xs:grid-cols-3">
          {utilityNav(m).map((u) => (
            <li key={u.id}>
              <Link to={u.to} onClick={onClose} className="flex min-h-[44px] items-center font-medium text-navy">
                {u.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <CountrySelector tone="light" />
          <LanguageSelector tone="light" />
          <LinkedInLink tone="dark" />
        </div>
      </nav>
    </div>
  )
}

/* ---------------- Light / dark mode ---------------- */
export function ThemeToggle({ className }: { className?: string }) {
  const { m } = useI18n()
  const [theme, setThemeState] = useState<Theme>(currentTheme)
  useEffect(() => {
    const on = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail)
    window.addEventListener('wb-theme', on)
    return () => window.removeEventListener('wb-theme', on)
  }, [])
  const dark = theme === 'dark'
  const label = dark ? m.header.themeToLight : m.header.themeToDark
  return (
    <button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={label} title={label} className={cn('flex h-11 w-11 items-center justify-center rounded text-white hover:bg-white/10', className)}>
      {dark ? <Sun {...ICON} className="h-[20px] w-[20px]" aria-hidden /> : <Moon {...ICON} className="h-[20px] w-[20px]" aria-hidden />}
    </button>
  )
}

/* ---------------- Header ---------------- */

function RegionNotice() {
  const { m, region } = useI18n()
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => setDismissed(false), [region.code])
  if (region.served || dismissed) return null
  return (
    <div role="status" className="border-b border-amber-300 bg-amber-100 text-sm text-amber-900">
      <div className="container-page flex items-start justify-between gap-4 py-2.5">
        <p>
          {m.regions.intNotice}{' '}
          <Link to={to.contact({ type: 'general' })} className="font-semibold underline underline-offset-2">
            {m.regions.intNoticeLink}
          </Link>
        </p>
        <button type="button" onClick={() => setDismissed(true)} aria-label={m.regions.dismiss} className="-me-1 rounded p-1 hover:bg-amber-300/50">
          <X {...ICON} className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

export function Header() {
  const { m } = useI18n()
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [searching, setSearching] = useState(false)
  useEffect(() => {
    setMenu(false)
    setSearching(false)
  }, [pathname])
  useEffect(() => {
    const mq = matchMedia('(min-width: 1280px)')
    const f = () => mq.matches && setMenu(false)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  const closeMenu = useCallback(() => setMenu(false), [])
  const closeSearch = useCallback(() => setSearching(false), [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy text-white shadow-lift">
        {/* Desktop: two-tier header */}
        <div className="container-page relative hidden h-[112px] items-stretch xl:flex">
          <div className="flex items-center gap-6 pe-8">
            <Link to="/" aria-label={m.header.homeLink} className="block">
              <Logo variant="reversed" className="h-[76px] w-auto" />
            </Link>
            <span aria-hidden className="h-12 w-px bg-white/20" />
            <CountrySelector size="lg" />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex h-14 items-center justify-end gap-1">
              <nav aria-label={m.header.utilityNav}>
                <ul className="flex items-center">
                  {utilityNav(m).map((u) => (
                    <li key={u.id}>
                      <NavLink to={u.to} className={({ isActive: a }) => cn('rounded px-3 py-1.5 text-[15px] text-white/90 transition-colors hover:bg-white/10 hover:text-white', a && 'font-semibold text-signal')}>
                        {u.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <LanguageSelector align="right" />
              <ThemeToggle />
              <LinkedInLink className="ms-1" />
              <div className="ms-2">
                <SearchBox variant="header" />
              </div>
            </div>
            <MainNav />
          </div>
        </div>

        {/* Mobile and tablet: compact header */}
        <div className="container-page flex h-16 items-center justify-between gap-2 xl:hidden">
          <Link to="/" aria-label={m.header.homeLink} className="block shrink-0">
            <Logo variant="reversed" className="h-11 w-auto" />
          </Link>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setSearching(true)} className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/10" aria-label={m.search.open}>
              <Search {...ICON} className="h-[22px] w-[22px]" aria-hidden />
            </button>
            <LanguageSelector compact align="right" />
            <ThemeToggle />
            <button type="button" onClick={() => setMenu((x) => !x)} aria-expanded={menu} aria-controls="mobile-menu" className="flex h-11 w-11 items-center justify-center rounded hover:bg-white/10" aria-label={menu ? m.header.closeMenu : m.header.openMenu}>
              {menu ? <X {...ICON} className="h-6 w-6" aria-hidden /> : <Menu {...ICON} className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>
        <div className="thermal-strip" aria-hidden />
      </header>
      <RegionNotice />
      {menu && <MobileMenu onClose={closeMenu} />}
      {searching && <SearchDialog onClose={closeSearch} />}
    </>
  )
}
