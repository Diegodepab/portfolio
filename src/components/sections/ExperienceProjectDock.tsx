import { useEffectVisibility, useVisualEffects } from '../../performance/useVisualEffects';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiBox, FiCloud, FiCpu, FiDatabase, FiLayers, FiX } from 'react-icons/fi';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { IconType } from 'react-icons';
import type { JobExperience, LanguageCode, Project } from '../../types/portfolio';
import { ProjectVisual } from '../projects/ProjectVisual';
import { useTour } from '../../hooks/useTour';

const VISUAL_KINDS: Record<string, 'kubernetes' | 'health' | 'extract' | 'ai' | 'titan' | 'alignx' | 'surgery' | 'smotts' | 'twins'> = {
  'kubernetes-platform': 'kubernetes',
  'tfg-patient-monitoring': 'health',
  'metadataxtract': 'extract',
  'metadatasearch': 'ai',
  'titan-workflow': 'titan',
  'alignx': 'alignx',
  'msurgery-platform': 'surgery',
  'smotts': 'smotts',
  'digital-twins': 'twins',
};

interface ExperienceProjectDockProps {
  job: JobExperience;
  projects: Project[];
  lang: LanguageCode;
}

interface ProjectBubbleProps {
  project: Project;
  index: number;
  companyProjectsUrl: string;
  lang: LanguageCode;
  active: boolean;
  reduceMotion: boolean;
  onPreview: (projectId: string) => void;
  onClose: (immediate?: boolean) => void;
  onToggle: (projectId: string) => void;
}

const MAX_VISIBLE_PROJECTS = 3;

const categoryIcons: Partial<Record<NonNullable<Project['category']>, IconType>> = {
  infrastructure: FiCloud,
  'data-science': FiDatabase,
  backend: FiCpu,
  'full-stack': FiLayers,
  'use-case': FiBox,
};

const ProjectMark = memo(({ project }: { project: Project }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = categoryIcons[project.category ?? 'use-case'] ?? FiBox;

  if (project.image && !imageFailed) {
    return (
      <span className="project-dock__mark" aria-hidden="true">
        <img src={project.image} alt="" draggable={false} className={`project-dock__logo project-dock__logo--${project.imageFit ?? 'cover'}`} onError={() => setImageFailed(true)} />
      </span>
    );
  }

  const kind = VISUAL_KINDS[project.id];
  
  if (kind === 'kubernetes') {
    return (
      <span className="project-dock__mark project-dock__mark--kubernetes" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" className="mark-k8s-helm" />
          <circle cx="12" cy="12" r="3" className="mark-k8s-core" />
          <line x1="12" y1="2" x2="12" y2="9" className="mark-k8s-spoke" />
          <line x1="12" y1="15" x2="12" y2="22" className="mark-k8s-spoke" />
          <line x1="3" y1="7" x2="9.5" y2="10.5" className="mark-k8s-spoke" />
          <line x1="14.5" y1="13.5" x2="21" y2="17" className="mark-k8s-spoke" />
          <line x1="3" y1="17" x2="9.5" y2="13.5" className="mark-k8s-spoke" />
          <line x1="14.5" y1="10.5" x2="21" y2="7" className="mark-k8s-spoke" />
        </svg>
      </span>
    );
  }

  if (kind === 'extract') {
    return (
      <span className="project-dock__mark project-dock__mark--extract" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="10" width="4" height="4" rx="1" className="mark-extract-1" />
          <line x1="7" y1="12" x2="11" y2="12" className="mark-extract-line" />
          <rect x="11" y="8" width="5" height="8" rx="1" className="mark-extract-2" />
          <line x1="16" y1="12" x2="19" y2="12" className="mark-extract-line" />
          <circle cx="20" cy="12" r="2" className="mark-extract-3" />
        </svg>
      </span>
    );
  }
  
  if (kind === 'ai') {
    return (
      <span className="project-dock__mark project-dock__mark--ai" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="5" rx="2.5" className="mark-ai-search" />
          <circle cx="7" cy="8.5" r="1.5" className="mark-ai-dot" />
          <path d="M4 16h6M4 20h10" className="mark-ai-lines" strokeLinecap="round" />
          <circle cx="19" cy="17" r="3" className="mark-ai-globe" />
        </svg>
      </span>
    );
  }

  if (kind === 'titan') {
    return (
      <span className="project-dock__mark project-dock__mark--titan" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="12" r="2" className="mark-titan-1" />
          <path d="M8 12h3m3 0h4" className="mark-titan-line" />
          <rect x="11" y="9" width="3" height="6" rx="1" className="mark-titan-2" />
          <polygon points="18 9 21 12 18 15" className="mark-titan-3" />
        </svg>
      </span>
    );
  }
  if (kind === 'alignx') {
    return (
      <span className="project-dock__mark project-dock__mark--alignx" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="6" r="2" className="mark-alignx-node mark-alignx-node--1" />
          <circle cx="6" cy="18" r="2" className="mark-alignx-node mark-alignx-node--2" />
          <circle cx="18" cy="12" r="2" className="mark-alignx-node mark-alignx-node--3" />
          <path d="M 8 7 L 16 11" className="mark-alignx-link" />
          <path d="M 8 17 L 16 13" className="mark-alignx-link" />
          <path d="M 6 8 L 6 16" className="mark-alignx-match" strokeDasharray="2" />
        </svg>
      </span>
    );
  }
  if (kind === 'surgery') {
    return (
      <span className="project-dock__mark project-dock__mark--surgery" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" className="mark-surgery-lens" />
          <line x1="12" y1="2" x2="12" y2="22" className="mark-surgery-cross" />
          <line x1="2" y1="12" x2="22" y2="12" className="mark-surgery-cross" />
          <circle cx="12" cy="12" r="2" className="mark-surgery-focus" />
        </svg>
      </span>
    );
  }
  if (kind === 'smotts') {
    return (
      <span className="project-dock__mark project-dock__mark--smotts" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="2 12 6 12 9 8 13 18 16 12 22 12" className="mark-smotts-wave" />
          <circle cx="13" cy="18" r="1.5" className="mark-smotts-dot" />
        </svg>
      </span>
    );
  }
  if (kind === 'twins') {
    return (
      <span className="project-dock__mark project-dock__mark--twins" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="6" ry="8" className="mark-twins-organ" />
          <path d="M 8 9 Q 12 4 16 9" className="mark-twins-vessel" />
          <circle cx="10" cy="10" r="1" className="mark-twins-node" />
          <circle cx="14" cy="14" r="1" className="mark-twins-node" />
        </svg>
      </span>
    );
  }

  return (
    <span className="project-dock__mark" aria-hidden="true">
      <FallbackIcon />
    </span>
  );
});

