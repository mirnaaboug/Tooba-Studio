import { useState } from 'react';
import { db } from '../lib/supabase';
import { NewProject } from './Clients';
import { useStudio } from './StudioApp';
import { STAGES, type Client, type ProjectOverview, type Stage } from './types';
import { Badge, day, Empty, ErrorNote, Field, Link, Loading, money, navigate, PageHead, Section, Btn, label, stageTone, useLoad } from './ui';

export function Projects() {
  const { me, team } = useStudio();
  const [stage, setStage] = useState<Stage | 'open' | 'all'>('open');
  const [adding, setAdding] = useState(false);
  const [clientId, setClientId] = useState('');
  const { data, error } = useLoad(async () => {
    const [projects, clients] = await Promise.all([
      db.select<ProjectOverview>('project_overview', 'select=*&order=due_date.asc.nullslast'),
      db.select<Client>('clients', 'select=*&status=neq.lost&order=name'),
    ]);
    return { projects, clients };
  }, []);

  const rows = (data?.projects ?? []).filter((p) =>
    stage === 'all' ? true : stage === 'open' ? !['delivered', 'cancelled'].includes(p.stage) : p.stage === stage);
  const client = data?.clients.find((c) => c.id === clientId);

  return (
    <>
      <PageHead eyebrow="Work" title="Projects">
        <Btn onClick={() => setAdding(!adding)}>{adding ? 'Close' : 'New project'}</Btn>
      </PageHead>

      {adding && data && (
        <Section title="New project">
          <div className="st-form st-form-1">
            <Field label="Client">
              <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Choose a client…</option>
                {data.clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({label(c.status)})</option>)}
              </select>
            </Field>
          </div>
          {data.clients.length === 0 && <p className="st-muted">Add the client first under <Link to="/studio/clients">Leads & clients</Link>.</p>}
          {client && <NewProject key={client.id} client={client} defaultOwner={me.id} team={team} onCreated={(id) => navigate(`/studio/projects/${id}`)} />}
        </Section>
      )}

      <div className="st-chips">
        <button className="st-chip" aria-pressed={stage === 'open'} onClick={() => setStage('open')}>Open</button>
        {STAGES.map((s) => {
          const n = (data?.projects ?? []).filter((p) => p.stage === s).length;
          return <button key={s} className="st-chip" aria-pressed={stage === s} onClick={() => setStage(s)}>{label(s)}{n ? ` · ${n}` : ''}</button>;
        })}
        <button className="st-chip" aria-pressed={stage === 'all'} onClick={() => setStage('all')}>All</button>
      </div>

      <ErrorNote>{error}</ErrorNote>
      {!data ? <Loading /> : rows.length === 0 ? <Empty>No projects here.</Empty> : (
        <div className="st-tablewrap">
          <table className="st-table">
            <thead><tr><th>Project</th><th>Client</th><th>Package</th><th>Stage</th><th>Due</th><th>Deposit</th><th className="st-num">Balance</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.project_id}>
                  <td><Link to={`/studio/projects/${p.project_id}`}>{p.project_name}</Link></td>
                  <td>{p.client_name}</td>
                  <td>{p.package ?? '—'}</td>
                  <td><Badge tone={stageTone(p.stage)}>{label(p.stage)}</Badge></td>
                  <td>{day(p.due_date)}</td>
                  <td>{!p.quote_number ? <span className="st-muted">No quote</span> : p.deposit_cleared ? <Badge tone="papyrus">In</Badge> : <Badge tone="apricot">Waiting</Badge>}</td>
                  <td className="st-num">{p.quote_number ? money(p.balance, p.currency) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
