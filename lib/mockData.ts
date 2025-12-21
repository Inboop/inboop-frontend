import { Conversation, Message, Lead, Order, ChannelType, IntentType, LeadStatus } from '@/types';

// ============================================
// SINGLE SOURCE OF TRUTH: Customer Data
// ============================================
// All customer information is defined here once.
// Conversations and Leads reference this data to ensure consistency.

interface CustomerData {
  id: string;
  handle: string;
  name: string;
  profilePicture: string;
  channel: ChannelType;
  isVIP?: boolean;
}

const customers: Record<string, CustomerData> = {
  '1': {
    id: '1',
    handle: 'john_doe_23',
    name: 'John Doe',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    channel: 'instagram',
  },
  '2': {
    id: '2',
    handle: '+1234567890',
    name: 'Sarah Wilson',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    channel: 'whatsapp',
    isVIP: true,
  },
  '3': {
    id: '3',
    handle: 'mike_seller',
    name: 'Mike Seller',
    profilePicture: 'https://randomuser.me/api/portraits/men/67.jpg',
    channel: 'messenger',
  },
  '4': {
    id: '4',
    handle: 'fashion_lover_21',
    name: 'Emma Johnson',
    profilePicture: 'https://randomuser.me/api/portraits/women/17.jpg',
    channel: 'instagram',
  },
  '5': {
    id: '5',
    handle: '+9876543210',
    name: 'Priya Sharma',
    profilePicture: 'https://randomuser.me/api/portraits/women/63.jpg',
    channel: 'whatsapp',
    isVIP: true,
  },
  '6': {
    id: '6',
    handle: 'alex_styles',
    name: 'Alex Thompson',
    profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg',
    channel: 'messenger',
  },
  '7': {
    id: '7',
    handle: 'trendy_boutique',
    name: 'Rachel Green',
    profilePicture: 'https://randomuser.me/api/portraits/women/28.jpg',
    channel: 'instagram',
  },
  '8': {
    id: '8',
    handle: '+1122334455',
    name: 'David Kim',
    profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
    channel: 'whatsapp',
  },
  '9': {
    id: '9',
    handle: 'lisa_marie_shop',
    name: 'Lisa Marie',
    profilePicture: 'https://randomuser.me/api/portraits/women/35.jpg',
    channel: 'messenger',
    isVIP: true,
  },
  '10': {
    id: '10',
    handle: 'style_hunter_99',
    name: 'Chris Martinez',
    profilePicture: 'https://randomuser.me/api/portraits/men/52.jpg',
    channel: 'instagram',
  },
  '11': {
    id: '11',
    handle: '+5544332211',
    name: 'Nina Patel',
    profilePicture: 'https://randomuser.me/api/portraits/women/56.jpg',
    channel: 'whatsapp',
  },
  '12': {
    id: '12',
    handle: 'urban_wear_fan',
    name: 'Jake Wilson',
    profilePicture: 'https://randomuser.me/api/portraits/men/76.jpg',
    channel: 'messenger',
  },
  '13': {
    id: '13',
    handle: 'fashionista_2024',
    name: 'Mia Chen',
    profilePicture: 'https://randomuser.me/api/portraits/women/79.jpg',
    channel: 'instagram',
  },
  '14': {
    id: '14',
    handle: '+6677889900',
    name: 'Omar Hassan',
    profilePicture: 'https://randomuser.me/api/portraits/men/83.jpg',
    channel: 'whatsapp',
  },
  '15': {
    id: '15',
    handle: 'the_style_guru',
    name: 'Sophie Brown',
    profilePicture: 'https://randomuser.me/api/portraits/women/90.jpg',
    channel: 'messenger',
    isVIP: true,
  },
};

// ============================================
// CONVERSATIONS
// ============================================
// Each conversation references customer data and has its own conversation-specific data

interface ConversationData {
  customerId: string;
  lastMessage: string;
  lastMessageTime: Date;
  intent: IntentType;
  unreadCount: number;
  externalConversationId?: string;
  externalCustomerId?: string;
}

