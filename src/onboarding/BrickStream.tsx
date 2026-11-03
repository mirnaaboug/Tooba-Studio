import { useEffect, useRef, type CSSProperties } from 'react';

// Every icon SVG, keyed by file name ("Icon_Strategy_Oat.svg" → url).
const ICON_URLS = import.meta.glob('../ds/assets/icons/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const iconUrl = (name: string, tone: 'Oat' | 'Nile') =>
  ICON_URLS[`../ds/assets/icons/Icon_${name}_${tone}.svg`];

const ICONS = ['Strategy', 'Naming', 'Identity', 'Typography', 'Color', 'Brand-book', 'Packaging', 'Social', 'Rebrand', 'Speed', 'Chat', 'Proposal'];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: number[], b: number[], t: number) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
const C1 = hex('#1E4E49'), C2 = hex('#2A5D57'), APR = '#F08A5D';

type Kind = 'plain' | 'icon' | 'paper' | 'oat';
interface Brick {
  x: number; y: number; d: number; w: number; h: number;
  vx: number; vy: number; a: number; va: number; tilt: number;
  fx: number; bf: number; ph: number; kind: Kind; ii: number; dots: boolean; extra: boolean;
  born?: number; ox?: number; oy?: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function make(x: number, y: number, extra: boolean): Brick {
  // d = depth: nearer bricks are bigger and faster.
  const d = extra ? rnd(0.8, 1.15) : rnd(0.5, 1.25);
  const r = Math.random();
  const ii = Math.floor(Math.random() * ICONS.length);
  const kind: Kind = d < 0.75 ? 'plain' : r < 0.5 ? 'icon' : r < 0.72 ? 'paper' : r < 0.82 ? 'oat' : 'plain';
  return {
    x, y, d, w: rnd(104, 150) * d, h: 50 * d, vx: 0, vy: 0, a: rnd(-0.15, 0.15), va: 0, tilt: rnd(-0.12, 0.12),
    fx: rnd(0.35, 0.9) * d * 1.3, bf: rnd(0.4, 1.2), ph: rnd(0, 6.28), kind, ii,
    dots: kind === 'plain' && d > 0.8 && Math.random() < 0.35, extra,
  };
}

/**
 * Interactive brick stream: bricks rush in from the left, then drift across.
 * Drag to grab and fling a brick; click empty space to burst seven new ones;
 * the cursor pushes bricks aside; page scroll knocks them upward.
 */
export function BrickStream({ cursor = 'crosshair', style }: { cursor?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const load = (n: string, t: 'Oat' | 'Nile') => { const i = new Image(); i.src = iconUrl(n, t); return i; };
    const oatI = ICONS.map((n) => load(n, 'Oat'));
    const nileI = ICONS.map((n) => load(n, 'Nile'));

    const W = { w: 0, h: 0, bricks: [] as Brick[], mx: -9999, my: -9999, mvx: 0, mvy: 0, grab: null as Brick | null, last: performance.now(), raf: 0, sy: window.scrollY };

    const build = () => {
      const r = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      W.w = r.width; W.h = r.height;
      c.width = r.width * dpr; c.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!W.bricks.length) {
        const n = Math.max(24, Math.min(80, Math.round((W.w * W.h) / 21000)));
        for (let i = 0; i < n; i++) {
          const b = reduced ? make(rnd(0, W.w), rnd(0, W.h), false) : make(rnd(-W.w * 1.1, -120), rnd(0, W.h), false);
          b.vx = reduced ? 0 : rnd(14, 30) * b.d; b.vy = rnd(-2, 2);
          W.bricks.push(b);
        }
        W.bricks.sort((p, q) => p.d - q.d);
      }
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(c);

    const local = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const hit = (x: number, y: number) => {
      for (let i = W.bricks.length - 1; i >= 0; i--) {
        const b = W.bricks[i], dx = x - b.x, dy = y - b.y, cs = Math.cos(-b.a), sn = Math.sin(-b.a);
        if (Math.abs(dx * cs - dy * sn) < b.w / 2 + 4 && Math.abs(dx * sn + dy * cs) < b.h / 2 + 4) return b;
      }
      return null;
    };

    const pm = (e: PointerEvent) => {
      const p = local(e);
      W.mvx = W.mvx * 0.5 + (p.x - W.mx) * 0.5; W.mvy = W.mvy * 0.5 + (p.y - W.my) * 0.5;
      W.mx = p.x; W.my = p.y;
      if (!W.grab) c.style.cursor = hit(p.x, p.y) ? 'grab' : cursor;
    };
    const pd = (e: PointerEvent) => {
      const p = local(e);
      W.mx = p.x; W.my = p.y; W.mvx = W.mvy = 0;
      const b = hit(p.x, p.y);
      if (b) {
        W.grab = b; b.ox = b.x - p.x; b.oy = b.y - p.y; c.style.cursor = 'grabbing';
        W.bricks.splice(W.bricks.indexOf(b), 1); W.bricks.push(b);
      } else {
        for (let i = 0; i < 7; i++) {
          const nb = make(p.x, p.y, true), ang = rnd(0, 6.28), sp = rnd(6, 16);
          nb.vx = Math.cos(ang) * sp; nb.vy = Math.sin(ang) * sp; nb.va = rnd(-0.2, 0.2); nb.born = performance.now();
          W.bricks.push(nb);
        }
        const extras = W.bricks.filter((x) => x.extra);
        if (extras.length > 42) extras.slice(0, extras.length - 42).forEach((x) => W.bricks.splice(W.bricks.indexOf(x), 1));
      }
    };
    const pu = () => {
      const b = W.grab;
      if (!b) return;
      b.vx = Math.max(-45, Math.min(45, W.mvx)); b.vy = Math.max(-45, Math.min(45, W.mvy)); b.va = b.vx * 0.006;
      W.grab = null; c.style.cursor = 'grab';
    };
    const sc = () => {
      const dy = window.scrollY - W.sy; W.sy = window.scrollY;
      for (const b of W.bricks) { b.vy -= dy * 0.06 * b.d; b.va += dy * 0.0008 * (b.ii % 2 ? 1 : -1); }
    };

    window.addEventListener('scroll', sc, { passive: true });
    c.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);

    const frame = (now: number) => {
      const k = Math.min(2.5, (now - W.last) / 16.67);
      W.last = now;
      ctx.clearRect(0, 0, W.w, W.h);
      for (const b of W.bricks) {
        if (b === W.grab) {
          const nx = W.mx + (b.ox ?? 0), ny = W.my + (b.oy ?? 0);
          b.va += ((nx - b.x) * 0.01 - b.va) * 0.3; b.x = nx; b.y = ny;
        } else {
          const drift = reduced ? 0 : 1;
          b.vx += (b.fx * drift - b.vx) * 0.018 * k;
          b.vy += (Math.sin(now * 0.001 * b.bf + b.ph) * 0.3 * b.d * drift - b.vy) * 0.02 * k;
          const dx = b.x - W.mx, dy = b.y - W.my, dist = Math.hypot(dx, dy) || 1, R = 150 + 40 * b.d;
          if (dist < R) { const f = (1 - dist / R) * 1.5 * k * b.d; b.vx += (dx / dist) * f; b.vy += (dy / dist) * f; b.va += Math.sign(dx) * 0.003 * f; }
          b.x += b.vx * k; b.y += b.vy * k;
          if (b.x > W.w + 200) { b.x = -180; b.y = rnd(0, W.h); b.vx = b.fx; }
          if (b.x < -260) b.x = W.w + 180;
          if (b.y < -90) b.y = W.h + 80;
          if (b.y > W.h + 90) b.y = -80;
        }
        b.a += b.va * k; b.va *= Math.pow(0.95, k); b.a += (b.tilt - b.a) * 0.012 * k;

        let pop = 1;
        if (b.born) { const t = (now - b.born) / 380; pop = t < 1 ? 0.3 + 0.7 * (1 - Math.pow(1 - t, 3)) : 1; }
        const g = b === W.grab ? 1.08 : 1;
        const w = b.w * pop * g, hh = b.h * pop * g;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.a);
        ctx.fillStyle = b.kind === 'paper' ? '#A9BFA3' : b.kind === 'oat' ? '#F1E7D6' : b.kind === 'icon' ? '#2A5D57' : mix(C1, C2, Math.min(1, (b.d - 0.5) * 1.4));
        ctx.beginPath();
        ctx.roundRect(-w / 2, -hh / 2, w, hh, 8 * b.d);
        ctx.fill();
        if (b.kind !== 'plain') {
          const im = (b.kind === 'icon' ? oatI : nileI)[b.ii], s = 32 * b.d * pop;
          if (im.complete && im.naturalWidth) ctx.drawImage(im, -s / 2, -s / 2, s, s);
        }
        if (b.dots) {
          ctx.fillStyle = APR;
          const r = 4.5 * b.d;
          ctx.beginPath();
          ctx.arc(w / 2 - 14 * b.d, hh / 2 - 12 * b.d, r, 0, 6.29);
          ctx.arc(w / 2 - 27 * b.d, hh / 2 - 12 * b.d, r, 0, 6.29);
          ctx.fill();
        }
        ctx.restore();
      }
      W.raf = requestAnimationFrame(frame);
    };
    W.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(W.raf);
      ro.disconnect();
      c.removeEventListener('pointerdown', pd);
      window.removeEventListener('scroll', sc);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
    };
  }, [cursor]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', cursor, ...style }}
    />
  );
}
