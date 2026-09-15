import { imageAssets } from '../../data/imageAssets';
import { useLanguage } from '../../context/LanguageContext';
import { CrossfadeGallery, type GalleryImage } from '../ui/CrossfadeGallery';

const landscapeMedia = (name: string) => ({
  ...imageAssets[`/images/landscapes/${name}.webp`],
  sizes: '(max-width: 480px) 70vw, (max-width: 768px) 372px, (max-width: 1120px) 30vw, 390px',
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
          sizes="(max-width: 480px) 44vw, (max-width: 768px) 234px, 248px"
          alt={lang === 'en' ? 'Formal portrait of Diego De Pablo' : 'Retrato formal de Diego De Pablo'}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={446}
          height={594}
        />
      </div>

      <div className="hero-frame hero-frame--secondary-landscape">
        <CrossfadeGallery
          images={landscapes[lang].map((image) => ({
            ...image,
            sizes: '(max-width: 480px) 52vw, (max-width: 768px) 258px, 271px',
          }))}
          interval={12_000}
          initialDelay={6_000}
          initialIndex={2}
        />
      </div>
    </div>
  );
};
