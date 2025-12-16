import { create } from 'zustand';
import { Conversation, ConversationStatus } from '@/types';
import { mockConversations } from '@/lib/mockData';

interface ConversationState {
  conversations: Conversation[];
  isLoading: boolean;
  setConversationVIP: (id: string, isVIP: boolean) => void;
  setConversationStatus: (id: string, status: ConversationStatus) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  getConversation: (id: string) => Conversation | undefined;
  fetchConversations: (isAdmin?: boolean) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  isLoading: true,
  setConversationVIP: (id, isVIP) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, isVIP } : conv
      ),
    })),
  setConversationStatus: (id, status) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, status } : conv
      ),
    })),
  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
    })),
  getConversation: (id) => get().conversations.find((c) => c.id === id),
  fetchConversations: async (isAdmin = false) => {
    set({ isLoading: true });
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Show mock data only for admin user
    set({ conversations: isAdmin ? mockConversations : [], isLoading: false });
  },
}));
