export type PresetName =
  | "radial"
  | "constellation"
  | "magnetic-grid"
  | "displacement"
  | "timeline"
  | "attraction";
export interface Preset {
  count: number;
  strength: number;
  radius: number;
  opacity: number;
  drift: number;
}
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
