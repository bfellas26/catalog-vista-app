import { API_CONFIG } from "@/config/api.config";

export interface Account {
  documentId?: string;
  accountId: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;
  currency: string;
  adminUid?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateAccountPayload {
  accountId: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  businessType: string;
  country: string;
  state: string;
  city: string;
  address: string;
  currency: string;
}

export interface UpdateAccountPayload {
  businessName: string;
  ownerName: string;
  businessType: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;
  currency: string;
}

export interface UpdateAccountStatusPayload {
  status: string; // e.g. "ENABLED" | "DISABLED"
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class AccountsApiService {
  private get baseUrl(): string {
    return API_CONFIG.baseUrl.replace(/\/$/, "");
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      const json: ApiResponse<T> = await response.json().catch(() => ({
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`,
        data: null as unknown as T,
      }));

      if (!response.ok || json.success === false) {
        const errorMsg = json?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return json;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while communicating with backend service.");
    }
  }

  /**
   * 1. Create Account
   * POST /accounts/create
   */
  async createAccount(
    payload: CreateAccountPayload,
  ): Promise<ApiResponse<{ documentId: string; accountId: string }>> {
    return this.request<{ documentId: string; accountId: string }>(
      API_CONFIG.endpoints.accounts.create,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  /**
   * 2. Get All Accounts
   * GET /accounts/list
   */
  async getAccountsList(): Promise<ApiResponse<Account[]>> {
    return this.request<Account[]>(API_CONFIG.endpoints.accounts.list, {
      method: "GET",
    });
  }

  /**
   * 3. Get Account by Account ID
   * GET /accounts/:accountId
   */
  async getAccountById(accountId: string): Promise<ApiResponse<Account>> {
    return this.request<Account>(API_CONFIG.endpoints.accounts.getById(accountId), {
      method: "GET",
    });
  }

  /**
   * 4. Update Account
   * PUT /accounts/update/:accountId
   */
  async updateAccount(
    accountId: string,
    payload: UpdateAccountPayload,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.accounts.update(accountId), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * 5. Enable / Disable Account
   * PATCH /accounts/status/:accountId
   */
  async updateAccountStatus(accountId: string, status: string): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.accounts.status(accountId), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
}

export const accountsApi = new AccountsApiService();
