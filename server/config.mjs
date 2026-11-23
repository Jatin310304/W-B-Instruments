import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Loads KEY=value lines from server/.env if present. Real environment variables win. */
function loadDotEnv() {
  const file = path.join(root, 'server', '.env')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m || line.trim().startsWith('#')) continue
    const v = m[2].replace(/^(['"])(.*)\1$/, '$2')
    if (process.env[m[1]] === undefined) process.env[m[1]] = v
  }
}
loadDotEnv()

/** The company email lives in src/data/company.ts, the same source the website uses. */
const companyFile = path.join(root, 'src', 'data', 'company.ts')
const companySrc = existsSync(companyFile) ? readFileSync(companyFile, 'utf8') : ''
const companyEmail = process.env.COMPANY_EMAIL || (/email: '([^']+)'/.exec(companySrc)?.[1] ?? 'sales@example.com')
const companyPhone = /phone: '([^']+)'/.exec(companySrc)?.[1] ?? '+61 3 9729 2112'

const env = process.env
export const config = {
  root,
  port: Number(env.PORT ?? 8787),
  host: env.HOST ?? '0.0.0.0',
  /** Built website (npm run build). */
  distDir: path.resolve(root, env.DIST_DIR ?? 'dist'),
  /** Where submissions and CVs are stored. Keep outside the web root and back it up. */
  dataDir: path.resolve(root, env.DATA_DIR ?? 'server/data'),
  /** Public origin(s) allowed to post forms, comma separated, e.g. https://www.wandbinstruments.com.au */
  allowedOrigins: (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  trustProxy: env.TRUST_PROXY ?? 'loopback',
  /** Optional IP-to-country service, used only when the host or CDN does not send a country header. See server/geo.mjs. */
  geoipUrl: env.GEOIP_URL ?? '',
  mail: {
    host: env.SMTP_HOST ?? '',
    port: Number(env.SMTP_PORT ?? 587),
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER ?? '',
    pass: env.SMTP_PASS ?? '',
    from: env.MAIL_FROM ?? `W&B Instruments <${companyEmail}>`,
    /** Inbox that receives enquiries. */
    to: env.MAIL_TO ?? companyEmail,
    /** Inbox that receives careers applications. */
    careersTo: env.MAIL_CAREERS_TO ?? env.MAIL_TO ?? companyEmail,
    /** Send the customer a short confirmation email. */
    confirm: env.MAIL_CONFIRM !== 'false',
  },
  /** Content panel (/admin). name:password pairs, comma separated. Empty = panel switched off. */
  admin: {
    users: env.ADMIN_USERS ?? '',
    sessionSecret: env.SESSION_SECRET ?? '',
    sessionHours: Number(env.SESSION_HOURS ?? 8),
    secureCookie: env.COOKIE_SECURE ? env.COOKIE_SECURE === 'true' : (env.ALLOWED_ORIGINS ?? '').includes('https:'),
  },
  /** Address of the content panel. Not linked anywhere on the site; choose something hard to guess. */
  adminPath: '/' + (String(env.ADMIN_PATH ?? '').replace(/[^\w-]/g, '') || 'admin'),
  /** Largest video that can be uploaded in the panel. Longer videos: YouTube or Vimeo link. */
  maxVideoMb: Number(env.MAX_VIDEO_MB ?? 200),
  /** Site pictures staff can pick as a post image (must exist in src/assets/img). */
  siteImages: ['calibration-lab', 'hero', 'macro', 'pipes', 'tanks', 'compare', 'instrument-poster', 'gauge-check-poster', 'photo-metals', 'photo-glass', 'photo-weather', 'ir-temperature', 'ir-metal', 'dry-block-calibrators', 'handheld-thermometers', 'pressure-measurement', 'meteorological', 'data-logging', 'business-flow', 'business-valves', 'business-forging', 'business-casting'],
  company: { email: companyEmail, phone: companyPhone, name: 'W&B Instruments' },
}
