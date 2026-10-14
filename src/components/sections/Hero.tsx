import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { TechnicalBackdrop } from './TechnicalBackdrop';
import { HeroCollage } from './HeroCollage';
import { MetalFx } from '../ui/metal-fx';
import './Hero.css';

export const Hero = () => {
  const { lang } = useLanguage();
  return <section className="hero" id="hero">
    <TechnicalBackdrop />
    <div className="hero-layout">
      <div className="hero-content">
        <p className="hero-eyebrow">{lang === 'es' ? 'Ingeniero Bioinformático · Software Engineer' : 'Bioinformatics Engineer · Software Engineer'}</p>
        <h1 className="hero-name">Diego De Pablo</h1>
        <h2 className="hero-statement">{lang === 'es' ? 'Siempre abierto a nuevos proyectos.' : 'Always open to new projects.'}</h2>
        <p className="hero-description">{lang === 'es' ? 'Desarrollo aplicaciones full-stack, ingeniería de datos e IA aplicada, con foco en rendimiento, contenedores y despliegue.' : 'I build full-stack applications, data engineering, and applied AI — focused on performance, containers, and deployment.'}</p>
        <div className="hero-cta">
          <MetalFx theme="dark" variant="button" preset="silver" strength={0.6} borderRadius={8} normalizeHostStyles={false}>
            <Button href="#projects" size="lg">{lang === 'es' ? 'Ver mis proyectos' : 'View my projects'} <span aria-hidden="true">↗</span></Button>
          </MetalFx>
        </div>
      </div>
      <div className="hero-visual"><HeroCollage /></div>
    </div>
  </section>;
};
