import { create } from "zustand";
import { placeholderCategories, placeholderProducts, placeholderTags } from "@/lib/placeholders";

// Placeholder stores. No business logic — wire up when backend is added.

interface AuthState {
  user: { username: string; accountId?: string } | null;
  setUser: (u: { username: string; accountId?: string } | null) => void;
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
          items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + item.qty } : i)),
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

export interface CategoryItem {
  id: string;
  accountId: string;
  categoryName: string;
  description: string;
  displayOrder: string;
  imageUrl: string;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface CategoryState {
  categories: CategoryItem[];
  addCategory: (cat: Omit<CategoryItem, "id" | "createdAt" | "updatedAt">) => void;
  updateCategory: (id: string, cat: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: placeholderCategories,
  addCategory: (newCat) =>
    set((s) => {
      const now = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
      const item: CategoryItem = {
        id: `cat-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        ...newCat,
      };
      return { categories: [item, ...s.categories] };
    }),
  updateCategory: (id, updatedFields) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updatedFields,
              updatedAt: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            }
          : c,
      ),
    })),
  deleteCategory: (id) =>
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
    })),
}));

export interface ProductTagItem {
  id: string;
  accountId: string;
  tagName: string;
  color: string;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface ProductTagState {
  tags: ProductTagItem[];
  addTag: (tag: Omit<ProductTagItem, "id" | "createdAt" | "updatedAt">) => void;
  updateTag: (id: string, tag: Partial<ProductTagItem>) => void;
  deleteTag: (id: string) => void;
}

export const useProductTagStore = create<ProductTagState>((set) => ({
  tags: placeholderTags,
  addTag: (newTag) =>
    set((s) => {
      const now = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
      const item: ProductTagItem = {
        id: `t-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        ...newTag,
      };
      return { tags: [item, ...s.tags] };
    }),
  updateTag: (id, updatedFields) =>
    set((s) => ({
      tags: s.tags.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updatedFields,
              updatedAt: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            }
          : t,
      ),
    })),
  deleteTag: (id) =>
    set((s) => ({
      tags: s.tags.filter((t) => t.id !== id),
    })),
}));

export interface ProductItem {
  id: string;
  accountId: string;
  productName: string;
  categoryId: string;
  description: string;
  imageUrls: string[];
  price: number;
  sortOrder: number;
  tagIds: string[];
  searchKeywords: string[];
  isActive: boolean;
  isDeleted: boolean;
  isStandalone: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

interface ProductState {
  products: ProductItem[];
  addProduct: (p: Omit<ProductItem, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: string, p: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: placeholderProducts as ProductItem[],
  addProduct: (newProduct) =>
    set((s) => {
      const now = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
      const item: ProductItem = {
        id: `p-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        ...newProduct,
      };
      return { products: [item, ...s.products] };
    }),
  updateProduct: (id, updatedFields) =>
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedFields,
              updatedAt: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            }
          : p,
      ),
    })),
  deleteProduct: (id) =>
    set((s) => ({
      products: s.products.filter((p) => p.id !== id),
    })),
}));
