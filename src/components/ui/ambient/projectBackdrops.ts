export const PROJECT_BACKDROP_VARIANTS = [
  'ants',
  'technical',
  'routes',
  'signals',
  'orbits',
  'contours',
] as const;

export type ProjectBackdropVariant = (typeof PROJECT_BACKDROP_VARIANTS)[number];

export const pickProjectBackdropVariant = (
  random: () => number = Math.random,
): ProjectBackdropVariant => {
  const value = Math.min(0.999999, Math.max(0, random()));
  return PROJECT_BACKDROP_VARIANTS[Math.floor(value * PROJECT_BACKDROP_VARIANTS.length)];
};
