// Channel types - Support for Instagram, WhatsApp, and Messenger
export type ChannelType = 'instagram' | 'whatsapp' | 'messenger';

// Intent types for AI classification (matches backend IntentLabel enum)
export type IntentLabel = 'BUYING' | 'SUPPORT' | 'BROWSING' | 'SPAM' | 'OTHER';

// Legacy intent type (deprecated - use IntentLabel for new code)
export type IntentType = 'Inquiry' | 'Order' | 'Payment' | 'Delivery' | 'Issue' | 'Other';

// Lead status (matches backend LeadStatus enum)
// NEW is the only non-terminal state
// CONVERTED, CLOSED, LOST are terminal states
// CONTACTED, QUALIFIED, NEGOTIATING, SPAM are legacy (deprecated)
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Negotiating' | 'Converted' | 'Closed' | 'Lost' | 'Spam';

// Lead source (matches backend LeadSource enum)
export type LeadSource = 'AI' | 'MANUAL';

// Order status - fulfillment track (matches backend OrderStatus enum)
// NEW → CONFIRMED → SHIPPED → DELIVERED (or CANCELLED from any pre-delivered state)
export type OrderStatus = 'NEW' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Payment status - separate from order status (matches backend PaymentStatus enum)
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

// Payment method (matches backend PaymentMethod enum)
export type PaymentMethod = 'ONLINE' | 'COD' | 'MANUAL' | 'BANK_TRANSFER';

// Message direction (matches backend MessageDirection enum)
export type MessageDirection = 'INBOUND' | 'OUTBOUND';

// Sender type (matches backend SenderType enum)
export type SenderType = 'CUSTOMER' | 'BUSINESS' | 'SYSTEM';

// Content type for messages (matches backend ContentType enum)
export type ContentType =
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'FILE'
  | 'STICKER'
  | 'LOCATION'
  | 'CONTACT'
  | 'STORY_MENTION'
  | 'STORY_REPLY'
  | 'REEL_SHARE'
  | 'POST_SHARE';

// Message sentiment (matches backend MessageSentiment enum)
export type MessageSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

// Contact interface - unified customer profile across channels
export interface Contact {
  id: string;
  businessId: string;
  name?: string;
  email?: string;
  phone?: string;
  handles?: Record<string, string>; // { instagram: "username", whatsapp: "+1234567890" }
  firstSeenAt?: Date;
  lastSeenAt?: Date;
  totalOrders: number;
  totalRevenue: number;
  archivedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  sentAt?: Date;

  // Direction and sender (new - preferred over isFromCustomer)
  direction?: MessageDirection;
  senderType?: SenderType;
  contentType?: ContentType;

  // Legacy field (deprecated - use direction instead)
  isFromCustomer: boolean;

  // Channel info
  channel: ChannelType;
  channelMessageId?: string;

  // Rich content
  originalText?: string;
  translatedText?: string;
  detectedLanguage?: string;
  sentiment?: MessageSentiment;
  aiClassification?: string;

  // Attachments
  hasAttachment?: boolean;
  attachmentType?: string;
  attachmentUrl?: string;

  // Status
  isRead?: boolean;

  // Extensibility
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Conversation status
export type ConversationStatus = 'New' | 'Active' | 'Converted' | 'Closed';

// Conversation interface
// One conversation can have many leads over time (same customer, different inquiries)
export interface Conversation {
  id: string;
  businessId?: string; // For multi-tenant support
  contactId?: string; // Link to unified contact profile

  // Channel info
  channel: ChannelType;
  customerHandle: string; // @username for IG, phone for WhatsApp, name for Messenger
  customerName?: string; // Display name
  profilePicture?: string;
  externalConversationId?: string;
  externalCustomerId?: string;

  // Message summary
  lastMessage: string;
  lastMessageTime: Date;
  firstMessageAt?: Date;
  unreadCount?: number;

