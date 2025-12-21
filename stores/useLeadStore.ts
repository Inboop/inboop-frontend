import { create } from 'zustand';
import { Lead, isNotArchived } from '@/types';
import { mockLeads } from '@/lib/mockData';

interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  includeArchived: boolean;
  setLoading: (loading: boolean) => void;
  setIncludeArchived: (include: boolean) => void;
  deleteLead: (id: string) => void;
  softDeleteLead: (id: string) => void;
  archiveLead: (id: string) => void;
  unarchiveLead: (id: string) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  getLead: (id: string) => Lead | undefined;
  getActiveLeads: () => Lead[];
  fetchLeads: (isAdmin?: boolean) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  isLoading: true,
  includeArchived: false,

  setLoading: (loading) => set({ isLoading: loading }),

  setIncludeArchived: (include) => set({ includeArchived: include }),

  // Hard delete (remove from state)
  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
    })),

  // Soft delete (set deletedAt timestamp)
  softDeleteLead: (id) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, deletedAt: new Date(), updatedAt: new Date() } : lead
      ),
    })),

  // Archive (set archivedAt timestamp)
  archiveLead: (id) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, archivedAt: new Date(), updatedAt: new Date() } : lead
      ),
    })),

  // Unarchive (clear archivedAt timestamp)
  unarchiveLead: (id) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, archivedAt: null, updatedAt: new Date() } : lead
      ),
    })),

  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),

  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updates, updatedAt: new Date() } : lead
      ),
    })),

  getLead: (id) => get().leads.find((lead) => lead.id === id),

  // Get active (non-archived, non-deleted) leads
  getActiveLeads: () => {
    const { leads, includeArchived } = get();
    if (includeArchived) {
      // Filter out deleted only
      return leads.filter((lead) => lead.deletedAt === null || lead.deletedAt === undefined);
    }
    // Filter out both archived and deleted
    return leads.filter(isNotArchived);
  },

  fetchLeads: async (isAdmin = false) => {
    set({ isLoading: true });
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Show mock data only for admin user
    set({ leads: isAdmin ? mockLeads : [], isLoading: false });
  },
}));