const conversationData: Record<string, ConversationData> = {
  '1': {
    customerId: '1',
    lastMessage: 'Hi! Do you have this in size M?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    intent: 'Inquiry',
    unreadCount: 2,
    externalConversationId: 'ig_conv_123',
    externalCustomerId: 'ig_user_456',
  },
  '2': {
    customerId: '2',
    lastMessage: 'When will my order be delivered?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    intent: 'Delivery',
    unreadCount: 0,
    externalConversationId: 'wa_conv_789',
    externalCustomerId: '+1234567890',
  },
  '3': {
    customerId: '3',
    lastMessage: 'I want to place an order for 3 items',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    intent: 'Order',
    unreadCount: 1,
    externalConversationId: 'fb_conv_321',
    externalCustomerId: 'fb_user_654',
  },
  '4': {
    customerId: '4',
    lastMessage: 'Is this available in blue?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    intent: 'Inquiry',
    unreadCount: 0,
  },
  '5': {
    customerId: '5',
    lastMessage: 'Can I get a discount on bulk orders?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    intent: 'Inquiry',
    unreadCount: 3,
    externalConversationId: 'wa_conv_456',
    externalCustomerId: '+9876543210',
  },
  '6': {
    customerId: '6',
    lastMessage: 'Thanks for the quick response!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    intent: 'Issue',
    unreadCount: 0,
    externalConversationId: 'fb_conv_999',
    externalCustomerId: 'fb_user_888',
  },
  '7': {
    customerId: '7',
    lastMessage: 'Do you ship internationally?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
    intent: 'Inquiry',
    unreadCount: 1,
  },
  '8': {
    customerId: '8',
    lastMessage: 'My order arrived damaged. Please help.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 7),
    intent: 'Issue',
    unreadCount: 2,
  },
  '9': {
    customerId: '9',
    lastMessage: 'I love the new collection!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    intent: 'Order',
    unreadCount: 0,
  },
  '10': {
    customerId: '10',
    lastMessage: 'What payment methods do you accept?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 10),
    intent: 'Payment',
    unreadCount: 0,
  },
  '11': {
    customerId: '11',
    lastMessage: 'Can I return the item if it doesnt fit?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 12),
    intent: 'Issue',
    unreadCount: 1,
  },
  '12': {
    customerId: '12',
    lastMessage: 'Placed the order. When will it ship?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 14),
    intent: 'Delivery',
    unreadCount: 0,
  },
  '13': {
    customerId: '13',
    lastMessage: 'Are these handmade?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 16),
    intent: 'Inquiry',
    unreadCount: 0,
  },
  '14': {
    customerId: '14',
    lastMessage: 'I need to change my delivery address',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 18),
    intent: 'Issue',
    unreadCount: 4,
  },
  '15': {
    customerId: '15',
    lastMessage: 'Do you have a loyalty program?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 20),
    intent: 'Inquiry',
    unreadCount: 0,
  },
};

// Generate conversations from customer + conversation data
export const mockConversations: Conversation[] = Object.entries(conversationData).map(([id, conv]) => {
  const customer = customers[conv.customerId];
  return {
    id,
    channel: customer.channel,
    customerHandle: customer.handle,
    customerName: customer.name,
    profilePicture: customer.profilePicture,
    lastMessage: conv.lastMessage,
    lastMessageTime: conv.lastMessageTime,
    intent: conv.intent,
    unreadCount: conv.unreadCount,
    isVIP: customer.isVIP,
    externalConversationId: conv.externalConversationId,
    externalCustomerId: conv.externalCustomerId,
  };
});

// ============================================
// LEADS
// ============================================
// Each lead references customer data and has its own lead-specific data

interface LeadData {
  customerId: string;
  status: LeadStatus;
  createdAt: Date;
  activitySummary: string; // Summary-like description of last activity
  notes?: string;
  linkedOrders?: string[];
  assignedTo?: string;
  labels?: string[];
  language?: string;
  value?: number;
}

