import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App, { type RouteOverrides } from './App';
import { VisualEffectsProvider } from './performance/VisualEffects';
import { featuredProjects } from './data/projects';
import { siteConfig } from './data/config';
import { getAllPosts } from './utils/blog';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { ProjectDetailPage } from './components/pages/ProjectDetailPage';
import { BlogList } from './components/blog/BlogList';
import { BlogPost } from './components/blog/BlogPost';
import { NotFoundPage } from './components/pages/NotFoundPage';

export const siteUrl = siteConfig.url;
export const routes = ['/', '/projects', '/experience', '/blog', ...featuredProjects.map(project => `/projects/${project.id}`), ...getAllPosts().map(post => `/blog/${post.slug}`)];

const serverRoutes: RouteOverrides = {
  ProjectsPage,
  ProjectDetailPage,
  BlogList,
  BlogPost,
  NotFoundPage,
};

export async function render(url: string) {
  try {
    const output = renderToString(
      <HelmetProvider><StaticRouter location={url}><VisualEffectsProvider><App routeOverrides={serverRoutes} /></VisualEffectsProvider></StaticRouter></HelmetProvider>,
    );
    const metadata = /<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>/g;
    const head = [...output.matchAll(metadata)].map(match => match[0]).join('\n');
    return { html: output.replace(metadata, ''), head };
  } catch (err: any) {
    console.error('renderToString error for', url, err?.message || err);
    throw err;
  }
}
