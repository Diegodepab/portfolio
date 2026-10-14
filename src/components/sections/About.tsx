import { imageAssets } from '../../data/imageAssets';
import React from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from '../ui/SectionHeading';
import { skills } from '../../data/skills';
import { languages } from '../../data/education';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../icons/Icon';
import { EducationCard } from './EducationCard';
import { AntsCursor } from '../ui/AntsCursor';
import './About.css';

const portraitAsset = imageAssets['/images/portraits/diego-carnet.webp'];

export const About: React.FC = () => {
  const { lang } = useLanguage();
  return (
    <motion.section
      id="about"
      initial={false}
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
                I'm an engineer driven by learning as much as possible; I value what I can learn far more than the degree itself. Currently pursuing the{' '}
                <a href="https://www.uma.es/etsi-informatica/info/152999/master-universitario-en-ingenieria-informaticaplan-2025/" target="_blank" rel="noopener noreferrer">
                  Master's in Computer Engineering
                </a>{' '}
                with the goal of pursuing a PhD in the future.
              </p>
              <p className="about-paragraph">
                Before this, I graduated in{' '}
                <a href="https://www.uma.es/grado-en-ingenieria-de-la-salud/" target="_blank" rel="noopener noreferrer">
                  Health Engineering (Bioinformatics)
                </a>
                . A multidisciplinary degree focused on solving future challenges, adapting to emerging technologies, and research.
              </p>
            </>
          ) : (
            <>
              <p className="about-paragraph">
                Soy un ingeniero que busca aprender lo máximo posible; le doy mucha más importancia a todo lo que puedo aprender que al título en sí. Actualmente cursando el{' '}
                <a href="https://www.uma.es/etsi-informatica/info/152999/master-universitario-en-ingenieria-informaticaplan-2025/" target="_blank" rel="noopener noreferrer">
                  Máster Universitario en Ingeniería Informática
                </a>{' '}
                y en un futuro con intención de realizar un doctorado.
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
            <img
              src={portraitAsset.src}
              srcSet={portraitAsset.srcSet}
              sizes="(max-width: 768px) 300px, 360px"
              width={portraitAsset.width}
              height={portraitAsset.height}
              alt={lang === 'en' ? 'Diego De Pablo in formal suit with glasses' : 'Diego De Pablo con traje formal y gafas'}
              className="about-image__img"
              loading="lazy"
              decoding="async"
            />
            <div className="about-image__tint" aria-hidden="true" />
          </div>
        </div>

      </div>

      <EducationCard />

    </motion.section>
  );
};
