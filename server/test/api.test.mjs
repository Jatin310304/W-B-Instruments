import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createApp } from '../app.mjs'
import { createStore } from '../store.mjs'
import { createCms } from '../cms.mjs'
import { createAuth } from '../auth.mjs'

const dataDir = mkdtempSync(path.join(tmpdir(), 'wb-test-'))
const sent = []
const mailer = { live: false, enquiry: async (ref, v) => sent.push({ kind: 'enquiry', ref, v }), careers: async (ref, v, cv) => sent.push({ kind: 'careers', ref, v, cv }) }
const config = { distDir: path.join(dataDir, 'no-dist'), allowedOrigins: ['https://www.wandbinstruments.com.au'], trustProxy: false, maxVideoMb: 1, siteImages: [], adminPath: '/staff-test' }
const auth = createAuth({ users: 'editor:correct-horse-battery', secret: 'x'.repeat(40), log: {} })
let server, base
before(async () => {
  const app = createApp({ config, store: createStore(dataDir), mailer, cms: createCms(dataDir), auth, log: { error() {}, info() {} } })
  await new Promise((r) => { server = app.listen(0, '127.0.0.1', r) })
  base = `http://127.0.0.1:${server.address().port}`
})
after(() => { server.close(); rmSync(dataDir, { recursive: true, force: true }) })

const good = { name: 'Dana Lee', company: 'Acme Steel', email: 'dana@acme.com.au', phone: '+61 3 9729 2112', type: 'calibration', subject: 'service:calibration', message: 'Please calibrate two pyrometers.', consent: true, website: '', locale: 'ja' }
const post = (p, body, headers = {}) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) })

test('health', async () => {
  const r = await fetch(base + '/api/health'); assert.equal(r.status, 200); assert.equal((await r.json()).ok, true)
})

test('valid enquiry is saved, emailed and gets a reference', async () => {
  const r = await post('/api/enquiry', good)
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.match(j.ref, /^WB-\d{8}-[0-9A-F]{6}$/)
  const log = readFileSync(path.join(dataDir, 'enquiries.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  assert.equal(log.at(-1).ref, j.ref); assert.equal(log.at(-1).locale, 'ja'); assert.equal('website' in log.at(-1), false)
  assert.equal(sent.at(-1).ref, j.ref)
})

test('invalid enquiry returns field errors', async () => {
  const r = await post('/api/enquiry', { ...good, email: 'nope', type: 'x', message: 'short', consent: false })
  assert.equal(r.status, 422)
  assert.deepEqual(Object.keys((await r.json()).errors).sort(), ['consent', 'email', 'message', 'type'])
})

test('honeypot is accepted silently and not stored', async () => {
  const before = sent.length
  const r = await post('/api/enquiry', { ...good, website: 'http://spam' })
  assert.equal(r.status, 200); assert.equal(sent.length, before)
})

test('foreign origin is refused, allowed origin passes', async () => {
  assert.equal((await post('/api/enquiry', good, { Origin: 'https://evil.example' })).status, 403)
  assert.equal((await post('/api/enquiry', good, { Origin: 'https://www.wandbinstruments.com.au' })).status, 200)
})

test('malformed JSON is a 400', async () => {
  const r = await fetch(base + '/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' })
  assert.equal(r.status, 400)
})

const form = (fields, file) => { const f = new FormData(); for (const [k, v] of Object.entries(fields)) f.append(k, String(v)); if (file) f.append('cv', file.blob, file.name); return f }
const app1 = { name: 'Sam Ito', email: 'sam@example.com', phone: '', area: 'calibration', message: 'I have ten years in calibration labs.', consent: true, website: '', locale: 'fr' }

test('careers with a real PDF stores the CV and attaches it', async () => {
  const pdf = new Blob([Buffer.from('%PDF-1.4\n%test\n')], { type: 'application/pdf' })
  const r = await fetch(base + '/api/careers', { method: 'POST', body: form(app1, { blob: pdf, name: 'cv.pdf' }) })
  assert.equal(r.status, 200)
  const { ref } = await r.json(); assert.match(ref, /^JOB-/)
  assert.ok(readdirSync(path.join(dataDir, 'cv')).includes(`${ref}.pdf`))
  assert.match(sent.at(-1).cv.filename, /\.pdf$/)
})

test('careers rejects a file that only pretends to be a PDF', async () => {
  const fake = new Blob([Buffer.from('MZ fake exe')], { type: 'application/pdf' })
  const r = await fetch(base + '/api/careers', { method: 'POST', body: form(app1, { blob: fake, name: 'cv.pdf' }) })
  assert.equal(r.status, 422); assert.equal((await r.json()).errors.cv, 'cvType')
})

test('careers rejects files over 5 MB', async () => {
  const big = new Blob([Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(5 * 1024 * 1024 + 10)])], { type: 'application/pdf' })
  const r = await fetch(base + '/api/careers', { method: 'POST', body: form(app1, { blob: big, name: 'cv.pdf' }) })
  assert.equal(r.status, 422); assert.equal((await r.json()).errors.cv, 'cvSize')
})

test('security headers are set', async () => {
  const r = await fetch(base + '/api/health')
  assert.ok(r.headers.get('content-security-policy')); assert.equal(r.headers.get('x-powered-by'), null)
})

