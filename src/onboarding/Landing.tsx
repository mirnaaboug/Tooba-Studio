import { useRef } from 'react';
import { Button, Dots, Eyebrow, Icon, Logo, PatternSurface, type IconName } from '../ds/components';
import { BrickStream } from './BrickStream';
import { BusinessFields } from './BusinessFields';
import type { Onboarding, Step } from './state';
import { enter, muted } from './ui';

const PROMISES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'speed', title: 'A brief in 48 hours', body: 'In writing, two days after you send this.' },
  { icon: 'proposal', title: 'Fixed prices', body: 'Every package priced up front, every quote dated.' },
  { icon: 'identity', title: 'Three creative routes', body: 'Three distinct directions. You pick one.' },
];

export function Landing({ ob }: { ob: Onboarding }) {
  const { st, go } = ob;
  const landingRef = useRef<HTMLElement>(null);
  const ready = !!(st.biz.name.trim() && st.industry);

  const scrollToStart = () => {
    const el = landingRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'var(--oat)' }}>
      {/* ——— Hero: interactive brick stream ——— */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 600, background: 'var(--nile)', overflow: 'hidden' }}>
        <BrickStream style={{ touchAction: 'pan-y' }} />
        <header className="tb-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'var(--nile)', animation: 'tbFade 500ms 200ms both' }}>
          <Logo color="oat" height={40} />
          <Button variant="outline" tone="dark" size="sm" onClick={scrollToStart}>Start your project</Button>
        </header>
        <div className="tb-hero-card" style={{ position: 'absolute', left: 40, bottom: 40, maxWidth: 780, background: 'var(--nile)', color: 'var(--oat)', borderRadius: 8, padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 18, animation: enter(800, 900) }}>
          <Eyebrow accent>Tooba Studio · Cairo</Eyebrow>
          <h1 className="tb-hero-title" style={{ font: '400 72px/1.02 var(--font-serif)', letterSpacing: '-.01em', margin: 0, textWrap: 'pretty' }}>Every brand starts with a brick.</h1>
          <p style={{ font: 'var(--type-intro)', margin: 0, color: 'var(--text-muted-on-dark)', maxWidth: '44ch' }}>
            Strategic, bilingual brand identities in days, not months. Grab a brick and throw it, or click to lay more.
          </p>
        </div>
        <button
          type="button"
          onClick={scrollToStart}
          className="tb-opt tb-cue"
          style={{ position: 'absolute', right: 40, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: 'var(--nile)', color: 'var(--oat)', border: 'none', borderRadius: 8, padding: '18px 18px 16px', cursor: 'pointer', animation: enter(700, 1400) }}
        >
          <span style={{ font: '500 11px/1 var(--font-sans)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll to start</span>
          <div style={{ animation: 'tbNudge 1600ms ease-in-out infinite' }}>
            <Dots size={6} vertical />
          </div>
        </button>
      </section>

      {/* ——— Step 1, inline ——— */}
      <section ref={landingRef} className="tb-landing" style={{ maxWidth: 1240, margin: '0 auto', padding: '112px 64px 120px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 80, alignItems: 'start' }}>
        <div className="tb-landing-intro" style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 48 }}>
          <Eyebrow>01 / 07 · Your business</Eyebrow>
          <h2 style={{ font: '400 56px/1.05 var(--font-serif)', letterSpacing: '-.01em', margin: 0, textWrap: 'pretty' }}>Let's start with you.</h2>
          <p style={{ font: 'var(--type-intro)', margin: 0, color: 'var(--text-muted-on-light)', maxWidth: '42ch' }}>
            Seven short steps, about four minutes. We'll recommend a fixed-price package, and your strategy brief lands within 48 hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line-on-light)', marginTop: 16 }}>
            {PROMISES.map((p) => (
              <div key={p.title} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr)', gap: 16, alignItems: 'center', padding: '18px 0', borderBottom: '1px solid var(--line-on-light)' }}>
                <Icon name={p.icon} size={32} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: '400 20px/1.2 var(--font-serif)' }}>{p.title}</span>
                  <span style={muted}>{p.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          className="tb-landing-form"
          onSubmit={(e) => { e.preventDefault(); if (ready) go(2); }}
          style={{ background: 'var(--white)', border: '1.5px solid var(--line-on-light)', borderRadius: 8, padding: 40, display: 'flex', flexDirection: 'column', gap: 28 }}
        >
          {st.hasSaved && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: 'var(--oat)', borderRadius: 8, padding: '14px 18px' }}>
              <span style={{ font: 'var(--type-caption)' }}>You've started before. Pick up where you left off?</span>
              <Button variant="secondary" size="sm" onClick={() => go(Math.min(st.maxStep, 7) as Step)}>Continue</Button>
            </div>
          )}
          <BusinessFields ob={ob} layout="stacked" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, borderTop: '1px solid var(--line-on-light)', paddingTop: 24 }}>
            <span style={muted}>{ready ? "Next: where you're starting from" : 'Name and industry to continue'}</span>
            <Button type="submit" variant="primary" size="lg" disabled={!ready}>Continue</Button>
          </div>
        </form>
      </section>

      <PatternSurface padding={0}><div style={{ height: 160 }} /></PatternSurface>
    </div>
  );
}
