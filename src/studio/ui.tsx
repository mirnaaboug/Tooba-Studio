import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Dots } from '../ds/components';
import type { Currency } from './types';

/* ——— Routing (history API, everything under /studio) ——— */
const listeners = new Set<() => void>();
window.addEventListener('popstate', () => listeners.forEach((fn) => fn()));

export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, '', to);
  window.scrollTo(0, 0);
  listeners.forEach((fn) => fn());
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const fn = () => setPath(window.location.pathname);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return path;
}

export function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <a href={to} className={className} onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    }}>{children}</a>
  );
}

/* ——— Data loading ——— */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    setError(null);
    fn().then((d) => { if (live) setData(d); }).catch((e: unknown) => { if (live) setError(msg(e)); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, reload };
}

/** Runs an async action with a busy flag and an error message. */
export function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setBusy(true); setError(null);
    try { await fn(); return true; } catch (e) { setError(msg(e)); return false; } finally { setBusy(false); }
  }, []);
  return { busy, error, run, setError };
}

export const msg = (e: unknown) => (e instanceof Error ? e.message : String(e));

/* ——— Formatting ——— */
export const label = (s: string | null | undefined) => (s ? (s.charAt(0).toUpperCase() + s.slice(1)).replace(/_/g, ' ') : '—');

export function money(n: number | null | undefined, cur: Currency | null | undefined = 'EGP') {
  if (n == null) return '—';
  const v = Number(n);
  return cur === 'USD' ? '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'EGP ' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function day(s: string | null | undefined) {
  if (!s) return '—';
  const d = new Date(s.length === 10 ? s + 'T00:00:00' : s);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function when(s: string) {
  const d = new Date(s);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export const today = () => new Date().toISOString().slice(0, 10);

/* ——— Layout pieces ——— */
export function PageHead({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="st-pagehead">
      <div>
        {eyebrow && <div className="st-eyebrow"><Dots size={5} /> {eyebrow}</div>}
        <h1>{title}</h1>
      </div>
      {children && <div className="st-actions">{children}</div>}
    </header>
  );
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="st-section">
      <div className="st-section-head"><h2>{title}</h2>{aside}</div>
      {children}
    </section>
  );
}

export function Field({ label: l, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={'st-field' + (wide ? ' st-wide' : '')}>
      <span>{l}</span>
      {children}
    </label>
  );
}

export function Btn({ children, onClick, kind = 'primary', type = 'button', disabled }: {
  children: ReactNode; onClick?: () => void; kind?: 'primary' | 'dark' | 'outline' | 'ghost' | 'danger'; type?: 'button' | 'submit'; disabled?: boolean;
}) {
  return <button type={type} className={`st-btn st-btn-${kind}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

export type Tone = 'nile' | 'apricot' | 'papyrus' | 'muted' | 'oat';
export function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`st-badge st-badge-${tone}`}>{children}</span>;
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <div className="st-error" role="alert"><span className="st-dot" />{children}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="st-empty">{children}</div>;
}

export function Loading() {
  return <div className="st-loading" aria-label="Loading"><span /><span /><span /></div>;
}

export function Stat({ n, l, tone }: { n: ReactNode; l: string; tone?: 'apricot' }) {
  return (
    <div className="st-stat">
      <div className={'st-stat-n' + (tone ? ' st-apricot' : '')}>{n}</div>
      <div className="st-stat-l">{l}</div>
    </div>
  );
}

export const stageTone = (s: string): Tone =>
  s === 'delivered' ? 'papyrus' : s === 'cancelled' ? 'muted' : s === 'on_hold' ? 'oat' : s === 'discovery' ? 'oat' : 'nile';

export const statusTone = (s: string): Tone =>
  ({ lead: 'apricot', qualified: 'nile', active: 'papyrus', past: 'oat', lost: 'muted' } as Record<string, Tone>)[s] ?? 'muted';
