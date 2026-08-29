import { describe, expect, it } from 'vitest';
import {
  PROJECT_BACKDROP_VARIANTS,
  pickProjectBackdropVariant,
} from '../src/components/ui/ambient/projectBackdrops';

describe('project route backdrops', () => {
  it('keeps every available ambient variant in the random pool', () => {
    const selections = PROJECT_BACKDROP_VARIANTS.map((_, index) => (
      pickProjectBackdropVariant(() => (index + 0.5) / PROJECT_BACKDROP_VARIANTS.length)
    ));

    expect(selections).toEqual(PROJECT_BACKDROP_VARIANTS);
  });

  it('keeps boundary values inside the available variants', () => {
    expect(pickProjectBackdropVariant(() => -1)).toBe(PROJECT_BACKDROP_VARIANTS[0]);
    expect(pickProjectBackdropVariant(() => 1)).toBe(PROJECT_BACKDROP_VARIANTS.at(-1));
  });
});
