import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Filter, Pencil, Trash2, Package, FolderTree, Tags } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { SearchBar } from "@/components/common/SearchBar";
import { StatusBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategoryStore, useProductTagStore, useProductStore } from "@/store";

export const Route = createFileRoute("/business/products")({
  component: ProductsPage,
});

type TabType = "products" | "categories" | "tags";

function ProductsPage() {
  const [tab, setTab] = useState<TabType>("products");
  const [q, setQ] = useState("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Products store
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  // Categories store
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);

  // Tags store
  const tags = useProductTagStore((s) => s.tags);
  const addTag = useProductTagStore((s) => s.addTag);
  const deleteTag = useProductTagStore((s) => s.deleteTag);

  const filteredProducts = products.filter((p) =>
    (p.productName || (p as any).name || "").toLowerCase().includes(q.toLowerCase()),
  );

  const tabsInfo = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "categories" as const, label: "Categories", icon: FolderTree },
    { id: "tags" as const, label: "Product Tags", icon: Tags },
  ];

  // ── Product form ──────────────────────────────────────────────
  const productForm = useForm({
    defaultValues: {
      accountId: "ACC-8832",
      productName: "",
      categoryId: "",
      description: "",
      imageUrls: "",
      price: 0,
      sortOrder: 1,
      tagIds: "",
      searchKeywords: "",
      isActive: true,
      isDeleted: false,
      isStandalone: false,
      createdBy: "admin@aurora.com",
      updatedBy: "admin@aurora.com",
    },
  });
  const isProductActive = productForm.watch("isActive");
  const isProductDeleted = productForm.watch("isDeleted");
  const isProductStandalone = productForm.watch("isStandalone");

  const onProductSubmit = (data: any) => {
    addProduct({
      ...data,
      imageUrls: data.imageUrls
        ? data.imageUrls
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      tagIds: data.tagIds
        ? data.tagIds
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      searchKeywords: data.searchKeywords
        ? data.searchKeywords
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      price: Number(data.price),
      sortOrder: Number(data.sortOrder),
    });
    toast.success("Product created successfully");
    setIsProductDialogOpen(false);
    productForm.reset();
  };

  // ── Category form ─────────────────────────────────────────────
  const categoryForm = useForm({
    defaultValues: {
      accountId: "ACC-8832",
      categoryName: "",
      description: "",
      displayOrder: "1",
      imageUrl: "",
      isActive: true,
      isDeleted: false,
      createdBy: "admin@aurora.com",
      updatedBy: "admin@aurora.com",
    },
  });
  const isCategoryActive = categoryForm.watch("isActive");
  const isCategoryDeleted = categoryForm.watch("isDeleted");

  const onCategorySubmit = (data: any) => {
    addCategory(data);
    toast.success("Category created successfully");
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
  };

  // ── Tag form ──────────────────────────────────────────────────
  const tagForm = useForm({
    defaultValues: {
      accountId: "ACC-8832",
      tagName: "",
      color: "#eab308",
      isDeleted: false,
      createdBy: "admin@aurora.com",
      updatedBy: "admin@aurora.com",
    },
  });
  const isTagDeleted = tagForm.watch("isDeleted");
  const currentColor = tagForm.watch("color");

  const onTagSubmit = (data: any) => {
    addTag(data);
    toast.success("Product tag created successfully");
    setIsTagDialogOpen(false);
    tagForm.reset();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Product Management"
        description="Organize your shop catalogue, categories, and tags."
        actions={
          tab === "products" ? (
            <Button
              onClick={() => setIsProductDialogOpen(true)}
              className="bg-primary hover:bg-primary-dark cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add product
            </Button>
          ) : tab === "categories" ? (
            <Button
              onClick={() => setIsCategoryDialogOpen(true)}
              className="bg-primary hover:bg-primary-dark cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add category
            </Button>
          ) : (
            <Button
              onClick={() => setIsTagDialogOpen(true)}
              className="bg-primary hover:bg-primary-dark cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add tag
            </Button>
          )
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {tabsInfo.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setQ("");
              }}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Products Tab ── */}
        {tab === "products" && (
          <motion.div
            key="products-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-surface">
              <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar placeholder="Search products…" value={q} onChange={setQ} />
                <Button variant="outline" size="sm">
                  <Filter className="mr-1.5 h-3.5 w-3.5" /> Filter
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Product Name</th>
                      <th className="px-4 py-3 text-left font-medium">Category ID</th>
                      <th className="px-4 py-3 text-left font-medium">Price</th>
                      <th className="px-4 py-3 text-left font-medium">Sort Order</th>
                      <th className="px-4 py-3 text-left font-medium">Active</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-accent/30"
                      >
                        <td className="px-4 py-3 font-semibold text-foreground">{p.productName}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                          {p.categoryId}
                        </td>
                        <td className="px-4 py-3 font-medium">${p.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.sortOrder}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.isActive ? "Active" : "Inactive"} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link to="/business/products/edit/$id" params={{ id: p.id }}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                deleteProduct(p.id);
                                toast.success("Product deleted");
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Categories Tab ── */}
        {tab === "categories" && (
          <motion.div
            key="categories-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-surface group p-5 transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FolderTree className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{c.categoryName}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                    {c.description || "No description"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2 pt-2 border-t border-border">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to="/business/categories/edit/$id" params={{ id: c.id }}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      deleteCategory(c.id);
                      toast.success("Category deleted");
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Tags Tab ── */}
        {tab === "tags" && (
          <motion.div
            key="tags-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Tag</th>
                    <th className="px-4 py-3 text-left font-medium">Account ID</th>
                    <th className="px-4 py-3 text-left font-medium">Color</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-border last:border-0 hover:bg-accent/30"
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-border"
                            style={{ backgroundColor: t.color }}
                          />
                          {t.tagName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {t.accountId}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {t.color}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            deleteTag(t.id);
                            toast.success("Tag deleted");
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Product Dialog ── */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Fields match the products database collection schema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-accountId">Account ID</Label>
                <Input
                  id="p-accountId"
                  {...productForm.register("accountId")}
                  placeholder="ACC-8832"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-productName">Product Name</Label>
                <Input
                  id="p-productName"
                  {...productForm.register("productName")}
                  placeholder="Linen Shirt"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-categoryId">Category ID</Label>
                <Input
                  id="p-categoryId"
                  {...productForm.register("categoryId")}
                  placeholder="cat-1"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price</Label>
                <Input
                  id="p-price"
                  type="number"
                  step="0.01"
                  {...productForm.register("price")}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-description">Description</Label>
              <Textarea
                id="p-description"
                rows={3}
                {...productForm.register("description")}
                placeholder="Product description..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-imageUrls">Image URLs (comma separated)</Label>
              <Input
                id="p-imageUrls"
                {...productForm.register("imageUrls")}
                placeholder="https://..., https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-sortOrder">Sort Order</Label>
                <Input
                  id="p-sortOrder"
                  type="number"
                  {...productForm.register("sortOrder")}
                  placeholder="1"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-tagIds">Tag IDs (comma separated)</Label>
                <Input id="p-tagIds" {...productForm.register("tagIds")} placeholder="t-1, t-2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-searchKeywords">Search Keywords (comma separated)</Label>
              <Input
                id="p-searchKeywords"
                {...productForm.register("searchKeywords")}
                placeholder="aurora, studio"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-xs font-medium">isActive</Label>
                <Switch
                  checked={isProductActive}
                  onCheckedChange={(v) => productForm.setValue("isActive", v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-xs font-medium">isDeleted</Label>
                <Switch
                  checked={isProductDeleted}
                  onCheckedChange={(v) => productForm.setValue("isDeleted", v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-xs font-medium">isStandalone</Label>
                <Switch
                  checked={isProductStandalone}
                  onCheckedChange={(v) => productForm.setValue("isStandalone", v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-createdBy">Created By</Label>
                <Input id="p-createdBy" {...productForm.register("createdBy")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-updatedBy">Updated By</Label>
                <Input id="p-updatedBy" {...productForm.register("updatedBy")} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                Create product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Add Category Dialog ── */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Fields match the categories database collection schema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-accountId">Account ID</Label>
                <Input
                  id="c-accountId"
                  {...categoryForm.register("accountId")}
                  placeholder="ACC-8832"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-categoryName">Category Name</Label>
                <Input
                  id="c-categoryName"
                  {...categoryForm.register("categoryName")}
                  placeholder="Apparel"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-description">Description</Label>
              <Textarea
                id="c-description"
                rows={3}
                {...categoryForm.register("description")}
                placeholder="Describe this category..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-displayOrder">Display Order</Label>
                <Input
                  id="c-displayOrder"
                  {...categoryForm.register("displayOrder")}
                  placeholder="1"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-imageUrl">Image URL</Label>
                <Input
                  id="c-imageUrl"
                  {...categoryForm.register("imageUrl")}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-xs font-medium">isActive</Label>
                <Switch
                  checked={isCategoryActive}
                  onCheckedChange={(v) => categoryForm.setValue("isActive", v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="text-xs font-medium">isDeleted</Label>
                <Switch
                  checked={isCategoryDeleted}
                  onCheckedChange={(v) => categoryForm.setValue("isDeleted", v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-createdBy">Created By</Label>
                <Input id="c-createdBy" {...categoryForm.register("createdBy")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-updatedBy">Updated By</Label>
                <Input id="c-updatedBy" {...categoryForm.register("updatedBy")} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                Create category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Add Tag Dialog ── */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product Tag</DialogTitle>
            <DialogDescription>
              Fields match the productTags database collection schema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={tagForm.handleSubmit(onTagSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="t-accountId">Account ID</Label>
              <Input
                id="t-accountId"
                {...tagForm.register("accountId")}
                placeholder="ACC-8832"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-tagName">Tag Name</Label>
              <Input
                id="t-tagName"
                placeholder="e.g. New"
                {...tagForm.register("tagName")}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-color">Tag Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="t-color"
                  type="color"
                  className="h-10 w-16 p-1 cursor-pointer"
                  {...tagForm.register("color")}
                />
                <Input
                  type="text"
                  className="font-mono"
                  value={currentColor}
                  onChange={(e) => tagForm.setValue("color", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Is Deleted</Label>
                <p className="text-xs text-muted-foreground">Soft deletion status (isDeleted)</p>
              </div>
              <Switch
                checked={isTagDeleted}
                onCheckedChange={(v) => tagForm.setValue("isDeleted", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="t-createdBy">Created By</Label>
                <Input id="t-createdBy" {...tagForm.register("createdBy")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-updatedBy">Updated By</Label>
                <Input id="t-updatedBy" {...tagForm.register("updatedBy")} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                Create tag
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
