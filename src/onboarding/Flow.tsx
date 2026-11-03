import { useEffect, useRef } from 'react';
import { Button, Dots, Eyebrow, Icon, Logo } from '../ds/components';
import { RAIL, egp } from './data';
import type { Step } from './state';
import { AboutStep, ContactStep, LanguageStep, ReviewStep, ServicesStep, StageStep, TimelineStep, type StepProps } from './Steps';
import { EASE, enter } from './ui';

const STEPS: Record<number, (p: StepProps) => React.JSX.Element> = {
  1: AboutStep, 2: StageStep, 3: ServicesStep, 4: TimelineStep, 5: LanguageStep, 6: ContactStep, 7: ReviewStep,
};

export function Flow({ ob, d, showPrices }: StepProps) {
  const { st, go, next, back, patch } = ob;
  const step = st.step;
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // New step: scroll to top and move focus to the step for keyboard / screen-reader users.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const StepView = STEPS[step];
  const { pr, canNext, hint } = d;
  const hasSel = st.sel.length > 0;
  const progress = Math.round(((Math.min(step, 7) - 1) / 7) * 100 + 100 / 7) + '%';
  const nextLabel = step === 7 ? 'Send to Tooba' : step === 2 && st.stage ? 'See our recommendation' : 'Continue';

  return (
    <div className="tb-flow" style={{ display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', height: '100vh' }}>
      <aside className="tb-rail-aside" style={{ background: 'var(--nile)', color: 'var(--oat)', display: 'flex', flexDirection: 'column', padding: '40px 28px', gap: 48, overflow: 'auto', animation: 'tbFade 400ms both' }}>
        <button type="button" onClick={() => patch({ step: 0, hasSaved: true })} aria-label="Back to the start page" className="tb-opt" style={{ cursor: 'pointer', display: 'flex', padding: '0 8px', background: 'none', border: 'none' }}>
          <Logo color="oat" height={44} />
        </button>
        <nav aria-label="Steps" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {RAIL.map((label, i) => {
            const n = i + 1, active = n === step, done = n < step, reach = n <= st.maxStep;
            return (
              <button
                key={label}
                type="button"
                disabled={!reach}
                aria-current={active ? 'step' : undefined}
                onClick={() => reach && go(n as Step)}
                className={'tb-opt' + (reach ? ' tb-rail' : '')}
                style={{
                  display: 'grid', gridTemplateColumns: '28px minmax(0,1fr) auto', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8,
                  cursor: reach ? 'pointer' : 'default', background: active ? 'var(--nile-step)' : 'transparent', color: 'var(--oat)', border: 'none',
                  opacity: active || reach ? 1 : 0.5, transition: `background 200ms ${EASE},opacity 200ms`,
                }}
              >
                <span style={{ font: '500 12px/1 var(--font-sans)', letterSpacing: '.12em' }}>{String(n).padStart(2, '0')}</span>
                <span style={{ font: '400 15px/1.3 var(--font-sans)' }}>{label}</span>
                {active && <Dots size={6} />}
                {done && <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted-on-dark)' }}>Done</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--line-on-dark)', padding: '24px 8px 0' }}>
          {hasSel ? (
            <div key={st.sel.join(',')} aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: enter(260) }}>
              <Eyebrow tone="dark">Your selection</Eyebrow>
              <div style={{ font: '400 24px/1.2 var(--font-serif)' }}>{pr.name}</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted-on-dark)' }}>
                {st.sel.length + (st.sel.length === 1 ? ' service' : ' services')} · {pr.days} days
              </div>
              {showPrices && <div style={{ font: '400 20px/1.2 var(--font-sans)', marginTop: 4 }}>{egp(pr.price)}</div>}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Icon name="chat" tone="dark" size={24} />
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted-on-dark)' }}>Questions first? Message us on WhatsApp. We reply within the working day.</div>
            </div>
          )}
        </div>
      </aside>

      <main className="tb-main" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh' }}>
        <div role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step} style={{ height: 3, background: 'var(--oat-step)', flex: 'none' }}>
          <div style={{ height: 3, background: 'var(--nile)', width: progress, transition: `width 400ms ${EASE}` }} />
        </div>
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto' }}>
          <div
            key={step}
            ref={headingRef}
            tabIndex={-1}
            className="tb-step"
            style={{ maxWidth: 1040, padding: '64px 80px 56px', display: 'flex', flexDirection: 'column', gap: 40, outline: 'none', animation: enter(320) }}
          >
            {StepView && <StepView ob={ob} d={d} showPrices={showPrices} />}
          </div>
        </div>
        <footer className="tb-foot" style={{ flex: 'none', borderTop: '1px solid var(--line-on-light)', padding: '18px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, background: 'var(--oat)' }}>
          <Button variant="ghost" onClick={back}>Back</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted-on-light)' }}>
              {canNext ? (step === 7 ? hint : `Step ${step} of 7`) : hint}
            </span>
            <Button variant={step === 7 ? 'primary' : 'secondary'} disabled={!canNext} onClick={next}>{nextLabel}</Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
