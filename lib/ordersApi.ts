/**
 * Orders API client for communicating with the backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types matching backend DTOs

export type OrderStatus = 'NEW' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'ONLINE' | 'COD' | 'MANUAL' | 'BANK_TRANSFER';
export type ChannelType = 'INSTAGRAM' | 'WHATSAPP' | 'MESSENGER';

export interface OrderListItem {
  id: number;
  orderNumber: string;
  customerName: string | null;
  customerHandle: string | null;
  channel: ChannelType | null;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus | null;
  paymentMethod: PaymentMethod | null;
  totalAmount: number | null;
  currency: string | null;
  assignedToUserId: number | null;
  assignedToUserName: string | null;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface PagedOrderResponse {
  items: OrderListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ShippingAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface TrackingInfo {
  carrier: string | null;
  trackingId: string | null;
  trackingUrl: string | null;
}

export interface OrderTimelineEvent {
  id: number;
  type: string;
  description: string;
  actorType: 'USER' | 'SYSTEM';
  actorUserId: number | null;
  actorUserName: string | null;
  source: string;
  createdAt: string;
}

export interface OrderDetail extends OrderListItem {
  conversationId: number | null;
  leadId: number | null;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  tracking: TrackingInfo | null;
  notes: string | null;
  timeline: OrderTimelineEvent[];
}

// Query parameters for listing orders
export interface ListOrdersParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  channel?: ChannelType;
  assignedTo?: 'me' | 'unassigned' | 'any' | string;
  q?: string;
  createdFrom?: string; // ISO date
  createdTo?: string; // ISO date
  sort?: 'createdAt_desc' | 'createdAt_asc';
  page?: number;
  pageSize?: number;
}

// Request types for actions
export interface ShipOrderRequest {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  note?: string;
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface RefundOrderRequest {
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
}

export interface AssignOrderRequest {
  assignedToUserId: number | null;
}

// Request type for creating an order
export interface CreateOrderRequest {
  conversationId: number;
  leadId?: number;
  items?: CreateOrderItemRequest[];
  totalAmount?: number;
  currency?: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  idempotencyKey?: string;
}

export interface CreateOrderItemRequest {
  name: string;
  quantity?: number;
  unitPrice?: number;
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
 * List orders with filtering and pagination.
 */
export async function listOrders(params: ListOrdersParams = {}): Promise<PagedOrderResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set('status', params.status);
  if (params.paymentStatus) searchParams.set('paymentStatus', params.paymentStatus);
  if (params.paymentMethod) searchParams.set('paymentMethod', params.paymentMethod);
  if (params.channel) searchParams.set('channel', params.channel);
  if (params.assignedTo) searchParams.set('assignedTo', params.assignedTo);
  if (params.q) searchParams.set('q', params.q);
  if (params.createdFrom) searchParams.set('createdFrom', params.createdFrom);
  if (params.createdTo) searchParams.set('createdTo', params.createdTo);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());

  const queryString = searchParams.toString();
  const url = `${API_URL}/api/v1/orders${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<PagedOrderResponse>(response);
}

/**
 * Get order detail by ID.
 */
export async function getOrder(orderId: number): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Confirm an order.
 */
export async function confirmOrder(orderId: number): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: buildHeaders(),
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Ship an order.
 */
export async function shipOrder(orderId: number, request?: ShipOrderRequest): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/ship`, {
    method: 'POST',
    headers: buildHeaders(),
    body: request ? JSON.stringify(request) : undefined,
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Mark order as delivered.
 */
export async function deliverOrder(orderId: number): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/deliver`, {
    method: 'POST',
    headers: buildHeaders(),
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Cancel an order.
 */
export async function cancelOrder(orderId: number, request?: CancelOrderRequest): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: buildHeaders(),
    body: request ? JSON.stringify(request) : undefined,
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Refund an order.
 */
export async function refundOrder(orderId: number, request?: RefundOrderRequest): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/refund`, {
    method: 'POST',
    headers: buildHeaders(),
    body: request ? JSON.stringify(request) : undefined,
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Update payment status.
 */
export async function updatePaymentStatus(orderId: number, request: UpdatePaymentStatusRequest): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/payment-status`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(request),
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Assign order to a user.
 */
export async function assignOrder(orderId: number, request: AssignOrderRequest): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/assign`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(request),
  });

  return handleResponse<OrderDetail>(response);
}

/**
 * Create a new order.
 */
export async function createOrder(request: CreateOrderRequest): Promise<OrderDetail> {
  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(request),
  });

  return handleResponse<OrderDetail>(response);
}
