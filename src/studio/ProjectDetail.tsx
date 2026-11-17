import { useState, type FormEvent } from 'react';
import { db, storage } from '../lib/supabase';
import { describe } from './Activity';
import { useStudio } from './StudioApp';
import {
  DELIVERABLE_STATUSES, PAYMENT_KINDS, PIPELINE, QUOTE_STATUSES,
  type Client, type Currency, type Deliverable, type DeliverableStatus, type LogEntry, type Offering, type Payment,
  type PaymentKind, type Project, type ProjectOverview, type Quote, type QuoteItem, type QuoteStatus, type QuoteTotal,
  type Revision, type Route, type Stage,
} from './types';
import {
  Badge, Btn, day, Empty, ErrorNote, Field, Link, Loading, money, navigate, PageHead, Section, label, today, useAction, useLoad, when,
} from './ui';

const METHODS = ['InstaPay', 'Bank transfer', 'Vodafone Cash', 'Cash', 'Card', 'Other'];
const FILE_TYPES = ['logo', 'brand_book', 'social_templates', 'stationery', 'packaging', 'motion', 'photography', 'strategy_brief', 'other'];

async function loadAll(id: string) {
  const [[project], [overview], quotes, totals, routes, files] = await Promise.all([
    db.select<Project>('projects', `select=*&id=eq.${id}`),
    db.select<ProjectOverview>('project_overview', `select=*&project_id=eq.${id}`),
    db.select<Quote>('quotes', `select=*&project_id=eq.${id}&order=created_at.desc`),
    db.select<QuoteTotal>('quote_totals', `select=*&project_id=eq.${id}`),
    db.select<Route>('creative_routes', `select=*&project_id=eq.${id}&order=route_number`),
    db.select<Deliverable>('deliverables', `select=*&project_id=eq.${id}&order=created_at.desc`),
  ]);
  if (!project) return false as const;
  const qIds = quotes.map((q) => q.id);
  const rIds = routes.map((r) => r.id);
  const inList = (ids: string[]) => `(${ids.join(',')})`;
  const logOr = [
    `record_id.in.${inList([id, ...qIds, ...rIds])}`,
    `new_data->>project_id.eq.${id}`,
    `old_data->>project_id.eq.${id}`,
    ...(qIds.length ? [`new_data->>quote_id.in.${inList(qIds)}`] : []),
    ...(rIds.length ? [`new_data->>route_id.in.${inList(rIds)}`] : []),
  ].join(',');
  const [[client], items, payments, revisions, log] = await Promise.all([
    db.select<Client>('clients', `select=*&id=eq.${project.client_id}`),
    qIds.length ? db.select<QuoteItem>('quote_items', `select=*&quote_id=in.${inList(qIds)}&order=created_at`) : Promise.resolve([]),
    qIds.length ? db.select<Payment>('payments', `select=*&quote_id=in.${inList(qIds)}&order=paid_at`) : Promise.resolve([]),
    rIds.length ? db.select<Revision>('revisions', `select=*&route_id=in.${inList(rIds)}&order=round`) : Promise.resolve([]),
    db.select<LogEntry>('activity_log', `select=*&or=(${logOr})&order=id.desc&limit=30`),
  ]);
  return { project, overview, client, quotes, totals, items, payments, routes, revisions, files, log };
}
type Data = Exclude<Awaited<ReturnType<typeof loadAll>>, false>;

export function ProjectDetail({ id }: { id: string }) {
  const { data, error, reload } = useLoad(() => loadAll(id), [id]);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (data === null) return <Loading />;
  if (data === false) return <Empty>This project doesn't exist (or was deleted).</Empty>;
  return <Detail d={data} reload={reload} />;
}

