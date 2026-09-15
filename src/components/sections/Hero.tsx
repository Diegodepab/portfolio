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
        <p className="hero-eyebrow">{lang === 'es' ? 'Software · Infraestructura · IA' : 'Software · Infrastructure · AI'}</p>
        <h1 className="hero-name">Diego De Pablo</h1>
        <h2 className="hero-statement">{lang === 'es' ? 'De la idea al software que la hace posible.' : 'From an idea to the software that makes it work.'}</h2>
        <p className="hero-description">{lang === 'es' ? 'Desarrollo aplicaciones full-stack, espacios de datos e IA aplicada, con la infraestructura para llevarlos a producción.' : 'I build full-stack applications, data spaces and applied AI, with the infrastructure to bring them to production.'}</p>
        <div className="hero-cta">
          <MetalFx theme="dark" variant="button" preset="silver" strength={0.6} normalizeHostStyles={false}>
            <Button href="#projects" size="lg">{lang === 'es' ? 'Ver mis proyectos' : 'See my work'} <span aria-hidden="true">↗</span></Button>
          </MetalFx>
        </div>
      </div>
      <div className="hero-visual"><HeroCollage /></div>
    </div>
  </section>;
};
