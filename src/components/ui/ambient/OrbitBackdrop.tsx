import { useAmbientPointer, type AmbientPoint } from './useAmbientPointer';
import './AmbientBackdrops.css';

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 980;

interface OrbitPoint extends AmbientPoint {
  rx: number;
  ry: number;
  rotation: number;
  tone: 'primary' | 'secondary';
}

const orbits: readonly OrbitPoint[] = [
  { x: 126, y: 142, rx: 82, ry: 28, rotation: -18, tone: 'primary' },
  { x: 384, y: 224, rx: 126, ry: 42, rotation: 11, tone: 'secondary' },
  { x: 706, y: 116, rx: 104, ry: 35, rotation: -9, tone: 'primary' },
  { x: 1046, y: 252, rx: 92, ry: 31, rotation: 17, tone: 'secondary' },
  { x: 212, y: 506, rx: 116, ry: 38, rotation: 8, tone: 'secondary' },
  { x: 586, y: 452, rx: 148, ry: 48, rotation: -15, tone: 'primary' },
  { x: 934, y: 592, rx: 132, ry: 43, rotation: 13, tone: 'primary' },
  { x: 106, y: 814, rx: 78, ry: 25, rotation: -12, tone: 'primary' },
  { x: 442, y: 792, rx: 108, ry: 36, rotation: 18, tone: 'secondary' },
  { x: 786, y: 862, rx: 128, ry: 40, rotation: -7, tone: 'secondary' },
  { x: 1112, y: 824, rx: 86, ry: 29, rotation: 10, tone: 'primary' },
];

export const OrbitBackdrop = () => {
  const backdropRef = useAmbientPointer({
    points: orbits,
    viewBoxWidth: VIEWBOX_WIDTH,
    viewBoxHeight: VIEWBOX_HEIGHT,
    activationRadius: 118,
    activeLimit: 1,
    shiftX: 5,
    shiftY: 3,
  });

  return (
    <div ref={backdropRef} className="ambient-backdrop orbit-backdrop" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid slice">
        <g className="orbit-field orbit-field--far">
          <path d="M -80 352 C 208 210, 370 452, 632 300 S 976 188, 1280 372" />
          <path d="M -40 742 C 228 602, 410 818, 684 682 S 1012 586, 1260 716" />
        </g>

        <g className="orbit-field orbit-field--near">
          {orbits.map((orbit, index) => (
            <g
              key={`${orbit.x}-${orbit.y}`}
              data-ambient-node={index}
              data-tone={orbit.tone}
              className="orbit-node"
              transform={`rotate(${orbit.rotation} ${orbit.x} ${orbit.y})`}
            >
              <ellipse cx={orbit.x} cy={orbit.y} rx={orbit.rx} ry={orbit.ry} />
              <circle cx={orbit.x + orbit.rx * 0.74} cy={orbit.y - orbit.ry * 0.67} r="2.4" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
