# W&B Instruments website: what changed in v12

v12 builds on v11 (Sensortherm, HD31) and applies the follow-up feedback. Content and layout are otherwise unchanged.

## 1. Product range pages show the real product, not the 3D model
Every range, product and industry page showed the same conceptual 3D pyrometer. That was a generic model left over from the earlier design, and it looked like an Advanced Energy sensor. These pages now show the manufacturer's own product photo, such as the Sensortherm CAPELLA, METIS, HELIOS and CS1500N. The 3D model now appears only where a range has no photo, and in the home page hero, where it works as a showcase.

## 2. Backgrounds merged, on every page
The 3D viewer and the product photos no longer sit in a separate white or grey panel. They sit directly on the page's dot-grid background:
- **Home hero:** the 3D viewer is see-through, so the model sits on the dot grid.
- **Range, product and industry pages:** the photo blends into the dot background (white photo backgrounds are blended away), and product pages now use the same dot background in their header.

## 3. Sharp partner logos
All four logos now come from each maker's own artwork, at 4 to 5 times the size they are shown, so they stay sharp on retina screens.

| Logo | Source | File size (px) |
| --- | --- | --- |
| Sensortherm | Vector logo in Sensortherm's METIS datasheet | 1000 × 293 |
| Status Instruments | Vector logo in the Status Product Guide (status.co.uk) | 900 × 234 |
| Giussani | Vector icon and wordmark from Giussani's company presentation (giussanionline.com), laid out like the logo on their website | 1000 × 153 |
| Senseca | Official SVG logo from senseca.com | 900 × 224 |

## 4. Light and dark mode
- A sun/moon button in the header switches mode, on desktop and on mobile. Its label is in all five languages.
- On the first visit the site follows the device setting (light or dark) automatically. Once the visitor uses the button, their choice is remembered.
- In dark mode the light surfaces, text, lines, cards, forms and notices switch. The navy header, the footer and the brand colours stay the same, and the 3D model switches to night lighting.
- Manufacturer photos and logos keep a light backing in dark mode, because they are made for white backgrounds.
- The mode is set before the page draws, so there is no flash of the wrong mode (`public/theme-init.js`).

## 5. Region from the IP address
- The country/region selector (Australia or International) is now chosen automatically from the visitor's IP address. Visitors in Australia get Australia. Everyone else gets International, along with the existing "enquiries from outside Australia" notice.
- How it works: a new `GET /api/geo` endpoint (`server/geo.mjs`). It reads the country that the host or CDN already provides (Cloudflare, AWS CloudFront, Vercel and Google App Engine do this out of the box). If the site is hosted without such a CDN, set `GEOIP_URL` in `server/.env` to a lookup service such as `https://ipapi.co/{ip}/country/`. Nothing is stored.
- Until the answer arrives, or if no country is available, the device time zone gives the first guess.
- A region the visitor picks in the selector is remembered, and it always wins over the automatic choice.
- The language is not changed automatically. It stays under the visitor's control.

## Also fixed
- The "Our purpose" statement on the About page was white text on a light background, so it could not be read. It is now navy (light mode) or white (dark mode).

## Please note
- If `GEOIP_URL` is used, the visitor's IP address is sent to that service. Name the service in the Privacy Notice. With a CDN header, no third party is involved.

## Checks
Type check and production build pass, and the backend tests pass (12/12, including 2 new tests for the region lookup). Every page was checked in a browser in light and dark mode, in English and Arabic (right to left), on desktop and mobile, with no console errors. Region detection was tested with Australian and Italian visitors.
