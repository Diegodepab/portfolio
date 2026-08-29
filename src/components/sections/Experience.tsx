import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { featuredProjects } from '../../data/projects';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowUpRight, FiBriefcase, FiMapPin } from 'react-icons/fi';
import { SectionHeading } from '../ui/SectionHeading';
import { experiences } from '../../data/experience';
import { ExperienceProjectDock } from './ExperienceProjectDock';
import { ExperienceGallery } from './ExperienceGallery';
import { CareerBackdrop } from '../ui/ambient/CareerBackdrop';
import './Experience.css';

const employmentLabels = {
  'full-time': { en: 'Full-time', es: 'Jornada completa' },
  'part-time': { en: 'Part-time', es: 'Media jornada' },
  contract: { en: 'Contract', es: 'Contrato' },
  internship: { en: 'Internship', es: 'Prácticas' },
  freelance: { en: 'Freelance', es: 'Autónomo' },
};

const locationLabels = {
  'on-site': { en: 'On-site', es: 'Presencial' },
  hybrid: { en: 'Hybrid', es: 'Híbrido' },
  remote: { en: 'Remote', es: 'En remoto' },
};

export const Experience: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { lang } = useLanguage();
  const job = experiences[activeTabId];
  const projects = job.projectIds
    .map(id => featuredProjects.find(project => project.id === id))
    .filter(project => project !== undefined);
  const start = `${job.startDate.month[lang]} ${job.startDate.year}`;
  const end = job.current
    ? (lang === 'en' ? 'Present' : 'Actualidad')
    : job.endDate ? `${job.endDate.month[lang]} ${job.endDate.year}` : '';

  const selectTab = (index: number) => {
    const nextIndex = (index + experiences.length) % experiences.length;
    setActiveTabId(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      selectTab(index + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      selectTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab(experiences.length - 1);
    }
  };

  return (
    <section id="jobs" className="experience-section">
      <CareerBackdrop />
      <SectionHeading title={lang === 'en' ? "Where I've Worked" : 'Dónde he trabajado'} />
      <div className="experience-shell">
        <div className="experience-tabs" role="tablist" aria-label={lang === 'en' ? 'Work experience' : 'Experiencia laboral'}>
          {experiences.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`job-tab-${index}`}
              role="tab"
              aria-selected={activeTabId === index}
              aria-controls={`job-panel-${index}`}
              tabIndex={activeTabId === index ? 0 : -1}
              onClick={() => setActiveTabId(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>{item.company}
            </button>
          ))}
          <motion.i className="experience-tab-marker" animate={{ y: activeTabId * 52 }} transition={{ duration: .25 }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.article key={job.id} id={`job-panel-${activeTabId}`} role="tabpanel" aria-labelledby={`job-tab-${activeTabId}`} className={`experience-card experience-card--${job.id}${projects.length > 0 ? ' experience-card--with-projects' : ''}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .22 }}>
            <header className="experience-header">
              <p className="experience-eyebrow">{String(activeTabId + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')} · {start} — {end}</p>
              <h3>
                <span>{job.role[lang]}</span>
                <small>{lang === 'en' ? 'at' : 'en'}</small>
                {job.companyUrl ? <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">{job.company}<FiArrowUpRight /></a> : job.company}
              </h3>
              <div className="experience-facts">
                {job.location && <span><FiMapPin />{job.location[lang]}{job.locationType && ` · ${locationLabels[job.locationType][lang]}`}</span>}
                {job.employmentType && <span><FiBriefcase />{employmentLabels[job.employmentType][lang]}</span>}
              </div>
            </header>

            <div className="experience-body experience-body--single">
              <div className="experience-story">
                <div className="experience-story-copy">
                  {job.summary && <p className="experience-summary">{job.summary[lang]}</p>}
                  <div className="experience-highlights">
                    <p>{lang === 'en' ? 'SELECTED IMPACT' : 'IMPACTO DESTACADO'}</p>
                    <ul>{job.highlights[lang].map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
                  </div>
                </div>
                {projects.length > 0 && <ExperienceProjectDock key={job.id} job={job} projects={projects} lang={lang} />}
              </div>
            </div>
            {job.photos && job.photos.length > 0 && <ExperienceGallery photos={job.photos} />}
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
};
