import { useMemo } from 'react';
import { derive } from './onboarding/derived';
import { Done, Sending } from './onboarding/Finish';
import { Flow } from './onboarding/Flow';
import { Landing } from './onboarding/Landing';
import { useOnboarding } from './onboarding/state';

// `?prices=off` hides every price (the prototype's "showPrices" tweak).
const SHOW_PRICES = new URLSearchParams(window.location.search).get('prices') !== 'off';

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

export default function App() {
  const ob = useOnboarding();
  const { st } = ob;
  const today = useMemo(startOfToday, []);
  const d = derive(st, today);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--oat)', color: 'var(--nile)', font: 'var(--type-body)' }}>
      {st.step === 0 && <Landing ob={ob} />}
      {st.step >= 1 && st.step <= 7 && <Flow ob={ob} d={d} showPrices={SHOW_PRICES} />}
      {st.step === 8 && <Sending sendI={st.sendI} />}
      {st.step === 9 && <Done ob={ob} d={d} />}
    </div>
  );
}
