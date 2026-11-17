import { useState, type FormEvent } from 'react';
import { db } from '../lib/supabase';
import { useStudio } from './StudioApp';
import { CLIENT_STATUSES, SOURCES, type Client, type ClientStatus, type Project, type Submission } from './types';
import {
  Badge, Btn, day, Empty, ErrorNote, Field, Link, Loading, money, navigate, PageHead, Section, label, stageTone, statusTone,
  useAction, useLoad, when,
} from './ui';

const SECTORS = ['Real estate', 'F&B / café', 'Clinic / wellness', 'Beauty / personal care', 'Fashion / DTC', 'Startup / tech', 'Hospitality', 'Other'];

export const waLink = (n: string | null) => (n ? `https://wa.me/${n.replace(/\D/g, '')}` : null);

export function Clients() {
  const [status, setStatus] = useState<ClientStatus | ''>('');
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const { data, error } = useLoad(() => db.select<Client>('clients', 'select=*&order=created_at.desc'), []);

  const rows = (data ?? []).filter((c) =>
    (!status || c.status === status) &&
    (!q || [c.name, c.name_ar, c.contact_name, c.email, c.phone].some((v) => v?.toLowerCase().includes(q.toLowerCase()))));
  const count = (s: ClientStatus) => (data ?? []).filter((c) => c.status === s).length;

  return (
    <>
      <PageHead eyebrow="Pipeline" title="Leads & clients">
        <Btn onClick={() => setAdding(!adding)}>{adding ? 'Close' : 'New lead'}</Btn>
      </PageHead>

      {adding && (
        <Section title="New lead">
          <ClientForm onSaved={(c) => navigate(`/studio/clients/${c.id}`)} />
        </Section>
      )}

      <div className="st-toolbar">
        <div className="st-chips">
          <button className="st-chip" aria-pressed={status === ''} onClick={() => setStatus('')}>All {data ? `· ${data.length}` : ''}</button>
          {CLIENT_STATUSES.map((s) => (
            <button key={s} className="st-chip" aria-pressed={status === s} onClick={() => setStatus(s)}>{label(s)} · {count(s)}</button>
          ))}
        </div>
        <input className="st-search" type="search" placeholder="Search name, contact, phone…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search clients" />
      </div>

      <ErrorNote>{error}</ErrorNote>
      {!data ? <Loading /> : rows.length === 0 ? <Empty>No one here yet.</Empty> : (
        <div className="st-tablewrap">
          <table className="st-table">
            <thead><tr><th>Name</th><th>Sector</th><th>Source</th><th>Status</th><th>Contact</th><th>Added</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/studio/clients/${c.id}`}>{c.name}</Link>
                    {c.is_founding_client && <> <Badge tone="apricot">Founding</Badge></>}
                    {c.name_ar && <div className="st-ar">{c.name_ar}</div>}
                  </td>
                  <td>{c.sector ?? '—'}</td>
                  <td>{label(c.source)}</td>
                  <td><Badge tone={statusTone(c.status)}>{label(c.status)}</Badge></td>
                  <td>
                    {c.contact_name ?? '—'}
                    {waLink(c.whatsapp) && <div><a href={waLink(c.whatsapp)!} target="_blank" rel="noreferrer">WhatsApp</a></div>}
                  </td>
                  <td className="st-muted">{when(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

type ClientDraft = Omit<Client, 'id' | 'created_at'>;
const BLANK: ClientDraft = {
  name: '', name_ar: null, sector: null, market: 'egypt', status: 'lead', source: null, contact_name: null, phone: null,
  whatsapp: null, email: null, instagram: null, is_founding_client: false, notes: null,
};

function ClientForm({ client, onSaved }: { client?: Client; onSaved: (c: Client) => void }) {
  const [f, setF] = useState<ClientDraft>(() => (client ? { ...client } : { ...BLANK }));
  const act = useAction();
  const set = <K extends keyof ClientDraft>(k: K, v: ClientDraft[K]) => setF((x) => ({ ...x, [k]: v }));
  const txt = (k: keyof ClientDraft) => ({
    value: (f[k] as string | null) ?? '',
    onChange: (e: { target: { value: string } }) => set(k, (e.target.value || null) as never),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) { act.setError('Add a name'); return; }
    const { name, name_ar, sector, market, status, source, contact_name, phone, whatsapp, email, instagram, is_founding_client, notes } = f;
    const row = { name: name.trim(), name_ar, sector, market, status, source, contact_name, phone, whatsapp, email, instagram, is_founding_client, notes };
    act.run(async () => {
      const [saved] = client
        ? await db.update<Client>('clients', `id=eq.${client.id}`, row)
        : await db.insert<Client>('clients', row);
      onSaved(saved);
    });
  };

  return (
    <form className="st-form" onSubmit={submit}>
      <Field label="Business name"><input value={f.name} onChange={(e) => set('name', e.target.value)} required /></Field>
      <Field label="Arabic name"><input dir="rtl" {...txt('name_ar')} /></Field>
      <Field label="Sector">
        <select {...txt('sector')}><option value="">—</option>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select>
      </Field>
      <Field label="Market">
        <select value={f.market} onChange={(e) => set('market', e.target.value as Client['market'])}>
          <option value="egypt">Egypt (EGP)</option><option value="gulf">Gulf (USD)</option>
        </select>
      </Field>
      <Field label="Status">
        <select value={f.status} onChange={(e) => set('status', e.target.value as ClientStatus)}>
          {CLIENT_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
      </Field>
      <Field label="Came from">
        <select {...txt('source')}><option value="">—</option>{SOURCES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
      </Field>
      <Field label="Contact person"><input {...txt('contact_name')} /></Field>
      <Field label="Phone"><input type="tel" {...txt('phone')} /></Field>
      <Field label="WhatsApp"><input type="tel" placeholder="+20…" {...txt('whatsapp')} /></Field>
      <Field label="Email"><input type="email" {...txt('email')} /></Field>
      <Field label="Instagram"><input placeholder="@handle" {...txt('instagram')} /></Field>
      <label className="st-check">
        <input type="checkbox" checked={f.is_founding_client} onChange={(e) => set('is_founding_client', e.target.checked)} />
        Founding client (30% off House / Landmark)
      </label>
      <Field label="Notes" wide><textarea rows={3} {...txt('notes')} /></Field>
      <div className="st-wide st-formfoot">
        <ErrorNote>{act.error}</ErrorNote>
        <Btn type="submit" disabled={act.busy}>{act.busy ? 'Saving…' : client ? 'Save changes' : 'Add lead'}</Btn>
      </div>
    </form>
  );
}

export function ClientDetail({ id }: { id: string }) {
  const { me, team, offerings } = useStudio();
  const [editing, setEditing] = useState(false);
  const { data, error, reload } = useLoad(async () => {
    const [[client], subs, projects] = await Promise.all([
      db.select<Client>('clients', `select=*&id=eq.${id}`),
      db.select<Submission>('onboarding_submissions', `select=*&client_id=eq.${id}&order=created_at.desc`),
      db.select<Project>('projects', `select=*&client_id=eq.${id}&order=created_at.desc`),
    ]);
    return { client, subs, projects };
  }, [id]);
  const del = useAction();

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <Loading />;
  const { client: c, subs, projects } = data;
  if (!c) return <Empty>This client doesn't exist (or was deleted).</Empty>;
  const pkgName = (pid: string | null) => offerings.find((o) => o.id === pid)?.name ?? '—';

  const setStatus = (status: ClientStatus) => del.run(async () => { await db.update('clients', `id=eq.${c.id}`, { status }); reload(); });

  return (
    <>
      <div className="st-crumbs"><Link to="/studio/clients">Leads & clients</Link></div>
      <PageHead eyebrow={`${label(c.market)} · ${c.sector ?? 'No sector'}`} title={c.name}>
        <select className="st-inline-select" value={c.status} onChange={(e) => setStatus(e.target.value as ClientStatus)} aria-label="Status">
          {CLIENT_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <Btn kind="outline" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</Btn>
      </PageHead>
      {c.name_ar && <p className="st-ar st-ar-lg">{c.name_ar}</p>}
      <ErrorNote>{del.error}</ErrorNote>

      {editing ? (
        <Section title="Edit details"><ClientForm client={c} onSaved={() => { setEditing(false); reload(); }} /></Section>
      ) : (
        <Section title="Details">
          <dl className="st-dl">
            <dt>Status</dt><dd><Badge tone={statusTone(c.status)}>{label(c.status)}</Badge>{c.is_founding_client && <> <Badge tone="apricot">Founding client</Badge></>}</dd>
            <dt>Came from</dt><dd>{label(c.source)}</dd>
            <dt>Contact</dt><dd>{c.contact_name ?? '—'}</dd>
            <dt>Phone</dt><dd>{c.phone ? <a href={`tel:${c.phone}`}>{c.phone}</a> : '—'}</dd>
            <dt>WhatsApp</dt><dd>{waLink(c.whatsapp) ? <a href={waLink(c.whatsapp)!} target="_blank" rel="noreferrer">{c.whatsapp}</a> : '—'}</dd>
            <dt>Email</dt><dd>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : '—'}</dd>
            <dt>Instagram</dt><dd>{c.instagram ?? '—'}</dd>
            <dt>Added</dt><dd>{day(c.created_at)}</dd>
            {c.notes && <><dt>Notes</dt><dd className="st-pre">{c.notes}</dd></>}
          </dl>
        </Section>
      )}

      {subs.length > 0 && (
        <Section title="Website onboarding">
          {subs.map((s) => (
            <div key={s.id} className="st-card">
              <div className="st-card-head"><strong>{s.ref}</strong><span className="st-muted">{when(s.created_at)}</span></div>
              <dl className="st-dl">
                <dt>Stage</dt><dd>{label(s.stage)}</dd>
                <dt>Services</dt><dd>{(s.services ?? []).map(label).join(', ') || '—'}</dd>
                <dt>Form showed</dt><dd>{s.package_name ?? '—'}{s.estimate_egp != null && ` · ${money(s.estimate_egp)}`}</dd>
                <dt>Timeline</dt><dd>{label(s.timeline)}</dd>
                <dt>Budget</dt><dd>{({ b1: 'Under EGP 60k', b2: 'EGP 60k – 100k', b3: 'EGP 100k +' } as Record<string, string>)[s.budget ?? ''] ?? '—'}</dd>
                <dt>Language</dt><dd>{({ en: 'English', ar: 'Arabic', both: 'Both' } as Record<string, string>)[s.language ?? ''] ?? '—'}</dd>
                <dt>Prefers</dt><dd>{s.preferred_channel ?? '—'}</dd>
              </dl>
            </div>
          ))}
        </Section>
      )}

      <Section title="Projects">
        {projects.length > 0 && (
          <ul className="st-list">
            {projects.map((p) => (
              <li key={p.id}>
                <Link to={`/studio/projects/${p.id}`}>{p.name}</Link>
                <Badge tone={stageTone(p.stage)}>{label(p.stage)}</Badge>
                <span className="st-muted">{pkgName(p.package_id)}</span>
              </li>
            ))}
          </ul>
        )}
        <NewProject client={c} defaultOwner={me.id} team={team} onCreated={(pid) => navigate(`/studio/projects/${pid}`)} />
      </Section>

      {me.role === 'owner' && (
        <div className="st-danger-zone">
          <Btn kind="danger" disabled={del.busy} onClick={() => {
            if (!window.confirm(`Delete ${c.name}? This can't be undone.`)) return;
            del.run(async () => { await db.remove('clients', `id=eq.${c.id}`); navigate('/studio/clients'); });
          }}>Delete client</Btn>
          {projects.length > 0 && <span className="st-muted st-small">Clients with projects can't be deleted. Mark them Past or Lost instead.</span>}
        </div>
      )}
    </>
  );
}

