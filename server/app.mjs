import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import { createReadStream, existsSync, openSync, readSync, closeSync, readdirSync, readFileSync, renameSync, rmSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { validateEnquiry, validateCareers, cvKind } from './validate.mjs'
import { visitorCountry } from './geo.mjs'
import { validatePost, validateJob, mediaKind, POST_CATEGORIES, JOB_TYPES } from './cms.mjs'

const CV_MAX = 5 * 1024 * 1024
const IMAGE_MAX = 8 * 1024 * 1024
const here = path.dirname(fileURLToPath(import.meta.url))

/** Builds the Express app. Kept separate from index.mjs so the tests can run it without a port or SMTP. */
export function createApp({ config, store, mailer, cms, auth, log = console }) {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', config.trustProxy)

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'blob:'],
          'media-src': ["'self'", 'blob:'],
          'font-src': ["'self'", 'data:'],
          'connect-src': ["'self'"],
          'worker-src': ["'self'", 'blob:'],
          // Vlogs: only YouTube (privacy-enhanced) and Vimeo players may be embedded.
          'frame-src': ['https://www.youtube-nocookie.com', 'https://player.vimeo.com'],
          'frame-ancestors': ["'none'"],
          'form-action': ["'self'"],
          'upgrade-insecure-requests': config.allowedOrigins.some((o) => o.startsWith('https:')) ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  )
  app.use(compression())

  /* ---------- API ---------- */
  const api = express.Router()
  const limit = (max, windowMin = 15) => rateLimit({ windowMs: windowMin * 60 * 1000, limit: max, standardHeaders: 'draft-7', legacyHeaders: false, message: { ok: false, error: 'rate_limited' } })
  const formLimit = limit(20)
  const loginLimit = limit(10)
  const adminLimit = limit(600)

  // Changes may only come from the site itself (forms, and the admin panel).
  api.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') return next()
    const origin = req.get('origin')
    if (!origin) return next() // same-origin form posts from some browsers, and server-to-server tests
    const self = `${req.protocol}://${req.get('host')}`
    if (origin === self || config.allowedOrigins.includes(origin)) return next()
    return res.status(403).json({ ok: false, error: 'origin' })
  })

  api.get('/health', (_req, res) => res.json({ ok: true, mail: mailer.live ? 'smtp' : 'dry-run', admin: auth.enabled }))

  // Visitor country from the IP address, to pre-select Australia or International. Never stored.
  api.get('/geo', async (req, res) => {
    res.set('Cache-Control', 'private, no-store')
    res.json({ ok: true, ...(await visitorCountry(req, config)) })
  })

  // Published news posts, vlogs and job openings, read by the News, Home and Careers pages.
  api.get('/content', (_req, res) => {
    res.set('Cache-Control', 'public, max-age=60')
    res.json({ ok: true, ...cms.publicContent() })
  })

  api.post('/enquiry', formLimit, express.json({ limit: '32kb' }), async (req, res) => {
    const { value, errors } = validateEnquiry(req.body)
    if (value.website) return res.json({ ok: true, ref: store.newRef() }) // honeypot: pretend success, keep nothing
    if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors })
    const ref = store.newRef()
    const meta = { at: new Date().toISOString(), ip: req.ip, referer: req.get('referer') ?? '', ua: req.get('user-agent') ?? '' }
    const { website, ...record } = value
    store.save('enquiries', { ref, ...record, ...meta })
    try {
      await mailer.enquiry(ref, value, meta)
    } catch (err) {
      // The enquiry is already saved, so the customer still gets their reference. The team sees it in the log.
      log.error?.(`[mail] enquiry ${ref} not emailed: ${err.message}`)
      store.save('mail-failures', { ref, kind: 'enquiry', at: meta.at, error: err.message })
    }
    res.json({ ok: true, ref })
  })

  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: CV_MAX, files: 1, fields: 20, fieldSize: 16 * 1024 } })
  api.post('/careers', formLimit, (req, res, next) => {
    upload.single('cv')(req, res, (err) => {
      if (err?.code === 'LIMIT_FILE_SIZE') return res.status(422).json({ ok: false, errors: { cv: 'cvSize' } })
      if (err) return res.status(400).json({ ok: false, error: 'upload' })
      next()
    })
  }, async (req, res) => {
    const { value, errors } = validateCareers(req.body, req.file)
    if (value.website) return res.json({ ok: true, ref: store.newRef('JOB') })
    if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors })
    const ref = store.newRef('JOB')
    const meta = { at: new Date().toISOString(), ip: req.ip, ua: req.get('user-agent') ?? '' }
    let cv = null
    if (req.file) {
      const ext = cvKind(req.file.buffer)
      const safeName = `${ref}-${value.name.replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 40)}.${ext}`
      store.saveCv(ref, ext, req.file.buffer)
      cv = { filename: safeName, buffer: req.file.buffer }
    }
    const { website, ...record } = value
    store.save('careers', { ref, ...record, cv: cv ? `${ref}.${cvKind(req.file.buffer)}` : null, ...meta })
    try {
      await mailer.careers(ref, value, cv, meta)
    } catch (err) {
      log.error?.(`[mail] careers ${ref} not emailed: ${err.message}`)
      store.save('mail-failures', { ref, kind: 'careers', at: meta.at, error: err.message })
    }
    res.json({ ok: true, ref })
  })

  /* ---------- Admin (content panel at ADMIN_PATH, not linked from the site) ---------- */
  const admin = express.Router()
  admin.use(adminLimit)
  admin.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next() })
  admin.use((_req, res, next) => (auth.enabled ? next() : res.status(503).json({ ok: false, error: 'The admin panel is switched off. Set ADMIN_USERS in server/.env and restart.' })))

  admin.post('/login', loginLimit, express.json({ limit: '4kb' }), (req, res) => {
    const s = auth.login(req.body?.username, req.body?.password)
    if (!s) {
      log.warn?.(`[admin] failed sign-in for "${String(req.body?.username ?? '').slice(0, 40)}" from ${req.ip}`)
      return res.status(401).json({ ok: false, error: 'The user name or password is not right.' })
    }
    log.info?.(`[admin] ${s.user} signed in from ${req.ip}`)
    res.set('Set-Cookie', s.cookie).json({ ok: true, user: s.user })
  })
  admin.post('/logout', (_req, res) => res.set('Set-Cookie', auth.logoutCookie()).json({ ok: true }))
  admin.get('/me', (req, res) => {
    const s = auth.session(req)
    res.json(s ? { ok: true, user: s.u, categories: POST_CATEGORIES, jobTypes: JOB_TYPES, maxVideoMb: config.maxVideoMb } : { ok: false })
  })

  admin.use((req, res, next) => auth.require(req, res, next))

  const crud = (name, coll, validate) => {
    admin.get(`/${name}`, (_req, res) => res.json({ ok: true, items: coll.all() }))
    admin.post(`/${name}`, express.json({ limit: '128kb' }), (req, res) => {
      const { value, errors } = validate(req.body)
      if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors })
      const item = coll.create(value, req.admin)
      log.info?.(`[admin] ${req.admin} created ${name}/${item.id}`)
      res.status(201).json({ ok: true, item })
    })
    admin.put(`/${name}/:id`, express.json({ limit: '128kb' }), (req, res) => {
      if (!coll.get(req.params.id)) return res.status(404).json({ ok: false, error: 'not_found' })
      const { value, errors } = validate(req.body)
      if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors })
      const item = coll.update(req.params.id, value, req.admin)
      log.info?.(`[admin] ${req.admin} updated ${name}/${item.id}`)
      res.json({ ok: true, item })
    })
    admin.delete(`/${name}/:id`, (req, res) => {
      if (!coll.remove(req.params.id)) return res.status(404).json({ ok: false, error: 'not_found' })
      log.info?.(`[admin] ${req.admin} deleted ${name}/${req.params.id}`)
      res.json({ ok: true })
    })
  }
  crud('posts', cms.posts, validatePost)
  crud('jobs', cms.jobs, validateJob)

  // Pictures and videos for posts. Written to a temporary file first, so a large video never sits in memory.
  const tmpDir = path.join(cms.uploadsDir, '.incoming')
  mkdirSync(tmpDir, { recursive: true })
  const mediaUpload = multer({ dest: tmpDir, limits: { fileSize: config.maxVideoMb * 1024 * 1024, files: 1, fields: 5 } })
  admin.post('/upload', (req, res) => {
    mediaUpload.single('file')(req, res, (err) => {
      const drop = () => req.file && rmSync(req.file.path, { force: true })
      if (err?.code === 'LIMIT_FILE_SIZE') return res.status(422).json({ ok: false, error: `The file is too large. Videos can be up to ${config.maxVideoMb} MB; for longer videos, upload to YouTube and paste the link.` })
      if (err || !req.file) { drop(); return res.status(400).json({ ok: false, error: 'Please choose a file to upload.' }) }
      const head = Buffer.alloc(16)
      const fd = openSync(req.file.path, 'r'); readSync(fd, head, 0, 16, 0); closeSync(fd)
      const kind = mediaKind(head)
      if (!kind) { drop(); return res.status(422).json({ ok: false, error: 'Only JPG, PNG, WebP or GIF pictures and MP4 or WebM videos can be uploaded.' }) }
      if (kind.kind === 'image' && req.file.size > IMAGE_MAX) { drop(); return res.status(422).json({ ok: false, error: 'Pictures can be up to 8 MB. Please use a smaller picture.' }) }
      const name = cms.newUploadName(kind.ext)
      renameSync(req.file.path, path.join(cms.uploadsDir, name))
      log.info?.(`[admin] ${req.admin} uploaded ${name} (${Math.round(req.file.size / 1024)} KB)`)
      res.status(201).json({ ok: true, url: `/uploads/${name}`, kind: kind.kind })
    })
  })

  // The site's own pictures, offered in the panel as ready-made post images (stored as "site:<name>").
  admin.get('/site-images', (_req, res) => {
    const dir = path.join(config.distDir, 'assets')
    const want = new Set(config.siteImages)
    const items = existsSync(dir)
      ? readdirSync(dir).map((f) => [/^(.+)-[\w-]{8}\.(webp|jpg|png)$/.exec(f), f]).filter(([m]) => m && want.has(m[1])).map(([m, f]) => ({ name: m[1], url: `/assets/${f}` }))
      : []
    res.json({ ok: true, items })
  })

  // Enquiries and job applications received through the website, for staff who do not have the inbox.
  const KINDS = { enquiries: ['ref', 'at', 'type', 'subject', 'name', 'company', 'email', 'phone', 'locale', 'message'], careers: ['ref', 'at', 'area', 'role', 'name', 'email', 'phone', 'locale', 'cv', 'message'] }
  admin.get('/submissions/:kind', (req, res) => {
    const cols = KINDS[req.params.kind]
    if (!cols) return res.status(404).json({ ok: false, error: 'not_found' })
    const rows = store.read(req.params.kind).reverse()
    if (req.query.format === 'csv') {
      const cell = (v) => {
        let s = String(v ?? '')
        if (/^[=+\-@\t\r]/.test(s)) s = `'${s}` // stops spreadsheet formulas
        return `"${s.replace(/"/g, '""')}"`
      }
      const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n')
      return res.type('text/csv').attachment(`${req.params.kind}-${new Date().toISOString().slice(0, 10)}.csv`).send('﻿' + csv)
    }
    res.json({ ok: true, items: rows.map((r) => Object.fromEntries(cols.map((c) => [c, r[c]]))) })
  })
  admin.get('/cv/:file', (req, res) => {
    if (!/^JOB-\d{8}-[0-9A-F]{6}\.(pdf|doc|docx)$/.test(req.params.file)) return res.status(404).json({ ok: false, error: 'not_found' })
    const file = path.join(store.cvDir, req.params.file)
    if (!existsSync(file)) return res.status(404).json({ ok: false, error: 'not_found' })
    res.attachment(req.params.file)
    createReadStream(file).pipe(res)
  })

  api.use('/admin', admin)

  api.use((_req, res) => res.status(404).json({ ok: false, error: 'not_found' }))
  api.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') return res.status(400).json({ ok: false, error: 'bad_request' })
    log.error?.(err)
    res.status(500).json({ ok: false, error: 'server' })
  })
  app.use('/api', api)

  /* ---------- Uploaded media and the admin panel ---------- */
  app.use('/uploads', express.static(cms.uploadsDir, { maxAge: '7d', immutable: true, fallthrough: false, dotfiles: 'deny' }))
  app.use(config.adminPath, (_req, res, next) => { res.set('Cache-Control', 'no-cache'); res.set('X-Robots-Tag', 'noindex'); next() }, express.static(path.join(here, 'admin'), { index: 'index.html' }))

  /* ---------- Website ---------- */
  const index = path.join(config.distDir, 'index.html')
  if (existsSync(index)) {
    // Sitemap: the built one, plus every published news post.
    const builtSitemap = path.join(config.distDir, 'sitemap.xml')
    app.get('/sitemap.xml', (_req, res) => {
      if (!existsSync(builtSitemap)) return res.status(404).end()
      const xml = readFileSync(builtSitemap, 'utf8')
      const origin = /<loc>(https?:\/\/[^/<]+)/.exec(xml)?.[1] ?? ''
      const extra = cms.publicContent().posts.map((p) => `  <url><loc>${origin}/news/${p.id}</loc><lastmod>${p.date}</lastmod></url>`).join('\n')
      res.type('application/xml').set('Cache-Control', 'public, max-age=3600').send(extra ? xml.replace('</urlset>', `${extra}\n</urlset>`) : xml)
    })
    // Hashed assets never change, so they can be cached for a year. Everything else is revalidated.
    app.use('/assets', express.static(path.join(config.distDir, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }))
    app.use(express.static(config.distDir, { index: false, maxAge: '1h' }))
    // Single-page app: every other GET returns index.html and the client router shows the page (or its own 404 page).
    app.get('*', (_req, res) => res.set('Cache-Control', 'no-cache').sendFile(index))
  } else {
    app.get('/', (_req, res) => res.type('text').send('Website not built yet. Run "npm run build" in the project folder.'))
  }
  return app
}
