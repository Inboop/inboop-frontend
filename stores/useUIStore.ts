import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  selectedConversationId: string | null;
  selectedLeadId: string | null;
  selectedOrderId: string | null;
  setSidebarOpen: (open: boolean) => void;
  setSelectedConversationId: (id: string | null) => void;
  setSelectedLeadId: (id: string | null) => void;
  setSelectedOrderId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  selectedConversationId: null,
  selectedLeadId: null,
  selectedOrderId: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
}));
