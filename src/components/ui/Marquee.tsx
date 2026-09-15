import React, { useRef } from 'react';
import { useEffectVisibility, useVisualEffects } from '../../performance/useVisualEffects';
import './Marquee.css';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Should the marquee animation pause on hover? */
  pauseOnHover?: boolean;
  /** Expand the marquee into a grid on hover */
  expandOnHover?: boolean;
  /** Direction of the animation. Default is 'left' */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Applies a gradient mask to fade the edges */
  fade?: boolean;
  /** Optional class for the inner repeating div */
  innerClassName?: string;
  /** Number of times to duplicate the children to ensure continuous scrolling */
  numberOfCopies?: number;
  /** Custom duration (e.g. '20s') */
  duration?: string;
  /** Custom gap (e.g. '1rem') */
  gap?: string;
}

/**
 * An infinitely scrolling marquee component optimized for performance.
 * Uses CSS keyframes to translate content continuously.
 */
export const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = 'left',
  pauseOnHover = false,
  expandOnHover = false,
  fade = false,
  className = '',
  innerClassName = '',
  numberOfCopies = 2,
  duration = '40s',
  gap = '1rem',
  style,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { active } = useEffectVisibility(ref);
  const { reducedMotion } = useVisualEffects();
  const isVertical = direction === 'up' || direction === 'down';
  const isReverse = direction === 'right' || direction === 'down';

  const gradientFade = isVertical
    ? 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, transparent 100%)'
    : 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, transparent 100%)';

  const maskStyle = fade ? {
    maskImage: gradientFade,
    WebkitMaskImage: gradientFade,
  } : {};

  return (
    <div
      ref={ref}
      data-animation-active={active}
      data-static={reducedMotion}
      className={`marquee-container ${isVertical ? 'marquee-col' : 'marquee-row'} ${expandOnHover ? 'marquee-expand-hover' : ''} ${className}`}
      style={{
        '--marquee-duration': duration,
        '--marquee-gap': gap,
        ...maskStyle,
        ...style,
      } as unknown as React.CSSProperties}
      {...rest}
    >
      {Array.from({ length: reducedMotion ? 1 : numberOfCopies }).map((_, i) => (
        <div
          key={i}
          className={`marquee-inner ${isVertical ? 'marquee-inner-col' : 'marquee-inner-row'} ${
            isVertical ? 'animate-marquee-vertical' : 'animate-marquee-horizontal'
          } ${pauseOnHover ? 'marquee-pause-hover' : ''} ${isReverse ? 'marquee-reverse' : ''} ${innerClassName}`}
        >
          {children}
        </div>
      ))}
    </div>
  );
};
