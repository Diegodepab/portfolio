import './ProjectRouteBackdrop.css';
import { useState } from 'react';
import { TechnicalBackdrop } from '../../sections/TechnicalBackdrop';
import { AntsCursor } from '../AntsCursor';
import { CareerBackdrop } from './CareerBackdrop';
import { ContourBackdrop } from './ContourBackdrop';
import { OrbitBackdrop } from './OrbitBackdrop';
import { SignalDustBackdrop } from './SignalDustBackdrop';
import { pickProjectBackdropVariant, type ProjectBackdropVariant } from './projectBackdrops';

interface ProjectRouteBackdropProps {
  variant?: ProjectBackdropVariant | 'random';
}

export const ProjectRouteBackdrop = ({ variant = 'random' }: ProjectRouteBackdropProps) => {
  const [selectedVariant] = useState<ProjectBackdropVariant>(() => (
    variant === 'random' ? pickProjectBackdropVariant() : variant
  ));

  const backdrop = (() => {
    switch (selectedVariant) {
      case 'ants':
        return (
          <AntsCursor
            color="var(--color-accent-1)"
            numberOfAnts={56}
            speed={0.78}
            sizeMultiplier={0.48}
            opacity={0.22}
          />
        );
      case 'technical':
        return <TechnicalBackdrop />;
      case 'routes':
        return <CareerBackdrop />;
      case 'signals':
        return <SignalDustBackdrop />;
      case 'orbits':
        return <OrbitBackdrop />;
      case 'contours':
        return <ContourBackdrop />;
    }
  })();

  return (
    <div
      className={`project-route-backdrop project-route-backdrop--${selectedVariant}`}
      data-backdrop-variant={selectedVariant}
      aria-hidden="true"
    >
      {backdrop}
    </div>
  );
};