function Detail({ d, reload }: { d: Data; reload: () => void }) {
  const { me, team, offerings } = useStudio();
  const { project: p, overview: ov, client } = d;
  const pkg = offerings.find((o) => o.id === p.package_id);
  const act = useAction();
  const names = Object.fromEntries(team.map((t) => [t.id, t.full_name || t.email || 'Someone']));

  const save = (patch: Partial<Project>) => act.run(async () => { await db.update('projects', `id=eq.${p.id}`, patch); reload(); });

  const moveTo = (stage: Stage) => {
    if (stage === p.stage) return;
    const started = !['discovery', 'on_hold', 'cancelled'].includes(stage);
    if (started && !ov?.deposit_cleared &&
        !window.confirm('The 50% deposit is not in yet. Our rule is no work before the deposit. Move the project anyway?')) return;
    save({ stage, ...(stage === 'delivered' ? { delivered_at: new Date().toISOString() } : {}) });
  };

  return (
    <>
      <div className="st-crumbs"><Link to="/studio/projects">Projects</Link> · <Link to={`/studio/clients/${client.id}`}>{client.name}</Link></div>
      <PageHead eyebrow={`${pkg?.name ?? 'Custom'}${p.is_rush ? ' · Rush' : ''}`} title={p.name} />

      <div className="st-stepper" role="group" aria-label="Stage">
        {PIPELINE.map((s, i) => {
          const at = PIPELINE.indexOf(p.stage);
          const state = s === p.stage ? 'on' : at > i ? 'done' : '';
          return <button key={s} className={`st-step ${state && 'st-step-' + state}`} onClick={() => moveTo(s)} aria-pressed={s === p.stage}>{label(s)}</button>;
        })}
      </div>
      <div className="st-row">
        {p.stage === 'on_hold' || p.stage === 'cancelled'
          ? <Badge tone="oat">{label(p.stage)}</Badge> : null}
        <button className="st-linkbtn" onClick={() => moveTo(p.stage === 'on_hold' ? 'discovery' : 'on_hold')}>{p.stage === 'on_hold' ? 'Resume' : 'Put on hold'}</button>
        {p.stage !== 'cancelled' && <button className="st-linkbtn" onClick={() => window.confirm('Cancel this project?') && save({ stage: 'cancelled' })}>Cancel project</button>}
      </div>
      <ErrorNote>{act.error}</ErrorNote>

      <div className="st-stats">
        <div className="st-stat"><div className="st-stat-l">Deposit</div><div className="st-stat-v">{!ov?.quote_number ? 'No accepted quote' : ov.deposit_cleared ? 'In' : 'Waiting'}</div></div>
        <div className="st-stat"><div className="st-stat-l">Balance</div><div className="st-stat-v">{ov?.quote_number ? money(ov.balance, ov.currency) : '—'}</div></div>
        <div className="st-stat"><div className="st-stat-l">Rounds used</div><div className="st-stat-v">{ov?.rounds_used ?? 0} of {pkg?.rounds_included ?? '—'}</div></div>
        <div className="st-stat"><div className="st-stat-l">Source files</div><div className="st-stat-v">{ov?.files_releasable ? 'OK to release' : 'Hold until paid'}</div></div>
      </div>

      <Section title="Details">
        <div className="st-form">
          <Field label="Lead">
            <select value={p.owner_id ?? ''} onChange={(e) => save({ owner_id: e.target.value || null })}>
              <option value="">—</option>
              {team.map((t) => <option key={t.id} value={t.id}>{t.full_name || t.email}</option>)}
            </select>
          </Field>
          <Field label="Package">
            <select value={p.package_id ?? ''} onChange={(e) => save({ package_id: e.target.value || null })}>
              <option value="">Custom / none</option>
              {offerings.filter((o) => o.kind === 'package').map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </Field>
          <Field label="Start"><input type="date" value={p.start_date ?? ''} onChange={(e) => save({ start_date: e.target.value || null })} /></Field>
          <Field label="Due"><input type="date" value={p.due_date ?? ''} onChange={(e) => save({ due_date: e.target.value || null })} /></Field>
          <label className="st-check"><input type="checkbox" checked={p.is_rush} onChange={(e) => save({ is_rush: e.target.checked })} /> Rush (+25%)</label>
          <Notes value={p.notes} onSave={(notes) => save({ notes })} />
        </div>
      </Section>

      <Money d={d} pkg={pkg} reload={reload} />
      <Creative d={d} pkg={pkg} reload={reload} />
      <Files d={d} reload={reload} />

      <Section title="Project activity">
        {d.log.length === 0 ? <Empty>Nothing yet.</Empty> : (
          <ul className="st-feed">
            {d.log.map((l) => (
              <li key={l.id}><span className={'st-dot' + (l.action === 'update' ? ' st-dot-quiet' : '')} />
                <div><div>{describe(l, names)}</div><div className="st-muted st-small">{when(l.created_at)}</div></div></li>
            ))}
          </ul>
        )}
      </Section>

      {me.role === 'owner' && (
        <div className="st-danger-zone">
          <Btn kind="danger" onClick={() => {
            if (!window.confirm(`Delete “${p.name}” with its quotes, routes and files list? Payments must be removed first. This can't be undone.`)) return;
            act.run(async () => { await db.remove('projects', `id=eq.${p.id}`); navigate('/studio/projects'); });
          }}>Delete project</Btn>
        </div>
      )}
    </>
  );
}

function Notes({ value, onSave }: { value: string | null; onSave: (v: string | null) => void }) {
  const [v, setV] = useState(value ?? '');
  return (
    <Field label="Notes" wide>
      <textarea rows={3} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => v !== (value ?? '') && onSave(v || null)} />
    </Field>
  );
}