ProjectMark.displayName = 'ProjectMark';

const ProjectBubble = memo(({
  project,
  index,
  companyProjectsUrl,
  lang,
  active,
  reduceMotion,
  onPreview,
  onClose,
  onToggle,
}: ProjectBubbleProps) => {
  const bubbleRef = useRef<HTMLLIElement>(null);
  const { active: animationActive } = useEffectVisibility(bubbleRef);
  const previewId = `project-preview-${project.id}`;
  const previewTitleId = `${previewId}-title`;
  const description = project.description[lang].trim()
    || (lang === 'en' ? 'Professional project linked to this role.' : 'Proyecto profesional vinculado a este puesto.');
  const previewImage = project.media?.find(item => item.type === 'image');
  const { isActive: isTourActive } = useTour();

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (isTourActive) return;
    if (!event.currentTarget.contains(event.relatedTarget)) onClose(true);
  };

  return (
    <motion.li
      ref={bubbleRef}
      data-animation-active={animationActive}
      id={`project-dock-item-${project.id}`}
      className={`project-dock__item${active ? ' is-active' : ''}`}
      data-project-index={index}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      onMouseEnter={() => onPreview(project.id)}
      onMouseLeave={() => { if (!isTourActive) onClose(); }}
      onBlur={handleBlur}
    >
      <button
        type="button"
        className="project-dock__toggle"
        aria-expanded={active}
        aria-controls={previewId}
        aria-haspopup="dialog"
        aria-label={lang === 'en' ? `Preview ${project.name[lang]}` : `Previsualizar ${project.name[lang]}`}
        onClick={() => onToggle(project.id)}
      >
        <ProjectMark project={project} />
        <span className="project-dock__identity">
          <strong>{project.name[lang]}</strong>
          <em>{project.shortDescription?.[lang] || description}</em>
        </span>
      </button>

      <AnimatePresence>
        {active && (
          <motion.article
            id={previewId}
            className="project-dock__preview"
            role="dialog"
            aria-modal="false"
            aria-labelledby={previewTitleId}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 30 }}
          >
            <button type="button" className="project-dock__preview-close" onClick={() => onClose(true)} aria-label={lang === 'en' ? 'Close project preview' : 'Cerrar vista previa del proyecto'}><FiX /></button>
            <div className="project-dock__preview-copy">
              <span>{project.company}</span>
              <h4 id={previewTitleId}>{project.name[lang]}</h4>
              <p>{description}</p>
              <div className="project-dock__tags">
                {project.technologies.slice(0, 5).map(technology => <span key={technology}>{technology}</span>)}
              </div>
              <div className="project-dock__actions">
                <Link to={`/projects/${project.id}`}>{lang === 'en' ? 'View full project' : 'Ver proyecto completo'} <FiArrowUpRight /></Link>
                <Link to={companyProjectsUrl}>{lang === 'en' ? `More from ${project.company}` : `Más proyectos de ${project.company}`} <FiArrowRight /></Link>
              </div>
            </div>
            <div className="project-dock__preview-media">
              {VISUAL_KINDS[project.id]
                ? <ProjectVisual kind={VISUAL_KINDS[project.id]} label={project.name[lang]} />
                : previewImage
                  ? <img src={previewImage.src} alt={previewImage.alt?.[lang] ?? project.name[lang]} />
                  : <div><ProjectMark project={project} /><strong>{project.name[lang]}</strong></div>}
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </motion.li>
  );
});

