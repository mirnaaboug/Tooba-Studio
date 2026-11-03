import {
  BUDGETS, LANGS, SMAP, STAGES, TIMELINES, addDays, eqSet, fmtDate, phasePackage, pricing, reasonsFor, recommend,
} from './data';
import type { OnboardingState } from './state';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

const HINTS: Record<number, string> = {
  1: 'Name and industry to continue', 2: 'Pick one to continue', 3: 'Choose at least one service',
  4: 'Pick a start and a budget', 5: 'Pick one to continue', 6: 'Name and a valid email', 7: 'Nothing is charged today',
};

/** Everything the screens compute from the raw answers. */
export function derive(st: OnboardingState, today: Date) {
  const rec = recommend(st.stage, st.industry);
  const pr = pricing(st.sel);
  const recActive = st.sel.length > 0 && eqSet(st.sel, rec.ids);
  const reasons = reasonsFor(st.stage, st.industry, rec);

  const tl = TIMELINES.find((x) => x.id === st.timeline);
  const startD = addDays(today, tl ? tl.offset : 3);
  const flex = tl?.id === 'flex';
  const dates = {
    brief: fmtDate(addDays(today, 2)),
    start: flex ? 'To agree' : fmtDate(startD),
    end: flex ? `${pr.days} days from start` : fmtDate(addDays(startD, pr.days)),
    key: (st.timeline || '') + pr.days,
  };

  const bud = BUDGETS.find((b) => b.id === st.budget);
  const overBudget = !!(bud && st.sel.length && pr.price > bud.max);
  const phase = phasePackage(bud ? bud.max : 0, st.stage);

  const emailOk = EMAIL_RE.test(st.contact.email);
  const canNext = !!({
    1: st.biz.name.trim() && st.industry,
    2: st.stage,
    3: st.sel.length > 0,
    4: st.timeline && st.budget,
    5: st.lang,
    6: st.contact.name.trim() && emailOk,
    7: true,
  } as Record<number, unknown>)[st.step];

  const stageL = STAGES.find((x) => x.id === st.stage);
  const langL = LANGS.find((x) => x.id === st.lang);
  const review = [
    { label: 'Business', value: st.biz.name || '—', sub: [st.industry, st.biz.city].filter(Boolean).join(' · '), to: 1 },
    { label: 'Stage', value: stageL ? stageL.label : '—', sub: stageL ? stageL.desc : '', to: 2 },
    { label: 'Services', value: pr.name, sub: st.sel.map((id) => SMAP[id].name).join(', '), to: 3 },
    { label: 'Timeline', value: tl ? tl.label : '—', sub: 'Delivery ' + dates.end, to: 4 },
    { label: 'Budget', value: bud ? bud.label : '—', sub: overBudget ? 'Selection is above this range' : 'Selection fits this range', to: 4 },
    { label: 'Language', value: langL ? langL.label : '—', sub: langL ? langL.desc : '', to: 5 },
    { label: 'Contact', value: st.contact.name + (st.contact.role ? ', ' + st.contact.role : ''), sub: [st.contact.email, st.channel].filter(Boolean).join(' · '), to: 6 },
  ] as const;

  return {
    rec, pr, recActive, reasons, tl, dates, overBudget, phase, emailOk, canNext, review,
    hint: HINTS[st.step] ?? '',
    emailError: st.contact.email && !emailOk ? 'That email looks incomplete.' : undefined,
  };
}

export type Derived = ReturnType<typeof derive>;
