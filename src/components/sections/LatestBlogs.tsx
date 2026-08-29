import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getAllPosts } from '../../utils/blog';
import { SectionHeading } from '../ui/SectionHeading';
import { useLanguage } from '../../context/LanguageContext';

export const LatestBlogs: React.FC = () => {
  const { lang } = useLanguage();
  const allPosts = getAllPosts();
  const featured = allPosts.filter((post) => post.featured);
  const posts = (featured.length > 0 ? featured : allPosts).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <motion.section
      id="latest-blogs"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      style={{ margin: '0 auto', padding: '100px 0', maxWidth: 'var(--content-standard)', width: '100%' }}
    >
      <SectionHeading title={lang === 'en' ? 'Latest writing' : 'Últimos artículos'} />
      <div className="latest-blogs-grid">
        {posts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.slug} className="latest-blog-card">
            <span>{post.date} · {post.readingTime} min</span>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <small>{lang === 'en' ? 'Read article →' : 'Leer artículo →'}</small>
          </Link>
        ))}
      </div>
      <Link to="/blog" className="all-posts-link">
        {lang === 'en' ? 'View all articles' : 'Ver todos los artículos'}
      </Link>
      <style>{`
        .latest-blogs-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .latest-blog-card { display: flex; min-height: 240px; padding: 24px; flex-direction: column; border: 1px solid color-mix(in srgb, var(--color-accent-1) 20%, transparent); border-radius: var(--border-radius); background: var(--color-surface-tint); transition: transform var(--duration-normal) var(--ease-out-expo), border-color var(--duration-normal); }
        .latest-blog-card:hover { transform: translateY(-6px); border-color: var(--color-accent-2); }
        .latest-blog-card span { color: var(--color-accent-2); font-family: var(--font-mono); font-size: 11px; }
        .latest-blog-card h3 { margin: 16px 0 10px; color: var(--color-accent-1); font-size: 20px; }
        .latest-blog-card p { margin: 0; color: var(--color-text-primary); font-size: 14px; }
        .latest-blog-card small { margin-top: auto; padding-top: 20px; color: var(--color-accent-3); font-family: var(--font-mono); }
        .all-posts-link { margin-top: 28px; color: var(--color-accent-2); font-family: var(--font-mono); font-size: 13px; }
        @media (max-width: 760px) { .latest-blogs-grid { grid-template-columns: 1fr; } .latest-blog-card { min-height: 190px; } }
      `}</style>
    </motion.section>
  );
};
