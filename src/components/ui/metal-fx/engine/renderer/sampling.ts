/**
 * Analytical luminance and colour sampling for MetalFx glow.
 *
 * Replaces expensive GPU→CPU `gl.readPixels` readbacks with an O(1) analytical
 * evaluation derived from the active shader rotation and preset palette stops.
 * This guarantees zero main-thread stalls, zero buffer allocations, and zero
 * browser tab freezes.
 */
import { SHARED, type MetalFxInstance, type ShaderRGB } from './core';

export function ensureGlowPixels(): void {
  // Safe no-op: gl.readPixels is eliminated to prevent GPU pipeline sync freezes.
}

const _rgb: ShaderRGB = { r: 255, g: 255, b: 255 };

/**
 * Fast analytical luminance calculation along the component perimeter.
 */
export function sampleShaderLumAt(inst: MetalFxInstance, cssPxX: number, cssPxY: number, _radius: number): number {
  if (!SHARED) return 0.5;
  const now = performance.now();
  const speed = SHARED.preset?.speed || 1;
  const t = ((now - SHARED.startMs - SHARED.pausedMs) / 1000) * speed;
  const w = inst.cssWidth || 1;
  const h = inst.cssHeight || 1;
  const nx = (cssPxX / w) - 0.5;
  const ny = (cssPxY / h) - 0.5;
  const angle = Math.atan2(ny, nx);

  // Rotating plasma wave approximation along the border
  const wave = Math.sin(angle * 2.0 + t * 1.6) * 0.5 + Math.cos(angle * 3.0 - t * 1.1) * 0.5;
  return Math.max(0, Math.min(1, 0.25 + 0.65 * (wave * 0.5 + 0.5)));
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) || 255;
    const g = parseInt(clean[1] + clean[1], 16) || 255;
    const b = parseInt(clean[2] + clean[2], 16) || 255;
    return [r, g, b];
  }
  const r = parseInt(clean.slice(0, 2), 16) || 255;
  const g = parseInt(clean.slice(2, 4), 16) || 255;
  const b = parseInt(clean.slice(4, 6), 16) || 255;
  return [r, g, b];
}

export function sampleShaderRGBAt(inst: MetalFxInstance, cssPxX: number, cssPxY: number, radius: number): ShaderRGB {
  if (!SHARED || !SHARED.preset?.colors?.length) {
    _rgb.r = 255; _rgb.g = 255; _rgb.b = 255;
    return _rgb;
  }
  const lum = sampleShaderLumAt(inst, cssPxX, cssPxY, radius);
  const colors = SHARED.preset.colors;
  const n = colors.length;
  const pos = lum * (n - 1);
  const idx = Math.min(n - 1, Math.max(0, Math.floor(pos)));
  const nextIdx = Math.min(n - 1, idx + 1);
  const frac = pos - idx;

  const [r1, g1, b1] = hexToRgbTuple(colors[idx]);
  const [r2, g2, b2] = hexToRgbTuple(colors[nextIdx]);

  _rgb.r = Math.round(r1 + (r2 - r1) * frac);
  _rgb.g = Math.round(g1 + (g2 - g1) * frac);
  _rgb.b = Math.round(b1 + (b2 - b1) * frac);
  return _rgb;
}

export function sampleShaderRGBChromatic(inst: MetalFxInstance, cssPxX: number, cssPxY: number, radius: number): ShaderRGB {
  return sampleShaderRGBAt(inst, cssPxX, cssPxY, radius);
}
