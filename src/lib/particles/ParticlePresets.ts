import type { Preset, PresetName } from "./ParticleTypes";
export const presets: Record<PresetName, Preset> = {
  radial: { count: 360, strength: 48, radius: 280, opacity: 0.8, drift: 3 },
  constellation: {
    count: 45,
    strength: -6,
    radius: 160,
    opacity: 0.35,
    drift: 7,
  },
  "magnetic-grid": {
    count: 90,
    strength: -16,
    radius: 140,
    opacity: 0.4,
    drift: 0,
  },
  displacement: {
    count: 45,
    strength: -20,
    radius: 140,
    opacity: 0.55,
    drift: 2,
  },
  timeline: { count: 14, strength: 0, radius: 95, opacity: 0.65, drift: 0 },
  attraction: { count: 70, strength: 16, radius: 180, opacity: 0.5, drift: 4 },
};
export const palette = ["#4285F4", "#6B8EFF", "#A9C4FF"];
/** Cursor-driven parallax in CSS pixels. Timeline keeps its semantic anchor. */
export const followDistance: Record<PresetName, number> = {
  radial: 110,
  constellation: 22,
  "magnetic-grid": 16,
  displacement: 42,
  timeline: 0,
  attraction: 65,
};

/** Native particles.js options; no CDN or runtime JSON request required. */
export function getLibraryConfig(
  preset: PresetName,
  count: number,
  staticMode: boolean,
) {
  const p = presets[preset];
  const mode =
    preset === "timeline"
      ? []
      : preset === "constellation"
        ? "grab"
        : preset === "attraction"
          ? "bubble"
          : "repulse";
  return {
    particles: {
      number: { value: count, density: { enable: false, value_area: 800 } },
      color: { value: palette },
      shape: { type: "circle", stroke: { width: 0, color: "#4285F4" } },
      opacity: { value: p.opacity, random: true, anim: { enable: false } },
      size: {
        value: preset === "radial" ? 1.8 : 1.35,
        random: true,
        anim: { enable: false },
      },
      line_linked: {
        enable: false,
        distance: 100,
        color: "#6B8EFF",
        opacity: 0.1,
        width: 0.6,
      },
      // Our shared scheduler calls particlesDraw; disable the library's own loop at startup.
      move: {
        enable: false,
        speed: staticMode ? 0 : preset === "timeline" ? 0.25 : 0.3,
        direction: preset === "timeline" ? "bottom" : "none",
        random: false,
        straight: preset === "timeline",
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: false, mode },
        onclick: { enable: false, mode: "repulse" },
        resize: false,
      },
      modes: {
        grab: { distance: 160, line_linked: { opacity: 0.14 } },
        bubble: {
          distance: 180,
          size: 2.5,
          duration: 0.5,
          opacity: 0.75,
          speed: 2,
        },
        repulse: { distance: preset === "radial" ? 140 : 95, duration: 0.45 },
        push: { particles_nb: 0 },
      },
    },
    retina_detect: false,
  };
}
