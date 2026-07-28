import { API_CONFIG } from "@/config/api.config";
import type { ApiResponse } from "./accountsApi";

// ─── Types ───────────────────────────────────────────────────────────────────

export type EnquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

// Firestore emulator returns timestamps as { _seconds, _nanoseconds } objects
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export type TimestampField = string | FirestoreTimestamp | null | undefined;

export interface Enquiry {
  documentId: string;
  accountId: string;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  status: EnquiryStatus;
  createdAt: TimestampField;
  updatedAt: TimestampField;
  createdBy: string;
  updatedBy: string;
}

export interface CreateEnquiryPayload {
  accountId: string;
  customerName: string;
  phone: string;
  email: string;
  message: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

class EnquiriesApiService {
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
      if (err instanceof Error) throw err;
      throw new Error("An unexpected error occurred while communicating with backend service.");
    }
  }

  /**
   * 1. Create Enquiry
   * POST /enquiries/create
   */
  async createEnquiry(
    payload: CreateEnquiryPayload,
  ): Promise<ApiResponse<{ documentId: string; accountId: string }>> {
    return this.request<{ documentId: string; accountId: string }>(
      API_CONFIG.endpoints.enquiries.create,
      { method: "POST", body: JSON.stringify(payload) },
    );
  }

  /**
   * 2. Get All Enquiries
   * GET /enquiries/list/:accountId
   */
  async getEnquiriesByAccount(accountId: string): Promise<ApiResponse<Enquiry[]>> {
    return this.request<Enquiry[]>(API_CONFIG.endpoints.enquiries.list(accountId), {
      method: "GET",
    });
  }

  /**
   * 3. Get Enquiry by ID
   * GET /enquiries/:enquiryId
   */
  async getEnquiryById(enquiryId: string): Promise<ApiResponse<Enquiry>> {
    return this.request<Enquiry>(API_CONFIG.endpoints.enquiries.getById(enquiryId), {
      method: "GET",
    });
  }

  /**
   * 4. Update Enquiry Status
   * PUT /enquiries/status/:enquiryId
   */
  async updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.enquiries.status(enquiryId), {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  /**
   * 5. Delete Enquiry (Soft Delete)
   * PATCH /enquiries/delete/:enquiryId
   */
  async deleteEnquiry(enquiryId: string): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.enquiries.delete(enquiryId), {
      method: "PATCH",
    });
  }
}

export const enquiriesApi = new EnquiriesApiService();
