export function deviceBudget(width: number, height: number) {
  const hardware = navigator as Navigator & { deviceMemory?: number };
  const coarse =
    matchMedia("(pointer: coarse)").matches ||
    matchMedia("(max-width: 760px)").matches;
  const low =
    (hardware.hardwareConcurrency || 8) <= 4 ||
    (hardware.deviceMemory ?? 8) <= 4;
  return {
    density:
      Math.min(1, Math.max(0.35, (width * height) / 900000)) *
      (coarse ? 0.3 : low ? 0.65 : 1),
    dpr: Math.min(devicePixelRatio || 1, coarse || low ? 1 : 1.5),
  };
}
/** Stable seeded randomness avoids a distracting reshuffle on each resize. */
export function seededRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
