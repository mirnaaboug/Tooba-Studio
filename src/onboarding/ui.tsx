import type { CSSProperties, ReactNode } from 'react';
import { Dots, Eyebrow } from '../ds/components';

export const EASE = 'cubic-bezier(.2,.7,.2,1)';
export const enter = (ms: number, delay = 0) => `tbIn ${ms}ms ${delay}ms both ${EASE}`;

export const cardColors = (sel: boolean) => ({
  bd: sel ? 'var(--nile)' : 'var(--line-on-light)',
  bg: sel ? 'var(--white)' : 'rgba(255,255,255,.55)',
  fill: sel ? 'var(--nile)' : 'transparent',
});

/** Pill-shaped single-choice chip (industry, budget, channel). */
export function Chip({ label, sel, onPick }: { label: string; sel: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={sel}
      onClick={onPick}
      className="tb-opt tb-press"
      style={{
        display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 18px', borderRadius: 8, cursor: 'pointer',
        font: '400 15px/1 var(--font-sans)',
        background: sel ? 'var(--nile)' : 'var(--white)', color: sel ? 'var(--oat)' : 'var(--nile)',
        border: `1.5px solid ${sel ? 'var(--nile)' : 'var(--line-on-light)'}`,
        transition: 'background 180ms,color 180ms,border-color 180ms,transform 120ms',
      }}
    >
      {sel && <Dots size={5} />}
      {label}
    </button>
  );
}

export function ChipGroup({ label, children, style }: { label: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div role="group" aria-label={label} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{children}</div>
    </div>
  );
}

export function StepHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ font: '400 48px/1.1 var(--font-serif)', letterSpacing: '-.01em', margin: 0 }}>{title}</h2>
      <p style={{ font: 'var(--type-intro)', margin: 0, color: 'var(--text-muted-on-light)' }}>{intro}</p>
    </header>
  );
}

/** 22px selection marker: circle (radio) or 4px-radius square (checkbox), filled Nile with dots when on. */
export function Marker({ sel, shape = 'circle' }: { sel: boolean; shape?: 'circle' | 'square' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 22, height: 22, flex: 'none', borderRadius: shape === 'circle' ? '50%' : 4, border: '1.5px solid var(--nile)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: sel ? 'var(--nile)' : 'transparent', transition: 'background 200ms',
      }}
    >
      {sel && <Dots size={4} gap={2} />}
    </div>
  );
}

export const muted: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted-on-light)' };
