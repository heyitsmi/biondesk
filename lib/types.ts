// ============================================
// Biondesk - TypeScript Types for Database Entities
// ============================================

// Base types
export interface Timestamps {
  created_at: string;
  updated_at: string;
}

// ============================================
// Users & Auth
// ============================================
export interface User extends Timestamps {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  plan: "free" | "pro" | "studio";
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

// ============================================
// Workspaces
// ============================================
export interface Workspace extends Timestamps {
  id: string;
  user_id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  currency: string;
  locale: string;
  default_payment_link: string | null;
  bank_details: Record<string, unknown> | null;
  username: string | null;
  services?: string[];
}

// ============================================
// Contacts
// ============================================
export type ContactType = "lead" | "client";

export interface Contact extends Timestamps {
  id: string;
  workspace_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  type: ContactType;
  total_value: number;
  avg_time_to_pay: number | null;
  notes: string | null;
}

export interface ContactWithStats extends Contact {
  documents_count?: number;
  opportunities_count?: number;
}

// ============================================
// Opportunities
// ============================================
export type OpportunitySource =
  | "upwork"
  | "linkedin"
  | "direct"
  | "referral"
  | "email"
  | "other";
export type OpportunityStage =
  | "inbox"
  | "drafting"
  | "sent"
  | "negotiation"
  | "won"
  | "lost";
export type Priority = "low" | "medium" | "high";

export interface Opportunity extends Timestamps {
  id: string;
  workspace_id: string;
  contact_id: string | null;
  title: string;
  description: string | null;
  source: OpportunitySource | null;
  stage: OpportunityStage;
  priority: Priority;
  value: number | null;
  job_link: string | null;
  notes: string | null;
  client_name: string | null;
  budget_type: "fixed" | "hourly" | "tbd" | null;
  country_code: string | null;
  sort_order: number;
}

export interface OpportunityWithContact extends Opportunity {
  contact?: Contact | null;
}

// ============================================
// Documents (Proposals, Quotes, Invoices)
// ============================================
export type DocumentType = "proposal" | "quote" | "invoice";
export type DocumentStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "paid"
  | "overdue";

export interface Document extends Timestamps {
  id: string;
  workspace_id: string;
  contact_id: string | null;
  opportunity_id: string | null;
  type: DocumentType;
  number: string;
  title: string | null;
  content: string | null;
  status: DocumentStatus;
  amount: number;
  currency: string;
  tax: number;
  discount: number;
  deposit: number;
  terms: string | null;
  notes: string | null;
  valid_until: string | null;
  due_date: string | null;
  public_token: string | null;
  view_count: number;
  sent_at: string | null;
  accepted_at: string | null;
  paid_at: string | null;
  signature: string | null;
  reference: string | null;
}

export interface DocumentItem {
  id: string;
  document_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
  notes: string | null;
}

export interface DocumentWithItems extends Document {
  items: DocumentItem[];
  contact?: Contact | null;
  workspace?: Workspace | null;
}

// ============================================
// Templates
// ============================================
export interface Template extends Timestamps {
  id: string;
  workspace_id: string;
  type: DocumentType;
  name: string;
  content: string | null;
  default_terms: string | null;
  default_notes: string | null;
  default_items: DocumentItem[] | null;
  used_count: number;
}

// ============================================
// Profile Library Assets
// ============================================
export type ProfileAssetType =
  | "portfolio"
  | "testimonial"
  | "snippet"
  | "profile_info";

export interface ProfileAsset extends Timestamps {
  id: string;
  workspace_id: string;
  type: ProfileAssetType;
  title: string;
  content: string | null;
  tags: string[];
  image_url: string | null;
}

// ============================================
// Payments
// ============================================
export type PaymentMethod =
  | "bank_transfer"
  | "stripe"
  | "paypal"
  | "midtrans"
  | "cash"
  | "other";

export interface Payment {
  id: string;
  document_id: string;
  amount: number;
  method: PaymentMethod | null;
  paid_at: string;
  notes: string | null;
  proof_url: string | null;
}

// ============================================
// Reminder Rules & Jobs
// ============================================
export type ReminderType = "pre_due" | "overdue" | "quote_followup";

export interface ReminderRule {
  id: string;
  workspace_id: string;
  type: ReminderType;
  title: string;
  days_offset: number;
  template_content: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ReminderJob {
  id: string;
  document_id: string;
  rule_id: string | null;
  scheduled_at: string;
  sent_at: string | null;
  status: "pending" | "sent" | "cancelled";
  content: string | null;
}

// ============================================
// Events (Activity Log)
// ============================================
export type EntityType = "document" | "opportunity" | "contact" | "payment";
export type EventAction =
  | "created"
  | "updated"
  | "sent"
  | "viewed"
  | "accepted"
  | "paid"
  | "won"
  | "lost"
  | "reminder_sent";

export interface Event {
  id: string;
  workspace_id: string;
  entity_type: EntityType;
  entity_id: string;
  action: EventAction;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ============================================
// API Request/Response Types
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export interface DashboardStats {
  totalRevenue: number;
  paidThisMonth: number;
  pendingAmount: number;
  overdueAmount: number;
  activeOpportunities: number;
  wonDeals: number;
  totalContacts: number;
  recentActivity: Event[];
}

export interface AnalyticsData {
  period: string;
  revenue: { date: string; amount: number }[];
  documents: { date: string; count: number; type: DocumentType }[];
  opportunities: { stage: OpportunityStage; count: number; value: number }[];
}
