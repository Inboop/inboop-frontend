/**
 * Leads API client for communicating with the backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types matching backend DTOs

export type ChannelType = 'INSTAGRAM' | 'WHATSAPP' | 'MESSENGER';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'NEGOTIATING' | 'CONVERTED' | 'CLOSED' | 'LOST' | 'SPAM';
export type LeadType = 'INQUIRY' | 'ORDER_REQUEST' | 'SUPPORT' | 'COMPLAINT' | 'OTHER';
export type LeadSource = 'AI' | 'MANUAL';
export type AssignmentFilter = 'any' | 'me' | 'unassigned';

export interface LeadListItem {
  id: number;
  channel: ChannelType;
  customerHandle: string;
  customerName: string | null;
  profilePicture: string | null;
  status: LeadStatus;
  type: LeadType;
  source: LeadSource | null;
  lastMessageSnippet: string | null;
  lastMessageAt: string | null;
  value: number | null;
  assignedToUserId: number | null;
  assignedToUserName: string | null;
  conversationId: number | null;
  convertedOrderId: number | null;
  convertedOrderNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagedLeadResponse {
  items: LeadListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ListLeadsParams {
  status?: LeadStatus;
  type?: LeadType;
  channel?: ChannelType;
  assignedTo?: AssignmentFilter;
  source?: LeadSource;
  q?: string;
  createdFrom?: string; // ISO date
  createdTo?: string; // ISO date
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'lastMessageAt_desc' | 'value_desc';
  page?: number;
  pageSize?: number;
}

export interface AssignLeadRequest {
  assignedToUserId: number | null;
}

// Helper to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

// Helper to build headers
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper to handle response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  return response.json();
}

/**
 * List leads with filtering and pagination.
 */
export async function listLeads(params: ListLeadsParams = {}): Promise<PagedLeadResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set('status', params.status);
  if (params.type) searchParams.set('type', params.type);
  if (params.channel) searchParams.set('channel', params.channel);
  if (params.assignedTo && params.assignedTo !== 'any') searchParams.set('assignedTo', params.assignedTo);
  if (params.source) searchParams.set('source', params.source);
  if (params.q) searchParams.set('q', params.q);
  if (params.createdFrom) searchParams.set('createdFrom', params.createdFrom);
  if (params.createdTo) searchParams.set('createdTo', params.createdTo);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());

  const queryString = searchParams.toString();
  const url = `${API_URL}/api/v1/leads${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<PagedLeadResponse>(response);
}

/**
 * Assign lead to a user.
 * Pass null to unassign.
 */
export async function assignLead(leadId: number, request: AssignLeadRequest): Promise<LeadListItem> {
  const response = await fetch(`${API_URL}/api/v1/leads/${leadId}/assign`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(request),
  });

  return handleResponse<LeadListItem>(response);
}

/**
 * Assign lead to the current user (self-assign).
 */
export async function assignLeadToMe(leadId: number): Promise<LeadListItem> {
  const response = await fetch(`${API_URL}/api/v1/leads/${leadId}/assign-to-me`, {
    method: 'POST',
    headers: buildHeaders(),
  });

  return handleResponse<LeadListItem>(response);
}