export function NewProject({ client, defaultOwner, team, onCreated }: {
  client: Client; defaultOwner: string; team: { id: string; full_name: string | null; email: string | null }[]; onCreated: (id: string) => void;
}) {
  const { offerings } = useStudio();
  const packages = offerings.filter((o) => o.kind === 'package' && o.is_active);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(`${client.name} identity`);
  const [pkg, setPkg] = useState(packages.find((p) => p.code === 'house')?.id ?? packages[0]?.id ?? '');
  const [owner, setOwner] = useState(defaultOwner);
  const [due, setDue] = useState('');
  const [rush, setRush] = useState(false);
  const act = useAction();

  if (!open) return <Btn kind="dark" onClick={() => setOpen(true)}>Start a project</Btn>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { act.setError('Name the project'); return; }
    act.run(async () => {
      const [p] = await db.insert<Project>('projects', {
        client_id: client.id, name: name.trim(), package_id: pkg || null, owner_id: owner || null,
        due_date: due || null, is_rush: rush, start_date: new Date().toISOString().slice(0, 10),
      });
      if (client.status === 'lead' || client.status === 'qualified') await db.update('clients', `id=eq.${client.id}`, { status: 'active' });
      onCreated(p.id);
    });
  };

  return (
    <form className="st-form st-card" onSubmit={submit}>
      <Field label="Project name" wide><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Package">
        <select value={pkg} onChange={(e) => setPkg(e.target.value)}>
          <option value="">Custom / none</option>
          {packages.map((o) => <option key={o.id} value={o.id}>{o.name} · {money(client.market === 'gulf' ? o.price_usd : o.price_egp, client.market === 'gulf' ? 'USD' : 'EGP')}</option>)}
        </select>
      </Field>
      <Field label="Lead">
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="">—</option>
          {team.map((t) => <option key={t.id} value={t.id}>{t.full_name || t.email}</option>)}
        </select>
      </Field>
      <Field label="Due date"><input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></Field>
      <label className="st-check"><input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} /> Rush (+25%)</label>
      <div className="st-wide st-formfoot">
        <ErrorNote>{act.error}</ErrorNote>
        <Btn kind="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
        <Btn type="submit" disabled={act.busy}>{act.busy ? 'Creating…' : 'Create project'}</Btn>
      </div>
    </form>
  );
}
