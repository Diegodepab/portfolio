import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowUpRight,
  FiAward,
  FiCheckCircle,
  FiFileText,
  FiGithub,
  FiMaximize2,
  FiX,
  FiVideo,
  FiLayers,
} from 'react-icons/fi';
import { VideoPreview } from '../ui/VideoPreview';
import { imageAssets } from '../../data/imageAssets';
import { projectVisuals } from '../../data/projectVisuals';
import { featuredProjects } from '../../data/projects';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectVisual } from '../projects/ProjectVisual';
import { ProjectRouteBackdrop } from '../ui/ambient/ProjectRouteBackdrop';
import { IoTArchitectureFlow } from '../projects/IoTArchitectureFlow';
import { CATEGORY_LABELS } from '../../utils/projects';
import './ProjectDetailPage.css';
import '../sections/Projects.css';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [activeMediaFilter, setActiveMediaFilter] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; caption?: string } | null>(null);

  const project = featuredProjects.find(item => item.id === id);

  // Available media categories (hooks called unconditionally)
  const mediaCategories = useMemo(() => {
    if (!project?.media || project.media.length === 0) return [];
    const set = new Set<string>();
    project.media.forEach(m => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [project?.media]);

  const filteredMedia = useMemo(() => {
    if (!project?.media) return [];
    if (activeMediaFilter === 'all') return project.media;
    return project.media.filter(m => m.category === activeMediaFilter);
  }, [project?.media, activeMediaFilter]);

  if (!project) return <Navigate to="/projects" replace />;

  const description = project.description[lang].trim() || (lang === 'en'
    ? 'This professional case study is being documented. Its structure is ready for the challenge, contribution, process, media and results.'
    : 'Este caso profesional está en proceso de documentación. Su estructura está preparada para explicar reto, contribución, proceso, material y resultados.');

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'all': return lang === 'en' ? 'All Resources' : 'Todos los recursos';
      case 'hardware': return lang === 'en' ? 'Hardware & Sensors' : 'Hardware y Sensores';
      case 'platform': return lang === 'en' ? 'Web Platform' : 'Plataforma Web';
      case 'architecture': return lang === 'en' ? 'Architecture' : 'Arquitectura';
      case 'demo': return lang === 'en' ? 'Video Walkthroughs' : 'Demostraciones en Vídeo';
      default: return cat;
    }
  };

  return (
    <motion.main className="project-detail-page" initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <ProjectRouteBackdrop key={project.id} variant="technical" />

      <Link
        className="project-detail-back"
        to={project.company ? `/projects?company=${encodeURIComponent(project.company)}` : '/projects'}
      >
        <FiArrowLeft /> {lang === 'en' ? 'Back to project map' : 'Volver al mapa de proyectos'}
      </Link>

      {/* HERO SECTION */}
      <header className="project-detail-hero">
        <div className="project-detail-copy">
          <div className="project-detail-meta-row">
            <span className="project-detail-badge">
              {project.company ?? (lang === 'en' ? 'Independent project' : 'Proyecto independiente')} · {project.category ? CATEGORY_LABELS[project.category][lang] : ''}
            </span>
            {project.awardBadge && (
              <span className="project-detail-award">
                <FiAward /> {project.awardBadge[lang]}
              </span>
            )}
          </div>

          <h1>{project.name[lang]}</h1>
          <p>{description}</p>

          <div className="project-detail-tech">
            {project.technologies.map(tech => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <div className="project-detail-actions">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <FiGithub /> GitHub
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {lang === 'en' ? 'Visit project' : 'Visitar proyecto'} <FiArrowUpRight />
              </a>
            )}
            {project.id === 'tfg-patient-monitoring' && (
              <a
                href="https://github.com/Diegodepab/TFG_Pulsera_Seguimiento_Pacientes_Avanzada_Edad/blob/main/docs/REPORT/plantilla%20TFG%20latex/2DiegoDePabloTFG.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail-action-doc"
              >
                <FiFileText /> {lang === 'en' ? 'Thesis Dissertation (PDF)' : 'Memoria del TFG (PDF)'}
              </a>
            )}
          </div>

          {project.repositoryNotice && (
            <p className="project-repository-notice">
              <FiAlertCircle /> {project.repositoryNotice[lang]}
            </p>
          )}
        </div>

        {(() => {
          const kind = projectVisuals[project.id];
          if (kind) return <ProjectVisual kind={kind} label={project.name[lang]} />;
          if (project.image) return <div className="project-detail-brand"><img src={project.image} alt={project.name[lang]} /></div>;
          return <ProjectVisual kind="generic" label={project.name[lang]} />;
        })()}
      </header>

      {/* STATS HIGHLIGHT BAR */}
      {project.stats && project.stats.length > 0 && (
        <section className="project-stats-grid">
          {project.stats.map(s => (
            <div className="project-stat-card" key={s.label[lang]}>
              <strong className="project-stat-value">{s.value}</strong>
              <span className="project-stat-label">{s.label[lang]}</span>
              {s.subtext && <em className="project-stat-subtext">{s.subtext[lang]}</em>}
            </div>
          ))}
        </section>
      )}

      {/* ARCHITECTURE DIAGRAM SECTION */}
      {project.architectureType === 'iot-telemetry' && (
        <section className="project-architecture-section">
          <IoTArchitectureFlow />
        </section>
      )}

      {/* CASE STUDY OR RICH DEEP DIVE SECTIONS */}
      {project.sections && project.sections.length > 0 ? (
        <section className="project-deep-dive">
          <div className="project-deep-dive__intro">
            <span className="editorial-eyebrow">
              {lang === 'en' ? 'ENGINEERING CASE STUDY' : 'CASO DE ESTUDIO TÉCNICO'}
            </span>
            <h2>{lang === 'en' ? 'System Architecture & Implementation Story' : 'Crónica de Arquitectura e Implementación'}</h2>
          </div>

          <div className="project-editorial-stream">
            {project.sections.map((section, idx) => {
              const imageAsset = section.featuredImage ? imageAssets[section.featuredImage.src] : null;
              const hasImage = Boolean(section.featuredImage);
              const isEven = idx % 2 === 0;

              return (
                <article
                  className={`project-editorial-entry ${hasImage ? (isEven ? 'with-image standard' : 'with-image reverse') : 'full-narrative'}`}
                  key={section.id}
                >
                  <div className="project-editorial-narrative">
                    <header className="project-editorial-head">
                      <span className="editorial-number">{section.number}</span>
                      <div className="editorial-heading-group">
                        <h3>{section.title[lang]}</h3>
                        {section.subtitle && <p className="editorial-subtitle">{section.subtitle[lang]}</p>}
                      </div>
                    </header>

                    <div className="project-editorial-body markdown-body">
                      <ReactMarkdown>{section.content[lang]}</ReactMarkdown>
                    </div>

                    {section.keyPoints && section.keyPoints.length > 0 && (
                      <ul className="editorial-takeaways">
                        {section.keyPoints.map(kp => (
                          <li key={kp[lang]}>
                            <FiCheckCircle className="takeaway-icon" />
                            <span>{kp[lang]}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {section.featuredImage && (
                    <figure
                      className="project-editorial-visual"
                      onClick={() => setLightboxImage({
                        src: imageAsset?.src ?? section.featuredImage!.src,
                        title: section.title[lang],
                        caption: section.featuredImage?.caption?.[lang],
                      })}
                    >
                      <div className="editorial-visual-frame">
                        <img
                          src={imageAsset?.src ?? section.featuredImage.src}
                          srcSet={imageAsset?.srcSet}
                          sizes="(max-width: 900px) 100vw, 520px"
                          width={imageAsset?.width ?? 900}
                          height={imageAsset?.height ?? 600}
                          loading="lazy"
                          decoding="async"
                          alt={section.featuredImage.alt?.[lang] ?? section.title[lang]}
                        />
                        <span className="visual-zoom-pill">
                          <FiMaximize2 /> {lang === 'en' ? 'Enlarge' : 'Ampliar'}
                        </span>
                      </div>
                      {section.featuredImage.caption && (
                        <figcaption className="editorial-visual-caption">
                          {section.featuredImage.caption[lang]}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : project.caseStudy ? (
        <section className="project-case-study">
          <div className="project-case-study__intro">
            <span>CASE STUDY / {project.id.toUpperCase()}</span>
            <h2>{project.caseStudy.title?.[lang] ?? (lang === 'en' ? 'Deep dive' : 'En profundidad')}</h2>
          </div>

          <div className="project-case-study__timeline">
            <article className="timeline-item">
              <div className="timeline-item__step">01</div>
              <div className="timeline-item__content">
                <span className="timeline-item__tag">{lang === 'en' ? 'The Challenge' : 'El Reto'}</span>
                <h3>{lang === 'en' ? 'Problem Statement' : 'Definición del Problema'}</h3>
                <p>{project.caseStudy.challenge[lang]}</p>
              </div>
            </article>

            <article className="timeline-item">
              <div className="timeline-item__step">02</div>
              <div className="timeline-item__content">
                <span className="timeline-item__tag">{lang === 'en' ? 'The Solution' : 'La Solución'}</span>
                <h3>{lang === 'en' ? 'Architectural Approach' : 'Enfoque de Arquitectura'}</h3>
                <p>{project.caseStudy.solution[lang]}</p>
              </div>
            </article>

            <article className="timeline-item">
              <div className="timeline-item__step">03</div>
              <div className="timeline-item__content">
                <span className="timeline-item__tag">{lang === 'en' ? 'My Contribution' : 'Mi Contribución'}</span>
                <h3>{lang === 'en' ? 'Core Impact & Implementation' : 'Impacto e Implementación'}</h3>
                <p>{project.caseStudy.contribution[lang]}</p>
              </div>
            </article>

            {project.caseStudy.evolution && (
              <article className="timeline-item">
                <div className="timeline-item__step">04</div>
                <div className="timeline-item__content">
                  <span className="timeline-item__tag">{lang === 'en' ? 'Next Evolution' : 'Próxima Evolución'}</span>
                  <h3>{lang === 'en' ? 'Roadmap & Future Scaling' : 'Evolución y Escalabilidad'}</h3>
                  <p>{project.caseStudy.evolution[lang]}</p>
                </div>
              </article>
            )}
          </div>
        </section>
      ) : null}

      {/* RICH MEDIA & VIDEO SHOWCASE */}
      {project.media && project.media.length > 0 && (
        <section className="project-media-showcase">
          <div className="project-media-showcase__header">
            <div>
              <span className="project-media-showcase__tag">
                <FiLayers /> {lang === 'en' ? 'Media & Demonstration Gallery' : 'Galería Multimedia y Demostraciones'}
              </span>
              <h2>{lang === 'en' ? 'Visual Artifacts & Working Prototypes' : 'Artefactos Visuales y Demostraciones'}</h2>
            </div>

            {mediaCategories.length > 1 && (
              <div className="project-media-filters">
                <button
                  type="button"
                  className={`media-filter-btn ${activeMediaFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveMediaFilter('all')}
                >
                  {categoryLabel('all')} ({project.media.length})
                </button>
                {mediaCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`media-filter-btn ${activeMediaFilter === cat ? 'active' : ''}`}
                    onClick={() => setActiveMediaFilter(cat)}
                  >
                    {categoryLabel(cat)} ({project.media?.filter(m => m.category === cat).length})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="project-media-grid">
            {filteredMedia.map(item => {
              if (item.type === 'image') {
                const asset = imageAssets[item.src];
                const titleText = item.title?.[lang] ?? project.name[lang];
                const captionText = item.caption?.[lang];
                return (
                  <figure
                    className="project-media-card image-card"
                    key={item.src}
                    onClick={() => setLightboxImage({ src: asset?.src ?? item.src, title: titleText, caption: captionText })}
                  >
                    <div className="project-media-card__img-wrap">
                      <img
                        src={asset?.src ?? item.src}
                        srcSet={asset?.srcSet}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                        width={asset?.width ?? 1200}
                        height={asset?.height ?? 675}
                        loading="lazy"
                        decoding="async"
                        alt={item.alt?.[lang] ?? titleText}
                      />
                      <span className="project-media-card__zoom-hint">
                        <FiMaximize2 /> {lang === 'en' ? 'Enlarge' : 'Ampliar'}
                      </span>
                      {item.category && (
                        <span className="project-media-card__category-badge">
                          {categoryLabel(item.category)}
                        </span>
                      )}
                    </div>
                    <figcaption className="project-media-card__caption">
                      <strong>{titleText}</strong>
                      {captionText && <p>{captionText}</p>}
                    </figcaption>
                  </figure>
                );
              }

              if (item.type === 'youtube') {
                const titleText = item.title?.[lang] ?? project.name[lang];
                const captionText = item.caption?.[lang];
                return (
                  <figure className="project-media-card video-card" key={item.src}>
                    <div className="project-media-card__video-wrap">
                      <VideoPreview src={item.src} title={titleText} />
                    </div>
                    <figcaption className="project-media-card__caption">
                      <div className="video-title-row">
                        <FiVideo className="video-icon" />
                        <strong>{titleText}</strong>
                      </div>
                      {captionText && <p>{captionText}</p>}
                    </figcaption>
                  </figure>
                );
              }

              return null;
            })}
          </div>
        </section>
      )}

      {/* ACADEMIC HONOURS BANNER FOR TFG */}
      {project.id === 'tfg-patient-monitoring' && (
        <section className="project-academic-banner">
          <div className="academic-banner-content">
            <span className="academic-badge">
              <FiAward /> {lang === 'en' ? 'Academic Recognition' : 'Reconocimiento Académico'}
            </span>
            <h3>
              {lang === 'en'
                ? 'BSc Dissertation in Health Engineering & Bioinformatics'
                : 'Trabajo de Fin de Grado en Ingeniería de la Salud (Bioinformática)'}
            </h3>
            <p>
              {lang === 'en'
                ? 'Presented at the University of Málaga with maximum grade: 10.0 / 10 and Honours Distinction (Matrícula de Honor). Supervised by Cristian Martín Fernández and Daniel Garrido Márquez.'
                : 'Defendido en la Universidad de Málaga con la máxima calificación: 10,0 / 10 y Matrícula de Honor. Tutorizado por Cristian Martín Fernández y Daniel Garrido Márquez.'}
            </p>
            <div className="academic-actions">
              <a
                href="https://github.com/Diegodepab/TFG_Pulsera_Seguimiento_Pacientes_Avanzada_Edad/blob/main/docs/REPORT/plantilla%20TFG%20latex/2DiegoDePabloTFG.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="academic-btn primary"
              >
                <FiFileText /> {lang === 'en' ? 'Read Full Thesis Dissertation (PDF)' : 'Leer Memoria Completa del TFG (PDF)'}
              </a>
              <a
                href="https://github.com/Diegodepab/TFG_Pulsera_Seguimiento_Pacientes_Avanzada_Edad"
                target="_blank"
                rel="noopener noreferrer"
                className="academic-btn"
              >
                <FiGithub /> {lang === 'en' ? 'View TFG Repository' : 'Ver Repositorio del TFG'}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div className="project-lightbox" onClick={() => setLightboxImage(null)}>
          <div className="project-lightbox__content" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="project-lightbox__close"
              onClick={() => setLightboxImage(null)}
              aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
            >
              <FiX />
            </button>
            <img src={lightboxImage.src} alt={lightboxImage.title} />
            <div className="project-lightbox__caption">
              <strong>{lightboxImage.title}</strong>
              {lightboxImage.caption && <p>{lightboxImage.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </motion.main>
  );
};
