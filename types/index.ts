// Channel types - Support for Instagram, WhatsApp, and Messenger
export type ChannelType = 'instagram' | 'whatsapp' | 'messenger';

// Intent types for conversations and leads
export type IntentType = 'Inquiry' | 'Order' | 'Payment' | 'Delivery' | 'Issue' | 'Other';

// Lead status
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

// Order status - canonical enum values
export type OrderStatus = 'NEW' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isFromCustomer: boolean;
  channel: ChannelType;
}

// Conversation status
export type ConversationStatus = 'New' | 'Active' | 'Converted' | 'Closed';

// Conversation interface
// One conversation can have many leads over time (same customer, different inquiries)
export interface Conversation {
  id: string;
  businessId?: string; // For multi-tenant support
  channel: ChannelType;
  customerHandle: string; // @username for IG, phone for WhatsApp, name for Messenger
  customerName?: string; // Display name
  profilePicture?: string;
  lastMessage: string;
  lastMessageTime: Date;
  intent: IntentType;
  unreadCount?: number;
  isVIP?: boolean;
  status?: ConversationStatus;
  // Channel-specific IDs for external platforms
  externalConversationId?: string;
  externalCustomerId?: string;
}

// Lead interface
export interface Lead {
  id: string;
  channel: ChannelType;
  customerHandle: string; // @username for IG, phone for WhatsApp, name for Messenger
  customerName?: string;
  profilePicture?: string;
  intent: IntentType;
  status: LeadStatus;
  lastMessageTime: Date;
  lastMessageSnippet: string;
  createdAt: Date;
  notes?: string;
  linkedOrders?: string[];
  conversationId?: string; // Link to conversation
  assignedTo?: string; // Team member name
  labels?: string[]; // Custom tags
  language?: string; // Detected language
  value?: number; // Estimated value
}

// Order interface
export interface Order {
  id: string;
  customerId: string;
  customerHandle: string;
  channel: ChannelType;
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
