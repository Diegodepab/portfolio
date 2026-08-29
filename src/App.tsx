import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { ChatWidget } from './components/chat/ChatWidget';
import { siteConfig } from './data/config';
import { ensureAccessibleAccent, pokePalettes } from './utils/palettes';
import type { Palette } from './utils/palettes';
import './styles/global.css';

const BlogList = lazy(() => import('./components/blog/BlogList').then((module) => ({ default: module.BlogList })));
const BlogPost = lazy(() => import('./components/blog/BlogPost').then((module) => ({ default: module.BlogPost })));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./components/pages/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const AvatarGuide = lazy(() => import('./components/ui/AvatarGuide').then((module) => ({ default: module.AvatarGuide })));

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

const getInitialPalette = (): Palette => pickPalette();

const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => {
      try {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      } catch {
        // Ignore malformed URL fragments instead of breaking route rendering.
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [hash]);
  
  return null;
};

const SiteMetadata = () => {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const title = `${siteConfig.name} | ${siteConfig.title[lang]}`;
  const canonicalUrl = `${window.location.origin}${pathname}`;

  return (
    <Helmet title={title} htmlAttributes={{ lang }}>
      <meta name="description" content={siteConfig.description[lang]} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={siteConfig.description[lang]} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${window.location.origin}/images/portraits/diego-formal.webp`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
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

function MainApp() {
  const [currentPalette, setCurrentPalette] = useState<Palette>(getInitialPalette);
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

  }, [currentPalette]);

  const changePokemon = () => {
    setCurrentPalette((current) => pickPalette(current.name));
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <SiteMetadata />
        <ScrollHandler />
        <Layout
          themeName={currentPalette.name}
          pokemon={currentPalette}
          onPokemonChange={changePokemon}
        >
          <Suspense fallback={<div className="route-loading" role="status" aria-live="polite">Loading…</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/experience" element={<main><Experience /></main>} />
              <Route path="/blog" element={<main><BlogList /></main>} />
              <Route path="/blog/:slug" element={<main><BlogPost /></main>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Suspense fallback={null}>
            <AvatarGuide onOpenChat={handleOpenChat} />
          </Suspense>
          <ChatWidget forceOpen={chatForceOpen} onOpen={handleChatOpened} />
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;
