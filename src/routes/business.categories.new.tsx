import { useState, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  UploadCloud,
  Loader2,
  Trash2,
  FolderTree,
  Hash,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoriesApi, CreateCategoryPayload } from "@/services/categoriesApi";
import { storageService } from "@/services/storageService";

export const Route = createFileRoute("/business/categories/new")({
  component: NewCategoryPage,
});

const ACCOUNT_ID = "ACC-8832";

interface FormValues {
  categoryName: string;
  categoryDescription: string;
  displayOrder: number;
  categoryImage: string;
}

function NewCategoryPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePathInfo, setImagePathInfo] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, watch, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
      displayOrder: 1,
      categoryImage: "",
    },
  });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    const categoryName = getValues("categoryName")?.trim();
    if (!categoryName) {
      toast.error("Please enter a category name before uploading an image.");
      return;
    }

    const namePrefix = categoryName.replace(/\s+/g, "");

    setIsUploadingImage(true);
    try {
      const uploadRes = await storageService.uploadFile({
        file,
        accountId: ACCOUNT_ID,
        subfolder: "category",
        prefix: namePrefix,
      });

      setValue("categoryImage", uploadRes.downloadUrl);
      setImagePathInfo(uploadRes.filePath);
      toast.success(`Image uploaded: ${uploadRes.filePath}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(`Image upload error: ${msg}`);
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateCategoryPayload = {
        accountId: ACCOUNT_ID,
        categoryName: data.categoryName,
        categoryDescription: data.categoryDescription || undefined,
        categoryImage: data.categoryImage || undefined,
        displayOrder: Number(data.displayOrder) || 1,
      };
      await categoriesApi.createCategory(payload);
      toast.success("Category created successfully");
      navigate({ to: "/business/categories" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category";
      toast.error(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageUrl = watch("categoryImage");

  return (
    <PageContainer>
      <PageHeader
        title="Add Category"
        description="Create a new product category for your catalog."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        {/* Left: Form Fields */}
        <div className="card-surface space-y-5 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                {...register("categoryName", { required: true })}
                placeholder="e.g. Apparel, Electronics"
              />
            </div>
            <div className="space-y-1.5">
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="categoryDescription">Category Description</Label>
            <Textarea
              id="categoryDescription"
              rows={3}
              {...register("categoryDescription")}
              placeholder="Brief description of this category..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="flex items-center justify-between text-sm font-medium">
              <span>Category Image</span>
              {imagePathInfo && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  {imagePathInfo}
                </span>
              )}
            </Label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            {imageUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-border bg-background">
                <div className="h-36 w-full bg-muted">
                  <img
                    src={imageUrl}
                    alt="Category Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-card border-t border-border">
                  <span className="text-xs font-semibold text-foreground">Image Uploaded</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <UploadCloud className="h-3.5 w-3.5 mr-1" />
                      )}
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setValue("categoryImage", ""); setImagePathInfo(""); }}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 p-8 text-center transition-colors hover:border-primary hover:bg-muted/60 cursor-pointer"
              >
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Uploading to Firebase Storage...</p>
                    <p className="text-[11px] font-mono text-primary">
                      /{ACCOUNT_ID}/category/...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Click or tap to upload image
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Select from laptop or mobile (PNG, JPG, WEBP, SVG)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/business/categories" })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="bg-primary hover:bg-primary/90 font-semibold"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Category
            </Button>
          </div>
        </div>

        {/* Right: Preview Card */}
        <div className="card-surface space-y-4 p-6">
          <p className="text-sm font-semibold">Live Preview</p>
          <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="h-28 w-full bg-muted">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FolderTree className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div className="p-4 space-y-1">
              <p className="font-semibold text-sm">
                {watch("categoryName") || "Category Name"}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {watch("categoryDescription") || "Category description will appear here."}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground pt-1">
                Display Order: {watch("displayOrder") || 1}
              </p>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
