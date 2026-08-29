import { featuredProjects } from '../data/projects';
import { getAllPosts } from './blog';
import type { ProjectTag, ProjectCategory } from '../types/portfolio';
import type { LanguageCode } from '../types/portfolio';

export interface UnifiedItem {
  type: 'project' | 'post';
  id: string;
  title: string;
  description: string;
  tag?: ProjectTag | 'writing';
  category?: ProjectCategory;
  company?: string;
  technologies: string[];
  github?: string;
  link?: string;
  blogSlug?: string;
  date?: string;
  readingTime?: number;
  image?: string;
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<ProjectCategory, { en: string; es: string }> = {
  'full-stack': { en: 'Full-Stack', es: 'Full-Stack' },
  'backend': { en: 'Backend', es: 'Backend' },
  'infrastructure': { en: 'Infra', es: 'Infra' },
  'data-science': { en: 'Data Science', es: 'Data Science' },
  'use-case': { en: 'Use Case', es: 'Caso de Uso' },
};

export const getUnifiedItems = (lang: LanguageCode): UnifiedItem[] => {
  // Convert projects
  const projectItems: UnifiedItem[] = featuredProjects.map(p => ({
    type: 'project' as const,
    id: p.id,
    title: p.name[lang],
    description: p.description[lang],
    tag: p.tag,
    category: p.category,
    company: p.company,
    technologies: p.technologies,
    github: p.github,
    link: p.link,
    image: p.image,
    featured: p.featured,
  }));

  // Convert blog posts
  const blogPosts = getAllPosts();
  const postItems: UnifiedItem[] = blogPosts.map(post => ({
    type: 'post' as const,
    id: `post-${post.slug}`,
    title: post.title,
    description: post.description,
    tag: 'writing' as const,
    technologies: post.tags,
    blogSlug: post.slug,
    date: post.date,
    readingTime: post.readingTime,
    image: post.image,
    featured: post.featured,
  }));

  // Sort: featured first, then by type/date (for now just returning concatenated)
  // We can sort them so featured are first
  const allItems = [...projectItems, ...postItems];
  return allItems.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
};
