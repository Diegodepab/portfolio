import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react';
import { useEffectVisibility, useVisualEffects } from '../../../performance/useVisualEffects';
import { reduceEffects } from '../../../performance/effectsStore';
import type { MetalRuntime, MetalRuntimeOptions } from './metalRuntime';
import type { MetalFxProps, MetalFxTheme } from './types';
import './MetalFx.css';

function useResolvedTheme(theme: MetalFxTheme): 'dark' | 'light' {
  const [system, setSystem] = useState<'dark' | 'light'>(() =>
    typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  useEffect(() => {
    if (theme !== 'auto') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystem(query.matches ? 'dark' : 'light');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [theme]);
  return theme === 'auto' ? system : theme;
}

/** A complete CSS button first; GPU rendering is an optional enhancement. */
export const MetalFx = forwardRef<HTMLDivElement, MetalFxProps>(function MetalFx({
  children, variant = 'button', preset = 'chromatic', theme = 'auto', strength = 1,
  paused = false, borderRadius, normalizeHostStyles = true, reflectionTargets,
  disableGlow = false, shaderScale, ringCssPx, scale = 1, className, style, ...rest
}, forwardedRef) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const runtime = useRef<MetalRuntime | null>(null);
  const { quality } = useVisualEffects();
  const { visible } = useEffectVisibility(rootRef);
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const resolvedTheme = useResolvedTheme(theme);
  const options: MetalRuntimeOptions = {
    shape: variant === 'circle' ? 'circle' : 'pill', preset, theme: resolvedTheme,
    strength, paused, borderRadius, reflectionTargets, disableGlow, shaderScale, ringCssPx, scale, visible,
  };
  const latest = useRef(options);
  latest.current = options;
  useImperativeHandle(forwardedRef, () => rootRef.current!, []);
  useEffect(() => { if (visible) setEntered(true); }, [visible]);

  const enabled = quality === 'full' && entered;
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setReady(false);
    void import('./metalRuntime').then(({ mountMetal }) => {
      if (cancelled || !rootRef.current || !canvasRef.current || !glowRef.current || !contentRef.current) return;
      runtime.current = mountMetal(rootRef.current, canvasRef.current, glowRef.current, contentRef.current,
        latest.current, () => { if (!cancelled) setReady(true); });
    }).catch(() => { if (!cancelled) reduceEffects(); });
    return () => {
      cancelled = true;
      runtime.current?.destroy();
      runtime.current = null;
      setReady(false);
    };
  }, [enabled]);

  useEffect(() => { runtime.current?.update(latest.current); }, [variant, preset, resolvedTheme, strength, paused,
    borderRadius, reflectionTargets, disableGlow, shaderScale, ringCssPx, scale, visible]);

  const wrapperStyle: CSSProperties = {
    borderRadius: borderRadius ?? (variant === 'circle' ? '50%' : 'var(--border-radius, 8px)'),
    ...style,
    ['--mfx-strength' as string]: Math.min(1, Math.max(0, strength)),
  };
  return (
    <div {...rest} ref={rootRef} className={`metal-fx-root${className ? ` ${className}` : ''}`}
      data-variant={variant} data-shape={options.shape} data-theme={resolvedTheme} data-preset={preset}
      data-render-state={enabled ? (ready ? 'ready' : 'preparing') : 'fallback'}
      data-paused={paused || !visible ? 'true' : undefined}
      data-normalize={normalizeHostStyles ? 'true' : 'false'} style={wrapperStyle}>
      {enabled && <canvas ref={canvasRef} className="metal-fx-canvas" aria-hidden="true" />}
      <div className="metal-fx-inner" aria-hidden="true" />
      <div ref={glowRef} className="metal-fx-glow-host" aria-hidden="true" />
      <div ref={contentRef} className="metal-fx-content">{children}</div>
    </div>
  );
});
MetalFx.displayName = 'MetalFx';
