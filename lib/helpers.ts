import { formatDistanceToNow, format } from 'date-fns';
import { IntentType, LeadStatus, OrderStatus } from '@/types';

export function formatMessageTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);

  if (daysDiff < 1) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (daysDiff < 7) {
    return format(date, 'EEE h:mm a');
  } else {
    return format(date, 'MMM d, yyyy');
  }
}

export function getIntentColor(intent: IntentType): string {
  const colors: Record<IntentType, string> = {
    Inquiry: 'bg-blue-100 text-blue-700 border-blue-200',
    Order: 'bg-green-100 text-green-700 border-green-200',
    Payment: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Delivery: 'bg-purple-100 text-purple-700 border-purple-200',
    Issue: 'bg-red-100 text-red-700 border-red-200',
    Other: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[intent];
}

export function getLeadStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Converted': 'bg-green-100 text-green-700',
    'Closed': 'bg-gray-100 text-gray-700',
  };
  return colors[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Paid': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };
  return colors[status];
}

export function getInitials(name: string): string {
  return name
    .split(/[_\s]/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
