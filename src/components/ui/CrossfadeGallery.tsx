import { useEffect, useRef, useState, type FC } from 'react';
import { useMediaRotation } from '../../hooks/useMediaRotation';
import {
  ImageTransitionStage,
} from './image-transitions/ImageTransitionStage';
import type { ImageTransitionEffect } from './image-transitions/effects';
import './CrossfadeGallery.css';

export interface GalleryImage {
  src: string;
  alt: string;
  position?: string;
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
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? true),
      { rootMargin: '120px' },
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  const { activeIndex, setActiveIndex } = useMediaRotation(
    images.length,
    interval,
    initialIndex,
    initialDelay,
    !isVisible,
  );

  return (
    <div ref={galleryRef} className={`crossfade-gallery ${className}`.trim()}>
      <div className="crossfade-gallery__viewport">
        <ImageTransitionStage
          items={images}
          activeIndex={activeIndex}
          getSource={(image) => image.src}
          effects={effects}
          renderItem={(image, index) => (
            <img
              src={image.src}
              alt={image.alt}
              className="crossfade-gallery__image"
              style={{ objectPosition: image.position }}
              loading={eagerFirst && index === initialIndex ? 'eager' : 'lazy'}
              fetchPriority={eagerFirst && index === initialIndex ? 'high' : 'auto'}
            />
          )}
        />
      </div>

      {showControls && (
        <div className="crossfade-gallery__controls" role="group" aria-label={label}>
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`crossfade-gallery__dot${activeIndex === index ? ' is-active' : ''}`}
              aria-label={`${label}: ${index + 1} / ${images.length}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
