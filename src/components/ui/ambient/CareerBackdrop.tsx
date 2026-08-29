import { useAmbientPointer, type AmbientPoint } from './useAmbientPointer';
import './AmbientBackdrops.css';

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 900;

const milestones: readonly AmbientPoint[] = [
  { x: 72, y: 192 },
  { x: 218, y: 132 },
  { x: 356, y: 218 },
  { x: 505, y: 166 },
  { x: 668, y: 238 },
  { x: 824, y: 144 },
  { x: 1010, y: 207 },
  { x: 1118, y: 164 },
  { x: 154, y: 570 },
  { x: 328, y: 646 },
  { x: 516, y: 548 },
  { x: 704, y: 632 },
  { x: 902, y: 544 },
  { x: 1086, y: 614 },
];

export const CareerBackdrop = () => {
  const backdropRef = useAmbientPointer({
    points: milestones,
    viewBoxWidth: VIEWBOX_WIDTH,
    viewBoxHeight: VIEWBOX_HEIGHT,
    activationRadius: 105,
    activeLimit: 1,
    shiftX: 6,
    shiftY: 4,
  });

  return (
    <div ref={backdropRef} className="ambient-backdrop career-backdrop" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="career-route-primary" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent-1)" stopOpacity="0" />
            <stop offset="0.48" stopColor="var(--color-accent-1)" stopOpacity="0.34" />
            <stop offset="1" stopColor="var(--color-accent-3)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="career-route-secondary" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent-3)" stopOpacity="0" />
            <stop offset="0.55" stopColor="var(--color-accent-3)" stopOpacity="0.26" />
            <stop offset="1" stopColor="var(--color-accent-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="career-routes career-routes--far">
          <path d="M -60 278 C 130 164, 278 342, 470 228 S 820 128, 1260 292" />
          <path d="M -40 720 C 190 598, 350 784, 558 670 S 896 568, 1260 726" />
        </g>
        <g className="career-routes career-routes--near">
          <path d="M -35 176 C 140 66, 286 272, 466 164 S 790 72, 1235 218" />
          <path d="M -25 520 C 192 438, 340 624, 540 512 S 862 402, 1235 558" />
          <path d="M 20 812 C 238 724, 402 860, 620 766 S 934 690, 1190 792" />
        </g>

        <g className="career-milestones">
          {milestones.map((point, index) => (
            <g
              key={`${point.x}-${point.y}`}
              data-ambient-node={index}
              className="career-milestone"
              data-tone={index % 3 === 1 ? 'secondary' : 'primary'}
            >
              <circle cx={point.x} cy={point.y} r="2.7" />
              <line x1={point.x - 7} y1={point.y + 11} x2={point.x + 7} y2={point.y + 11} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

