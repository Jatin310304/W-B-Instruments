/**
 * Our Businesses: Forging, Casting, Flow and Valves.
 * Every fact in the locale files under `businesses` comes from Metaval Engineering's own pages, read on 3 November 2026.
 * Each division is shown with a product image from Metaval's own website (v13).
 */
export type BusinessId = 'forging' | 'casting' | 'flow' | 'valves'

export interface Business {
  id: BusinessId
  /** Product image from the division's page on Metaval's website (src/assets/img). */
  image: string
  source: string
  related: BusinessId[]
}

export const METAVAL_URL = 'https://metaval.com/'

export const BUSINESSES: Business[] = [
  { id: 'forging', image: 'business-forging', source: 'https://metaval.com/forging/', related: ['valves', 'casting'] },
  { id: 'casting', image: 'business-casting', source: 'https://metavalalloys.com/', related: ['forging', 'valves'] },
  { id: 'flow', image: 'business-flow', source: 'https://metaval.com/flow-measurement/', related: ['valves', 'forging'] },
  { id: 'valves', image: 'business-valves', source: 'https://metaval.com/valve/', related: ['flow', 'forging', 'casting'] },
]

export const businessById = (id: string) => BUSINESSES.find((b) => b.id === id)
