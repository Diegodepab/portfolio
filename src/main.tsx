import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/fonts.css'
import './index.css'
import App, { type RouteOverrides } from './App.tsx'
import { VisualEffectsProvider } from './performance/VisualEffects'

async function bootstrap() {
  const root = document.getElementById('root')!;
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const prerenderedPath = (root.dataset.prerendered || '').replace(/\/+$/, '') || '/';

  const routeOverrides: RouteOverrides = {};
  if (root.dataset.prerendered && prerenderedPath === currentPath) {
    try {
      if (currentPath === '/') {
        const mod = await import('./components/pages/HomePage');
        routeOverrides.HomePage = mod.HomePage;
      } else if (currentPath === '/projects') {
        const mod = await import('./components/pages/ProjectsPage');
        routeOverrides.ProjectsPage = mod.ProjectsPage;
      } else if (currentPath.startsWith('/projects/')) {
        const mod = await import('./components/pages/ProjectDetailPage');
        routeOverrides.ProjectDetailPage = mod.ProjectDetailPage;
      } else if (currentPath === '/blog') {
        const mod = await import('./components/blog/BlogList');
        routeOverrides.BlogList = mod.BlogList;
      } else if (currentPath.startsWith('/blog/')) {
        const mod = await import('./components/blog/BlogPost');
        routeOverrides.BlogPost = mod.BlogPost;
      } else if (currentPath === '/experience') {
        const mod = await import('./components/sections/Experience');
        routeOverrides.Experience = mod.Experience;
      }
    } catch (error) {
      const FailedRoute = () => { throw error; };
      if (currentPath === '/') routeOverrides.HomePage = FailedRoute;
      else if (currentPath === '/projects') routeOverrides.ProjectsPage = FailedRoute;
      else if (currentPath.startsWith('/projects/')) routeOverrides.ProjectDetailPage = FailedRoute;
      else if (currentPath === '/blog') routeOverrides.BlogList = FailedRoute;
      else if (currentPath.startsWith('/blog/')) routeOverrides.BlogPost = FailedRoute;
      else if (currentPath === '/experience') routeOverrides.Experience = FailedRoute;
    }
  }

  const app = (
    <StrictMode>
      <HelmetProvider><BrowserRouter><VisualEffectsProvider><App routeOverrides={routeOverrides} /></VisualEffectsProvider></BrowserRouter></HelmetProvider>
    </StrictMode>
  );

  if (root.dataset.prerendered && prerenderedPath === currentPath) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

void bootstrap();
