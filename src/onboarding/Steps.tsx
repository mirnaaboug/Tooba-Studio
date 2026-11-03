import { Button, Dots, Eyebrow, Icon, Input } from '../ds/components';
import { BUDGETS, CHANNELS, LANGS, PKGS, SERVICES, SMAP, STAGES, TIMELINES, egp, eqSet } from './data';
import { BusinessFields } from './BusinessFields';
import type { Derived } from './derived';
import type { Onboarding } from './state';
import { Chip, ChipGroup, EASE, Marker, StepHeader, cardColors, enter, muted } from './ui';

export interface StepProps { ob: Onboarding; d: Derived; showPrices: boolean }

const col = (gap: number) => ({ display: 'flex', flexDirection: 'column' as const, gap });
const grid3 = (gap: number) => ({ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap });

/* ——— 01 · Your business ——— */
export function AboutStep({ ob }: StepProps) {
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="01 / 07 · Your business" title="Tell us what you're building." intro="A few lines is enough. We read every answer before we recommend anything." />
      <BusinessFields ob={ob} layout="wide" />
    </div>
  );
}

/* ——— 02 · Stage ——— */
export function StageStep({ ob }: StepProps) {
  const { st, patch } = ob;
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="02 / 07 · Stage" title="Where are you starting from?" intro="This decides where we lay the first brick." />
      <div role="radiogroup" aria-label="Stage" className="tb-grid-3" style={grid3(16)}>
        {STAGES.map((o, i) => {
          const sel = st.stage === o.id;
          const c = cardColors(sel);
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={sel}
              // Changing stage clears a selection made for the previous stage.
              onClick={() => patch((s) => ({ stage: o.id, sel: s.stage === o.id ? s.sel : [] }))}
              className="tb-opt tb-lift"
              style={{
                display: 'grid', gridTemplateColumns: '32px minmax(0,1fr) 22px', gap: 16, alignItems: 'start', padding: 20, borderRadius: 8, cursor: 'pointer',
                background: c.bg, border: `1.5px solid ${c.bd}`,
                transition: `border-color 200ms,background 200ms,transform 200ms ${EASE}`, animation: enter(400, i * 70),
              }}
            >
              <Icon name={o.icon} size={32} />
              <div style={col(4)}>
                <div style={{ font: '400 20px/1.2 var(--font-serif)' }}>{o.label}</div>
                <div style={muted}>{o.desc}</div>
              </div>
              <Marker sel={sel} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ——— 03 · Services ——— */
export function ServicesStep({ ob, d, showPrices }: StepProps) {
  const { st, patch } = ob;
  const { rec, pr, recActive, reasons } = d;
  const toggle = (id: (typeof SERVICES)[number]['id']) => patch((s) => ({
    // Keep the canonical service order regardless of click order.
    sel: s.sel.includes(id) ? s.sel.filter((x) => x !== id) : SERVICES.map((x) => x.id).filter((x) => s.sel.includes(x) || x === id),
  }));
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="03 / 07 · Services" title="Here's what we recommend, and why." intro="Take it as is, or add and remove services below. The price updates as you go." />

      <div className="tb-rec" style={{ background: 'var(--nile)', color: 'var(--oat)', borderRadius: 8, padding: 36, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 40, animation: enter(500, 80) }}>
        <div style={col(14)}>
          <Eyebrow accent>We recommend</Eyebrow>
          <div style={{ font: '400 40px/1.1 var(--font-serif)' }}>{rec.name}</div>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-muted-on-dark)' }}>{rec.ids.map((id) => SMAP[id].name).join(' · ')}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {showPrices && <span style={{ font: '400 28px/1 var(--font-sans)' }}>{egp(rec.price)}</span>}
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted-on-dark)' }}>{rec.days} days, start to finish</span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', minHeight: 44 }}>
            {recActive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: '500 12px/1 var(--font-sans)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', animation: 'tbFade 300ms both' }}>
                <Dots size={6} />
                Selected
              </div>
            ) : (
              <Button variant="primary" onClick={() => patch({ sel: rec.ids.slice() })}>Use this package</Button>
            )}
          </div>
        </div>
        <div className="tb-rec-why" style={{ ...col(16), borderLeft: '1px solid var(--line-on-dark)', paddingLeft: 40 }}>
          <Eyebrow tone="dark">Why</Eyebrow>
          {reasons.map((text, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px minmax(0,1fr)', gap: 12, alignItems: 'baseline', animation: enter(400, 200 + i * 90) }}>
              <span style={{ font: '500 12px/1 var(--font-sans)', letterSpacing: '.12em', color: 'var(--apricot)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ font: 'var(--type-body)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={col(14)}>
        <Eyebrow>Other packages</Eyebrow>
        <div className="tb-grid-3" style={grid3(12)}>
          {PKGS.filter((p) => p.id !== rec.id).map((p) => {
            const on = eqSet(p.ids, st.sel);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => patch({ sel: p.ids.slice() })}
                className="tb-opt tb-lift"
                style={{ ...col(6), padding: '18px 20px', borderRadius: 8, cursor: 'pointer', background: 'var(--white)', border: `1.5px solid ${on ? 'var(--nile)' : 'var(--line-on-light)'}`, transition: `border-color 200ms,transform 200ms ${EASE}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ font: '400 20px/1.2 var(--font-serif)' }}>{p.name}</span>
                  {on && <Dots size={5} />}
                </div>
                <span style={muted}>{(showPrices ? egp(p.price) + ' · ' : '') + p.days + ' days · ' + p.ids.length + ' services'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={col(14)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <Eyebrow>Customise</Eyebrow>
          <span style={muted}>{pr.pkg ? `Package price applies · you save ${egp(pr.sum - pr.price)}` : 'Custom selections are priced per service'}</span>
        </div>
        <div className="tb-grid-3" style={grid3(12)}>
          {SERVICES.map((o, i) => {
            const on = st.sel.includes(o.id);
            const c = cardColors(on);
            return (
              <button
                key={o.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(o.id)}
                className="tb-opt tb-press"
                style={{ ...col(14), padding: 20, borderRadius: 8, cursor: 'pointer', background: c.bg, border: `1.5px solid ${c.bd}`, transition: 'border-color 200ms,background 200ms,transform 120ms', animation: enter(360, 120 + i * 35) }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Icon name={o.icon} size={32} />
                  <Marker sel={on} shape="square" />
                </div>
                <div style={col(4)}>
                  <span style={{ font: '400 20px/1.2 var(--font-serif)' }}>{o.name}</span>
                  <span style={muted}>{o.desc}</span>
                </div>
                {showPrices && <span style={{ font: '500 13px/1 var(--font-sans)', marginTop: 'auto' }}>{egp(o.price)}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ——— 04 · Timeline & budget ——— */
export function TimelineStep({ ob, d }: StepProps) {
  const { st, patch } = ob;
  const { tl, dates, overBudget, phase, pr } = d;
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="04 / 07 · Timeline & budget" title="When do you need it?" intro={'We put real dates on it. Never "soon".'} />
      <div style={col(12)}>
        <Eyebrow>Start</Eyebrow>
        <div role="radiogroup" aria-label="Start" className="tb-grid-3" style={grid3(12)}>
          {TIMELINES.map((o) => {
            const sel = st.timeline === o.id;
            const c = cardColors(sel);
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={sel}
                onClick={() => patch({ timeline: o.id })}
                className="tb-opt tb-lift"
                style={{ ...col(8), padding: '20px 22px', borderRadius: 8, cursor: 'pointer', background: c.bg, border: `1.5px solid ${c.bd}`, transition: `border-color 200ms,background 200ms,transform 200ms ${EASE}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ font: '400 20px/1.2 var(--font-serif)' }}>{o.label}</span>
                  {sel && <Dots size={5} />}
                </div>
                <span style={muted}>{o.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tl && (
        <div style={{ background: 'var(--papyrus)', borderRadius: 8, padding: 28, ...col(20), animation: enter(400) }}>
          <div style={{ position: 'relative', height: 2, background: 'rgba(18,63,59,.18)' }}>
            <div key={dates.key} style={{ position: 'absolute', inset: 0, background: 'var(--nile)', transformOrigin: 'left', animation: `tbGrow 900ms both ${EASE}` }} />
          </div>
          <div className="tb-grid-3" style={grid3(24)}>
            {[['Strategy brief', dates.brief], ['Work starts', dates.start], ['Delivery', dates.end]].map(([label, value]) => (
              <div key={label} style={col(8)}>
                <Eyebrow>{label}</Eyebrow>
                <span style={{ font: '400 22px/1.2 var(--font-serif)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={col(12)}>
        <ChipGroup label="Budget you have in mind">
          {BUDGETS.map((o) => <Chip key={o.id} label={o.label} sel={st.budget === o.id} onPick={() => patch({ budget: o.id })} />)}
        </ChipGroup>
        {overBudget && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap', background: 'var(--white)', border: '1.5px solid var(--line-on-light)', borderRadius: 8, padding: '20px 24px', marginTop: 8, animation: enter(300) }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Dots size={6} style={{ marginTop: 8 }} />
              <div style={col(4)}>
                <span style={{ font: '400 18px/1.3 var(--font-serif)' }}>Your selection is {egp(pr.price)}, above this range.</span>
                <span style={muted}>We can phase it: start with {phase.name} ({egp(phase.price)}) and add the rest when you're ready.</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => patch({ sel: phase.ids.slice() })}>Switch to {phase.name}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ——— 05 · Language ——— */
export function LanguageStep({ ob }: StepProps) {
  const { st, patch } = ob;
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="05 / 07 · Language" title="Who will read your brand?" intro="Arabic is written, not translated. Egyptian colloquial for social, Modern Standard for proposals." />
      <div role="radiogroup" aria-label="Language" className="tb-grid-3" style={grid3(16)}>
        {LANGS.map((o, i) => {
          const sel = st.lang === o.id;
          const c = cardColors(sel);
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => patch({ lang: o.id })}
              className="tb-opt tb-lift"
              style={{ ...col(16), padding: '28px 24px', borderRadius: 8, cursor: 'pointer', background: c.bg, border: `1.5px solid ${c.bd}`, minHeight: 230, transition: `border-color 200ms,background 200ms,transform 200ms ${EASE}`, animation: enter(400, i * 70) }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span lang={o.id === 'ar' ? 'ar' : undefined} style={{ font: '400 40px/1 var(--font-serif)' }}>{o.glyph}</span>
                {sel && <Dots size={6} />}
              </div>
              <span style={{ font: '400 24px/1.2 var(--font-serif)' }}>{o.label}</span>
              <span style={{ font: 'var(--type-body)', color: 'var(--text-muted-on-light)', marginTop: 'auto' }}>{o.desc}</span>
              {o.id === 'both' && (
                <span style={{ alignSelf: 'flex-start', font: '500 11px/1 var(--font-sans)', letterSpacing: '.18em', textTransform: 'uppercase', background: 'var(--papyrus)', padding: '6px 8px', borderRadius: 4 }}>Recommended</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ——— 06 · Contact details ——— */
export function ContactStep({ ob, d }: StepProps) {
  const { st, patch } = ob;
  const setC = (k: keyof typeof st.contact) => (v: string) => patch((s) => ({ contact: { ...s.contact, [k]: v } }));
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="06 / 07 · Contact details" title="Where should the brief land?" intro="One person, one channel. We'll keep it that simple." />
      <div className="tb-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24, maxWidth: 760 }}>
        <Input label="Your name" placeholder="Full name" value={st.contact.name} onChange={setC('name')} autoComplete="name" />
        <Input label="Role" placeholder="e.g. Founder" value={st.contact.role} onChange={setC('role')} autoComplete="organization-title" />
        <Input label="Email" type="email" placeholder="you@company.com" value={st.contact.email} onChange={setC('email')} error={d.emailError} autoComplete="email" />
        <Input label="Phone" type="tel" placeholder="+20" value={st.contact.phone} onChange={setC('phone')} autoComplete="tel" />
      </div>
      <ChipGroup label="Best way to reach you" style={{ maxWidth: 760 }}>
        {CHANNELS.map((l) => <Chip key={l} label={l} sel={st.channel === l} onPick={() => patch({ channel: l })} />)}
      </ChipGroup>
    </div>
  );
}

/* ——— 07 · Review ——— */
export function ReviewStep({ ob, d, showPrices }: StepProps) {
  const { st, go } = ob;
  const { pr, review } = d;
  return (
    <div style={col(40)}>
      <StepHeader eyebrow="07 / 07 · Review" title="One last look before we start." intro="Nothing is charged today. Your dated quote arrives with the brief." />
      <div className="tb-review" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 32, alignItems: 'start' }}>
        <div style={{ background: 'var(--white)', borderRadius: 8, border: '1.5px solid var(--line-on-light)' }}>
          {review.map((r, i) => (
            <div key={r.label} className="tb-review-row" style={{ display: 'grid', gridTemplateColumns: '140px minmax(0,1fr) auto', gap: 20, padding: '20px 24px', borderTop: i ? '1px solid var(--line-on-light)' : 'none', alignItems: 'baseline', animation: enter(360, i * 50) }}>
              <span style={{ font: '500 11px/1.4 var(--font-sans)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }}>{r.label}</span>
              <div style={col(2)}>
                <span style={{ font: 'var(--type-body)' }}>{r.value}</span>
                <span style={muted}>{r.sub}</span>
              </div>
              <a
                href={`#step-${r.to}`}
                onClick={(e) => { e.preventDefault(); go(r.to); }}
                aria-label={`Edit ${r.label.toLowerCase()}`}
                style={{ font: 'var(--type-caption)', cursor: 'pointer' }}
              >Edit</a>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--nile)', color: 'var(--oat)', borderRadius: 8, padding: 28, ...col(14), position: 'sticky', top: 0 }}>
          <Eyebrow tone="dark">Fixed price</Eyebrow>
          <div style={{ font: '400 28px/1.15 var(--font-serif)', marginBottom: 6 }}>{pr.name}</div>
          {st.sel.map((id) => (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, font: 'var(--type-caption)', color: 'var(--text-muted-on-dark)' }}>
              <span>{SMAP[id].name}</span>
              {showPrices && <span>{egp(SMAP[id].price)}</span>}
            </div>
          ))}
          {showPrices && pr.pkg && (
            <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-caption)' }}>
              <span>Package saving</span><span>− {egp(pr.sum - pr.price)}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--line-on-dark)', paddingTop: 16, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted-on-dark)' }}>{pr.days} days</span>
            {showPrices && <span style={{ font: '400 28px/1 var(--font-sans)' }}>{egp(pr.price)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
