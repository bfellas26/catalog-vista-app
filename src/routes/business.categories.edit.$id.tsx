import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/business/categories/edit/$id")({
  component: EditCategoryPage,
});

function EditCategoryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: "Apparel", slug: "apparel", description: "" },
  });

  return (
    <PageContainer>
      <PageHeader title="Edit Category" description={`ID: ${id}`} />
      <form
        onSubmit={handleSubmit(() => {
          toast.success("Saved");
          navigate({ to: "/business/categories" });
        })}
        className="card-surface space-y-4 p-6"
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input {...register("name")} />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea rows={4} {...register("description")} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/business/categories" })}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-dark">Save</Button>
        </div>
      </form>
    </PageContainer>
  );
}