/* ——— Money: quotes + payments ——— */
function Money({ d, pkg, reload }: { d: Data; pkg: Offering | undefined; reload: () => void }) {
  const [adding, setAdding] = useState(d.quotes.length === 0);
  const act = useAction();
  return (
    <Section title="Quotes & payments" aside={!adding && <Btn kind="outline" onClick={() => setAdding(true)}>New quote</Btn>}>
      <ErrorNote>{act.error}</ErrorNote>
      {adding && <NewQuote d={d} pkg={pkg} onDone={() => { setAdding(false); reload(); }} onCancel={d.quotes.length ? () => setAdding(false) : undefined} />}
      {d.quotes.map((q) => {
        const t = d.totals.find((x) => x.quote_id === q.id);
        const items = d.items.filter((i) => i.quote_id === q.id);
        const pays = d.payments.filter((x) => x.quote_id === q.id);
        const expired = q.status === 'sent' && q.valid_until < today();
        return (
          <div key={q.id} className="st-card">
            <div className="st-card-head">
              <strong>{q.quote_number}</strong>
              <select className="st-inline-select" value={q.status} aria-label="Quote status"
                onChange={(e) => act.run(async () => { await db.update('quotes', `id=eq.${q.id}`, { status: e.target.value as QuoteStatus }); reload(); })}>
                {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
              </select>
              <span className="st-muted">Valid until {day(q.valid_until)}{expired && ' · past validity, re-quote before accepting'}</span>
            </div>
            <table className="st-table st-table-tight">
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}><td>{i.description}{i.quantity > 1 && ` × ${i.quantity}`}</td><td className="st-num">{money(i.line_total, q.currency)}</td></tr>
                ))}
                {Number(q.discount_pct) > 0 && <tr><td>Discount {Number(q.discount_pct)}%{q.discount_reason && ` (${q.discount_reason})`}</td><td className="st-num">− {money(t?.discount, q.currency)}</td></tr>}
                <tr className="st-total"><td>Total</td><td className="st-num">{money(t?.total, q.currency)}</td></tr>
                <tr><td>Paid</td><td className="st-num">{money(t?.paid, q.currency)}</td></tr>
                <tr className="st-total"><td>Balance</td><td className="st-num">{money(t?.balance, q.currency)}</td></tr>
              </tbody>
            </table>
            {q.fx_rate && <p className="st-muted st-small">Rate on quote date: EGP {Number(q.fx_rate)} per USD</p>}
            {pays.length > 0 && (
              <ul className="st-list">
                {pays.map((x) => (
                  <li key={x.id}><span className="st-dot" />{money(x.kind === 'refund' ? -x.amount : x.amount, q.currency)} · {label(x.kind)}
                    <span className="st-muted">{x.method ?? ''}{x.reference ? ` · ${x.reference}` : ''} · {day(x.paid_at)}</span></li>
                ))}
              </ul>
            )}
            {t && <AddPayment key={`${q.id}-${t.paid}`} quote={q} total={t} onDone={reload} />}
          </div>
        );
      })}
    </Section>
  );
}

