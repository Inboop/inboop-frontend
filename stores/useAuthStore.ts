import { create } from 'zustand';
import { User, InstagramConnection } from '@/types';

interface AuthState {
  user: User | null;
  instagramConnection: InstagramConnection;
  setUser: (user: User | null) => void;
  setInstagramConnection: (connection: InstagramConnection) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  instagramConnection: {
    isConnected: false,
  },
  setUser: (user) => set({ user }),
  setInstagramConnection: (connection) => set({ instagramConnection: connection }),
}));
