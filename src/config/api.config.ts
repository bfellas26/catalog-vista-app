/**
 * API Configuration Property File Reference
 * Reads base URL from environment property file (.env) with fallback to contract default.
 * Handles dev server proxying seamlessly to eliminate browser CORS issues.
 */
const envBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001/digital-catalog-saas/us-central1/api";

function getEffectiveBaseUrl(): string {
  // If executing in browser and pointing directly to local backend port 5001,
  // proxy requests through dev server relative path to bypass CORS preflight blocks.
  if (typeof window !== "undefined") {
    try {
      if (
        envBaseUrl.startsWith("http://127.0.0.1:5001") ||
        envBaseUrl.startsWith("http://localhost:5001")
      ) {
        const parsed = new URL(envBaseUrl);
        return parsed.pathname; // returns "/digital-catalog-saas/us-central1/api"
      }
    } catch {
      // Fallback if URL parsing fails
    }
  }
  return envBaseUrl;
}

export const API_CONFIG = {
  propertyBaseUrl: envBaseUrl,
  get baseUrl(): string {
    return getEffectiveBaseUrl();
  },
  endpoints: {
    accounts: {
      create: "/accounts/create",
      list: "/accounts/list",
      getById: (accountId: string) => `/accounts/${accountId}`,
      update: (accountId: string) => `/accounts/update/${accountId}`,
      status: (accountId: string) => `/accounts/status/${accountId}`,
    },
  },
};
