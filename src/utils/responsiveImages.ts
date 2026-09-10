export interface ImageSource {
  src: string;
  srcSet?: string;
  sizes?: string;
}
export interface ResponsiveImageAsset extends ImageSource {
  width: number;
  height: number;
  thumbnail?: ImageSource;
}

/** Use the same candidate for decode, the visible img and the GPU texture. */
export function preloadResponsiveImage(source: ImageSource, signal?: AbortSignal): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined' || signal?.aborted) { resolve(null); return; }
    const image = new Image();
    let finished = false;
    const finish = (value: string | null) => {
      if (finished) return;
      finished = true;
      image.onload = image.onerror = null;
      signal?.removeEventListener('abort', abort);
      clearTimeout(timeout);
      resolve(value);
    };
    const abort = () => { image.removeAttribute('srcset'); image.removeAttribute('src'); finish(null); };
    const timeout = setTimeout(() => finish(null), 10_000);
    signal?.addEventListener('abort', abort, { once: true });
    image.onload = () => {
      const selected = image.currentSrc || image.src;
      if (typeof image.decode === 'function') void image.decode().catch(() => {}).then(() => finish(selected));
      else finish(selected);
    };
    image.onerror = () => finish(null);
    if (source.sizes) image.sizes = source.sizes;
    if (source.srcSet) image.srcset = source.srcSet;
    image.src = source.src;
  });
}
