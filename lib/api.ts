// ============================================
// Biondesk - Client-side API Helper
// ============================================

import type {
  Contact,
  Opportunity,
  DocumentWithItems,
  Template,
  ProfileAsset,
  PaginatedResponse,
  DashboardStats,
  AnalyticsData,
} from "./types";

const API_BASE = "/api";

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || "Request failed");
  }

  return response.json();
}

// ============================================
// Contacts API
// ============================================
export const contactsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.type) searchParams.set("type", params.type);

    const query = searchParams.toString();
    return fetchApi<PaginatedResponse<Contact>>(
      `/contacts${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) => fetchApi<Contact>(`/contacts/${id}`),

  create: (data: Partial<Contact>) =>
    fetchApi<Contact>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Contact>) =>
    fetchApi<Contact>(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/contacts/${id}`, {
      method: "DELETE",
    }),
};

// ============================================
// Opportunities API
// ============================================
export const opportunitiesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    stage?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.stage) searchParams.set("stage", params.stage);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    return fetchApi<PaginatedResponse<Opportunity>>(
      `/opportunities${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) => fetchApi<Opportunity>(`/opportunities/${id}`),

  create: (data: Partial<Opportunity>) =>
    fetchApi<Opportunity>("/opportunities", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Opportunity>) =>
    fetchApi<Opportunity>(`/opportunities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/opportunities/${id}`, {
      method: "DELETE",
    }),
};

// ============================================
// Documents API (Quotes, Invoices, Proposals)
// ============================================
export const documentsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    type?: "quote" | "invoice" | "proposal";
    status?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.type) searchParams.set("type", params.type);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    return fetchApi<PaginatedResponse<DocumentWithItems>>(
      `/documents${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) => fetchApi<DocumentWithItems>(`/documents/${id}`),

  create: (data: {
    type: "quote" | "invoice" | "proposal";
    contact_id?: string;
    opportunity_id?: string;
    title?: string;
    content?: string;
    status?: "draft" | "sent" | "viewed" | "accepted" | "paid" | "overdue";
    amount?: number;
    tax?: number;
    discount?: number;
    deposit?: number;
    terms?: string;
    notes?: string;
    valid_until?: string;
    due_date?: string;
    reference?: string;
    items?: { description: string; quantity: number; unit_price: number }[];
  }) =>
    fetchApi<DocumentWithItems>("/documents", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: Omit<Partial<DocumentWithItems>, "items"> & {
      items?: { description: string; quantity: number; unit_price: number }[];
    },
  ) =>
    fetchApi<DocumentWithItems>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/documents/${id}`, {
      method: "DELETE",
    }),

  send: (id: string) =>
    fetchApi<{
      success: boolean;
      document: DocumentWithItems;
      publicUrl: string;
    }>(`/documents/${id}/send`, {
      method: "POST",
    }),
};

// Convenience aliases
export const quotesApi = {
  ...documentsApi,
  list: (params?: Omit<Parameters<typeof documentsApi.list>[0], "type">) =>
    documentsApi.list({ ...params, type: "quote" }),
  create: (data: Omit<Parameters<typeof documentsApi.create>[0], "type">) =>
    documentsApi.create({ ...data, type: "quote" }),
};

export const invoicesApi = {
  ...documentsApi,
  list: (params?: Omit<Parameters<typeof documentsApi.list>[0], "type">) =>
    documentsApi.list({ ...params, type: "invoice" }),
  create: (data: Omit<Parameters<typeof documentsApi.create>[0], "type">) =>
    documentsApi.create({ ...data, type: "invoice" }),
};

// ============================================
// Templates API
// ============================================
export const templatesApi = {
  list: (params?: { type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);

    const query = searchParams.toString();
    return fetchApi<{ data: Template[] }>(
      `/templates${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) => fetchApi<Template>(`/templates/${id}`),

  create: (data: Partial<Template>) =>
    fetchApi<Template>("/templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Template>) =>
    fetchApi<Template>(`/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/templates/${id}`, {
      method: "DELETE",
    }),
};

// ============================================
// Profile Assets API
// ============================================
export const profileAssetsApi = {
  list: (params?: { type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);

    const query = searchParams.toString();
    return fetchApi<{ data: ProfileAsset[] }>(
      `/profile-assets${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) => fetchApi<ProfileAsset>(`/profile-assets/${id}`),

  create: (data: Partial<ProfileAsset>) =>
    fetchApi<ProfileAsset>("/profile-assets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<ProfileAsset>) =>
    fetchApi<ProfileAsset>(`/profile-assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/profile-assets/${id}`, {
      method: "DELETE",
    }),
};

// ============================================
// Dashboard API
// ============================================
export const dashboardApi = {
  getStats: () =>
    fetchApi<
      DashboardStats & {
        workspace: { id: string; name: string; currency: string };
      }
    >("/dashboard"),
};

// ============================================
// Analytics API
// ============================================
export const analyticsApi = {
  getData: (period: "week" | "month" | "year" = "month") =>
    fetchApi<AnalyticsData>(`/analytics?period=${period}`),
};

// ============================================
// Public Document API (no auth required)
// ============================================
export const publicApi = {
  getDocument: (token: string) =>
    fetchApi<DocumentWithItems>(`/public/${token}`),

  acceptQuote: (
    token: string,
    data?: { signature_name?: string; signature?: string },
  ) =>
    fetchApi<{ success: boolean; message: string }>(`/public/${token}/accept`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    }),
};

// ============================================
// Reminders API
// ============================================
export const remindersApi = {
  getRules: () => fetchApi<any[]>("/reminders/rules"),
  toggleRule: (id: string, isActive: boolean) =>
    fetchApi<{ success: boolean }>("/reminders/rules", {
      method: "PUT",
      body: JSON.stringify({ id, isActive }),
    }),
  getScheduled: () => fetchApi<any[]>("/reminders/scheduled"),
  createScheduled: (data: {
    document_id: string;
    scheduled_at: string;
    content?: string;
  }) =>
    fetchApi<any>("/reminders/scheduled", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteScheduled: (id: string) =>
    fetchApi<{ success: boolean }>(`/reminders/scheduled/${id}`, {
      method: "DELETE",
    }),
  getHistory: () => fetchApi<any[]>("/reminders/history"),
};
