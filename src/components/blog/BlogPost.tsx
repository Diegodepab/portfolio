import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getRelatedPosts, slugifyHeading } from '../../utils/blog';
import { useLanguage } from '../../context/LanguageContext';
import { siteConfig } from '../../data/config';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const { lang } = useLanguage();
  const post = slug ? getPostBySlug(slug) : undefined;

  const relatedPosts = useMemo(() => post ? getRelatedPosts(post) : [], [post]);

  if (!post) {
    return (
      <div className="blog-state">
        <h1>{lang === 'en' ? 'Article not found' : 'Artículo no encontrado'}</h1>
        <Link to="/blog">{lang === 'en' ? 'View all articles' : 'Ver todos los artículos'}</Link>
      </div>
    );
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags.join(', '),
    author: { '@type': 'Person', name: siteConfig.name },
    ...(post.image ? { image: post.image } : {}),
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="blog-post"
    >
      <Helmet title={`${post.title} | ${siteConfig.name}`}>
        <meta name="description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="article:published_time" content={post.date} />
        {post.image && <meta property="og:image" content={post.image} />}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Link to="/blog" className="blog-back">← {lang === 'en' ? 'Back to Blog' : 'Volver al Blog'}</Link>

      <header className="blog-post-header">
        <h1>{post.title}</h1>
        <p className="blog-post-description">{post.description}</p>
        <div className="blog-post-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime} min {lang === 'en' ? 'read' : 'de lectura'}</span>
          {post.updated && <span>· {lang === 'en' ? 'Updated' : 'Actualizado'} {post.updated}</span>}
        </div>
        {post.tags.length > 0 && (
          <ul className="blog-post-tags" aria-label="Tags">
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}
      </header>

      {post.image && <img src={post.image} alt="" className="blog-post-cover" />}

      <div className="blog-post-layout">
        <div className="blog-content">
          <ReactMarkdown components={{
            h2: ({ children }) => <h2 id={slugifyHeading(React.Children.toArray(children).join(''))}>{children}</h2>,
            h3: ({ children }) => <h3 id={slugifyHeading(React.Children.toArray(children).join(''))}>{children}</h3>,
          }}>
            {post.content}
          </ReactMarkdown>
        </div>

        <aside className="blog-post-sidebar">
          {post.headings.length > 0 && (
            <nav aria-label={lang === 'en' ? 'Table of contents' : 'Índice del artículo'}>
              <p>{lang === 'en' ? 'On this page' : 'En esta página'}</p>
              <ol>
                {post.headings.map((heading) => (
                  <li key={heading.id} className={`level-${heading.level}`}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <button type="button" onClick={copyLink} className="blog-copy-link">
            {copied ? (lang === 'en' ? 'Link copied!' : '¡Enlace copiado!') : (lang === 'en' ? 'Copy article link' : 'Copiar enlace')}
          </button>
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <h2>{lang === 'en' ? 'More to read' : 'Más para leer'}</h2>
          <div>
            {relatedPosts.map((related) => (
              <Link key={related.slug} to={`/blog/${related.slug}`}>
                <span>{related.readingTime} min</span>
                <strong>{related.title}</strong>
                <small>{related.description}</small>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .blog-state { min-height: 70vh; padding: 160px 20px; text-align: center; color: var(--color-text-primary); }
        .blog-state h1 { color: var(--color-accent-1); }
        .blog-state a, .blog-back { color: var(--color-accent-2); font-family: var(--font-mono); }
        .blog-post { max-width: 1000px; margin: 0 auto; padding: 110px 0; }
        .blog-back { margin-bottom: 42px; font-size: 13px; }
        .blog-post-header { max-width: 800px; }
        .blog-post-header h1 { margin: 0; color: var(--color-accent-1); font-size: clamp(34px, 6vw, 58px); line-height: 1.1; }
        .blog-post-description { max-width: 700px; margin: 20px 0; color: var(--color-text-primary); font-size: 20px; }
        .blog-post-meta { display: flex; flex-wrap: wrap; gap: 8px; color: var(--color-accent-2); font-family: var(--font-mono); font-size: 12px; }
        .blog-post-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 0; padding: 0; list-style: none; color: var(--color-accent-3); font-family: var(--font-mono); font-size: 11px; }
        .blog-post-cover { width: 100%; max-height: 520px; margin-top: 42px; border-radius: var(--border-radius); object-fit: cover; }
        .blog-post-layout { display: grid; grid-template-columns: minmax(0, 1fr) 210px; gap: 64px; margin-top: 55px; align-items: start; }
        .blog-content { min-width: 0; color: var(--color-text-primary); font-size: 17px; line-height: 1.8; }
        .blog-content h1, .blog-content h2, .blog-content h3 { scroll-margin-top: 100px; color: var(--color-accent-1); line-height: 1.3; }
        .blog-content h1 { margin: 0 0 28px; font-size: 32px; }
        .blog-content h2 { margin: 48px 0 18px; font-size: 27px; }
        .blog-content h3 { margin: 36px 0 14px; font-size: 21px; }
        .blog-content p, .blog-content ul, .blog-content ol, .blog-content blockquote, .blog-content pre { margin: 0 0 22px; }
        .blog-content a { color: var(--color-accent-2); text-decoration: underline; text-underline-offset: 4px; }
        .blog-content li { margin-bottom: 8px; }
        .blog-content li::marker { color: var(--color-accent-3); }
        .blog-content blockquote { padding: 4px 0 4px 20px; border-left: 3px solid var(--color-accent-3); color: var(--color-text-muted); }
        .blog-content code { border-radius: 3px; background: var(--color-surface-tint); color: var(--color-accent-3); font-family: var(--font-mono); font-size: .88em; }
        .blog-content :not(pre) > code { padding: 2px 6px; }
        .blog-content pre { overflow-x: auto; padding: 20px; border: 1px solid color-mix(in srgb, var(--color-accent-1) 18%, transparent); border-radius: var(--border-radius); background: var(--color-surface-tint); }
        .blog-content img { width: 100%; border-radius: var(--border-radius); }
        .blog-post-sidebar { position: sticky; top: 100px; padding: 18px; border: 1px solid color-mix(in srgb, var(--color-accent-1) 20%, transparent); border-radius: var(--border-radius); background: var(--color-surface-tint); }
        .blog-post-sidebar nav > p { margin: 0 0 12px; color: var(--color-accent-1); font-family: var(--font-mono); font-size: 12px; }
        .blog-post-sidebar ol { margin: 0; padding: 0; list-style: none; }
        .blog-post-sidebar li { margin-bottom: 9px; line-height: 1.35; }
        .blog-post-sidebar li.level-3 { padding-left: 12px; }
        .blog-post-sidebar a { color: var(--color-text-muted); font-size: 12px; }
        .blog-post-sidebar a:hover { color: var(--color-accent-2); }
        .blog-copy-link { width: 100%; margin-top: 16px; padding: 9px; border: 1px solid var(--color-accent-2); border-radius: var(--border-radius); background: transparent; color: var(--color-accent-2); cursor: pointer; font-family: var(--font-mono); font-size: 11px; }
        .related-posts { margin-top: 80px; padding-top: 45px; border-top: 1px solid var(--color-bg-surface); }
        .related-posts h2 { color: var(--color-accent-1); }
        .related-posts > div { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .related-posts a { display: flex; min-height: 170px; padding: 20px; flex-direction: column; border: 1px solid color-mix(in srgb, var(--color-accent-1) 20%, transparent); border-radius: var(--border-radius); background: var(--color-surface-tint); }
        .related-posts span { color: var(--color-accent-2); font-family: var(--font-mono); font-size: 11px; }
        .related-posts strong { margin: 10px 0; color: var(--color-accent-1); }
        .related-posts small { color: var(--color-text-muted); }
        @media (max-width: 800px) { .blog-post-layout { grid-template-columns: 1fr; gap: 36px; } .blog-post-sidebar { position: static; grid-row: 1; } .related-posts > div { grid-template-columns: 1fr; } }
      `}</style>
    </motion.article>
  );
};
