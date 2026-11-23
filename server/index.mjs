import { config } from './config.mjs'
import { createStore } from './store.mjs'
import { createMailer } from './mail.mjs'
import { createApp } from './app.mjs'
import { createCms } from './cms.mjs'
import { createAuth } from './auth.mjs'

const store = createStore(config.dataDir)
const mailer = createMailer(config.mail)
const cms = createCms(config.dataDir)
const auth = createAuth({ users: config.admin.users, secret: config.admin.sessionSecret, hours: config.admin.sessionHours, secureCookie: config.admin.secureCookie })
const app = createApp({ config, store, mailer, cms, auth })
console.log(auth.enabled ? `[admin] Content panel on ${config.adminPath}/` : '[admin] Content panel is off: set ADMIN_USERS (name:password, 10+ characters) in server/.env')

mailer.verify().then(
  () => console.log(mailer.live ? `[mail] SMTP ready (${config.mail.host}), enquiries go to ${config.mail.to}` : '[mail] No SMTP_HOST set: running in dry-run mode, emails are logged, not sent'),
  (err) => console.error(`[mail] SMTP check failed: ${err.message}. Enquiries are still saved to ${config.dataDir}`),
)

const server = app.listen(config.port, config.host, () => console.log(`W&B Instruments website on http://${config.host === '0.0.0.0' ? 'localhost' : config.host}:${config.port}`))
const stop = () => server.close(() => process.exit(0))
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