const leadData: Record<string, LeadData> = {
  'l1': {
    customerId: '1',
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    activitySummary: 'Asked about size M availability',
    notes: 'Interested in size M products',
    labels: ['Hot Lead', 'Size M'],
    language: 'en',
    value: 1500,
  },
  'l2': {
    customerId: '2',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    activitySummary: 'Delivery status inquiry',
    linkedOrders: ['o1'],
    assignedTo: 'Alex',
    labels: ['VIP', 'Repeat Customer'],
    language: 'en',
    value: 2500,
  },
  'l3': {
    customerId: '3',
    status: 'Converted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
    activitySummary: 'Order placed for 3 items',
    linkedOrders: ['o2'],
    assignedTo: 'Sarah',
    labels: ['Bulk Order'],
    language: 'en',
    value: 4500,
  },
  'l4': {
    customerId: '4',
    status: 'Qualified',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    activitySummary: 'Requested blue color variant',
    assignedTo: 'John',
    labels: ['Color Request'],
    language: 'en',
    value: 800,
  },
  'l5': {
    customerId: '5',
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    activitySummary: 'Inquired about bulk discounts',
    labels: ['Bulk Inquiry', 'VIP'],
    language: 'hi',
    value: 8000,
  },
  'l6': {
    customerId: '6',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    activitySummary: 'Issue resolved successfully',
    assignedTo: 'Alex',
    labels: ['Support'],
    language: 'en',
  },
  'l7': {
    customerId: '7',
    status: 'Qualified',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    activitySummary: 'Asked about international shipping',
    assignedTo: 'Sarah',
    labels: ['International', 'Potential Reseller'],
    language: 'en',
    value: 15000,
  },
  'l8': {
    customerId: '8',
    status: 'Lost',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168),
    activitySummary: 'Reported damaged order',
    labels: ['Complaint', 'Refund'],
    language: 'en',
  },
  'l9': {
    customerId: '9',
    status: 'Converted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 200),
    activitySummary: 'Purchased new collection items',
    linkedOrders: ['o3'],
    assignedTo: 'John',
    labels: ['VIP', 'Repeat Customer'],
    language: 'en',
    value: 3200,
  },
  'l10': {
    customerId: '10',
    status: 'Qualified',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    activitySummary: 'Asked about payment methods',
    labels: ['Payment Query'],
    language: 'es',
    value: 1200,
  },
  'l11': {
    customerId: '11',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    activitySummary: 'Return policy question',
    assignedTo: 'Alex',
    labels: ['Returns'],
    language: 'en',
  },
  'l12': {
    customerId: '12',
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    activitySummary: 'Order placed, awaiting shipment',
    labels: ['Hot Lead'],
    language: 'en',
    value: 2000,
  },
};

// Generate leads from customer + lead data + conversation data
export const mockLeads: Lead[] = Object.entries(leadData).map(([id, lead]) => {
  const customer = customers[lead.customerId];
  const conv = conversationData[lead.customerId];
  return {
    id,
    channel: customer.channel,
    customerHandle: customer.handle,
    customerName: customer.name,
    profilePicture: customer.profilePicture,
    intent: conv.intent,
    status: lead.status,
    lastMessageTime: conv.lastMessageTime,
    lastMessageSnippet: lead.activitySummary, // Use activity summary instead of raw message
    createdAt: lead.createdAt,
    notes: lead.notes,
    linkedOrders: lead.linkedOrders,
    conversationId: lead.customerId, // conversation ID matches customer ID
    assignedTo: lead.assignedTo,
    labels: lead.labels,
    language: lead.language,
    value: lead.value,
  };
});

