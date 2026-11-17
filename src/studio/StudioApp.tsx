import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Dots, Logo } from '../ds/components';
import { configured, db, getSession, onAuthChange, signIn, signOut, type Session } from '../lib/supabase';
import { Activity } from './Activity';
import { ClientDetail, Clients } from './Clients';
import { Overview } from './Overview';
import { ProjectDetail } from './ProjectDetail';
import { Projects } from './Projects';
import type { Offering, Profile } from './types';
import { Btn, ErrorNote, Link, Loading, useAction, useLoad, usePath } from './ui';
import './studio.css';

interface StudioCtx { me: Profile; team: Profile[]; offerings: Offering[] }
const Ctx = createContext<StudioCtx | null>(null);
export const useStudio = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStudio outside StudioApp');
  return c;
};

export default function StudioApp() {
  const [session, setSession] = useState<Session | null>(getSession);
  useEffect(() => onAuthChange(setSession), []);

  useEffect(() => { document.title = 'Studio · Tooba'; }, []);

  if (!configured) return <Setup />;
  if (!session) return <Login />;
  return <Gate key={session.user.id} userId={session.user.id} />;
}

function Gate({ userId }: { userId: string }) {
  const { data, error } = useLoad(async () => {
    const [me] = await db.select<Profile>('profiles', `select=*&id=eq.${userId}`);
    if (!me?.is_active) return { me: me ?? null, team: [], offerings: [] };
    const [team, offerings] = await Promise.all([
      db.select<Profile>('profiles', 'select=*&order=full_name'),
      db.select<Offering>('offerings', 'select=*&order=kind,price_egp'),
    ]);
    return { me, team, offerings };
  }, [userId]);

  if (error) return <Centered><ErrorNote>{error}</ErrorNote><Btn kind="outline" onClick={signOut}>Sign out</Btn></Centered>;
  if (!data) return <Centered><Loading /></Centered>;
  if (!data.me?.is_active) {
    return (
      <Centered>
        <h1 className="st-title">Almost in</h1>
        <p className="st-muted">Your login works, but an owner still needs to activate your account before you can see the studio.</p>
        <Btn kind="outline" onClick={signOut}>Sign out</Btn>
      </Centered>
    );
  }
  return (
    <Ctx.Provider value={{ me: data.me, team: data.team, offerings: data.offerings }}>
      <Shell />
    </Ctx.Provider>
  );
}

const NAV = [
  { to: '/studio', label: 'Overview' },
  { to: '/studio/clients', label: 'Leads & clients' },
  { to: '/studio/projects', label: 'Projects' },
  { to: '/studio/activity', label: 'Activity' },
];

function Shell() {
  const path = usePath().replace(/\/+$/, '') || '/studio';
  const { me } = useStudio();
  const seg = path.split('/').filter(Boolean); // ['studio', 'projects', ':id']

  let page;
  if (seg[1] === 'clients' && seg[2]) page = <ClientDetail id={seg[2]} />;
  else if (seg[1] === 'clients') page = <Clients />;
  else if (seg[1] === 'projects' && seg[2]) page = <ProjectDetail id={seg[2]} />;
  else if (seg[1] === 'projects') page = <Projects />;
  else if (seg[1] === 'activity') page = <Activity />;
  else page = <Overview />;

  const active = (to: string) => (to === '/studio' ? path === '/studio' : path.startsWith(to));

  return (
    <div className="st-shell">
      <aside className="st-side">
        <Link to="/studio" className="st-brand"><Logo color="oat" height={34} /></Link>
        <nav className="st-nav" aria-label="Studio">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={'st-navlink' + (active(n.to) ? ' st-on' : '')}>{n.label}</Link>
          ))}
        </nav>
        <div className="st-me">
          <div>
            <div className="st-me-name">{me.full_name || me.email}</div>
            <div className="st-me-role">{me.role}</div>
          </div>
          <button className="st-linkbtn" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="st-main">{page}</main>
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="st-center">
      <div className="st-center-card">
        <Logo color="nile" height={40} />
        {children}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const act = useAction();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { act.setError('Enter your email and password'); return; }
    act.run(() => signIn(email.trim(), password));
  };
  return (
    <Centered>
      <div className="st-eyebrow"><Dots size={5} /> Studio</div>
      <h1 className="st-title">Sign in</h1>
      <form onSubmit={submit} className="st-form st-form-1">
        <label className="st-field"><span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="st-field"><span>Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <ErrorNote>{act.error}</ErrorNote>
        <Btn type="submit" disabled={act.busy}>{act.busy ? 'Signing in…' : 'Sign in'}</Btn>
      </form>
    </Centered>
  );
}

function Setup() {
  return (
    <Centered>
      <h1 className="st-title">Connect Supabase</h1>
      <p className="st-muted">
        Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to this project's environment
        variables in Vercel, then redeploy.
      </p>
    </Centered>
  );
}
