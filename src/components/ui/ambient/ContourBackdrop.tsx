import { useAmbientPointer, type AmbientPoint } from './useAmbientPointer';
import './AmbientBackdrops.css';

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 980;

interface ContourIsland extends AmbientPoint {
  scale: number;
  rotation: number;
  tone: 'primary' | 'secondary';
}

const islands: readonly ContourIsland[] = [
  { x: 164, y: 210, scale: 1.12, rotation: -12, tone: 'primary' },
  { x: 850, y: 188, scale: 1.38, rotation: 8, tone: 'secondary' },
  { x: 448, y: 564, scale: 1.5, rotation: -7, tone: 'secondary' },
  { x: 1054, y: 642, scale: 1.08, rotation: 14, tone: 'primary' },
  { x: 126, y: 870, scale: 0.92, rotation: 5, tone: 'secondary' },
  { x: 718, y: 884, scale: 1.2, rotation: -10, tone: 'primary' },
];

const rings = [
  { rx: 90, ry: 52 },
  { rx: 70, ry: 39 },
  { rx: 50, ry: 27 },
  { rx: 30, ry: 16 },
] as const;

export const ContourBackdrop = () => {
  const backdropRef = useAmbientPointer({
    points: islands,
    viewBoxWidth: VIEWBOX_WIDTH,
    viewBoxHeight: VIEWBOX_HEIGHT,
    activationRadius: 176,
    activeLimit: 1,
    shiftX: 5,
    shiftY: 4,
  });

  return (
    <div ref={backdropRef} className="ambient-backdrop contour-backdrop" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid slice">
        <g className="contour-field">
          {islands.map((island, index) => (
            <g
              key={`${island.x}-${island.y}`}
              data-ambient-node={index}
              data-tone={island.tone}
              className="contour-island"
              transform={`translate(${island.x} ${island.y}) rotate(${island.rotation}) scale(${island.scale})`}
            >
              {rings.map((ring, ringIndex) => (
                <ellipse
                  key={ring.rx}
                  cx={ringIndex % 2 === 0 ? 0 : 3}
                  cy={ringIndex % 2 === 0 ? 0 : -2}
                  rx={ring.rx}
                  ry={ring.ry}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
