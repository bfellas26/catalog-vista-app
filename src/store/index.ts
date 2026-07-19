import { create } from "zustand";

// Placeholder stores. No business logic — wire up when backend is added.

interface AuthState {
  user: { username: string } | null;
  setUser: (u: { username: string } | null) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

interface UIState {
  sidebarOpen: boolean;
  cartOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
}
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  cartOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
}));

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}
interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}
export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i,
          ),
        };
      }
      return { items: [...s.items, item] };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    })),
  clear: () => set({ items: [] }),
}));
