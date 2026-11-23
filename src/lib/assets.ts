/** Every image in src/assets/img, keyed by file name without extension. */
const files = import.meta.glob<string>('../assets/img/*.{webp,jpg,png}', { eager: true, query: '?url', import: 'default' })

export const IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace(/^.*\/(.+)\.\w+$/, '$1'), url]),
)

/** Intrinsic sizes, so images reserve space before they load. */
export const DIMS: Record<string, [number, number]> = {
  'acoustical-measurement': [246, 361], sensortherm: [1000, 293], 'air-velocity-measurement': [181, 374], 'bsi-iso9001-fs604761': [156, 102],
  'calibration-lab': [480, 319], compare: [1200, 1500], 'data-logging': [180, 264], 'digital-displays': [553, 351], 'gauge-check-poster': [640, 640],
  giussani: [1000, 153], 'hero-poster': [1920, 1080], hero: [1200, 675], 'humidity-measurement': [554, 918], 'instrument-poster': [1600, 1000],
  'ir-calibration-sources': [517, 583], 'ir-glass': [776, 459], 'ir-metal': [698, 694], 'ir-non-metal': [661, 320], 'ir-high-speed': [794, 422],
  'ir-scanners': [450, 738], 'ir-controllers': [768, 409],
  'ir-temperature': [806, 737], 'light-measurement': [284, 322], 'loop-powered-displays': [323, 284], macro: [1200, 750], meteorological: [542, 918],
  microclimate: [302, 918], pipes: [1200, 750], senseca: [900, 224], status: [900, 234], tanks: [1200, 750], 'water-analysis': [485, 918],
  'photo-metals': [1200, 900], 'photo-glass': [1200, 800], 'photo-weather': [1200, 816],
  'business-forging': [1280, 800], 'business-casting': [1280, 800], 'business-flow': [1280, 800], 'business-valves': [1280, 800],
  'dry-block-calibrators': [544, 918],
  'handheld-thermometers': [476, 918],
  'pressure-measurement': [606, 918],
  'signal-conditioners': [765, 918],
  'temperature-gauges': [575, 530],
  'temperature-transmitters': [918, 739],
  'thermal-comfort': [515, 918],
  'wb-logo-reversed': [480, 362], 'wb-logo-colour': [480, 362], 'wb-monogram-reversed': [160, 77],
}

/** Computer-generated studio renders made for the earlier site; they are labelled wherever they appear. */
export const isRender = (name: string) => ['hero', 'hero-poster', 'macro', 'compare', 'pipes', 'tanks', 'instrument-poster', 'gauge-check-poster'].includes(name)
/** Manufacturer product photos: labelled "Image shows an example from the range". */
export const isProductPhoto = (name: string) => !isRender(name) && !name.startsWith('photo-') && !['calibration-lab'].includes(name) && !name.startsWith('wb-') && !['senseca', 'status', 'giussani', 'sensortherm', 'bsi-iso9001-fs604761'].includes(name)

/** Real-life photos from Wikimedia Commons (v10). Each is credited on the image and on the Copyright page, as its licence requires.
 *  They show the industry, not W&B's own work; replace with W&B photography when available. */
export const PHOTO_CREDITS: Record<string, { by: string; licence: string; licenceUrl?: string; source: string }> = {
  'photo-metals': { by: 'C Paice', licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', source: 'https://commons.wikimedia.org/wiki/File:Induction_heating_of_bar.jpg' },
  'photo-glass': { by: 'Paul Harrison', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', source: 'https://commons.wikimedia.org/wiki/File:Glass-making_Electric_Furnace_1.jpg' },
  'photo-weather': { by: 'Scott Bauer, USDA', licence: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Weather_Station_USDA.jpg' },
}
