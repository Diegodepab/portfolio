import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { JobExperience } from '../../types/portfolio';
import { ImageTransitionStage } from '../ui/image-transitions/ImageTransitionStage';
import {
  CSS_TRANSITION_EFFECTS,
  DEFAULT_TRANSITION_EFFECTS,
  type ImageTransitionEffect,
} from '../ui/image-transitions/effects';
import './ExperienceGallery.css';

interface ExperienceGalleryProps {
  photos: NonNullable<JobExperience['photos']>;
}

type ExperiencePhoto = NonNullable<JobExperience['photos']>[number];

const getExperienceEffects = (
  from: ExperiencePhoto,
  to: ExperiencePhoto,
): readonly ImageTransitionEffect[] =>
  from.kind === 'logo' || to.kind === 'logo'
    ? CSS_TRANSITION_EFFECTS
    : DEFAULT_TRANSITION_EFFECTS;

export const ExperienceGallery = ({ photos }: ExperienceGalleryProps) => {
  const { lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const displayedPhoto = photos[displayedIndex];

  if (!photos.length || !displayedPhoto) return null;

  return (
    <figure className="experience-gallery">
      <div className="experience-gallery__main">
        <ImageTransitionStage
          items={photos}
          activeIndex={activeIndex}
          getSource={(photo) => photo}
          getEffects={getExperienceEffects}
          onSettledIndexChange={setDisplayedIndex}
          renderItem={(photo, _index, selected) => (
            <div className={`experience-gallery__media${photo.kind === 'logo' ? ' experience-gallery__media--logo' : ''}`}>
              {photo.kind === 'logo' && photo.brandText ? (
                <div className="experience-gallery__brand">
                  <img
                    src={selected ?? photo.src}
                    srcSet={selected ? undefined : photo.srcSet}
                    sizes={photo.kind === 'logo' ? '240px' : photo.sizes}
                    decoding="async"
                    alt={photo.alt[lang]}
                    loading="lazy"
                    width={photo.width ?? 640}
                    height={photo.height ?? 360}
                  />
                  <div className="experience-gallery__brand-text">
                    <span>{photo.brandText}</span>
                    {photo.brandSubtext && <small>{photo.brandSubtext}</small>}
                  </div>
                </div>
              ) : (
                <img
                  src={selected ?? photo.src}
                    srcSet={selected ? undefined : photo.srcSet}
                    sizes={photo.kind === 'logo' ? '240px' : photo.sizes}
                    decoding="async"
                  alt={photo.alt[lang]}
                  loading="lazy"
                  width={photo.width ?? 640}
                  height={photo.height ?? 360}
                />
              )}
            </div>
          )}
        />
        <span className="experience-gallery__count" aria-hidden="true">0{displayedIndex + 1} / 0{photos.length}</span>
      </div>

      <div className="experience-gallery__footer">
        <figcaption>{displayedPhoto.caption?.[lang]}</figcaption>
        <div className="experience-gallery__thumbnails" role="group" aria-label={lang === 'en' ? 'Team photos' : 'Fotos del equipo'}>
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`${activeIndex === index ? 'is-active' : ''}${photo.kind === 'logo' ? ' is-logo' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${lang === 'en' ? 'Show photo' : 'Mostrar foto'} ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <img src={photo.thumbnail?.src ?? photo.src} srcSet={photo.thumbnail?.srcSet}
                sizes="50px" alt="" loading="lazy" decoding="async" width={50} height={31} />
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
};
