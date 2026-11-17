import { db } from '../lib/supabase';
import { useStudio } from './StudioApp';
import type { Client, LogEntry, ProjectOverview, Submission } from './types';
import { Badge, day, Empty, ErrorNote, Link, Loading, money, PageHead, Section, Stat, stageTone, label, today, useLoad, when } from './ui';
import { describe } from './Activity';

export function Overview() {
  const { me, team } = useStudio();
  const { data, error } = useLoad2();

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <Loading />;
  const { projects, clients, places, log, subs } = data;

  const open = projects.filter((p) => p.stage !== 'delivered' && p.stage !== 'cancelled');
  const leads = clients.filter((c) => c.status === 'lead').length;
  const owedEgp = projects.filter((p) => p.currency === 'EGP' && p.stage !== 'cancelled').reduce((a, p) => a + Math.max(Number(p.balance ?? 0), 0), 0);
  const owedUsd = projects.filter((p) => p.currency === 'USD' && p.stage !== 'cancelled').reduce((a, p) => a + Math.max(Number(p.balance ?? 0), 0), 0);

  const flags: { p: ProjectOverview; text: string }[] = [];
  for (const p of projects) {
    if (p.stage === 'cancelled') continue;
    if (!p.quote_number && p.stage !== 'discovery' && p.stage !== 'delivered') flags.push({ p, text: 'Work started with no accepted quote' });
    else if (p.quote_number && !p.deposit_cleared && p.stage !== 'discovery') flags.push({ p, text: 'Work started before the 50% deposit' });
    if (p.extra_rounds_to_bill > 0) flags.push({ p, text: `${p.extra_rounds_to_bill} extra round${p.extra_rounds_to_bill > 1 ? 's' : ''} to bill` });
    if (p.stage === 'delivered' && Number(p.balance ?? 0) > 0) flags.push({ p, text: `Delivered with ${money(p.balance, p.currency)} unpaid` });
    if (p.due_date && p.due_date < today() && p.stage !== 'delivered') flags.push({ p, text: `Overdue since ${day(p.due_date)}` });
  }

  const first = (me.full_name || '').split(/\s+/)[0];
  const names = Object.fromEntries(team.map((t) => [t.id, t.full_name || t.email || 'Someone']));

  return (
    <>
      <PageHead eyebrow="Overview" title={first ? `Good to see you, ${first}` : 'Studio overview'} />
      <div className="st-stats">
        <Stat n={leads} l="New leads" tone={leads ? 'apricot' : undefined} />
        <Stat n={open.length} l="Open projects" />
        <Stat n={money(owedEgp)} l={owedUsd ? `Still to collect · + ${money(owedUsd, 'USD')}` : 'Still to collect'} />
        <Stat n={`${places} of 5`} l="Founding places left" />
      </div>

      <Section title="Needs attention">
        {flags.length === 0 ? <Empty>Nothing flagged. Deposits are in and rounds are on track.</Empty> : (
          <ul className="st-list">
            {flags.map((f, i) => (
              <li key={i}>
                <span className="st-dot" />
                <Link to={`/studio/projects/${f.p.project_id}`}>{f.p.project_name}</Link>
                <span className="st-muted">{f.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Open projects" aside={<Link to="/studio/projects" className="st-more">All projects</Link>}>
        {open.length === 0 ? <Empty>No open projects yet.</Empty> : (
          <div className="st-tablewrap">
            <table className="st-table">
              <thead><tr><th>Project</th><th>Client</th><th>Stage</th><th>Due</th><th className="st-num">Balance</th></tr></thead>
              <tbody>
                {open.map((p) => (
                  <tr key={p.project_id}>
                    <td><Link to={`/studio/projects/${p.project_id}`}>{p.project_name}</Link></td>
                    <td>{p.client_name}</td>
                    <td><Badge tone={stageTone(p.stage)}>{label(p.stage)}</Badge></td>
                    <td>{day(p.due_date)}</td>
                    <td className="st-num">{p.quote_number ? money(p.balance, p.currency) : <span className="st-muted">No quote</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <div className="st-two">
        <Section title="From the website" aside={<Link to="/studio/clients" className="st-more">All leads</Link>}>
          {subs.length === 0 ? <Empty>No onboarding submissions yet.</Empty> : (
            <ul className="st-list">
              {subs.map((s) => (
                <li key={s.id}>
                  <span className="st-dot" />
                  {s.client_id ? <Link to={`/studio/clients/${s.client_id}`}>{s.business_name}</Link> : s.business_name}
                  <span className="st-muted">{s.package_name ?? '—'} · {when(s.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section title="Latest activity" aside={<Link to="/studio/activity" className="st-more">Everything</Link>}>
          {log.length === 0 ? <Empty>Nothing yet.</Empty> : (
            <ul className="st-list">
              {log.map((l) => (
                <li key={l.id}>
                  <span className="st-dot st-dot-quiet" />
                  <span>{describe(l, names)}</span>
                  <span className="st-muted">{when(l.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}

function useLoad2() {
  return useLoad(async () => {
    const [projects, clients, placesRow, log, subs] = await Promise.all([
      db.select<ProjectOverview>('project_overview', 'select=*&order=due_date.asc.nullslast'),
      db.select<Pick<Client, 'id' | 'status'>>('clients', 'select=id,status'),
      db.select<{ places_left: number }>('founding_places_left', 'select=*'),
      db.select<LogEntry>('activity_log', 'select=*&order=id.desc&limit=8'),
      db.select<Submission>('onboarding_submissions', 'select=*&order=created_at.desc&limit=5'),
    ]);
    return { projects, clients, places: placesRow[0]?.places_left ?? 5, log, subs };
  }, []);
}
