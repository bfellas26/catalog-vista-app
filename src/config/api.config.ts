/**
 * API Configuration Property File Reference
 * Reads base URL from environment variable (VITE_API_BASE_URL) with fallback
 * to the local Firebase Functions emulator at port 5001.
 *
 * Calls go directly to the emulator — no vite proxy needed.
 * CORS must be enabled on the backend (standard for Express-based Firebase Functions).
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? "http://127.0.0.1:5001/digital-catalog-saas/us-central1/api";

export const API_CONFIG = {
  get baseUrl(): string {
    return BASE_URL.replace(/\/$/, "");
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
    subscribers: {
      create: "/subscribers/create",
      list: (accountId: string) => `/subscribers/list/${accountId}`,
    },
  },
};
