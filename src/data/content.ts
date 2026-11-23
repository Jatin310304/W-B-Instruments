import { COMPANY as C } from './company'

/** Site copy carried over from the v9 site. */
export const ABOUT = {
  lead: `For ${C.years} years W&B Instruments has supplied the Australian market with the world's best quality portable and process instrumentation from some of the world's leading suppliers.`,
  expertise: `With over ${C.combinedYears} years of combined technical expertise, our highly qualified staff offer solutions for the most complex and demanding measurement applications, from mineral and metals processing and food manufacturing to HVAC and R&D.`,
  customers: `Our customers range from many of Australia's largest public companies, universities and the CSIRO to the smallest manufacturers.`,
}

export type Stat =
  | { value: number; suffix: string; unit: string; label: string }
  | { text: string; label: string }

export const STATS: Stat[] = [
  { value: C.years, suffix: '', unit: 'years', label: 'Supplying the Australian market' },
  { value: C.combinedYears, suffix: '+', unit: 'years', label: 'Combined technical expertise' },
  { text: 'ISO 9001:2015', label: `Certified quality management · ${C.iso.certificate}` },
  { value: C.dispatchHours, suffix: '', unit: 'hours', label: 'Dispatch on ex-stock items' },
]

export const ADVANTAGES = [
  { n: '01', h: 'Technical expertise', p: `Over ${C.combinedYears} years of combined technical expertise. Our staff help with complex and demanding measurement applications, from choosing the right sensor to setting it up.`, image: 'macro' },
  { n: '02', h: 'Quality assurance', p: 'W&B Instruments and our partner companies are all certified to the ISO 9001:2015 quality management standard.', image: 'compare' },
  { n: '03', h: 'Pre-delivery testing', p: "100% pre-delivery testing and a calibration check to the manufacturer's specifications, so you can use your instrument immediately with full confidence.", image: 'calibration-lab' },
  { n: '04', h: 'Fast dispatch', p: `We guarantee dispatch within ${C.dispatchHours} hours of receiving your order for ex-stock items.`, image: 'hero' },
  { n: '05', h: 'Calibration services', p: 'In-house calibration with traceability for our partner products and many other brands. Traceable calibration certificates are included as standard where applicable.', image: 'calibration-lab' },
  { n: '06', h: 'Product customisation', p: 'Many products can be customised for specific applications.', image: 'pipes' },
]

export const PROCESS = [
  { n: '01', h: 'Selection', p: `Not sure what you need? Our staff have over ${C.combinedYears} years of combined experience and will help you choose the right instrument for the job.` },
  { n: '02', h: 'Testing', p: 'Every instrument is tested in our Kilsyth workshop before it leaves.' },
  { n: '03', h: 'Calibration', p: "We check each instrument against the manufacturer's specifications. Where applicable, a traceable calibration certificate is included as standard." },
  { n: '04', h: 'Customisation', p: 'Many products can be adapted to suit how and where you will use them.' },
  { n: '05', h: 'Dispatch', p: `Ex-stock items are dispatched within ${C.dispatchHours} hours of your order.` },
]

export interface Service {
  id: string
  kicker: string
  h: string
  image: string
  alt: string
  p: string
  points: string[]
  cta: { label: string; to: string }
}

