import { getLibraryConfig, presets, followDistance } from "./ParticlePresets";
import { deviceBudget, seededRandom } from "./performance";
import type { PresetName, Rect } from "./ParticleTypes";

interface LibraryParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}
interface LibraryInstance {
  canvas: {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    pxratio: number;
  };
  particles: {
    array: LibraryParticle[];
    number: { value: number };
    move: { enable: boolean; speed: number };
  };
  interactivity: {
    mouse: { pos_x: number | null; pos_y: number | null };
    status: string;
    events: { onhover: { enable: boolean; mode: string | string[] } };
  };
  fn: {
    particlesCreate: () => void;
    particlesDraw: () => void;
    drawAnimFrame?: number;
    checkAnimFrame?: number;
  };
  tmp: { checkAnimFrame?: number };
}
interface LibraryEntry {
  pJS: LibraryInstance;
}
declare global {
  interface Window {
    particlesJS: (id: string, config: unknown) => void;
    pJSDom: LibraryEntry[];
  }
}
interface Anchor {
  x: number;
  y: number;
  depth: number;
  phase: number;
  offsetX: number;
  offsetY: number;
}

/** Real particles.js rendering and modes, driven only by our shared scheduler. */
export class ParticleEngine {
  readonly host: HTMLElement;
  visible = false;
  private entry: LibraryEntry;
  private canvas: HTMLCanvasElement;
  private abort = new AbortController();
  private observer: ResizeObserver;
  private nodeObserver?: IntersectionObserver;
  private anchors: Anchor[] = [];
  private exclusions: Rect[] = [];
  private bounds: DOMRect | null = null;
  private dirty = true;
  private staticMode = false;
  private dead = false;
  private pointer = { x: 0, y: 0, active: false, moved: -Infinity };
  private waves: { x: number; y: number; time: number }[] = [];
  private hoverMode: string | string[];
  private width = 0;
  private height = 0;

