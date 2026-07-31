import { API_CONFIG } from "@/config/api.config";
import type { ApiResponse } from "./accountsApi";
import type { TimestampField } from "./enquiriesApi";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Subscriber {
  documentId: string;
  accountId: string;
  subscriberName: string;
  phoneNumber: string;
  emailAddress: string;
  subscribedAt: TimestampField;
  isDeleted: boolean;
}

export interface CreateSubscriberPayload {
  accountId: string;
  subscriberName: string;
  phoneNumber: string;
  emailAddress: string;
}

/**
 * Error thrown by the subscribers service. Carries the HTTP status so callers
 * can distinguish validation (400) and duplicate-subscriber (409) responses
 * from unexpected failures. `status` is 0 for network / transport errors.
 */
export class SubscriberApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SubscriberApiError";
    this.status = status;
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

class SubscribersApiService {
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
        throw new SubscriberApiError(errorMsg, response.status);
      }

      return json;
    } catch (err: unknown) {
      if (err instanceof SubscriberApiError) throw err;
      if (err instanceof Error) throw new SubscriberApiError(err.message, 0);
      throw new SubscriberApiError(
        "An unexpected error occurred while communicating with backend service.",
        0,
      );
    }
  }

  /**
   * 1. Create Subscriber
   * POST /subscribers/create
   *
   * 201 → created. 400 → missing field / invalid email / invalid phone.
   * 409 → subscriber already exists.
   */
  async createSubscriber(
    payload: CreateSubscriberPayload,
  ): Promise<ApiResponse<{ documentId: string; accountId: string }>> {
    return this.request<{ documentId: string; accountId: string }>(
      API_CONFIG.endpoints.subscribers.create,
      { method: "POST", body: JSON.stringify(payload) },
    );
  }

  /**
   * 2. Get All Subscribers
   * GET /subscribers/list/:accountId
   */
  async getSubscribersByAccount(accountId: string): Promise<ApiResponse<Subscriber[]>> {
    return this.request<Subscriber[]>(API_CONFIG.endpoints.subscribers.list(accountId), {
      method: "GET",
    });
  }
}

export const subscribersApi = new SubscribersApiService();
