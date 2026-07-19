import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/ImageUpload";

export const Route = createFileRoute("/business/categories/new")({
  component: NewCategoryPage,
});

function NewCategoryPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  return (
    <PageContainer>
      <PageHeader title="Add Category" description="Create a new product category." />
      <form
        onSubmit={handleSubmit((d) => {
          console.log(d);
          toast.success("Category created");
          navigate({ to: "/business/categories" });
        })}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="card-surface space-y-4 p-6 lg:col-span-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Category name</Label>
            <Input id="name" placeholder="Apparel" {...register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" placeholder="apparel" {...register("slug")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register("description")} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/business/categories" })}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              Create category
            </Button>
          </div>
        </div>

        <div className="card-surface space-y-3 p-6">
          <p className="text-sm font-semibold">Category image</p>
          <ImageUpload />
        </div>
      </form>
    </PageContainer>
  );
}
