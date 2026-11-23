import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { sitemapXml, robotsTxt } from './src/lib/sitemap'

/** Emits sitemap.xml and robots.txt from the same route data the app uses, so they never drift. */
function seoFiles(): Plugin {
  return {
    name: 'wb-seo-files',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
    },
  }
}

/** The single-file preview opens from disk, so the favicon is inlined. */
function inlineFavicon(): Plugin {
  return {
    name: 'inline-favicon',
    enforce: 'post',
    transformIndexHtml(html) {
      const icon = readFileSync(new URL('./public/favicon.png', import.meta.url)).toString('base64')
      return html.replace(/href="\.?\/favicon\.png"/, `href="data:image/png;base64,${icon}"`)
    },
  }
}

/** Fills %COMPANY_EMAIL% in index.html from src/data/company.ts, so the email lives in one place. */
function companyHtml(): Plugin {
  return {
    name: 'wb-company-html',
    transformIndexHtml(html) {
      const src = readFileSync(new URL('./src/data/company.ts', import.meta.url), 'utf8')
      const email = /email: '([^']+)'/.exec(src)?.[1] ?? ''
      return html.replaceAll('%COMPANY_EMAIL%', email)
    },
  }
}

export default defineConfig(({ mode }) => {
  const single = mode === 'singlefile'
  return {
    plugins: [react(), companyHtml(), ...(single ? [inlineFavicon(), viteSingleFile({ removeViteModuleLoader: true })] : [seoFiles()])],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: single
      ? { outDir: 'dist-preview', assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 6000 }
      : { outDir: 'dist', chunkSizeWarningLimit: 900 },
    server: { port: 5173, proxy: { '/api': 'http://localhost:8787' } },
  }
})
