import { useEffect, useMemo, useRef } from 'react';
import {
  ImageGeneration,
  PRESETS,
  setFrameRate,
  setMaxDpr,
  type ImageGenerationCycleEvent,
  type ImageGenerationHandle,
  type ImageGenerationPreset,
} from 'img-fx';
import type { ImageTransitionEffect } from './effects';

interface PixelTransitionLayerProps {
  effect: Extract<ImageTransitionEffect, 'pixels-mechanic' | 'pixels-organic'>;
  src: string;
  onComplete: () => void;
}

let engineConfigured = false;

const configureEngine = (): void => {
  if (engineConfigured) return;
  engineConfigured = true;

  setFrameRate(15);
  setMaxDpr(1.25);

  for (const presetName of ['pixels-mechanic', 'pixels-organic'] as const) {
    for (const theme of ['dark', 'light'] as const) {
      const reveal = PRESETS[presetName].modes[theme].revealConfig;
      const revealWithDots = reveal as typeof reveal & { dotDuration?: number };
      reveal.duration = presetName === 'pixels-mechanic' ? 0.9 : 1.05;
      reveal.pixDuration = presetName === 'pixels-mechanic' ? 0.82 : 0.96;
      revealWithDots.dotDuration = presetName === 'pixels-mechanic' ? 0.72 : 0.86;
    }
  }
};

const readThemeColors = (): { colors: (string | null)[]; cardBg: string } => {
  if (typeof document === 'undefined') {
    return { colors: ['#64ffda', null, '#a8ffe9'], cardBg: '#0a101d' };
  }

  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue('--color-accent-1').trim() || '#64ffda';
  const secondary = styles.getPropertyValue('--color-accent-3').trim() || '#a8ffe9';
  const cardBg = styles.getPropertyValue('--color-bg-primary').trim() || '#0a101d';

  return {
    colors: [primary, null, secondary, null, null, primary, secondary],
    cardBg,
  };
};

configureEngine();

export const PixelTransitionLayer = ({ effect, src, onComplete }: PixelTransitionLayerProps) => {
  const generationRef = useRef<ImageGenerationHandle>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const palette = useMemo(readThemeColors, []);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    completedRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      generationRef.current?.triggerReveal({ hold: 'manual' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [src]);

  const handleCycle = (event: ImageGenerationCycleEvent): void => {
    if (event.phase !== 'visible' || completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  return (
    <ImageGeneration
      ref={generationRef}
      className="image-transition-stage__pixel-layer"
      preset={effect as ImageGenerationPreset}
      theme="dark"
      strength={effect === 'pixels-mechanic' ? 0.34 : 0.28}
      pixelScale={effect === 'pixels-mechanic' ? 0.82 : 0.72}
      cardBg={palette.cardBg}
      colors={palette.colors}
      images={src}
      paused={false}
      onCycle={handleCycle}
      style={{ background: 'transparent' }}
    >
      <div className="image-transition-stage__pixel-host" />
    </ImageGeneration>
  );
};

export default PixelTransitionLayer;
