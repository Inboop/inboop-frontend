import { ChannelType } from '@/types';
import { OrderStatus } from '@/components/orders/OrderStatusBadge';

// Extended Order interface with all details for drawer
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderCustomer {
  name: string;
  handle: string;
  email?: string;
  phone?: string;
  channel: ChannelType;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  label: string;
  timestamp: Date;
  description?: string;
}

// Payment method type
export type PaymentMethod = 'COD' | 'UPI' | 'Card' | 'Bank Transfer' | 'Pending';

// Order priority/intent type
export type OrderPriority = 'high' | 'medium' | 'low';

export interface ExtendedOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  totals: OrderTotals;
  address: OrderAddress;
  timeline: OrderTimelineEvent[];
  trackingId?: string;
  carrier?: string;
  paymentMethod: PaymentMethod;
  priority?: OrderPriority;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for orders with full details
export const mockExtendedOrders: ExtendedOrder[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-1001',
    status: 'SHIPPED',
    customer: {
      name: 'Sarah Wilson',
      handle: '+1234567890',
      email: 'sarah.wilson@email.com',
      phone: '+1 (234) 567-890',
      channel: 'whatsapp',
    },
    items: [
      { id: 'i1', name: 'Classic Cotton T-Shirt (Black, M)', quantity: 2, price: 299, subtotal: 598 },
      { id: 'i2', name: 'Embroidered Cap (White)', quantity: 1, price: 199, subtotal: 199 },
    ],
    totals: {
      subtotal: 797,
      shipping: 99,
      discount: 0,
      total: 896,
    },
    address: {
      street: '123 Main Street, Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    timeline: [
      { id: 't1', status: 'NEW', label: 'Order placed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), description: 'Customer placed order via WhatsApp' },
      { id: 't2', status: 'CONFIRMED', label: 'Order confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46) },
      { id: 't3', status: 'SHIPPED', label: 'Shipped', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), description: 'Package picked up by courier' },
    ],
    trackingId: 'DTDC123456789',
    carrier: 'DTDC Express',
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  },
  {
    id: 'o2',
    orderNumber: 'ORD-1002',
    status: 'PENDING',
    customer: {
      name: 'Mike Seller',
      handle: 'mike_seller',
      email: 'mike@example.com',
      channel: 'messenger',
    },
    items: [
      { id: 'i3', name: 'Premium Hoodie (Navy Blue, L)', quantity: 1, price: 599, subtotal: 599 },
    ],
    totals: {
      subtotal: 599,
      shipping: 0,
      discount: 0,
      total: 599,
    },
    address: {
      street: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
    },
    timeline: [
      { id: 't4', status: 'NEW', label: 'Order placed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), description: 'Customer placed order via Messenger' },
      { id: 't5', status: 'PENDING', label: 'Awaiting payment', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11), description: 'Payment link sent to customer' },
    ],
    paymentMethod: 'Pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
  },
  {
    id: 'o3',
    orderNumber: 'ORD-1003',
    status: 'DELIVERED',
    customer: {
      name: 'Lisa Marie',
      handle: 'lisa_marie_shop',
      email: 'lisa.marie@email.com',
      phone: '+1 (555) 123-4567',
      channel: 'messenger',
    },
    items: [
      { id: 'i4', name: 'Summer Dress (Floral, S)', quantity: 2, price: 899, subtotal: 1798 },
      { id: 'i5', name: 'Summer Dress (Blue, M)', quantity: 1, price: 899, subtotal: 899 },
      { id: 'i6', name: 'Pearl Earrings', quantity: 1, price: 299, subtotal: 299 },
      { id: 'i7', name: 'Silver Bracelet', quantity: 1, price: 399, subtotal: 399 },
    ],
    totals: {
      subtotal: 3395,
      shipping: 149,
      discount: 344,
      total: 3200,
    },
    address: {
      street: '789 Park Lane',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
    timeline: [
      { id: 't6', status: 'NEW', label: 'Order placed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96) },
      { id: 't7', status: 'CONFIRMED', label: 'Order confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 94) },
      { id: 't8', status: 'SHIPPED', label: 'Shipped', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80) },
      { id: 't9', status: 'DELIVERED', label: 'Delivered', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), description: 'Package delivered successfully' },
    ],
    trackingId: 'BLR987654321',
    carrier: 'BlueDart',
    paymentMethod: 'Card',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: 'o4',
    orderNumber: 'ORD-1004',
    status: 'NEW',
    customer: {
      name: 'John Doe',
      handle: 'john_doe_23',
      channel: 'instagram',
    },
    items: [
      { id: 'i8', name: 'Leather Jacket (Black, L)', quantity: 1, price: 2499, subtotal: 2499 },
    ],
    totals: {
      subtotal: 2499,
      shipping: 199,
      discount: 250,
      total: 2448,
    },
    address: {
      street: '321 Fashion Street',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      country: 'India',
    },
    timeline: [
      { id: 't10', status: 'NEW', label: 'Order placed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), description: 'Customer placed order via Instagram DM' },
    ],
    paymentMethod: 'COD',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'o5',
    orderNumber: 'ORD-1005',
    status: 'CONFIRMED',
    customer: {
      name: 'Priya Sharma',
      handle: '+9876543210',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      channel: 'whatsapp',
    },
    items: [
      { id: 'i9', name: 'Formal Shirt (White, M)', quantity: 2, price: 599, subtotal: 1198 },
      { id: 'i10', name: 'Formal Shirt (Blue, M)', quantity: 2, price: 599, subtotal: 1198 },
      { id: 'i11', name: 'Chino Pants (Khaki, 32)', quantity: 1, price: 899, subtotal: 899 },
      { id: 'i12', name: 'Chino Pants (Navy, 32)', quantity: 1, price: 899, subtotal: 899 },
    ],
    totals: {
      subtotal: 4194,
      shipping: 0,
      discount: 419,
      total: 3775,
    },
    address: {
      street: '555 Business Park, Tower A',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500001',
      country: 'India',
    },
    timeline: [
      { id: 't11', status: 'NEW', label: 'Order placed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10) },
      { id: 't12', status: 'PENDING', label: 'Payment pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9) },
      { id: 't13', status: 'CONFIRMED', label: 'Payment confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), description: 'Payment received via UPI' },
    ],
    paymentMethod: 'UPI',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'o6',
    orderNumber: 'ORD-1006',
    status: 'CANCELLED',
    customer: {
      name: 'David Kim',
      handle: '+1122334455',
      phone: '+1 (122) 334-455',
      channel: 'whatsapp',
    },
    items: [
      { id: 'i13', name: 'Running Shoes (Black, 10)', quantity: 1, price: 1299, subtotal: 1299 },
      { id: 'i14', name: 'Sports Socks (Pack of 3)', quantity: 1, price: 299, subtotal: 299 },
    ],
    totals: {
      subtotal: 1598,
      shipping: 99,
      discount: 0,
      total: 1697,
    },
    address: {
      street: '888 Sports Complex Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India',
    },
    timeline: [
      { id: 't14', status: 'NEW', label: 'Order placed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
      { id: 't15', status: 'PENDING', label: 'Awaiting payment', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70) },
      { id: 't16', status: 'CANCELLED', label: 'Order cancelled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), description: 'Customer requested cancellation' },
    ],
    paymentMethod: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

// Helper to get extended order by ID
export function getExtendedOrderById(orderId: string): ExtendedOrder | undefined {
  return mockExtendedOrders.find(order => order.id === orderId);
}

// Helper to get extended order by order number
export function getExtendedOrderByNumber(orderNumber: string): ExtendedOrder | undefined {
  return mockExtendedOrders.find(order => order.orderNumber === orderNumber);
}