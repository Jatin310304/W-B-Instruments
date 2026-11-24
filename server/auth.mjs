
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const COOKIE = 'wb_admin'
const MIN_PASSWORD = 10
const PLACEHOLDER = /change[-_ ]?me|placeholder|password123/i
const HASH_PATTERN = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{64})$/i
const DUMMY_SALT = '00112233445566778899aabbccddeeff'

export function parseUsers(spec = '') {
  const users = new Map()

  for (const pair of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const i = pair.indexOf(':')
    if (i < 1) continue

    const name = pair.slice(0, i).trim().toLowerCase()
    const stored = pair.slice(i + 1).trim()

    if (!/^[a-z0-9._-]{1,64}$/.test(name)) continue
    if (!HASH_PATTERN.test(stored)) continue

    users.set(name, stored)
  }

  return users
}

export function hashPassword(password) {
  const value = String(password ?? '')
  if (value.length < MIN_PASSWORD || value.length > 1024) {
    throw new Error('Password must contain 10 to 1024 characters.')
  }

  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(value, salt, 32)

  return `scrypt$${salt}$${hash.toString('hex')}`
}

function checkPassword(stored, given) {
  const match = HASH_PATTERN.exec(stored ?? '')

  if (!match) {
    // Perform hashing work for unknown users.
    scryptSync(given, DUMMY_SALT, 32)
    return false
  }

  const [, salt, expectedHex] = match
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = scryptSync(given, salt, 32)

  return timingSafeEqual(expected, actual)
}

export function createAuth({
  users: spec,
  secret,
  hours = 8,
  secureCookie = false,
  log = console,
}) {
  const users = parseUsers(spec)

  let key = secret

  if (!key || key.length < 32 || PLACEHOLDER.test(key)) {
    key = randomBytes(32).toString('hex')

    if (users.size) {
      log.warn?.(
        '[admin] SESSION_SECRET is missing or too short. Sessions will reset when the server restarts.'
      )
    }
  }

  const sign = (payload) =>
    createHmac('sha256', key).update(payload).digest('base64url')

  const ttl = hours * 60 * 60 * 1000

  const readCookie = (req) => {
    const raw = req.get('cookie') ?? ''

    for (const part of raw.split(';')) {
      const [k, ...v] = part.trim().split('=')

      if (k === COOKIE) {
        try {
          return decodeURIComponent(v.join('='))
        } catch {
          return ''
        }
      }
    }

    return ''
  }

  const verify = (token) => {
    const [payload, sig] = String(token).split('.')
    if (!payload || !sig) return null

    const good = Buffer.from(sign(payload))
    const got = Buffer.from(sig)

    if (good.length !== got.length || !timingSafeEqual(good, got)) {
      return null
    }

    try {
      const session = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8')
      )

      return session.exp > Date.now() && users.has(session.u)
        ? session
        : null
    } catch {
      return null
    }
  }

  const cookie = (value, maxAgeSec) =>
    `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${secureCookie ? '; Secure' : ''}`

  return {
    enabled: users.size > 0,

    login(username, password) {
      const name = String(username ?? '').trim().toLowerCase()
      const given = String(password ?? '')

      if (given.length > 1024) {
        return null
      }

      const stored = users.get(name)
      const ok = checkPassword(stored, given)

      if (!ok || !stored) return null

      const payload = Buffer.from(
        JSON.stringify({
          u: name,
          exp: Date.now() + ttl,
        })
      ).toString('base64url')

      return {
        user: name,
        cookie: cookie(
          `${payload}.${sign(payload)}`,
          Math.floor(ttl / 1000)
        ),
      }
    },

    logoutCookie: () => cookie('', 0),

    require(req, res, next) {
      const session = verify(readCookie(req))

      if (!session) {
        return res.status(401).json({ ok: false, error: 'signin' })
      }

      req.admin = session.u
      next()
    },

    session: (req) => verify(readCookie(req)),
  }
}
