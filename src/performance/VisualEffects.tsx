import { useEffect, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { startEffectsPolicy } from './effectsStore';
import { useVisualEffects } from './useVisualEffects';
import './visualEffects.css';

export function VisualEffectsProvider({ children }: { children: ReactNode }) {
  const { reducedMotion, userReduced } = useVisualEffects();
  useEffect(startEffectsPolicy, []);
  return <MotionConfig reducedMotion={reducedMotion || userReduced ? 'always' : 'user'}>{children}</MotionConfig>;
}
