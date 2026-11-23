import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import path from 'node:path'
import { clean, EMAIL } from './validate.mjs'

/**
 * Content that office staff publish from the admin panel (/admin): news posts and vlogs, and job openings.
 * Kept in one JSON file (server/data/content.json) plus uploaded pictures and videos in server/data/uploads/.
 * Small, easy to back up, no database to run.
 */
export const POST_CATEGORIES = ['announcement', 'launch', 'industry', 'exhibition', 'technical', 'insight', 'event']
export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Casual', 'Internship']
const DATE = /^\d{4}-\d{2}-\d{2}$/
const UPLOAD = /^\/uploads\/[a-f0-9]{24}\.(jpg|png|webp|gif|mp4|webm)$/
const IMAGE_UPLOAD = /^\/uploads\/[a-f0-9]{24}\.(jpg|png|webp|gif)$/
const SITE_IMAGE = /^site:[a-z0-9-]{2,40}$/
const YOUTUBE = /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,20}/
const VIMEO = /^https:\/\/(www\.|player\.)?vimeo\.com\/(video\/)?\d{5,12}/
const truthy = (v) => v === true || v === 'true' || v === 'on' || v === 1

export const today = () => new Date().toISOString().slice(0, 10)

export function slugify(s) {
  const slug = String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70)
  return slug || 'post'
}

/** Keeps paragraphs (blank lines) but strips control characters. Shown on the site as plain text, never as HTML. */
const cleanBody = (v) => (typeof v === 'string' ? v : '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()

/** Card summary: the one staff wrote, else the start of the post. */
export function autoExcerpt(p) {
  if (p.excerpt) return p.excerpt
  const first = (p.body ?? '').split(/\n\s*\n/)[0].replace(/^[-•*]\s+/gm, '').replace(/\s+/g, ' ').trim()
  return first.length > 200 ? first.slice(0, 197).replace(/\s+\S*$/, '') + '…' : first
}

export function validatePost(b = {}) {
  const v = {
    title: clean(b.title), category: clean(b.category) || 'announcement', date: clean(b.date) || today(), author: clean(b.author),
    excerpt: clean(b.excerpt), body: cleanBody(b.body), image: clean(b.image), imageAlt: clean(b.imageAlt), video: clean(b.video),
    published: truthy(b.published),
  }
  const e = {}
  if (v.title.length < 3) e.title = 'Please give the post a title (at least 3 characters).'
  else if (v.title.length > 160) e.title = 'The title is too long (160 characters at most).'
  if (!POST_CATEGORIES.includes(v.category)) e.category = 'Please choose a category.'
  if (!DATE.test(v.date) || Number.isNaN(Date.parse(v.date))) e.date = 'Please pick a date.'
  if (v.author.length > 80) e.author = 'The author name is too long.'
  if (v.excerpt.length > 300) e.excerpt = 'The summary is too long (300 characters at most).'
  if (v.body.length < 10) e.body = 'Please write the post (at least a sentence).'
  else if (v.body.length > 20000) e.body = 'The post is too long (20,000 characters at most).'
  if (v.image && !IMAGE_UPLOAD.test(v.image) && !SITE_IMAGE.test(v.image)) e.image = 'Please upload a picture, or choose one of the standard pictures.'
  if (v.imageAlt.length > 160) e.imageAlt = 'The picture description is too long.'
  if (v.video && !(YOUTUBE.test(v.video) || VIMEO.test(v.video) || UPLOAD.test(v.video))) e.video = 'Paste a YouTube or Vimeo link, or upload an MP4 video.'
  return { value: v, errors: e }
}

export function validateJob(b = {}) {
  const v = {
    title: clean(b.title), location: clean(b.location), type: clean(b.type) || 'Full-time', description: cleanBody(b.description),
    applyEmail: clean(b.applyEmail).toLowerCase(), closingDate: clean(b.closingDate), published: truthy(b.published),
  }
  const e = {}
  if (v.title.length < 3) e.title = 'Please give the job a title.'
  else if (v.title.length > 120) e.title = 'The job title is too long (120 characters at most).'
  if (!v.location) e.location = 'Please say where the job is based, e.g. Kilsyth, VIC.'
  else if (v.location.length > 120) e.location = 'The location is too long.'
  if (v.type.length > 40) e.type = 'The job type is too long.'
  if (v.description.length < 20) e.description = 'Please describe the job (at least a couple of sentences).'
  else if (v.description.length > 10000) e.description = 'The description is too long (10,000 characters at most).'
  if (v.applyEmail && !EMAIL.test(v.applyEmail)) e.applyEmail = 'That email address does not look right.'
  if (v.closingDate && (!DATE.test(v.closingDate) || Number.isNaN(Date.parse(v.closingDate)))) e.closingDate = 'Please pick a closing date, or leave it empty.'
  return { value: v, errors: e }
}

/** Uploaded media: the real file content decides the type, never the file name. */
export function mediaKind(buf) {
  if (!buf || buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', kind: 'image' }
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png', kind: 'image' }
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') return { ext: 'webp', kind: 'image' }
  if (buf.subarray(0, 4).toString('latin1') === 'GIF8') return { ext: 'gif', kind: 'image' }
  if (buf.subarray(4, 8).toString('latin1') === 'ftyp') return { ext: 'mp4', kind: 'video' }
  if (buf.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return { ext: 'webm', kind: 'video' }
  return null
}

export function createCms(dir) {
  const file = path.join(dir, 'content.json')
  const uploads = path.join(dir, 'uploads')
  mkdirSync(uploads, { recursive: true })
  let data = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { posts: [], jobs: [] }
  data.posts ??= []; data.jobs ??= []
  const persist = () => {
    const tmp = `${file}.${process.pid}.tmp`
    writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 })
    renameSync(tmp, file) // atomic: a crash never leaves half a file
  }
  const uniqueId = (title, list) => {
    const base = slugify(title)
    let id = base
    for (let i = 2; list.some((x) => x.id === id); i++) id = `${base}-${i}`
    return id
  }
  const collection = (key) => ({
    all: () => [...data[key]].sort((a, b) => (b.date ?? b.updatedAt).localeCompare(a.date ?? a.updatedAt)),
    get: (id) => data[key].find((x) => x.id === id),
    create(value, by) {
      const now = new Date().toISOString()
      const item = { id: uniqueId(value.title, data[key]), ...value, createdAt: now, updatedAt: now, updatedBy: by }
      data[key].push(item); persist(); return item
    },
    update(id, value, by) {
      const i = data[key].findIndex((x) => x.id === id)
      if (i < 0) return null
      data[key][i] = { ...data[key][i], ...value, id, updatedAt: new Date().toISOString(), updatedBy: by }
      persist(); return data[key][i]
    },
    remove(id) {
      const before = data[key].length
      data[key] = data[key].filter((x) => x.id !== id)
      if (data[key].length !== before) { persist(); return true }
      return false
    },
  })
  const posts = collection('posts')
  const jobs = collection('jobs')
  const strip = ({ updatedBy, createdAt, ...x }) => x
  return {
    uploadsDir: uploads,
    posts,
    jobs,
    /** What the public website reads: published items only, jobs past their closing date hidden. */
    publicContent() {
      const t = today()
      return {
        posts: posts.all().filter((p) => p.published && p.date <= t).map((p) => ({ ...strip(p), excerpt: autoExcerpt(p) })),
        jobs: jobs.all().filter((j) => j.published && (!j.closingDate || j.closingDate >= t)).map(strip),
      }
    },
    newUploadName: (ext) => `${randomBytes(12).toString('hex')}.${ext}`,
  }
}
