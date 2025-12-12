import { Conversation, Message, Lead, Order } from '@/types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    instagramHandle: 'john_doe_23',
    profilePicture: undefined,
    lastMessage: 'Hi! Do you have this in size M?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    intent: 'Inquiry',
    unreadCount: 2,
  },
  {
    id: '2',
    instagramHandle: 'sarah_wilson',
    lastMessage: 'When will my order be delivered?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    intent: 'Delivery',
    unreadCount: 0,
  },
  {
    id: '3',
    instagramHandle: 'mike_seller',
    lastMessage: 'I want to place an order for 3 items',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    intent: 'Order',
    unreadCount: 1,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'john_doe_23',
      text: 'Hey! I saw your post about the new collection',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isFromCustomer: true,
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'seller',
      text: 'Hi! Thanks for reaching out. Yes, we just launched it!',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isFromCustomer: false,
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'john_doe_23',
      text: 'Hi! Do you have this in size M?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isFromCustomer: true,
    },
  ],
  '2': [
    {
      id: 'm4',
      conversationId: '2',
      senderId: 'sarah_wilson',
      text: 'When will my order be delivered?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isFromCustomer: true,
    },
  ],
  '3': [
    {
      id: 'm5',
      conversationId: '3',
      senderId: 'mike_seller',
      text: 'I want to place an order for 3 items',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isFromCustomer: true,
    },
  ],
};

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    instagramHandle: 'john_doe_23',
    intent: 'Inquiry',
    status: 'New',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    lastMessageSnippet: 'Hi! Do you have this in size M?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    notes: 'Interested in size M products',
  },
  {
    id: 'l2',
    instagramHandle: 'sarah_wilson',
    intent: 'Delivery',
    status: 'In Progress',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    lastMessageSnippet: 'When will my order be delivered?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    linkedOrders: ['o1'],
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    customerId: 'l2',
    customerHandle: 'sarah_wilson',
    amount: 1299,
    status: 'Shipped',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    items: '2x T-Shirts, 1x Cap',
  },
  {
    id: 'o2',
    customerId: 'l3',
    customerHandle: 'alex_jones',
    amount: 599,
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    items: '1x Hoodie',
  },
];
