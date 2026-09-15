import { describe, expect, it } from 'vitest';
import { contrastRatio, ensureAccessibleAccent, pokePalettes } from '../src/utils/palettes';

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