function NewQuote({ d, pkg, onDone, onCancel }: { d: Data; pkg: Offering | undefined; onDone: () => void; onCancel?: () => void }) {
  const { offerings } = useStudio();
  const addons = offerings.filter((o) => o.kind === 'addon' && o.is_active);
  const [currency, setCurrency] = useState<Currency>(d.client.market === 'gulf' ? 'USD' : 'EGP');
  const price = (o: Offering, cur: Currency) => Number(cur === 'USD' ? o.price_usd : o.price_egp);
  const [pkgPrice, setPkgPrice] = useState<string>(pkg ? String(price(pkg, currency)) : '');
  const extra = d.overview?.extra_rounds_to_bill ?? 0;
  const [qty, setQty] = useState<Record<string, number>>(() => {
    const er = addons.find((a) => a.code === 'extra_round');
    return er && extra > 0 ? { [er.id]: extra } : {};
  });
  const founding = d.client.is_founding_client && (pkg?.code === 'house' || pkg?.code === 'landmark');
  const [discount, setDiscount] = useState(founding ? '30' : '0');
  const [reason, setReason] = useState(founding ? 'Founding client' : '');
  const [fx, setFx] = useState('');
  const [status, setStatus] = useState<QuoteStatus>('draft');
  const act = useAction();

  const switchCurrency = (c: Currency) => { setCurrency(c); if (pkg) setPkgPrice(String(price(pkg, c))); };
  const pkgN = Number(pkgPrice) || 0;
  const lines = [
    ...(pkg ? [{ offering_id: pkg.id, description: `${pkg.name} package${pkg.price_is_from ? ' (scoped)' : ''}`, quantity: 1, unit_price: pkgN }] : []),
    ...(d.project.is_rush && pkgN ? [{ offering_id: null, description: 'Rush delivery (+25%)', quantity: 1, unit_price: Math.round(pkgN * 0.25) }] : []),
    ...addons.filter((a) => (qty[a.id] ?? 0) > 0).map((a) => ({ offering_id: a.id, description: a.name, quantity: qty[a.id], unit_price: price(a, currency) })),
  ];
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const total = Math.round(subtotal * (1 - (Number(discount) || 0) / 100) * 100) / 100;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!lines.length) { act.setError('Add at least one line'); return; }
    act.run(async () => {
      const [q] = await db.insert<Quote>('quotes', {
        project_id: d.project.id, currency, status, discount_pct: Number(discount) || 0, discount_reason: reason || null,
        fx_rate: fx ? Number(fx) : null,
      });
      await db.insert('quote_items', lines.map((l) => ({ ...l, quote_id: q.id })));
      onDone();
    });
  };

  return (
    <form className="st-card st-form" onSubmit={submit}>
      <Field label="Currency">
        <select value={currency} onChange={(e) => switchCurrency(e.target.value as Currency)}><option>EGP</option><option>USD</option></select>
      </Field>
      {pkg && <Field label={`${pkg.name} price${pkg.price_is_from ? ' (from)' : ''}`}><input type="number" min={0} value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} /></Field>}
      <Field label="Discount %"><input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(e.target.value)} /></Field>
      <Field label="Discount reason"><input value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
      {currency === 'USD' && <Field label="EGP per USD today"><input type="number" step="0.01" value={fx} onChange={(e) => setFx(e.target.value)} /></Field>}
      <Field label="Status">
        <select value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)}>{QUOTE_STATUSES.slice(0, 3).map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
      </Field>
      <fieldset className="st-wide st-addons">
        <legend>Add-ons</legend>
        {addons.map((a) => (
          <label key={a.id} className="st-addon">
            <input type="number" min={0} max={20} value={qty[a.id] ?? 0} aria-label={`${a.name} quantity`}
              onChange={(e) => setQty({ ...qty, [a.id]: Math.max(0, Number(e.target.value) || 0) })} />
            <span>{a.name}</span>
            <span className="st-muted">{a.price_is_from ? 'from ' : ''}{money(price(a, currency), currency)}</span>
          </label>
        ))}
      </fieldset>
      {!pkg && <p className="st-muted st-wide">This project has no package. Pick one in Details to add it as a line.</p>}
      <div className="st-wide st-formfoot">
        <span className="st-quote-total">Total {money(total, currency)} · valid 14 days · 50% deposit to start</span>
        <ErrorNote>{act.error}</ErrorNote>
        {onCancel && <Btn kind="ghost" onClick={onCancel}>Cancel</Btn>}
        <Btn type="submit" disabled={act.busy}>{act.busy ? 'Saving…' : 'Create quote'}</Btn>
      </div>
    </form>
  );
}

