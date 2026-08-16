import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus, Pencil, Trash2, FolderTree, RefreshCw, Loader2,
  AlertCircle, Package, ArrowLeft, UploadCloud, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/common/PageContainer";
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
import { categoriesApi, Category } from "@/services/categoriesApi";
import { productsApi, Product, CreateProductPayload, UpdateProductPayload } from "@/services/productsApi";
import { storageService } from "@/services/storageService";

export const Route = createFileRoute("/business/categories/detail/$id")({
  component: CategoryDetailPage,
});

const ACCOUNT_ID = "ACC-8832";

// ─── Product Form Modal ─────────────────────────────────────────────────────────
interface ProdFormValues {
  productName: string;
  productDescription: string;
  productPrice: number;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  editProduct?: Product | null;
  nextDisplayOrder: number;
  onSaved: (prod: Product) => void;
}

function ProductModal({ open, onClose, categoryId, editProduct, nextDisplayOrder, onSaved }: ProductModalProps) {
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
      const folderId = editProduct ? editProduct.documentId : tempId;
      const res = await storageService.uploadFile({
        file, accountId: ACCOUNT_ID, subfolder: `products/${folderId}`, prefix: `prod_${uploadedImages.length + 1}`,
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
        };
        await productsApi.updateProduct(editProduct.documentId, payload);
        onSaved({ ...editProduct, ...payload, productImages: uploadedImages });
        toast.success("Product updated");
      } else {
        const payload: CreateProductPayload = {
          accountId: ACCOUNT_ID,
          productName: data.productName,
          productDescription: data.productDescription || undefined,
          productPrice: Number(data.productPrice),
          productImages: uploadedImages,
          categoryId,
          displayOrder: nextDisplayOrder,
        };
        const res = await productsApi.createProduct(payload);
        const newProd: Product = {
          documentId: (res as any)?.data?.documentId || "",
          accountId: ACCOUNT_ID,
          productName: data.productName,
          productDescription: data.productDescription || undefined,
          productPrice: Number(data.productPrice),
          productImages: uploadedImages,
          categoryId,
          displayOrder: nextDisplayOrder,
          isActive: true,
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
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product to Category"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the product details below." : "Fill in product details. Images upload immediately."}</DialogDescription>
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
            <Label htmlFor="det-prod-name">Product Name *</Label>
            <Input id="det-prod-name" {...register("productName", { required: true })} placeholder="e.g. Vintage Denim Jacket" />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="det-prod-price">Price (₹) *</Label>
            <Input id="det-prod-price" type="number" step="0.01" min="0" {...register("productPrice", { required: true, valueAsNumber: true })} placeholder="499.00" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="det-prod-desc">Description</Label>
            <Textarea id="det-prod-desc" rows={3} {...register("productDescription")} placeholder="Tell customers about features, materials..." />
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

// ─── Category Detail Page ──────────────────────────────────────────────────────
function CategoryDetailPage() {
  const { id: categoryId } = Route.useParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [togglingProdId, setTogglingProdId] = useState<string | null>(null);
  const [deletingProdId, setDeletingProdId] = useState<string | null>(null);

  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);

  const loadCategoryDetails = useCallback(async () => {
    setCategoryLoading(true); setCategoryError(null);
    try {
      const res = await categoriesApi.getCategoryById(categoryId);
      setCategory(res.success && res.data ? res.data : null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load category details";
      setCategoryError(msg); toast.error(msg);
    } finally { setCategoryLoading(false); }
  }, [categoryId]);

  const loadCategoryProducts = useCallback(async () => {
    setProductsLoading(true); setProductsError(null);
    try {
      const res = await productsApi.getProductsByCategory(categoryId);
      setProducts(res.success && res.data ? res.data.filter((p) => !p.isDeleted) : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load category products";
      setProductsError(msg); toast.error(msg);
    } finally { setProductsLoading(false); }
  }, [categoryId]);

  const loadAll = useCallback(() => { loadCategoryDetails(); loadCategoryProducts(); }, [loadCategoryDetails, loadCategoryProducts]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleToggleProdStatus = async (prod: Product) => {
    if (togglingProdId) return;
    setTogglingProdId(prod.documentId);
    try {
      await productsApi.updateProductStatus(prod.documentId, !prod.isActive);
      setProducts((prev) => prev.map((p) => p.documentId === prod.documentId ? { ...p, isActive: !p.isActive } : p));
      toast.success(`"${prod.productName}" ${!prod.isActive ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally { setTogglingProdId(null); }
  };

  const handleProdDelete = async (prod: Product) => {
    setDeletingProdId(prod.documentId);
    try {
      await productsApi.deleteProduct(prod.documentId);
      setProducts((prev) => prev.filter((p) => p.documentId !== prod.documentId));
      toast.success(`"${prod.productName}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally { setDeletingProdId(null); }
  };

  const nextProdOrder = products.length > 0 ? Math.max(...products.map((p) => p.displayOrder || 0)) + 1 : 1;

  // ── Loading State
  if (categoryLoading) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/business/categories"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
          </Button>
        </div>
        <div className="card-surface p-6 animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </PageContainer>
    );
  }

  // ── Error State
  if (categoryError || !category) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/business/categories"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-12 text-center text-destructive">
          <AlertCircle className="h-10 w-10 mb-3" />
          <p className="font-semibold">Category not found</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">{categoryError || "No category metadata found"}</p>
          <Button variant="outline" size="sm" asChild><Link to="/business/categories">Back to Overview</Link></Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/business/categories">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Categories
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadAll} disabled={productsLoading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${productsLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90 font-semibold text-sm"
            onClick={() => { setEditingProd(null); setProdModalOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Category Banner */}
      <div className="rounded-2xl overflow-hidden border border-border/80 shadow-sm mb-8">
        {/* Category Image — full width banner */}
        <div className="aspect-[21/6] w-full bg-muted relative overflow-hidden">
          {category.categoryImage ? (
            <img src={category.categoryImage} alt={category.categoryName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <FolderTree className="h-12 w-12 text-primary/30" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Category name overlay */}
          <div className="absolute bottom-0 left-0 p-5">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{category.categoryName}</h1>
              <Badge variant={category.isActive ? "default" : "secondary"} className="text-[10px]">
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {category.categoryDescription && (
              <p className="text-sm text-white/75 max-w-xl">{category.categoryDescription}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Products in this Category</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{products.length} product{products.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

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

        {!productsLoading && !productsError && products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            <Package className="h-10 w-10 text-muted-foreground/35 mb-3" />
            <p className="text-sm font-semibold">No products in this category yet</p>
            <p className="text-xs mt-1 mb-4">Add your first product to display it inside this category.</p>
            <Button size="sm" onClick={() => { setEditingProd(null); setProdModalOpen(true); }}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
            </Button>
          </div>
        )}

        {!productsLoading && !productsError && products.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {products.map((p, i) => (
                <motion.div
                  key={p.documentId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
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

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 p-3 gap-2">
                    <div>
                      <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">{p.productName}</h3>
                      {p.productPrice != null && (
                        <p className="text-base font-bold text-primary mt-0.5">₹{p.productPrice.toLocaleString("en-IN")}</p>
                      )}
                      {p.productDescription && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.productDescription}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        {togglingProdId === p.documentId ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Switch
                            checked={p.isActive ?? true}
                            onCheckedChange={() => handleToggleProdStatus(p)}
                            className="scale-75"
                          />
                        )}
                        <span className="text-[11px] text-muted-foreground">{p.isActive ? "Active" : "Inactive"}</span>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => { setEditingProd(p); setProdModalOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive/70 hover:text-destructive" disabled={deletingProdId === p.documentId}>
                              {deletingProdId === p.documentId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{p.productName}"?</AlertDialogTitle>
                              <AlertDialogDescription>This soft-deletes the product from your catalog.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleProdDelete(p)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        open={prodModalOpen}
        onClose={() => { setProdModalOpen(false); setEditingProd(null); }}
        categoryId={categoryId}
        editProduct={editingProd}
        nextDisplayOrder={nextProdOrder}
        onSaved={(prod) => {
          if (editingProd) {
            setProducts((prev) => prev.map((p) => p.documentId === prod.documentId ? prod : p));
          } else {
            // Reload to get real ID
            loadCategoryProducts();
          }
        }}
      />
    </PageContainer>
  );
}
