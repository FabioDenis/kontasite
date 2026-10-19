/**
 * Declarative timeline for the guided simulations. A simulation is a list of
 * frames; given the elapsed time, `resolveTimeline` returns the screen state,
 * where the cursor should be and which visible step is active. Being pure, it
 * is easy to test and lets the player jump to any step.
 */

export type Frame<S> = {
  /** Index of the visible step this frame belongs to. */
  step: number;
  /** How long the frame lasts, in milliseconds. */
  duration: number;
  /** `data-sim` id of the element the cursor moves to. Persists until changed. */
  target?: string;
  /** Show a click on the target during the second half of the frame. */
  click?: boolean;
  /** State patch applied when the frame starts. */
  set?: Partial<S>;
  /** Text typed progressively into a state key during the frame. */
  type?: { key: KeysOfType<S, string>; text: string };
};

type KeysOfType<S, V> = { [K in keyof S]: S[K] extends V ? K : never }[keyof S];

export type TimelinePoint<S> = {
  index: number;
  step: number;
  state: S;
  target: string | null;
  click: boolean;
  /** Progress through the current frame, 0..1. */
  progress: number;
};

/** Typing finishes at this fraction of the frame, leaving a short pause. */
const TYPING_SHARE = 0.8;

export function totalDuration<S>(frames: Frame<S>[]): number {
  return frames.reduce((sum, f) => sum + f.duration, 0);
}

function applyFrame<S>(state: S, frame: Frame<S>, progress: number): S {
  let next = frame.set ? { ...state, ...frame.set } : state;
  if (frame.type) {
    const share = Math.min(progress / TYPING_SHARE, 1);
    const chars = Math.floor(frame.type.text.length * share);
    next = { ...next, [frame.type.key]: frame.type.text.slice(0, chars) };
  }
  return next;
}

export function resolveTimeline<S>(frames: Frame<S>[], initial: S, elapsed: number): TimelinePoint<S> {
  const total = totalDuration(frames);
  let t = total > 0 ? ((elapsed % total) + total) % total : 0;

  let state = initial;
  let target: string | null = null;

  for (let index = 0; index < frames.length; index++) {
    const frame = frames[index];
    if (frame.target) target = frame.target;

    if (t < frame.duration || index === frames.length - 1) {
      const progress = frame.duration > 0 ? Math.min(t / frame.duration, 1) : 1;
      return {
        index,
        step: frame.step,
        state: applyFrame(state, frame, progress),
        target,
        click: Boolean(frame.click) && progress >= 0.5,
        progress,
      };
    }

    state = applyFrame(state, frame, 1);
    t -= frame.duration;
  }

  return { index: 0, step: 0, state: initial, target: null, click: false, progress: 0 };
}

export function stepStart<S>(frames: Frame<S>[], step: number): number {
  let elapsed = 0;
  for (const frame of frames) {
    if (frame.step === step) return elapsed;
    elapsed += frame.duration;
  }
  return 0;
}
