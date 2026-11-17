import type { IconName } from '../ds/components';

// Approved Tooba packages & pricing (17 Oct 2026). Keep in sync with the
// `offerings` table in Supabase (supabase/migrations/001_tooba_schema.sql).

export type ServiceId =
  | 'strategy' | 'naming' | 'identity' | 'typography' | 'color' | 'brandbook' | 'motion' | 'packaging' | 'social';

/** `from`: the package a service is first included in. `addon`: price when bought on top of a package. */
export interface Service {
  id: ServiceId; name: string; icon: IconName; desc: string;
  from?: 'brick' | 'house' | 'landmark';
  addon?: { price: number; isFrom?: boolean; unit?: string };
}

export const SERVICES: Service[] = [
  { id: 'strategy', name: 'Strategy', icon: 'strategy', from: 'brick', desc: 'Positioning, audience, voice. A short brief in Brick, full strategy from House.' },
  { id: 'naming', name: 'Naming', icon: 'naming', from: 'landmark', addon: { price: 15000 }, desc: 'A name that works in Arabic and English.' },
  { id: 'identity', name: 'Identity', icon: 'identity', from: 'brick', desc: 'Logo system, redrawn as clean vector you own.' },
  { id: 'typography', name: 'Typography', icon: 'typography', from: 'brick', desc: 'Type pairing and hierarchy, Arabic and English.' },
  { id: 'color', name: 'Color', icon: 'color', from: 'brick', desc: 'A palette with rules for use.' },
  { id: 'brandbook', name: 'Brand book', icon: 'brand-book', from: 'house', desc: 'The 25+ page guidelines your team follows.' },
  { id: 'motion', name: 'Logo animation', icon: 'motion', from: 'landmark', addon: { price: 8000 }, desc: 'Your mark in motion, for reels, stories and screens.' },
  { id: 'packaging', name: 'Packaging', icon: 'packaging', addon: { price: 10000, isFrom: true, unit: 'per SKU' }, desc: 'Boxes, labels, bags, stickers.' },
  { id: 'social', name: 'Social', icon: 'social', from: 'brick', desc: 'Profile and post templates for launch.' },
];
export const SMAP = Object.fromEntries(SERVICES.map((s) => [s.id, s])) as Record<ServiceId, Service>;
export const isServiceId = (id: string): id is ServiceId => id in SMAP;

/** `days` are calendar days, used for the delivery date. */
export interface Pkg { id: string; name: string; ids: ServiceId[]; price: number; days: number; isFrom?: boolean; tag?: string }
const CORE: ServiceId[] = ['strategy', 'identity', 'typography', 'color', 'social'];
export const PKGS: Pkg[] = [
  { id: 'brick', name: 'Brick', ids: [...CORE], price: 25000, days: 9, tag: '7 working days' },
  { id: 'house', name: 'House', ids: [...CORE, 'brandbook'], price: 60000, days: 19, tag: '12–15 working days' },
  { id: 'landmark', name: 'Landmark', ids: [...CORE, 'naming', 'brandbook', 'motion'], price: 120000, days: 28, isFrom: true, tag: '3–4 weeks' },
];
const PMAP = Object.fromEntries(PKGS.map((p) => [p.id, p])) as Record<string, Pkg>;

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
  { id: 'b1', label: 'Under EGP 40k', max: 40000 },
  { id: 'b2', label: 'EGP 40k – 100k', max: 100000 },
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

/** "EGP 60,000" or "from EGP 120,000". */
export const priceLabel = (x: { price: number; isFrom?: boolean }) => (x.isFrom ? 'from ' : '') + egp(x.price);

export interface Line { label: string; price: number; isFrom?: boolean; unit?: string }
export interface Pricing { name: string; price: number; days: number; isFrom: boolean; pkg: Pkg | null; lines: Line[] }

