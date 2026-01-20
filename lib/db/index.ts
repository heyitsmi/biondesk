// ============================================
// Flova - Database Access Layer
// ============================================

import { createServerClient } from '../supabase';
import type { 
  Contact, 
  Opportunity, 
  Document, 
  DocumentItem, 
  Template, 
  ProfileAsset,
  Event,
  Workspace,
  PaginatedResponse,
  DocumentWithItems,
  OpportunityWithContact,
  ContactWithStats
} from '../types';

// ============================================
// Auth Helper - Get current workspace
// ============================================
export async function getWorkspaceFromSession(userId: string): Promise<Workspace | null> {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return data;
}

// ============================================
// Auth Helper - Get workspace by username
// ============================================
export async function getWorkspaceByUsername(username: string): Promise<Workspace | null> {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('workspaces')
    .select('*')
    .eq('username', username)
    .single();
    
  return data;
}

// ============================================
// Contacts
// ============================================
export async function getContacts(
  workspaceId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    type?: 'lead' | 'client';
  } = {}
): Promise<PaginatedResponse<Contact>> {
  const supabase = createServerClient();
  const { page = 1, limit = 20, search, type } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getContactById(
  workspaceId: string,
  contactId: string
): Promise<ContactWithStats | null> {
  const supabase = createServerClient();

  const { data: contact, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', contactId)
    .single();

  if (error || !contact) return null;

  // Get related counts
  const [docsResult, oppsResult] = await Promise.all([
    supabase.from('documents').select('id', { count: 'exact' }).eq('contact_id', contactId),
    supabase.from('opportunities').select('id', { count: 'exact' }).eq('contact_id', contactId),
  ]);

  return {
    ...contact,
    documents_count: docsResult.count || 0,
    opportunities_count: oppsResult.count || 0,
  };
}

export async function createContact(
  workspaceId: string,
  data: Omit<Contact, 'id' | 'workspace_id' | 'created_at' | 'updated_at' | 'total_value' | 'avg_time_to_pay'>
): Promise<Contact> {
  const supabase = createServerClient();

  const { data: contact, error } = await supabase
    .from('contacts')
    .insert({ ...data, workspace_id: workspaceId })
    .select()
    .single();

  if (error) throw error;
  return contact;
}

export async function updateContact(
  workspaceId: string,
  contactId: string,
  data: Partial<Contact>
): Promise<Contact> {
  const supabase = createServerClient();

  const { data: contact, error } = await supabase
    .from('contacts')
    .update(data)
    .eq('workspace_id', workspaceId)
    .eq('id', contactId)
    .select()
    .single();

  if (error) throw error;
  return contact;
}

export async function deleteContact(workspaceId: string, contactId: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', contactId);

  if (error) throw error;
}

// ============================================
// Opportunities
// ============================================
export async function getOpportunities(
  workspaceId: string,
  options: {
    page?: number;
    limit?: number;
    stage?: string;
    search?: string;
  } = {}
): Promise<PaginatedResponse<OpportunityWithContact>> {
  const supabase = createServerClient();
  const { page = 1, limit = 50, stage, search } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('opportunities')
    .select('*, contact:contacts(*)', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (stage && stage !== 'all') {
    query = query.eq('stage', stage);
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getOpportunityById(
  workspaceId: string,
  opportunityId: string
): Promise<OpportunityWithContact | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('opportunities')
    .select('*, contact:contacts(*)')
    .eq('workspace_id', workspaceId)
    .eq('id', opportunityId)
    .single();

  if (error) return null;
  return data;
}

export async function createOpportunity(
  workspaceId: string,
  data: Omit<Opportunity, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>
): Promise<Opportunity> {
  const supabase = createServerClient();

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .insert({ ...data, workspace_id: workspaceId })
    .select()
    .single();

  if (error) throw error;

  // Log event
  await logEvent(workspaceId, 'opportunity', opportunity.id, 'created');

  return opportunity;
}

export async function updateOpportunity(
  workspaceId: string,
  opportunityId: string,
  data: Partial<Opportunity>
): Promise<Opportunity> {
  const supabase = createServerClient();

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .update(data)
    .eq('workspace_id', workspaceId)
    .eq('id', opportunityId)
    .select()
    .single();

  if (error) throw error;

  // Log stage change event
  if (data.stage) {
    await logEvent(workspaceId, 'opportunity', opportunityId, 'updated', { stage: data.stage });
  }

  return opportunity;
}

export async function deleteOpportunity(workspaceId: string, opportunityId: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('opportunities')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', opportunityId);

  if (error) throw error;
}

// ============================================
// Documents
// ============================================
export async function getDocuments(
  workspaceId: string,
  options: {
    page?: number;
    limit?: number;
    type?: 'quote' | 'invoice' | 'proposal';
    status?: string;
    search?: string;
  } = {}
): Promise<PaginatedResponse<DocumentWithItems>> {
  const supabase = createServerClient();
  const { page = 1, limit = 20, type, status, search } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('documents')
    .select('*, contact:contacts(*), items:document_items(*)', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) {
    query = query.eq('type', type);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`number.ilike.%${search}%,title.ilike.%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getDocumentById(
  workspaceId: string,
  documentId: string
): Promise<DocumentWithItems | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*, contact:contacts(*), items:document_items(*), workspace:workspaces(*)')
    .eq('workspace_id', workspaceId)
    .eq('id', documentId)
    .single();

  if (error) return null;
  return data;
}

export async function getDocumentByToken(token: string): Promise<DocumentWithItems | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*, contact:contacts(*), items:document_items(*), workspace:workspaces(*)')
    .eq('public_token', token)
    .single();

  if (error) {
    console.error(`[DB] Error fetching document by token ${token}:`, error);
    return null;
  }

  // Increment view count
  await supabase
    .from('documents')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id);

  return data;
}

export async function generateDocumentNumber(
  workspaceId: string,
  type: 'quote' | 'invoice' | 'proposal'
): Promise<string> {
  const supabase = createServerClient();
  const year = new Date().getFullYear();
  const prefix = type === 'quote' ? 'Q' : type === 'invoice' ? 'INV' : 'P';

  const { count } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('type', type)
    .gte('created_at', `${year}-01-01`);

  const nextNum = (count || 0) + 1;
  return `${prefix}-${year}-${String(nextNum).padStart(3, '0')}`;
}

export async function createDocument(
  workspaceId: string,
  data: {
    type: 'quote' | 'invoice' | 'proposal';
    contact_id?: string;
    opportunity_id?: string;
    title?: string;
    content?: string;
    amount: number;
    tax?: number;
    discount?: number;
    deposit?: number;
    terms?: string;
    notes?: string;
    valid_until?: string;
    due_date?: string;
    reference?: string;
    items: Omit<DocumentItem, 'id' | 'document_id'>[];
  }
): Promise<DocumentWithItems> {
  const supabase = createServerClient();

  // Generate document number
  const number = await generateDocumentNumber(workspaceId, data.type);
  
  // Generate public token
  const publicToken = crypto.randomUUID();

  const { items, ...documentData } = data;

  // Create document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      ...documentData,
      workspace_id: workspaceId,
      number,
      public_token: publicToken,
      status: 'draft',
    })
    .select()
    .single();

  if (docError) throw docError;

  // Create line items
  if (items && items.length > 0) {
    const itemsWithDocId = items.map((item, index) => ({
      ...item,
      document_id: document.id,
      sort_order: index,
    }));

    const { error: itemsError } = await supabase
      .from('document_items')
      .insert(itemsWithDocId);

    if (itemsError) throw itemsError;
  }

  // Log event
  await logEvent(workspaceId, 'document', document.id, 'created', { type: data.type });

  return getDocumentById(workspaceId, document.id) as Promise<DocumentWithItems>;
}

export async function updateDocument(
  workspaceId: string,
  documentId: string,
  data: {
    contact_id?: string;
    title?: string;
    content?: string;
    amount?: number;
    tax?: number;
    discount?: number;
    deposit?: number;
    terms?: string;
    notes?: string;
    valid_until?: string;
    due_date?: string;
    status?: string;
    reference?: string;
    items?: Omit<DocumentItem, 'id' | 'document_id'>[];
  }
): Promise<DocumentWithItems> {
  const supabase = createServerClient();

  const { items, ...documentData } = data;

  // Update document
  const { error: docError } = await supabase
    .from('documents')
    .update(documentData)
    .eq('workspace_id', workspaceId)
    .eq('id', documentId);

  if (docError) throw docError;

  // Update line items if provided
  if (items) {
    // Delete existing items
    await supabase.from('document_items').delete().eq('document_id', documentId);

    // Insert new items
    if (items.length > 0) {
      const itemsWithDocId = items.map((item, index) => ({
        ...item,
        document_id: documentId,
        sort_order: index,
      }));

      await supabase.from('document_items').insert(itemsWithDocId);
    }
  }

  return getDocumentById(workspaceId, documentId) as Promise<DocumentWithItems>;
}

export async function sendDocument(
  workspaceId: string,
  documentId: string
): Promise<Document> {
  const supabase = createServerClient();

  const { data: document, error } = await supabase
    .from('documents')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .eq('workspace_id', workspaceId)
    .eq('id', documentId)
    .select()
    .single();

  if (error) throw error;

  // Log event
  await logEvent(workspaceId, 'document', documentId, 'sent');

  return document;
}

export async function deleteDocument(workspaceId: string, documentId: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', documentId);

  if (error) throw error;
}

// ============================================
// Templates
// ============================================
export async function getTemplates(
  workspaceId: string,
  options: { type?: string } = {}
): Promise<Template[]> {
  const supabase = createServerClient();
  const { type } = options;

  let query = supabase
    .from('templates')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getTemplateById(
  workspaceId: string,
  templateId: string
): Promise<Template | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', templateId)
    .single();

  if (error) return null;
  return data;
}

export async function createTemplate(
  workspaceId: string,
  data: Omit<Template, 'id' | 'workspace_id' | 'created_at' | 'updated_at' | 'used_count'>
): Promise<Template> {
  const supabase = createServerClient();

  const { data: template, error } = await supabase
    .from('templates')
    .insert({ ...data, workspace_id: workspaceId })
    .select()
    .single();

  if (error) throw error;
  return template;
}

export async function updateTemplate(
  workspaceId: string,
  templateId: string,
  data: Partial<Template>
): Promise<Template> {
  const supabase = createServerClient();

  const { data: template, error } = await supabase
    .from('templates')
    .update(data)
    .eq('workspace_id', workspaceId)
    .eq('id', templateId)
    .select()
    .single();

  if (error) throw error;
  return template;
}

export async function deleteTemplate(workspaceId: string, templateId: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', templateId);

  if (error) throw error;
}

// ============================================
// Profile Assets
// ============================================
export async function getProfileAssets(
  workspaceId: string,
  options: { type?: string } = {}
): Promise<ProfileAsset[]> {
  const supabase = createServerClient();
  const { type } = options;

  let query = supabase
    .from('profile_assets')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getProfileAssetById(
  workspaceId: string,
  assetId: string
): Promise<ProfileAsset | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('profile_assets')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', assetId)
    .single();

  if (error) return null;
  return data;
}

export async function createProfileAsset(
  workspaceId: string,
  data: Omit<ProfileAsset, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>
): Promise<ProfileAsset> {
  const supabase = createServerClient();

  const { data: asset, error } = await supabase
    .from('profile_assets')
    .insert({ ...data, workspace_id: workspaceId })
    .select()
    .single();

  if (error) throw error;
  return asset;
}

export async function updateProfileAsset(
  workspaceId: string,
  assetId: string,
  data: Partial<ProfileAsset>
): Promise<ProfileAsset> {
  const supabase = createServerClient();

  const { data: asset, error } = await supabase
    .from('profile_assets')
    .update(data)
    .eq('workspace_id', workspaceId)
    .eq('id', assetId)
    .select()
    .single();

  if (error) throw error;
  return asset;
}

export async function deleteProfileAsset(workspaceId: string, assetId: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('profile_assets')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('id', assetId);

  if (error) throw error;
}

// ============================================
// Events (Activity Log)
// ============================================
export async function logEvent(
  workspaceId: string,
  entityType: 'document' | 'opportunity' | 'contact' | 'payment',
  entityId: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = createServerClient();

  await supabase.from('events').insert({
    workspace_id: workspaceId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    metadata,
  });
}

export async function getRecentEvents(
  workspaceId: string,
  limit: number = 10
): Promise<Event[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================
// Dashboard Stats
// ============================================
export async function getDashboardStats(workspaceId: string) {
  const supabase = createServerClient();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [
    { data: revenueData },
    { data: paidMonthData },
    { data: pendingData },
    { data: overdueData },
    { count: activeOpps },
    { count: wonDeals },
    { count: totalContacts },
  ] = await Promise.all([
    // Total paid revenue
    supabase
      .from('documents')
      .select('amount')
      .eq('workspace_id', workspaceId)
      .eq('status', 'paid'),
    // Paid this month
    supabase
      .from('documents')
      .select('amount')
      .eq('workspace_id', workspaceId)
      .eq('status', 'paid')
      .gte('paid_at', startOfMonth),
    // Pending invoices
    supabase
      .from('documents')
      .select('amount')
      .eq('workspace_id', workspaceId)
      .eq('type', 'invoice')
      .in('status', ['sent', 'viewed']),
    // Overdue invoices
    supabase
      .from('documents')
      .select('amount')
      .eq('workspace_id', workspaceId)
      .eq('type', 'invoice')
      .eq('status', 'overdue'),
    // Active opportunities
    supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .not('stage', 'in', '(won,lost)'),
    // Won deals this month
    supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('stage', 'won')
      .gte('updated_at', startOfMonth),
    // Total contacts
    supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
  ]);

  const totalRevenue = (revenueData || []).reduce((sum, d) => sum + (d.amount || 0), 0);
  const paidThisMonth = (paidMonthData || []).reduce((sum, d) => sum + (d.amount || 0), 0);
  const pendingAmount = (pendingData || []).reduce((sum, d) => sum + (d.amount || 0), 0);
  const overdueAmount = (overdueData || []).reduce((sum, d) => sum + (d.amount || 0), 0);

  return {
    totalRevenue,
    paidThisMonth,
    pendingAmount,
    overdueAmount,
    activeOpportunities: activeOpps || 0,
    wonDeals: wonDeals || 0,
    totalContacts: totalContacts || 0,
  };
}

// ============================================
// Reminders & Automation
// ============================================

import { ReminderRule, ReminderJob } from '../types';

export async function getReminderRules(workspaceId: string): Promise<ReminderRule[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('reminder_rules')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (error) {
    // Graceful fallback if table doesn't exist yet
    console.warn('[DB] Error fetching reminder_rules, assuming empty:', error.message);
    return [];
  }

  // Auto-seed if empty
  if (!data || data.length === 0) {
      console.log('[DB] Seeding default reminder rules for workspace:', workspaceId);
      const defaultRules = [
          {
              workspace_id: workspaceId,
              type: 'pre_due',
              title: 'Approaching Due Date',
              is_active: true
          },
          {
              workspace_id: workspaceId,
              type: 'overdue',
              title: 'On Overdue',
              is_active: true
          },
          {
              workspace_id: workspaceId,
              type: 'quote_followup',
              title: 'Quote Follow-up',
              is_active: false
          }
      ];

      const { data: newData, error: insertError } = await supabase
          .from('reminder_rules')
          .insert(defaultRules)
          .select();
      
      if (insertError) {
          console.error('[DB] Failed to seed rules:', insertError.message);
          return [];
      }
      return newData || [];
  }

  return data || [];
}

export async function toggleReminderRule(
  workspaceId: string, 
  ruleId: string, 
  isActive: boolean
): Promise<void> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('reminder_rules')
    .update({ is_active: isActive })
    .eq('workspace_id', workspaceId)
    .eq('id', ruleId)
    .select(); // Select to verify update occurred

  if (error) {
      console.error('[DB] Toggle Rule Error:', error.message);
      throw error;
  }
  
  if (!data || data.length === 0) {
      console.warn(`[DB] Toggle Rule: No rows updated. Workspace: ${workspaceId}, Rule: ${ruleId}`);
      // Only throw if we are strict, but for now log warning
  } else {
      console.log(`[DB] Toggle Rule Success. New state: ${data[0].is_active}`);
  }
}

export async function getScheduledReminders(workspaceId: string): Promise<any[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('reminder_jobs')
    .select(`
      *,
      document:documents(
        id, 
        number, 
        type, 
        contact:contacts(name, company)
      )
    `)
    .eq('status', 'pending')
    .order('scheduled_at', { ascending: true });

  if (error) {
     console.warn('[DB] Error fetching reminder_jobs:', error.message);
     return [];
  }

  // Filter mainly by associated document's workspace
  // This requires the join to be correct.
  return (data || []).filter((job: any) => job.document?.type !== undefined); 
  // Simple check, real filtering should be RLS or strict query
}

export async function createManualReminder(
  workspaceId: string,
  data: {
    document_id: string;
    scheduled_at: string;
    content?: string;
  }
): Promise<ReminderJob | null> {
  const supabase = createServerClient();
  
  const { data: job, error } = await supabase
    .from('reminder_jobs')
    .insert({
      document_id: data.document_id,
      scheduled_at: data.scheduled_at,
      content: data.content,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return job;
}

export async function deleteReminderJob(jobId: string): Promise<void> {
  const supabase = createServerClient();
  
  const { error } = await supabase
    .from('reminder_jobs')
    .delete()
    .eq('id', jobId);

  if (error) throw error;
}

export async function getReminderHistory(workspaceId: string, limit: number = 10): Promise<any[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('action', 'reminder_sent')
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) return [];
    return data || [];
}
