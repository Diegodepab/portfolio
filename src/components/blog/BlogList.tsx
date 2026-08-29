import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../ui/SectionHeading';
import { getAllPosts, getAllTags } from '../../utils/blog';
import { useLanguage } from '../../context/LanguageContext';

export const BlogList: React.FC = () => {
  const posts = getAllPosts();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { lang } = useLanguage();
  const tags = getAllTags();

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(lang);
    return posts.filter((post) => {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const searchableText = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLocaleLowerCase(lang);
      return matchesTag && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [lang, posts, query, selectedTag]);

  const clearFilters = () => {
    setQuery('');
    setSelectedTag(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ margin: '0 auto', padding: '100px 0', width: '100%', maxWidth: 'var(--content-standard)' }}
    >
      <SectionHeading title="Blog" />

      <div className="blog-filters">
        <label className="blog-search-label">
          <span className="visually-hidden">{lang === 'en' ? 'Search articles' : 'Buscar artículos'}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={lang === 'en' ? 'Search articles…' : 'Buscar artículos…'}
            className="blog-search"
          />
        </label>
        {tags.length > 0 && (
          <div className="blog-tags" aria-label={lang === 'en' ? 'Filter by tag' : 'Filtrar por etiqueta'}>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag((current) => current === tag ? null : tag)}
                className={selectedTag === tag ? 'blog-tag active' : 'blog-tag'}
                aria-pressed={selectedTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="blog-result-count" aria-live="polite">
        {filteredPosts.length} {lang === 'en' ? (filteredPosts.length === 1 ? 'article' : 'articles') : (filteredPosts.length === 1 ? 'artículo' : 'artículos')}
      </p>

      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <motion.article key={post.slug} whileHover={{ y: -5 }} className="blog-card">
            <Link to={`/blog/${post.slug}`} className="blog-card-link">
              {post.image && <img src={post.image} alt="" className="blog-card-image" />}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <time dateTime={post.date}>{post.date}</time>
                  <span>·</span>
                  <span>{post.readingTime} min</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                {post.tags.length > 0 && (
                  <ul className="blog-card-tags" aria-label="Tags">
                    {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                )}
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="blog-empty">
          <h3>{lang === 'en' ? 'No articles found' : 'No se encontraron artículos'}</h3>
          <p>{lang === 'en' ? 'Try another search or clear the filters.' : 'Prueba otra búsqueda o limpia los filtros.'}</p>
          <button type="button" onClick={clearFilters}>{lang === 'en' ? 'Clear filters' : 'Limpiar filtros'}</button>
        </div>
      )}

      <style>{`
        .blog-filters { margin-bottom: 24px; }
        .blog-search { width: 100%; padding: 14px 16px; border: 1px solid var(--color-bg-surface); border-radius: var(--border-radius); outline: none; background: var(--color-bg-secondary); color: var(--color-text-heading); font-family: var(--font-mono); }
        .blog-search:focus { border-color: var(--color-accent-2); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-2) 18%, transparent); }
        .blog-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
        .blog-tag { padding: 6px 10px; border: 1px solid var(--color-bg-surface); border-radius: 999px; background: transparent; color: var(--color-text-muted); cursor: pointer; font-family: var(--font-mono); font-size: 12px; }
        .blog-tag:hover, .blog-tag:focus-visible, .blog-tag.active { border-color: var(--color-accent-2); color: var(--color-accent-2); background: var(--color-surface-tint); }
        .blog-result-count { margin: 0 0 18px; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 12px; }
        .blog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
        .blog-card { overflow: hidden; border: 1px solid color-mix(in srgb, var(--color-accent-1) 20%, var(--color-bg-surface)); border-radius: var(--border-radius); background: var(--color-surface-tint); }
        .blog-card-link { display: flex; height: 100%; flex-direction: column; color: inherit; }
        .blog-card-image { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
        .blog-card-body { display: flex; flex: 1; flex-direction: column; padding: 24px; }
        .blog-card-meta { display: flex; gap: 8px; color: var(--color-accent-2); font-family: var(--font-mono); font-size: 12px; }
        .blog-card h3 { margin: 12px 0 10px; color: var(--color-accent-1); font-size: 22px; }
        .blog-card p { margin: 0; color: var(--color-text-primary); }
        .blog-card-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: auto 0 0; padding: 20px 0 0; list-style: none; color: var(--color-accent-3); font-family: var(--font-mono); font-size: 11px; }
        .blog-empty { padding: 60px 20px; text-align: center; color: var(--color-text-primary); }
        .blog-empty h3 { color: var(--color-accent-1); }
        .blog-empty button { margin-top: 14px; border: 0; background: transparent; color: var(--color-accent-2); cursor: pointer; }
        @media (max-width: 650px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.section>
  );
};