export const SERVICES: Service[] = [
  {
    id: 'selection',
    kicker: 'Advice',
    h: 'Instrumentation selection assistance',
    image: 'products-collage',
    alt: '',
    p: `Tell us what you need to measure. Our technical staff, with over ${C.combinedYears} years of combined expertise, help you choose the right instrument from the ranges of the world's leading manufacturers we represent.`,
    points: [
      'Sixteen product ranges across four measurement disciplines',
      'Products from Senseca, Sensortherm, Status Instruments and Giussani',
      'Include product codes for quicker order processing',
    ],
    cta: { label: 'Ask for advice', to: '/contact?interest=selection' },
  },
  {
    id: 'application-support',
    kicker: 'Application support',
    h: 'Technical application support',
    image: 'pipes',
    alt: 'Studio render of a pressure gauge on process pipework',
    p: 'Our highly qualified staff offer solutions for the most complex and demanding measurement applications, from mineral and metals processing and food manufacturing to HVAC and R&D.',
    points: [
      'Support for complex and demanding measurement applications',
      'From choosing the sensor to setting it up',
      'We guarantee a response to your enquiry within 24 hours',
    ],
    cta: { label: 'Discuss your application', to: '/contact?interest=application-support' },
  },
  {
    id: 'calibration',
    kicker: 'Calibration',
    h: 'Calibration services',
    image: 'calibration-lab',
    alt: 'Technician checking a reference meter during calibration',
    p: 'A fast and economical service for traceable calibrations for temperature, pressure and humidity, including non-contact infrared pyrometers and thermal imaging up to 1700 °C, using N.A.T.A. and National Measurement Institute calibrated instruments.',
    points: [
      'N.A.T.A.-equivalent calibration (via Mutual Recognition Agreements) for air velocity, acoustic and light measurements',
      'Our partner products and many other brands, with traceability',
      'In our Kilsyth workshop, or ask about on-site calibration',
    ],
    cta: { label: 'Book a calibration', to: '/contact?interest=calibration' },
  },
  {
    id: 'customisation',
    kicker: 'Customisation',
    h: 'Product customisation',
    image: 'macro',
    alt: 'Studio render: close-up of an instrument dial',
    p: 'Many products can be customised for specific applications, so the instrument suits how and where you will use it.',
    points: ['Configured to your application', 'Tested and checked before dispatch like every instrument we supply'],
    cta: { label: 'Ask about customisation', to: '/contact?interest=customisation' },
  },
  {
    id: 'pre-delivery',
    kicker: 'Inspection',
    h: 'Pre-delivery testing and checks',
    image: 'compare',
    alt: 'Studio render of two gauges side by side on a manifold, as in a comparison check',
    p: "We carry out 100% pre-delivery testing and a calibration check to the manufacturer's specifications, so you can use your instrument immediately with full confidence.",
    points: [
      'Every instrument tested in our Kilsyth workshop before it leaves',
      'Traceable calibration certificates included as standard where applicable',
      `Ex-stock items dispatched within ${C.dispatchHours} hours`,
    ],
    cta: { label: 'Request a quote', to: '/contact?interest=quote' },
  },
]

export const CALIBRATION = {
  scope: SERVICES[2].p,
  mra: 'We can also offer N.A.T.A.-equivalent calibration (via Mutual Recognition Agreements) for air velocity, acoustic and light measurements.',
  equipment: 'Dry block calibrators and baths (Giussani), blackbody infrared calibration furnaces and the HD31 Multifunction Logger (Delta OHM).',
  brands: 'Our own partner products and many other brands, with traceability.',
  where: 'Send your instruments to us in Kilsyth, or ask about on-site calibration.',
}

export const QUALITY = [
  { h: 'ISO 9001:2015 certified', p: `W&B Instruments and our partner companies are all certified to the ISO 9001:2015 quality management standard (certificate ${C.iso.certificate}).` },
  { h: '100% pre-delivery testing', p: 'Every instrument is tested before it is dispatched.' },
  { h: 'Calibration check', p: "Each instrument is checked against the manufacturer's specifications before delivery." },
  { h: 'Traceable certificates', p: 'Traceable calibration certificates are included as standard where applicable.' },
  { h: 'In-house calibration', p: 'Calibration with traceability, using N.A.T.A. and National Measurement Institute calibrated instruments.' },
]

export const GLOSSARY = [
  { t: 'Calibration', d: "Checking an instrument against a more accurate reference to make sure its readings are right, and adjusting it if needed." },
  { t: 'Traceable', d: 'The reference we check against has itself been checked, in an unbroken chain, back to national measurement standards.' },
  { t: 'N.A.T.A.', d: 'The National Association of Testing Authorities, which accredits testing and calibration laboratories in Australia.' },
  { t: 'National Measurement Institute', d: "The Australian Government agency that maintains Australia's national measurement standards." },
  { t: 'Pyrometer', d: 'An infrared thermometer: it reads temperature from a distance without touching the object.' },
]

export const FEATURED_INDUSTRIES = [
  { id: 'metals', name: 'Mineral and metals processing', text: 'Non-contact infrared pyrometers for metal that is too hot, moving or hard to reach: forging, rolling, heat treatment and induction hardening.' },
  { id: 'food', name: 'Food manufacturing', text: 'Temperature during processing, humidity in storage, cold-chain data logging and water quality in food and beverage production.' },
  { id: 'hvac', name: 'HVAC', text: 'Air velocity, humidity, comfort and sound measurement for commissioning and balancing ventilation, fume cupboards and clean rooms.' },
  { id: 'research', name: 'Research and development', text: 'Calibration sources, data logging, light and water measurement for laboratories, universities and research organisations.' },
]

