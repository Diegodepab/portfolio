import { useRef, useState, type FC } from 'react';
import { useEffectVisibility } from '../../performance/useVisualEffects';
import { useMediaRotation } from '../../hooks/useMediaRotation';
import {
  ImageTransitionStage,
} from './image-transitions/ImageTransitionStage';
import type { ImageTransitionEffect } from './image-transitions/effects';
import './CrossfadeGallery.css';
import { useLanguage } from '../../context/LanguageContext';

export interface GalleryImage {
  src: string;
  alt: string;
  position?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

interface CrossfadeGalleryProps {
  images: GalleryImage[];
  interval: number;
  className?: string;
  showControls?: boolean;
  eagerFirst?: boolean;
  label?: string;
  initialIndex?: number;
  initialDelay?: number;
  effects?: readonly ImageTransitionEffect[];
}

export const CrossfadeGallery: FC<CrossfadeGalleryProps> = ({
  images,
  interval,
  className = '',
  showControls = false,
  eagerFirst = false,
  label = 'Image gallery',
  initialIndex = 0,
  initialDelay = interval,
  effects,
}) => {
  const { lang } = useLanguage();
  const [paused, setPaused] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { active } = useEffectVisibility(galleryRef);

  const { activeIndex, setActiveIndex } = useMediaRotation(
    images.length,
    interval,
    initialIndex,
    initialDelay,
    !active || paused,
  );

  return (
    <div ref={galleryRef} className={`crossfade-gallery ${className}`.trim()}>
      <div className="crossfade-gallery__viewport">
        <ImageTransitionStage
          items={images}
          activeIndex={activeIndex}
          getSource={(image) => image}
          effects={effects}
          renderItem={(image, index, selected) => (
            <img
              src={selected ?? image.src}
              srcSet={selected ? undefined : image.srcSet}
              sizes={image.sizes}
              width={image.width ?? 700}
              height={image.height ?? 933}
              alt={image.alt}
              className="crossfade-gallery__image"
              style={{ objectPosition: image.position }}
              loading={eagerFirst && index === initialIndex ? 'eager' : 'lazy'}
              decoding="async"
            />
          )}
        />
      </div>

      {showControls && (
        <div className="crossfade-gallery__controls" role="group" aria-label={label}>
          <button type="button" className="crossfade-gallery__pause" aria-pressed={paused} aria-label={lang === 'es' ? 'Pausar galería automática' : 'Pause automatic gallery'} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button>
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`crossfade-gallery__dot${activeIndex === index ? ' is-active' : ''}`}
              aria-label={`${label}: ${index + 1} / ${images.length}`}
              aria-pressed={activeIndex === index}
              onClick={() => { setPaused(true); setActiveIndex(index); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
