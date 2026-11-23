import nodemailer from 'nodemailer'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const TYPE_LABEL = { product: 'Product enquiry', quote: 'Quotation', technical: 'Technical support', application: 'Application support', calibration: 'Calibration', datasheet: 'Datasheet request', business: 'Our Businesses enquiry', general: 'General enquiry' }
const AREA_LABEL = { calibration: 'Calibration and testing', technical: 'Technical sales and support', operations: 'Operations and logistics', other: 'Other' }
const LANG = { 'en-AU': 'English', it: 'Italian', fr: 'French', ar: 'Arabic', ja: 'Japanese' }

/** Sends mail through SMTP. Without SMTP settings it logs instead, so the site still works in development. */
export function createMailer(cfg, log = console) {
  const live = Boolean(cfg.host)
  const transport = live
    ? nodemailer.createTransport({ host: cfg.host, port: cfg.port, secure: cfg.secure, auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined })
    : null
  const send = async (msg) => {
    if (!live) { log.info?.(`[mail:dry-run] to=${msg.to} subject=${msg.subject}`); return { dryRun: true } }
    return transport.sendMail({ from: cfg.from, ...msg })
  }
  const table = (rows) =>
    `<table cellpadding="6" style="border-collapse:collapse;font:14px/1.5 Arial,sans-serif;color:#1B2230">${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><th align="left" style="background:#EEF6F8;color:#16274F;white-space:nowrap">${esc(k)}</th><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join('')}</table>`
  const text = (rows) => rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')

  return {
    live,
    verify: () => (live ? transport.verify() : Promise.resolve(true)),
    async enquiry(ref, v, meta) {
      const rows = [['Reference', ref], ['Type', TYPE_LABEL[v.type]], ['Product or service', v.subject], ['Name', v.name], ['Company', v.company], ['Email', v.email], ['Phone', v.phone], ['Site language', LANG[v.locale]], ['Message', v.message], ['Received', meta.at], ['Page', meta.referer]]
      await send({ to: cfg.to, replyTo: v.email, subject: `[${ref}] ${TYPE_LABEL[v.type]} from ${v.name}${v.company ? `, ${v.company}` : ''}`, text: text(rows), html: table(rows) })
      if (cfg.confirm) await send({ to: v.email, subject: `We have your enquiry (${ref}) · W&B Instruments`, ...confirmation(ref, v.name, cfg) })
    },
    async careers(ref, v, cv, meta) {
      const rows = [['Reference', ref], ['Area of interest', AREA_LABEL[v.area]], ['Role', v.role], ['Name', v.name], ['Email', v.email], ['Phone', v.phone], ['Site language', LANG[v.locale]], ['Message', v.message], ['CV', cv ? cv.filename : 'Not attached'], ['Received', meta.at]]
      await send({
        to: cfg.careersTo, replyTo: v.email, subject: `[${ref}] Expression of interest: ${v.name} (${AREA_LABEL[v.area]})`, text: text(rows), html: table(rows),
        attachments: cv ? [{ filename: cv.filename, content: cv.buffer }] : [],
      })
    },
  }
}

function confirmation(ref, name, cfg) {
  const body = `Hello ${name},\n\nThank you for contacting W&B Instruments. Your reference is ${ref}. A member of our technical team will reply within 24 hours.\n\nIf it is urgent, call us on +61 3 9729 2112.\n\nW&B Instruments\nMeasured. Calibrated. Trusted.\n20 Shelley Ave, Kilsyth VIC 3137, Australia`
  return {
    text: body,
    html: `<div style="font:15px/1.6 Arial,sans-serif;color:#1B2230;max-width:560px">
<div style="background:#16274F;color:#fff;padding:18px 22px;font-weight:bold;font-size:18px">W&amp;B Instruments</div>
<div style="height:4px;background:linear-gradient(90deg,#2a4c8f 0 20%,#1462ba 20% 40%,#1fc0d4 40% 60%,#f5a524 60% 80%,#f26a21 80% 100%)"></div>
<div style="padding:22px">${esc(body).replace(/\n/g, '<br>')}</div></div>`,
    replyTo: cfg.to,
  }
}
