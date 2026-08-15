import { useState, useRef, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadCloud, Loader2, Trash2, Package, Hash, Plus, Image as ImageIcon } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoriesApi, Category } from "@/services/categoriesApi";
import { productsApi, CreateProductPayload } from "@/services/productsApi";
import { storageService } from "@/services/storageService";
import { z } from "zod";

const productSearchSchema = z.object({
  categoryId: z.string().optional(),
  standalone: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/business/products/new")({
  validateSearch: (search) => productSearchSchema.parse(search),
  component: NewProductPage,
});

const ACCOUNT_ID = "ACC-8832";

interface FormValues {
  productName: string;
  categoryId: string;
  productDescription: string;
  productPrice: number;
  displayOrder: number;
  isStandalone: boolean;
}

function NewProductPage() {
  const navigate = useNavigate();
  const { categoryId, standalone } = Route.useSearch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Unique temporary subfolder for this product's uploads
  const [tempProductId] = useState(() => "p_" + Math.random().toString(36).substring(2, 10));

  // Array of uploaded image URLs
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, watch, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      productName: "",
      categoryId: categoryId || "",
      productDescription: "",
      productPrice: 0,
      displayOrder: 1,
      isStandalone: !!standalone || !categoryId,
    },
  });

  const isStandalone = watch("isStandalone");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (uploadedImages.length >= 5) {
      toast.error("You can upload a maximum of 5 images per product");
      return;
    }

    const productName = getValues("productName")?.trim();
    if (!productName) {
      toast.error("Please enter a product name first before uploading images.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const indexSuffix = uploadedImages.length + 1;
      
      const uploadRes = await storageService.uploadFile({
        file,
        accountId: ACCOUNT_ID,
        subfolder: `products/${tempProductId}`,
        prefix: `prod_${indexSuffix}`,
      });

      setUploadedImages((prev) => [...prev, uploadRes.downloadUrl]);
      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(`Upload error: ${msg}`);
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success("Image removed from list");
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateProductPayload = {
        accountId: ACCOUNT_ID,
        productName: data.productName,
        productDescription: data.productDescription || undefined,
        productPrice: Number(data.productPrice) || 0,
        categoryId: data.isStandalone ? undefined : data.categoryId || undefined,
        productImages: uploadedImages,
        displayOrder: Number(data.displayOrder) || 1,
      };

      await productsApi.createProduct(payload);
      toast.success("Product created successfully");
      
      // Navigate back to where we started
      if (data.isStandalone) {
        navigate({ to: "/business/categories" });
      } else {
        navigate({ to: `/business/categories/detail/$id`, params: { id: data.categoryId } });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product";
      toast.error(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title={isStandalone ? "Add Standalone Product" : "Add Product to Category"} 
        description={isStandalone ? "Create a new product that is standalone." : `Assigns automatically to category ID: ${categoryId}`} 
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        {/* Left: Form Controls */}
        <div className="card-surface space-y-5 p-6 lg:col-span-2">
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                {...register("productName", { required: true })}
                placeholder="e.g. Vintage Denim Jacket"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="productPrice">Price ($) *</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                {...register("productPrice", { required: true, valueAsNumber: true })}
                placeholder="49.99"
              />
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <Label htmlFor="displayOrder" className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Display Order
            </Label>
            <Input
              id="displayOrder"
              type="number"
              min={1}
              {...register("displayOrder", { valueAsNumber: true })}
              placeholder="1"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              rows={4}
              {...register("productDescription")}
              placeholder="Tell customers about features, sizing, materials..."
            />
          </div>

          {/* Multi-Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex justify-between items-center">
              <span>Product Images ({uploadedImages.length} / 5)</span>
              {uploadedImages.length > 0 && (
                <span className="text-xs text-muted-foreground">First image will be the primary cover</span>
              )}
            </Label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Grid of uploaded images */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {uploadedImages.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group bg-muted">
                  <img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-white hover:text-destructive hover:bg-white/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] px-1 rounded font-semibold uppercase">Cover</span>
                  )}
                </div>
              ))}

              {uploadedImages.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/40 cursor-pointer transition-colors text-muted-foreground"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Plus className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-[10px] text-center px-2">Upload Image</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (categoryId) {
                  navigate({ to: `/business/categories/detail/$id`, params: { id: categoryId } });
                } else {
                  navigate({ to: "/business/categories" });
                }
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="bg-primary hover:bg-primary-dark font-semibold"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </div>
        </div>

        {/* Right: Live Preview Panel */}
        <div className="space-y-4">
          <p className="text-sm font-semibold">Live Preview</p>
          <div className="card-surface overflow-hidden rounded-xl border border-border bg-background shadow-md">
            
            {/* Image display */}
            <div className="relative aspect-[4/3] bg-muted w-full flex items-center justify-center overflow-hidden border-b border-border">
              {uploadedImages.length > 0 ? (
                <img src={uploadedImages[0]} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                  <ImageIcon className="h-10 w-10 mb-2" />
                  <span className="text-xs">No images uploaded yet</span>
                </div>
              )}
              {uploadedImages.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                  + {uploadedImages.length - 1} more
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {isStandalone ? "Standalone" : "Categorized"}
                </span>
                <h3 className="font-semibold text-lg leading-tight mt-0.5">
                  {watch("productName") || "Product Name"}
                </h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  ${(watch("productPrice") || 0).toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3">
                {watch("productDescription") || "Enter a description for the product to preview it here."}
              </p>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