export const CUSTOMERS = ['Major public companies', 'Universities', 'CSIRO', 'Small manufacturers']

export interface Application {
  id: string
  name: string
  products: string[]
  text: string
}

export const APPLICATIONS: Application[] = [
  { id: 'metals', name: 'Metals processing', products: ['ir-metal', 'ir-temperature'], text: 'Measuring the temperature of metal that is too hot, moving or hard to reach: forging, rolling, heat treatment, induction heating and hardening.' },
  { id: 'glass', name: 'Glass & cement', products: ['ir-glass', 'ir-temperature'], text: 'Infrared thermometers tuned to read glass surfaces and molten glass: glass forming, float glass and container glass, plus cement.' },
  { id: 'laser-processing', name: 'Laser processing & additive manufacturing', products: ['ir-high-speed', 'ir-controllers'], text: 'High-speed pyrometers that measure the melt temperature and control the laser power in real time: additive manufacturing, laser cladding, hardening, soldering and plastic welding.' },
  { id: 'food', name: 'Food & beverage', products: ['ir-non-metal', 'humidity-measurement', 'water-analysis', 'data-logging'], text: 'Temperature during food processing, humidity in storage, cold-chain data logging, and water quality in food and drink production.' },
  { id: 'hvac', name: 'HVAC & buildings', products: ['air-velocity-measurement', 'humidity-measurement', 'microclimate', 'acoustical-measurement', 'data-logging'], text: 'Commissioning heating, ventilation and air conditioning, fume cupboards and clean rooms, noise and comfort in buildings, and recording conditions across a building.' },
  { id: 'water', name: 'Water treatment', products: ['water-analysis'], text: 'Portable, benchtop and process instruments for pH, conductivity and dissolved oxygen.' },
  { id: 'research', name: 'Laboratories & research', products: ['ir-calibration-sources', 'data-logging', 'light-measurement', 'water-analysis', 'ir-temperature'], text: 'Calibration laboratories and pyrometer verification, recording lab measurements, and research.' },
  { id: 'environment', name: 'Environment & agriculture', products: ['meteorological', 'acoustical-measurement', 'light-measurement'], text: 'Weather stations for agriculture and solar sites, environmental noise monitoring and solar radiation.' },
  { id: 'ohs', name: 'Occupational hygiene', products: ['acoustical-measurement', 'microclimate'], text: 'Workplace noise, and heat stress on workers measured with WBGT globe thermometers, indoors and outdoors.' },
  { id: 'process', name: 'Process plant', products: ['digital-displays', 'loop-powered-displays', 'ir-non-metal'], text: 'Displays for control panels and field instruments, plus temperature measurement on plastics, paper and coatings lines.' },
]

export const INTERESTS = [
  { value: 'quote', label: 'Product quotation' },
  { value: 'selection', label: 'Instrument selection advice' },
  { value: 'application-support', label: 'Technical application support' },
  { value: 'calibration', label: 'Calibration service' },
  { value: 'customisation', label: 'Product customisation' },
  { value: 'other', label: 'Something else' },
]

export const ABOUT_PILLARS = [
  { h: 'Quality', p: 'W&B Instruments and our partner companies are all certified to the ISO 9001:2015 quality management standard.' },
  { h: 'Ex-stock delivery', p: `We guarantee dispatch within ${C.dispatchHours} hours of receiving your order.` },
  { h: 'Tested before delivery', p: "We carry out 100% pre-delivery testing and a calibration check to the manufacturer's specifications, so you can use your instrument immediately with full confidence. Traceable calibration certificates are included as standard where applicable." },
  { h: 'Calibration and customisation', p: 'We offer in-house calibration with traceability for our partner products and many other brands, and many products can be customised for specific applications.' },
]

export const HERO_ROTATOR = ['metals & glass', 'food & beverage', 'HVAC & buildings', 'laboratories']

export const MEASURANDS = ['Temperature', 'Pressure', 'Humidity', 'Air velocity', 'Sound', 'Light', 'pH & conductivity', 'Dissolved oxygen', 'Infrared', 'Calibration']

export const SEARCH_SUGGESTIONS = ['Pyrometer', 'Humidity', 'Calibration', 'Data logger', 'pH', '4–20 mA']
