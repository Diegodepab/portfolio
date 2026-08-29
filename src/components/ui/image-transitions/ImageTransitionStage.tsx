import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'motion/react';
import {
  CSS_TRANSITION_EFFECTS,
  DEFAULT_TRANSITION_EFFECTS,
  canUsePixelTransitions,
  createEffectQueue,
  isPixelTransition,
  type ImageTransitionEffect,
} from './effects';
import { LazyPixelTransitionLayer, loadPixelTransition } from './pixelTransitionLoader';
import './ImageTransitionStage.css';

interface TransitionState {
  fromIndex: number;
  toIndex: number;
  effect: ImageTransitionEffect;
}

interface ImageTransitionStageProps<Item> {
  items: readonly Item[];
  activeIndex: number;
  getSource: (item: Item) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  effects?: readonly ImageTransitionEffect[];
  getEffects?: (from: Item, to: Item) => readonly ImageTransitionEffect[];
  className?: string;
  onSettledIndexChange?: (index: number) => void;
}

const CSS_EFFECT_DURATION: Record<'fade', number> = {
  fade: 680,
};

const normaliseIndex = (index: number, count: number): number => {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
};

const preloadImage = async (src: string): Promise<void> => {
  if (typeof Image === 'undefined') return;

  const image = new Image();
  image.src = src;

  if (typeof image.decode === 'function') {
    try {
      await image.decode();
      return;
    } catch {
      // Some browsers reject decode() for cached SVGs while still rendering them.
    }
  }

  if (image.complete) return;
  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
};

export const ImageTransitionStage = <Item,>({
  items,
  activeIndex,
  getSource,
  renderItem,
  effects = DEFAULT_TRANSITION_EFFECTS,
  getEffects,
  className = '',
  onSettledIndexChange,
}: ImageTransitionStageProps<Item>) => {
  const requestedIndex = normaliseIndex(activeIndex, items.length);
  const [settledIndex, setSettledIndex] = useState(requestedIndex);
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const transitionRef = useRef<TransitionState | null>(null);
  const [pixelModuleReady, setPixelModuleReady] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const pixelCapable = useMemo(canUsePixelTransitions, []);
  const effectQueueRef = useRef<ImageTransitionEffect[]>([]);
  const effectSignatureRef = useRef('');
  const previousEffectRef = useRef<ImageTransitionEffect | null>(null);

  useEffect(() => {
    if (!pixelCapable || shouldReduceMotion) return;

    let cancelled = false;
    let timer: number | undefined;
    let idleId: number | undefined;

    const prepare = () => {
      loadPixelTransition()
        .then(() => {
          if (!cancelled) setPixelModuleReady(true);
        })
        .catch(() => {
          if (!cancelled) setPixelModuleReady(false);
        });
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleId = idleWindow.requestIdleCallback(prepare, { timeout: 2_500 });
    } else {
      timer = window.setTimeout(prepare, 1_200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [pixelCapable, shouldReduceMotion]);

  const chooseEffect = useCallback((allowedEffects: readonly ImageTransitionEffect[]) => {
    const supportedEffects = allowedEffects.filter(
      (effect) => !isPixelTransition(effect) || (pixelCapable && pixelModuleReady),
    );
    const availableEffects = shouldReduceMotion
      ? (['fade'] as const)
      : supportedEffects.length
        ? supportedEffects
        : CSS_TRANSITION_EFFECTS;
    const signature = availableEffects.join('|');

    if (!effectQueueRef.current.length || effectSignatureRef.current !== signature) {
      effectQueueRef.current = createEffectQueue(availableEffects, previousEffectRef.current);
      effectSignatureRef.current = signature;
    }

    const effect = effectQueueRef.current.shift() ?? 'fade';
    previousEffectRef.current = effect;
    return effect;
  }, [pixelCapable, pixelModuleReady, shouldReduceMotion]);

  useEffect(() => {
    if (!items.length || transition || requestedIndex === settledIndex) return;

    let cancelled = false;
    const fromItem = items[settledIndex];
    const toItem = items[requestedIndex];
    if (!fromItem || !toItem) return;

    const allowedEffects = getEffects?.(fromItem, toItem) ?? effects;

    void preloadImage(getSource(toItem)).then(() => {
      if (cancelled) return;
      const nextTransition = {
        fromIndex: settledIndex,
        toIndex: requestedIndex,
        effect: chooseEffect(allowedEffects),
      };
      transitionRef.current = nextTransition;
      setTransition(nextTransition);
    });

    return () => {
      cancelled = true;
    };
  }, [chooseEffect, effects, getEffects, getSource, items, requestedIndex, settledIndex, transition]);

  const completeTransition = useCallback(() => {
    const current = transitionRef.current;
    if (!current) return;

    transitionRef.current = null;
    setSettledIndex(current.toIndex);
    setTransition(null);
    onSettledIndexChange?.(current.toIndex);
  }, [onSettledIndexChange]);

  useEffect(() => {
    if (!transition || isPixelTransition(transition.effect)) return;

    const duration = shouldReduceMotion
      ? 0
      : CSS_EFFECT_DURATION[transition.effect as 'fade'];
    const timer = window.setTimeout(completeTransition, duration);
    return () => window.clearTimeout(timer);
  }, [completeTransition, shouldReduceMotion, transition]);

  useEffect(() => {
    if (!transition || !isPixelTransition(transition.effect)) return;
    const watchdog = window.setTimeout(completeTransition, 1_800);
    return () => window.clearTimeout(watchdog);
  }, [completeTransition, transition]);

  if (!items.length) return null;

  const currentIndex = transition?.fromIndex ?? settledIndex;
  const currentItem = items[currentIndex];
  const incomingItem = transition ? items[transition.toIndex] : null;
  if (!currentItem) return null;

  return (
    <div
      className={`image-transition-stage${transition ? ' is-transitioning' : ''} ${className}`.trim()}
      data-effect={transition?.effect}
    >
      <div className="image-transition-stage__layer image-transition-stage__layer--current">
        {renderItem(currentItem, currentIndex)}
      </div>

      {transition && incomingItem && !isPixelTransition(transition.effect) && (
        <div
          className="image-transition-stage__layer image-transition-stage__layer--incoming"
          data-effect={transition.effect}
          aria-hidden="true"
        >
          {renderItem(incomingItem, transition.toIndex)}
        </div>
      )}



      {transition && incomingItem && isPixelTransition(transition.effect) && pixelModuleReady && (
        <Suspense fallback={null}>
          <LazyPixelTransitionLayer
            effect={transition.effect}
            src={getSource(incomingItem)}
            onComplete={completeTransition}
          />
        </Suspense>
      )}
    </div>
  );
};
