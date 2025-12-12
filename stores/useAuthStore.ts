import { create } from 'zustand';
import { User, InstagramConnection } from '@/types';

interface AuthState {
  user: User | null;
  instagramConnection: InstagramConnection;
  setUser: (user: User | null) => void;
  setInstagramConnection: (connection: InstagramConnection) => void;
}

// Default mock user for development
const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultUser,
  instagramConnection: {
    isConnected: false,
  },
  setUser: (user) => set({ user }),
  setInstagramConnection: (connection) => set({ instagramConnection: connection }),
}));
