import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCategoryStore } from "@/store";

export const Route = createFileRoute("/business/categories/new")({
  component: NewCategoryPage,
});

function NewCategoryPage() {
  const navigate = useNavigate();
  const addCategory = useCategoryStore((s) => s.addCategory);

  const { register, handleSubmit, watch, setValue } = useForm({
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

  const isActive = watch("isActive");
  const isDeleted = watch("isDeleted");

  return (
    <PageContainer>
      <PageHeader title="Add Category" description="Create a category matching categories table schema." />
      <form
        onSubmit={handleSubmit((d) => {
          addCategory(d);
          toast.success("Category created successfully");
          navigate({ to: "/business/categories" });
        })}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="card-surface space-y-4 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="accountId">Account ID</Label>
              <Input id="accountId" {...register("accountId")} placeholder="ACC-8832" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input id="categoryName" placeholder="Apparel" {...register("categoryName")} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" placeholder="1" {...register("displayOrder")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="Describe this category..." {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">Is Active</Label>
                <p className="text-xs text-muted-foreground">Visible in storefront (isActive)</p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(v) => setValue("isActive", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isDeleted" className="text-sm font-medium">Is Deleted</Label>
                <p className="text-xs text-muted-foreground">Soft deleted flag (isDeleted)</p>
              </div>
              <Switch
                id="isDeleted"
                checked={isDeleted}
                onCheckedChange={(v) => setValue("isDeleted", v)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="createdBy">Created By</Label>
              <Input id="createdBy" {...register("createdBy")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="updatedBy">Updated By</Label>
              <Input id="updatedBy" {...register("updatedBy")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/business/categories" })}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              Create category
            </Button>
          </div>
        </div>

        <div className="card-surface space-y-4 p-6">
          <p className="text-sm font-semibold">Image Preview</p>
          <div className="relative h-44 w-full overflow-hidden rounded-lg bg-muted border border-border">
            {watch("imageUrl") ? (
              <img src={watch("imageUrl")} alt="Category Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Enter an Image URL to preview
              </div>
            )}
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
