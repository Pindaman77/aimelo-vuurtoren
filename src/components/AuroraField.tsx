import { useEffect, useRef } from "react";

/**
 * Soft animated aurora: large blurred gradient blobs drifting slowly,
 * with a very subtle pull toward the pointer. Decorative, token-colored.
 */
export function AuroraField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const styles = getComputedStyle(document.documentElement);
    const lime = styles.getPropertyValue("--lime").trim() || "oklch(0.87 0.2 124)";
    const ember = styles.getPropertyValue("--ember").trim() || "oklch(0.75 0.16 62)";

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Slow, large blobs. Each orbits its anchor point very gently.
    const blobs = [
      { color: lime, alpha: 0.16, r: 0.42, ax: 0.22, ay: 0.28, sp: 0.00012, ph: 0, orb: 0.08 },
      { color: ember, alpha: 0.12, r: 0.38, ax: 0.78, ay: 0.7, sp: 0.00009, ph: 2.1, orb: 0.1 },
      { color: lime, alpha: 0.1, r: 0.5, ax: 0.6, ay: 0.15, sp: 0.00007, ph: 4.2, orb: 0.06 },
      { color: ember, alpha: 0.09, r: 0.34, ax: 0.15, ay: 0.85, sp: 0.00011, ph: 1.3, orb: 0.09 },
    ];

    // Pointer target with heavy easing — barely noticeable, no jitter.
    const target = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      target.y = (e.clientY - rect.top) / Math.max(rect.height, 1);
    };

    const draw = (t: number) => {
      cur.x += (target.x - cur.x) * 0.015;
      cur.y += (target.y - cur.y) * 0.015;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const base = Math.max(w, h);

      for (const b of blobs) {
        const ox = Math.cos(t * b.sp + b.ph) * b.orb;
        const oy = Math.sin(t * b.sp * 1.3 + b.ph) * b.orb;
        // Tiny pointer drift (max ~4% of screen)
        const px = b.ax + ox + (cur.x - 0.5) * 0.04;
        const py = b.ay + oy + (cur.y - 0.5) * 0.04;
        const radius = b.r * base;
        const g = ctx.createRadialGradient(px * w, py * h, 0, px * w, py * h, radius);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px * w, py * h, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    if (reduce) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full blur-2xl"
    />
  );
}