  // AI Intent classification
  intent: IntentType; // Legacy
  intentLabel?: IntentLabel; // New - AI classified
  intentConfidence?: number; // 0-1 confidence score
  intentEvaluatedAt?: Date;

  // Team assignment
  assignedToUserId?: string;
  assignedTo?: string; // User name for display

  // Denormalized counts
  leadCount?: number;
  orderCount?: number;

  // Status flags
  isVIP?: boolean;
  status?: ConversationStatus;
  isActive?: boolean;

  // Soft delete / archive
  archivedAt?: Date | null;
  deletedAt?: Date | null;

  // Extensibility
  metadata?: Record<string, unknown>;

  // Timestamps
  startedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Lead interface
export interface Lead {
  id: string;
  businessId?: string;
  conversationId?: string; // Link to conversation
  contactId?: string; // Link to unified contact profile

  // Customer info
  channel: ChannelType;
  customerHandle: string; // @username for IG, phone for WhatsApp, name for Messenger
  customerName?: string;
  profilePicture?: string;

  // Classification
  intent: IntentType;
  status: LeadStatus;
  type?: string; // LeadType from backend

  // Source tracking
  source?: LeadSource; // AI or MANUAL
  createdById?: string; // User who created
  createdByName?: string; // For display

  // Team assignment
  assignedToUserId?: string;
  assignedTo?: string; // Team member name for display

  // Details
  lastMessageTime: Date;
  lastMessageSnippet: string;
  notes?: string;
  labels?: string[]; // Custom tags
  language?: string; // Detected language
  value?: number; // Estimated value

  // Related entities
  linkedOrders?: string[];

  // Conversion tracking
  convertedOrderId?: number;
  convertedOrderNumber?: string;
  convertedAt?: Date;

  // Soft delete / archive
  archivedAt?: Date | null;
  deletedAt?: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
}

// Order item (line item)
export interface OrderItem {
  id: string;
  orderId: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order timeline event (status history)
export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  label?: string;
  note?: string;
  performedByUserId?: string;
  performedByName?: string;
  timestamp: Date;
  description?: string;
}

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  businessId?: string;

  // Related entities
  leadId?: string;
  conversationId?: string;
  contactId?: string;
  customerId?: string; // Legacy

  // Customer info (denormalized)
  customerHandle: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;

  // Channel
  channel: ChannelType;

  // Order details
  items?: OrderItem[];
  itemsSummary?: string; // Legacy: comma-separated items string
  notes?: string;

  // Pricing
  amount: number;
  totalAmount?: number;
  currency?: string; // Default: INR

  // Fulfillment status
  status: OrderStatus;

  // Payment (separate from fulfillment)
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;

  // Tracking
  trackingNumber?: string;
  externalOrderId?: string;

  // Team assignment
  assignedToUserId?: string;
  assignedTo?: string;

  // Timeline/History
  timeline?: OrderTimelineEvent[];

  // Key timestamps
  orderDate?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;

  // Soft delete / archive
  archivedAt?: Date | null;
  deletedAt?: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  workspaceName?: string;
  timezone?: string;
  archivedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Business/Workspace interface
export interface Business {
  id: string;
  name: string;
  ownerId: string;
  instagramBusinessAccountId?: string;
  instagramUsername?: string;
  facebookPageId?: string;
  webhookVerified?: boolean;
  isActive?: boolean;
  archivedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Instagram connection status
export interface InstagramConnection {
  isConnected: boolean;
  username?: string;
  lastSync?: Date;
}

// Helper type to check if entity is soft deleted
export type SoftDeletable = {
  archivedAt?: Date | null;
  deletedAt?: Date | null;
};

// Helper function type for filtering active (non-deleted) items
export const isActive = <T extends SoftDeletable>(item: T): boolean => {
  return item.deletedAt === null || item.deletedAt === undefined;
};

// Helper function type for filtering non-archived items
export const isNotArchived = <T extends SoftDeletable>(item: T): boolean => {
  return (item.archivedAt === null || item.archivedAt === undefined) && isActive(item);
};