/** Cheapest way to deliver a selection: a package plus add-ons for anything it doesn't include. */
export function pricing(sel: ServiceId[]): Pricing {
  const valid = sel.filter(isServiceId);
  const options = PKGS
    .filter((p) => valid.every((id) => p.ids.includes(id) || SMAP[id].addon))
    .map((p) => {
      const extras = valid.filter((id) => !p.ids.includes(id));
      return { p, extras, price: p.price + extras.reduce((a, id) => a + SMAP[id].addon!.price, 0) };
    })
    // Cheapest first; on a tie, the bigger package.
    // A package picked as a whole stays that package (Landmark includes more than these cards show);
    // otherwise cheapest first, and on a tie the bigger package.
    .sort((a, b) => Number(eqSet(b.p.ids, valid)) - Number(eqSet(a.p.ids, valid)) || a.price - b.price || b.p.price - a.p.price);
  const best = valid.some((id) => !SMAP[id].addon) ? options[0] : undefined;
  if (!best) {
    // Only add-ons picked (e.g. naming for an existing brand).
    const lines = valid.map((id) => ({ label: SMAP[id].name, ...SMAP[id].addon! }));
    return {
      name: 'Custom selection', price: lines.reduce((a, l) => a + l.price, 0), days: 5 + valid.length * 2,
      isFrom: lines.some((l) => l.isFrom), pkg: null, lines,
    };
  }
  const { p, extras, price } = best;
  const lines: Line[] = [
    { label: `${p.name} package`, price: p.price, isFrom: p.isFrom },
    ...extras.map((id) => ({ label: SMAP[id].name, ...SMAP[id].addon! })),
  ];
  return {
    name: [p.name, ...extras.map((id) => SMAP[id].name)].join(' + '),
    price, days: p.days + extras.length * 2, isFrom: lines.some((l) => l.isFrom), pkg: p, lines,
  };
}

/** A selection presented as a package card (used for the recommendation). */
function asPkg(ids: ServiceId[]): Pkg {
  const pr = pricing(ids);
  return { id: pr.name.toLowerCase().replace(/\W+/g, '-'), name: pr.name, ids, price: pr.price, days: pr.days, isFrom: pr.isFrom, tag: pr.pkg?.tag };
}

/** Recommended package from stage + industry (mirrors who each tier is for). */
export function recommend(stage: StageId | null, industry: string | null): Pkg {
  const base = industry === 'Hospitality' ? PMAP.landmark : industry === 'Tech & apps' && stage === 'named' ? PMAP.brick : PMAP.house;
  if (stage === 'new' && !base.ids.includes('naming')) return asPkg([...base.ids, 'naming']);
  return base;
}

export function reasonsFor(stage: StageId | null, industry: string | null, rec: Pkg): string[] {
  const out: string[] = [];
  if (stage === 'rebrand') out.push('You already have customers who know you. Strategy decides what stays before anything changes.');
  else if (stage === 'new') out.push(rec.ids.includes('naming') && rec.id === 'landmark'
    ? "You don't have a name yet. Landmark includes naming, checked in Arabic and English."
    : "You don't have a name yet, so naming comes first. It's added to the package at EGP 15,000.");
  else out.push('You have a name. We start from strategy and build the identity around it.');
  if (industry === 'Hospitality') out.push('Hospitality needs the full system: launch applications, 16 icons and a logo animation come with Landmark.');
  else if (PRODUCT_IND.includes(industry ?? '')) out.push('You sell physical products. Packaging is priced per SKU, from EGP 10,000, so add it when you are ready.');
  else if (rec.id === 'brick') out.push('Brick gets you launched in 7 working days. Move up to House when the team grows.');
  else out.push('House includes a 25+ page brand book, so the identity stays consistent once your team uses it.');
  out.push(`${rec.isFrom ? `From ${egp(rec.price)}, fixed once we scope it in the brief` : `Fixed at ${egp(rec.price)}`}. Bilingual by default at no extra cost; 50% to start, the rest before final files.`);
  return out;
}

/** Largest package that fits the budget. */
export function phasePackage(budgetMax: number): Pkg {
  return [...PKGS].reverse().find((p) => p.price <= budgetMax) ?? PKGS[0];
}
