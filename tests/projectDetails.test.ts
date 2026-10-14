import { describe, it, expect } from 'vitest';
import { featuredProjects } from '../src/data/projects';
import { imageAssets } from '../src/data/imageAssets';

describe('Project detail data integrity', () => {
  it('validates tfg-patient-monitoring rich configuration', () => {
    const tfg = featuredProjects.find(p => p.id === 'tfg-patient-monitoring');
    expect(tfg?.awardBadge?.es).toContain('Hardware biomédico');
    expect(tfg?.stats?.some(s => s.subtext?.es.includes('Matrícula de Honor'))).toBe(true);
    expect(tfg?.stats?.length).toBeGreaterThanOrEqual(4);
    expect(tfg?.architectureType).toBe('iot-telemetry');
    expect(tfg?.sections?.length).toBe(4);

    tfg?.sections?.forEach(sec => {
      expect(sec.number).toBeTruthy();
      expect(sec.title.es).toBeTruthy();
      expect(sec.title.en).toBeTruthy();
      expect(sec.content.es.length).toBeGreaterThan(100);
      expect(sec.content.en.length).toBeGreaterThan(100);
    });
  });

  it('validates that all project media images map to optimized image assets', () => {
    featuredProjects.forEach(project => {
      project.media?.forEach(media => {
        if (media.type === 'image') {
          expect(imageAssets[media.src], `Missing imageAsset for ${media.src} in project ${project.id}`).toBeDefined();
        } else if (media.type === 'youtube') {
          expect(media.src).toMatch(/^https:\/\/(www\.)?youtube\.com\/watch\?v=/);
        }
      });
    });
  });
});