test('geo: country comes from the CDN header, else null', async () => {
  let r = await fetch(base + '/api/geo', { headers: { 'CF-IPCountry': 'au' } })
  assert.deepEqual(await r.json(), { ok: true, country: 'AU', source: 'header' })
  r = await fetch(base + '/api/geo', { headers: { 'CloudFront-Viewer-Country': 'IT' } })
  assert.equal((await r.json()).country, 'IT')
  r = await fetch(base + '/api/geo')
  assert.deepEqual(await r.json(), { ok: true, country: null, source: 'none' })
})

test('geo: lookup service reply is parsed (text or JSON)', async () => {
  const { lookupCountry } = await import('../geo.mjs')
  const text = async () => ({ ok: true, text: async () => 'JP\n' })
  const json = async () => ({ ok: true, text: async () => '{"country_code":"fr"}' })
  assert.equal(await lookupCountry('203.0.113.7', 'https://geo.example/{ip}', text), 'JP')
  assert.equal(await lookupCountry('203.0.113.8', 'https://geo.example/{ip}', json), 'FR')
  assert.equal(await lookupCountry('10.0.0.1', 'https://geo.example/{ip}', text), null)
})

/* ---------- Content panel ---------- */
const json = (method, p, body, cookie) => fetch(base + p, { method, headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, body: body && JSON.stringify(body) })
const signIn = async () => (await json('POST', '/api/admin/login', { username: 'Editor', password: 'correct-horse-battery' })).headers.get('set-cookie').split(';')[0]

test('admin: wrong password refused, placeholder passwords never enable an account', async () => {
  assert.equal((await json('POST', '/api/admin/login', { username: 'editor', password: 'nope-nope-nope' })).status, 401)
  assert.equal((await fetch(base + '/api/admin/posts')).status, 401)
  assert.equal(createAuth({ users: 'admin:CHANGE_ME_TO_A_LONG_PASSWORD', log: {} }).enabled, false)
  assert.equal(createAuth({ users: 'admin:short', log: {} }).enabled, false)
})

test('admin: publish a post and a job, the site reads them, drafts stay hidden', async () => {
  const c = await signIn()
  let r = await json('POST', '/api/admin/posts', { title: 'Visit us at Austech 2027', category: 'exhibition', date: '2026-01-10', body: 'Find us on stand 12.\n\nWe will show the new pyrometers.', image: 'site:calibration-lab', video: 'https://www.youtube.com/watch?v=abcdefghijk', published: true }, c)
  assert.equal(r.status, 201)
  const post = (await r.json()).item
  assert.equal(post.id, 'visit-us-at-austech-2027'); assert.equal(post.updatedBy, 'editor')
  await json('POST', '/api/admin/posts', { title: 'Draft post', body: 'Not ready yet, still writing.', published: false }, c)
  r = await json('POST', '/api/admin/jobs', { title: 'Calibration technician', location: 'Kilsyth, VIC', type: 'Full-time', description: 'Calibrate temperature and pressure instruments in our lab.', applyEmail: 'careers@example.com', published: true }, c)
  assert.equal(r.status, 201)
  const pub = await (await fetch(base + '/api/content')).json()
  assert.deepEqual(pub.posts.map((p) => p.id), ['visit-us-at-austech-2027'])
  assert.equal(pub.jobs[0].title, 'Calibration technician'); assert.equal('updatedBy' in pub.jobs[0], false)
  r = await json('PUT', `/api/admin/posts/${post.id}`, { ...post, published: false }, c)
  assert.equal(r.status, 200)
  assert.equal((await (await fetch(base + '/api/content')).json()).posts.length, 0)
  assert.equal((await json('DELETE', `/api/admin/posts/${post.id}`, null, c)).status, 200)
})

test('admin: post validation explains in plain words', async () => {
  const c = await signIn()
  const r = await json('POST', '/api/admin/posts', { title: 'x', body: 'short', image: 'https://evil.example/a.png', video: 'https://evil.example/v' }, c)
  assert.equal(r.status, 422)
  assert.deepEqual(Object.keys((await r.json()).errors).sort(), ['body', 'image', 'title', 'video'])
})

test('admin: uploads check the real file type and are served back', async () => {
  const c = await signIn()
  const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex')
  const f = new FormData(); f.append('file', new Blob([png]), 'photo.png')
  let r = await fetch(base + '/api/admin/upload', { method: 'POST', headers: { cookie: c }, body: f })
  assert.equal(r.status, 201)
  const { url } = await r.json(); assert.match(url, /^\/uploads\/[a-f0-9]{24}\.png$/)
  assert.equal((await fetch(base + url)).status, 200)
  const bad = new FormData(); bad.append('file', new Blob([Buffer.from('MZ not a picture at all')]), 'photo.png')
  r = await fetch(base + '/api/admin/upload', { method: 'POST', headers: { cookie: c }, body: bad })
  assert.equal(r.status, 422)
})

test('admin: enquiries can be listed and exported as CSV', async () => {
  const c = await signIn()
  const r = await fetch(base + '/api/admin/submissions/enquiries', { headers: { cookie: c } })
  assert.ok((await r.json()).items.length >= 1)
  const csv = await (await fetch(base + '/api/admin/submissions/enquiries?format=csv', { headers: { cookie: c } })).text()
  assert.match(csv, /^\uFEFF?ref,at,type/)
})
