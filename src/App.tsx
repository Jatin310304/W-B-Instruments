import { useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useI18n } from '@/i18n/I18nProvider'
import Home from '@/pages/Home'
import { IndustriesPage, IndustryPage } from '@/pages/Industries'
import { ProductsPage, ProductPage, SolutionPage } from '@/pages/Products'
import { BusinessesPage, BusinessPage } from '@/pages/Businesses'
import { NewsPage, ArticlePage } from '@/pages/News'
import { ResourcesPage, ResourcePage } from '@/pages/Resources'
import SupportPage from '@/pages/Support'
import AboutPage from '@/pages/About'
import CareersPage from '@/pages/Careers'
import ContactPage from '@/pages/Contact'
import LegalPage from '@/pages/Legal'
import SearchPage from '@/pages/Search'
import NotFound from '@/pages/NotFound'
import { ScrollFX } from '@/components/ScrollFX'

/** New page: scroll to the top, or to the #hash target, and move focus to main for screen readers. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
        return
      }
    }
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])
  return null
}

function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <div key={pathname} className="page-enter">{children}</div>
}

export default function App() {
  const { m } = useI18n()
  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded bg-signal px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {m.common.skip}
      </a>
      <RouteEffects />
      <ScrollFX />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:id" element={<IndustryPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/solutions/:id" element={<SolutionPage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/businesses/:id" element={<BusinessPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<ArticlePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:id" element={<ResourcePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/:id" element={<LegalPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}
