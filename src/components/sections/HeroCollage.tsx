import { useLanguage } from '../../context/LanguageContext';
import { CrossfadeGallery, type GalleryImage } from '../ui/CrossfadeGallery';

const landscapes: Record<'es' | 'en', GalleryImage[]> = {
  es: [
    { src: '/images/landscapes/atardecer.webp', alt: 'Camino al atardecer entre árboles' },
    { src: '/images/landscapes/mar.webp', alt: 'Costa rocosa junto al mar' },
    { src: '/images/landscapes/muelle.webp', alt: 'Muelle frente al mar al atardecer' },
    { src: '/images/landscapes/naturaleza.webp', alt: 'Arroyo rodeado de vegetación' },
  ],
  en: [
    { src: '/images/landscapes/atardecer.webp', alt: 'Path at sunset between trees' },
    { src: '/images/landscapes/mar.webp', alt: 'Rocky coastline by the sea' },
    { src: '/images/landscapes/muelle.webp', alt: 'Pier facing the sea at sunset' },
    { src: '/images/landscapes/naturaleza.webp', alt: 'Stream surrounded by vegetation' },
  ],
};

export const HeroCollage = () => {
  const { lang } = useLanguage();

  return (
    <div className="hero-collage" aria-label={lang === 'en' ? 'Personal photo collage' : 'Collage de fotografías personales'}>
      <div className="hero-frame hero-frame--landscape">
        <CrossfadeGallery
          images={landscapes[lang]}
          interval={12_000}
          initialDelay={12_000}
          eagerFirst
        />
      </div>

      <div className="hero-frame hero-frame--portrait">
        <img
          src="/images/portraits/diego-formal.webp"
          alt={lang === 'en' ? 'Formal portrait of Diego De Pablo' : 'Retrato formal de Diego De Pablo'}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="hero-frame hero-frame--secondary-landscape">
        <CrossfadeGallery
          images={landscapes[lang]}
          interval={12_000}
          initialDelay={6_000}
          initialIndex={2}
        />
      </div>
    </div>
  );
};
