import { API_CONFIG } from "@/config/api.config";

export interface BusinessSettings {
  documentId?: string;
  accountId: string;
  brandName: string;
  businessLogo?: string;
  bannerImage?: string;
  businessPunchline?: string;
  whatsAppNumber?: string;
  emailAddress: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  instagramLink?: string;
  facebookLink?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
}

export interface CreateBusinessSettingsPayload {
  accountId: string;
  brandName: string;
  businessLogo?: string;
  bannerImage?: string;
  businessPunchline?: string;
  whatsAppNumber?: string;
  emailAddress: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  instagramLink?: string;
  facebookLink?: string;
}

export interface UpdateBusinessSettingsPayload {
  brandName: string;
  businessLogo?: string;
  bannerImage?: string;
  businessPunchline?: string;
  whatsAppNumber?: string;
  emailAddress: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  instagramLink?: string;
  facebookLink?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class BusinessSettingsApiService {
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
        const err = new Error(errorMsg);
        (err as unknown as { status: number }).status = response.status;
        throw err;
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
   * 1. Create Business Settings
   * POST /business-settings/create
   */
  async createBusinessSettings(
    payload: CreateBusinessSettingsPayload,
  ): Promise<ApiResponse<{ documentId: string; accountId: string }>> {
    return this.request<{ documentId: string; accountId: string }>(
      API_CONFIG.endpoints.businessSettings.create,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  /**
   * 2. Get Business Settings by Account ID
   * GET /business-settings/:accountId
   */
  async getBusinessSettingsByAccount(accountId: string): Promise<ApiResponse<BusinessSettings>> {
    return this.request<BusinessSettings>(
      API_CONFIG.endpoints.businessSettings.getByAccountId(accountId),
      {
        method: "GET",
      },
    );
  }

  /**
   * 3. Update Business Settings
   * PUT /business-settings/update/:accountId
   */
  async updateBusinessSettings(
    accountId: string,
    payload: UpdateBusinessSettingsPayload,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.businessSettings.update(accountId), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * 4. Delete Business Settings (Soft Delete)
   * PATCH /business-settings/delete/:accountId
   */
  async deleteBusinessSettings(accountId: string): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.businessSettings.delete(accountId), {
      method: "PATCH",
    });
  }
}

export const businessSettingsApi = new BusinessSettingsApiService();
