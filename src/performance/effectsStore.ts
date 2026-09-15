import { FrameBudget, hasLimitedResources, type EffectsQuality, type EffectsReason, type PerformanceHints } from './policy';

interface EffectsSnapshot {
  quality: EffectsQuality;
  reason: EffectsReason;
  reducedMotion: boolean;
  pageVisible: boolean;
  userReduced: boolean;
}
const initial: EffectsSnapshot = { quality: 'reduced', reason: 'preparing', reducedMotion: false, pageVisible: true, userReduced: false };
let snapshot = initial;
let locked = false;
let activated = false;
const listeners = new Set<() => void>();
let activeEffects = 0;
let frame = 0;
const budget = new FrameBudget();

export const getEffectsSnapshot = () => snapshot;
export const getServerEffectsSnapshot = () => initial;
export function subscribeEffects(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publish(patch: Partial<EffectsSnapshot>) {
  const next = { ...snapshot, ...patch };
  if (Object.keys(next).every((key) => next[key as keyof EffectsSnapshot] === snapshot[key as keyof EffectsSnapshot])) return;
  snapshot = next;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.effects = snapshot.quality;
    document.documentElement.dataset.effectsReason = snapshot.reason;
    document.documentElement.dataset.pageVisible = String(snapshot.pageVisible);
  }
  listeners.forEach((listener) => listener());
  syncMonitor();
}

function syncMonitor() {
  const running = activeEffects > 0 && snapshot.quality === 'full' && snapshot.pageVisible;
  if (!running) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    budget.reset();
  } else if (!frame) {
    frame = requestAnimationFrame(tick);
  }
}
function tick(now: number) {
  frame = 0;
  if (budget.sample(now)) {
    reduceEffects('slow-frames');
    return;
  }
  syncMonitor();
}
export function registerActiveEffect() {
  activeEffects++;
  syncMonitor();
  return () => { activeEffects = Math.max(0, activeEffects - 1); syncMonitor(); };
}

/** Fail closed for this document's lifetime, including subsequent route mounts. */
export function reduceEffects(reason: EffectsReason = 'graphics-failure') {
  locked = true;
  publish({ quality: 'reduced', reason });
}

export function setUserReducedEffects(reduced: boolean) {
  try { localStorage.setItem('portfolio-reduced-effects', String(reduced)); } catch { /* Optional persistence. */ }
  publish({ userReduced: reduced });
  if (reduced) publish({ quality: 'reduced', reason: 'user' });
  else if (!locked) {
    activated = false;
    window.dispatchEvent(new Event('portfolio-effects-change'));
  }
}

function supportsGraphics(): boolean {
  let gl: WebGLRenderingContext | null = null;
  try {
    const canvas = document.createElement('canvas');
    gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    return Boolean(gl);
  } catch {
    return false;
  } finally {
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

export function startEffectsPolicy() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
  let disposed = false;

  const checkCapability = () => {
    if (disposed || locked || activated) return;
    if (snapshot.userReduced) {
      publish({ quality: 'reduced', reason: 'user' });
    } else if (motion.matches) {
      reduceEffects('preference');
    } else if (hasLimitedResources(navigator as Navigator & PerformanceHints)) {
      reduceEffects('limited-device');
    } else if (!supportsGraphics()) {
      reduceEffects('graphics-unavailable');
    } else {
      activated = true;
      publish({ quality: 'full', reason: 'ready' });
    }
  };

  const update = () => {
    publish({ reducedMotion: motion.matches, pageVisible: !document.hidden });
    if (motion.matches) {
      reduceEffects('preference');
    } else if (hasLimitedResources(navigator as Navigator & PerformanceHints)) {
      reduceEffects('limited-device');
    }
    if (document.hidden || locked || activated) return;
    checkCapability();
  };

  motion.addEventListener('change', update);
  window.addEventListener('portfolio-effects-change', update);
  connection?.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  try { publish({ userReduced: localStorage.getItem('portfolio-reduced-effects') === 'true' }); } catch { /* Optional persistence. */ }
  // Content and controls render before optional graphics initialize.
  const admissionTimer = window.setTimeout(update, 250);

  return () => {
    disposed = true;
    window.clearTimeout(admissionTimer);
    window.removeEventListener('portfolio-effects-change', update);
    motion.removeEventListener('change', update);
    connection?.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    budget.reset();
  };
}
