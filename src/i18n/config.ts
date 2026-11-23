import type { DeepPartial, Messages } from './locales/en'

/**
 * Locale registry. To add an approved language:
 *   1. Create `locales/<code>.ts` exporting a `DeepPartial<Messages>` (anything left out falls back to English).
 *   2. Add it below with `status: 'approved'` and its loader.
 * Brand names, product model names and units are never translated.
 */
export interface LocaleDef {
  code: string
  /** Name of the language in itself, shown in the selector. */
  label: string
  /** BCP 47 tag used for Intl date and number formatting. */
  intl: string
  dir: 'ltr' | 'rtl'
  status: 'approved' | 'qa'
  load?: () => Promise<DeepPartial<Messages>>
}

export const DEFAULT_LOCALE = 'en-AU'

export const LOCALES: LocaleDef[] = [
  { code: 'en-AU', label: 'English', intl: 'en-AU', dir: 'ltr', status: 'approved' },
  { code: 'it', label: 'Italiano', intl: 'it-IT', dir: 'ltr', status: 'approved', load: () => import('./locales/it').then((x) => x.it) },
  { code: 'fr', label: 'Français', intl: 'fr-FR', dir: 'ltr', status: 'approved', load: () => import('./locales/fr').then((x) => x.fr) },
  { code: 'ar', label: 'العربية', intl: 'ar', dir: 'rtl', status: 'approved', load: () => import('./locales/ar').then((x) => x.ar) },
  { code: 'ja', label: '日本語', intl: 'ja-JP', dir: 'ltr', status: 'approved', load: () => import('./locales/ja').then((x) => x.ja) },
  // Pseudo-locale for translation QA: every string is transformed, so untranslatable text stands out.
  { code: 'qps', label: 'Pseudo (QA)', intl: 'en-AU', dir: 'ltr', status: 'qa' },
]

/** The pseudo-locale is listed only in development, with VITE_I18N_PSEUDO=true, or after ?lang=qps. */
export function visibleLocales(qaUnlocked: boolean) {
  return LOCALES.filter((l) => l.status === 'approved' || qaUnlocked || import.meta.env.DEV || import.meta.env.VITE_I18N_PSEUDO === 'true')
}

/** Country/region is separate from language: it decides which market notice and contact routing apply. */
export interface RegionDef {
  code: 'AU' | 'INT'
  /** Locale used for dates and numbers when the language is English. */
  intl: string
  served: boolean
}
export const DEFAULT_REGION: RegionDef['code'] = 'AU'
export const REGIONS: RegionDef[] = [
  { code: 'AU', intl: 'en-AU', served: true },
  { code: 'INT', intl: 'en-GB', served: false },
]
