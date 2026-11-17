// Tiny Supabase client (auth, database, storage) over fetch — no extra
// dependency. Configure with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

const URL_ = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const configured = Boolean(URL_ && KEY);

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number; // seconds since epoch
  user: { id: string; email?: string };
}

const SESSION_KEY = 'tooba-studio-session';
let session: Session | null = readSession();
const listeners = new Set<(s: Session | null) => void>();

function readSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

function setSession(s: Session | null) {
  session = s;
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* storage unavailable */ }
  listeners.forEach((fn) => fn(s));
}

export const getSession = () => session;

export function onAuthChange(fn: (s: Session | null) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function need(): { url: string; key: string } {
  if (!URL_ || !KEY) throw new Error('Supabase is not connected. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');
  return { url: URL_, key: KEY };
}

async function errorText(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return j.message || j.msg || j.error_description || j.error || res.statusText;
  } catch {
    return res.statusText || `Request failed (${res.status})`;
  }
}

function toSession(j: { access_token: string; refresh_token: string; expires_in: number; expires_at?: number; user: { id: string; email?: string } }): Session {
  return {
    access_token: j.access_token,
    refresh_token: j.refresh_token,
    expires_at: j.expires_at ?? Math.floor(Date.now() / 1000) + j.expires_in,
    user: { id: j.user.id, email: j.user.email },
  };
}

let refreshing: Promise<void> | null = null;

async function refresh() {
  const { url, key } = need();
  if (!session) return;
  const res = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!res.ok) { setSession(null); return; }
  setSession(toSession(await res.json()));
}

async function bearer(): Promise<string> {
  const { key } = need();
  if (!session) return key;
  if (session.expires_at * 1000 - Date.now() < 60_000) {
    refreshing ??= refresh().finally(() => { refreshing = null; });
    await refreshing;
  }
  return session?.access_token ?? key;
}

export async function signIn(email: string, password: string) {
  const { url, key } = need();
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await errorText(res));
  setSession(toSession(await res.json()));
}

export async function signOut() {
  if (URL_ && KEY && session) {
    await fetch(`${URL_}/auth/v1/logout`, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` },
    }).catch(() => undefined);
  }
  setSession(null);
}

async function request<T>(path: string, init: RequestInit = {}, prefer?: string): Promise<T> {
  const { url, key } = need();
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${await bearer()}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
    ...(init.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${url}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await errorText(res));
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** PostgREST helpers. `query` is a raw PostgREST query string, e.g. "select=*&status=eq.lead". */
export const db = {
  select: <T>(table: string, query = 'select=*') => request<T[]>(`/rest/v1/${table}?${query}`),
  insert: <T>(table: string, rows: object | object[]) =>
    request<T[]>(`/rest/v1/${table}`, { method: 'POST', body: JSON.stringify(rows) }, 'return=representation'),
  update: <T>(table: string, match: string, patch: object) =>
    request<T[]>(`/rest/v1/${table}?${match}`, { method: 'PATCH', body: JSON.stringify(patch) }, 'return=representation'),
  remove: (table: string, match: string) => request<void>(`/rest/v1/${table}?${match}`, { method: 'DELETE' }),
  rpc: <T>(fn: string, args: object) => request<T>(`/rest/v1/rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) }),
};

const BUCKET = 'deliverables';
const encPath = (p: string) => p.split('/').map(encodeURIComponent).join('/');

export const storage = {
  async upload(path: string, file: File) {
    const { url, key } = need();
    const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${encPath(path)}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${await bearer()}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: file,
    });
    if (!res.ok) throw new Error(await errorText(res));
    return path;
  },
  async signedUrl(path: string, seconds = 3600) {
    const j = await request<{ signedURL: string }>(`/storage/v1/object/sign/${BUCKET}/${encPath(path)}`, {
      method: 'POST',
      body: JSON.stringify({ expiresIn: seconds }),
    });
    return `${need().url}/storage/v1${j.signedURL}`;
  },
};
