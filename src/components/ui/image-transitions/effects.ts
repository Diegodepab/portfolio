export type ImageTransitionEffect =
  | 'fade'
  | 'pixels-mechanic'
  | 'pixels-organic';

export const DEFAULT_TRANSITION_EFFECTS: readonly ImageTransitionEffect[] = [
  'fade',
  'fade',
  'fade',
  'pixels-mechanic',
  'pixels-mechanic',
  'pixels-organic',
];

export const CALM_TRANSITION_EFFECTS: readonly ImageTransitionEffect[] = [
  'fade',
  'fade',
  'fade',
  'pixels-mechanic',
];

export const CSS_TRANSITION_EFFECTS: readonly ImageTransitionEffect[] = [
  'fade',
  'fade',
];

export const isPixelTransition = (
  effect: ImageTransitionEffect,
): effect is Extract<ImageTransitionEffect, 'pixels-mechanic' | 'pixels-organic'> =>
  effect === 'pixels-mechanic' || effect === 'pixels-organic';

export const shuffleEffects = (
  effects: readonly ImageTransitionEffect[],
  random: () => number = Math.random,
): ImageTransitionEffect[] => {
  const shuffled = [...effects];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

export const createEffectQueue = (
  effects: readonly ImageTransitionEffect[],
  previousEffect: ImageTransitionEffect | null,
  random: () => number = Math.random,
): ImageTransitionEffect[] => {
  const source = effects.length ? effects : CSS_TRANSITION_EFFECTS;
  const queue = shuffleEffects(source, random);

  if (queue.length > 1 && queue[0] === previousEffect) {
    const differentIndex = queue.findIndex((effect) => effect !== previousEffect);
    if (differentIndex > 0) {
      [queue[0], queue[differentIndex]] = [queue[differentIndex], queue[0]];
    }
  }

  return queue;
};

interface NavigatorWithPerformanceHints extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

let cachedPixelCapability: boolean | null = null;

export const canUsePixelTransitions = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (cachedPixelCapability !== null) return cachedPixelCapability;
  if (!('WebGLRenderingContext' in window)) return false;

  const hints = navigator as NavigatorWithPerformanceHints;
  if (hints.connection?.saveData) return (cachedPixelCapability = false);
  if (typeof hints.deviceMemory === 'number' && hints.deviceMemory < 4) {
    return (cachedPixelCapability = false);
  }
  if (typeof hints.hardwareConcurrency === 'number' && hints.hardwareConcurrency < 4) {
    return (cachedPixelCapability = false);
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return (cachedPixelCapability = false);

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    if (/swiftshader|software|llvmpipe/i.test(renderer)) {
      return (cachedPixelCapability = false);
    }
  } catch {
    return (cachedPixelCapability = false);
  }

  return (cachedPixelCapability = true);
};
