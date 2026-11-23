import type { ServiceId, SolutionId } from './catalog'
import type { ModelKey } from '@/three/models/registry'

/** Industries and applications published on the v9 W&B site, with their product links. Words live in the locale files. */
export interface Industry {
  id: string
  image: string
  products: string[]
  solutions: SolutionId[]
  services: ServiceId[]
  featured?: boolean
  model?: ModelKey
}

export const INDUSTRIES: Industry[] = [
  { id: 'metals', image: 'photo-metals', products: ['ir-metal', 'ir-temperature', 'ir-calibration-sources', 'digital-displays'], solutions: ['infrared-thermometry', 'displays', 'calibration-testing'], services: ['application-support', 'calibration'], featured: true, model: 'pyrometer' },
  { id: 'glass', image: 'photo-glass', products: ['ir-glass', 'ir-temperature', 'ir-calibration-sources'], solutions: ['infrared-thermometry', 'calibration-testing'], services: ['application-support', 'calibration'], model: 'pyrometer' },
  { id: 'food', image: 'ir-non-metal', products: ['ir-non-metal', 'humidity-measurement', 'water-analysis', 'data-logging'], solutions: ['temperature-measurement', 'infrared-thermometry'], services: ['selection', 'calibration'], featured: true, model: 'handheld-humidity' },
  { id: 'hvac', image: 'air-velocity-measurement', products: ['air-velocity-measurement', 'humidity-measurement', 'microclimate', 'acoustical-measurement', 'data-logging'], solutions: ['environmental-monitoring', 'temperature-measurement'], services: ['selection', 'calibration'], featured: true, model: 'handheld-air' },
  { id: 'research', image: 'calibration-lab', products: ['ir-calibration-sources', 'data-logging', 'light-measurement', 'water-analysis', 'ir-temperature'], solutions: ['calibration-testing', 'infrared-thermometry'], services: ['application-support', 'calibration'], featured: true, model: 'blackbody' },
  { id: 'process', image: 'digital-displays', products: ['digital-displays', 'loop-powered-displays', 'ir-non-metal'], solutions: ['displays', 'signal-conditioning'], services: ['selection', 'customisation'], featured: true, model: 'panel-meter' },
  { id: 'laser-processing', image: 'ir-high-speed', products: ['ir-high-speed', 'ir-controllers', 'ir-calibration-sources'], solutions: ['infrared-thermometry'], services: ['application-support'] },
  { id: 'water', image: 'water-analysis', products: ['water-analysis', 'data-logging'], solutions: [], services: ['selection', 'calibration'], featured: true, model: 'handheld-water' },
  { id: 'environment', image: 'photo-weather', products: ['meteorological', 'acoustical-measurement', 'light-measurement'], solutions: ['environmental-monitoring'], services: ['selection'], model: 'handheld-light' },
  { id: 'ohs', image: 'microclimate', products: ['acoustical-measurement', 'microclimate'], solutions: ['environmental-monitoring'], services: ['selection', 'calibration'], model: 'handheld-sound' },
]

export const industryById = (id: string) => INDUSTRIES.find((i) => i.id === id)
