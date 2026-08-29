import { describe, expect, it } from 'vitest';
import { findNearbyPointIndexes } from '../src/components/ui/ambient/useAmbientPointer';

describe('ambient pointer proximity', () => {
  const points = [
    { x: 10, y: 10 },
    { x: 22, y: 16 },
    { x: 80, y: 80 },
  ];

  it('returns nearby points ordered from closest to furthest', () => {
    expect(findNearbyPointIndexes(points, 16, 13, 30, 2)).toEqual([0, 1]);
  });

  it('does not activate points outside the configured radius', () => {
    expect(findNearbyPointIndexes(points, 45, 45, 12, 3)).toEqual([]);
  });

  it('honours the maximum number of reactive decorations', () => {
    expect(findNearbyPointIndexes(points, 16, 13, 100, 1)).toHaveLength(1);
  });
});

