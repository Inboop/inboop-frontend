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
    Inquiry: 'bg-blue-500 text-white border-blue-600',
    Order: 'bg-emerald-500 text-white border-emerald-600',
    Payment: 'bg-amber-500 text-white border-amber-600',
    Delivery: 'bg-purple-500 text-white border-purple-600',
    Issue: 'bg-rose-500 text-white border-rose-600',
    Other: 'bg-slate-500 text-white border-slate-600',
  };
  return colors[intent];
}

export function getLeadStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-500 text-white',
    'In Progress': 'bg-amber-500 text-white',
    'Converted': 'bg-emerald-500 text-white',
    'Closed': 'bg-slate-500 text-white',
  };
  return colors[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    'Pending': 'bg-amber-500 text-white',
    'Paid': 'bg-blue-500 text-white',
    'Shipped': 'bg-emerald-500 text-white',
    'Cancelled': 'bg-rose-500 text-white',
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
