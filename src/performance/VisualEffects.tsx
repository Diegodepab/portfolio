import { useEffect, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { startEffectsPolicy } from './effectsStore';
import { useVisualEffects } from './useVisualEffects';
import './visualEffects.css';

export function VisualEffectsProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useVisualEffects();
  useEffect(startEffectsPolicy, []);
  return <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>{children}</MotionConfig>;
}
