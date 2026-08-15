import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate, Outlet, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, FolderTree, Hash, RefreshCw, ToggleLeft, ToggleRight, Loader2, AlertCircle, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/Badges";
import { toast } from "sonner";
import { categoriesApi, Category } from "@/services/categoriesApi";
import { productsApi, Product } from "@/services/productsApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// This route is the LAYOUT for /business/categories/*
// It just renders <Outlet /> so child routes (/new, /edit/$id, /detail/$id, and the index) render inside it.
export const Route = createFileRoute("/business/categories")({
  component: CategoriesLayout,
});

function CategoriesLayout() {
  return <Outlet />;
}

// ─── The actual list page ─────────────────────────────────────────────────────
const ACCOUNT_ID = "ACC-8832";

export function CategoriesPage() {
  const navigate = useNavigate();
  
  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);
  const [togglingCatId, setTogglingCatId] = useState<string | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Standalone Products State
  const [standaloneProducts, setStandaloneProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [togglingProdId, setTogglingProdId] = useState<string | null>(null);
  const [deletingProdId, setDeletingProdId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setCatsLoading(true);
    setCatsError(null);
    try {
      const res = await categoriesApi.getCategoriesByAccount(ACCOUNT_ID);
      if (res.success && res.data) {
        setCategories(res.data.filter((c) => !c.isDeleted));
      } else {
        setCategories([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load categories";
      setCatsError(msg);
      toast.error(`Categories error: ${msg}`);
    } finally {
      setCatsLoading(false);
    }
  }, []);

  const loadStandaloneProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await productsApi.getStandaloneProducts(ACCOUNT_ID);
      if (res.success && res.data) {
        setStandaloneProducts(res.data.filter((p) => !p.isDeleted));
      } else {
        setStandaloneProducts([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load standalone products";
      setProductsError(msg);
      toast.error(`Products error: ${msg}`);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadAll = useCallback(() => {
    loadCategories();
    loadStandaloneProducts();
  }, [loadCategories, loadStandaloneProducts]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleToggleCatStatus = async (cat: Category) => {
    if (togglingCatId) return;
    setTogglingCatId(cat.documentId);
    try {
      await categoriesApi.updateCategoryStatus(cat.documentId, !cat.isActive);
      setCategories((prev) =>
        prev.map((c) => (c.documentId === cat.documentId ? { ...c, isActive: !c.isActive } : c)),
      );
      toast.success(`"${cat.categoryName}" ${!cat.isActive ? "enabled" : "disabled"} successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setTogglingCatId(null);
    }
  };

  const handleCatDelete = async (cat: Category) => {
    setDeletingCatId(cat.documentId);
    try {
      await categoriesApi.deleteCategory(cat.documentId);
      setCategories((prev) => prev.filter((c) => c.documentId !== cat.documentId));
      toast.success(`"${cat.categoryName}" deleted successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleToggleProdStatus = async (prod: Product) => {
    if (togglingProdId) return;
    setTogglingProdId(prod.documentId);
    try {
      await productsApi.updateProductStatus(prod.documentId, !prod.isActive);
      setStandaloneProducts((prev) =>
        prev.map((p) => (p.documentId === prod.documentId ? { ...p, isActive: !p.isActive } : p)),
      );
      toast.success(`"${prod.productName}" ${!prod.isActive ? "enabled" : "disabled"} successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setTogglingProdId(null);
    }
  };

  const handleProdDelete = async (prod: Product) => {
    setDeletingProdId(prod.documentId);
    try {
      await productsApi.deleteProduct(prod.documentId);
      setStandaloneProducts((prev) => prev.filter((p) => p.documentId !== prod.documentId));
      toast.success(`"${prod.productName}" deleted successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingProdId(null);
    }
  };

  const isAllLoading = catsLoading && productsLoading;

  return (
    <PageContainer>
      <PageHeader
        title="Categories & Products"
        description="Manage categories and standalone items inside your shop catalog."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadAll} disabled={isAllLoading}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isAllLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate({ to: "/business/categories/new" })}
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add Category
            </Button>
          </div>
        }
      />

      {/* ── SECTION 1: CATEGORIES ── */}
      <div className="space-y-4 mb-12">
        <SectionHeader 
          title="Categories" 
          description="Click a category to view and manage its products."
        />

        {catsLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-surface p-5 animate-pulse h-36" />
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
            <p className="text-xs mt-1">Create your first category to start organizing products.</p>
          </div>
        )}

        {!catsLoading && !catsError && categories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.documentId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="card-surface group flex flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer border border-border/80"
                onClick={() => navigate({ to: `/business/categories/detail/$id`, params: { id: cat.documentId } })}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted border border-border shrink-0">
                      {cat.categoryImage ? (
                        <img
                          src={cat.categoryImage}
                          alt={cat.categoryName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-primary bg-primary/10">
                          <FolderTree className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Badge variant={cat.isActive ? "default" : "secondary"} className="text-[10px]">
                        {cat.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <Hash className="h-3 w-3" /> {cat.displayOrder}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">{cat.categoryName}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {cat.categoryDescription || "No description provided."}
                  </p>
                </div>

                {/* Actions on Card (prevent navigating to details when clicking action buttons) */}
                <div className="mt-4 flex gap-2 pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`flex-1 text-xs h-8 ${cat.isActive ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"}`}
                    onClick={() => handleToggleCatStatus(cat)}
                    disabled={togglingCatId === cat.documentId}
                  >
                    {togglingCatId === cat.documentId ? (
                      <Loader2 className="h-3 animate-spin mr-1" />
                    ) : cat.isActive ? (
                      <ToggleRight className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <ToggleLeft className="h-3.5 w-3.5 mr-1" />
                    )}
                    {cat.isActive ? "Disable" : "Enable"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => navigate({ to: `/business/categories/edit/$id`, params: { id: cat.documentId } })}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-destructive hover:bg-destructive/10"
                        disabled={deletingCatId === cat.documentId}
                      >
                        {deletingCatId === cat.documentId ? (
                          <Loader2 className="h-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{cat.categoryName}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will soft-delete the category. Products inside it will remain but won't be visible under this category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleCatDelete(cat)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 2: STANDALONE PRODUCTS ── */}
      <div className="space-y-4">
        <SectionHeader 
          title="Standalone Products" 
          description="Products that don't belong to any category."
          actions={
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs gap-1.5"
              onClick={() => navigate({ to: "/business/products/new", search: { standalone: true } })}
            >
              <Plus className="h-3.5 w-3.5" /> Add Standalone Product
            </Button>
          }
        />

        {productsLoading && (
          <div className="card-surface p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
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
            <p className="text-xs mt-1">Standalone products don't appear inside categories.</p>
          </div>
        )}

        {!productsLoading && !productsError && standaloneProducts.length > 0 && (
          <div className="card-surface overflow-hidden border border-border/80">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Product Name</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Display Order</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {standaloneProducts.map((p) => (
                    <tr key={p.documentId} className="border-b border-border last:border-0 hover:bg-accent/30">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {p.productImages?.[0] ? (
                              <img src={p.productImages[0]} alt={p.productName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-muted-foreground">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <span>{p.productName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        ${(p.productPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {p.displayOrder ?? 1}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.isActive ? "Active" : "Inactive"} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => handleToggleProdStatus(p)}
                            disabled={togglingProdId === p.documentId}
                          >
                            {togglingProdId === p.documentId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : p.isActive ? (
                              <ToggleRight className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>

                          <Button asChild size="sm" variant="outline" className="h-8 px-2">
                            <Link to="/business/products/edit/$id" params={{ id: p.documentId }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-destructive hover:bg-destructive/10"
                                disabled={deletingProdId === p.documentId}
                              >
                                {deletingProdId === p.documentId ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete product "{p.productName}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This soft-deletes the product from your catalog.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleProdDelete(p)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
