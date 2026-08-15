import { API_CONFIG } from "@/config/api.config";

export interface Product {
  documentId: string;
  accountId: string;
  categoryId?: string;
  productName: string;
  productDescription?: string;
  productPrice: number;
  productImages: string[];
  productTags?: string[];
  displayOrder?: number;
  isStandalone?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateProductPayload {
  accountId: string;
  categoryId?: string;
  productName: string;
  productDescription?: string;
  productPrice: number;
  productImages?: string[];
  productTags?: string[];
  displayOrder?: number;
}

export interface UpdateProductPayload {
  categoryId?: string;
  productName?: string;
  productDescription?: string;
  productPrice?: number;
  productImages?: string[];
  productTags?: string[];
  displayOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class ProductsApiService {
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
      throw new Error("An unexpected error occurred while communicating with product service.");
    }
  }

  /** GET /products/list/:accountId */
  async getProductsByAccount(accountId: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(API_CONFIG.endpoints.products.list(accountId), {
      method: "GET",
    });
  }

  /** GET /products/standalone/:accountId */
  async getStandaloneProducts(accountId: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(API_CONFIG.endpoints.products.standalone(accountId), {
      method: "GET",
    });
  }

  /** GET /products/category/:categoryId */
  async getProductsByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(API_CONFIG.endpoints.products.byCategory(categoryId), {
      method: "GET",
    });
  }

  /** GET /products/:productId */
  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(API_CONFIG.endpoints.products.getById(productId), {
      method: "GET",
    });
  }

  /** POST /products/create */
  async createProduct(
    payload: CreateProductPayload,
  ): Promise<ApiResponse<{ documentId: string; accountId: string }>> {
    return this.request<{ documentId: string; accountId: string }>(
      API_CONFIG.endpoints.products.create,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  /** PUT /products/update/:productId */
  async updateProduct(
    productId: string,
    payload: UpdateProductPayload,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.products.update(productId), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /** PATCH /products/delete/:productId */
  async deleteProduct(productId: string): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.products.delete(productId), {
      method: "PATCH",
    });
  }

  /** PATCH /products/status/:productId */
  async updateProductStatus(
    productId: string,
    isActive: boolean,
  ): Promise<ApiResponse<null>> {
    return this.request<null>(API_CONFIG.endpoints.products.status(productId), {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  }
}

export const productsApi = new ProductsApiService();
