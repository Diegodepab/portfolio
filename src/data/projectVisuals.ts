import type { ProjectVisualKind } from '../components/projects/ProjectVisual';

export const projectVisuals: Record<string, ProjectVisualKind> = {
  'kubernetes-platform': 'kubernetes', 'tfg-patient-monitoring': 'health',
  metadataxtract: 'extract', metadatasearch: 'ai', 'titan-workflow': 'titan',
  alignx: 'alignx', 'msurgery-platform': 'surgery', smotts: 'smotts',
  'digital-twins': 'twins', 'edaan-data-space': 'edaan', 'instagram-epic-tool': 'circlescope',
};
