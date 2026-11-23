# Backend for v13: what changed

- **Content panel** at a secret address (`ADMIN_PATH`), not linked from the site and marked noindex. Office staff sign in and
  publish news posts, vlogs (YouTube/Vimeo link or MP4 upload) and job openings; drafts, scheduled dates and job closing
  dates are supported. Plain-language guide: `STAFF-GUIDE.md`.
- **Website reads the panel**: News page, home page "Latest news", article pages and the Careers page ("Apply for this role"
  fills in the role on the application form). Published posts are added to `sitemap.xml`.
- **Every news card has a picture**: the existing articles and placeholders now use the site's own photos and renders, and
  posts without a picture fall back to a picture for their category.
- **Enquiries and applications** can be read in the panel, exported to Excel (CSV) and CVs downloaded.
- Rate limits now apply to the forms only (20 per 15 min), so page views and the panel are not throttled; sign-in has its own
  limit. Origin check covers every change (POST/PUT/DELETE).
- All real details (mail server, inboxes, domain, admin accounts, secrets) are placeholders in `server/.env.example`.
- Backend tests: 17 pass (12 earlier + 5 for the panel).
