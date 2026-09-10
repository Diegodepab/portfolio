import { useEffectVisibility } from '../../performance/useVisualEffects';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiBox, FiActivity, FiSearch, FiTool, FiCpu,
  FiGitMerge, FiGlobe, FiUsers, FiLayers, FiZap,
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

/* ── Project definitions shown in the orrery ────────────────────────── */

interface OrreryProject {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const PROJECTS_EN: OrreryProject[] = [
  { id: 'kubernetes-platform', label: 'K8s',       icon: <FiBox size={14} /> },
  { id: 'tfg-patient-monitoring', label: 'IoT',    icon: <FiActivity size={14} /> },
  { id: 'metadataxtract', label: 'MXtract',        icon: <FiTool size={14} /> },
  { id: 'metadatasearch', label: 'MSearch',         icon: <FiSearch size={14} /> },
  { id: 'titan-workflow', label: 'TITAN',           icon: <FiCpu size={14} /> },
  { id: 'alignx', label: 'AlignX',                 icon: <FiGitMerge size={14} /> },
  { id: 'edaan-data-space', label: 'EDAAN',         icon: <FiGlobe size={14} /> },
  { id: 'instagram-epic-tool', label: 'Circle',     icon: <FiUsers size={14} /> },
  { id: 'msurgery-platform', label: 'mSurgery',     icon: <FiZap size={14} /> },
  { id: 'digital-twins', label: 'Twins',            icon: <FiLayers size={14} /> },
];

const PROJECTS_ES: OrreryProject[] = [
  { id: 'kubernetes-platform', label: 'K8s',       icon: <FiBox size={14} /> },
  { id: 'tfg-patient-monitoring', label: 'IoT',    icon: <FiActivity size={14} /> },
  { id: 'metadataxtract', label: 'MXtract',        icon: <FiTool size={14} /> },
  { id: 'metadatasearch', label: 'MSearch',         icon: <FiSearch size={14} /> },
  { id: 'titan-workflow', label: 'TITAN',           icon: <FiCpu size={14} /> },
  { id: 'alignx', label: 'AlignX',                 icon: <FiGitMerge size={14} /> },
  { id: 'edaan-data-space', label: 'EDAAN',         icon: <FiGlobe size={14} /> },
  { id: 'instagram-epic-tool', label: 'Circle',     icon: <FiUsers size={14} /> },
  { id: 'msurgery-platform', label: 'mSurgery',     icon: <FiZap size={14} /> },
  { id: 'digital-twins', label: 'Gemelos',          icon: <FiLayers size={14} /> },
];

/* ── Constants ──────────────────────────────────────────────────────── */

/** How many nodes orbit on the ring */
const NODE_COUNT = 3;

/** Seconds between project label swaps */
const SWAP_INTERVAL_MS = 5_000;

/* ── Component ──────────────────────────────────────────────────────── */

export const ProjectOrrery: React.FC = () => {
  const { lang } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const { active } = useEffectVisibility(rootRef);
  const projects = lang === 'en' ? PROJECTS_EN : PROJECTS_ES;

  // `offset` advances every SWAP_INTERVAL_MS; we pick TOTAL_SLOTS consecutive
  // projects starting at `offset % projects.length`.
  const [offset, setOffset] = useState(0);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    if (!active) { setSwapping(false); return; }
    let swapTimer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setSwapping(true);
      // After a short fade-out, advance the offset and fade back in
      swapTimer = setTimeout(() => {
        setOffset(prev => prev + NODE_COUNT);
        setSwapping(false);
      }, 400); // matches CSS transition duration
    }, SWAP_INTERVAL_MS);
    return () => { clearInterval(id); clearTimeout(swapTimer); };
  }, [active]);

  // Build the 5 visible slots
  const slots: OrreryProject[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    slots.push(projects[(offset + i) % projects.length]);
  }

  return (
    <div ref={rootRef} data-animation-active={active} className="orrery" aria-label={lang === 'en' ? 'Project shortcuts' : 'Accesos a proyectos'}>
      {/* Central glow */}
      <div className="orrery-glow" />

      {/* Single orbit ring + nodes */}
      <div className="orrery-ring">
        <span className="orrery-ring-path" />
        {slots.map((p, i) => (
          <a
            key={`node-${i}`}
            href={`/projects/${p.id}`}
            className={`orrery-node orrery-node--pos-${i + 1}${swapping ? ' is-swapping' : ''}`}
            data-tone={(i % 3) + 1}
            title={p.label}
          >
            <span className="orrery-node-icon">{p.icon}</span>
            <span className="orrery-node-label">{p.label}</span>
          </a>
        ))}
      </div>

      {/* Central hub */}
      <b className="orrery-core">DDP</b>
    </div>
  );
};
