import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '../icons/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { education, certificates } from '../../data/education';
import type { Education, Certificate, EducationMedia } from '../../types/portfolio';
import type { LanguageCode } from '../../types/portfolio';
import { Marquee } from '../ui/Marquee';
import './EducationCard.css';

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Renders skills either as a static list or a scrolling marquee if too many. */
const SkillList: React.FC<{ skills: string[] }> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  
  // If we have 6 or fewer skills, just render them normally (no carousel needed)
  if (skills.length <= 6) {
    return (
      <div className="edu-skills">
        {skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className="edu-skill-pill">
            {skill}
          </span>
        ))}
      </div>
    );
  }

  // If there are many skills, use the continuous marquee
  return (
    <div className="edu-skills-marquee-wrapper">
      <Marquee 
        expandOnHover 
        fade 
        duration="80s" 
        gap="12px"
        numberOfCopies={2}
        innerClassName="edu-skills-marquee-inner"
      >
        {skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className="edu-skill-pill">
            {skill}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

/** Protected thumbnail viewer for media (disables download/interaction) */
const MediaViewer: React.FC<{ media: EducationMedia; lang: LanguageCode }> = ({ media, lang }) => {
  const [open, setOpen] = useState(false);
  const label = lang === 'en' ? 'View document' : 'Ver documento';
  const hideLabel = lang === 'en' ? 'Hide' : 'Ocultar';

  return (
    <div className="edu-media">
      <button
        className="edu-media__toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
      >
        <Icon name="document" size={14} />
        {open ? hideLabel : label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="edu-media__thumbnail">
              {/* Overlay blocks all mouse events / right clicks to prevent downloads */}
              <div 
                className="edu-media__overlay" 
                onContextMenu={e => e.preventDefault()} 
                title={lang === 'en' ? 'Document preview' : 'Vista previa del documento'}
              />
              
              {media.type === 'pdf' ? (
                <iframe
                  src={`${media.src}#toolbar=0&navpanes=0&scrollbar=0&view=${media.viewMode || 'FitH'}`}
                  title={media.alt || 'Document'}
                  className="edu-media__pdf"
                  tabIndex={-1}
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.alt || ''}
                  className="edu-media__img"
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** A single degree entry card */
const DegreeEntry: React.FC<{ edu: Education; lang: LanguageCode }> = ({ edu, lang }) => {
  const dateRange = `${edu.startDate.month[lang]} ${edu.startDate.year} – ${
    edu.endDate
      ? `${edu.endDate.month[lang]} ${edu.endDate.year}`
      : lang === 'en' ? 'Present' : 'Actualidad'
  }`;

  return (
    <div className="edu-entry">
      <div className="edu-entry__header">
        <div className="edu-entry__title-block">
          <h4 className="edu-entry__title">
            {edu.degree[lang]} — {edu.field[lang]}
          </h4>
          <div className="edu-entry__institution">
            {edu.institutionUrl ? (
              <a href={edu.institutionUrl} target="_blank" rel="noopener noreferrer">
                {edu.institution}
              </a>
            ) : (
              <span>{edu.institution}</span>
            )}
          </div>
        </div>
        
        {edu.grade && (
          <div className="edu-entry__grade-wrapper">
            <span className="edu-entry__grade">
              {edu.grade}<span className="edu-entry__grade-max">/10</span>
            </span>
          </div>
        )}
      </div>

      <div className="edu-entry__meta">
        <span>{dateRange}</span>
        {edu.discipline && (
          <span className="edu-entry__discipline">{edu.discipline[lang]}</span>
        )}
      </div>

      {edu.description && (
        <div className="edu-entry__description">{edu.description[lang]}</div>
      )}

      {edu.skills && edu.skills.length > 0 && <SkillList skills={edu.skills} />}

      {edu.media?.map((m, idx) => (
        <MediaViewer key={idx} media={m} lang={lang} />
      ))}
    </div>
  );
};

/** A single certificate entry card */
const CertificateEntry: React.FC<{ cert: Certificate; lang: LanguageCode }> = ({ cert, lang }) => {
  const dateStr = cert.issueDate
    ? `${cert.issueDate.month[lang]} ${cert.issueDate.year}`
    : '';

  return (
    <div className="edu-entry">
      <div className="edu-entry__header">
        <div>
          <h4 className="edu-entry__title">{cert.name[lang]}</h4>
          <div className="edu-entry__institution">
            {cert.issuerUrl ? (
              <a href={cert.issuerUrl} target="_blank" rel="noopener noreferrer">
                {cert.issuer}
              </a>
            ) : (
              <span>{cert.issuer}</span>
            )}
          </div>
        </div>
      </div>

      <div className="edu-entry__meta">
        {dateStr && <span>{lang === 'en' ? 'Issued' : 'Expedido'}: {dateStr}</span>}
        {cert.credentialId && <span>ID: {cert.credentialId}</span>}
        {cert.credentialUrl && (
          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-1)' }}>
            {lang === 'en' ? 'View credential' : 'Ver credencial'}
          </a>
        )}
      </div>

      {cert.description && (
        <div className="edu-entry__description">{cert.description[lang]}</div>
      )}

      {cert.skills && cert.skills.length > 0 && <SkillList skills={cert.skills} />}

      {cert.media?.map((m, idx) => (
        <MediaViewer key={idx} media={m} lang={lang} />
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

type TabId = 'degrees' | 'certificates';

export const EducationCard: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('degrees');
  const degreeTabRef = React.useRef<HTMLButtonElement>(null);
  const certificateTabRef = React.useRef<HTMLButtonElement>(null);

  const hasDegrees = education.length > 0;
  const hasCerts = certificates.length > 0;

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openEducation', handleOpen);
    return () => window.removeEventListener('openEducation', handleOpen);
  }, []);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextTab: TabId = event.key === 'Home'
      ? 'degrees'
      : event.key === 'End'
        ? 'certificates'
        : activeTab === 'degrees' ? 'certificates' : 'degrees';
    setActiveTab(nextTab);
    (nextTab === 'degrees' ? degreeTabRef : certificateTabRef).current?.focus();
  };

  return (
    <div className="edu-card">
      {/* Folder trigger */}
      <button
        className="edu-card__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls="edu-card-panel"
      >
        <Icon name="folder" size={18} className="edu-card__trigger-icon" />
        <span className="edu-card__trigger-label">
          {lang === 'en' ? 'Education & Certifications' : 'Formación y Certificaciones'}
        </span>
        <Icon name="chevron-down" size={16} className="edu-card__trigger-chevron" />
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="edu-card-panel"
            className="edu-card__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="edu-card__inner">
              {/* Category tabs */}
              <div className="edu-tabs" role="tablist" aria-label={lang === 'en' ? 'Education categories' : 'Categorías de formación'}>
                {hasDegrees && (
                  <button
                    ref={degreeTabRef}
                    id="education-tab-degrees"
                    className={`edu-tab${activeTab === 'degrees' ? ' edu-tab--active' : ''}`}
                    role="tab"
                    aria-selected={activeTab === 'degrees'}
                    aria-controls="education-panel-degrees"
                    tabIndex={activeTab === 'degrees' ? 0 : -1}
                    onClick={() => setActiveTab('degrees')}
                    onKeyDown={handleTabKeyDown}
                  >
                    <Icon name="graduation" size={15} className="edu-tab__icon" />
                    {lang === 'en' ? 'Degrees' : 'Carreras'}
                    <span className="edu-tab__count">{education.length}</span>
                  </button>
                )}
                {hasCerts && (
                  <button
                    ref={certificateTabRef}
                    id="education-tab-certificates"
                    className={`edu-tab${activeTab === 'certificates' ? ' edu-tab--active' : ''}`}
                    role="tab"
                    aria-selected={activeTab === 'certificates'}
                    aria-controls="education-panel-certificates"
                    tabIndex={activeTab === 'certificates' ? 0 : -1}
                    onClick={() => setActiveTab('certificates')}
                    onKeyDown={handleTabKeyDown}
                  >
                    <Icon name="award" size={15} className="edu-tab__icon" />
                    {lang === 'en' ? 'Certificates' : 'Certificados'}
                    <span className="edu-tab__count">{certificates.length}</span>
                  </button>
                )}
              </div>

              {/* Tab content */}
              {activeTab === 'degrees' && hasDegrees && (
                <div id="education-panel-degrees" role="tabpanel" aria-labelledby="education-tab-degrees">
                  {education.map(edu => (
                    <DegreeEntry key={edu.id} edu={edu} lang={lang} />
                  ))}
                </div>
              )}

              {activeTab === 'certificates' && hasCerts && (
                <div id="education-panel-certificates" role="tabpanel" aria-labelledby="education-tab-certificates">
                  {certificates.map(cert => (
                    <CertificateEntry key={cert.id} cert={cert} lang={lang} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
