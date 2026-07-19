import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/business/products/edit/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "Linen Everyday Shirt",
      price: 49,
      category: "Apparel",
      description: "",
    },
  });

  return (
    <PageContainer>
      <PageHeader title="Edit Product" description={`ID: ${id}`} />
      <form
        onSubmit={handleSubmit(() => {
          toast.success("Product updated");
          navigate({ to: "/business/products" });
        })}
        className="card-surface space-y-4 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Name</Label><Input {...register("name")} /></div>
          <div className="space-y-1.5"><Label>Price</Label><Input type="number" {...register("price")} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Category</Label><Input {...register("category")} /></div>
        </div>
        <div className="space-y-1.5"><Label>Description</Label><Textarea rows={5} {...register("description")} /></div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/business/products" })}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary-dark">Save</Button>
        </div>
      </form>
    </PageContainer>
  );
}
