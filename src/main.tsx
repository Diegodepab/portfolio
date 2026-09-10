import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './index.css'
import App from './App.tsx'
import { VisualEffectsProvider } from './performance/VisualEffects'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisualEffectsProvider><App /></VisualEffectsProvider>
  </StrictMode>,
)
