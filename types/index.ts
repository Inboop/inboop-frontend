// Intent types for conversations and leads
export type IntentType = 'Inquiry' | 'Order' | 'Payment' | 'Delivery' | 'Issue' | 'Other';

// Lead status
export type LeadStatus = 'New' | 'In Progress' | 'Converted' | 'Closed';

// Order status
export type OrderStatus = 'Pending' | 'Paid' | 'Shipped' | 'Cancelled';

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isFromCustomer: boolean;
}

// Conversation interface
export interface Conversation {
  id: string;
  instagramHandle: string;
  profilePicture?: string;
  lastMessage: string;
  lastMessageTime: Date;
  intent: IntentType;
  unreadCount?: number;
}

// Lead interface
export interface Lead {
  id: string;
  instagramHandle: string;
  profilePicture?: string;
  intent: IntentType;
  status: LeadStatus;
  lastMessageTime: Date;
  lastMessageSnippet: string;
  createdAt: Date;
  notes?: string;
  linkedOrders?: string[];
}

// Order interface
export interface Order {
  id: string;
  customerId: string;
  customerHandle: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  items?: string;
  notes?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  workspaceName?: string;
  timezone?: string;
}

// Instagram connection status
export interface InstagramConnection {
  isConnected: boolean;
  username?: string;
  lastSync?: Date;
}
