import type { IconName } from '../ds/components';

// NOTE: every price and package below is a placeholder from the design
// prototype. Tooba still needs to confirm the real figures.

export type ServiceId =
  | 'strategy' | 'naming' | 'identity' | 'typography' | 'color' | 'brandbook' | 'packaging' | 'social' | 'rebrand';

export interface Service { id: ServiceId; name: string; icon: IconName; price: number; desc: string }

export const SERVICES: Service[] = [
  { id: 'strategy', name: 'Strategy', icon: 'strategy', price: 18000, desc: 'Positioning, audience, voice.' },
  { id: 'naming', name: 'Naming', icon: 'naming', price: 15000, desc: 'A name that works in Arabic and English.' },
  { id: 'identity', name: 'Identity', icon: 'identity', price: 28000, desc: 'Logo, mark and lockups, redrawn as clean vector.' },
  { id: 'typography', name: 'Typography', icon: 'typography', price: 8000, desc: 'Type pairing and hierarchy.' },
  { id: 'color', name: 'Color', icon: 'color', price: 6000, desc: 'A palette with rules for use.' },
  { id: 'brandbook', name: 'Brand book', icon: 'brand-book', price: 14000, desc: 'The guidelines your team follows.' },
  { id: 'packaging', name: 'Packaging', icon: 'packaging', price: 22000, desc: 'Boxes, labels, bags, stickers.' },
  { id: 'social', name: 'Social', icon: 'social', price: 12000, desc: 'Post and story templates, launch set.' },
  { id: 'rebrand', name: 'Rebrand audit', icon: 'rebrand', price: 30000, desc: 'What to keep, what to change, how to switch.' },
];
export const SMAP = Object.fromEntries(SERVICES.map((s) => [s.id, s])) as Record<ServiceId, Service>;

export interface Pkg { id: string; name: string; ids: ServiceId[]; price: number; days: number }
export const PKGS: Pkg[] = [
  { id: 'foundation', name: 'Foundation', ids: ['strategy', 'identity', 'typography', 'color'], price: 52000, days: 9 },
  { id: 'full', name: 'Full identity', ids: ['strategy', 'naming', 'identity', 'typography', 'color', 'brandbook'], price: 76000, days: 14 },
  { id: 'launch', name: 'Launch ready', ids: ['strategy', 'identity', 'typography', 'color', 'brandbook', 'packaging', 'social'], price: 92000, days: 21 },
  { id: 'rebrand', name: 'Rebrand', ids: ['rebrand', 'strategy', 'identity', 'typography', 'color', 'brandbook'], price: 88000, days: 16 },
];

export const INDUSTRIES = ['Hospitality', 'Food & beverage', 'Retail & products', 'Tech & apps', 'Professional services', 'Other'];
export const PRODUCT_IND = ['Food & beverage', 'Retail & products'];

export type StageId = 'new' | 'named' | 'rebrand';
export const STAGES: { id: StageId; label: string; icon: IconName; desc: string }[] = [
  { id: 'new', label: 'Starting from scratch', icon: 'naming', desc: 'No name yet, no identity. We build both.' },
  { id: 'named', label: 'I have a name', icon: 'identity', desc: 'We build the identity around it.' },
  { id: 'rebrand', label: 'Rebranding', icon: 'rebrand', desc: 'You have a brand that no longer fits.' },
];

export type TimelineId = 'asap' | 'month' | 'flex';
export const TIMELINES: { id: TimelineId; label: string; desc: string; offset: number }[] = [
  { id: 'asap', label: 'As soon as possible', desc: 'We start three days from today.', offset: 3 },
  { id: 'month', label: 'Within a month', desc: 'We start in two weeks.', offset: 14 },
  { id: 'flex', label: 'Flexible', desc: "We'll agree a start date together.", offset: 30 },
];

export type BudgetId = 'b1' | 'b2' | 'b3';
export const BUDGETS: { id: BudgetId; label: string; max: number }[] = [
  { id: 'b1', label: 'Under EGP 60k', max: 60000 },
  { id: 'b2', label: 'EGP 60k – 100k', max: 100000 },
  { id: 'b3', label: 'EGP 100k +', max: Infinity },
];

export type LangId = 'en' | 'ar' | 'both';
export const LANGS: { id: LangId; glyph: string; label: string; desc: string }[] = [
  { id: 'en', glyph: 'Aa', label: 'English', desc: 'One language, for an international audience.' },
  { id: 'ar', glyph: 'ع', label: 'Arabic', desc: 'Written for an Egyptian and Gulf audience.' },
  { id: 'both', glyph: 'Aa ع', label: 'Both', desc: 'Bilingual by default, every piece in both. No extra cost.' },
];

export const CHANNELS = ['WhatsApp', 'Email', 'Phone call'];
export const RAIL = ['Your business', 'Stage', 'Services', 'Timeline & budget', 'Language', 'Contact details', 'Review'];

/* ——— helpers ——— */
export const egp = (n: number) => 'EGP ' + n.toLocaleString('en-US');
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
export const eqSet = <T,>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x));

/** Recommended package from stage + industry. */
export function recommend(stage: StageId | null, industry: string | null): Pkg {
  if (stage === 'rebrand') return PKGS[3];
  if (stage === 'named') return PRODUCT_IND.includes(industry ?? '') ? PKGS[2] : PKGS[0];
  return PKGS[1];
}

export interface Pricing { name: string; price: number; sum: number; days: number; pkg: Pkg | null }

/** Package price applies only when the selection exactly matches a package. */
export function pricing(sel: ServiceId[]): Pricing {
  const pkg = PKGS.find((p) => eqSet(p.ids, sel)) ?? null;
  const sum = sel.reduce((a, id) => a + SMAP[id].price, 0);
  if (pkg) return { name: pkg.name, price: pkg.price, sum, days: pkg.days, pkg };
  return { name: 'Custom selection', price: sum, sum, days: Math.max(5, 3 + sel.length * 2), pkg: null };
}

export function reasonsFor(stage: StageId | null, industry: string | null, rec: Pkg): string[] {
  const product = PRODUCT_IND.includes(industry ?? '');
  const out: string[] = [];
  if (stage === 'rebrand') out.push('You already have equity in a name and customers. The audit decides what stays before anything changes.');
  else if (stage === 'new') out.push("You don't have a name yet, so naming comes first. Everything else is built on it.");
  else out.push('You have a name. We start from strategy and build the identity around it.');
  if (product && stage === 'named') out.push('You sell physical products. Packaging and a launch social set are where customers meet you first.');
  else out.push('A brand book keeps the identity consistent once your team starts using it.');
  const sum = rec.ids.reduce((a, id) => a + SMAP[id].price, 0);
  out.push(`Fixed at ${egp(rec.price)}, ${egp(sum - rec.price)} less than booking each service alone.`);
  return out;
}

/** Largest package that fits the budget; prefers Rebrand when rebranding. */
export function phasePackage(budgetMax: number, stage: StageId | null): Pkg {
  const fits = PKGS.filter((p) => p.price <= budgetMax).sort((a, b) => b.price - a.price);
  return (stage === 'rebrand' ? fits.find((p) => p.id === 'rebrand') : undefined)
    ?? fits.find((p) => p.id !== 'rebrand')
    ?? PKGS[0];
}
