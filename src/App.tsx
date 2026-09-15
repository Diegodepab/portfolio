import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { ChatWidget } from './components/chat/ChatWidget';
import { TourProvider } from './hooks/useTour';
import { featuredProjects } from './data/projects';
import { siteConfig } from './data/config';
import { ensureAccessibleAccent, pokePalettes } from './utils/palettes';
import type { Palette } from './utils/palettes';
import './styles/global.css';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const BlogList = lazy(() => import('./components/blog/BlogList').then((module) => ({ default: module.BlogList })));
const BlogPost = lazy(() => import('./components/blog/BlogPost').then((module) => ({ default: module.BlogPost })));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./components/pages/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const AvatarGuide = lazy(() => import('./components/ui/AvatarGuide').then((module) => ({ default: module.AvatarGuide })));

export interface RouteOverrides {
  ProjectsPage?: React.ComponentType<any>;
  ProjectDetailPage?: React.ComponentType<any>;
  BlogList?: React.ComponentType<any>;
  BlogPost?: React.ComponentType<any>;
  NotFoundPage?: React.ComponentType<any>;
}

const FAVORITE_PALETTE_CHANCE = 0.4;

const pickPalette = (excludedName?: string): Palette => {
  const available = pokePalettes.filter((palette) => palette.name !== excludedName);
  const favorites = available.filter((palette) => palette.favorite);
  const catalog = available.filter((palette) => !palette.favorite);
  const useFavorite = Math.random() < FAVORITE_PALETTE_CHANCE;
  const pool = useFavorite
    ? (favorites.length > 0 ? favorites : catalog)
    : (catalog.length > 0 ? catalog : favorites);

  return pool[Math.floor(Math.random() * pool.length)];
};

const DEFAULT_PALETTE = pokePalettes.find(palette => palette.name === 'Piplup') ?? pokePalettes[0];
const getInitialPalette = (): Palette => {
  try {
    return pokePalettes.find(palette => palette.name === localStorage.getItem('portfolio-palette')) ?? DEFAULT_PALETTE;
  } catch { return DEFAULT_PALETTE; }
};

const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const scrollToHash = () => {
        try {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView();
            window.dispatchEvent(new Event('scroll'));
          }
        } catch {
          // Ignore malformed URL fragments instead of breaking route rendering.
        }
      };
      scrollToHash();
      const timer = window.setTimeout(scrollToHash, 50);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  
  return null;
};

const SiteMetadata = ({ sprite }: { sprite?: string }) => {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const project = pathname.startsWith('/projects/') ? featuredProjects.find(project => project.id === pathname.split('/')[2]) : undefined;
  const title = project ? `${project.name[lang]} | ${siteConfig.name}` : pathname === '/projects' ? `${lang === 'es' ? 'Explorador de proyectos' : 'Project explorer'} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.title[lang]}`;
  const description = project?.description[lang] || siteConfig.description[lang];
  const canonicalUrl = `${siteConfig.url}${pathname}`;

  return (
    <Helmet title={title} htmlAttributes={{ lang }}>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteConfig.url}/images/portraits/diego-formal.webp`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
      {sprite && <link rel="preload" as="image" href={sprite} />}
    </Helmet>
  );
};

const HomePage = () => (
  <main>
    <Hero />
    <About />
    <Experience />
    <Projects />
    <Contact />
  </main>
);

function MainApp({ routeOverrides }: { routeOverrides?: RouteOverrides } = {}) {
  const ResolvedProjectsPage = routeOverrides?.ProjectsPage ?? ProjectsPage;
  const ResolvedProjectDetailPage = routeOverrides?.ProjectDetailPage ?? ProjectDetailPage;
  const ResolvedBlogList = routeOverrides?.BlogList ?? BlogList;
  const ResolvedBlogPost = routeOverrides?.BlogPost ?? BlogPost;
  const ResolvedNotFoundPage = routeOverrides?.NotFoundPage ?? NotFoundPage;

  const [currentPalette, setCurrentPalette] = useState<Palette>(DEFAULT_PALETTE);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    setCurrentPalette(getInitialPalette());
    const timer = window.setTimeout(() => setEnhanced(true), 600);
    return () => window.clearTimeout(timer);
  }, []);
  const [chatForceOpen, setChatForceOpen] = useState(false);

  const handleOpenChat = useCallback(() => {
    setChatForceOpen(true);
  }, []);

  const handleChatOpened = useCallback(() => {
    // Reset force-open so subsequent opens are user-driven
    setChatForceOpen(false);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const { primary, secondary, tertiary, surfaceTint } = currentPalette.colors;
    root.style.setProperty('--color-accent-1', ensureAccessibleAccent(primary));
    root.style.setProperty('--color-accent-2', ensureAccessibleAccent(secondary));
    root.style.setProperty('--color-accent-3', ensureAccessibleAccent(tertiary));
    root.style.setProperty('--color-surface-tint', surfaceTint ?? 'transparent');
    try { localStorage.setItem('portfolio-palette', currentPalette.name); } catch { /* Optional persistence. */ }

  }, [currentPalette]);

  const changePokemon = () => {
    setCurrentPalette((current) => pickPalette(current.name));
  };

  return (
        <TourProvider>
        <SiteMetadata sprite={currentPalette.sprite} />
        <ScrollHandler />
        <Layout
          themeName={currentPalette.name}
          pokemon={currentPalette}
          onPokemonChange={changePokemon}
        >
          <ErrorBoundary><Suspense fallback={<div className="route-loading" role="status" aria-live="polite">Loading…</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ResolvedProjectsPage />} />
              <Route path="/projects/circlescope" element={<Navigate to="/projects/instagram-epic-tool" replace />} />
              <Route path="/projects/:id" element={<ResolvedProjectDetailPage />} />
              <Route path="/experience" element={<main><Experience /></main>} />
              <Route path="/blog" element={<main><ResolvedBlogList /></main>} />
              <Route path="/blog/:slug" element={<main><ResolvedBlogPost /></main>} />
              <Route path="*" element={<ResolvedNotFoundPage />} />
            </Routes>
          </Suspense></ErrorBoundary>
          {enhanced && <><ErrorBoundary><Suspense fallback={null}>
            <AvatarGuide onOpenChat={handleOpenChat} />
          </Suspense></ErrorBoundary>
          <ChatWidget forceOpen={chatForceOpen} onOpen={handleChatOpened} /></>}
        </Layout>
        </TourProvider>

  );
}

function App({ routeOverrides }: { routeOverrides?: RouteOverrides } = {}) {
  return (
    <LanguageProvider>
      <MainApp routeOverrides={routeOverrides} />
    </LanguageProvider>
  );
}

export default App;
