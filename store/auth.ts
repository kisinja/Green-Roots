import { create } from 'zustand';

export interface SessionUser {
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: SessionUser | null;
    loading: boolean;
    hasFetched: boolean;
    setUser: (user: SessionUser | null) => void;
    fetchUser: () => Promise<void>;
    clearUser: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    hasFetched: false,

    setUser: (user) => set({ user, hasFetched: true }),

    fetchUser: async () => {
        // avoid duplicate fetches
        if (get().loading) return;
        set({ loading: true });

        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            set({ user: data.user ?? null, hasFetched: true });
        }
        catch {
            set({ user: null, hasFetched: true });
        } finally {
            set({ loading: false });
        }
    },

    clearUser: () => set({ user: null, hasFetched: true })
}));