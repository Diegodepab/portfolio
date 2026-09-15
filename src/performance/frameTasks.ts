/** Batch every geometry read before any canvas/DOM write in the same frame. */
const tasks = new Map<object, () => (() => void) | undefined>();
let frame = 0;
export function scheduleVisualMeasurement(key: object, read: () => (() => void) | undefined) {
  tasks.set(key, read);
  if (!frame) frame = requestAnimationFrame(() => {
    frame = 0;
    const pending = [...tasks.values()];
    tasks.clear();
    const writes = pending.map((measure) => measure());
    writes.forEach((write) => write?.());
  });
}
export function cancelVisualMeasurement(key: object) {
  tasks.delete(key);
  if (!tasks.size && frame) { cancelAnimationFrame(frame); frame = 0; }
}
