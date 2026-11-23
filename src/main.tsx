import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import '@fontsource/barlow-semi-condensed/500.css'
import '@fontsource/barlow-semi-condensed/600.css'
import '@fontsource/barlow-semi-condensed/700.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/400-italic.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/index.css'
import { I18nProvider } from './i18n/I18nProvider'
import App from './App'
import { initTheme } from './lib/theme'

initTheme()

// The single-file preview is opened from disk, where URL paths can't be routed, so it keeps the route in memory.
const Router = location.protocol === 'file:' ? MemoryRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <I18nProvider>
        <App />
      </I18nProvider>
    </Router>
  </React.StrictMode>,
)
