import { API_CONFIG } from "@/config/api.config";

export interface Category {
  documentId: string;
  accountId: string;
  categoryName: string;
  categoryImage?: string;
  categoryDescription?: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateCategoryPayload {
  accountId: string;
  categoryName: string;
  categoryImage?: string;
  categoryDescription?: string;
  displayOrder?: number;
}

export interface UpdateCategoryPayload {
  categoryName: string;
  categoryImage?: string;
  categoryDescription?: string;
  displayOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class CategoriesApiService {
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
      if (err instanceof Error) throw err;
      throw new Error("An unexpected error occurred while communicating with backend service.");
    }
  }

  /** GET /categories/list/:accountId */
  async getCategoriesByAccount(accountId: string): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>(API_CONFIG.endpoints.categories.list(accountId), {
      method: "GET",
    });
  }

  /** GET /categories/:categoryId */
  async getCategoryById(categoryId: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(API_CONFIG.endpoints.categories.getById(categoryId), {
      method: "GET",
    });
  }

  /** POST /categories/create */
  async createCategory(
    payload: CreateCategoryPayload,
  ): Promise<ApiResponse<{ documentId: string; accountId: string }>> {
    return this.request<{ documentId: string; accountId: string }>(
      API_CONFIG.endpoints.categories.create,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  /** PUT /categories/update/:categoryId */
  async updateCategory(
    categoryId: string,
    payload: UpdateCategoryPayload,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.categories.update(categoryId), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /** PATCH /categories/delete/:categoryId */
  async deleteCategory(categoryId: string): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.categories.delete(categoryId), {
      method: "PATCH",
    });
  }

  /** PATCH /categories/status/:categoryId */
  async updateCategoryStatus(
    categoryId: string,
    isActive: boolean,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.categories.status(categoryId), {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  }
}

export const categoriesApi = new CategoriesApiService();
