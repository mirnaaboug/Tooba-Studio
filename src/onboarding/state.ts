import { useCallback, useEffect, useRef, useState } from 'react';
import { PKGS, recommend, type BudgetId, type LangId, type ServiceId, type StageId, type TimelineId } from './data';

/** Steps: 0 welcome/landing · 1–7 flow · 8 sending · 9 done */
export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Answers {
  biz: { name: string; city: string; about: string };
  industry: string | null;
  stage: StageId | null;
  sel: ServiceId[];
  timeline: TimelineId | null;
  budget: BudgetId | null;
  lang: LangId | null;
  contact: { name: string; role: string; email: string; phone: string };
  channel: string;
  maxStep: number;
}

export interface OnboardingState extends Answers {
  step: Step;
  hasSaved: boolean;
  sendI: number;
  ref: string;
}

export const BLANK: Answers = {
  biz: { name: '', city: '', about: '' },
  industry: null, stage: null, sel: [], timeline: null, budget: null, lang: null,
  contact: { name: '', role: '', email: '', phone: '' },
  channel: 'WhatsApp', maxStep: 1,
};

const KEY = 'tooba-onboarding-v1';

const DEMO: Answers = {
  biz: { name: 'Sahel House', city: 'Cairo', about: 'A six-room guesthouse in Diplo.' },
  industry: 'Hospitality', stage: 'new', sel: PKGS[1].ids.slice(), timeline: 'asap', budget: 'b2', lang: 'both',
  contact: { name: 'Nour Hassan', role: 'Founder', email: 'nour@sahelhouse.com', phone: '+20 100 000 0000' },
  channel: 'WhatsApp', maxStep: 7,
};

function load(): Partial<Answers> | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

const newRef = () => 'TB-' + (2611000 + Math.floor(Math.random() * 999));

/** `?jump=services|review|confirmation` opens a screen with sample answers (preview aid). */
function initial(): OnboardingState {
  const saved = load();
  const base: OnboardingState = {
    ...BLANK, ...(saved || {}), step: 0, hasSaved: !!(saved && (saved.maxStep ?? 1) > 1), sendI: 0, ref: newRef(),
  };
  const jump = new URLSearchParams(window.location.search).get('jump');
  const jumpStep = ({ services: 3, review: 7, confirmation: 9 } as Record<string, Step>)[jump ?? ''];
  return jumpStep ? { ...base, ...DEMO, step: jumpStep } : base;
}

export function useOnboarding() {
  const [st, setSt] = useState<OnboardingState>(initial);
  const sendT = useRef<number | undefined>(undefined);

  // Persist answers (not transient UI state) on every change.
  useEffect(() => {
    const { step: _s, hasSaved: _h, sendI: _i, ref: _r, ...data } = st;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
  }, [st]);

  useEffect(() => () => window.clearInterval(sendT.current), []);

  const patch = useCallback((p: Partial<OnboardingState> | ((s: OnboardingState) => Partial<OnboardingState>)) => {
    setSt((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));
  }, []);

  const go = useCallback((step: Step) => patch((s) => ({ step, maxStep: Math.max(s.maxStep, step) })), [patch]);

  const send = useCallback(() => {
    patch({ step: 8, sendI: 0 });
    window.clearInterval(sendT.current);
    sendT.current = window.setInterval(() => {
      setSt((s) => {
        if (s.sendI >= 5) { window.clearInterval(sendT.current); return { ...s, step: 9 }; }
        return { ...s, sendI: s.sendI + 1 };
      });
    }, 260);
  }, [patch]);

  const next = useCallback(() => {
    if (st.step === 7) return send();
    // Moving from Stage to Services with nothing picked preselects the recommendation.
    if (st.step === 2 && st.sel.length === 0) patch({ sel: recommend(st.stage, st.industry).ids.slice() });
    go((st.step + 1) as Step);
  }, [st.step, st.sel.length, st.stage, st.industry, send, go, patch]);

  const back = useCallback(() => {
    if (st.step === 1) patch({ step: 0, hasSaved: true });
    else patch({ step: (st.step - 1) as Step });
  }, [st.step, patch]);

  const restart = useCallback(() => {
    window.clearInterval(sendT.current);
    setSt((s) => ({ ...s, ...BLANK, step: 1, hasSaved: false, ref: newRef() }));
  }, []);

  return { st, patch, go, next, back, restart };
}

export type Onboarding = ReturnType<typeof useOnboarding>;
