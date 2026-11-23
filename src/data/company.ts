/** Company facts. Every value here comes from the existing W&B website (v9); do not add claims W&B has not published.
 *  Address and domain confirmed against wandbinstruments.com.au (3 Nov 2026). The brand book's stationery sample uses dummy details. */
export const COMPANY = {
  brand: 'W&B Instruments',
  legalName: 'W & B Instruments Pty Ltd',
  acn: '005 982 856',
  tagline: 'Leading supplier of portable and process instrumentation',
  address: {
    street: '20 Shelley Ave',
    locality: 'Kilsyth',
    region: 'VIC',
    postcode: '3137',
    country: 'Australia',
  },
  addressLine: '20 Shelley Ave, Kilsyth VIC 3137, Australia',
  phone: '+61 3 9729 2112',
  fax: '+61 3 9720 0617',
  email: 'sales@wandbinstruments.com',
  /** As published on the current site. Conflicts with the 2019 news post (39th year in May 2019): W&B to confirm the founding year. */
  years: 38,
  combinedYears: 75,
  dispatchHours: 24,
  responseHours: 24,
  iso: { standard: 'ISO 9001:2015', certificate: 'FS604761' },
  /** Link to the certificate PDF once W&B supplies it. */
  isoCertificateUrl: 'https://www.wandbinstruments.com.au/s/ISO9001-CERT.pdf',
  /** Supplied by Metaval on 4 Nov 2026. Shown as a clickable LinkedIn logo in the header and footer, and in Organization schema (sameAs). */
  social: { LinkedIn: 'https://www.linkedin.com/company/wb-instruments/' } as Record<string, string>,
  linkedin: 'https://www.linkedin.com/company/wb-instruments/',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=20+Shelley+Ave+Kilsyth+VIC+3137',
  siteUrl: 'https://www.wandbinstruments.com.au',
}

export const telHref = (phone: string) => 'tel:' + phone.replace(/[^\d+]/g, '')

/** Legal page values W&B still has to confirm. Empty strings render as "To be confirmed" markers. */
export const LEGAL = {
  effectiveDate: '',
  privacyContact: '',
  privacyEmail: '',
  retention: '',
  hosting: '',
  emailService: '',
  overseas: '',
  privacyActConfirmed: false,
  contentOwnershipConfirmed: false,
  termsAvailable: false,
}

/** Year the copyright line is generated for. */
export const currentYear = () => new Date().getFullYear()

/** Website credit shown at the very bottom of the footer. */
export const DESIGNER = { name: 'JSR', linkedin: 'https://www.linkedin.com/in/jatin-singh-rajawat-jsr-b835a627b/' }
