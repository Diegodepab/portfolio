import { lazy } from 'react';

let modulePromise: ReturnType<typeof importPixelTransition> | null = null;

const importPixelTransition = () => import('./PixelTransitionLayer');

export const loadPixelTransition = () => {
  modulePromise ??= importPixelTransition();
  return modulePromise;
};

export const LazyPixelTransitionLayer = lazy(loadPixelTransition);

