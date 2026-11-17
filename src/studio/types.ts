// Row types matching supabase/migrations/001 + 002.

export type TeamRole = 'owner' | 'designer' | 'strategist' | 'viewer';
export type ClientStatus = 'lead' | 'qualified' | 'active' | 'past' | 'lost';
export type Market = 'egypt' | 'gulf';
export type LeadSource = 'instagram' | 'tiktok' | 'whatsapp' | 'referral' | 'website' | 'linkedin' | 'other';
export type Stage = 'discovery' | 'brief' | 'routes' | 'refinement' | 'final' | 'delivered' | 'on_hold' | 'cancelled';
export type Currency = 'EGP' | 'USD';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type PaymentKind = 'deposit' | 'balance' | 'addon' | 'retainer' | 'refund';
export type DeliverableStatus = 'draft' | 'internal_review' | 'approved' | 'sent_to_client' | 'client_approved';

export const CLIENT_STATUSES: ClientStatus[] = ['lead', 'qualified', 'active', 'past', 'lost'];
export const SOURCES: LeadSource[] = ['instagram', 'tiktok', 'whatsapp', 'referral', 'website', 'linkedin', 'other'];
export const PIPELINE: Stage[] = ['discovery', 'brief', 'routes', 'refinement', 'final', 'delivered'];
export const STAGES: Stage[] = [...PIPELINE, 'on_hold', 'cancelled'];
export const QUOTE_STATUSES: QuoteStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'expired'];
export const PAYMENT_KINDS: PaymentKind[] = ['deposit', 'balance', 'addon', 'retainer', 'refund'];
export const DELIVERABLE_STATUSES: DeliverableStatus[] = ['draft', 'internal_review', 'approved', 'sent_to_client', 'client_approved'];

export interface Profile { id: string; email: string | null; full_name: string | null; role: TeamRole; is_active: boolean }

export interface Client {
  id: string; name: string; name_ar: string | null; sector: string | null; market: Market; status: ClientStatus;
  source: LeadSource | null; contact_name: string | null; phone: string | null; whatsapp: string | null;
  email: string | null; instagram: string | null; is_founding_client: boolean; notes: string | null; created_at: string;
}

export interface Offering {
  id: string; code: string; name: string; kind: 'package' | 'addon' | 'retainer'; price_egp: number; price_usd: number;
  price_is_from: boolean; routes_included: number | null; rounds_included: number | null; timeline: string | null; is_active: boolean;
}

export interface Project {
  id: string; client_id: string; package_id: string | null; owner_id: string | null; name: string; stage: Stage;
  start_date: string | null; due_date: string | null; delivered_at: string | null; is_rush: boolean; notes: string | null; created_at: string;
}

export interface Quote {
  id: string; project_id: string; quote_number: string; currency: Currency; fx_rate: number | null; discount_pct: number;
  discount_reason: string | null; status: QuoteStatus; issued_at: string; valid_until: string; notes: string | null;
}

export interface QuoteItem { id: string; quote_id: string; offering_id: string | null; description: string; quantity: number; unit_price: number; line_total: number }

export interface QuoteTotal {
  quote_id: string; project_id: string; quote_number: string; currency: Currency; status: QuoteStatus; valid_until: string;
  subtotal: number; discount: number; total: number; paid: number; balance: number; deposit_cleared: boolean;
}

export interface Payment { id: string; quote_id: string; amount: number; kind: PaymentKind; method: string | null; reference: string | null; paid_at: string }

export interface Route {
  id: string; project_id: string; route_number: number; name: string; concept: string | null; preview_path: string | null;
  is_selected: boolean; presented_at: string | null;
}

export interface Revision {
  id: string; route_id: string; round: number; client_feedback: string | null; internal_notes: string | null;
  requested_at: string; completed_at: string | null;
}

export interface Deliverable {
  id: string; project_id: string; type: string; title: string; storage_path: string | null; version: number;
  status: DeliverableStatus; approved_by: string | null; approved_at: string | null; sent_at: string | null; created_at: string;
}

export interface ProjectOverview {
  project_id: string; project_name: string; client_name: string; market: Market; package: string | null; stage: Stage;
  due_date: string | null; quote_number: string | null; currency: Currency | null; total: number | null; paid: number | null;
  balance: number | null; deposit_cleared: boolean; files_releasable: boolean; rounds_included: number | null;
  rounds_used: number; extra_rounds_to_bill: number;
}

export interface Submission {
  id: string; ref: string; client_id: string | null; business_name: string; city: string | null; industry: string | null;
  stage: string | null; services: string[] | null; package_name: string | null; estimate_egp: number | null;
  timeline: string | null; budget: string | null; language: string | null; preferred_channel: string | null; created_at: string;
}

export interface LogEntry {
  id: number; actor_id: string | null; table_name: string; record_id: string | null; action: 'insert' | 'update' | 'delete';
  changed_fields: string[] | null; old_data: Record<string, unknown> | null; new_data: Record<string, unknown> | null; created_at: string;
}
