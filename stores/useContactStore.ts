import { create } from 'zustand';
import { Contact, isNotArchived } from '@/types';

interface ContactState {
  contacts: Contact[];
  isLoading: boolean;
  includeArchived: boolean;
  setLoading: (loading: boolean) => void;
  setIncludeArchived: (include: boolean) => void;
  fetchContacts: (isAdmin?: boolean) => Promise<void>;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  archiveContact: (id: string) => void;
  unarchiveContact: (id: string) => void;
  softDeleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  getActiveContacts: () => Contact[];
  getContactByHandle: (channel: string, handle: string) => Contact | undefined;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  isLoading: true,
  includeArchived: false,

  setLoading: (loading) => set({ isLoading: loading }),

  setIncludeArchived: (include) => set({ includeArchived: include }),

  fetchContacts: async (isAdmin = false) => {
    set({ isLoading: true });
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // For now, return empty array (no mock data for contacts yet)
    set({ contacts: [], isLoading: false });
  },

  addContact: (contact) =>
    set((state) => ({
      contacts: [contact, ...state.contacts],
    })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates, updatedAt: new Date() } : contact
      ),
    })),

  archiveContact: (id) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, archivedAt: new Date(), updatedAt: new Date() } : contact
      ),
    })),

  unarchiveContact: (id) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, archivedAt: null, updatedAt: new Date() } : contact
      ),
    })),

  softDeleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, deletedAt: new Date(), updatedAt: new Date() } : contact
      ),
    })),

  getContact: (id) => get().contacts.find((c) => c.id === id),

  // Get active (non-archived, non-deleted) contacts
  getActiveContacts: () => {
    const { contacts, includeArchived } = get();
    if (includeArchived) {
      // Filter out deleted only
      return contacts.filter((contact) => contact.deletedAt === null || contact.deletedAt === undefined);
    }
    // Filter out both archived and deleted
    return contacts.filter(isNotArchived);
  },

  // Find contact by channel handle (e.g., instagram: "username" or whatsapp: "+1234567890")
  getContactByHandle: (channel, handle) => {
    return get().contacts.find((contact) => {
      if (!contact.handles) return false;
      return contact.handles[channel] === handle;
    });
  },
}));
