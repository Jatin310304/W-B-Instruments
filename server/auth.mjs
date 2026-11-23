import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

/**
 * Admin sign-in for the content panel. Accounts come from ADMIN_USERS in server/.env:
 *   ADMIN_USERS=priya:a-long-password,office:another-long-password
 * A password can also be stored hashed (run `npm run hash-password`), written as name:scrypt$salt$hash.
 * The session is a signed, HttpOnly, SameSite=Strict cookie that lasts SESSION_HOURS (default 8).
 */
const COOKIE = 'wb_admin'
const MIN_PASSWORD = 10
const PLACEHOLDER = /change[-_ ]?me|placeholder|password123/i

export function parseUsers(spec = '') {
  const users = new Map()
  for (const pair of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const i = pair.indexOf(':')
    if (i < 1) continue
    const name = pair.slice(0, i).trim().toLowerCase()
    const secret = pair.slice(i + 1).trim()
    if (secret.startsWith('scrypt$') || (secret.length >= MIN_PASSWORD && !PLACEHOLDER.test(secret))) users.set(name, secret)
  }
  return users
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `scrypt$${salt}$${scryptSync(password, salt, 32).toString('hex')}`
}

function checkPassword(stored, given) {
  if (stored.startsWith('scrypt$')) {
    const [, salt, hash] = stored.split('$')
    const a = Buffer.from(hash, 'hex')
    const b = scryptSync(given, salt, a.length)
    return a.length === b.length && timingSafeEqual(a, b)
  }
  const a = createHmac('sha256', 'cmp').update(stored).digest()
  const b = createHmac('sha256', 'cmp').update(given).digest()
  return timingSafeEqual(a, b)
}

export function createAuth({ users: spec, secret, hours = 8, secureCookie = false, log = console }) {
  const users = parseUsers(spec)
  let key = secret
  if (!key || key.length < 32 || PLACEHOLDER.test(key)) {
    key = randomBytes(32).toString('hex')
    if (users.size) log.warn?.('[admin] SESSION_SECRET is not set (or too short): using a random one, so everyone is signed out when the server restarts.')
  }
  const sign = (payload) => createHmac('sha256', key).update(payload).digest('base64url')
  const ttl = hours * 60 * 60 * 1000

  const readCookie = (req) => {
    const raw = req.get('cookie') ?? ''
    for (const part of raw.split(';')) {
      const [k, ...v] = part.trim().split('=')
      if (k === COOKIE) return decodeURIComponent(v.join('='))
    }
    return ''
  }
  const verify = (token) => {
    const [payload, sig] = String(token).split('.')
    if (!payload || !sig) return null
    const good = Buffer.from(sign(payload)); const got = Buffer.from(sig)
    if (good.length !== got.length || !timingSafeEqual(good, got)) return null
    try {
      const s = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
      return s.exp > Date.now() && users.has(s.u) ? s : null
    } catch { return null }
  }
  const cookie = (value, maxAgeSec) => `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${secureCookie ? '; Secure' : ''}`

  return {
    enabled: users.size > 0,
    login(username, password) {
      const name = String(username ?? '').trim().toLowerCase()
      const stored = users.get(name)
      // Always do the work, so a wrong user name takes as long as a wrong password.
      const ok = checkPassword(stored ?? 'scrypt$00$' + '00'.repeat(32), String(password ?? '')) && Boolean(stored)
      if (!ok) return null
      const payload = Buffer.from(JSON.stringify({ u: name, exp: Date.now() + ttl })).toString('base64url')
      return { user: name, cookie: cookie(`${payload}.${sign(payload)}`, Math.floor(ttl / 1000)) }
    },
    logoutCookie: () => cookie('', 0),
    /** Express middleware: lets signed-in admins through, answers 401 otherwise. */
    require(req, res, next) {
      const s = verify(readCookie(req))
      if (!s) return res.status(401).json({ ok: false, error: 'signin' })
      req.admin = s.u
      next()
    },
    session: (req) => verify(readCookie(req)),
  }
}