  constructor(
    private container: HTMLElement,
    private preset: PresetName,
  ) {
    this.host = container.parentElement!;
    // Manager loads the original classic script. Disabled events/motion prevent library-owned listeners/RAF.
    window.particlesJS(container.id, getLibraryConfig(preset, 12, true));
    const entry = window.pJSDom.find(
      (candidate) => candidate.pJS.canvas.el.parentElement === container,
    );
    if (!entry) throw new Error("No se pudo inicializar particles.js");
    this.entry = entry;
    this.canvas = entry.pJS.canvas.el;
    this.canvas.setAttribute("aria-hidden", "true");
    this.canvas.style.pointerEvents = "none";
    this.hoverMode = entry.pJS.interactivity.events.onhover.mode;
    const options = { signal: this.abort.signal, passive: true };
    this.host.addEventListener(
      "pointermove",
      (event) => {
        if (this.staticMode || event.pointerType === "touch") return;
        if (this.dirty) this.measure();
        this.pointer = {
          x: event.clientX - (this.bounds?.left ?? 0),
          y: event.clientY - (this.bounds?.top ?? 0),
          active: true,
          moved: performance.now(),
        };
      },
      options,
    );
    const leave = () => {
      this.pointer.active = false;
      this.pointer.moved = performance.now() - 1200;
    };
    this.host.addEventListener("pointerleave", leave, options);
    this.host.addEventListener("pointercancel", leave, options);
    window.addEventListener("blur", leave, options);
    window.addEventListener(
      "scroll",
      () => {
        this.dirty = true;
        leave();
      },
      options,
    );
    this.host.addEventListener(
      "toggle",
      () => {
        this.dirty = true;
        this.resize();
      },
      { ...options, capture: true },
    );
    this.host.addEventListener(
      "click",
      (event) => {
        if (this.staticMode || !["radial", "attraction"].includes(this.preset))
          return;
        if (
          event.target instanceof Element &&
          event.target.closest("a,button,summary")
        )
          return;
        if (this.dirty) this.measure();
        this.waves.push({
          x: event.clientX - (this.bounds?.left ?? 0),
          y: event.clientY - (this.bounds?.top ?? 0),
          time: performance.now(),
        });
        if (this.waves.length > 2) this.waves.shift();
      },
      options,
    );
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.host);
    this.observer.observe(container);
    if (preset === "timeline") {
      this.nodeObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) =>
            e.target.toggleAttribute("data-timeline-visible", e.isIntersecting),
          ),
        { threshold: 0.5 },
      );
      this.host
        .querySelectorAll(".timeline details")
        .forEach((node) => this.nodeObserver!.observe(node));
    }
    this.resize();
  }

  setStatic(value: boolean) {
    this.staticMode = value;
    this.pointer.active = false;
    this.pointer.moved = -Infinity;
    this.waves = [];
    this.entry.pJS.interactivity.status = "mouseleave";
    this.resize();
  }

  private measure() {
    this.bounds = this.canvas.getBoundingClientRect();
    const bounds = this.bounds;
    this.exclusions = Array.from(
      this.host.querySelectorAll<HTMLElement>("[data-particle-exclude]"),
    ).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - bounds.left - 12,
        y: r.top - bounds.top - 12,
        width: r.width + 24,
        height: r.height + 24,
      };
    });
    this.dirty = false;
  }

  resize() {
    if (this.dead) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    if (!this.width || !this.height) return;
    const pjs = this.entry.pJS;
    // DPR 1 intentionally keeps this legacy renderer's buffers bounded and its small dots subdued.
    pjs.canvas.w = this.canvas.width = this.width;
    pjs.canvas.h = this.canvas.height = this.height;
    pjs.canvas.pxratio = 1;
    const budget = deviceBudget(this.width, this.height);
    pjs.particles.number.value = Math.max(
      6,
      Math.round(presets[this.preset].count * budget.density),
    );
    pjs.particles.array = [];
    pjs.fn.particlesCreate();
    this.measure();
    const random = seededRandom(812 + this.preset.length),
      count = pjs.particles.array.length;
    const cols = Math.ceil(Math.sqrt((count * this.width) / this.height)),
      rows = Math.ceil(count / cols);
    const nodeBounds = this.host
      .querySelector<HTMLElement>(".timeline-point")
      ?.getBoundingClientRect();
    const lineX =
      nodeBounds && this.bounds
        ? nodeBounds.left - this.bounds.left + nodeBounds.width / 2
        : this.width / 2;
    this.anchors = pjs.particles.array.map((particle, i) => {
      const depth = 0.3 + random() * 0.7,
        phase = random() * Math.PI * 2;
      let x = random() * this.width,
        y = random() * this.height;
      if (this.preset === "radial") {
        // Reject off-canvas samples instead of clamping them to one shared edge.
        // Clamping a radial field forms a visible vertical/horizontal row of dots.
        let attempts = 0;
        do {
          const angle = random() * Math.PI * 2;
          const radius =
            Math.sqrt(random()) * Math.max(this.width * 0.6, this.height * 0.7);
          x = this.width * 0.68 + Math.cos(angle) * radius;
          y = this.height * 0.48 + Math.sin(angle) * radius * 0.7;
          attempts++;
        } while ((x < 8 || x > this.width - 8 || y < 8 || y > this.height - 8) && attempts < 32);
        if (x < 8 || x > this.width - 8 || y < 8 || y > this.height - 8) {
          x = 8 + random() * Math.max(0, this.width - 16);
          y = 8 + random() * Math.max(0, this.height - 16);
        }
      } else if (this.preset === "magnetic-grid") {
        x = (((i % cols) + 0.5) * this.width) / cols;
        y = ((Math.floor(i / cols) + 0.5) * this.height) / rows;
      } else if (this.preset === "timeline") {
        x = lineX;
        y = ((i + 0.5) / count) * this.height;
      }
      x = Math.max(3, Math.min(this.width - 3, x));
      y = Math.max(3, Math.min(this.height - 3, y));
      particle.x = x;
      particle.y = y;
      return { x, y, depth, phase, offsetX: 0, offsetY: 0 };
    });
    if (this.staticMode) this.frame(0, 0);
  }

  frame(time: number, dt: number) {
    if (this.dead || !this.width || !this.height) return;
    if (this.dirty) this.measure();
    const pjs = this.entry.pJS,
      ctx = pjs.canvas.ctx;
    const fade = this.staticMode
      ? 0
      : this.pointer.active
        ? 1
        : Math.max(0, 1 - (time - this.pointer.moved) / 1600);
    pjs.interactivity.mouse.pos_x = this.pointer.x + 0.001;
    pjs.interactivity.mouse.pos_y = this.pointer.y + 0.001;
    pjs.interactivity.status = fade > 0.01 ? "mousemove" : "mouseleave";
    pjs.interactivity.events.onhover.enable = !this.staticMode;
    pjs.interactivity.events.onhover.mode = this.staticMode
      ? []
      : this.hoverMode;
    const step = this.staticMode ? 0 : Math.min(dt, 32) / 16.667,
      ease = 1 - Math.pow(0.9, step);
    this.waves = this.waves.filter((w) => time - w.time < 1100);
    pjs.particles.array.forEach((particle, i) => {
      const a = this.anchors[i];
      if (!a) return;
      const distance = Math.hypot(this.pointer.x - a.x, this.pointer.y - a.y);
      const influence =
        Math.max(0, 1 - distance / presets[this.preset].radius) * fade;
      const follow = followDistance[this.preset] * a.depth;
      let ox = (this.pointer.x / this.width - 0.5) * follow * fade;
      let oy = (this.pointer.y / this.height - 0.5) * follow * fade;
      if (this.preset === "attraction" || this.preset === "magnetic-grid") {
        ox += (this.pointer.x - a.x) * influence * 0.12;
        oy += (this.pointer.y - a.y) * influence * 0.12;
      }
      for (const wave of this.waves) {
        const dx = a.x - wave.x,
          dy = a.y - wave.y,
          d = Math.hypot(dx, dy),
          age = time - wave.time;
        const force =
          Math.max(0, 1 - Math.abs(d - age * 0.3) / 40) * (1 - age / 1100) * 9;
        ox += (dx / (d || 1)) * force;
        oy += (dy / (d || 1)) * force;
      }
      if (this.staticMode) {
        a.offsetX = 0;
        a.offsetY = 0;
      } else {
        a.offsetX += (ox - a.offsetX) * ease;
        a.offsetY += (oy - a.offsetY) * ease;
      }
      const drift = this.staticMode ? 0 : presets[this.preset].drift;
      particle.x =
        a.x + a.offsetX + Math.sin(time * 0.0003 + a.phase) * drift * a.depth;
      particle.y =
        this.preset === "timeline" && !this.staticMode
          ? (a.y + time * 0.008 * a.depth) % this.height
          : a.y + a.offsetY + Math.cos(time * 0.0002 + a.phase) * drift;
    });
    pjs.particles.move.enable = !this.staticMode;
    pjs.particles.move.speed = this.staticMode ? 0 : 0.12 * step;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    // Separate masks intersect: overlapping excluded text regions must not cancel each other.
    for (const r of this.exclusions) {
      ctx.beginPath();
      ctx.rect(0, 0, this.width, this.height);
      ctx.rect(r.x, r.y, r.width, r.height);
      ctx.clip("evenodd");
    }
    try {
      pjs.fn.particlesDraw();
    } finally {
      ctx.restore();
      pjs.particles.move.enable = false;
    }
  }

  destroy() {
    if (this.dead) return;
    this.dead = true;
    this.abort.abort();
    this.observer.disconnect();
    this.nodeObserver?.disconnect();
    this.host
      .querySelectorAll("[data-timeline-visible]")
      .forEach((el) => el.removeAttribute("data-timeline-visible"));
    const pjs = this.entry.pJS;
    for (const handle of [
      pjs.fn.drawAnimFrame,
      pjs.fn.checkAnimFrame,
      pjs.tmp.checkAnimFrame,
    ])
      if (handle) cancelAnimationFrame(handle);
    // vendors.destroypJS resets the global registry; remove only this section's own entry.
    const index = window.pJSDom.indexOf(this.entry);
    if (index !== -1) window.pJSDom.splice(index, 1);
    pjs.particles.array = [];
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.canvas.remove();
    this.anchors = [];
    this.exclusions = [];
    this.waves = [];
  }
}
