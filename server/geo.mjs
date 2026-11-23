/**
 * Visitor country from the IP address, used to pre-select the site's country/region (Australia or International).
 *
 * 1. Most hosts and CDNs already resolve the IP to a country and pass it in a header (Cloudflare, CloudFront,
 *    Vercel, Google App Engine, Azure Front Door rules, Nginx/Caddy with a GeoIP module). That is used first: no
 *    extra lookup and nothing leaves the server.
 * 2. Otherwise, if GEOIP_URL is set, the server asks that service, e.g. GEOIP_URL=https://ipapi.co/{ip}/country/
 *    (the reply must be the two-letter code as plain text, or JSON with a country_code / countryCode / country field).
 *    Results are cached in memory for a day. Name the provider in the Privacy Notice, because the IP address is sent to it.
 * 3. If neither gives an answer the browser falls back to the device time zone.
 */
const HEADERS = ['cf-ipcountry', 'cloudfront-viewer-country', 'x-vercel-ip-country', 'x-appengine-country', 'x-country-code', 'x-geoip-country', 'x-client-geo-country']
const CODE = /^[A-Z]{2}$/
const cache = new Map()
const DAY = 24 * 60 * 60 * 1000

export function countryFromHeaders(req) {
  for (const h of HEADERS) {
    const v = String(req.get(h) ?? '').trim().toUpperCase()
    if (CODE.test(v) && v !== 'XX' && v !== 'T1') return v
  }
  return null
}

const isPrivate = (ip) => !ip || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc|fd|fe80|::ffff:127\.)/i.test(ip)

export async function lookupCountry(ip, url, fetchImpl = fetch) {
  if (!url || isPrivate(ip)) return null
  const hit = cache.get(ip)
  if (hit && Date.now() - hit.at < DAY) return hit.country
  try {
    const res = await fetchImpl(url.replace('{ip}', encodeURIComponent(ip)), { signal: AbortSignal.timeout(1500), headers: { accept: 'application/json, text/plain' } })
    if (!res.ok) return null
    const text = (await res.text()).trim()
    let code = text.toUpperCase()
    if (!CODE.test(code)) {
      try {
        const j = JSON.parse(text)
        code = String(j.country_code ?? j.countryCode ?? j.country ?? '').toUpperCase()
      } catch {
        code = ''
      }
    }
    const country = CODE.test(code) ? code : null
    if (cache.size > 5000) cache.clear()
    cache.set(ip, { country, at: Date.now() })
    return country
  } catch {
    return null
  }
}

export async function visitorCountry(req, config) {
  const fromHeader = countryFromHeaders(req)
  if (fromHeader) return { country: fromHeader, source: 'header' }
  const looked = await lookupCountry(req.ip, config.geoipUrl)
  return looked ? { country: looked, source: 'lookup' } : { country: null, source: 'none' }
}
