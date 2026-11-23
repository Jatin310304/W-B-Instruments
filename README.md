# W&B Instruments: corporate website and backend (v13 + backend)

**New in this package:** a content panel so office staff can publish **news posts, vlogs and job openings** without
touching code (see `STAFF-GUIDE.md`), every news card now shows a picture, and staff can read and export the enquiries and
applications received. See "Quick start" and "Placeholders to fill in" below.

## Quick start (production)

```bash
cp server/.env.example server/.env     # then replace every YOUR-… / CHANGE_ME value (see the table below)
npm install
npm run build                          # dist/ is already included; rebuild after changing src/
npm start                              # website + backend on http://localhost:8787
                                       # content panel on http://localhost:8787/<ADMIN_PATH>/
npm run test:server                    # backend tests (17)
```

Docker: `docker build -t wb-website .` then
`docker run -p 8787:8787 --env-file server/.env -v wbdata:/app/server/data wb-website`.
Put it behind HTTPS (Nginx, Caddy or the host's load balancer). `server/data/` holds submissions, CVs, posts, jobs and
uploaded pictures/videos: keep it on a persistent volume and back it up.

## Placeholders to fill in (`server/.env`)

| Setting | What to put there |
| --- | --- |
| `ALLOWED_ORIGINS` | The real web address(es), e.g. `https://www.wandbinstruments.com.au,https://wandbinstruments.com.au` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | The mail account that sends website email (Microsoft 365: `smtp.office365.com`, 587). Empty `SMTP_HOST` = dry-run (emails only logged). |
| `MAIL_FROM` | Sender shown on emails, e.g. `W&B Instruments <no-reply@your-domain>` (must be allowed by the SMTP account) |
| `MAIL_TO` | Inbox that receives enquiries |
| `MAIL_CAREERS_TO` | Inbox that receives job applications |
| `ADMIN_PATH` | Secret web address of the content panel, e.g. `wb-staff-7k2q`. Not linked anywhere on the site. |
| `ADMIN_USERS` | Staff accounts, `name:password` pairs separated by commas; passwords 10+ characters. Placeholder values keep the panel switched off. |
| `SESSION_SECRET` | 64 random characters: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GEOIP_URL` (optional) | Only if the host/CDN does not send a country header |
| `COMPANY_EMAIL` (optional) | Fallback inbox if `MAIL_TO` is empty |

Company details shown on the website (address, phone, email) are in `src/data/company.ts`; rebuild after changing them.

### Admin accounts
Add a person: append `,name:their-long-password` to `ADMIN_USERS` and restart. Remove a person: delete their pair and
restart. To avoid keeping a password in plain text, run `npm run hash-password -- "the password"` and use
`name:scrypt$…` instead. Changing `SESSION_SECRET` signs everybody out.


v13 shows Metaval product images on the business pages, fills every product tile with a real photo and puts all product images on one background that follows light and dark mode (see CHANGES-v13.md). v12 added light and dark mode, region from the IP address, real product photos on range pages and sharp partner logos (see CHANGES-v12.md). v11 applied the client feedback of November 2026 (Sensortherm replaces Advanced Energy, HD31 Multifunction Logger, new partner logos). See CHANGES-v11.md. v10 applied the Brand & Marketing Strategy v1.0; see CHANGES-v10.md.

React 18 + TypeScript, Vite 5, Tailwind 3, React Three Fiber (3D heroes). Built to the W&B Brand Guidelines 2.0, Signal colourway.

## Run

```bash
npm install
npm run build          # production website in dist/ (also emits sitemap.xml and robots.txt)
npm start              # website + backend on http://localhost:8787
npm run dev            # frontend with hot reload on http://localhost:5173 (run `npm start` too; /api is proxied to it)
npm run build:preview  # one self-contained HTML file in dist-preview/index.html, opens from disk (forms do not send)
npm run test:server    # backend tests
```

## Backend (`server/`)

A small Node.js (Express) server that serves the built website and handles the two forms.

| Endpoint | What it does |
| --- | --- |
| `POST /api/enquiry` | Contact form (JSON). Validates with the same rules as the browser, saves the enquiry, emails it to `MAIL_TO` with reply-to set to the customer, sends the customer a confirmation with their reference (`WB-YYYYMMDD-XXXXXX`), returns `{ ok, ref }`. |
| `POST /api/careers` | Expression of interest (multipart). Optional CV up to 5 MB; the content is checked as a real PDF, DOC or DOCX, not just by its name. Saved, and emailed to `MAIL_CAREERS_TO` with the CV attached. Returns `{ ok, ref }` (`JOB-...`). |
| `GET /api/geo` | `{ ok, country, source }`: the visitor's country from the IP address, used once per visit to pre-select Australia or International. Read from the host/CDN country header (Cloudflare, CloudFront, Vercel, App Engine), or from `GEOIP_URL` if set. Nothing is stored. See `server/geo.mjs`. |
| `GET /api/content` | Published news posts/vlogs and open job openings for the News, Home and Careers pages (drafts, future-dated posts and closed jobs are left out). |
| `/<ADMIN_PATH>/` | The content panel (static page in `server/admin/`). Sign-in, then `/api/admin/*`: posts and jobs (create, edit, delete), picture/video upload (type checked from the file content), enquiries and applications (list, CSV export, CV download). Signed HttpOnly SameSite=Strict cookie, 10 sign-in attempts per 15 minutes, every change logged with the user name. |
| `GET /uploads/…` | Pictures and videos uploaded in the panel. |
| `GET /sitemap.xml` | The built sitemap plus every published news post. |
| `GET /api/health` | `{ ok, mail: "smtp" | "dry-run" }` for uptime checks. |
| everything else | The website: hashed assets cached for a year, every page route returns `index.html` for the client router. |

- **Content**: posts and jobs are in `server/data/content.json`, uploads in `server/data/uploads/`. Post text is shown as plain text (paragraphs and bullet lists), never as HTML. Videos embed only from YouTube (privacy-enhanced mode) and Vimeo, or play from an uploaded MP4. Once at least one real post is published, the labelled layout placeholders on the News page are hidden. Posts are shown in the language they are written in.
- **Storage**: every submission is appended to `server/data/enquiries.jsonl` or `careers.jsonl`, CVs go to `server/data/cv/`. If an email fails, the submission is still saved and logged in `mail-failures.jsonl`, and the customer still gets their reference. Back up `server/data/`; it holds personal information, so restrict access and set a retention period in the Privacy Notice.
- **Mail**: any SMTP service (Microsoft 365, Google Workspace, SendGrid, Amazon SES). Without `SMTP_HOST` the server runs in dry-run mode and logs emails instead of sending them.
- **Protection**: honeypot field, 20 form posts per 15 minutes per IP, posts only from `ALLOWED_ORIGINS`, request size limits, security headers and a Content Security Policy (helmet).
- **Settings**: copy `server/.env.example` to `server/.env`. The default inbox is the email in `src/data/company.ts`.
- **Hosting**: any Node 20+ host, or Docker: `docker build -t wb-website .` then `docker run -p 8787:8787 --env-file server/.env -v wbdata:/app/server/data wb-website`. Put it behind HTTPS (a reverse proxy such as Nginx or Caddy, or the host's load balancer) and set `TRUST_PROXY` accordingly.
- **Languages**: the site language of each submission is recorded (English, Italian, French, Arabic or Japanese) so the team can reply in kind. Notification and confirmation emails are in English.

| Variable | Purpose |
| --- | --- |
| `VITE_ENQUIRY_ENABLED=true` | Forms post to `/api/enquiry` and `/api/careers`. Set in `.env.production`, so `npm run build` sends and the single-file preview does not. |
| `VITE_I18N_PSEUDO=true` | Lists the pseudo-locale in the language selector (translation QA). `?lang=qps` also turns it on. |

## Where things are

- `src/i18n/`: translation system. `locales/en.ts` holds **every** visible string and all page copy; components hold none. `config.ts` registers languages (English, Italian, French, Arabic right to left, Japanese) and countries/regions (separate from language). Missing keys fall back to English. Choice persists in local storage; dates and numbers use `Intl` for the active locale.
- `src/data/`: structure only (ids, images, links, relationships): `catalog.ts` (25 ranges, 4 partner brands, 7 Products & Services groups, related products), `industries.ts`, `businesses.ts`, `news.ts`, `company.ts`, `site.ts` (jobs, resources, legal ids).
- `src/content/legal.ts`: legal page bodies (English only; Privacy and Copyright drafts with "To be confirmed" markers, eight clearly marked placeholders).
- `src/components/`: `Header.tsx` (two-tier header, mega menus, country and language selectors, search combobox, mobile menu), `Footer.tsx`, `Forms.tsx` (enquiry and careers), `Motion.tsx` (3D hero, scroll reveal, counters), `ui.tsx` (cards, hero, buttons, brand devices).
- `src/three/`: conceptual 3D instrument viewer from the earlier showroom build, now localised. Pointer parallax removed (no cursor-following effects).
- `src/lib/`: routes, search index, SEO meta, sitemap.

## Content sources

- W&B: wandbinstruments.com.au (read 3 Nov 2026) and the earlier v9 site: company facts, 25 product ranges and manufacturer links, partners, calibration scope, one news post (29 May 2019).
- Our Businesses: metaval.com/forging, /valve, /flow-measurement and metavalalloys.com (casting). Attributed on every page; Metaval kept as a separate brand.

## Placeholders W&B still needs to supply

Product specifications and datasheets · RTD/thermocouple and accessories ranges · news articles (layout placeholders shown, labelled) · company history and careers copy · vacancies · approved legal text (Privacy/Copyright TBC fields in `LEGAL`, eight placeholder pages) · authentic photography (studio renders and product photos are labelled) · Metaval division imagery · native-speaker review of the translations · social accounts.