function AddPayment({ quote, total, onDone }: { quote: Quote; total: QuoteTotal; onDone: () => void }) {
  const bal = Number(total.balance);
  const depositDue = Math.max(Number(total.total) * 0.5 - Number(total.paid), 0);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<PaymentKind>(total.deposit_cleared ? 'balance' : 'deposit');
  const [amount, setAmount] = useState(String(total.deposit_cleared ? bal : depositDue));
  const [method, setMethod] = useState('InstaPay');
  const [ref, setRef] = useState('');
  const [date, setDate] = useState(today());
  const act = useAction();
  if (bal <= 0 && !open) return null;
  if (!open) return <Btn kind="outline" onClick={() => setOpen(true)}>Log a payment</Btn>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!(n > 0)) { act.setError('Enter an amount above zero'); return; }
    act.run(async () => {
      await db.insert('payments', { quote_id: quote.id, amount: n, kind, method, reference: ref || null, paid_at: new Date(date + 'T12:00:00').toISOString() });
      if (quote.status !== 'accepted' && kind === 'deposit') await db.update('quotes', `id=eq.${quote.id}`, { status: 'accepted' });
      onDone();
    });
  };

  return (
    <form className="st-form st-subform" onSubmit={submit}>
      <Field label={`Amount (${quote.currency})`}><input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
      <Field label="Type"><select value={kind} onChange={(e) => setKind(e.target.value as PaymentKind)}>{PAYMENT_KINDS.map((k) => <option key={k} value={k}>{label(k)}</option>)}</select></Field>
      <Field label="Method"><select value={method} onChange={(e) => setMethod(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></Field>
      <Field label="Reference"><input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Transfer ID, receipt no." /></Field>
      <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      <div className="st-wide st-formfoot">
        <ErrorNote>{act.error}</ErrorNote>
        <Btn kind="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
        <Btn type="submit" disabled={act.busy}>{act.busy ? 'Saving…' : 'Save payment'}</Btn>
      </div>
    </form>
  );
}

/* ——— Creative: routes + revision rounds ——— */
const safeName = (n: string) => n.replace(/[^\w.\-]+/g, '_').slice(-80);

function Preview({ path }: { path: string }) {
  const act = useAction();
  return <button className="st-linkbtn" disabled={act.busy} onClick={() => act.run(async () => { window.open(await storage.signedUrl(path), '_blank', 'noopener'); })}>{act.busy ? 'Opening…' : 'Open file'}{act.error && ` · ${act.error}`}</button>;
}

function Creative({ d, pkg, reload }: { d: Data; pkg: Offering | undefined; reload: () => void }) {
  const act = useAction();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [concept, setConcept] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState('');
  const selected = d.routes.find((r) => r.is_selected);
  const rounds = selected ? d.revisions.filter((r) => r.route_id === selected.id) : [];
  const included = pkg?.rounds_included ?? null;

  const addRoute = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { act.setError('Name the route'); return; }
    const n = Math.max(0, ...d.routes.map((r) => r.route_number)) + 1;
    act.run(async () => {
      const preview_path = file ? await storage.upload(`${d.project.id}/routes/${n}-${Date.now()}-${safeName(file.name)}`, file) : null;
      await db.insert('creative_routes', { project_id: d.project.id, route_number: n, name: name.trim(), concept: concept || null, preview_path, presented_at: null });
      setName(''); setConcept(''); setFile(null); setAdding(false); reload();
    });
  };

  const choose = (r: Route) => act.run(async () => {
    if (selected) await db.update('creative_routes', `id=eq.${selected.id}`, { is_selected: false });
    await db.update('creative_routes', `id=eq.${r.id}`, { is_selected: true });
    if (d.project.stage === 'routes') await db.update('projects', `id=eq.${d.project.id}`, { stage: 'refinement' });
    reload();
  });

  const addRound = (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const next = Math.max(0, ...rounds.map((r) => r.round)) + 1;
    if (included != null && next > included &&
        !window.confirm(`Round ${next} is beyond the ${included} included in ${pkg?.name}. It should be billed as an Extra round. Log it?`)) return;
    act.run(async () => {
      await db.insert('revisions', { route_id: selected.id, round: next, client_feedback: feedback || null });
      setFeedback(''); reload();
    });
  };

  return (
    <Section title="Creative routes" aside={!adding && <Btn kind="outline" onClick={() => setAdding(true)}>Add route</Btn>}>
      <ErrorNote>{act.error}</ErrorNote>
      {adding && (
        <form className="st-card st-form" onSubmit={addRoute}>
          <Field label="Route name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Clay" /></Field>
          <Field label="Preview (optional)"><input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
          <Field label="Concept" wide><textarea rows={2} value={concept} onChange={(e) => setConcept(e.target.value)} /></Field>
          <div className="st-wide st-formfoot">
            <Btn kind="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
            <Btn type="submit" disabled={act.busy}>{act.busy ? 'Saving…' : 'Add route'}</Btn>
          </div>
        </form>
      )}
      {d.routes.length === 0 && !adding ? <Empty>No routes yet. {pkg?.routes_included ? `${pkg.name} includes ${pkg.routes_included}.` : ''}</Empty> : (
        <div className="st-routes">
          {d.routes.map((r) => (
            <div key={r.id} className={'st-route' + (r.is_selected ? ' st-route-on' : '')}>
              <div className="st-route-n">Route {r.route_number}</div>
              <div className="st-route-name">{r.name}</div>
              {r.concept && <p className="st-muted st-small">{r.concept}</p>}
              <div className="st-row">
                {r.preview_path && <Preview path={r.preview_path} />}
                {r.is_selected ? <Badge tone="apricot">Client's pick</Badge> : <button className="st-linkbtn" onClick={() => choose(r)}>Mark as picked</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="st-card">
          <div className="st-card-head"><strong>Refinement on “{selected.name}”</strong>
            <span className="st-muted">{rounds.length} of {included ?? '—'} rounds used</span></div>
          {rounds.length > 0 && (
            <ul className="st-list">
              {rounds.map((r) => (
                <li key={r.id}>
                  <span className={'st-dot' + (included != null && r.round > included ? '' : ' st-dot-quiet')} />
                  <strong>Round {r.round}</strong>
                  {included != null && r.round > included && <Badge tone="apricot">Billable</Badge>}
                  <span className="st-muted">{r.client_feedback ?? 'No feedback noted'} · {day(r.requested_at)}</span>
                  {r.completed_at ? <Badge tone="papyrus">Done</Badge>
                    : <button className="st-linkbtn" onClick={() => act.run(async () => { await db.update('revisions', `id=eq.${r.id}`, { completed_at: new Date().toISOString() }); reload(); })}>Mark done</button>}
                </li>
              ))}
            </ul>
          )}
          <form className="st-form st-subform" onSubmit={addRound}>
            <Field label="Client feedback for the next round" wide><textarea rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} /></Field>
            <div className="st-wide st-formfoot"><Btn type="submit" kind="dark" disabled={act.busy}>Log round {Math.max(0, ...rounds.map((r) => r.round)) + 1}</Btn></div>
          </form>
        </div>
      )}
    </Section>
  );
}

/* ——— Files ——— */
function Files({ d, reload }: { d: Data; reload: () => void }) {
  const { me } = useStudio();
  const act = useAction();
  const [type, setType] = useState('logo');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const upload = (e: FormEvent) => {
    e.preventDefault();
    if (!file) { act.setError('Choose a file'); return; }
    const t = title.trim() || file.name;
    const version = Math.max(0, ...d.files.filter((f) => f.title === t).map((f) => f.version)) + 1;
    act.run(async () => {
      const path = await storage.upload(`${d.project.id}/files/${Date.now()}-${safeName(file.name)}`, file);
      await db.insert('deliverables', { project_id: d.project.id, type, title: t, storage_path: path, version });
      setTitle(''); setFile(null); setInputKey((k) => k + 1); reload();
    });
  };

  const setStatus = (f: Deliverable, status: DeliverableStatus) => {
    if (status === 'sent_to_client' && !d.overview?.files_releasable &&
        !window.confirm('The balance is not fully paid. Our terms: files and rights transfer on full payment. Send anyway?')) return;
    const now = new Date().toISOString();
    act.run(async () => {
      await db.update('deliverables', `id=eq.${f.id}`, {
        status,
        ...(status === 'approved' ? { approved_by: me.id, approved_at: now } : {}),
        ...(status === 'sent_to_client' ? { sent_at: now } : {}),
      });
      reload();
    });
  };

  return (
    <Section title="Files & deliverables">
      <ErrorNote>{act.error}</ErrorNote>
      {d.files.length > 0 && (
        <div className="st-tablewrap">
          <table className="st-table">
            <thead><tr><th>File</th><th>Type</th><th>Version</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {d.files.map((f) => (
                <tr key={f.id}>
                  <td>{f.title}<div className="st-muted st-small">{when(f.created_at)}</div></td>
                  <td>{label(f.type)}</td>
                  <td>v{f.version}</td>
                  <td>
                    <select className="st-inline-select" value={f.status} onChange={(e) => setStatus(f, e.target.value as DeliverableStatus)} aria-label="File status">
                      {DELIVERABLE_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                    </select>
                  </td>
                  <td>{f.storage_path && <Preview path={f.storage_path} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <form className="st-form st-card" onSubmit={upload}>
        <Field label="Type"><select value={type} onChange={(e) => setType(e.target.value)}>{FILE_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}</select></Field>
        <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Same title = new version" /></Field>
        <Field label="File" wide><input key={inputKey} type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
        <div className="st-wide st-formfoot"><Btn type="submit" kind="dark" disabled={act.busy}>{act.busy ? 'Uploading…' : 'Upload'}</Btn></div>
      </form>
    </Section>
  );
}
