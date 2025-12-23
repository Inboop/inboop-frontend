/**
 * Inbox/Conversations API client for communicating with the backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types matching backend DTOs

export type ChannelType = 'INSTAGRAM' | 'WHATSAPP' | 'MESSENGER';
export type IntentLabel = 'BUYING' | 'SUPPORT' | 'BROWSING' | 'SPAM' | 'OTHER';
export type AssignmentFilter = 'any' | 'me' | 'unassigned';

export interface ConversationListItem {
  id: number;
  channel: ChannelType;
  customerHandle: string;
  customerName: string | null;
  profilePicture: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
  intentLabel: IntentLabel | null;
  intentConfidence: number | null;
  assignedToUserId: number | null;
  assignedToUserName: string | null;
  leadCount: number;
  orderCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PagedConversationResponse {
  items: ConversationListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ListConversationsParams {
  channel?: ChannelType;
  assignedTo?: AssignmentFilter;
  intent?: IntentLabel;
  isActive?: boolean;
  q?: string;
  sort?: 'lastMessageAt_desc' | 'lastMessageAt_asc' | 'createdAt_desc';
  page?: number;
  pageSize?: number;
}

export interface AssignConversationRequest {
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
 * List conversations with filtering and pagination.
 */
export async function listConversations(params: ListConversationsParams = {}): Promise<PagedConversationResponse> {
  const searchParams = new URLSearchParams();

  if (params.channel) searchParams.set('channel', params.channel);
  if (params.assignedTo && params.assignedTo !== 'any') searchParams.set('assignedTo', params.assignedTo);
  if (params.intent) searchParams.set('intent', params.intent);
  if (params.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
  if (params.q) searchParams.set('q', params.q);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());

  const queryString = searchParams.toString();
  const url = `${API_URL}/api/v1/conversations${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<PagedConversationResponse>(response);
}

/**
 * Assign conversation to a user.
 * Pass null to unassign.
 */
export async function assignConversation(conversationId: number, request: AssignConversationRequest): Promise<ConversationListItem> {
  const response = await fetch(`${API_URL}/api/v1/conversations/${conversationId}/assign`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(request),
  });

  return handleResponse<ConversationListItem>(response);
}

/**
 * Assign conversation to the current user (self-assign).
 */
export async function assignConversationToMe(conversationId: number): Promise<ConversationListItem> {
  const response = await fetch(`${API_URL}/api/v1/conversations/${conversationId}/assign-to-me`, {
    method: 'POST',
    headers: buildHeaders(),
  });

  return handleResponse<ConversationListItem>(response);
}
