export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  tags: string[];
  themes: string[];
  image?: string;
  featured: boolean;
  draft: boolean;
  content: string;
  readingTime: number;
  headings: BlogHeading[];
}

const files = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const slugifyHeading = (value: string): string => value
  .toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

const parseList = (value?: string): string[] => {
  if (!value) return [];
  const unwrapped = value.trim().replace(/^\[/, '').replace(/\]$/, '');
  return unwrapped
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
};

const parseFrontmatter = (source: string): { metadata: Record<string, string>; content: string } => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { metadata: {}, content: source.trim() };

  const metadata: Record<string, string> = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(':');
    if (separator === -1) return;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    metadata[key] = value;
  });

  return { metadata, content: source.replace(match[0], '').trim() };
};

const getHeadings = (content: string): BlogHeading[] => Array.from(
  content.matchAll(/^(#{2,3})\s+(.+)$/gm),
  (match) => ({
    id: slugifyHeading(match[2].replace(/[*_`]/g, '')),
    text: match[2].replace(/[*_`]/g, ''),
    level: match[1].length as 2 | 3,
  }),
);

const toPost = (path: string, source: string): BlogPostMeta => {
  const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
  const { metadata, content } = parseFrontmatter(source);
  const wordCount = content.replace(/[#*_>`\-[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: metadata.title || slug,
    date: metadata.date || '',
    updated: metadata.updated,
    description: metadata.description || '',
    tags: parseList(metadata.tags),
    themes: parseList(metadata.themes),
    image: metadata.image,
    featured: metadata.featured === 'true',
    draft: metadata.draft === 'true',
    content,
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
    headings: getHeadings(content),
  };
};

const posts = Object.entries(files)
  .map(([path, source]) => toPost(path, source))
  .filter((post) => !post.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getAllPosts = (): BlogPostMeta[] => posts;

export const getPostBySlug = (slug: string): BlogPostMeta | undefined => (
  posts.find((post) => post.slug === slug)
);

export const getRelatedPosts = (currentPost: BlogPostMeta, count = 3): BlogPostMeta[] => posts
  .filter((post) => post.slug !== currentPost.slug)
  .map((post) => ({
    post,
    score:
      post.themes.filter((theme) => currentPost.themes.includes(theme)).length * 2
      + post.tags.filter((tag) => currentPost.tags.includes(tag)).length,
  }))
  .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
  .slice(0, count)
  .map(({ post }) => post);

export const getAllTags = (): string[] => Array.from(
  new Set(posts.flatMap((post) => post.tags)),
).sort((a, b) => a.localeCompare(b));
