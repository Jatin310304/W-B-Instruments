/** Server-side validation. Mirrors src/components/Forms.tsx so the rules never disagree. */
export const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/
export const PHONE = /^[+()\d\s.\-/]{6,30}$/
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
export const clean = (v) => (typeof v === 'string' ? v : '').replace(CONTROL, '').trim()

export const ENQUIRY_TYPES = ['product', 'quote', 'technical', 'application', 'calibration', 'datasheet', 'business', 'general']
export const CAREER_AREAS = ['calibration', 'technical', 'operations', 'other']
export const LOCALES = ['en-AU', 'it', 'fr', 'ar', 'ja']
const SUBJECT = /^(service|solution|product|business):[a-z0-9-]{1,80}$/

const truthy = (v) => v === true || v === 'true' || v === 'on'

export function validateEnquiry(body) {
  const b = body ?? {}
  const v = {
    name: clean(b.name), company: clean(b.company), email: clean(b.email).toLowerCase(), phone: clean(b.phone),
    type: clean(b.type), subject: clean(b.subject), message: clean(b.message), consent: truthy(b.consent),
    locale: LOCALES.includes(b.locale) ? b.locale : 'en-AU', website: clean(b.website),
  }
  const e = {}
  if (v.name.length < 2 || v.name.length > 120) e.name = 'name'
  if (v.company.length > 160) e.company = 'tooLong'
  if (!v.email) e.email = 'email'
  else if (v.email.length > 200 || !EMAIL.test(v.email)) e.email = 'emailInvalid'
  if (v.phone && !PHONE.test(v.phone)) e.phone = 'phone'
  if (!ENQUIRY_TYPES.includes(v.type)) e.type = 'type'
  if (v.subject && !SUBJECT.test(v.subject)) e.subject = 'subject'
  if (v.message.length < 10) e.message = 'message'
  else if (v.message.length > 5000) e.message = 'messageLong'
  if (!v.consent) e.consent = 'consent'
  return { value: v, errors: e }
}

export function validateCareers(body, file) {
  const b = body ?? {}
  const v = {
    name: clean(b.name), email: clean(b.email).toLowerCase(), phone: clean(b.phone), area: clean(b.area),
    role: clean(b.role).slice(0, 120), message: clean(b.message), consent: truthy(b.consent),
    locale: LOCALES.includes(b.locale) ? b.locale : 'en-AU', website: clean(b.website),
  }
  const e = {}
  if (v.name.length < 2 || v.name.length > 120) e.name = 'name'
  if (!v.email) e.email = 'email'
  else if (v.email.length > 200 || !EMAIL.test(v.email)) e.email = 'emailInvalid'
  if (v.phone && !PHONE.test(v.phone)) e.phone = 'phone'
  if (!CAREER_AREAS.includes(v.area)) e.area = 'area'
  if (v.message.length < 10) e.message = 'message'
  else if (v.message.length > 5000) e.message = 'messageLong'
  if (!v.consent) e.consent = 'consent'
  if (file && !cvKind(file.buffer)) e.cv = 'cvType'
  return { value: v, errors: e }
}

/** Checks the file's real content, not just its name: PDF, legacy Word (OLE) or DOCX (zip). */
export function cvKind(buf) {
  if (!buf || buf.length < 8) return null
  if (buf.subarray(0, 5).toString('latin1') === '%PDF-') return 'pdf'
  if (buf.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))) return 'doc'
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04 && buf.includes(Buffer.from('word/'))) return 'docx'
  return null
}
