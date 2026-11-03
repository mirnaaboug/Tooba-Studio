import { Input } from '../ds/components';
import { INDUSTRIES } from './data';
import type { Onboarding } from './state';
import { Chip, ChipGroup } from './ui';

/** Business name, city, industry and one-liner. Shared by the landing form and step 1. */
export function BusinessFields({ ob, layout }: { ob: Onboarding; layout: 'stacked' | 'wide' }) {
  const { st, patch } = ob;
  const setBiz = (k: keyof typeof st.biz) => (v: string) => patch((s) => ({ biz: { ...s.biz, [k]: v } }));
  const wide = layout === 'wide';
  const nameCity = (
    <>
      <Input label="Business or working name" placeholder="e.g. Sahel House" value={st.biz.name} onChange={setBiz('name')} autoComplete="organization" />
      <Input label="City" placeholder="e.g. Cairo" value={st.biz.city} onChange={setBiz('city')} autoComplete="address-level2" />
    </>
  );
  return (
    <>
      {wide
        ? <div className="tb-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24, maxWidth: 760 }}>{nameCity}</div>
        : nameCity}
      <ChipGroup label="Industry" style={wide ? { maxWidth: 760 } : undefined}>
        {INDUSTRIES.map((l) => <Chip key={l} label={l} sel={st.industry === l} onPick={() => patch({ industry: l })} />)}
      </ChipGroup>
      <Input
        label="In a sentence, what do you do?"
        multiline
        rows={3}
        placeholder="e.g. A six-room guesthouse in Diplo, opening next summer."
        hint="Optional, but it sharpens our recommendation."
        value={st.biz.about}
        onChange={setBiz('about')}
        style={wide ? { maxWidth: 760 } : undefined}
      />
    </>
  );
}
