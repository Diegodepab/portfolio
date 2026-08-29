import { useAmbientPointer, type AmbientPoint } from './useAmbientPointer';
import './AmbientBackdrops.css';

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 980;

interface SignalPoint extends AmbientPoint {
  kind: 'dot' | 'cross';
  tone: 'primary' | 'secondary';
  twinkle?: boolean;
}

const signals: readonly SignalPoint[] = [
  { x: 54, y: 104, kind: 'dot', tone: 'primary' },
  { x: 148, y: 184, kind: 'cross', tone: 'secondary' },
  { x: 274, y: 88, kind: 'dot', tone: 'secondary', twinkle: true },
  { x: 392, y: 152, kind: 'dot', tone: 'primary' },
  { x: 526, y: 72, kind: 'cross', tone: 'primary' },
  { x: 668, y: 192, kind: 'dot', tone: 'secondary' },
  { x: 812, y: 116, kind: 'cross', tone: 'secondary' },
  { x: 956, y: 218, kind: 'dot', tone: 'primary', twinkle: true },
  { x: 1108, y: 106, kind: 'dot', tone: 'secondary' },
  { x: 92, y: 338, kind: 'cross', tone: 'primary' },
  { x: 222, y: 422, kind: 'dot', tone: 'secondary' },
  { x: 352, y: 314, kind: 'dot', tone: 'primary' },
  { x: 488, y: 448, kind: 'cross', tone: 'secondary' },
  { x: 622, y: 348, kind: 'dot', tone: 'primary' },
  { x: 754, y: 472, kind: 'dot', tone: 'secondary' },
  { x: 890, y: 336, kind: 'cross', tone: 'primary' },
  { x: 1034, y: 430, kind: 'dot', tone: 'secondary' },
  { x: 1154, y: 318, kind: 'cross', tone: 'secondary' },
  { x: 62, y: 650, kind: 'dot', tone: 'secondary' },
  { x: 184, y: 566, kind: 'cross', tone: 'primary' },
  { x: 318, y: 704, kind: 'dot', tone: 'primary', twinkle: true },
  { x: 444, y: 604, kind: 'dot', tone: 'secondary' },
  { x: 580, y: 738, kind: 'cross', tone: 'secondary' },
  { x: 720, y: 594, kind: 'dot', tone: 'primary' },
  { x: 846, y: 708, kind: 'cross', tone: 'primary' },
  { x: 982, y: 576, kind: 'dot', tone: 'secondary' },
  { x: 1124, y: 692, kind: 'dot', tone: 'primary' },
  { x: 126, y: 874, kind: 'dot', tone: 'primary' },
  { x: 410, y: 846, kind: 'cross', tone: 'secondary' },
  { x: 688, y: 904, kind: 'dot', tone: 'secondary' },
  { x: 936, y: 842, kind: 'cross', tone: 'primary' },
  { x: 1150, y: 894, kind: 'dot', tone: 'secondary' },
];

export const SignalDustBackdrop = () => {
  const backdropRef = useAmbientPointer({
    points: signals,
    viewBoxWidth: VIEWBOX_WIDTH,
    viewBoxHeight: VIEWBOX_HEIGHT,
    activationRadius: 132,
    activeLimit: 3,
    shiftX: 4,
    shiftY: 3,
  });

  return (
    <div ref={backdropRef} className="ambient-backdrop signal-dust-backdrop" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid slice">
        <g className="signal-dust-field signal-dust-field--far">
          {signals.map((signal, index) => (
            <g
              key={`${signal.x}-${signal.y}`}
              data-ambient-node={index}
              data-tone={signal.tone}
              className={`signal-star signal-star--${signal.kind}${signal.twinkle ? ' is-twinkling' : ''}`}
            >
              {signal.kind === 'dot' ? (
                <circle cx={signal.x} cy={signal.y} r={index % 4 === 0 ? 2.2 : 1.55} />
              ) : (
                <>
                  <line x1={signal.x - 3.5} y1={signal.y} x2={signal.x + 3.5} y2={signal.y} />
                  <line x1={signal.x} y1={signal.y - 3.5} x2={signal.x} y2={signal.y + 3.5} />
                </>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

