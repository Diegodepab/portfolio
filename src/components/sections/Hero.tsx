import React from 'react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { TechnicalBackdrop } from './TechnicalBackdrop';
import { HeroCollage } from './HeroCollage';
import { MetalFx } from '../ui/metal-fx';
import './Hero.css';

export const Hero: React.FC = () => {
  const { lang } = useLanguage();

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
      <MetalFx theme="dark" variant="button" preset="silver" strength={0.8} normalizeHostStyles={false}>
        <Button href="#projects" size="lg">
          {lang === 'en' ? 'See my work' : 'Ver mis proyectos'}
        </Button>
      </MetalFx>
    </div>
  );

  const items = [eyebrow, name, statement, description, cta];

  return (
    <section className="hero">
      <TechnicalBackdrop />
      <div className="hero-layout">
        <div className="hero-content">
          {items.map((item, i) => <div key={i}>{item}</div>)}
        </div>
        <div className="hero-visual"><HeroCollage /></div>
      </div>
    </section>
  );
};
