import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { getEffectsSnapshot, getServerEffectsSnapshot, registerActiveEffect, subscribeEffects } from './effectsStore';

export function useVisualEffects() {
  return useSyncExternalStore(subscribeEffects, getEffectsSnapshot, getServerEffectsSnapshot);
}

// One viewport observer for decorations, galleries and portal content alike.
const targets = new Map<Element, Set<(visible: boolean) => void>>();
let observer: IntersectionObserver | undefined;
export function observeEffectVisibility(element: Element, listener: (visible: boolean) => void) {
  if (typeof IntersectionObserver === 'undefined') { listener(true); return () => {}; }
  observer ??= new IntersectionObserver((entries) => {
    entries.forEach((entry) => targets.get(entry.target)?.forEach((notify) => notify(entry.isIntersecting)));
  });
  let callbacks = targets.get(element);
  if (!callbacks) { callbacks = new Set(); targets.set(element, callbacks); observer.observe(element); }
  callbacks.add(listener);
  return () => {
    callbacks.delete(listener);
    if (!callbacks.size) { observer?.unobserve(element); targets.delete(element); }
    if (!targets.size) { observer?.disconnect(); observer = undefined; }
  };
}

export function useEffectVisibility(ref: RefObject<Element | null>) {
  const [intersects, setIntersects] = useState(true);
  const { quality, pageVisible } = useVisualEffects();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeEffectVisibility(element, setIntersects);
  }, [ref]);
  const visible = intersects && pageVisible;
  const active = visible && quality === 'full';
  useEffect(() => active ? registerActiveEffect() : undefined, [active]);
  return { visible, active };
}
