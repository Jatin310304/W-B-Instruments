/**
 * English (Australia): the source language and the fallback for every other locale.
 * All visible website copy lives here, separate from components. Facts come from the existing W&B website (v9),
 * the W&B Brand Guidelines 2.0, and, for Our Businesses, Metaval Engineering's own websites.
 * `{name}` placeholders are filled at runtime. `[[TBC: ...]]` renders as a "to be confirmed" marker.
 */
const C = { years: 38, combined: 75, hours: 24 }

export const en = {
  meta: {
    siteName: 'W&B Instruments',
    titleSuffix: ' | W&B Instruments',
    homeTitle: 'Instrumentation & Calibration Australia | W&B Instruments',
    homeDescription:
      'Infrared pyrometers, process displays and environmental meters, tested and calibrated in our Kilsyth VIC workshop. ISO 9001:2015. Call +61 3 9729 2112.',
  },

  /** Page-level SEO titles and meta descriptions (Brand & Marketing Strategy v1.0, section 21). Keys are paths; titles are complete. */
  seo: {
    '/about': { title: 'About W&B Instruments | Kilsyth VIC Instrument Specialists', description: 'ISO 9001:2015 certified supplier of portable and process instrumentation, with in-house calibration and application support. Kilsyth, Victoria.' },
    '/products': { title: 'Industrial Measurement Instruments | W&B Instruments', description: "Infrared pyrometers, panel meters, transmitters, humidity, air, sound, light and water instruments from Sensortherm, Status, Senseca and Giussani." },
    '/solutions/temperature-measurement': { title: 'Temperature Measurement Instruments | W&B Instruments', description: 'Contact and non-contact temperature: pyrometers, transmitters, thermometers, loggers and calibrators, tested before dispatch.' },
    '/solutions/infrared-thermometry': { title: "Infrared Pyrometers Australia | Sensortherm | W&B", description: "Stationary and portable infrared pyrometers for metals, glass, non-metals and laser processes, with blackbody sources and calibration to 1700 °C." },
    '/solutions/calibration-testing': { title: 'Temperature & Pyrometer Calibration Melbourne | W&B', description: 'Traceable temperature, pressure and humidity calibration in Kilsyth or on site, including pyrometers and thermal imagers up to 1700 °C.' },
    '/solutions/displays': { title: 'Panel Meters & Loop Powered Indicators | W&B Instruments', description: 'Status Instruments panel meters, digital and loop-powered indicators with alarm and retransmission options.' },
    '/solutions/signal-conditioning': { title: 'Signal Conditioners & Temperature Transmitters | W&B', description: 'Status Instruments temperature transmitters, signal conditioners, trip amplifiers, loop isolators and DIN rail power supplies.' },
    '/solutions/environmental-monitoring': { title: 'Environmental Monitoring Instruments | W&B Instruments', description: 'Air velocity, humidity, sound, light, heat stress, weather and data logging instruments from Senseca (Delta OHM).' },
    '/products/humidity-measurement': { title: 'Humidity Meters & Probes | Senseca | W&B Instruments', description: 'Senseca (Delta OHM) humidity and temperature meters, probes and transmitters, with traceable humidity calibration.' },
    '/products/pressure-measurement': { title: 'Pressure Meters | Senseca | W&B Instruments', description: "Senseca (Delta OHM) pressure meters, with traceable pressure calibration from W&B's Victorian workshop." },
    '/support': { title: 'Technical & Application Support | W&B Instruments', description: 'Help choosing, setting up and calibrating your instrument. Every enquiry answered within 24 hours.' },
    '/industries': { title: 'Industries We Support | W&B Instruments', description: "Measurement for metals, glass, food, HVAC, research, process plant, laser processing, water, environment and occupational hygiene." },
    '/resources': { title: 'Technical Resources | W&B Instruments', description: 'Documentation, datasheets, technical articles and measurement guides.' },
    '/news': { title: 'News & Insights | W&B Instruments', description: "Product news, calibration tips and measurement insights from W&B's technical team." },
    '/contact': { title: 'Contact W&B Instruments | Kilsyth VIC | +61 3 9729 2112', description: 'Call +61 3 9729 2112, email or send an enquiry. We respond within 24 hours. 20 Shelley Ave, Kilsyth VIC 3137.' },
  } as Record<string, { title: string; description: string }>,

  common: {
    skip: 'Skip to main content',
    home: 'Home',
    breadcrumb: 'Breadcrumb',
    viewProduct: 'View product',
    viewProducts: 'View products',
    viewAll: 'View all',
    readMore: 'Read more',
    learnMore: 'Learn more',
    explore: 'Explore',
    enquire: 'Make an enquiry',
    contactTeam: 'Contact our team',
    studioRender: 'Studio render',
    exampleImage: 'Image shows an example from the range',
    placeholder: 'Placeholder',
    placeholderContent: 'Placeholder content',
    verified: 'Published range',
    partial: 'Partly confirmed',
    pending: 'Range to be confirmed',
    tbc: 'To be confirmed',
    opensNewTab: '(opens in a new tab)',
    onThisPage: 'On this page',
    backToTop: 'Back to top',
    close: 'Close',
    required: 'required',
    optional: 'optional',
    dateTbc: 'Date to be confirmed',
    source: 'Source',
    manufacturer: 'Manufacturer',
    category: 'Category',
    linkedin: 'W&B Instruments on LinkedIn (opens in a new tab)',
    photoCredit: 'Photo:',
  },

  header: {
    utilityNav: 'Company',
    mainNav: 'Main',
    country: 'Country or region',
    countryChange: 'Change country or region',
    language: 'Language',
    languageChange: 'Change language',
    global: 'Global',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    homeLink: 'W&B Instruments home',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
  },

  nav: {
    home: 'Home',
    industries: 'Industries',
    productsServices: 'Products & Services',
    businesses: 'Our Businesses',
    resources: 'Resources',
    support: 'Support',
    contact: 'Contact Us',
    news: 'News & Events',
    about: 'About Us',
    careers: 'Careers',
    allIndustries: 'All industries',
    allProducts: 'All products and services',
    allBusinesses: 'All businesses',
    allResources: 'All resources',
    supportHome: 'Support overview',
    industriesIntro: 'Measurement for the applications we support every day.',
    productsIntro: 'Instruments, calibration and the support to apply them.',
    businessesIntro: 'Forging, casting, flow and valves, from Metaval Engineering.',
    resourcesIntro: 'Documentation, datasheets, news and technical reading.',
    supportIntro: 'Talk to the people who know the instrument.',
    resourcesMenu: {
      documentation: 'Technical Documentation',
      datasheets: 'Product Datasheets',
      news: 'News & Events',
      insights: 'Insights',
      articles: 'Technical Articles',
    },
    supportMenu: {
      technical: 'Technical Support',
      product: 'Product Enquiries',
      application: 'Application Support',
      team: 'Contact Our Team',
    },
  },

  regions: {
    AU: 'Australia',
    INT: 'International',
    intNotice:
      'W&B Instruments is based in Kilsyth, Victoria, Australia. For enquiries from outside Australia, contact our team and we will tell you how we can help.',
    intNoticeLink: 'Contact our team',
    dismiss: 'Dismiss',
  },

  languages: {
    moreToCome: 'Brand, product and model names stay in English. Legal pages are published in English.',
    pseudoNote: 'QA only: checks that every string is translatable.',
  },

  search: {
    label: 'Search',
    placeholder: 'Search products, industries, resources',
    submit: 'Search',
    open: 'Open search',
    clear: 'Clear search',
    title: 'Search',
    resultsFor: 'Results for “{q}”',
    resultCount: '{n} results',
    resultCountOne: '1 result',
    seeAll: 'See all results for “{q}”',
    emptyTitle: 'What are you measuring?',
    emptyText: 'Search products, product groups, industries, our businesses, technical resources and news.',
    suggestions: 'Popular searches',
    suggestionList: ['Pyrometer', 'Calibration', 'Humidity', '4–20 mA', 'Valves', 'Data logger'],
    noResultsTitle: 'No results for “{q}”',
    noResultsText: 'Check the spelling or try a broader term, such as “temperature” or “calibration”. Or tell us what you need to measure and we will help.',
    types: {
      product: 'Product',
      solution: 'Products & Services',
      category: 'Product category',
      industry: 'Industry',
      business: 'Our Businesses',
      resource: 'Resource',
      news: 'News',
      page: 'Page',
    },
  },

  home: {
    hero: {
      eyebrow: 'Temperature · Pressure · Humidity',
      lead: 'Precision Measurement. Expert Instrumentation. Trusted Calibration.',
      titleA: 'Measured.',
      titleB: 'Calibrated.',
      titleC: 'Trusted.',
      text: 'Industrial measurement instruments, specialist technical expertise and dependable calibration support for industry.',
      primary: 'Book a calibration',
      secondary: 'See the range',
      imageAlt: '3D model of an infrared pyrometer',
      readingLabel: 'Calibration range, infrared',
    },
    intro: {
      eyebrow: 'W&B Instruments',
      title: 'Instruments, expertise and calibration from one Victorian team.',
      text: `For ${C.years} years W&B Instruments has supplied the Australian market with portable and process instruments from leading manufacturers. We help you choose the right instrument, test it before it leaves our Kilsyth workshop and calibrate it with traceability, so you can trust the number.`,
      supporting: "Infrared pyrometers from Sensortherm. Panel meters and signal conditioners from Status Instruments. Humidity, air, sound, light and water instruments from Senseca. Temperature calibrators from Giussani. Every one tested before it leaves us, and calibrated with traceability when you need it.",
      cta: 'About W&B',
    },
    stats: [
      { value: `${C.years}`, unit: 'years', label: 'Supplying the Australian market' },
      { value: `${C.combined}+`, unit: 'years', label: 'Combined technical expertise' },
      { value: 'ISO', unit: '9001:2015', label: 'Certified quality management · FS604761' },
      { value: `${C.hours}`, unit: 'h', label: 'Dispatch on ex-stock items' },
    ],
    industries: {
      eyebrow: 'Industries',
      title: 'Industries we support',
      text: 'From metals processing and food manufacturing to HVAC and research, we match the instrument to the application.',
      cta: 'All industries',
    },
    products: {
      eyebrow: 'Products & Services',
      title: 'Instruments from leading manufacturers',
      text: 'Infrared pyrometers, displays, signal conditioning, environmental meters and calibration equipment, selected to work together and tested before dispatch.',
      cta: 'All products and services',
    },
    temperature: {
      eyebrow: 'Temperature measurement',
      title: 'Infrared temperature measurement, contact and non-contact',
      text: "Fixed and portable infrared pyrometers for targets that are hot, moving or hard to reach, with spectral ranges chosen for metals, glass, non-metals and laser processes.",
      points: [
        'Short-wavelength and ratio pyrometers for metals, where emissivity is low and changes during processing',
        'Pyrometers tuned to read glass surfaces and melts',
        "High-speed pyrometers for laser processing and additive manufacturing",
        'Blackbody sources for checking pyrometers and thermal imaging cameras',
      ],
      reading: '1700',
      readingUnit: '°C',
      readingLabel: 'Infrared and thermal imaging calibration up to',
      cta: 'Explore temperature measurement',
    },
    calibration: {
      eyebrow: 'Calibration & testing',
      title: 'Traceable calibration, in our workshop or on your site',
      text: 'Traceable calibration of temperature, pressure and humidity instruments in our Kilsyth workshop or on your site, including infrared pyrometers and thermal imaging up to 1700 °C, using N.A.T.A. and National Measurement Institute calibrated instruments.',
      points: [
        '100% pre-delivery testing and a calibration check to the manufacturer’s specifications',
        'Traceable calibration certificates included as standard where applicable',
        'N.A.T.A.-equivalent calibration (via Mutual Recognition Agreements) for air velocity, acoustic and light measurements',
        'Our partner products and many other brands',
      ],
      cta: 'Book a calibration',
      more: 'Calibration & Testing',
      imageAlt: 'Calibration workshop with temperature reference equipment',
    },
    businesses: {
      eyebrow: 'Our Businesses',
      title: 'Forging, casting, flow and valves',
      text: 'Engineering and manufacturing businesses of Metaval Engineering, presented here alongside W&B’s instrumentation.',
      cta: 'All businesses',
    },
    partners: {
      eyebrow: 'Brand partnerships',
      title: 'Ranges from leading manufacturers',
      text: 'We represent manufacturers from Italy, Germany and the United Kingdom, and back their products with local testing, calibration and support.',
      cta: 'About our partners',
    },
    news: {
      eyebrow: 'News & Events',
      title: 'Latest news and events',
      text: 'Company announcements, product launches, exhibitions and engineering insights.',
      cta: 'All news and events',
    },
    resources: {
      eyebrow: 'Technical resources',
      title: 'Documentation and technical reading',
      cta: 'All resources',
    },
    why: {
      eyebrow: 'Why W&B',
      title: 'Why customers choose W&B',
      text: 'Five things you can check before you choose a supplier.',
      items: [
        { h: 'Precision measurement', p: "The right instrument for the application, with infrared spectral ranges for metals, glass, non-metals and laser processes.", proof: '4 specialist manufacturers' },
        { h: 'Trusted calibration', p: 'Traceable calibration of temperature, pressure and humidity instruments, in Kilsyth or on site.', proof: 'IR to 1700 °C' },
        { h: 'Expert instrumentation', p: 'Technical staff who help you choose the instrument and set it up, not just quote a product code.', proof: `${C.combined}+ years combined` },
        { h: 'Tested before it ships', p: "Every instrument is tested and checked against the manufacturer's specifications before dispatch.", proof: '100% tested' },
        { h: 'Fast and local', p: 'A Victorian team that answers and dispatches quickly. ISO 9001:2015 certified (FS604761).', proof: `${C.hours} h dispatch` },
      ],
      proof: "Our customers range from many of Australia's largest public companies, universities and the CSIRO to the smallest manufacturers.",
      cta: 'Talk to a technician',
    },
    faq: {
      eyebrow: 'Answers',
      title: 'Common questions',
      text: 'Straight answers from our technical team. Ask us anything else.',
      items: [
        { q: 'Can you calibrate infrared pyrometers and thermal imaging cameras?', a: "Yes. We provide traceable calibration of non-contact instruments, including infrared pyrometers and thermal imaging, up to 1700 °C. We use blackbody calibration furnaces and reference instruments calibrated by N.A.T.A. and the National Measurement Institute.", link: 'calibration' },
        { q: 'Can my instruments be calibrated on site?', a: 'Yes. We offer in-house and on-site temperature calibration. Tell us the instruments, ranges and location, and we will confirm what can be done at your site and what is best done in our Kilsyth workshop.', link: 'book' },
        { q: 'What does traceable calibration mean?', a: 'Your instrument is compared with a reference whose own calibration links, through an unbroken chain, to national measurement standards. Our reference instruments are calibrated by N.A.T.A. and the National Measurement Institute, and traceable certificates are included as standard where applicable.', link: 'calibration' },
        { q: 'How quickly do you dispatch and respond?', a: "Ex-stock items are dispatched within 24 hours of your order, after testing and a calibration check to the manufacturer's specifications. We respond to every enquiry within 24 hours.", link: 'contact' },
        { q: 'Which manufacturers does W&B Instruments supply?', a: "Sensortherm infrared pyrometers and calibration sources, Status Instruments displays and signal conditioning, Senseca (Delta OHM) environmental, humidity and water-quality instruments, and Giussani temperature calibrators.", link: 'partners' },
        { q: 'How do I choose the right instrument?', a: `Tell us what you are measuring, the range, the target and where the instrument will be installed. Our technical staff, with over ${C.combined} years of combined expertise, will recommend the instrument and set-up.`, link: 'advice' },
      ],
      links: { calibration: 'Calibration & Testing', book: 'Book a calibration', contact: 'Contact our team', partners: 'Our brand partners', advice: 'Ask for advice' },
    },
    cta: {
      title: 'Tell us what you need to measure.',
      text: `Our technical staff respond to every enquiry within ${C.hours} hours.`,
      primary: 'Make an enquiry',
      call: 'Call us on {phone}',
    },
  },

  industries: {
    title: 'Industries',
    intro: 'Instrumentation and calibration for the industries and applications W&B supports, with the products used in each.',
    labels: {
      overview: 'Overview',
      challenges: 'Measurement challenges',
      instrumentation: 'Relevant instrumentation',
      products: 'Applicable products',
      services: 'Services',
      solutions: 'Related technical solutions',
      enquire: 'Discuss your application',
      enquireText: 'Tell us about your process and we will recommend the instrument and set-up.',
      noImage: 'Authentic application photography to be supplied by W&B.',
      photoAlt: 'Industrial process typical of {industry}',
    },
    items: {
      metals: {
        name: 'Mineral and metals processing',
        summary: 'Non-contact temperature for metal that is too hot, moving or hard to reach.',
        overview: 'Infrared pyrometers measure the temperature of metal through forging, rolling, heat treatment, induction heating and hardening, without touching the product.',
        challenges: [
          'Targets that are too hot, moving or hard to reach for a contact sensor',
          'Shiny metal surfaces with low emissivity that changes during processing',
          'Readings needed on control panels next to the process',
        ],
      },
      glass: {
        name: 'Glass and cement',
        summary: 'Pyrometers tuned to read glass surfaces and molten glass.',
        overview: 'Infrared thermometers with spectral ranges chosen for glass forming, float glass and container glass, plus cement.',
        challenges: ['Reading the surface or the melt, depending on the spectral range', 'Hot, continuous processes where contact measurement is impractical'],
      },
      food: {
        name: 'Food and beverage',
        summary: 'Temperature, humidity, cold-chain logging and water quality.',
        overview: 'Temperature during food processing, humidity in storage, cold-chain data logging, and water quality in food and drink production.',
        challenges: ['Recording conditions over time across storage and transport', 'Measuring organic materials that need long-wavelength pyrometers', 'Checking pH, conductivity and dissolved oxygen'],
      },
      hvac: {
        name: 'HVAC and buildings',
        summary: 'Airflow, humidity, comfort and sound for commissioning and balancing.',
        overview: 'Commissioning heating, ventilation and air conditioning, fume cupboards and clean rooms, noise and comfort in buildings, and recording conditions across a building.',
        challenges: ['Duct traverses, diffusers and airflow balancing', 'Thermal comfort and heat stress indoors', 'Building acoustics surveys'],
      },
      research: {
        name: 'Laboratories and research',
        summary: 'Calibration sources, data logging, light and water measurement.',
        overview: 'Calibration laboratories and pyrometer verification, recording laboratory measurements, and research. Our customers include universities and the CSIRO.',
        challenges: ['Verifying pyrometers and thermal imaging cameras against a known reference', 'Recording measurements automatically over long periods'],
      },
      process: {
        name: 'Process plant',
        summary: 'Displays for control panels and the field, plus temperature on production lines.',
        overview: 'Displays for control panels and field instruments, plus temperature measurement on plastics, paper and coatings lines.',
        challenges: ['Showing live 4–20 mA readings where no separate power supply is available', 'Alarms and retransmission from panel indicators', 'Non-contact temperature on moving webs and coatings'],
      },
      'laser-processing': {
        name: "Laser processing and additive manufacturing",
        summary: "High-speed pyrometers that measure and control the temperature of laser processes.",
        overview: "High-speed pyrometers integrated into the laser optics measure the melt temperature and control the laser power in real time, for additive manufacturing, laser cladding, hardening, soldering and plastic welding.",
        challenges: ["Measuring a small, fast-moving melt pool through the laser optics", "Holding a constant temperature while the process changes"],
      },
      water: {
        name: 'Water treatment',
        summary: 'pH, conductivity and dissolved oxygen, portable to in-line.',
        overview: 'Portable, benchtop and process instruments for pH, conductivity and dissolved oxygen.',
        challenges: ['Choosing between portable, benchtop and in-line measurement', 'Recording water quality over time'],
      },
      environment: {
        name: 'Environment and agriculture',
        summary: 'Weather stations, environmental noise and solar radiation.',
        overview: 'Weather stations for agriculture and solar sites, environmental noise monitoring and solar radiation measurement.',
        challenges: ['Wind, rain, solar radiation, temperature and humidity at remote sites', 'Environmental noise monitoring'],
      },
      ohs: {
        name: 'Occupational hygiene',
        summary: 'Workplace noise and heat stress.',
        overview: 'Workplace noise, and heat stress on workers measured with WBGT globe thermometers, indoors and outdoors.',
        challenges: ['Occupational noise exposure', 'Heat stress (WBGT) indoors and outdoors'],
      },
    },
  },

  categories: {
    infrared: { name: 'Infrared temperature', desc: "Non-contact temperature measurement for metals, glass, other materials and laser processes, plus reference sources for checking pyrometers." },
    displays: { name: 'Displays & signal conditioning', desc: 'Displays that show live readings from sensors in factories and plants, and devices that condition sensor signals for other equipment.' },
    environmental: { name: 'Environmental & HVAC', desc: 'Meters for air flow, humidity, sound, light, workplace heat and weather, plus data loggers that record readings over time.' },
    calibration: { name: 'Calibration equipment', desc: 'Temperature calibrators used to check thermometers and temperature sensors.' },
    water: { name: 'Water analysis', desc: 'Instruments that check water quality (pH, conductivity and dissolved oxygen), handheld, benchtop or fitted into pipework.' },
  },

  brands: {
    sensortherm: {
      where: "Germany",
      does: "Infrared measurement and control technology, developed and made in Steinbach, Germany. A specialist in fast digital pyrometers, with more than 30 years of experience.",
      range: ["Stationary and portable pyrometers, 1-colour and 2-colour", "High-speed pyrometers and laser power control", "Temperature scanners and line scanners", "Calibration sources and transfer standard pyrometers", "PID controllers, displays and software"],
    },
    status: {
      where: 'United Kingdom',
      does: "One of the world's leading manufacturers of temperature transmitters, signal conditioning, digital displays and thermometers.",
      range: [
        'Temperature transmitters',
        'Signal conditioners and trip amplifiers',
        'Panel meters',
        'Loop isolators',
        'Battery powered thermometers',
        'Loop indicators',
        'Pressure transmitters',
        'DIN rail power supplies',
        'Configuration hardware',
      ],
    },
    senseca: {
      where: 'Italy',
      does: "One of the world's leading manufacturers of portable and process instrumentation.",
      range: ['Temperature and relative humidity', 'Pressure', 'Air speed', 'Light', 'Sound levels', 'pH', 'Conductivity', 'Dissolved oxygen', 'CO', 'CO2'],
    },
    giussani: {
      where: 'Italy',
      does: 'Temperature and pressure calibration equipment, including the dry block calibrators and baths used in our own calibration service.',
      range: ['Temperature calibration systems', 'Pressure calibration systems'],
    },
  },

  products: {
    title: 'Products & Services',
    intro: 'Measurement solutions, not just product listings: sensors, displays, signal conditioning and calibration, chosen to work together and backed by application support.',
    groupsTitle: 'Product and service groups',
    catalogueTitle: 'Product catalogue',
    catalogueText: 'Every range W&B publishes, with the manufacturer behind it.',
    filters: {
      label: 'Filter products',
      category: 'Category',
      brand: 'Manufacturer',
      all: 'All',
      search: 'Filter by keyword',
      clear: 'Clear filters',
      showing: 'Showing {n} of {total} ranges',
      none: 'No ranges match these filters.',
    },
    labels: {
      overview: 'Overview',
      plain: 'In plain English',
      specs: 'Technical specifications',
      measures: 'Measures',
      range: 'Measurement range',
      applications: 'Applications',
      configurations: 'Available configurations',
      manufacturer: 'Manufacturer information',
      datasheet: 'Datasheet',
      related: 'Related products',
      relatedText: 'Instruments commonly used with this range.',
      chain: 'Complete the measurement chain',
      chainText: 'The groups this range belongs to, and the next step in the chain.',
      enquireTitle: 'Ask about this range',
      enquireText: 'Tell us the application and we will recommend the right model and send its datasheet.',
      enquire: 'Enquire about this range',
      requestDatasheet: 'Request the datasheet',
      visitManufacturer: 'Visit the manufacturer',
      country: 'Based in',
    },
    specsNone: 'Specifications vary by model and are not yet published on this site. Ask us for the datasheet for the exact model you need.',
    rangeNone: 'The measurement range depends on the model. We will confirm it with the datasheet.',
    configNone: 'Many products can be customised for specific applications. We will confirm the options available for this range.',
    datasheetNone: 'No datasheet is published here yet. We will send the manufacturer’s datasheet on request.',
    items: {
      'acoustical-measurement': {
        name: 'Acoustical measurement',
        desc: 'Sound level meters and acoustic analysers for workplace noise, environmental and building acoustics surveys.',
        plain: 'Measures how loud a place is, for example noise at work, in the environment or inside buildings.',
        measures: 'Sound levels',
        uses: 'Occupational noise, environmental monitoring, building acoustics',
      },
      'air-velocity-measurement': {
        name: 'Air velocity measurement',
        desc: 'Hot-wire, vane and Pitot probes with handheld meters for duct traverses, diffusers and airflow balancing.',
        plain: 'Measures how fast air is moving, for example in air conditioning ducts and vents, so systems can be set up and balanced.',
        measures: 'Air speed, airflow',
        uses: 'HVAC commissioning, fume cupboards, clean rooms',
      },
      'data-logging': {
        name: 'Data logging',
        desc: 'Standalone and wireless data loggers for temperature, humidity and other parameters, with web-based monitoring.',
        plain: 'Small devices that record readings such as temperature and humidity automatically over time, which you can check later or online.',
        measures: 'Temperature, humidity, pressure and more',
        uses: 'Cold chain, warehouses, laboratories, buildings',
      },
      'humidity-measurement': {
        name: 'Humidity measurement',
        desc: 'Portable thermo-hygrometers and probes for relative humidity, dew point and temperature.',
        plain: 'Measures how much moisture is in the air, along with temperature.',
        measures: 'Temperature and relative humidity',
        uses: 'HVAC, food storage, process drying, laboratories',
      },
      'light-measurement': {
        name: 'Light measurement',
        desc: 'Photometric and radiometric instruments for illuminance, irradiance and solar radiation.',
        plain: 'Measures how bright light is, including sunlight, for lighting checks and solar energy work.',
        measures: 'Light',
        uses: 'Lighting surveys, solar energy, research',
      },
      meteorological: {
        name: 'Meteorological applications',
        desc: 'Weather stations and sensors for wind, rain, solar radiation, temperature and humidity.',
        plain: 'Weather stations and sensors that measure wind, rain, sunlight, temperature and humidity.',
        measures: 'Wind, rain, radiation, temperature, humidity',
        uses: 'Agriculture, environmental monitoring, solar sites',
      },
      microclimate: {
        name: 'Microclimate',
        desc: 'Heat stress and thermal comfort analysers, including WBGT globe thermometers, for indoor and outdoor workplaces.',
        plain: 'Measures how hot and comfortable a workplace is for people, including heat stress risk, indoors and outdoors.',
        measures: 'WBGT, thermal comfort indices',
        uses: 'Occupational hygiene, building comfort studies',
      },
      'ir-temperature': {
        name: "Infrared pyrometers",
        desc: "Stationary and portable Sensortherm pyrometers (METIS, CAPELLA and FELIS) with digital signal processing, for non-contact temperature measurement on hot, moving or inaccessible targets.",
        plain: "Thermometers that read temperature from a distance using infrared light, without touching the object. Useful when it is too hot, moving or hard to reach.",
        measures: "Non-contact temperature",
        uses: "Steel, foundries, induction heating, laser processing, research",
      },
      'ir-glass': {
        name: "Pyrometers for glass applications",
        desc: "Pyrometers for glass processes such as glass drop (gob) measurement, with the spectral range chosen for the application.",
        plain: "Infrared thermometers set up specifically to read the temperature of glass, including molten glass.",
        measures: "Non-contact temperature",
        uses: "Glass drop (gob) measurement, container glass, glass forming",
      },
      'ir-metal': {
        name: "Pyrometers for metals (2-colour and short-wave)",
        desc: "Short-wavelength 1-colour and 2-colour (ratio) pyrometers for metals, where emissivity is low and changes during processing. 2-colour models keep reading through dust, steam, smoke and dirty windows.",
        plain: "Infrared thermometers designed for metals, which are hard to measure because shiny surfaces reflect heat in changing ways.",
        measures: "Non-contact temperature",
        uses: "Rolling mills, continuous casting, pouring streams, forging, induction hardening",
      },
      'ir-non-metal': {
        name: "Pyrometers for non-metals and lower temperatures",
        desc: "Compact FELIS and METIS 1-colour pyrometers with longer-wavelength spectral ranges, measuring from 50 °C, for non-metals and cooler processes.",
        plain: "Infrared thermometers for materials other than metal, and for processes that run cooler, from 50 °C.",
        measures: "Non-contact temperature",
        uses: "Induction preheating, soldering, plastics welding, coatings",
      },
      'ir-high-speed': {
        name: "High-speed pyrometers and laser process control",
        desc: "HELIOS H4 and METIS H3 high-speed pyrometers, with exposure times as short as 40 µs, that measure and control temperature at the same time, including laser power control.",
        plain: "Very fast infrared thermometers that can also adjust a laser or heater in real time to hold the temperature where it should be.",
        measures: "Non-contact temperature, with integrated control",
        uses: "Additive manufacturing, laser cladding, laser hardening and soldering, laser plastic welding",
      },
      'ir-calibration-sources': {
        name: "Infrared calibration sources",
        desc: "The Sensortherm CS1500N blackbody calibration source (50 to 1500 °C, 40 mm aperture), the portable HE1200N temperature source and DIADEM transfer standard pyrometers, for checking and calibrating pyrometers and thermal imaging cameras.",
        plain: "Reference ovens that produce a known, steady temperature, used to check that infrared thermometers and thermal cameras read correctly.",
        measures: "Reference radiation temperature",
        uses: "Calibration laboratories, pyrometer verification",
      },
      'digital-displays': {
        name: 'Digital displays',
        desc: 'Panel meters and digital indicators for process signals, with alarm relays and retransmission options.',
        plain: 'Screens for control panels that show live readings from sensors, and can trigger alarms or pass the reading on to other equipment.',
        measures: 'Process signals (mA, V, temperature)',
        uses: 'Control panels, process plant',
      },
      'loop-powered-displays': {
        name: 'Loop powered displays',
        desc: 'Indicators powered from the 4–20 mA loop, so no separate supply is needed at the point of measurement.',
        plain: "Displays that run on the sensor's own signal wiring, so no separate power supply is needed where they are installed.",
        measures: '4–20 mA loop signals',
        uses: 'Field indication on transmitters, remote displays',
      },
      'water-analysis': {
        name: 'Water analysis',
        desc: 'Portable, benchtop and process instruments for pH, conductivity and dissolved oxygen.',
        plain: 'Instruments that check water quality: how acidic it is (pH), how much it conducts electricity (conductivity) and how much oxygen it holds (dissolved oxygen).',
        measures: 'pH, conductivity, dissolved oxygen',
        uses: 'Water treatment, food and beverage, laboratories',
      },
      'ir-scanners': {
        name: "Temperature scanners",
        desc: "GALAXY scanners that record up to 1,600 measuring points over a detection angle of up to 90°, evaluate 16 measuring regions separately and build 2D thermographic images in 2-colour mode.",
        plain: "Scanners that sweep a pyrometer across the product to map its temperature as a profile or an image, instead of reading a single spot.",
        measures: "Temperature profiles, 2D thermographic images",
        uses: "Continuous casting, rolling mills, steel slabs",
      },
      'ir-controllers': {
        name: "Pyrometer controllers and system components",
        desc: "REGULUS PID program controllers optimised for pyrometers, with sampling times down to 100 µs and a direct 0–10 V manipulated variable, plus the IF digital display and SensorTools software.",
        plain: "Controllers that use the pyrometer reading to adjust the heating directly, plus displays and software to set up the pyrometer and review its readings.",
        measures: "Pyrometer signals, 0–10 V control output",
        uses: "Induction heating, soldering, laser processing",
      },
      'temperature-transmitters': {
        name: 'Temperature transmitters',
        desc: 'Temperature transmitters from Status Instruments, which convert a temperature sensor’s signal into a process signal for your control system.',
        plain: 'Small devices that take the signal from a temperature sensor and turn it into a standard signal that control systems and displays can read.',
        measures: 'Temperature (from a connected sensor)',
        uses: '',
      },
      'signal-conditioners': {
        name: 'Signal conditioners',
        desc: 'Signal conditioners and trip amplifiers from Status Instruments.',
        plain: 'Devices that convert, isolate or check a sensor signal so other equipment can use it, and can switch an output when a limit is reached.',
        measures: 'Process signals',
        uses: '',
      },
      'temperature-gauges': {
        name: 'Temperature gauges (digital)',
        desc: 'Digital temperature gauges from Status Instruments.',
        plain: 'Digital gauges that show temperature directly where it is measured.',
        measures: 'Temperature',
        uses: '',
      },
      'handheld-thermometers': {
        name: 'Temperature (hand held thermometers)',
        desc: 'Hand held thermometers from Senseca (Delta OHM).',
        plain: 'Portable thermometers with probes for spot checks of temperature.',
        measures: 'Temperature',
        uses: '',
      },
      'pressure-measurement': {
        name: 'Pressure measurement',
        desc: 'Pressure measurement instruments from Senseca (Delta OHM).',
        plain: 'Instruments that measure pressure.',
        measures: 'Pressure',
        uses: '',
      },
      'thermal-comfort': {
        name: 'Thermal comfort',
        desc: 'Thermal comfort instruments from Senseca (Delta OHM).',
        plain: 'Instruments that measure how comfortable the temperature and air conditions in a space are for people.',
        measures: 'Thermal comfort indices',
        uses: 'Building comfort studies',
      },
      'dry-block-calibrators': {
        name: 'Thermostatic calibrators (dry block calibrators)',
        desc: 'Dry block temperature calibrators from Giussani, the same type used in our own calibration service.',
        plain: 'A heated block that holds a known, steady temperature, used to check that thermometers and temperature sensors read correctly.',
        measures: 'Reference temperature',
        uses: 'Temperature calibration, sensor verification',
      },
    },
  },

  solutions: {
    labels: {
      products: 'Product ranges',
      ranges: 'From our partners’ ranges',
      rangesText: 'Published manufacturer ranges W&B supplies. Ask us for models and datasheets.',
      services: 'Services',
      next: 'Next in the measurement chain',
      pendingTitle: 'Range details to be confirmed',
      noProducts: 'No product pages are published for this group yet.',
    },
    items: {
      'temperature-measurement': {
        name: 'Temperature Measurement',
        short: 'Contact and non-contact temperature, recording and verification.',
        intro: 'Temperature measurement from W&B’s partner ranges: infrared pyrometers for hot, moving or inaccessible targets, temperature and humidity probes, data loggers, temperature transmitters, thermometers and the calibration equipment to check them.',
        note: 'Thermocouples and other contact sensors are not yet listed as W&B ranges on this site. Ask our team about contact temperature sensors for your application.',
      },
      'rtd-temperature-sensors': {
        name: 'RTDs & Temperature Sensors',
        short: 'Contact temperature sensors and the transmitters that read them.',
        intro: 'Contact temperature measurement with the transmitters, thermometers, probes and loggers in W&B’s partner ranges.',
        note: 'W&B has not yet published its RTD and temperature sensor range for this site. The related ranges below are published; contact our team for RTD models and specifications.',
      },
      'infrared-thermometry': {
        name: 'Infrared Thermometry',
        short: "Pyrometers, scanners and calibration sources from Sensortherm.",
        intro: "Stationary and portable infrared pyrometers from Sensortherm, with spectral ranges for metals, glass and non-metals, high-speed models for laser processes, scanners for temperature profiles and calibration sources to verify them.",
        note: '',
      },
      displays: {
        name: 'Displays',
        short: 'Panel meters and loop powered indicators.',
        intro: 'Panel meters, digital indicators and loop powered displays from Status Instruments, showing live process readings with alarm and retransmission options.',
        note: '',
      },
      'signal-conditioning': {
        name: 'Signal Conditioning',
        short: 'Transmitters, conditioners, isolators and power supplies.',
        intro: 'Temperature transmitters, signal conditioners and trip amplifiers, loop isolators and DIN rail power supplies from Status Instruments, so sensor signals reach your control system in the form it needs.',
        note: '',
      },
      'calibration-testing': {
        name: 'Calibration & Testing',
        short: 'Traceable calibration, test equipment and pre-delivery checks.',
        intro: "Traceable calibration in our Kilsyth workshop, calibration equipment from Giussani and Sensortherm, and 100% pre-delivery testing of every instrument we supply.",
        note: '',
      },
      'environmental-monitoring': {
        name: 'Environmental Monitoring',
        short: 'Air, humidity, sound, light, heat stress and weather.',
        intro: 'Environmental and building measurement from Senseca (Delta OHM): air velocity, temperature and humidity, sound levels, light, thermal comfort and heat stress, weather stations and data loggers that record readings over time, with traceable calibration from our Kilsyth workshop.',
        note: '',
      },
      'measurement-accessories': {
        name: 'Measurement Accessories',
        short: 'Power supplies, configuration hardware and accessories.',
        intro: 'Accessories that complete an installation, such as DIN rail power supplies and configuration hardware.',
        note: 'W&B has not yet published a full accessories range for this site. Contact our team for probes, mounting and other accessories for a specific instrument.',
      },
    },
  },

  services: {
    items: {
      calibration: {
        name: 'Calibration services',
        text: 'A fast and economical service for traceable calibrations for temperature, pressure and humidity, including non-contact infrared pyrometers and thermal imaging up to 1700 °C, using N.A.T.A. and National Measurement Institute calibrated instruments.',
        cta: 'Book a calibration',
      },
      'application-support': {
        name: 'Technical application support',
        text: 'Our highly qualified staff offer solutions for the most complex and demanding measurement applications, from mineral and metals processing and food manufacturing to HVAC and R&D.',
        cta: 'Discuss your application',
      },
      selection: {
        name: 'Instrument selection',
        text: `Tell us what you need to measure. Our technical staff, with over ${C.combined} years of combined expertise, help you choose the right instrument.`,
        cta: 'Ask for advice',
      },
      'pre-delivery': {
        name: 'Pre-delivery testing',
        text: "100% pre-delivery testing and a calibration check to the manufacturer's specifications, so you can use your instrument immediately with full confidence.",
        cta: 'Request a quote',
      },
      customisation: {
        name: 'Product customisation',
        text: 'Many products can be customised for specific applications, so the instrument suits how and where you will use it.',
        cta: 'Ask about customisation',
      },
    },
    calibration: {
      title: 'Calibration scope',
      mra: 'We can also offer N.A.T.A.-equivalent calibration (via Mutual Recognition Agreements) for air velocity, acoustic and light measurements.',
      equipment: "Dry block calibrators and baths (Giussani), blackbody infrared calibration furnaces and the HD31 Multifunction Logger (Delta OHM).",
      brands: 'Our own partner products and many other brands, with traceability.',
      where: 'In-house in our Kilsyth workshop, or on site.',
      labels: { equipment: 'Reference equipment', brands: 'Brands', where: 'Where' },
    },
    process: [
      { h: 'Selection', p: `Our staff, with over ${C.combined} years of combined experience, help you choose the right instrument.` },
      { h: 'Testing', p: 'Every instrument is tested in our Kilsyth workshop before it leaves.' },
      { h: 'Calibration', p: "Checked against the manufacturer's specifications, with a traceable certificate where applicable." },
      { h: 'Customisation', p: 'Many products can be adapted to suit how and where you will use them.' },
      { h: 'Dispatch', p: `Ex-stock items are dispatched within ${C.hours} hours of your order.` },
    ],
    processTitle: 'From enquiry to dispatch',
  },

  businesses: {
    title: 'Our Businesses',
    intro: 'Four engineering and manufacturing businesses: Forging, Casting, Flow and Valves. Each is operated by Metaval Engineering, a separate brand, and the information on these pages comes from Metaval’s own websites.',
    sourceNote: 'Information on this page is taken from {source}. Metaval Engineering is a separate brand from W&B Instruments.',
    imageNote: 'Image from Metaval’s website.',
    visit: 'Visit Metaval Engineering',
    labels: {
      overview: 'Business overview',
      products: 'Products and capabilities',
      process: 'Manufacturing and process',
      materials: 'Materials',
      quality: 'Quality and testing',
      certifications: 'Certifications stated by the source',
      applications: 'Applications',
      related: 'Related offerings',
      relatedInstruments: 'Related W&B instrumentation',
      enquire: 'Enquire about {name}',
      enquireText: 'Send us your requirements and we will put you in touch with the right team.',
    },
    items: {
      forging: {
        name: 'Forging',
        short: 'High-strength forged components in carbon, alloy, stainless, duplex and exotic grades.',
        readingLabel: 'Single-piece forging, or 2200 mm diameter',
        overview: 'The Forging division produces high-strength forged components from carbon steel, alloy steel and exotic materials, including large-size forgings for high-pressure valve applications.',
        products: ['Flanges: weld neck, slip-on, blind, socket weld, lap joint and threaded', 'Ring joint gaskets', 'Weldolets, sockolets and olets', 'Tube sheets', 'Spectacle blinds', 'Spacers and paddles', 'Self-reinforced nozzles', 'Stub ends', 'Rings'],
        process: ['Forging', 'Heat treatment', 'CNC machining', 'Testing'],
        processNote: 'Every step is managed in-house, under one roof.',
        materials: ['Carbon steel', 'Alloy steel', 'Stainless steel', 'Duplex', 'Exotic materials'],
        quality: ['ASNT NDT Level III inspection', 'UT, MPI and LPT', 'Tensile and impact testing'],
        certifications: ['ISO', 'PED/CE', 'NABL', 'Fire Safe'],
        applications: ['Oil & gas refineries', 'Power generation', 'Nuclear power', 'Hydrogen plants', 'Chemical processing', 'Fertilizer', 'Mining', 'Water & sewage', 'Food, beverage & dairy', 'Pharmaceutical', 'Aerospace', 'Defence', 'Railways', 'Sugar', 'Agriculture'],
      },
      casting: {
        name: 'Casting',
        short: 'Sand, investment and pressure die casting in ferrous and non-ferrous alloys.',
        readingLabel: 'Sand casting capacity per piece',
        overview: 'The Casting business (Metaval Alloys) produces sand, investment and pressure die castings in ferrous and non-ferrous alloys, with complete in-house production control.',
        products: ['Valve bodies', 'Pump housings and impellers', 'Machinery parts and industrial tools', 'Furnace trays and heat-resistant fixtures', 'Hydraulic components', 'Gears, bushes, bearings and housings', 'Engine valves and cylinder heads', 'Gas turbine parts, nozzles and turbine blades', 'Corrosion-resistant parts', 'Die blocks'],
        process: ['Casting simulation', 'Pattern shop (conventional and CNC/VMC)', 'Sand, investment or pressure die casting', 'Heat treatment', 'Machining and surface treatment', 'Testing and inspection'],
        processNote: 'Investment casting suits intricate designs that need minimal machining and a superior surface finish. Shell moulding and metal injection moulding (MIM) are also listed.',
        materials: ['Ferrous alloys', 'Non-ferrous alloys'],
        quality: ['PMI and spectrometer analysis', 'LPT, UT, MPT and radiography (X-ray)', 'Tensile, impact and hardness testing', 'Dimensional inspection and microstructure analysis'],
        certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018'],
        applications: ['Industrial equipment', 'Automotive and transportation', 'Oil and gas', 'Power generation', 'Aerospace and defence', 'Railways', 'Construction', 'Electronics', 'Consumer goods'],
      },
      flow: {
        name: 'Flow',
        short: 'Flow measurement elements and meters from 0.5" to 150".',
        readingLabel: 'Flow product sizes',
        overview: 'The Flow Measurement division supplies flow meters and measurement systems for monitoring and controlling fluids, process optimisation and standards compliance, backed by an ISO 17025 NABL-accredited flow calibration laboratory.',
        products: ['Orifice plates: concentric, eccentric, segmental, conical, quadrant edge, multi-hole and restriction', 'Orifice plate assemblies and integral meter runs', 'Direct mount orifice rings', 'Flow nozzles: long radius, ISA-1932 and PTC-6', 'V-Cone (Meta-Cone), direct and remote mount', 'Averaging pitot tubes (Metabar)', 'Venturis: bi-directional, fabricated, fully machined, steam jacketed and rectangular', 'Wedge flow meters', 'Orifice chambers, single and dual', 'Magnetic flow meters'],
        process: ['Forging and casting', 'Machining', 'Assembly', 'Wet flow calibration', 'Testing'],
        processNote: 'Metaval describes its SCADA-controlled automated wet flow calibration lab as India’s largest.',
        materials: ['Carbon steel', 'Stainless steel', 'Duplex', 'Monel', 'Inconel', 'Hastelloy'],
        quality: ['ISO 17025 NABL-accredited flow laboratory', 'SCADA-controlled testing'],
        certifications: ['ISO', 'PED/CE', 'NABL', 'Fire Safe'],
        applications: ['Oil & gas refineries', 'Power generation', 'Nuclear power', 'Hydrogen plants', 'Chemical processing', 'Fertilizer', 'Water & sewage', 'Food, beverage & dairy', 'Pharmaceutical', 'Mining', 'Sugar'],
      },
      valves: {
        name: 'Valves',
        short: 'Gate, globe, ball, check and butterfly valves, 0.5" to 80", up to #2500.',
        readingLabel: 'Pressure rating, sizes 0.5" to 80"',
        overview: 'The Valves division designs and manufactures high-performance shut-off valves, strainers and manifolds, with fire safe and cryogenic options and custom solutions to PED/CE, ISO and customer specifications.',
        products: ['Gate valves: rising and non-rising metal-seated, and resilient-seated', 'Globe valves: angle, Y pattern, pressure seal and T pattern', 'Ball valves: 2-way, 3-way, 4-way and multi-port', 'Check valves: swing, dual plate, lift, tilting disc and single flap', 'Butterfly valves: concentric, eccentric, double and triple offset', 'Strainers: Y-type, duplex, basket, pot and T-type', 'Manifolds: 2-valve, 3-valve and 5-valve', 'Needle valves, mono flanges and pressure gauge valves', 'Cryogenic globe valves and 2-way fire safe valves'],
        process: ['Forging and casting', 'Machining', 'Assembly', 'Testing'],
        processNote: 'Fire safe valves are available with API 607 certification, and cryogenic trims are offered.',
        materials: [],
        quality: ['API 607 fire safe certification available', 'Built to PED/CE, ISO and customer specifications'],
        certifications: ['ISO', 'PED/CE', 'NABL', 'Fire Safe'],
        applications: ['Oil & gas refineries', 'Power generation', 'Nuclear power', 'Hydrogen plants', 'Chemical processing', 'Fertilizer', 'Mining', 'Water & sewage', 'Food, beverage & dairy', 'Pharmaceutical', 'Aerospace', 'Defence', 'Railways', 'Sugar', 'Agriculture'],
      },
    },
  },

  news: {
    title: 'News & Events',
    intro: 'Company announcements, product launches, industry updates, exhibitions and engineering insights from W&B Instruments.',
    all: 'All',
    filterLabel: 'Filter by category',
    placeholderNote: 'Items marked “Placeholder” show the layout for articles W&B has not supplied yet. They are not real news.',
    publishedOn: 'First published on wandbinstruments.com.au',
    by: 'By {author}',
    articlePlaceholder: 'This is a placeholder article. W&B has not supplied this content yet, so nothing on this page should be read as news.',
    more: 'More news and events',
    video: 'Video',
    watch: 'Watch the video',
    categories: {
      announcement: 'Company announcement',
      launch: 'Product launch',
      industry: 'Industry update',
      exhibition: 'Exhibition',
      technical: 'Technical development',
      insight: 'Engineering insight',
      event: 'Company event',
    },
    items: {
      'new-website-2019': {
        title: 'Welcome to our new website!',
        excerpt: 'Our refreshed website adds direct links to new products and applications, including wireless and meteorological instruments.',
        body: [
          'W&B Instruments launched its refreshed website, with direct links to new products and applications, including wireless and meteorological instruments.',
          'At the time, W&B was in its 39th year of operation, and its calibration service was entering its 20th year, offering on-site and laboratory traceable calibration for temperature, pressure and humidity.',
          'To find out more, contact our team.',
        ],
      },
      'company-announcement': { title: 'Company announcement headline', excerpt: 'A short summary of the announcement, written by W&B, will appear here.', body: ['The article body will appear here once W&B supplies it.'] },
      'product-launch': { title: 'Product launch headline', excerpt: 'A short summary of the new range or model, with a link to its product page.', body: ['The article body will appear here once W&B supplies it.'] },
      exhibition: { title: 'Exhibition headline', excerpt: 'The exhibition name, dates, venue and stand number will appear here.', body: ['The article body will appear here once W&B supplies it.'] },
      'industry-update': { title: 'Industry update headline', excerpt: 'A short summary of the industry development and what it means for measurement.', body: ['The article body will appear here once W&B supplies it.'] },
      'technical-development': { title: 'Technical development headline', excerpt: 'A short summary of the technical development.', body: ['The article body will appear here once W&B supplies it.'] },
      'engineering-insight': { title: 'Engineering insight headline', excerpt: 'A short summary of the engineering insight, from the technician who gives you the number.', body: ['The article body will appear here once W&B supplies it.'] },
      'company-event': { title: 'Company event headline', excerpt: 'The event name, date and details will appear here.', body: ['The article body will appear here once W&B supplies it.'] },
    },
  },

  resources: {
    title: 'Resources',
    intro: 'Technical documentation, product datasheets, insights and articles.',
    items: {
      documentation: {
        name: 'Technical Documentation',
        short: 'Manuals and documentation from the manufacturers we represent.',
        intro: 'Manuals and technical documentation are published by each manufacturer. Use the links below, or ask us and we will send the document for your model.',
        placeholder: 'W&B’s own technical documentation library will be added here once it is supplied.',
      },
      datasheets: {
        name: 'Product Datasheets',
        short: 'Request the datasheet for any range we supply.',
        intro: 'Datasheets are not yet published on this site. Choose a range and we will send the manufacturer’s datasheet for the exact model.',
        placeholder: '',
      },
      insights: {
        name: 'Insights',
        short: 'Measurement terms explained, and engineering insight.',
        intro: 'Plain-English explanations of the measurement terms we use every day.',
        placeholder: 'Insight articles will be added here once W&B supplies them.',
      },
      articles: {
        name: 'Technical Articles',
        short: 'Application notes and technical articles.',
        intro: 'Application notes and technical articles from our technical staff.',
        placeholder: 'No technical articles have been supplied yet. They will be listed here.',
      },
    },
    glossaryTitle: 'Measurement terms explained',
    glossary: [
      { t: 'Calibration', d: 'Checking an instrument against a more accurate reference to make sure its readings are right, and adjusting it if needed.' },
      { t: 'Traceable', d: 'The reference we check against has itself been checked, in an unbroken chain, back to national measurement standards.' },
      { t: 'N.A.T.A.', d: 'The National Association of Testing Authorities, which accredits testing and calibration laboratories in Australia.' },
      { t: 'National Measurement Institute', d: "The Australian Government agency that maintains Australia's national measurement standards." },
      { t: 'Pyrometer', d: 'An infrared thermometer: it reads temperature from a distance without touching the object.' },
    ],
    manufacturerDocs: 'Manufacturer documentation',
    request: 'Request',
  },

  support: {
    title: 'Support',
    intro: `Talk to the people who know the instrument. We respond to every enquiry within ${C.hours} hours.`,
    items: {
      technical: { name: 'Technical Support', text: 'Help with an instrument you already have: set-up, readings, faults and calibration.', cta: 'Get technical support' },
      product: { name: 'Product Enquiries', text: 'Prices, availability, product codes and quotations. Include product codes for quicker order processing.', cta: 'Send a product enquiry' },
      application: { name: 'Application Support', text: 'Not sure what you need? Tell us about your process and we will recommend the right instrument and set-up.', cta: 'Discuss your application' },
      team: { name: 'Contact Our Team', text: 'Call, email or visit us in Kilsyth.', cta: 'Contact details' },
    },
  },

  about: {
    title: 'About W&B Instruments',
    intro: 'Measurement you can trust, from people who know the instrument.',
    sections: { overview: 'Company overview', history: 'Company history', purpose: 'Our purpose', values: 'Brand values', expertise: 'Technical expertise', partners: 'Brand partnerships', capabilities: 'Measurement capabilities', support: 'Application support', quality: 'Quality and certification', why: 'Why choose W&B' },
    overview: [
      `For ${C.years} years W&B Instruments has supplied the Australian market with the world's best quality portable and process instrumentation from some of the world's leading suppliers.`,
      "Our customers range from many of Australia's largest public companies, universities and the CSIRO to the smallest manufacturers.",
    ],
    history: [
      `W&B Instruments has supplied the Australian market for ${C.years} years.`,
      'In May 2019, W&B was in its 39th year of operation and its calibration service was entering its 20th year.',
    ],
    historyPlaceholder: 'A detailed company history, with founding date and milestones, will be added once W&B supplies it.',
    purpose: 'To make sure every reading our customers rely on is a reading they can trust. We supply the right instrument for the application, test it before it leaves us, calibrate it with traceability, and stay on the phone until it is reading correctly.',
    positioning: 'Precision Measurement. Expert Instrumentation. Trusted Calibration.',
    supportingStatement: 'Industrial measurement instruments, specialist technical expertise and dependable calibration support for industry.',
    values: [
      { h: 'Precise', p: 'We give the number, the unit and the standard behind it.' },
      { h: 'Dependable', p: 'Every instrument is tested before it leaves us.' },
      { h: 'Expert', p: 'Technical staff who understand the application, not just the product code.' },
      { h: 'Energetic', p: 'Fast answers and fast dispatch.' },
      { h: 'Local', p: 'Based in Victoria, supplying and supporting customers across Australia.' },
    ],
    expertise: `With over ${C.combined} years of combined technical expertise, our highly qualified staff offer solutions for the most complex and demanding measurement applications, from mineral and metals processing and food manufacturing to HVAC and R&D.`,
    capabilitiesText: 'Quantities measured across our partner ranges:',
    capabilities: ['Temperature', 'Pressure', 'Humidity', 'Air velocity', 'Sound', 'Light', 'pH & conductivity', 'Dissolved oxygen', 'Infrared', 'Calibration'],
    supportText: 'From choosing the sensor to setting it up, we support complex and demanding measurement applications, and we guarantee a response to your enquiry within 24 hours.',
    quality: [
      { h: 'ISO 9001:2015 certified', p: 'W&B Instruments and our partner companies are all certified to the ISO 9001:2015 quality management standard (certificate FS604761).' },
      { h: '100% pre-delivery testing', p: 'Every instrument is tested before it is dispatched.' },
      { h: 'Calibration check', p: "Each instrument is checked against the manufacturer's specifications before delivery." },
      { h: 'Traceable certificates', p: 'Traceable calibration certificates are included as standard where applicable.' },
    ],
    certificateAlt: 'BSI ISO 9001:2015 certification mark, certificate FS604761',
    certificatePending: 'Certificate PDF to be supplied.',
    why: [
      { h: 'Technical expertise', p: `Over ${C.combined} years of combined technical expertise, from choosing the right sensor to setting it up.` },
      { h: 'Quality assurance', p: 'W&B Instruments and our partner companies are all certified to ISO 9001:2015.' },
      { h: 'Pre-delivery testing', p: "100% pre-delivery testing and a calibration check to the manufacturer's specifications." },
      { h: 'Fast dispatch', p: `Dispatch within ${C.hours} hours of your order for ex-stock items.` },
      { h: 'Calibration services', p: 'In-house calibration with traceability for our partner products and many other brands.' },
      { h: 'Product customisation', p: 'Many products can be customised for specific applications.' },
    ],
  },

  careers: {
    title: 'Careers',
    intro: 'Work with people who understand measurement.',
    sections: { working: 'Working at W&B', culture: 'Our culture', openings: 'Open positions', apply: 'Expression of interest' },
    working: `At W&B you work alongside technical staff with over ${C.combined} years of combined expertise, on instruments from some of the world's leading manufacturers, for customers from universities and the CSIRO to small manufacturers.`,
    culturePlaceholder: 'A description of working life, benefits and development at W&B will be added once W&B supplies it.',
    noOpenings: 'There are no open positions listed at the moment.',
    noOpeningsText: 'We are always glad to hear from people with experience in instrumentation, calibration or technical sales. Send an expression of interest and we will keep it on file.',
    job: { location: 'Location', type: 'Type', apply: 'Apply for this role', description: 'Job description', closes: 'Applications close', orEmail: 'Or email your application to', applyingFor: 'Applying for' },
    form: {
      title: 'Send an expression of interest',
      area: 'Area of interest',
      areas: { calibration: 'Calibration and testing', technical: 'Technical sales and support', operations: 'Operations and logistics', other: 'Other' },
      cv: 'CV',
      cvHint: 'PDF or Word, up to 5 MB.',
      submit: 'Send expression of interest',
      sent: 'Thank you. Your expression of interest has been recorded.',
    },
  },

  contact: {
    title: 'Contact Us',
    intro: `Call, email or send an enquiry. We respond to every enquiry within ${C.hours} hours.`,
    office: 'Head office',
    phone: 'Phone',
    fax: 'Fax',
    email: 'Email',
    address: 'Address',
    map: 'Open in Google Maps',
    routesTitle: 'How can we help?',
    routes: {
      product: { h: 'Product enquiries', p: 'Prices, availability, product codes and quotations.' },
      technical: { h: 'Technical support', p: 'Help with set-up, readings, faults and calibration.' },
      general: { h: 'General enquiries', p: 'Anything else, including partnerships and media.' },
    },
    formTitle: 'Send an enquiry',
    abn: 'ACN',
  },

  form: {
    fullName: 'Full name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    enquiryType: 'Enquiry type',
    productService: 'Product or service',
    message: 'Message',
    choose: 'Choose…',
    consent: 'I agree to W&B Instruments using these details to respond to my enquiry, as described in the {privacy}.',
    consentLink: 'Privacy Notice',
    submit: 'Send enquiry',
    sending: 'Sending…',
    summary: 'Please fix {n} problems before sending:',
    summaryOne: 'Please fix 1 problem before sending:',
    types: { product: 'Product enquiry', quote: 'Quotation', technical: 'Technical support', application: 'Application support', calibration: 'Calibration', datasheet: 'Datasheet request', business: 'Our Businesses enquiry', general: 'General enquiry' },
    groups: { services: 'Services', solutions: 'Products & Services', products: 'Product ranges', businesses: 'Our Businesses', other: 'Other' },
    notSure: 'Not sure yet',
    errors: {
      name: 'Enter your full name.',
      email: 'Enter your email address.',
      emailInvalid: 'Enter a valid email address, like name@company.com.au.',
      phone: 'Enter a valid phone number, for example +61 3 9729 2112.',
      type: 'Choose an enquiry type.',
      message: 'Tell us a little more (at least 10 characters).',
      messageLong: 'Your message is too long (5,000 characters at most).',
      consent: 'Tick the box to agree to the Privacy Notice.',
      cvType: 'Upload a PDF or Word document.',
      cvSize: 'The file is larger than 5 MB.',
      area: 'Choose an area of interest.',
      tooLong: 'This is too long.',
    },
    previewTitle: 'Preview: nothing was sent',
    previewText: 'This is a website preview, so the form checked your details but did not send them. On the live site your message goes to the W&B team and you receive a confirmation email.',
    sentTitle: 'Enquiry sent',
    sentText: 'Thank you. Your reference is {ref}. We will respond within 24 hours.',
    errorTitle: 'Your enquiry could not be sent',
    errorText: 'Please try again, or call us on {phone}.',
    another: 'Send another message',
  },

  footer: {
    columns: { company: 'Company', news: 'News & Resources', businesses: 'Our Businesses', products: 'Products & Services', connect: 'Connect With Us' },
    company: { about: 'About Us', history: 'Company History', purpose: 'Our Purpose', careers: 'Careers', contact: 'Contact Us' },
    news: { newsroom: 'Newsroom', events: 'News & Events', insights: 'Insights', resources: 'Technical Resources', documentation: 'Product Documentation', datasheets: 'Datasheets' },
    connect: { contact: 'Contact Us', technical: 'Technical Enquiries', product: 'Product Enquiries', partnerships: 'Brand Partnerships' },
    tagline: 'Measured. Calibrated. Trusted.',
    supporting: 'Precision Measurement. Expert Instrumentation. Trusted Calibration.',
    followUs: 'Follow us',
    copyright: '© {year} {company}. All Rights Reserved.',
    legalNav: 'Legal, privacy and compliance',
    certified: 'ISO 9001:2015 certified · FS604761',
    designedBy: 'Designed by',
    designerLink: 'JSR on LinkedIn (opens in a new tab)',
  },

  legal: {
    titles: {
      privacy: 'Privacy Notice',
      cookies: 'Cookies',
      terms: 'Terms of Use',
      imprint: 'Imprint',
      accessibility: 'Accessibility',
      'communication-preferences': 'Communication Preferences',
      'resource-availability': 'Resource Availability',
      'do-not-sell': 'Do Not Sell My Personal Information',
      governance: 'Transparency in Governance',
      'machine-readable-files': 'Machine-Readable Files',
      copyright: 'Copyright',
    },
    draftNotice: 'Draft for review. Items marked “To be confirmed” must be completed and the page approved by W&B Instruments before publication.',
    placeholderNotice: 'Placeholder page. W&B Instruments has not supplied approved content for this page. Nothing here is a policy, a statement of compliance or legal advice.',
    englishOnly: 'Legal pages are published in English.',
    effective: 'Effective date',
    willContain: 'What this page will contain',
    facts: 'What we can say about this website today',
    questions: 'Questions about this page',
    questionsText: 'Contact us at {email} or call {phone}.',
  },

  viewer: {
    role: '3D viewer',
    illustration: 'conceptual 3D illustration',
    keys: 'Drag or use the arrow keys to rotate. Plus and minus zoom, E explodes, R resets.',
    tag: 'Conceptual 3D model',
    note: "Conceptual 3D illustration of a typical instrument of this type. It is not a model of a specific manufacturer's product, and the internal components shown are typical, not manufacturer-verified.",
    controls: '3D viewer controls',
    drag: 'Drag to rotate',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset view',
    explode: 'Exploded view',
    reassemble: 'Reassemble instrument',
    full: 'Full-screen inspection',
    exitFull: 'Exit full screen',
    closeDetails: 'Close component details',
    typical: 'Typical component of this type of instrument, shown for illustration. Not a manufacturer drawing.',
    components: 'Components',
    details: 'component details',
    /** Model and component names shown in the 3D viewer (from the model registry). */
    models: {
      "pyrometer": {
        "name": "Fixed infrared pyrometer",
        "parts": {
          "optics": {
            "name": "Optics",
            "desc": "Collects infrared energy from the target and focuses it onto the detector. The lens design sets the measuring distance and spot size, which differ from model to model."
          },
          "bezel": {
            "name": "Lens retainer",
            "desc": "Holds the optics in position and protects the edge of the lens."
          },
          "sensor": {
            "name": "Sensing element",
            "desc": "The infrared detector turns the focused radiation into a small electrical signal. The wavelength it works at is why metals, glass and plastics each need a suitably chosen pyrometer."
          },
          "electronics": {
            "name": "Signal processing",
            "desc": "Amplifies the detector signal, corrects it for the target's emissivity and converts it into an output that displays and control systems can use."
          },
          "housing": {
            "name": "Housing",
            "desc": "Protects the optics and electronics in an industrial environment. The threaded body lets the sensor be fixed to a bracket."
          },
          "mounting": {
            "name": "Mounting nuts",
            "desc": "Lock the housing in position on its bracket so the sensor stays aimed at the target."
          },
          "connector": {
            "name": "Connector & cable",
            "desc": "Brings power in and carries the measurement signal out to a display or control system."
          }
        }
      },
      "panel-meter": {
        "name": "Panel-mount digital indicator",
        "parts": {
          "bezel": {
            "name": "Front bezel & keys",
            "desc": "The face seen on the control panel, with keys used to set the display up."
          },
          "display": {
            "name": "Display",
            "desc": "Shows the live reading taken from the sensor signal."
          },
          "pcb": {
            "name": "Measurement electronics",
            "desc": "Reads the process signal (mA, V or temperature), scales it for display and drives alarm relays or retransmission where those options are fitted."
          },
          "case": {
            "name": "Panel case",
            "desc": "Slides into a cut-out in the control panel door."
          },
          "terminals": {
            "name": "Rear terminals",
            "desc": "Where the sensor signal, power and any relay outputs are wired in."
          },
          "clamps": {
            "name": "Panel clamps",
            "desc": "Pull the meter tight against the back of the panel door."
          }
        }
      },
      "loop-indicator": {
        "name": "Loop-powered field indicator",
        "parts": {
          "window": {
            "name": "Window & bezel",
            "desc": "Seals the front of the housing and protects the display while keeping it readable."
          },
          "display": {
            "name": "Display",
            "desc": "Shows the reading taken from the 4–20 mA loop signal."
          },
          "electronics": {
            "name": "Loop-powered electronics",
            "desc": "Runs on the 4–20 mA loop itself, so no separate power supply is needed where the indicator is installed."
          },
          "housing": {
            "name": "Housing",
            "desc": "Protects the electronics where the indicator is installed in the plant."
          },
          "entry": {
            "name": "Cable entry",
            "desc": "Where the loop wiring enters the housing."
          }
        }
      },
      "blackbody": {
        "name": "Blackbody calibration source",
        "parts": {}
      },
      "dry-block": {
        "name": "Dry block temperature calibrator",
        "parts": {}
      },
      "handheld-humidity": {
        "name": "Handheld meter with humidity probe",
        "parts": {}
      },
      "handheld-air": {
        "name": "Handheld meter with air velocity probe",
        "parts": {}
      },
      "handheld-sound": {
        "name": "Handheld sound level meter",
        "parts": {}
      },
      "handheld-light": {
        "name": "Handheld meter with light sensor",
        "parts": {}
      },
      "handheld-water": {
        "name": "Handheld meter with water quality electrode",
        "parts": {}
      }
    },
  },

  notFound: {
    title: 'Page not found',
    text: 'The page you were looking for has moved or does not exist.',
    home: 'Go to the home page',
    search: 'Search the site',
  },
}

/** Every locale has this shape. Arrays of strings stay arrays. */
type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? Widen<U>[] : T extends object ? { [K in keyof T]: Widen<T[K]> } : T
export type Messages = Widen<typeof en>
export type DeepPartial<T> = T extends string ? string : T extends (infer U)[] ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T
