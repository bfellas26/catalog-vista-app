import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadCloud, Loader2, Trash2, Package, Hash, Image as ImageIcon, AlertCircle, Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoriesApi, Category } from "@/services/categoriesApi";
import { productsApi, Product, UpdateProductPayload } from "@/services/productsApi";
import { storageService } from "@/services/storageService";

export const Route = createFileRoute("/business/products/edit/$id")({
  component: EditProductPage,
});

interface FormValues {
  productName: string;
  categoryId: string;
  productDescription: string;
  productPrice: number;
  displayOrder: number;
  isStandalone: boolean;
}

function EditProductPage() {
  const { id: productId } = Route.useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  
  // Array of uploaded/active product image URLs
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [productMeta, setProductMeta] = useState<Pick<Product, "accountId" | "isActive" | "createdAt" | "createdBy"> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, watch, setValue, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      productName: "",
      categoryId: "",
      productDescription: "",
      productPrice: 0,
      displayOrder: 1,
      isStandalone: false,
    },
  });

  const isStandalone = watch("isStandalone");

  // Load product & categories
  const loadProductAndCats = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setCatsLoading(true);
    try {
      // 1. Load categories first
      const catsRes = await categoriesApi.getCategoriesByAccount("ACC-8832");
      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data.filter((c) => c.isActive && !c.isDeleted));
      }

      // 2. Load product details
      const prodRes = await productsApi.getProductById(productId);
      if (prodRes.success && prodRes.data) {
        const prod = prodRes.data;
        reset({
          productName: prod.productName || "",
          categoryId: prod.categoryId || "",
          productDescription: prod.productDescription || "",
          productPrice: prod.productPrice || 0,
          displayOrder: prod.displayOrder || 1,
          isStandalone: prod.isStandalone ?? false,
        });
        setUploadedImages(prod.productImages || []);
        setProductMeta({
          accountId: prod.accountId,
          isActive: prod.isActive ?? true,
          createdAt: prod.createdAt,
          createdBy: prod.createdBy,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load product details";
      setLoadError(msg);
      toast.error(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
      setCatsLoading(false);
    }
  }, [productId, reset]);

  useEffect(() => {
    loadProductAndCats();
  }, [loadProductAndCats]);

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

    setIsUploadingImage(true);
    try {
      const accountId = productMeta?.accountId || "ACC-8832";
      const indexSuffix = uploadedImages.length + 1;
      
      const uploadRes = await storageService.uploadFile({
        file,
        accountId,
        subfolder: `products/${productId}`,
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
      const payload: UpdateProductPayload = {
        productName: data.productName,
        productDescription: data.productDescription || undefined,
        productPrice: Number(data.productPrice) || 0,
        categoryId: data.isStandalone ? undefined : data.categoryId || undefined,
        productImages: uploadedImages,
        displayOrder: Number(data.displayOrder) || 1,
      };

      await productsApi.updateProduct(productId, payload);
      toast.success("Product updated successfully");
      
      if (data.isStandalone) {
        navigate({ to: "/business/categories" });
      } else {
        navigate({ to: `/business/categories/detail/$id`, params: { id: data.categoryId } });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update product";
      toast.error(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Edit Product" description="Loading product details..." />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card-surface space-y-5 p-6 lg:col-span-2 animate-pulse">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-10 bg-muted rounded-lg" />
              <div className="h-10 bg-muted rounded-lg" />
            </div>
            <div className="h-24 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-xl" />
          </div>
          <div className="card-surface p-6 animate-pulse">
            <div className="h-28 bg-muted rounded-xl mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (loadError) {
    return (
      <PageContainer>
        <PageHeader title="Edit Product" description="Failed to load product." />
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm font-semibold text-destructive">Failed to load product</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">{loadError}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadProductAndCats}>
              Try Again
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/business/categories" })}>
              Back to Categories
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Edit Product" description={`Edit product: ${productId.slice(0, 16)}...`} />
      
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

          {/* Record Info / Metadata */}
          {productMeta && (
            <div className="rounded-lg bg-muted/40 border border-border/60 p-3 space-y-1 text-[11px] font-mono text-muted-foreground">
              <p className="text-xs font-semibold text-foreground mb-1.5">Record Info</p>
              <div className="flex justify-between">
                <span>documentId:</span>
                <span>{productId}</span>
              </div>
              <div className="flex justify-between">
                <span>accountId:</span>
                <span>{productMeta.accountId}</span>
              </div>
              {productMeta.createdAt && (
                <div className="flex justify-between">
                  <span>createdAt:</span>
                  <span>{new Date(productMeta.createdAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const catId = getValues("categoryId");
                if (getValues("isStandalone") || !catId) {
                  navigate({ to: "/business/categories" });
                } else {
                  navigate({ to: `/business/categories/detail/$id`, params: { id: catId } });
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
              Save Changes
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
