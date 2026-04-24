import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Transaction = {
  id: string;
  type: "earn" | "spend" | "convert" | "buy";
  amount: number;
  description: string;
  date: string;
};

export type SessionEntry = {
  id: string;
  skill: string;
  description: string;
  price: number;
  earned: number;
  date: string;
};

export type AppUser = {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  skillsOffered: string[];
  learningInterests: string[];
};

type AppState = {
  isAuthed: boolean;
  user: AppUser;
  coins: number;
  learningProgress: number;
  transactions: Transaction[];
  sessions: SessionEntry[];
  theme: "light" | "dark";

  login: (email: string, name?: string) => void;
  logout: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  addCoins: (amount: number, description: string) => void;
  spendCoins: (amount: number, description: string) => boolean;
  convertCoins: (amount: number) => boolean;
  buyCoins: (amount: number) => void;
  addSession: (s: Omit<SessionEntry, "id" | "date" | "earned">) => void;
  updateUser: (patch: Partial<AppUser>) => void;
  bumpProgress: (n: number) => void;
};

const defaultUser: AppUser = {
  name: "Alex Rivera",
  email: "alex@skillswap.ai",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  bio: "Polyglot designer who loves teaching UI and learning languages.",
  skillsOffered: ["UI Design", "Figma", "English Conversation"],
  learningInterests: ["Spanish", "Guitar", "Public Speaking"],
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthed: false,
      user: defaultUser,
      coins: 240,
      learningProgress: 38,
      transactions: [
        { id: "t1", type: "earn", amount: 60, description: "Taught: Figma basics", date: "2d ago" },
        { id: "t2", type: "spend", amount: 40, description: "Booked: Spanish 101", date: "3d ago" },
        { id: "t3", type: "buy", amount: 200, description: "Top-up via card", date: "1w ago" },
      ],
      sessions: [],
      theme: "light",

      login: (email, name) =>
        set({
          isAuthed: true,
          user: { ...defaultUser, email, name: name || defaultUser.name },
        }),
      logout: () => set({ isAuthed: false }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        set({ theme: next });
      },

      addCoins: (amount, description) =>
        set((s) => ({
          coins: s.coins + amount,
          transactions: [
            { id: crypto.randomUUID(), type: "earn", amount, description, date: "just now" },
            ...s.transactions,
          ],
        })),
      spendCoins: (amount, description) => {
        if (get().coins < amount) return false;
        set((s) => ({
          coins: s.coins - amount,
          transactions: [
            { id: crypto.randomUUID(), type: "spend", amount, description, date: "just now" },
            ...s.transactions,
          ],
        }));
        return true;
      },
      convertCoins: (amount) => {
        if (get().coins < amount) return false;
        set((s) => ({
          coins: s.coins - amount,
          transactions: [
            {
              id: crypto.randomUUID(),
              type: "convert",
              amount,
              description: `Converted ${amount} coins to $${(amount * 0.05).toFixed(2)}`,
              date: "just now",
            },
            ...s.transactions,
          ],
        }));
        return true;
      },
      buyCoins: (amount) =>
        set((s) => ({
          coins: s.coins + amount,
          transactions: [
            {
              id: crypto.randomUUID(),
              type: "buy",
              amount,
              description: `Purchased ${amount} coins`,
              date: "just now",
            },
            ...s.transactions,
          ],
        })),
      addSession: (s) =>
        set((state) => ({
          sessions: [
            { ...s, id: crypto.randomUUID(), earned: 0, date: "just now" },
            ...state.sessions,
          ],
        })),
      updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
      bumpProgress: (n) => set((s) => ({ learningProgress: Math.min(100, s.learningProgress + n) })),
    }),
    {
      name: "skillswap-store",
      partialize: (s) => ({
        isAuthed: s.isAuthed,
        user: s.user,
        coins: s.coins,
        learningProgress: s.learningProgress,
        transactions: s.transactions,
        sessions: s.sessions,
        theme: s.theme,
      }),
    },
  ),
);
