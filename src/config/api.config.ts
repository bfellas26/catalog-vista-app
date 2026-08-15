/**
 * API & Firebase Storage Configuration
 * Reads base URLs from environment variables with fallbacks to local Firebase Emulators.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? "http://127.0.0.1:5001/digital-catalog-saas/us-central1/api";

// Firebase Storage Emulator API runs on port 9199
const STORAGE_API_URL = (import.meta.env.VITE_STORAGE_API_URL as string | undefined)
  ?? "http://127.0.0.1:9199";

// Firebase Emulator Suite UI runs on port 4000
const STORAGE_UI_URL = (import.meta.env.VITE_STORAGE_UI_URL as string | undefined)
  ?? "http://127.0.0.1:4000/storage";

// Active Firebase Storage Bucket
const STORAGE_BUCKET = (import.meta.env.VITE_STORAGE_BUCKET as string | undefined)
  ?? "digital-catalog-saas.firebasestorage.app";

export const API_CONFIG = {
  get baseUrl(): string {
    return BASE_URL.replace(/\/$/, "");
  },
  get storageApiUrl(): string {
    return STORAGE_API_URL.replace(/\/$/, "");
  },
  get storageUiUrl(): string {
    return STORAGE_UI_URL.replace(/\/$/, "");
  },
  get storageBucket(): string {
    return STORAGE_BUCKET;
  },
  endpoints: {
    accounts: {
      create: "/accounts/create",
      list: "/accounts/list",
      getById: (accountId: string) => `/accounts/${accountId}`,
      update: (accountId: string) => `/accounts/update/${accountId}`,
      status: (accountId: string) => `/accounts/status/${accountId}`,
    },
    enquiries: {
      create: "/enquiries/create",
      list: (accountId: string) => `/enquiries/list/${accountId}`,
      getById: (enquiryId: string) => `/enquiries/${enquiryId}`,
      status: (enquiryId: string) => `/enquiries/status/${enquiryId}`,
      delete: (enquiryId: string) => `/enquiries/delete/${enquiryId}`,
    },
    businessSettings: {
      create: "/business-settings/create",
      getByAccountId: (accountId: string) => `/business-settings/${accountId}`,
      update: (accountId: string) => `/business-settings/update/${accountId}`,
      delete: (accountId: string) => `/business-settings/delete/${accountId}`,
    },
    categories: {
      create: "/categories/create",
      list: (accountId: string) => `/categories/list/${accountId}`,
      getById: (categoryId: string) => `/categories/${categoryId}`,
      update: (categoryId: string) => `/categories/update/${categoryId}`,
      delete: (categoryId: string) => `/categories/delete/${categoryId}`,
      status: (categoryId: string) => `/categories/status/${categoryId}`,
    },
    products: {
      create: "/products/create",
      list: (accountId: string) => `/products/list/${accountId}`,
      standalone: (accountId: string) => `/products/standalone/${accountId}`,
      byCategory: (categoryId: string) => `/products/category/${categoryId}`,
      getById: (productId: string) => `/products/${productId}`,
      update: (productId: string) => `/products/update/${productId}`,
      delete: (productId: string) => `/products/delete/${productId}`,
      status: (productId: string) => `/products/status/${productId}`,
    },
  },
};
