import { useLanguage } from '../../context/LanguageContext';
import { CrossfadeGallery, type GalleryImage } from '../ui/CrossfadeGallery';

const landscapeMedia = (name: string) => ({
  src: `/images/landscapes/${name}.webp`,
  srcSet: `/images/landscapes/${name}-mob.webp 400w, /images/landscapes/${name}.webp 700w`,
  sizes: '(max-width: 600px) 300px, 450px',
  width: 700,
  height: 933,
});

const landscapes: Record<'es' | 'en', GalleryImage[]> = {
  es: [
    { ...landscapeMedia('atardecer'), alt: 'Camino al atardecer entre árboles' },
    { ...landscapeMedia('mar'), alt: 'Costa rocosa junto al mar' },
    { ...landscapeMedia('muelle'), alt: 'Muelle frente al mar al atardecer' },
    { ...landscapeMedia('naturaleza'), alt: 'Arroyo rodeado de vegetación' },
  ],
  en: [
    { ...landscapeMedia('atardecer'), alt: 'Path at sunset between trees' },
    { ...landscapeMedia('mar'), alt: 'Rocky coastline by the sea' },
    { ...landscapeMedia('muelle'), alt: 'Pier facing the sea at sunset' },
    { ...landscapeMedia('naturaleza'), alt: 'Stream surrounded by vegetation' },
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
          width={450}
          height={594}
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
