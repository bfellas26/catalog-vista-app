import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, FolderTree, Hash, RefreshCw, ToggleLeft, ToggleRight, Loader2, AlertCircle, Package, ArrowLeft } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
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

export const Route = createFileRoute("/business/categories/detail/$id")({
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const { id: categoryId } = Route.useParams();
  const navigate = useNavigate();

  // Category Metadata State
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  const [togglingProdId, setTogglingProdId] = useState<string | null>(null);
  const [deletingProdId, setDeletingProdId] = useState<string | null>(null);

  const loadCategoryDetails = useCallback(async () => {
    setCategoryLoading(true);
    setCategoryError(null);
    try {
      const res = await categoriesApi.getCategoryById(categoryId);
      if (res.success && res.data) {
        setCategory(res.data);
      } else {
        setCategory(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load category details";
      setCategoryError(msg);
      toast.error(`Category error: ${msg}`);
    } finally {
      setCategoryLoading(false);
    }
  }, [categoryId]);

  const loadCategoryProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await productsApi.getProductsByCategory(categoryId);
      if (res.success && res.data) {
        setProducts(res.data.filter((p) => !p.isDeleted));
      } else {
        setProducts([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load category products";
      setProductsError(msg);
      toast.error(`Products error: ${msg}`);
    } finally {
      setProductsLoading(false);
    }
  }, [categoryId]);

  const loadAll = useCallback(() => {
    loadCategoryDetails();
    loadCategoryProducts();
  }, [loadCategoryDetails, loadCategoryProducts]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleToggleProdStatus = async (prod: Product) => {
    if (togglingProdId) return;
    setTogglingProdId(prod.documentId);
    try {
      await productsApi.updateProductStatus(prod.documentId, !prod.isActive);
      setProducts((prev) =>
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
      setProducts((prev) => prev.filter((p) => p.documentId !== prod.documentId));
      toast.success(`"${prod.productName}" deleted successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingProdId(null);
    }
  };

  if (categoryLoading) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/business/categories" })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <div className="card-surface p-6 animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </PageContainer>
    );
  }

  if (categoryError || !category) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/business/categories" })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-12 text-center text-destructive">
          <AlertCircle className="h-10 w-10 mb-3" />
          <p className="font-semibold">Category not found</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">{categoryError || "No category metadata found"}</p>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/business/categories" })}>
            Back to Overview
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header back button */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/business/categories">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Categories
          </Link>
        </Button>
      </div>

      {/* Category Info Board */}
      <div className="card-surface p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-border/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted border border-border shrink-0 flex items-center justify-center">
            {category.categoryImage ? (
              <img src={category.categoryImage} alt={category.categoryName} className="h-full w-full object-cover" />
            ) : (
              <FolderTree className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{category.categoryName}</h1>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{category.categoryDescription || "No description provided."}</p>
            <p className="text-xs text-muted-foreground font-mono mt-1.5 flex items-center gap-2">
              <span>Display Order: {category.displayOrder}</span>
              <span>•</span>
              <span>ID: {category.documentId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadAll} disabled={productsLoading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${productsLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => navigate({ to: `/business/products/new`, search: { categoryId: category.documentId } })}
            className="bg-primary hover:bg-primary-dark font-semibold text-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Product to Category
          </Button>
        </div>
      </div>

      {/* Category Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Category Products</h2>
        </div>

        {productsLoading && (
          <div className="card-surface p-6 space-y-4 animate-pulse">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-5 bg-muted rounded w-full" />
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
            <p className="text-xs mt-1">Add your first product to display it inside this category.</p>
          </div>
        )}

        {!productsLoading && !productsError && products.length > 0 && (
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
                  {products.map((p) => (
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
