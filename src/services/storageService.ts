import { API_CONFIG } from "@/config/api.config";

export interface UploadStorageOptions {
  file: File;
  accountId: string;
  subfolder?: string; // Default: 'accountsettings'
  prefix?: string;    // e.g. 'logo' or 'banner'
}

export interface UploadResult {
  downloadUrl: string;
  filePath: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

class StorageService {
  private get storageApiUrl(): string {
    return API_CONFIG.storageApiUrl.replace(/\/$/, "");
  }

  private get bucket(): string {
    return API_CONFIG.storageBucket;
  }

  /**
   * Uploads an image file to Firebase Storage under the structure:
   * /{accountId}/{subfolder}/{prefix}.{ext}
   * e.g. /{accountId}/accountsettings/logo.png or /{accountId}/accountsettings/banner.jpg
   * 
   * Overwrites any existing image for the prefix instead of creating duplicates.
   */
  async uploadFile({
    file,
    accountId,
    subfolder = "accountsettings",
    prefix = "logo",
  }: UploadStorageOptions): Promise<UploadResult> {
    const cleanAccountId = accountId.trim() || "default-account";
    
    // Extract clean file extension (e.g., png, jpg, webp, svg)
    const rawExt = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
    const fileExt = rawExt && /^[a-z0-9]+$/.test(rawExt) ? rawExt : "png";

    // Clean, deterministic filename (e.g. logo.png, banner.jpg)
    const fileName = `${prefix}.${fileExt}`;
    
    // Folder structure: <accountId>/<subfolder>/<fileName>
    const filePath = `${cleanAccountId}/${subfolder}/${fileName}`;
    const encodedFilePath = encodeURIComponent(filePath);

    // Firebase Storage REST Upload URL for emulator (Port 9199) or production
    const uploadUrl = `${this.storageApiUrl}/v0/b/${this.bucket}/o?name=${encodedFilePath}&uploadType=media`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg",
          "Authorization": "Bearer owner", // Enables emulator WRITE permissions
        },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Firebase Storage upload HTTP ${response.status}: ${errorText || response.statusText}`,
        );
      }

      const data = await response.json();
      const downloadToken = data.downloadTokens || data.token;

      // Construct clean emulator download URL with cache-busting timestamp
      const downloadUrl = `${this.storageApiUrl}/v0/b/${this.bucket}/o/${encodedFilePath}?alt=media${
        downloadToken ? `&token=${downloadToken}` : ""
      }&v=${Date.now()}`;

      return {
        downloadUrl,
        filePath,
        fileName,
        contentType: file.type,
        sizeBytes: file.size,
      };
    } catch (err: unknown) {
      console.error("Firebase Storage upload error:", err);
      const message = err instanceof Error ? err.message : "Upload failed";
      throw new Error(`Firebase Storage upload failed: ${message}`);
    }
  }
}

export const storageService = new StorageService();
