import { create } from 'zustand';
import { Conversation, ConversationStatus, isNotArchived } from '@/types';
import { mockConversations } from '@/lib/mockData';

interface ConversationState {
  conversations: Conversation[];
  isLoading: boolean;
  includeArchived: boolean;
  setIncludeArchived: (include: boolean) => void;
  setConversationVIP: (id: string, isVIP: boolean) => void;
  setConversationStatus: (id: string, status: ConversationStatus) => void;
  archiveConversation: (id: string) => void;
  unarchiveConversation: (id: string) => void;
  softDeleteConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  getConversation: (id: string) => Conversation | undefined;
  getActiveConversations: () => Conversation[];
  fetchConversations: (isAdmin?: boolean) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  isLoading: true,
  includeArchived: false,

  setIncludeArchived: (include) => set({ includeArchived: include }),

  setConversationVIP: (id, isVIP) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, isVIP, updatedAt: new Date() } : conv
      ),
    })),

  setConversationStatus: (id, status) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, status, updatedAt: new Date() } : conv
      ),
    })),

  archiveConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, archivedAt: new Date(), updatedAt: new Date() } : conv
      ),
    })),

  unarchiveConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, archivedAt: null, updatedAt: new Date() } : conv
      ),
    })),

  softDeleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, deletedAt: new Date(), updatedAt: new Date() } : conv
      ),
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv
      ),
    })),

  getConversation: (id) => get().conversations.find((c) => c.id === id),

  // Get active (non-archived, non-deleted) conversations
  getActiveConversations: () => {
    const { conversations, includeArchived } = get();
    if (includeArchived) {
      // Filter out deleted only
      return conversations.filter((conv) => conv.deletedAt === null || conv.deletedAt === undefined);
    }
    // Filter out both archived and deleted
    return conversations.filter(isNotArchived);
  },

  fetchConversations: async (isAdmin = false) => {
    set({ isLoading: true });
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Show mock data only for admin user
    set({ conversations: isAdmin ? mockConversations : [], isLoading: false });
  },
}));
