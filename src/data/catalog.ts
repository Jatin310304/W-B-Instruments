import type { ModelKey } from '@/three/models/registry'

/**
 * Product structure. Every range, brand and relationship below comes from the existing W&B website (v9 audit).
 * Words (names, descriptions) live in the locale files under `products`, `categories`, `brands` and `solutions`,
 * so this file holds only ids, images, links and relationships.
 */
export type CategoryId = 'environmental' | 'infrared' | 'displays' | 'water' | 'calibration'
export type BrandId = 'senseca' | 'sensortherm' | 'status' | 'giussani'
export type SolutionId =
  | 'temperature-measurement'
  | 'rtd-temperature-sensors'
  | 'infrared-thermometry'
  | 'displays'
  | 'signal-conditioning'
  | 'calibration-testing'
  | 'environmental-monitoring'
  | 'measurement-accessories'

export interface Brand {
  id: BrandId
  name: string
  logo: string
  url: string
}

export interface Product {
  id: string
  cat: CategoryId
  brand: BrandId
  /** Product photo key. Omitted where no image has been supplied; a neutral placeholder tile is shown. */
  image?: string
  /** Manufacturer page, as linked from wandbinstruments.com.au/products. */
  url?: string
  /** Verified specifications as [label, value] rows. None are published yet. */
  specs?: [string, string][]
  /** Verified datasheets. None are published yet. */
  downloads?: { label: string; url: string }[]
  related: string[]
  solutions: SolutionId[]
  /** Conceptual 3D illustration shown in the hero. Left out where no fair representation exists. */
  model?: ModelKey
}

/** A brand range line (an item in the manufacturer's range as published on the v9 site), by index into the locale's `brands[id].range`. */
export interface RangeRef { brand: BrandId; index: number }

export interface Solution {
  id: SolutionId
  image: string
  /** verified: every item shown is a published W&B range. partial: some of it is still to be confirmed. pending: W&B has not published this range yet. */
  status: 'verified' | 'partial' | 'pending'
  products: string[]
  ranges: RangeRef[]
  services: ServiceId[]
  next: SolutionId[]
  model?: ModelKey
}

export type ServiceId = 'selection' | 'application-support' | 'calibration' | 'customisation' | 'pre-delivery'

export const CATEGORIES: { id: CategoryId; image: string }[] = [
  { id: 'infrared', image: 'ir-temperature' },
  { id: 'displays', image: 'loop-powered-displays' },
  { id: 'environmental', image: 'air-velocity-measurement' },
  { id: 'water', image: 'water-analysis' },
  { id: 'calibration', image: 'calibration-lab' },
]

export const BRANDS: Brand[] = [
  { id: 'sensortherm', name: 'Sensortherm', logo: 'sensortherm', url: 'https://www.sensortherm.de/en/' },
  { id: 'status', name: 'Status Instruments', logo: 'status', url: 'https://www.status.co.uk' },
  { id: 'senseca', name: 'Senseca (Delta OHM)', logo: 'senseca', url: 'https://www.senseca.com' },
  { id: 'giussani', name: 'Giussani', logo: 'giussani', url: 'https://www.giussanionline.com' },
]

