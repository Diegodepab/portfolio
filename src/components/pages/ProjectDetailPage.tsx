import './ProjectDetailPage.css';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { FiAlertCircle, FiArrowLeft, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { featuredProjects } from '../../data/projects';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectVisual } from '../projects/ProjectVisual';
import { ProjectRouteBackdrop } from '../ui/ambient/ProjectRouteBackdrop';
import { CATEGORY_LABELS } from '../../utils/projects';
import '../sections/Projects.css';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const project = featuredProjects.find(item => item.id === id);
  if (!project) return <Navigate to="/projects" replace />;

  const description = project.description[lang].trim() || (lang === 'en'
    ? 'This professional case study is being documented. Its structure is ready for the challenge, contribution, process, media and results.'
    : 'Este caso profesional está en proceso de documentación. Su estructura está preparada para explicar reto, contribución, proceso, material y resultados.');

  return (
    <motion.main className="project-detail-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>
      <Helmet title={`${project.name[lang]} | Diego De Pablo`}>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${project.name[lang]} | Diego De Pablo`} />
        <meta property="og:description" content={description} />
      </Helmet>
      <ProjectRouteBackdrop key={project.id} variant="random" />
      <Link className="project-detail-back" to={project.company ? `/projects?company=${encodeURIComponent(project.company)}` : '/projects'}><FiArrowLeft /> {lang === 'en' ? 'Back to project map' : 'Volver al mapa de proyectos'}</Link>
      <header className="project-detail-hero">
        <div className="project-detail-copy">
          <p>{project.company ?? (lang === 'en' ? 'Independent project' : 'Proyecto independiente')} · {project.category ? CATEGORY_LABELS[project.category][lang] : ''}</p>
          <h1>{project.name[lang]}</h1>
          <p>{description}</p>
          <div className="project-detail-tech">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
          <div className="project-detail-actions">
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer"><FiGithub /> GitHub</a>}
            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">{lang === 'en' ? 'Visit project' : 'Visitar proyecto'} <FiArrowUpRight /></a>}
          </div>
          {project.repositoryNotice && <p className="project-repository-notice"><FiAlertCircle /> {project.repositoryNotice[lang]}</p>}
        </div>
        {(() => {
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
          const kind = visualKinds[project.id];
          if (kind) return <ProjectVisual kind={kind} label={project.name[lang]} />;
          if (project.image) return <div className="project-detail-brand"><img src={project.image} alt={project.name[lang]} /></div>;
          return <ProjectVisual kind="generic" label={project.name[lang]} />;
        })()}
      </header>
      {project.caseStudy ? (
        <section className="project-case-study">
          <div className="project-case-study__intro"><span>CASE STUDY / {project.id.toUpperCase()}</span><h2>{project.caseStudy.title?.[lang] ?? (lang === 'en' ? 'Deep dive' : 'En profundidad')}</h2></div>
          <div className="project-case-study__grid">
            <article><span>01</span><h3>{lang === 'en' ? 'The challenge' : 'El reto'}</h3><p>{project.caseStudy.challenge[lang]}</p></article>
            <article><span>02</span><h3>{lang === 'en' ? 'The solution' : 'La solución'}</h3><p>{project.caseStudy.solution[lang]}</p></article>
            <article><span>03</span><h3>{lang === 'en' ? 'My contribution' : 'Mi contribución'}</h3><p>{project.caseStudy.contribution[lang]}</p></article>
            {project.caseStudy.evolution && <article><span>04</span><h3>{lang === 'en' ? 'Next evolution' : 'Próxima evolución'}</h3><p>{project.caseStudy.evolution[lang]}</p></article>}
          </div>
          {project.media?.map(item => {
            if (item.type === 'image') {
              return (
                <figure className="project-case-study__media" key={item.src}>
                  <img src={item.src} alt={item.alt?.[lang] ?? project.name[lang]} />
                  <figcaption>{item.title?.[lang]}</figcaption>
                </figure>
              );
            }
            if (item.type === 'youtube') {
              const videoId = item.src.split('v=')[1]?.split('&')[0] || item.src.split('/').pop();
              return (
                <figure className="project-case-study__media" key={item.src}>
                  <div className="project-case-study__video">
                    <iframe 
                      src={`https://www.youtube.com/embed/${videoId}`} 
                      title={item.title?.[lang] ?? project.name[lang]}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                    />
                  </div>
                  <figcaption>{item.title?.[lang]}</figcaption>
                </figure>
              );
            }
            return null;
          })}
        </section>
      ) : null}
    </motion.main>
  );
};
