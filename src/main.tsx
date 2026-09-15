import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/fonts.css'
import './index.css'
import App from './App.tsx'
import { VisualEffectsProvider } from './performance/VisualEffects'

const app = (
  <StrictMode>
    <HelmetProvider><BrowserRouter><VisualEffectsProvider><App /></VisualEffectsProvider></BrowserRouter></HelmetProvider>
  </StrictMode>
)

const root = document.getElementById('root')!;
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const prerenderedPath = (root.dataset.prerendered || '').replace(/\/+$/, '') || '/';
if (root.dataset.prerendered && prerenderedPath === currentPath) hydrateRoot(root, app);
else createRoot(root).render(app);
