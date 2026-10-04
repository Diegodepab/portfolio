import { describe, expect, it } from 'vitest';
import { contrastRatio, ensureAccessibleAccent, pokePalettes, getDailyPalette, getTodayDateString } from '../src/utils/palettes';

describe('palette accessibility', () => {
  it('preserves colors that already pass WCAG AA', () => {
    expect(ensureAccessibleAccent('#ffffff')).toBe('#ffffff');
  });

  it('raises low-contrast colors to the configured threshold', () => {
    const adjusted = ensureAccessibleAccent('#202020');

    expect(adjusted).not.toBe('#202020');
    expect(contrastRatio(adjusted)).toBeGreaterThanOrEqual(4.5);
  });

  it('makes every selectable palette accent readable', () => {
    for (const palette of pokePalettes) {
      for (const color of Object.values(palette.colors).filter((value) => value.startsWith('#'))) {
        for (const background of ['#0a0f1c', '#191f2e', '#192033']) {
          expect(contrastRatio(ensureAccessibleAccent(color), background)).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
});

describe('daily pokemon palette', () => {
  it('returns a valid palette with non-empty colors and sprite', () => {
    const daily = getDailyPalette();
    expect(daily).toBeDefined();
    expect(daily.name).toBeTruthy();
    expect(daily.sprite).toMatch(/^\/pokemon\/.+\.png$/);
    expect(daily.colors.primary).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('is deterministic for the same date', () => {
    const d = new Date(2026, 9, 4);
    const palette1 = getDailyPalette(d);
    const palette2 = getDailyPalette(d);
    expect(palette1.name).toBe(palette2.name);
  });

  it('produces variety across consecutive days', () => {
    const base = new Date(2026, 9, 1);
    const names = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(base.getTime() + i * 86_400_000);
      names.add(getDailyPalette(d).name);
    }
    expect(names.size).toBeGreaterThanOrEqual(4);
  });

  it('formats date correctly in YYYY-MM-DD', () => {
    const d = new Date(2026, 0, 5); // Jan 5, 2026
    expect(getTodayDateString(d)).toBe('2026-01-05');
  });

  it('contains exactly 100 unique pokemon palettes', () => {
    expect(pokePalettes).toHaveLength(100);
    const names = new Set(pokePalettes.map(p => p.name));
    expect(names.size).toBe(100);
  });
});

