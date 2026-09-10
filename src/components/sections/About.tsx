import { useVisualEffects } from '../../performance/useVisualEffects';
import { imageAssets } from '../../data/imageAssets';
import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from '../ui/SectionHeading';
import { skills } from '../../data/skills';
import { languages } from '../../data/education';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../icons/Icon';
import { CrossfadeGallery, type GalleryImage } from '../ui/CrossfadeGallery';
import { CALM_TRANSITION_EFFECTS } from '../ui/image-transitions/effects';
import { EducationCard } from './EducationCard';
import { AntsCursor } from '../ui/AntsCursor';
import './About.css';

const portraits: Record<'es' | 'en', GalleryImage[]> = {
  es: [
    { ...imageAssets['/images/portraits/diego-carnet.webp'], sizes: '(max-width: 768px) 300px, 360px', alt: 'Retrato de Diego De Pablo', position: 'center 18%' },
    { ...imageAssets['/images/portraits/diego-formal.webp'], sizes: '(max-width: 768px) 300px, 360px', alt: 'Diego De Pablo vestido de forma formal', position: 'center 22%' },
    { ...imageAssets['/images/portraits/diego-formal-group.webp'], sizes: '(max-width: 768px) 300px, 360px', alt: 'Diego De Pablo acompañado en un acto formal', position: 'center center' },
  ],
  en: [
    { ...imageAssets['/images/portraits/diego-carnet.webp'], sizes: '(max-width: 768px) 300px, 360px', alt: 'Portrait of Diego De Pablo', position: 'center 18%' },
    { ...imageAssets['/images/portraits/diego-formal.webp'], sizes: '(max-width: 768px) 300px, 360px', alt: 'Diego De Pablo in formal attire', position: 'center 22%' },
    { ...imageAssets['/images/portraits/diego-formal-group.webp'], sizes: '(max-width: 768px) 300px, 360px', alt: 'Diego De Pablo with others at a formal event', position: 'center center' },
  ],
};

export const About: React.FC = () => {
  const { lang } = useLanguage();
  const animateEntrance = !useVisualEffects().reducedMotion;
  return (
    <motion.section
      id="about"
      initial={animateEntrance ? { opacity: 0, y: 50 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="about-section"
    >
      <AntsCursor color="var(--color-accent-1)" numberOfAnts={20} speed={1.1} sizeMultiplier={0.5} opacity={0.3} zIndex="-1" />
      <SectionHeading title={lang === 'en' ? "About Me" : "Sobre mí"} />

      <div className="about-content">

        <div className="about-text">
          {lang === 'en' ? (
            <>
              <p className="about-paragraph">
                I'm a full-stack engineer, and most of my time goes into deploying use cases and infrastructure — that's where I think the most interesting problems are, and why I chose the{' '}
                <a href="https://www.uma.es/etsi-informatica/info/152999/master-universitario-en-ingenieria-informaticaplan-2025/" target="_blank" rel="noopener noreferrer">
                  Master's in Software Engineering (2026)
                </a>.
              </p>
              <p className="about-paragraph">
                Before that, I graduated in{' '}
                <a href="https://www.uma.es/grado-en-ingenieria-de-la-salud/" target="_blank" rel="noopener noreferrer">
                  Health Engineering (Bioinformatics)
                </a>
                . A multidisciplinary degree focused on problem-solving and adapting to cutting-edge technologies with a research-oriented approach.
              </p>
              <p className="about-paragraph">
                If you want to see how I structure my ideas,{' '}
                <a href="#projects">take a look at my projects</a>.
              </p>
            </>
          ) : (
            <>
              <p className="about-paragraph">
                Soy ingeniero enfocado principalmente en casos de uso e infraestructura, que es donde creo que se resuelven los problemas más interesantes, y por lo cual elegí el{' '}
                <a href="https://www.uma.es/etsi-informatica/info/152999/master-universitario-en-ingenieria-informaticaplan-2025/" target="_blank" rel="noopener noreferrer">
                  Máster Universitario en Ingeniería Informática
                </a>.
              </p>
              <p className="about-paragraph">
                Antes de esto, me gradué en{' '}
                <a href="https://www.uma.es/grado-en-ingenieria-de-la-salud/" target="_blank" rel="noopener noreferrer">
                  Ingeniería de la Salud (Bioinformática)
                </a>
                . Carrera multidisciplinar enfocada en la solución de problemas futuros, la capacitación para adaptarse a las nuevas tecnologías y la investigación.
              </p>
            </>
          )}

          <h3 className="about-subheading">
            {lang === 'en' ? 'Languages' : 'Idiomas'}
          </h3>
          <div className="about-languages">
            {languages.map(language => (
              <div key={language.name.en} className="about-language">
                <span className="about-language__flag" aria-hidden="true">{language.flag}</span>
                <span className="about-language__name">{language.name[lang]}</span>
                <span className="about-language__level">({language.level[lang]})</span>
              </div>
            ))}
          </div>

          <h3 className="about-subheading">
            {lang === 'en' ? 'Core Stack' : 'Stack Principal'}
          </h3>
          <div className="about-skills-container">
            {skills.map(category => (
              <React.Fragment key={category.name.en}>
                {category.skills.map((skill, idx) => (
                  <div key={skill} className={`skill-pill skill-pill-${(idx % 3) + 1}`}>
                    <Icon name={skill} size={16} className="skill-icon" />
                    <span>{skill}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="about-image">
          <div className="about-image__frame">
            <CrossfadeGallery
              images={portraits[lang]}
              interval={7_000}
              className="about-portrait-gallery"
              showControls
              label={lang === 'en' ? 'Choose Diego portrait' : 'Elegir retrato de Diego'}
              effects={CALM_TRANSITION_EFFECTS}
            />
            <div className="about-image__tint" aria-hidden="true" />
          </div>
        </div>

      </div>

      <EducationCard />

    </motion.section>
  );
};
