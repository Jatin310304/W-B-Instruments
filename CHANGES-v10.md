# W&B Instruments website: what changed in v10

v10 applies the *W&B Instruments Brand, SEO, GEO, AEO and Digital Marketing Strategy v1.0* (4 November 2026) to the corporate site. The 3D instrument hero, the two-tier header, the footer, the brand colours and the type are unchanged.

## Home page
- **SEO title** "Instrumentation & Calibration Australia | W&B Instruments" and a new meta description with the phone number.
- **H1** now carries the tagline "Precision Measurement. Expert Instrumentation. Trusted Calibration." above the brand signature "Measured. Calibrated. Trusted."
- **Hero copy** is the supporting statement: industrial measurement instruments, specialist technical expertise and dependable calibration support for industry.
- **CTAs** follow the brandbook web mock-up: **Book a calibration** (primary) and **See the range** (secondary).
- **Introduction** adds the supporting copy that names all four partner manufacturers.
- Section headings rewritten for search: "Instruments from leading manufacturers", "Infrared temperature measurement, contact and non-contact", "Traceable calibration, in our workshop or on your site".
- **New "Why customers choose W&B" band** (Signal colourway, graticule): the five messaging pillars, each with a verified proof figure, plus the verified customer statement (large public companies, universities, the CSIRO, small manufacturers).
- **New "Common questions" block**: six answer-first FAQs (pyrometer and thermal imaging calibration, on-site calibration, traceability, dispatch, manufacturers, choosing an instrument), each linking to the right page. Marked up as FAQPage.
- Better image alt text for the hero model and the calibration image.

## Site-wide
- **LinkedIn**: clickable LinkedIn logo in the header (desktop and mobile menu) and the footer ("Follow us"), linking to linkedin.com/company/wb-instruments.
- **Designer credit**: "Designed by" with a JSR logo in the bottom corner of the footer, linking to Jatin Singh Rajawat's LinkedIn profile in a new tab. Translated in all five languages.
- **Footer**: supporting tagline "Measurement you can trust, from people who know the instrument." under the tagline.
- **Page-level SEO titles and meta descriptions** for About, Products, each product group, Humidity, Pressure, Support, Industries, Resources, News and Contact (strategy section 21).
- **Structured data**: Organization + LocalBusiness (address, phone, email, ISO 9001:2015 credential, partner brands, LinkedIn sameAs), WebSite with SearchAction, BreadcrumbList on every inner page, Service on the Calibration & Testing page, FAQPage on the home page.
- **Search results pages** are now `noindex, follow`.
- `index.html` ships the final title, description, canonical and Open Graph tags, so crawlers that do not run JavaScript still see them. The email in the schema is read from `src/data/company.ts`, so it lives in one place.

## New page
- **Environmental Monitoring** (`/solutions/environmental-monitoring`): air velocity, humidity, sound, light, thermal comfort, heat stress, weather, data logging and pressure ranges from Senseca (Delta OHM). Added to the Products & Services menu, footer, search, sitemap and the HVAC, Environment and Occupational hygiene industry pages.

## Real-life photography
- Three industry photos from Wikimedia Commons, each credited on the image and on the Copyright page: induction heating of a steel bar (metals, C Paice, CC BY-SA 3.0), a glass-making furnace (glass, Paul Harrison, CC BY-SA 4.0) and a weather station (environment, USDA, public domain). They illustrate the industry only. Replace them with W&B's own workshop and site photos when the shoot is done.
- The four photos uploaded earlier were not used, because their file names suggest they come from other companies' websites.

## About page
- Purpose rewritten as the strategy's purpose statement; positioning line added to the locale file.

## Five languages
- The whole site is now available in **English, Italiano, Français, العربية (Arabic) and 日本語 (Japanese)**. Choose the language from the globe menu in the header (desktop and mobile). The page switches instantly in place, with no reload, and the 3D hero, motion and your current page stay as they are. The choice is remembered on the next visit.
- **Arabic** turns the whole layout right to left: navigation, text, forms, spacing and direction arrows all mirror. Letter-spacing is removed for Arabic so the letters join correctly.
- **Japanese** uses tuned line heights and phrase-aware line breaking.
- Translated: every page, menu, button, form field and error message, the search, the FAQ, the 3D viewer labels, the page titles and meta descriptions, and the final brand lines (for example, Italian "Misurato. Tarato. Affidabile.", French "Mesuré. Étalonné. Fiable.", Arabic "قياس. معايرة. ثقة.", Japanese "計測。校正。信頼。").
- Not translated, on purpose: brand, manufacturer and model names (Mikron, Impac, Status Instruments, Senseca, Giussani, Metaval), units and standards, and the bodies of the legal pages, which stay in English (the menu says so).
- Arabic and Japanese text uses the visitor's system fonts (for example Segoe UI, Geeza Pro, Yu Gothic, Hiragino). The brand fonts Barlow and IBM Plex have no Arabic or Japanese letters.
- The translations were written for this build and have not been reviewed by a native speaker. Have each language checked by a native speaker, ideally with technical knowledge, before launch. The source of every language is one file: `src/i18n/locales/it.ts`, `fr.ts`, `ar.ts`, `ja.ts`.

## Brand lines
- Tagline "Precision Measurement. Expert Instrumentation. Trusted Calibration.", signature "Measured. Calibrated. Trusted." and supporting statement "Industrial measurement instruments, specialist technical expertise and dependable calibration support for industry." are used in the hero, the About page, the footer and the structured data.
- Brand copy no longer presents W&B as serving Australian industry only. The real location facts (Kilsyth, Victoria) and local search terms stay.

## Backend
- New `server/` folder: a Node.js backend that serves the website and makes the **contact and careers forms work for real**. Enquiries are saved and emailed to sales@wandbinstruments.com with the customer as reply-to, and the customer gets a confirmation email with a reference number. Careers applications arrive with the CV attached (PDF or Word, up to 5 MB, content-checked).
- Spam and abuse protection (honeypot, rate limit, origin check, size limits), security headers and a Content Security Policy.
- Ready for any Node host or Docker (`Dockerfile` included). Settings in `server/.env.example`; tests with `npm run test:server`.
- Needs from W&B before launch: SMTP details for the sales@ mailbox, and where the site will be hosted.

## Still to confirm (not changed on the site)
- **Translations**: native-speaker review of Italian, French, Arabic and Japanese before launch.
- **Years in business**: the site still says 38 years, as published. W&B's own 2019 news post implies about 46. Confirm the founding year.
- **Email** is now sales@wandbinstruments.com everywhere (contact page, footer, legal pages, schema). Check the domain is set up for mail.
- Pre-rendering, 301 redirects from the old site and Search Console set-up happen at deployment (strategy section 22).
