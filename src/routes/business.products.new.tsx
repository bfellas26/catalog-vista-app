import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/ImageUpload";

export const Route = createFileRoute("/business/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  return (
    <PageContainer>
      <PageHeader title="Add Product" description="Create a new product listing." />
      <form
        onSubmit={handleSubmit((d) => {
          console.log(d);
          toast.success("Product created");
          navigate({ to: "/business/products" });
        })}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="card-surface space-y-4 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Linen Everyday Shirt" {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input type="number" placeholder="49" {...register("price")} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input placeholder="Apparel" {...register("category")} />
            </div>
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input placeholder="AUR-001" {...register("sku")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={5} {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label>Tags (comma separated)</Label>
            <Input placeholder="New, Bestseller" {...register("tags")} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/business/products" })}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">Create product</Button>
          </div>
        </div>

        <div className="card-surface space-y-3 p-6">
          <p className="text-sm font-semibold">Product images</p>
          <ImageUpload />
          <ImageUpload label="Add another image" />
        </div>
      </form>
    </PageContainer>
  );
}
