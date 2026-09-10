import { useAmbientPointer } from '../ui/ambient/useAmbientPointer';
import './TechnicalBackdrop.css';

const nodes = [
  { x: 90, y: 170, size: 4 },
  { x: 185, y: 112, size: 3 },
  { x: 265, y: 205, size: 5 },
  { x: 365, y: 145, size: 3 },
  { x: 465, y: 230, size: 4 },
  { x: 560, y: 118, size: 5 },
  { x: 650, y: 195, size: 3 },
  { x: 755, y: 105, size: 4 },
  { x: 855, y: 205, size: 5 },
  { x: 950, y: 138, size: 3 },
  { x: 1030, y: 238, size: 4 },
  { x: 140, y: 430, size: 3 },
  { x: 245, y: 515, size: 5 },
  { x: 360, y: 440, size: 4 },
  { x: 495, y: 535, size: 3 },
  { x: 610, y: 430, size: 4 },
  { x: 735, y: 530, size: 5 },
  { x: 850, y: 435, size: 3 },
  { x: 990, y: 515, size: 4 },
];

const edges = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 5],
  [4, 5], [4, 6], [5, 6], [5, 7], [6, 8], [7, 8], [7, 9],
  [8, 9], [8, 10], [9, 10], [11, 12], [11, 13], [12, 13],
  [12, 14], [13, 14], [13, 15], [14, 15], [14, 16], [15, 16],
  [15, 17], [16, 17], [16, 18], [17, 18], [2, 12], [4, 14],
  [6, 15], [8, 17], [10, 18],
];

export const TechnicalBackdrop = () => {
  const backdropRef = useAmbientPointer({ points: nodes, viewBoxWidth: 1120, viewBoxHeight: 650,
    activationRadius: Number.POSITIVE_INFINITY, shiftX: 9, shiftY: 6 });

  return (
    <div ref={backdropRef} className="technical-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1120 650" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="technical-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" className="technical-grid-line" />
          </pattern>
          <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent-1)" stopOpacity="0" />
            <stop offset="0.45" stopColor="var(--color-accent-1)" stopOpacity="0.75" />
            <stop offset="1" stopColor="var(--color-accent-3)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1120" height="650" fill="url(#technical-grid)" />

        <g className="technical-network">
          {edges.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={nodes[from].x}
              y1={nodes[from].y}
              x2={nodes[to].x}
              y2={nodes[to].y}
            />
          ))}
          {nodes.map((node, index) => (
            <circle
              key={`${node.x}-${node.y}`}
              data-ambient-node={index}
              cx={node.x}
              cy={node.y}
              r={node.size}
            />
          ))}
        </g>

        <g className="technical-flows">
          <path d="M 10 355 C 180 255, 280 455, 455 340 S 760 230, 1110 315" />
          <path d="M 20 515 C 245 590, 345 390, 545 490 S 850 575, 1110 430" />
          <path d="M 65 185 C 250 75, 390 235, 570 150 S 860 65, 1060 205" />
        </g>
      </svg>
    </div>
  );
};
