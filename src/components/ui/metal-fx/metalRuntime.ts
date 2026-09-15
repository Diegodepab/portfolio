import type { RefObject } from 'react';
import { scheduleVisualMeasurement, cancelVisualMeasurement } from '../../../performance/frameTasks';
import { reduceEffects } from '../../../performance/effectsStore';
import { createInstance, destroyInstance, registerGlowInstance, setGlowCallback, setInstanceVisible, setSharedPreset, unregisterGlowInstance, updateInstance } from './engine/renderer/loop';
import type { MetalFxInstance } from './engine/renderer/core';
import { injectGlow, updateGlow } from './engine/glow/glow';
import { addReflectionTarget, removeReflectionTarget } from './engine/reflection/paint';
import { scheduleReflectionPaint } from './engine/reflection/reflectionScheduler';
import type { MetalFxPreset } from './types';

export interface MetalRuntimeOptions {
  shape: 'pill' | 'circle'; preset: MetalFxPreset; theme: 'dark' | 'light';
  strength: number; paused: boolean; visible: boolean; borderRadius?: number;
  reflectionTargets?: readonly RefObject<HTMLElement | null>[]; disableGlow: boolean;
  shaderScale?: number; ringCssPx?: number; scale: number;
}
export interface MetalRuntime { update(options: MetalRuntimeOptions): void; destroy(): void }
const glows = new Map<MetalFxInstance, { handles: ReturnType<typeof injectGlow>; theme: 'dark' | 'light' }>();
setGlowCallback((instance, now) => {
  const entry = glows.get(instance);
  if (entry) updateGlow(entry.handles, instance, now, instance.opacityMul, entry.theme);
});

export function mountMetal(root: HTMLElement, canvas: HTMLCanvasElement, glow: HTMLElement, content: HTMLElement,
  initialOptions: MetalRuntimeOptions, onReady: () => void): MetalRuntime {
  let options = initialOptions;
  let instance: MetalFxInstance | null = null;
  let destroyed = false;
  let reflections: HTMLElement[] = [];
  let previousGeometry = '';
  let glowDirty = true;
  const clearReflections = () => {
    reflections.forEach(removeReflectionTarget);
    reflections = [];
    if (instance) instance.onAfterFrame = undefined;
  };
  const syncReflections = () => {
    clearReflections();
    if (!instance || !options.visible || options.paused || options.theme !== 'dark') return;
    reflections = options.reflectionTargets?.flatMap((ref) => ref.current ? [ref.current] : []) ?? [];
    reflections.forEach((element) => addReflectionTarget(element, instance!, root));
    if (reflections.length) instance.onAfterFrame = scheduleReflectionPaint;
  };
  const measure = () => scheduleVisualMeasurement(root, () => {
    if (destroyed || !options.visible) return;
    // Layout dimensions must not include entrance transforms or CSS zoom.
    const cssWidth = root.offsetWidth;
    const cssHeight = root.offsetHeight;
    if (!cssWidth || !cssHeight) return;
    const child = content.firstElementChild ?? root;
    const radius = options.borderRadius ?? (parseFloat(getComputedStyle(child).borderTopLeftRadius) || 8);
    const cornerRadius = options.shape === 'circle' ? Math.min(cssWidth, cssHeight) / 2 : Math.min(radius, cssWidth / 2, cssHeight / 2);
    const geometry = `${cssWidth}:${cssHeight}:${cornerRadius}:${options.scale}:${options.shape}`;
    return () => {
      if (destroyed) return;
      try {
        if (!instance) {
          instance = createInstance({ hostCanvas: canvas, cssWidth, cssHeight, cornerRadius, kind: options.shape,
            paused: options.paused, scale: options.scale, shaderScale: options.shaderScale, ringCssPx: options.ringCssPx,
            opacityMul: Math.max(0, Math.min(1, options.strength)), onFirstCopy: onReady });
          if (!instance) { reduceEffects(); return; }
          setSharedPreset(options.preset, options.theme);
          syncReflections();
        } else {
          updateInstance(instance, { cssWidth, cssHeight, cornerRadius, kind: options.shape, scale: options.scale });
        }
        root.style.setProperty('--mfx-radius', `${cornerRadius}px`);
        if (geometry !== previousGeometry || glowDirty) {
          unregisterGlowInstance(instance);
          glows.delete(instance);
          glow.replaceChildren();
          if (!options.disableGlow) {
            const handles = injectGlow(glow, { width: cssWidth, height: cssHeight, cornerRadius, kind: options.shape, scale: options.scale });
            glows.set(instance, { handles, theme: options.theme });
            registerGlowInstance(instance);
          }
          glowDirty = false;
          previousGeometry = geometry;
        }
      } catch { reduceEffects(); }
    };
  });
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
  resize?.observe(root);
  window.addEventListener('resize', measure, { passive: true });
  measure();
  return {
    update(next) {
      const old = options;
      options = next;
      glowDirty ||= old.disableGlow !== next.disableGlow || old.theme !== next.theme;
      if (instance) {
        setInstanceVisible(instance, next.visible);
        updateInstance(instance, { paused: next.paused, opacityMul: Math.max(0, Math.min(1, next.strength)),
          ...(next.shaderScale !== undefined ? { shaderScale: next.shaderScale } : {}),
          ...(next.ringCssPx !== undefined ? { ringCssPx: next.ringCssPx } : {}) });
        if (old.preset !== next.preset || old.theme !== next.theme) setSharedPreset(next.preset, next.theme);
        if (old.reflectionTargets !== next.reflectionTargets || old.theme !== next.theme || old.visible !== next.visible || old.paused !== next.paused) syncReflections();
      }
      if (next.visible) measure();
    },
    destroy() {
      destroyed = true;
      cancelVisualMeasurement(root);
      resize?.disconnect();
      window.removeEventListener('resize', measure);
      clearReflections();
      if (instance) { glows.delete(instance); unregisterGlowInstance(instance); destroyInstance(instance); }
      instance = null;
      glow.replaceChildren();
      canvas.width = canvas.height = 1;
    },
  };
}
