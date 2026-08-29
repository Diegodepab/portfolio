import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { TechnicalBackdrop } from './TechnicalBackdrop';
import { HeroCollage } from './HeroCollage';
import { MetalFx } from '../ui/metal-fx';
import './Hero.css';

export const Hero: React.FC = () => {
  const { lang } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const eyebrow = (
    <p className="hero-eyebrow">
      {lang === 'en' ? 'Hi, my name is' : 'Hola, me llamo'}
    </p>
  );

  const name = (
    <h1 className="hero-name">
      Diego De Pablo
    </h1>
  );

  const statement = (
    <h2 className="hero-statement">
      {lang === 'en' ? 'I am a Software Developer' : 'Soy desarrollador de software'}
    </h2>
  );

  const description = (
    <p className="hero-description">
      {lang === 'en'
        ? 'Full-stack engineer focused on use-case deployment and infrastructure — where the most interesting problems live.'
        : 'Ingeniero full-stack especializado en despliegue de casos de uso e infraestructura, donde se resuelven los problemas más interesantes.'
      }
    </p>
  );

  const cta = (
    <div className="hero-cta">
      <MetalFx variant="button" preset="silver" strength={0.8} normalizeHostStyles={false}>
        <Button href="#projects" size="lg">
          {lang === 'en' ? 'See my work' : 'Ver mis proyectos'}
        </Button>
      </MetalFx>
    </div>
  );

  const items = [eyebrow, name, statement, description, cta];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5, // wait for nav to finish
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="hero">
      <TechnicalBackdrop />
      <div className="hero-layout">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {items.map((item, i) => (
            <motion.div key={i} variants={itemVariants}>
              {item}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <HeroCollage />
        </motion.div>
      </div>
    </section>
  );
};
