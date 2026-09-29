import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/unbounded/cyrillic-300.css'
import '@fontsource/unbounded/latin-300.css'
import '@fontsource/unbounded/latin-ext-300.css'
import '@fontsource/unbounded/cyrillic-400.css'
import '@fontsource/unbounded/latin-400.css'
import '@fontsource/unbounded/latin-ext-400.css'
import '@fontsource/unbounded/cyrillic-600.css'
import '@fontsource/unbounded/latin-600.css'
import '@fontsource/unbounded/cyrillic-900.css'
import '@fontsource/unbounded/latin-900.css'
import '@fontsource/golos-text/cyrillic-400.css'
import '@fontsource/golos-text/latin-400.css'
import '@fontsource/golos-text/cyrillic-500.css'
import '@fontsource/golos-text/latin-500.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/typography.css'
import './styles/logos.css'
import './styles/parallax.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
