import './ProjectsPage.css';
import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { Icon } from '../icons/Icon';
import { ProjectVisual } from '../projects/ProjectVisual';
import { ProjectOrrery } from '../projects/ProjectOrrery';
import { ProjectRouteBackdrop } from '../ui/ambient/ProjectRouteBackdrop';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORY_LABELS, getUnifiedItems } from '../../utils/projects';
import type { ProjectCategory, ProjectTag } from '../../types/portfolio';
import '../sections/Projects.css';

type TypeFilter = 'all' | ProjectTag | 'writing';

export const ProjectsPage: React.FC = () => {
  const { lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const companyFilter = searchParams.get('company') ?? '';
  const selectedProject = searchParams.get('project') ?? '';
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [category, setCategory] = useState<'all' | ProjectCategory>('all');
  const [technology, setTechnology] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const items = useMemo(() => getUnifiedItems(lang), [lang]);

  const technologies = useMemo(
    () => [...new Set(items.flatMap(item => item.technologies))].sort((a, b) => a.localeCompare(b)),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return items.filter(item => {
      if (companyFilter && item.company !== companyFilter) return false;
      if (typeFilter !== 'all' && item.tag !== typeFilter) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (technology !== 'all' && !item.technologies.includes(technology)) return false;
      if (!query) return true;
      return [item.title, item.description, item.company ?? '', ...item.technologies]
        .some(value => value.toLocaleLowerCase().includes(query));
    });
  }, [category, companyFilter, items, searchQuery, technology, typeFilter]);

  const hasFilters = companyFilter !== '' || searchQuery !== '' || typeFilter !== 'all' || category !== 'all' || technology !== 'all';
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategory('all');
    setTechnology('all');
    setSearchParams({});
  };

  const types: Array<{ value: TypeFilter; en: string; es: string }> = [
    { value: 'all', en: 'All', es: 'Todos' },
    { value: 'professional', en: 'Professional', es: 'Profesional' },
    { value: 'personal', en: 'Personal', es: 'Personal' },
    { value: 'writing', en: 'Writing', es: 'Artículos' },
  ];

  return (
    <motion.main className="projects-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <Helmet title={lang === 'en' ? 'Project Explorer | Diego De Pablo' : 'Explorador de proyectos | Diego De Pablo'} />
      <ProjectRouteBackdrop variant="ants" />

      <header className="projects-page-hero">
        <div>
          <Link to="/#projects" className="projects-back-btn">← {lang === 'en' ? 'Selected work' : 'Trabajos destacados'}</Link>
          <p className="projects-page-kicker">{lang === 'en' ? 'PROJECT INDEX / 2026' : 'ÍNDICE DE PROYECTOS / 2026'}</p>
          <h1>{lang === 'en' ? 'Project explorer' : 'Explorador de proyectos'}</h1>
          <p>{lang === 'en'
            ? 'A growing collection of systems, products and technical experiments. Search by problem, discipline or technology.'
            : 'Una colección en crecimiento de sistemas, productos y experimentos técnicos. Busca por problema, disciplina o tecnología.'}</p>
        </div>
        <ProjectOrrery />
      </header>

      <section className="projects-catalog" aria-label={lang === 'en' ? 'Project catalog' : 'Catálogo de proyectos'}>
        {companyFilter && <div className="projects-company-context"><span>{lang === 'en' ? 'Work experience' : 'Experiencia laboral'}</span><strong>{companyFilter}</strong><button type="button" onClick={() => setSearchParams({})}><FiX /> {lang === 'en' ? 'Show complete index' : 'Ver índice completo'}</button></div>}
        <div className="projects-filter-panel">
          <label className="projects-search-wrap">
            <FiSearch aria-hidden="true" />
            <span className="sr-only">{lang === 'en' ? 'Search projects' : 'Buscar proyectos'}</span>
            <input
              type="search"
              placeholder={lang === 'en' ? 'Search projects, problems or technologies…' : 'Buscar proyectos, problemas o tecnologías…'}
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label={lang === 'en' ? 'Clear search' : 'Limpiar búsqueda'}><FiX /></button>}
          </label>

          <div className="projects-filter-row">
            <div className="projects-select-wrap"><FiSliders aria-hidden="true" /><select value={category} onChange={event => setCategory(event.target.value as 'all' | ProjectCategory)} aria-label={lang === 'en' ? 'Category' : 'Categoría'}>
              <option value="all">{lang === 'en' ? 'All disciplines' : 'Todas las disciplinas'}</option>
              {(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map(value => <option key={value} value={value}>{CATEGORY_LABELS[value][lang]}</option>)}
            </select></div>
            <div className="projects-select-wrap"><select value={technology} onChange={event => setTechnology(event.target.value)} aria-label={lang === 'en' ? 'Technology' : 'Tecnología'}>
              <option value="all">{lang === 'en' ? 'All technologies' : 'Todas las tecnologías'}</option>
              {technologies.map(value => <option key={value} value={value}>{value}</option>)}
            </select></div>
            <div className="projects-type-tabs" role="tablist" aria-label={lang === 'en' ? 'Project type' : 'Tipo de proyecto'}>
              {types.map(type => <button key={type.value} type="button" role="tab" aria-selected={typeFilter === type.value} className={typeFilter === type.value ? 'is-active' : ''} onClick={() => setTypeFilter(type.value)}>{type[lang]}</button>)}
            </div>
            {hasFilters && <button className="projects-clear-btn" type="button" onClick={clearFilters}><FiX /> {lang === 'en' ? 'Clear' : 'Limpiar'}</button>}
          </div>
        </div>

        <div className="projects-results-meta">
          <span><strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? (lang === 'en' ? 'result' : 'resultado') : (lang === 'en' ? 'results' : 'resultados')}</span>
          <span>{hasFilters ? (lang === 'en' ? 'Filtered view' : 'Vista filtrada') : (lang === 'en' ? 'Complete index' : 'Índice completo')}</span>
        </div>

        <motion.div layout className="catalog-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => {
              const href = item.type === 'post' ? `/blog/${item.blogSlug}` : `/projects/${item.id}`;
              const isInternal = true;
              const visualKinds: Record<string, 'kubernetes' | 'health' | 'extract' | 'ai' | 'titan' | 'alignx' | 'surgery' | 'smotts' | 'twins' | 'edaan' | 'circlescope'> = {
                'kubernetes-platform': 'kubernetes',
                'tfg-patient-monitoring': 'health',
                'metadataxtract': 'extract',
                'metadatasearch': 'ai',
                'titan-workflow': 'titan',
                'alignx': 'alignx',
                'msurgery-platform': 'surgery',
                'smotts': 'smotts',
                'digital-twins': 'twins',
                'edaan-data-space': 'edaan',
                'instagram-epic-tool': 'circlescope',
              };
              return (
                <motion.article key={item.id} id={`project-${item.id}`} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className={`catalog-card${selectedProject === item.id ? ' is-selected' : ''}`}>
                  <ProjectVisual kind={visualKinds[item.id] ?? 'generic'} label={item.title} />
                  <div className="catalog-card-body">
                    <div className="catalog-card-meta"><span>{item.category ? CATEGORY_LABELS[item.category][lang] : lang === 'en' ? 'Writing' : 'Artículo'}</span><small>{item.company ?? (item.tag === 'professional' ? 'Professional' : 'Independent')}</small></div>
                    <h2>{href ? (isInternal ? <Link to={href}>{item.title}</Link> : <a href={href} target="_blank" rel="noopener noreferrer">{item.title}</a>) : item.title}</h2>
                    {item.description && <p>{item.description}</p>}
                    <div className="catalog-card-footer"><div>{item.technologies.slice(0, 4).map((tech, index) => <span key={tech} data-tone={(index % 3) + 1}>{tech}</span>)}</div>{href && (isInternal ? <Link to={href} aria-label={item.title}>→</Link> : <a href={href} target="_blank" rel="noopener noreferrer" aria-label={item.title}><Icon name="external" size={17} /></a>)}</div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && <div className="projects-empty-state"><FiSearch /><h2>{lang === 'en' ? 'No matching projects' : 'No hay proyectos coincidentes'}</h2><p>{lang === 'en' ? 'Try another term or reset the active filters.' : 'Prueba otro término o restablece los filtros activos.'}</p><button type="button" onClick={clearFilters}>{lang === 'en' ? 'Reset explorer' : 'Restablecer explorador'}</button></div>}
      </section>
    </motion.main>
  );
};
