import { describe, expect, it } from "vitest";
import { resolveTimeline, stepStart, totalDuration, type Frame } from "./timeline";

type State = { query: string; open: boolean; total: number };

const initial: State = { query: "", open: false, total: 0 };

const frames: Frame<State>[] = [
  { step: 0, duration: 1000, target: "search" },
  { step: 0, duration: 1000, type: { key: "query", text: "Coca" } },
  { step: 1, duration: 500, target: "result", click: true, set: { total: 1800 } },
  { step: 2, duration: 1000, set: { open: true } },
];

describe("totalDuration", () => {
  it("adds up every frame", () => {
    expect(totalDuration(frames)).toBe(3500);
  });
});

describe("resolveTimeline", () => {
  it("starts on the first frame with the initial state", () => {
    const r = resolveTimeline(frames, initial, 0);

    expect(r).toMatchObject({ index: 0, step: 0, target: "search", state: initial });
  });

  it("types text progressively and completes before the frame ends", () => {
    expect(resolveTimeline(frames, initial, 1000).state.query).toBe("");
    expect(resolveTimeline(frames, initial, 1400).state.query).toBe("Co");
    expect(resolveTimeline(frames, initial, 1850).state.query).toBe("Coca");
  });

  it("applies patches cumulatively and keeps typed text in later frames", () => {
    const r = resolveTimeline(frames, initial, 2600);

    expect(r.step).toBe(2);
    expect(r.state).toEqual({ query: "Coca", open: true, total: 1800 });
  });

  it("keeps the last cursor target when a frame does not set one", () => {
    expect(resolveTimeline(frames, initial, 1200).target).toBe("search");
    expect(resolveTimeline(frames, initial, 3000).target).toBe("result");
  });

  it("only reports the click during the second half of a clicking frame", () => {
    expect(resolveTimeline(frames, initial, 2100).click).toBe(false);
    expect(resolveTimeline(frames, initial, 2400).click).toBe(true);
    expect(resolveTimeline(frames, initial, 3000).click).toBe(false);
  });

  it("wraps around after the last frame so the simulation loops", () => {
    expect(resolveTimeline(frames, initial, 3500 + 200)).toMatchObject({ index: 0, state: initial });
  });
});

describe("stepStart", () => {
  it("returns when the first frame of a step begins", () => {
    expect(stepStart(frames, 0)).toBe(0);
    expect(stepStart(frames, 1)).toBe(2000);
    expect(stepStart(frames, 2)).toBe(2500);
  });

  it("returns 0 for a step that does not exist", () => {
    expect(stepStart(frames, 9)).toBe(0);
  });
});