export const PRODUCTS: Product[] = [
  { id: 'ir-temperature', url: 'https://www.sensortherm.de/en/pyrometer/', cat: 'infrared', brand: 'sensortherm', image: 'ir-temperature', related: ['ir-metal', 'ir-glass', 'ir-non-metal', 'ir-calibration-sources', 'digital-displays'], solutions: ['temperature-measurement', 'infrared-thermometry'], model: 'pyrometer' },
  { id: 'ir-metal', url: 'https://www.sensortherm.de/en/2-color-pyrometer/', cat: 'infrared', brand: 'sensortherm', image: 'ir-metal', related: ['ir-temperature', 'ir-calibration-sources', 'digital-displays'], solutions: ['temperature-measurement', 'infrared-thermometry'], model: 'pyrometer' },
  { id: 'ir-glass', url: 'https://www.sensortherm.de/en/applications/', cat: 'infrared', brand: 'sensortherm', image: 'ir-glass', related: ['ir-temperature', 'ir-calibration-sources', 'digital-displays'], solutions: ['temperature-measurement', 'infrared-thermometry'], model: 'pyrometer' },
  { id: 'ir-non-metal', url: 'https://www.sensortherm.de/en/pyrometer/', cat: 'infrared', brand: 'sensortherm', image: 'ir-non-metal', related: ['ir-temperature', 'ir-calibration-sources', 'digital-displays'], solutions: ['temperature-measurement', 'infrared-thermometry'], model: 'pyrometer' },
  { id: 'ir-high-speed', url: 'https://www.sensortherm.de/en/highspeed-pyrometer/', cat: 'infrared', brand: 'sensortherm', image: 'ir-high-speed', related: ['ir-temperature', 'ir-calibration-sources'], solutions: ['temperature-measurement', 'infrared-thermometry'] },
  { id: 'ir-calibration-sources', url: 'https://www.sensortherm.de/en/calibration-sources-transfer-standard-pyrometers/', cat: 'infrared', brand: 'sensortherm', image: 'ir-calibration-sources', related: ['ir-temperature', 'ir-metal', 'ir-glass'], solutions: ['infrared-thermometry', 'calibration-testing'], model: 'blackbody' },
  { id: 'digital-displays', url: 'https://www.status.co.uk/panel-field-indicators/', cat: 'displays', brand: 'status', image: 'digital-displays', related: ['loop-powered-displays', 'ir-temperature', 'ir-non-metal'], solutions: ['displays', 'signal-conditioning'], model: 'panel-meter' },
  { id: 'loop-powered-displays', url: 'https://www.status.co.uk/loop-powered-indicators/', cat: 'displays', brand: 'status', image: 'loop-powered-displays', related: ['digital-displays', 'ir-temperature'], solutions: ['displays', 'signal-conditioning'], model: 'loop-indicator' },
  { id: 'humidity-measurement', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/humidity', cat: 'environmental', brand: 'senseca', image: 'humidity-measurement', related: ['data-logging', 'microclimate', 'air-velocity-measurement'], solutions: ['temperature-measurement', 'rtd-temperature-sensors', 'environmental-monitoring'], model: 'handheld-humidity' },
  { id: 'data-logging', cat: 'environmental', brand: 'senseca', image: 'data-logging', url: 'https://www.senseca.com/en/products/environmental-monitoring/data-acquisition-system/datalogger', related: ['humidity-measurement', 'meteorological', 'water-analysis'], solutions: ['temperature-measurement', 'rtd-temperature-sensors', 'environmental-monitoring'] },
  { id: 'air-velocity-measurement', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/air-speed-flow', cat: 'environmental', brand: 'senseca', image: 'air-velocity-measurement', related: ['humidity-measurement', 'microclimate', 'acoustical-measurement'], solutions: ['environmental-monitoring'], model: 'handheld-air' },
  { id: 'acoustical-measurement', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/acoustics', cat: 'environmental', brand: 'senseca', image: 'acoustical-measurement', related: ['microclimate', 'light-measurement', 'air-velocity-measurement'], solutions: ['environmental-monitoring'], model: 'handheld-sound' },
  { id: 'light-measurement', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/light-radiation', cat: 'environmental', brand: 'senseca', image: 'light-measurement', related: ['meteorological', 'acoustical-measurement'], solutions: ['environmental-monitoring'], model: 'handheld-light' },
  { id: 'meteorological', url: 'https://www.senseca.com/en/products/environmental-monitoring/meteorological-instruments', cat: 'environmental', brand: 'senseca', image: 'meteorological', related: ['light-measurement', 'data-logging', 'microclimate'], solutions: ['environmental-monitoring'] },
  { id: 'microclimate', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/thermal-comfort-iaq', cat: 'environmental', brand: 'senseca', image: 'microclimate', related: ['humidity-measurement', 'air-velocity-measurement', 'acoustical-measurement'], solutions: ['environmental-monitoring'] },
  { id: 'water-analysis', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/water-analysis', cat: 'water', brand: 'senseca', image: 'water-analysis', related: ['data-logging'], solutions: [], model: 'handheld-water' },
  { id: 'ir-scanners', url: 'https://www.sensortherm.de/en/product/galaxy-scanner-sc7-sc8/', cat: 'infrared', brand: 'sensortherm', image: 'ir-scanners', related: ['ir-temperature', 'ir-metal', 'ir-calibration-sources'], solutions: ['temperature-measurement', 'infrared-thermometry'] },
  { id: 'ir-controllers', url: 'https://www.sensortherm.de/en/system-components/', cat: 'infrared', brand: 'sensortherm', image: 'ir-controllers', related: ['ir-temperature', 'ir-high-speed', 'digital-displays'], solutions: ['infrared-thermometry'] },
  { id: 'temperature-transmitters', url: 'https://www.status.co.uk/temperature-transmitters/', cat: 'displays', brand: 'status', image: 'temperature-transmitters', related: ['signal-conditioners', 'digital-displays', 'loop-powered-displays'], solutions: ['rtd-temperature-sensors', 'signal-conditioning', 'temperature-measurement'] },
  { id: 'signal-conditioners', url: 'https://www.status.co.uk/signal-conditioners/', cat: 'displays', brand: 'status', image: 'signal-conditioners', related: ['temperature-transmitters', 'digital-displays', 'loop-powered-displays'], solutions: ['signal-conditioning'] },
  { id: 'temperature-gauges', url: 'https://www.status.co.uk/temperature-gauges/', cat: 'displays', brand: 'status', image: 'temperature-gauges', related: ['temperature-transmitters', 'handheld-thermometers'], solutions: ['rtd-temperature-sensors', 'temperature-measurement'] },
  { id: 'handheld-thermometers', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/temperature', cat: 'environmental', brand: 'senseca', image: 'handheld-thermometers', related: ['humidity-measurement', 'data-logging', 'dry-block-calibrators'], solutions: ['rtd-temperature-sensors', 'temperature-measurement'] },
  { id: 'pressure-measurement', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/pressure', cat: 'environmental', brand: 'senseca', image: 'pressure-measurement', related: ['data-logging', 'air-velocity-measurement'], solutions: ['environmental-monitoring'] },
  { id: 'thermal-comfort', url: 'https://www.senseca.com/en/products/portable-measurement/measuring-devices/thermal-comfort-iaq', cat: 'environmental', brand: 'senseca', image: 'thermal-comfort', related: ['microclimate', 'humidity-measurement'], solutions: ['environmental-monitoring'] },
  { id: 'dry-block-calibrators', url: 'https://www.giussanionline.com/en/products/temperature-calibrators/thermostatic-calibrators', cat: 'calibration', brand: 'giussani', image: 'dry-block-calibrators', related: ['ir-calibration-sources', 'handheld-thermometers', 'temperature-transmitters'], solutions: ['calibration-testing', 'temperature-measurement'], model: 'dry-block' },
]

const r = (brand: BrandId, ...idx: number[]): RangeRef[] => idx.map((index) => ({ brand, index }))

/** Products & Services groups shown in the main navigation. Ranges index into each brand's published range list. */
export const SOLUTIONS: Solution[] = [
  {
    id: 'temperature-measurement',
    model: 'pyrometer',
    image: 'ir-temperature',
    status: 'partial',
    products: ['ir-temperature', 'ir-scanners', 'temperature-transmitters', 'temperature-gauges', 'handheld-thermometers', 'humidity-measurement', 'data-logging', 'dry-block-calibrators'],
    ranges: [...r('status', 4), ...r('giussani', 0)],
    services: ['selection', 'calibration'],
    next: ['displays', 'signal-conditioning', 'calibration-testing'],
  },
  {
    id: 'rtd-temperature-sensors',
    image: 'humidity-measurement',
    status: 'partial',
    products: ['temperature-transmitters', 'handheld-thermometers', 'temperature-gauges', 'humidity-measurement', 'data-logging'],
    ranges: [...r('status', 4), ...r('senseca', 0)],
    services: ['selection', 'calibration'],
    next: ['displays', 'signal-conditioning', 'calibration-testing'],
  },
  {
    id: 'infrared-thermometry',
    model: 'pyrometer',
    image: 'ir-metal',
    status: 'verified',
    products: ['ir-temperature', 'ir-metal', 'ir-glass', 'ir-non-metal', 'ir-high-speed', 'ir-scanners', 'ir-controllers', 'ir-calibration-sources'],
    ranges: r('sensortherm', 0, 1, 2, 3, 4),
    services: ['application-support', 'calibration'],
    next: ['displays', 'calibration-testing'],
  },
  {
    id: 'displays',
    model: 'panel-meter',
    image: 'digital-displays',
    status: 'verified',
    products: ['digital-displays', 'loop-powered-displays', 'temperature-gauges'],
    ranges: r('status', 2, 5),
    services: ['selection', 'customisation'],
    next: ['signal-conditioning', 'measurement-accessories'],
  },
  {
    id: 'signal-conditioning',
    model: 'loop-indicator',
    image: 'loop-powered-displays',
    status: 'verified',
    products: ['signal-conditioners', 'temperature-transmitters', 'digital-displays', 'loop-powered-displays'],
    ranges: r('status', 1, 3, 6, 7, 8),
    services: ['selection', 'application-support'],
    next: ['displays', 'measurement-accessories'],
  },
  {
    id: 'calibration-testing',
    model: 'dry-block',
    image: 'calibration-lab',
    status: 'verified',
    products: ['dry-block-calibrators', 'ir-calibration-sources'],
    ranges: [...r('giussani', 0, 1)],
    services: ['calibration', 'pre-delivery'],
    next: ['temperature-measurement', 'infrared-thermometry'],
  },
  {
    id: 'environmental-monitoring',
    model: 'handheld-air',
    image: 'air-velocity-measurement',
    status: 'verified',
    products: ['air-velocity-measurement', 'humidity-measurement', 'acoustical-measurement', 'light-measurement', 'microclimate', 'thermal-comfort', 'meteorological', 'data-logging', 'pressure-measurement'],
    ranges: r('senseca', 0, 1, 2, 3, 4),
    services: ['selection', 'calibration'],
    next: ['calibration-testing', 'temperature-measurement'],
  },
  {
    id: 'measurement-accessories',
    image: 'digital-displays',
    status: 'pending',
    products: [],
    ranges: r('status', 7, 8),
    services: ['selection', 'customisation'],
    next: ['displays', 'signal-conditioning'],
  },
]

export const SERVICES: { id: ServiceId; image: string; interest: string }[] = [
  { id: 'calibration', image: 'calibration-lab', interest: 'calibration' },
  { id: 'application-support', image: 'pipes', interest: 'application-support' },
  { id: 'selection', image: 'macro', interest: 'selection' },
  { id: 'pre-delivery', image: 'compare', interest: 'quote' },
  { id: 'customisation', image: 'tanks', interest: 'customisation' },
]

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)
export const solutionById = (id: string) => SOLUTIONS.find((s) => s.id === id)
export const brandById = (id: BrandId) => BRANDS.find((b) => b.id === id)!
