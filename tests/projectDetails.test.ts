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

  it('validates edaan-data-space configuration and ecosystem viewer architecture', () => {
    const edaan = featuredProjects.find(p => p.id === 'edaan-data-space');
    expect(edaan).toBeDefined();
    expect(edaan?.awardBadge?.es).toContain('Ecosistema Federado');
    expect(edaan?.stats?.length).toBeGreaterThanOrEqual(4);
    expect(edaan?.architectureType).toBe('metadata-pipeline');
    expect(edaan?.roleHighlight?.es).toBeTruthy();
    expect(edaan?.featured).toBe(true);
  });

  it('validates new showcase projects: agrivision-agrifed, edgecardio-lora, and replica-hotel', () => {
    const agri = featuredProjects.find(p => p.id === 'agrivision-agrifed');
    expect(agri).toBeDefined();
    expect(agri?.company).toBe('Khaos Research');
    expect(agri?.category).toBe('data-science');
    expect(agri?.stats?.length).toBeGreaterThanOrEqual(4);

    const cardio = featuredProjects.find(p => p.id === 'edgecardio-lora');
    expect(cardio).toBeDefined();
    expect(cardio?.tag).toBe('personal');
    expect(cardio?.stats?.some(s => s.value.includes('< 1 ms'))).toBe(true);

    const replica = featuredProjects.find(p => p.id === 'replica-hotel');
    expect(replica).toBeDefined();
    expect(replica?.category).toBe('game-dev');
    expect(replica?.stats?.some(s => s.value.includes('C#'))).toBe(true);
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

