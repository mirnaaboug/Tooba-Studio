import { Button, Dots, Eyebrow, Logo } from '../ds/components';
import { BrickStream } from './BrickStream';
import type { Derived } from './derived';
import type { Onboarding } from './state';
import { EASE, enter, muted } from './ui';

/** "Laying the first brick": four bricks fill in, the last one apricot. */
export function Sending({ sendI }: { sendI: number }) {
  return (
    <div role="status" style={{ height: '100vh', background: 'var(--nile)', color: 'var(--oat)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, animation: 'tbFade 300ms both' }}>
      <div style={{ display: 'flex', gap: 10 }} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 44, height: 22, borderRadius: 6, background: i < sendI ? (i === 3 ? 'var(--apricot)' : 'var(--oat)') : 'var(--nile-step-2)', transition: `background 240ms ${EASE}` }} />
        ))}
      </div>
      <Eyebrow tone="dark">Laying the first brick</Eyebrow>
    </div>
  );
}

export function Done({ ob, d }: { ob: Onboarding; d: Derived }) {
  const { st, restart } = ob;
  const firstName = (st.contact.name.trim() || 'there').split(/\s+/)[0];
  const steps = [
    { num: '01', title: 'Strategy brief', when: 'By ' + d.dates.brief },
    { num: '02', title: 'Three creative routes', when: 'You pick one, we refine it' },
    { num: '03', title: 'Final delivery', when: d.dates.end },
  ];
  return (
    <div className="tb-done" style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--nile)', display: 'flex', alignItems: 'center', padding: '32px 56px' }}>
      <BrickStream cursor="pointer" />
      <div className="tb-done-card" style={{ position: 'relative', maxWidth: 700, width: '100%', maxHeight: '100%', overflow: 'auto', background: 'var(--oat)', borderRadius: 8, padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 24, animation: enter(700, 600) }}>
        <Logo color="nile" height={48} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, animation: enter(500, 100) }}>
            <Dots size={8} />
            <Eyebrow>Received · {st.ref}</Eyebrow>
          </div>
          <h1 style={{ font: '400 40px/1.1 var(--font-serif)', letterSpacing: '-.01em', margin: 0, textWrap: 'pretty', animation: enter(600, 250) }}>
            Thank you, {firstName}. Your strategy brief lands within 48 hours.
          </h1>
          <p style={{ font: 'var(--type-intro)', margin: 0, maxWidth: '50ch', animation: enter(600, 400) }}>
            We've sent a copy to {st.contact.email}. Expect it by {d.dates.brief}, with your dated quote for {d.pr.name}.
          </p>
        </div>
        <div className="tb-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 24, borderTop: '1px solid var(--line-on-light)', paddingTop: 24 }}>
          {steps.map((n, i) => (
            <div key={n.num} style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: enter(500, 600 + i * 120) }}>
              <span style={{ font: '500 12px/1 var(--font-sans)', letterSpacing: '.12em' }}>{n.num}</span>
              <span style={{ font: '400 20px/1.2 var(--font-serif)' }}>{n.title}</span>
              <span style={muted}>{n.when}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, animation: 'tbFade 500ms 1100ms both' }}>
          <Button variant="secondary" onClick={restart}>Start another project</Button>
        </div>
      </div>
    </div>
  );
}
