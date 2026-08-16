import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  Plus, Pencil, Trash2, FolderTree, RefreshCw, Loader2,
  AlertCircle, Package, UploadCloud, X, ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { categoriesApi, Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/services/categoriesApi";
import { productsApi, Product, CreateProductPayload, UpdateProductPayload } from "@/services/productsApi";
import { storageService } from "@/services/storageService";

// Layout route — renders children
export const Route = createFileRoute("/business/categories")({
  component: CategoriesLayout,
});

function CategoriesLayout() {
  return <Outlet />;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCOUNT_ID = "ACC-8832";

// ─── Category Form ─────────────────────────────────────────────────────────────
interface CatFormValues {
  categoryName: string;
  categoryDescription: string;
}

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  editCategory?: Category | null;
  nextDisplayOrder: number;
  onSaved: (cat: Category) => void;
}

function CategoryModal({ open, onClose, editCategory, nextDisplayOrder, onSaved }: CategoryModalProps) {
  const isEdit = !!editCategory;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, getValues } = useForm<CatFormValues>({
    defaultValues: { categoryName: "", categoryDescription: "" },
  });

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editCategory) {
        reset({ categoryName: editCategory.categoryName, categoryDescription: editCategory.categoryDescription || "" });
        setImageUrl(editCategory.categoryImage || "");
      } else {
        reset({ categoryName: "", categoryDescription: "" });
        setImageUrl("");
      }
    }
  }, [open, editCategory, reset]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select a valid image file"); return; }

    const catName = getValues("categoryName")?.trim();
    if (!catName) { toast.error("Enter a category name first before uploading image."); return; }

    setIsUploadingImage(true);
    try {
      const prefix = editCategory ? editCategory.documentId : catName.replace(/\s+/g, "");
      const res = await storageService.uploadFile({ file, accountId: ACCOUNT_ID, subfolder: "category", prefix });
      setImageUrl(res.downloadUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const onSubmit = async (data: CatFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && editCategory) {
        const payload: UpdateCategoryPayload = {
          categoryName: data.categoryName,
          categoryDescription: data.categoryDescription || undefined,
          categoryImage: imageUrl || undefined,
        };
        await categoriesApi.updateCategory(editCategory.documentId, payload);
        onSaved({ ...editCategory, ...payload, categoryImage: imageUrl || editCategory.categoryImage });
        toast.success("Category updated");
      } else {
        const payload: CreateCategoryPayload = {
          accountId: ACCOUNT_ID,
          categoryName: data.categoryName,
          categoryDescription: data.categoryDescription || undefined,
          categoryImage: imageUrl || undefined,
          displayOrder: nextDisplayOrder,
        };
        const res = await categoriesApi.createCategory(payload);
        const newCat: Category = {
          documentId: (res as any)?.data?.documentId || "",
          accountId: ACCOUNT_ID,
          categoryName: data.categoryName,
          categoryDescription: data.categoryDescription || undefined,
          categoryImage: imageUrl || undefined,
          displayOrder: nextDisplayOrder,
          isActive: true,
        };
        onSaved(newCat);
        toast.success("Category created");
      }
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the category details below." : "Fill in the details to create a new category."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Image Upload — TOP */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category Image</Label>
            <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />

            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-muted">
                <img src={imageUrl} alt="Category" className="h-full w-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <Button type="button" size="sm" variant="secondary" className="h-7 px-2 text-xs" onClick={() => imageInputRef.current?.click()} disabled={isUploadingImage}>
                    {isUploadingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3 w-3 mr-1" />}
                    Replace
                  </Button>
                  <Button type="button" size="sm" variant="secondary" className="h-7 w-7 p-0 text-destructive" onClick={() => setImageUrl("")}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 aspect-video cursor-pointer hover:border-primary hover:bg-muted/60 transition-colors"
              >
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UploadCloud className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, SVG</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name *</Label>
            <Input id="cat-name" {...register("categoryName", { required: true })} placeholder="e.g. Apparel, Electronics" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea id="cat-desc" rows={3} {...register("categoryDescription")} placeholder="Brief description of this category..." />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || isUploadingImage} className="bg-primary hover:bg-primary/90 font-semibold">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Form Modal ─────────────────────────────────────────────────────────
interface ProdFormValues {
  productName: string;
  productDescription: string;
  productPrice: number;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  categoryId?: string; // undefined = standalone
  editProduct?: Product | null;
  nextDisplayOrder: number;
  accountId: string;
  onSaved: (prod: Product) => void;
}

function ProductModal({ open, onClose, categoryId, editProduct, nextDisplayOrder, accountId, onSaved }: ProductModalProps) {
  const isEdit = !!editProduct;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [tempId] = useState(() => "p_" + Math.random().toString(36).substring(2, 10));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset, getValues } = useForm<ProdFormValues>({
    defaultValues: { productName: "", productDescription: "", productPrice: 0 },
  });

  useEffect(() => {
    if (open) {
      if (editProduct) {
        reset({ productName: editProduct.productName, productDescription: editProduct.productDescription || "", productPrice: editProduct.productPrice });
        setUploadedImages(editProduct.productImages || []);
      } else {
        reset({ productName: "", productDescription: "", productPrice: 0 });
        setUploadedImages([]);
      }
    }
  }, [open, editProduct, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Select a valid image file"); return; }
    if (uploadedImages.length >= 5) { toast.error("Max 5 images per product"); return; }
    const productName = getValues("productName")?.trim();
    if (!productName) { toast.error("Enter product name first before uploading images."); return; }

    setIsUploadingImage(true);
    try {
      const sanitizedName = productName.toLowerCase().replace(/\s+/g, "");
      const res = await storageService.uploadFile({
        file, accountId, subfolder: "products", prefix: `${sanitizedName}_${uploadedImages.length + 1}`,
      });
      setUploadedImages((prev) => [...prev, res.downloadUrl]);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const onSubmit = async (data: ProdFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && editProduct) {
        const payload: UpdateProductPayload = {
          productName: data.productName,
          productDescription: data.productDescription || undefined,
          productPrice: Number(data.productPrice),
          productImages: uploadedImages,
          displayOrder: editProduct.displayOrder ?? 1,
        };
        await productsApi.updateProduct(editProduct.documentId, payload);
        onSaved({ ...editProduct, ...payload, productImages: uploadedImages });
        toast.success("Product updated");
      } else {
        const payload: CreateProductPayload = {
          accountId,
          productName: data.productName,
          productDescription: data.productDescription || undefined,
          productPrice: Number(data.productPrice),
          productImages: uploadedImages,
          categoryId: categoryId || undefined,
          displayOrder: nextDisplayOrder,
        };
        const res = await productsApi.createProduct(payload);
        const newProd: Product = {
          documentId: (res as any)?.data?.documentId || "",
          accountId,
          productName: data.productName,
          productDescription: data.productDescription || undefined,
          productPrice: Number(data.productPrice),
          productImages: uploadedImages,
          categoryId: categoryId || undefined,
          displayOrder: nextDisplayOrder,
          isActive: true,
          isStandalone: !categoryId,
        };
        onSaved(newProd);
        toast.success("Product created");
      }
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : categoryId ? "Add Product to Category" : "Add Standalone Product"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the product details below." : "Fill in product details. Images will be uploaded immediately."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Image Upload — TOP */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center justify-between">
              <span>Product Images ({uploadedImages.length}/5)</span>
              {uploadedImages.length > 0 && <span className="text-xs text-muted-foreground font-normal">First image = cover</span>}
            </Label>
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div className="grid grid-cols-3 gap-2">
              {uploadedImages.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group bg-muted">
                  <img src={url} alt={`img-${idx + 1}`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-white hover:text-destructive"
                      onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {idx === 0 && <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] px-1 rounded font-bold uppercase">Cover</span>}
                </div>
              ))}
              {uploadedImages.length < 5 && (
                <div onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/40 cursor-pointer transition-colors text-muted-foreground">
                  {isUploadingImage ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : (
                    <><Plus className="h-5 w-5 mb-1 text-primary" /><span className="text-[10px] text-center px-1">Add Image</span></>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-name">Product Name *</Label>
            <Input id="prod-name" {...register("productName", { required: true })} placeholder="e.g. Vintage Denim Jacket" />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-price">Price (₹) *</Label>
            <Input id="prod-price" type="number" step="0.01" min="0" {...register("productPrice", { required: true, valueAsNumber: true })} placeholder="499.00" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-desc">Description</Label>
            <Textarea id="prod-desc" rows={3} {...register("productDescription")} placeholder="Tell customers about features, materials..." />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || isUploadingImage} className="bg-primary hover:bg-primary/90 font-semibold">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  onToggle: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  isToggling: boolean;
  isDeleting: boolean;
}

function ProductCard({ product: p, onToggle, onEdit, onDelete, isToggling, isDeleting }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      {/* Product Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
        {p.productImages?.[0] ? (
          <img src={p.productImages[0]} alt={p.productName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
            <Package className="h-10 w-10" />
          </div>
        )}
        {p.productImages && p.productImages.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
            +{p.productImages.length - 1}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <div>
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">{p.productName}</h3>
          {p.productPrice != null && (
            <p className="text-base font-bold text-primary mt-0.5">₹{p.productPrice.toLocaleString("en-IN")}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                checked={p.isActive ?? true}
                onCheckedChange={() => onToggle(p)}
                className="scale-75"
              />
            )}
            <span className="text-[11px] text-muted-foreground">{p.isActive ? "Active" : "Inactive"}</span>
          </div>

          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => onEdit(p)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive/70 hover:text-destructive" disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{p.productName}"?</AlertDialogTitle>
                  <AlertDialogDescription>This soft-deletes the product from your catalog.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onDelete(p)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main CategoriesPage ───────────────────────────────────────────────────────
export function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);
  const [togglingCatId, setTogglingCatId] = useState<string | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const [standaloneProducts, setStandaloneProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [togglingProdId, setTogglingProdId] = useState<string | null>(null);
  const [deletingProdId, setDeletingProdId] = useState<string | null>(null);

  // Category modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Standalone product modal state
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);

  const loadCategories = useCallback(async () => {
    setCatsLoading(true); setCatsError(null);
    try {
      const res = await categoriesApi.getCategoriesByAccount(ACCOUNT_ID);
      setCategories(res.success && res.data ? res.data.filter((c) => !c.isDeleted) : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load categories";
      setCatsError(msg); toast.error(msg);
    } finally { setCatsLoading(false); }
  }, []);

  const loadStandaloneProducts = useCallback(async () => {
    setProductsLoading(true); setProductsError(null);
    try {
      const res = await productsApi.getStandaloneProducts(ACCOUNT_ID);
      setStandaloneProducts(res.success && res.data ? res.data.filter((p) => !p.isDeleted) : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setProductsError(msg); toast.error(msg);
    } finally { setProductsLoading(false); }
  }, []);

  const loadAll = useCallback(() => { loadCategories(); loadStandaloneProducts(); }, [loadCategories, loadStandaloneProducts]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleToggleCatStatus = async (cat: Category) => {
    if (togglingCatId) return;
    setTogglingCatId(cat.documentId);
    try {
      await categoriesApi.updateCategoryStatus(cat.documentId, !cat.isActive);
      setCategories((prev) => prev.map((c) => c.documentId === cat.documentId ? { ...c, isActive: !c.isActive } : c));
      toast.success(`"${cat.categoryName}" ${!cat.isActive ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally { setTogglingCatId(null); }
  };

  const handleCatDelete = async (cat: Category) => {
    setDeletingCatId(cat.documentId);
    try {
      await categoriesApi.deleteCategory(cat.documentId);
      setCategories((prev) => prev.filter((c) => c.documentId !== cat.documentId));
      toast.success(`"${cat.categoryName}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally { setDeletingCatId(null); }
  };

  const handleToggleProdStatus = async (prod: Product) => {
    if (togglingProdId) return;
    setTogglingProdId(prod.documentId);
    try {
      await productsApi.updateProductStatus(prod.documentId, !prod.isActive);
      setStandaloneProducts((prev) => prev.map((p) => p.documentId === prod.documentId ? { ...p, isActive: !p.isActive } : p));
      toast.success(`"${prod.productName}" ${!prod.isActive ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally { setTogglingProdId(null); }
  };

  const handleProdDelete = async (prod: Product) => {
    setDeletingProdId(prod.documentId);
    try {
      await productsApi.deleteProduct(prod.documentId);
      setStandaloneProducts((prev) => prev.filter((p) => p.documentId !== prod.documentId));
      toast.success(`"${prod.productName}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally { setDeletingProdId(null); }
  };

  const nextCatOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.displayOrder || 0)) + 1 : 1;
  const nextProdOrder = standaloneProducts.length > 0 ? Math.max(...standaloneProducts.map((p) => p.displayOrder || 0)) + 1 : 1;

  return (
    <PageContainer>
      <PageHeader
        title="Categories & Products"
        description="Manage categories and standalone items inside your shop catalog."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadAll} disabled={catsLoading && productsLoading}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${catsLoading || productsLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => { setEditingCat(null); setCatModalOpen(true); }}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Category
            </Button>
          </div>
        }
      />

      {/* ── CATEGORIES ── */}
      <div className="space-y-4 mb-12">
        <SectionHeader title="Categories" description="Click a category to view and manage its products." />

        {catsLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!catsLoading && catsError && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="font-semibold text-sm">Failed to load categories</p>
            <p className="text-xs text-muted-foreground mt-1">{catsError}</p>
          </div>
        )}

        {!catsLoading && !catsError && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            <FolderTree className="h-10 w-10 text-muted-foreground/35 mb-3" />
            <p className="text-sm font-semibold">No categories yet</p>
            <p className="text-xs mt-1 mb-4">Create your first category to start organizing products.</p>
            <Button size="sm" onClick={() => { setEditingCat(null); setCatModalOpen(true); }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Category
            </Button>
          </div>
        )}

        {!catsLoading && !catsError && categories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.documentId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="group flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => { navigate({ to: `/business/categories/detail/$id`, params: { id: cat.documentId } }); }}
              >
                {/* Category Image — rectangular */}
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  {cat.categoryImage ? (
                    <img src={cat.categoryImage} alt={cat.categoryName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <FolderTree className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  {/* Status badge overlay */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={cat.isActive ? "default" : "secondary"} className="text-[10px] shadow">
                      {cat.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <div>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">{cat.categoryName}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{cat.categoryDescription || "No description provided."}</p>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                    {/* Toggle switch */}
                    <div className="flex items-center gap-1.5">
                      {togglingCatId === cat.documentId ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Switch
                          checked={cat.isActive}
                          onCheckedChange={() => handleToggleCatStatus(cat)}
                          className="scale-75"
                        />
                      )}
                      <span className="text-[11px] text-muted-foreground">{cat.isActive ? "Active" : "Inactive"}</span>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => { setEditingCat(cat); setCatModalOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive/70 hover:text-destructive" disabled={deletingCatId === cat.documentId}>
                            {deletingCatId === cat.documentId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{cat.categoryName}"?</AlertDialogTitle>
                            <AlertDialogDescription>This soft-deletes the category. Products inside will remain but won't appear under this category.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleCatDelete(cat)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── STANDALONE PRODUCTS ── */}
      <div className="space-y-4">
        <SectionHeader
          title="Standalone Products"
          description="Products that don't belong to any category."
          actions={
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs gap-1.5"
              onClick={() => { setEditingProd(null); setProdModalOpen(true); }}>
              <Plus className="h-3.5 w-3.5" /> Add Standalone Product
            </Button>
          }
        />

        {productsLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!productsLoading && productsError && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="font-semibold text-sm">Failed to load products</p>
            <p className="text-xs text-muted-foreground mt-1">{productsError}</p>
          </div>
        )}

        {!productsLoading && !productsError && standaloneProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            <Package className="h-10 w-10 text-muted-foreground/35 mb-3" />
            <p className="text-sm font-semibold">No standalone products yet</p>
            <p className="text-xs mt-1 mb-4">Standalone products don't appear inside categories.</p>
            <Button size="sm" variant="outline" onClick={() => { setEditingProd(null); setProdModalOpen(true); }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
            </Button>
          </div>
        )}

        {!productsLoading && !productsError && standaloneProducts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {standaloneProducts.map((p) => (
                <ProductCard
                  key={p.documentId}
                  product={p}
                  onToggle={handleToggleProdStatus}
                  onEdit={(prod) => { setEditingProd(prod); setProdModalOpen(true); }}
                  onDelete={handleProdDelete}
                  isToggling={togglingProdId === p.documentId}
                  isDeleting={deletingProdId === p.documentId}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={catModalOpen}
        onClose={() => { setCatModalOpen(false); setEditingCat(null); }}
        editCategory={editingCat}
        nextDisplayOrder={nextCatOrder}
        onSaved={(cat) => {
          if (editingCat) {
            setCategories((prev) => prev.map((c) => c.documentId === cat.documentId ? cat : c));
          } else {
            // Reload categories to get actual ID from backend
            loadCategories();
          }
        }}
      />

      {/* Standalone Product Modal */}
      <ProductModal
        open={prodModalOpen}
        onClose={() => { setProdModalOpen(false); setEditingProd(null); }}
        editProduct={editingProd}
        nextDisplayOrder={nextProdOrder}
        accountId={ACCOUNT_ID}
        onSaved={(prod) => {
          if (editingProd) {
            setStandaloneProducts((prev) => prev.map((p) => p.documentId === prod.documentId ? prod : p));
          } else {
            loadStandaloneProducts();
          }
        }}
      />
    </PageContainer>
  );
}