ProjectBubble.displayName = 'ProjectBubble';

export const ExperienceProjectDock = memo(({ job, projects, lang }: ExperienceProjectDockProps) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const automaticPreviewConsumed = useRef(false);
  const reduceMotion = useVisualEffects().reducedMotion;
  const companyProjectsUrl = `/projects?company=${encodeURIComponent(job.company)}`;
  const initiallyVisibleProjects = useMemo(() => projects.slice(0, MAX_VISIBLE_PROJECTS), [projects]);
  const visibleProjects = showAllProjects ? projects : initiallyVisibleProjects;
  const hiddenProjectsCount = Math.max(0, projects.length - initiallyVisibleProjects.length);
  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);
  const previewProject = useCallback((projectId: string) => {
    if (automaticPreviewConsumed.current) return;
    clearTimers();
    openTimer.current = setTimeout(() => {
      automaticPreviewConsumed.current = true;
      setActiveProjectId(projectId);
      openTimer.current = null;
    }, 260);
  }, [clearTimers]);
  const closePreview = useCallback((immediate = false) => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = null;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (immediate) {
      setActiveProjectId(null);
      return;
    }
    closeTimer.current = setTimeout(() => setActiveProjectId(null), 280);
  }, []);
  const toggleProject = useCallback((projectId: string) => {
    automaticPreviewConsumed.current = true;
    clearTimers();
    setActiveProjectId(current => current === projectId ? null : projectId);
  }, [clearTimers]);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && activeProjectId) {
      event.preventDefault();
      closePreview(true);
    }
  };

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <section className="project-dock" aria-label={lang === 'en' ? `Featured projects at ${job.company}` : `Proyectos destacados en ${job.company}`} onMouseLeave={() => { closePreview(); setShowAllProjects(false); }} onKeyDown={handleKeyDown}>
      <div className="project-dock__header">
        <div><span>{lang === 'en' ? 'Projects' : 'Proyectos'}</span><small>{projects.length.toString().padStart(2, '0')}</small></div>
        <Link to={companyProjectsUrl}>{lang === 'en' ? `All ${job.company} projects` : `Todos los proyectos de ${job.company}`} <FiArrowRight /></Link>
      </div>

      <ul className="project-dock__list">
        <AnimatePresence initial={false}>
          {visibleProjects.map((project, index) => (
            <ProjectBubble
              key={project.id}
              project={project}
              index={index}
              companyProjectsUrl={companyProjectsUrl}
              lang={lang}
              active={activeProjectId === project.id}
              reduceMotion={reduceMotion}
              onPreview={previewProject}
              onClose={closePreview}
              onToggle={toggleProject}
            />
          ))}
        </AnimatePresence>
        {hiddenProjectsCount > 0 && (
          <li className="project-dock__more">
            <button type="button" aria-expanded={showAllProjects} onMouseEnter={() => setShowAllProjects(true)} onFocus={() => setShowAllProjects(true)} onClick={() => setShowAllProjects(current => !current)}>
              <strong>{showAllProjects ? '−' : `+${hiddenProjectsCount}`}</strong><span>{showAllProjects ? (lang === 'en' ? 'Less' : 'Menos') : (lang === 'en' ? 'More' : 'Más')}</span>
            </button>
          </li>
        )}
      </ul>
    </section>
  );
});

ExperienceProjectDock.displayName = 'ExperienceProjectDock';
