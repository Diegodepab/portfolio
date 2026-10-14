import { imageAssets } from '../../data/imageAssets';
import { useLanguage } from '../../context/LanguageContext';
import { CrossfadeGallery, type GalleryImage } from '../ui/CrossfadeGallery';

const landscapeMedia = (name: string) => ({
  ...imageAssets[`/images/landscapes/${name}.webp`],
  sizes: '(max-width: 480px) 220px, (max-width: 768px) 285px, 350px',
});

const landscapeWideMedia = (name: string) => ({
  ...imageAssets[`/images/landscapes/${name}-wide.webp`],
  sizes: '(max-width: 480px) 175px, (max-width: 768px) 225px, 270px',
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

const landscapesWide: Record<'es' | 'en', GalleryImage[]> = {
  es: [
    { ...landscapeWideMedia('atardecer'), alt: 'Camino al atardecer entre árboles' },
    { ...landscapeWideMedia('mar'), alt: 'Costa rocosa junto al mar' },
    { ...landscapeWideMedia('muelle'), alt: 'Muelle frente al mar al atardecer' },
    { ...landscapeWideMedia('naturaleza'), alt: 'Arroyo rodeado de vegetación' },
  ],
  en: [
    { ...landscapeWideMedia('atardecer'), alt: 'Path at sunset between trees' },
    { ...landscapeWideMedia('mar'), alt: 'Rocky coastline by the sea' },
    { ...landscapeWideMedia('muelle'), alt: 'Pier facing the sea at sunset' },
    { ...landscapeWideMedia('naturaleza'), alt: 'Stream surrounded by vegetation' },
  ],
};

export const HeroCollage = () => {
  const { lang } = useLanguage();
  const portrait = imageAssets['/images/portraits/diego-formal.webp'];

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
          src={portrait.src}
          srcSet={portrait.srcSet}
          sizes="(max-width: 480px) 170px, (max-width: 768px) 220px, 250px"
          alt={lang === 'en' ? 'Formal portrait of Diego De Pablo' : 'Retrato formal de Diego De Pablo'}
          loading="eager"
          decoding="async"
          width={446}
          height={594}
        />
      </div>

      <div className="hero-frame hero-frame--secondary-landscape">
        <CrossfadeGallery
          images={landscapesWide[lang]}
          interval={12_000}
          initialDelay={6_000}
          initialIndex={2}
        />
      </div>
    </div>
  );
};
