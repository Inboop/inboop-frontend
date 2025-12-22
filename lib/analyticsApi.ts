/**
 * Analytics API client for communicating with the backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types matching backend DTOs

export interface OrderMetrics {
  created: number;
  delivered: number;
  cancelled: number;
  cancellationRate: number;
  byChannel: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface RevenueMetrics {
  gross: number;
  refunded: number;
  net: number;
  averageOrderValue: number;
  currency: string;
}

export interface LeadMetrics {
  created: number;
  converted: number;
  lost: number;
  closed: number;
  conversionRate: number;
  open: number;
  byChannel: Record<string, number>;
  byType: Record<string, number>;
}

export interface InboxMetrics {
  activeConversations: number;
  totalUnreadMessages: number;
  conversationsStarted: number;
  inboundMessages: number;
  outboundMessages: number;
  conversationsByChannel: Record<string, number>;
  avgFirstResponseMinutes: number;
  conversationsWithoutResponse: number;
}

export interface AnalyticsOverviewResponse {
  periodStart: string;
  periodEnd: string;
  orders: OrderMetrics;
  revenue: RevenueMetrics;
  leads: LeadMetrics;
  inbox: InboxMetrics;
}

export interface AnalyticsParams {
  from?: string; // ISO date (YYYY-MM-DD)
  to?: string;   // ISO date (YYYY-MM-DD)
  channel?: 'INSTAGRAM' | 'WHATSAPP' | 'MESSENGER';
  currency?: string;
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
 * Get analytics overview.
 */
export async function getAnalyticsOverview(params: AnalyticsParams = {}): Promise<AnalyticsOverviewResponse> {
  const searchParams = new URLSearchParams();

  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.channel) searchParams.set('channel', params.channel);
  if (params.currency) searchParams.set('currency', params.currency);

  const queryString = searchParams.toString();
  const url = `${API_URL}/api/v1/analytics/overview${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<AnalyticsOverviewResponse>(response);
}

// ==================== Formatting Helpers ====================

/**
 * Format currency value.
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toLocaleString()}`;
}

/**
 * Format currency value (full, no abbreviation).
 */
export function formatCurrencyFull(amount: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format percentage.
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format duration in minutes to human readable.
 */
export function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Get date string for N days ago.
 */
export function getDateNDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date string.
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
