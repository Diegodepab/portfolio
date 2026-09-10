import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useEffectVisibility, useVisualEffects } from '../../../performance/useVisualEffects';
import { reduceEffects } from '../../../performance/effectsStore';
import { preloadResponsiveImage, type ImageSource } from '../../../utils/responsiveImages';
import { CSS_TRANSITION_EFFECTS, DEFAULT_TRANSITION_EFFECTS, createEffectQueue, isPixelTransition, type ImageTransitionEffect } from './effects';
import { LazyPixelTransitionLayer, loadPixelTransition } from './pixelTransitionLoader';
import './ImageTransitionStage.css';

interface TransitionState { fromIndex: number; toIndex: number; effect: ImageTransitionEffect; source: string }
interface ImageTransitionStageProps<Item> {
  items: readonly Item[];
  activeIndex: number;
  getSource: (item: Item) => string | ImageSource;
  renderItem: (item: Item, index: number, selectedSource?: string) => ReactNode;
  effects?: readonly ImageTransitionEffect[];
  getEffects?: (from: Item, to: Item) => readonly ImageTransitionEffect[];
  className?: string;
  onSettledIndexChange?: (index: number) => void;
}
class PixelBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export const ImageTransitionStage = <Item,>({ items, activeIndex, getSource, renderItem,
  effects = DEFAULT_TRANSITION_EFFECTS, getEffects, className = '', onSettledIndexChange,
}: ImageTransitionStageProps<Item>) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const { visible } = useEffectVisibility(stageRef);
  const { quality, reducedMotion } = useVisualEffects();
  const requestedIndex = items.length ? ((activeIndex % items.length) + items.length) % items.length : 0;
  const [settledIndex, setSettledIndex] = useState(requestedIndex);
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const [failedIndex, setFailedIndex] = useState<number | null>(null);
  const transitionRef = useRef<TransitionState | null>(null);
  const queue = useRef<ImageTransitionEffect[]>([]);
  const signature = useRef('');
  const previous = useRef<ImageTransitionEffect | null>(null);
  const callbacks = useRef({ getSource, getEffects, onSettledIndexChange });
  callbacks.current = { getSource, getEffects, onSettledIndexChange };
  const pixelAllowed = quality === 'full' && visible && !reducedMotion;

  const complete = useCallback(() => {
    const current = transitionRef.current;
    if (!current) return;
    transitionRef.current = null;
    setSettledIndex(current.toIndex);
    setTransition(null);
    callbacks.current.onSettledIndexChange?.(current.toIndex);
  }, []);
  const failPixel = useCallback(() => { reduceEffects(); complete(); }, [complete]);

  useEffect(() => {
    if (failedIndex !== requestedIndex) setFailedIndex(null);
  }, [requestedIndex, failedIndex]);

  useEffect(() => {
    if (!items.length || transition || requestedIndex === settledIndex || failedIndex === requestedIndex || !visible) return;
    const from = items[settledIndex];
    const to = items[requestedIndex];
    if (!from || !to) return;
    const controller = new AbortController();
    const allowed = (callbacks.current.getEffects?.(from, to) ?? effects).filter(effect => !isPixelTransition(effect) || pixelAllowed);
    const pool = allowed.length ? allowed : CSS_TRANSITION_EFFECTS;
    const source = callbacks.current.getSource(to);
    void (async () => {
      const selected = await preloadResponsiveImage(typeof source === 'string' ? { src: source } : source, controller.signal);
      if (controller.signal.aborted) return;
      if (!selected) { setFailedIndex(requestedIndex); return; }
      const nextSignature = pool.join('|');
      if (!queue.current.length || signature.current !== nextSignature) {
        signature.current = nextSignature;
        queue.current = createEffectQueue(pool, previous.current);
      }
      let effect = reducedMotion ? 'fade' as const : queue.current.shift() ?? 'fade';
      if (isPixelTransition(effect)) {
        try { await loadPixelTransition(); }
        catch { effect = 'fade'; reduceEffects(); }
      }
      if (controller.signal.aborted) return;
      previous.current = effect;
      const next = { fromIndex: settledIndex, toIndex: requestedIndex, effect, source: selected };
      transitionRef.current = next;
      setTransition(next);
    })();
    return () => controller.abort();
  }, [items, requestedIndex, settledIndex, transition, failedIndex, visible, pixelAllowed, reducedMotion, effects]);

  useEffect(() => {
    if (!transition) return;
    if (!visible || reducedMotion || (isPixelTransition(transition.effect) && !pixelAllowed)) { complete(); return; }
    const pixel = isPixelTransition(transition.effect);
    const timer = window.setTimeout(pixel ? failPixel : complete, pixel ? 1_800 : 680);
    return () => window.clearTimeout(timer);
  }, [transition, visible, reducedMotion, pixelAllowed, complete, failPixel]);

  const current = items[transition?.fromIndex ?? settledIndex];
  const incoming = transition ? items[transition.toIndex] : null;
  if (!current) return null;
  return (
    <div ref={stageRef} className={`image-transition-stage${transition ? ' is-transitioning' : ''} ${className}`.trim()} data-effect={transition?.effect}>
      <div className="image-transition-stage__layer image-transition-stage__layer--current">{renderItem(current, transition?.fromIndex ?? settledIndex)}</div>
      {transition && incoming && !isPixelTransition(transition.effect) && (
        <div className="image-transition-stage__layer image-transition-stage__layer--incoming" data-effect={transition.effect} aria-hidden="true">
          {renderItem(incoming, transition.toIndex, transition.source)}
        </div>
      )}
      {transition && incoming && isPixelTransition(transition.effect) && pixelAllowed && (
        <PixelBoundary key={transition.source} onFailure={failPixel}>
          <Suspense fallback={null}>
            <LazyPixelTransitionLayer effect={transition.effect} src={transition.source} onComplete={complete} onFailure={failPixel} />
          </Suspense>
        </PixelBoundary>
      )}
    </div>
  );
};
