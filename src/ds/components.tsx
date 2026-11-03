// Typed React ports of the Tooba Studio design-system primitives used by the
// onboarding flow (source: _ds_bundle.js → components/{actions,brand,forms}).
import { useState, type CSSProperties, type ReactNode, type ChangeEvent } from 'react';

/* ——— Button ——— */
const BTN_SIZES = { sm: { h: 36, px: 16, fs: 11 }, md: { h: 44, px: 22, fs: 12 }, lg: { h: 52, px: 28, fs: 13 } } as const;
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export function Button({
  children, variant = 'primary', size = 'md', tone = 'light', disabled = false, onClick, type = 'button', style,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: keyof typeof BTN_SIZES;
  tone?: 'light' | 'dark';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  const [down, setDown] = useState(false);
  const s = BTN_SIZES[size];
  const dark = tone === 'dark';
  const fg = dark ? 'var(--oat)' : 'var(--nile)';
  const tint = hov ? (dark ? 'rgba(241,231,214,.08)' : 'rgba(18,63,59,.06)') : 'transparent';
  const V = {
    primary: { bg: hov ? 'var(--apricot-press)' : 'var(--apricot)', fg: 'var(--nile)', bd: 'transparent' },
    secondary: dark
      ? { bg: hov ? 'var(--oat-step)' : 'var(--oat)', fg: 'var(--nile)', bd: 'transparent' }
      : { bg: hov ? 'var(--nile-step)' : 'var(--nile)', fg: 'var(--oat)', bd: 'transparent' },
    outline: { bg: tint, fg, bd: fg },
    ghost: { bg: tint, fg, bd: 'transparent' },
  }[variant];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        height: s.h, padding: `0 ${s.px}px`,
        font: `500 ${s.fs}px/1 var(--font-sans)`, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
        background: V.bg, color: V.fg, border: `1.5px solid ${V.bd}`, borderRadius: 'var(--radius-cell)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        transform: down && !disabled ? 'translateY(1px)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-standard),transform var(--dur-fast)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ——— Dots: the apricot pair ——— */
export function Dots({ size = 6, gap, color = 'var(--apricot)', vertical = false, style }: {
  size?: number; gap?: number; color?: string; vertical?: boolean; style?: CSSProperties;
}) {
  const d: CSSProperties = { width: size, height: size, borderRadius: '50%', background: color, flex: 'none' };
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', flexDirection: vertical ? 'column' : 'row', gap: gap ?? size, alignItems: 'center', verticalAlign: 'middle', ...style }}>
      <span style={d} />
      <span style={d} />
    </span>
  );
}

/* ——— Eyebrow ——— */
export function Eyebrow({ children, tone = 'light', accent = false, style }: {
  children: ReactNode; tone?: 'light' | 'dark'; accent?: boolean; style?: CSSProperties;
}) {
  const color = accent ? 'var(--apricot)' : tone === 'dark' ? 'var(--oat)' : 'var(--nile)';
  return (
    <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color, margin: 0, ...style }}>
      {children}
    </div>
  );
}

/* ——— Icon ——— */
export type IconName =
  | 'strategy' | 'naming' | 'identity' | 'typography' | 'color' | 'brand-book' | 'packaging' | 'social'
  | 'motion' | 'web' | 'photography' | 'rebrand' | 'speed' | 'chat' | 'location' | 'proposal';

export function Icon({ name, size = 24, tone = 'light', title, style }: {
  name: IconName; size?: 16 | 24 | 32 | 48; tone?: 'light' | 'dark'; title?: string; style?: CSSProperties;
}) {
  return (
    <span
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`tb-asset tb-icon-${name}-${tone === 'dark' ? 'oat' : 'nile'}`}
      style={{ display: 'inline-block', width: size, height: size, flex: 'none', ...style }}
    />
  );
}

/* ——— Logo (horizontal lockup only is used here) ——— */
const LOGO_RATIO = 644.24 / 190;
export function Logo({ color = 'nile', height = 56 }: { color?: 'nile' | 'oat' | 'oat-on-nile'; height?: number }) {
  const key = { nile: 'nile', 'oat-on-nile': 'oat-on-nile', oat: 'oat-transparent' }[color];
  return (
    <span
      role="img"
      aria-label="Tooba Studio"
      className={`tb-asset tb-logo-lockup-horizontal-${key}`}
      style={{ display: 'inline-block', width: height * LOGO_RATIO, height, flex: 'none' }}
    />
  );
}

/* ——— PatternSurface ——— */
export function PatternSurface({ children, tileSize = 240, padding = 'var(--space-7)', style }: {
  children?: ReactNode; tileSize?: number; padding?: string | number; style?: CSSProperties;
}) {
  return (
    <div className="tb-pattern" style={{ backgroundSize: `${tileSize}px ${tileSize}px`, color: 'var(--oat)', padding, ...style }}>
      {children}
    </div>
  );
}

/* ——— Input (single line or multiline) ——— */
export function Input({
  label, hint, error, multiline = false, rows = 4, value, onChange, placeholder, type = 'text', style, autoComplete,
}: {
  label: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  style?: CSSProperties;
  autoComplete?: string;
}) {
  const [f, setF] = useState(false);
  const id = 'tb-' + label.toLowerCase().replace(/\W+/g, '-');
  const fieldStyle: CSSProperties = {
    font: 'var(--type-body)', color: 'var(--nile)', background: 'var(--white)',
    border: '1.5px solid ' + (error ? 'var(--apricot)' : f ? 'var(--nile)' : 'var(--line-on-light)'),
    borderRadius: 'var(--radius-cell)', padding: multiline ? '12px 14px' : '0 14px',
    height: multiline ? undefined : 48, outline: 'none', resize: multiline ? 'vertical' : undefined,
    transition: 'border-color var(--dur-fast)', width: '100%',
  };
  const common = {
    id, value, placeholder, autoComplete,
    'aria-invalid': error ? true : undefined,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    style: fieldStyle,
  };
  return (
    <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, ...style }}>
      <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--nile)' }}>{label}</span>
      {multiline ? <textarea rows={rows} {...common} /> : <input type={type} {...common} />}
      {(error || hint) && (
        <span style={{ font: 'var(--type-caption)', color: error ? 'var(--nile)' : 'var(--text-muted-on-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {error && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--apricot)' }} />}
          {error || hint}
        </span>
      )}
    </label>
  );
}
