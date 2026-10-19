"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { resolveTimeline, stepStart, totalDuration, type Frame } from "./timeline";

type PlayerOptions = {
  /** Whether the simulation is visible and allowed to run. */
  playing: boolean;
};

/** Drives a timeline with requestAnimationFrame and exposes playback controls. */
export function useTimelinePlayer<S>(frames: Frame<S>[], initial: S, { playing }: PlayerOptions) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentFrames, setCurrentFrames] = useState(frames);
  const running = playing && !paused;

  // A different simulation starts from its beginning.
  if (currentFrames !== frames) {
    setCurrentFrames(frames);
    setElapsed(0);
    setPaused(false);
  }

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Clamp big gaps (tab in background) so the simulation does not skip steps.
      const delta = Math.min(now - last, 100);
      last = now;
      setElapsed((e) => e + delta);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const total = useMemo(() => totalDuration(frames), [frames]);
  const point = useMemo(() => resolveTimeline(frames, initial, elapsed), [frames, initial, elapsed]);

  const start = stepStart(frames, point.step);
  const nextStart = useMemo(() => {
    const later = frames.findIndex((f) => f.step > point.step);
    return later === -1 ? total : stepStart(frames, frames[later].step);
  }, [frames, point.step, total]);
  const looped = total > 0 ? elapsed % total : 0;
  const stepProgress = nextStart > start ? Math.min(Math.max((looped - start) / (nextStart - start), 0), 1) : 0;

  const goToStep = useCallback((step: number) => setElapsed(stepStart(frames, step)), [frames]);
  const restart = useCallback(() => {
    setElapsed(0);
    setPaused(false);
  }, []);
  const togglePause = useCallback(() => setPaused((p) => !p), []);

  /** How many times the simulation has looped; lets the stage start each lap clean. */
  const loop = total > 0 ? Math.floor(elapsed / total) : 0;

  return { ...point, stepProgress, loop, paused, goToStep, restart, togglePause };
}

export type TimelinePlayer<S> = ReturnType<typeof useTimelinePlayer<S>>;
