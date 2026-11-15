import { ParticleEngine } from "./ParticleEngine";
import type { PresetName } from "./ParticleTypes";

const presets = new Set<PresetName>([
  "radial",
  "constellation",
  "magnetic-grid",
  "displacement",
  "timeline",
  "attraction",
]);

/** Owns the only animation loop; individual canvases never schedule frames. */
class ParticleManager {
  private engines = new Map<HTMLElement, ParticleEngine>();
  private hosts = new Map<HTMLElement, ParticleEngine[]>();
  private intersections: IntersectionObserver;
  private controller = new AbortController();
  private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  private coarsePointer = window.matchMedia("(pointer: coarse)");
  private narrowScreen = window.matchMedia("(max-width: 760px)");
  private raf = 0;
  private previousTime = 0;
  private destroyed = false;

  constructor() {
    this.intersections = new IntersectionObserver(this.onIntersection, {
      threshold: 0,
    });
    const signal = this.controller.signal;
    document.addEventListener("portfolio:language-change", this.onWindowResize, { signal });
    document.addEventListener("visibilitychange", this.onVisibility, {
      signal,
    });
    window.addEventListener("resize", this.onWindowResize, {
      passive: true,
      signal,
    });
    this.reducedMotion.addEventListener("change", this.onPreferenceChange, {
      signal,
    });
    this.coarsePointer.addEventListener("change", this.onPreferenceChange, {
      signal,
    });
    this.narrowScreen.addEventListener("change", this.onPreferenceChange, {
      signal,
    });
    this.scan();
  }

  private get staticMode(): boolean {
    // A narrow desktop window still has a real mouse: keep following it.
    return this.reducedMotion.matches || this.coarsePointer.matches;
  }

  scan(): void {
    if (this.destroyed) return;
    document
      .querySelectorAll<HTMLElement>("[data-particle-preset]")
      .forEach((canvas) => {
        if (this.engines.has(canvas) || !canvas.parentElement) return;
        const preset = canvas.dataset.particlePreset as PresetName;
        if (!presets.has(preset)) return;
        const engine = new ParticleEngine(canvas, preset);
        engine.visible = false;
        engine.setStatic(this.staticMode);
        this.engines.set(canvas, engine);
        const siblings = this.hosts.get(engine.host);
        if (siblings) siblings.push(engine);
        else {
          this.hosts.set(engine.host, [engine]);
          this.intersections.observe(engine.host);
        }
      });
  }

  private drawStill(engine: ParticleEngine): void {
    if (engine.visible && !document.hidden) engine.frame(performance.now(), 0);
  }

  private onIntersection = (entries: IntersectionObserverEntry[]): void => {
    for (const entry of entries) {
      for (const engine of this.hosts.get(entry.target as HTMLElement) ?? []) {
        engine.visible = entry.isIntersecting;
        engine.host.toggleAttribute("data-particles-visible", engine.visible);
        if (engine.visible && this.staticMode) this.drawStill(engine);
      }
    }
    this.reconcileLoop();
  };

  // ResizeObserver does not necessarily fire when only devicePixelRatio changes.
  private onWindowResize = (): void => {
    for (const engine of this.engines.values()) {
      engine.resize();
      if (this.staticMode) this.drawStill(engine);
    }
  };

  private onPreferenceChange = (): void => {
    for (const engine of this.engines.values()) {
      engine.setStatic(this.staticMode);
      if (this.staticMode) this.drawStill(engine);
    }
    this.reconcileLoop();
  };

  private onVisibility = (): void => {
    for (const engine of this.engines.values())
      engine.host.toggleAttribute(
        "data-particles-visible",
        engine.visible && !document.hidden,
      );
    if (!document.hidden && this.staticMode) {
      for (const engine of this.engines.values()) this.drawStill(engine);
    }
    this.reconcileLoop();
  };

  private shouldAnimate(): boolean {
    if (this.destroyed || document.hidden || this.staticMode) return false;
    for (const engine of this.engines.values()) {
      if (engine.visible) return true;
    }
    return false;
  }

  private reconcileLoop(): void {
    if (this.shouldAnimate()) {
      if (!this.raf) {
        this.previousTime = 0;
        this.raf = requestAnimationFrame(this.tick);
      }
    } else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.previousTime = 0;
    }
  }

  private tick = (time: number): void => {
    this.raf = 0;
    if (!this.shouldAnimate()) return;
    const elapsed = this.previousTime ? time - this.previousTime : 1000 / 60;
    // The small tolerance accommodates displays whose nominal 60 Hz is 59.94 Hz.
    if (elapsed >= 1000 / 60 - 0.25) {
      const dt = Math.min(elapsed, 32);
      this.previousTime = time;
      for (const engine of this.engines.values()) {
        if (engine.visible) engine.frame(time, dt);
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.controller.abort();
    this.intersections.disconnect();
    for (const engine of this.engines.values()) {
      engine.host.removeAttribute("data-particles-visible");
      engine.destroy();
    }
    this.engines.clear();
    this.hosts.clear();
  }
}

let manager: ParticleManager | undefined;
let lifecycle: AbortController | undefined;
let library: Promise<void> | undefined;
let generation = 0;

function loadLibrary(): Promise<void> {
  if (typeof window.particlesJS === "function") return Promise.resolve();
  if (!library)
    library = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = import.meta.env.BASE_URL + "vendor/particles.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        library = undefined;
        reject(new Error("No se pudo cargar particles.js"));
      };
      document.head.appendChild(script);
    });
  return library;
}

/** Safe to call from multiple Astro component instances and page-load events. */
export function initParticles(): void {
  if (typeof window === "undefined") return;
  if (!lifecycle) {
    lifecycle = new AbortController();
    const signal = lifecycle.signal;
    document.addEventListener("astro:page-load", mountParticles, { signal });
    document.addEventListener("astro:before-swap", unmountParticles, {
      signal,
    });
    window.addEventListener("pagehide", unmountParticles, { signal });
    window.addEventListener("pageshow", mountParticles, { signal });
  }
  mountParticles();
}

async function mountParticles(): Promise<void> {
  if (!("IntersectionObserver" in window) || !("ResizeObserver" in window))
    return;
  const current = generation;
  try {
    await loadLibrary();
  } catch (error) {
    console.warn(error);
    return;
  }
  if (current !== generation) return;
  if (manager) manager.scan();
  else manager = new ParticleManager();
}

function unmountParticles(): void {
  generation++;
  manager?.destroy();
  manager = undefined;
}

/** Also removes the lifecycle hooks, used when disposing this module during HMR. */
export function destroyParticles(): void {
  unmountParticles();
  lifecycle?.abort();
  lifecycle = undefined;
}

if (import.meta.hot) import.meta.hot.dispose(destroyParticles);