// ============================================
// MESSAGES
// ============================================

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: customers['1'].handle,
      text: 'Hey! I saw your post about the new collection',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isFromCustomer: true,
      channel: 'instagram',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'seller',
      text: 'Hi! Thanks for reaching out. Yes, we just launched it!',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isFromCustomer: false,
      channel: 'instagram',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: customers['1'].handle,
      text: 'Hi! Do you have this in size M?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isFromCustomer: true,
      channel: 'instagram',
    },
  ],
  '2': [
    {
      id: 'm4',
      conversationId: '2',
      senderId: customers['2'].handle,
      text: 'Hi, I ordered 2 T-shirts and a cap last week',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isFromCustomer: true,
      channel: 'whatsapp',
    },
    {
      id: 'm4b',
      conversationId: '2',
      senderId: 'seller',
      text: `Hello ${customers['2'].name.split(' ')[0]}! Yes, I can see your order. It was shipped yesterday.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 42),
      isFromCustomer: false,
      channel: 'whatsapp',
    },
    {
      id: 'm4c',
      conversationId: '2',
      senderId: customers['2'].handle,
      text: 'Great! Do you have the tracking number?',
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      isFromCustomer: true,
      channel: 'whatsapp',
    },
    {
      id: 'm4d',
      conversationId: '2',
      senderId: 'seller',
      text: 'Yes! Your tracking number is TRK123456789. You can track it on the courier website.',
      timestamp: new Date(Date.now() - 1000 * 60 * 38),
      isFromCustomer: false,
      channel: 'whatsapp',
    },
    {
      id: 'm4e',
      conversationId: '2',
      senderId: customers['2'].handle,
      text: 'Thank you so much!',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      isFromCustomer: true,
      channel: 'whatsapp',
    },
    {
      id: 'm4f',
      conversationId: '2',
      senderId: customers['2'].handle,
      text: 'When will my order be delivered?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isFromCustomer: true,
      channel: 'whatsapp',
    },
  ],
  '3': [
    {
      id: 'm5',
      conversationId: '3',
      senderId: customers['3'].handle,
      text: 'Hey there! I love your products',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 10),
      isFromCustomer: true,
      channel: 'messenger',
    },
    {
      id: 'm5b',
      conversationId: '3',
      senderId: 'seller',
      text: `Thank you ${customers['3'].name.split(' ')[0]}! We appreciate the support. How can I help you today?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 8),
      isFromCustomer: false,
      channel: 'messenger',
    },
    {
      id: 'm5c',
      conversationId: '3',
      senderId: customers['3'].handle,
      text: 'I saw the hoodie collection on your page. Are they still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 5),
      isFromCustomer: true,
      channel: 'messenger',
    },
    {
      id: 'm5d',
      conversationId: '3',
      senderId: 'seller',
      text: 'Yes! We have all sizes in stock. Would you like me to send you the catalog?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 3),
      isFromCustomer: false,
      channel: 'messenger',
    },
    {
      id: 'm5e',
      conversationId: '3',
      senderId: customers['3'].handle,
      text: 'That would be great! Also, do you offer bulk discounts?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 1),
      isFromCustomer: true,
      channel: 'messenger',
    },
    {
      id: 'm5f',
      conversationId: '3',
      senderId: 'seller',
      text: 'Absolutely! For orders of 3 or more items, we offer 15% off.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 1),
      isFromCustomer: false,
      channel: 'messenger',
    },
    {
      id: 'm5g',
      conversationId: '3',
      senderId: customers['3'].handle,
      text: 'I want to place an order for 3 items',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isFromCustomer: true,
      channel: 'messenger',
    },
  ],
  '4': [
    {
      id: 'm6',
      conversationId: '4',
      senderId: customers['4'].handle,
      text: 'Is this available in blue?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isFromCustomer: true,
      channel: 'instagram',
    },
  ],
};

// ============================================
// ORDERS
// ============================================

export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-0001',
    customerId: 'l2',
    customerHandle: customers['2'].handle,
    channel: customers['2'].channel,
    amount: 1299,
    status: 'SHIPPED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    itemsSummary: '2x T-Shirts, 1x Cap',
  },
  {
    id: 'o2',
    orderNumber: 'ORD-0002',
    customerId: 'l3',
    customerHandle: customers['3'].handle,
    channel: customers['3'].channel,
    amount: 599,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    itemsSummary: '1x Hoodie',
  },
  {
    id: 'o3',
    orderNumber: 'ORD-0003',
    customerId: 'l9',
    customerHandle: customers['9'].handle,
    channel: customers['9'].channel,
    amount: 3200,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    itemsSummary: '3x Dresses, 2x Accessories',
  },
  {
    id: 'o4',
    orderNumber: 'ORD-0004',
    customerId: 'l1',
    customerHandle: customers['1'].handle,
    channel: customers['1'].channel,
    amount: 450,
    status: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    itemsSummary: '1x Jacket',
  },
  {
    id: 'o5',
    orderNumber: 'ORD-0005',
    customerId: 'l5',
    customerHandle: customers['5'].handle,
    channel: customers['5'].channel,
    amount: 2100,
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    itemsSummary: '4x Shirts, 2x Pants',
  },
  {
    id: 'o6',
    orderNumber: 'ORD-0006',
    customerId: 'l8',
    customerHandle: customers['8'].handle,
    channel: customers['8'].channel,
    amount: 890,
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    itemsSummary: '2x Shoes',
  },
];

// ============================================
// HELPER: Get customer by ID
// ============================================
export const getCustomerById = (id: string): CustomerData | undefined => customers[id];

// ============================================
// HELPER: Get lead by conversation ID
// ============================================
export const getLeadByConversationId = (conversationId: string): Lead | undefined => {
  return mockLeads.find(lead => lead.conversationId === conversationId);
};
