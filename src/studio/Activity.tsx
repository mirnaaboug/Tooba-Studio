import { useState } from 'react';
import { db } from '../lib/supabase';
import { useStudio } from './StudioApp';
import type { LogEntry } from './types';
import { Btn, Empty, ErrorNote, Loading, PageHead, label, useLoad, when } from './ui';

const NOUN: Record<string, string> = {
  clients: 'client', projects: 'project', quotes: 'quote', quote_items: 'quote line', payments: 'payment',
  creative_routes: 'route', revisions: 'revision', deliverables: 'file', offerings: 'price-list item',
  profiles: 'team member', onboarding_submissions: 'website submission',
};

const FILTERS: { id: string; label: string }[] = [
  { id: '', label: 'Everything' },
  { id: 'clients', label: 'Clients' },
  { id: 'projects', label: 'Projects' },
  { id: 'quotes,quote_items,payments', label: 'Money' },
  { id: 'creative_routes,revisions,deliverables', label: 'Creative' },
  { id: 'onboarding_submissions', label: 'Website' },
];

function nameOf(d: Record<string, unknown> | null): string {
  if (!d) return '';
  const v = d.name ?? d.title ?? d.business_name ?? d.quote_number ?? d.description ?? (d.round != null ? `round ${d.round}` : null)
    ?? (d.amount != null ? Number(d.amount).toLocaleString('en-US') : null);
  return v == null ? '' : String(v);
}

/** One readable sentence for a log row. */
export function describe(l: LogEntry, names: Record<string, string>): string {
  const who = l.actor_id ? names[l.actor_id] ?? 'A team member'
    : l.table_name === 'onboarding_submissions' || (l.table_name === 'clients' && l.new_data?.source === 'website' && l.action === 'insert') ? 'Website'
    : 'Dashboard';
  const noun = NOUN[l.table_name] ?? l.table_name;
  const d = l.new_data ?? l.old_data;
  const what = nameOf(d);
  const thing = what ? `${noun} “${what}”` : `a ${noun}`;
  if (l.action === 'insert') return `${who} added ${thing}`;
  if (l.action === 'delete') return `${who} deleted ${thing}`;
  const f = l.changed_fields ?? [];
  if (f.includes('stage')) return `${who} moved ${thing} to ${label(String(l.new_data?.stage))}`;
  if (f.includes('status')) return `${who} marked ${thing} as ${label(String(l.new_data?.status))}`;
  if (f.includes('is_selected') && l.new_data?.is_selected) return `${who} selected ${thing}`;
  return `${who} updated ${thing} (${f.map((x) => label(x).toLowerCase()).join(', ')})`;
}

const PAGE = 50;

export function Activity() {
  const { team } = useStudio();
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const names = Object.fromEntries(team.map((t) => [t.id, t.full_name || t.email || 'Someone']));
  const { data, error } = useLoad(
    () => db.select<LogEntry>('activity_log', `select=*&order=id.desc&limit=${limit}` + (filter ? `&table_name=in.(${filter})` : '')),
    [filter, limit],
  );

  return (
    <>
      <PageHead eyebrow="Activity" title="Everything that happened" />
      <div className="st-chips">
        {FILTERS.map((f) => (
          <button key={f.id} className="st-chip" aria-pressed={filter === f.id} onClick={() => { setFilter(f.id); setLimit(PAGE); }}>{f.label}</button>
        ))}
      </div>
      <ErrorNote>{error}</ErrorNote>
      {!data ? <Loading /> : data.length === 0 ? <Empty>Nothing recorded yet.</Empty> : (
        <>
          <ul className="st-feed">
            {data.map((l) => (
              <li key={l.id}>
                <span className={'st-dot' + (l.action === 'update' ? ' st-dot-quiet' : '')} />
                <div>
                  <div>{describe(l, names)}</div>
                  <div className="st-muted st-small">{when(l.created_at)}</div>
                </div>
              </li>
            ))}
          </ul>
          {data.length >= limit && <Btn kind="outline" onClick={() => setLimit(limit + PAGE)}>Show more</Btn>}
        </>
      )}
    </>
  );
}
