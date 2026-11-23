/** Careers, resources and legal page ids. */
export interface Job { id: string; location: string; type: string }
/** No vacancies have been supplied. Add jobs here (with matching copy under `careers.jobs` in the locale file). */
export const JOBS: Job[] = []

export type ResourceId = 'documentation' | 'datasheets' | 'insights' | 'articles'
export const RESOURCES: ResourceId[] = ['documentation', 'datasheets', 'insights', 'articles']

export type LegalId =
  | 'privacy'
  | 'cookies'
  | 'terms'
  | 'imprint'
  | 'accessibility'
  | 'communication-preferences'
  | 'resource-availability'
  | 'do-not-sell'
  | 'governance'
  | 'machine-readable-files'
  | 'copyright'

/** The ten mandatory footer links, in order. */
export const FOOTER_LEGAL: LegalId[] = [
  'privacy',
  'cookies',
  'terms',
  'imprint',
  'accessibility',
  'communication-preferences',
  'resource-availability',
  'do-not-sell',
  'governance',
  'machine-readable-files',
]
export const LEGAL_IDS: LegalId[] = [...FOOTER_LEGAL, 'copyright']
