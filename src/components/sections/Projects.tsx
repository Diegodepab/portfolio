import { useVisualEffects } from '../../performance/useVisualEffects';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../icons/Icon';
import { ProjectVisual, type ProjectVisualKind } from '../projects/ProjectVisual';
import { useLanguage } from '../../context/LanguageContext';
import { getUnifiedItems, CATEGORY_LABELS } from '../../utils/projects';
import { SignalDustBackdrop } from '../ui/ambient/SignalDustBackdrop';
import './Projects.css';

export const Projects: React.FC = () => {
  const { lang } = useLanguage();
  const animateEntrance = !useVisualEffects().reducedMotion;
  const previewItems = useMemo(
    () => getUnifiedItems(lang).filter(item => item.type === 'project' && item.featured).slice(0, 2),
    [lang],
  );

  return (
    <motion.section
      id="projects"
      initial={animateEntrance ? { opacity: 0, y: 40 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="projects-home"
    >
      <SignalDustBackdrop />
      <div className="projects-heading-row">
        <div>
          <SectionHeading title={lang === 'en' ? 'Selected Work' : 'Trabajos Destacados'} />
          <p className="projects-intro">
            {lang === 'en'
              ? 'Interfaces, infrastructure and products shaped by one adaptive three-color system.'
              : 'Interfaces, infraestructura y productos conectados por un sistema adaptable de tres colores.'}
          </p>
        </div>
      </div>

      <div className="featured-project-list">
        {previewItems.map((item, index) => {
          const href = `/projects/${item.id}`;
          let kind: ProjectVisualKind = 'generic';
          if (item.id === 'kubernetes-platform') kind = 'kubernetes';
          else if (item.id === 'tfg-patient-monitoring') kind = 'health';
          else if (item.id === 'metadatasearch') kind = 'ai';
          else if (item.id === 'metadataxtract') kind = 'extract';

          return (
            <motion.article
              id={`featured-project-${item.id}`}
              key={item.id}
              className="featured-project"
              initial={animateEntrance ? { opacity: 0, y: 28 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <div className="featured-project-media">
                <ProjectVisual kind={kind} label={item.title} />
              </div>
              <div className="featured-project-copy">
                <div className="featured-project-topline">
                  <span className="project-index">0{index + 1}</span>
                  <span className="project-category-badge">
                    {item.category ? CATEGORY_LABELS[item.category][lang] : 'Project'}
                  </span>
                  <span className="project-status"><i /> {lang === 'en' ? 'Case study' : 'Caso de estudio'}</span>
                </div>
                <h3>{href ? <Link to={href}>{item.title}</Link> : item.title}</h3>
                <p>{item.description}</p>
                <div className="featured-project-tech">
                  {item.technologies.map((tech, techIndex) => <span key={tech} data-tone={(techIndex % 3) + 1}>{tech}</span>)}
                </div>
                <div className="featured-project-actions">
                  {href && <Link to={href}>{lang === 'en' ? 'Explore case study' : 'Explorar caso de estudio'} <Icon name="external" size={16} /></Link>}
                  {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub — ${item.title}`}><Icon name="github" size={18} /></a>}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="projects-view-all">
        <Link to="/projects" className="projects-view-all-btn">
          {lang === 'en' ? 'Open project explorer' : 'Abrir explorador de proyectos'}
          <span className="projects-view-all-arrow">→</span>
        </Link>
      </div>
    </motion.section>
  );
};
