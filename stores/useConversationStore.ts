import { create } from 'zustand';
import { Conversation } from '@/types';
import { mockConversations } from '@/lib/mockData';

interface ConversationState {
  conversations: Conversation[];
  setConversationVIP: (id: string, isVIP: boolean) => void;
  getConversation: (id: string) => Conversation | undefined;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: mockConversations,
  setConversationVIP: (id, isVIP) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, isVIP } : conv
      ),
    })),
  getConversation: (id) => get().conversations.find((c) => c.id === id),
}));
