export type ChannelType = 'instagram' | 'whatsapp' | 'messenger';

export type IntentType = 'Order' | 'Query' | 'Lead';

export type LeadStatus = 'New Lead' | 'Hot Lead' | 'Warm Lead' | 'Cold Lead' | 'Converted' | 'Lost';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  timestamp: string;
  isFromCustomer: boolean;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerInitials: string;
  channel: ChannelType;
  lastMessage: string;
  lastMessageTime: string;
  intent: IntentType;
  intentCount?: number;
  isActive?: boolean;
  messages: Message[];
}

export interface Lead {
  id: string;
  conversationId: string;
  name: string;
  initials: string;
  channel: ChannelType;
  intent: IntentType;
  status: LeadStatus;
  orders: number;
  lastReply: string;
  leadValue: number;
  notes: string;
}
