import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/clients/edit/$id")({
  component: EditClientPage,
});

function EditClientPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: "Aurora Studio", email: "hello@aurora.studio", plan: "Pro" },
  });

  return (
    <PageContainer>
      <PageHeader title="Edit Client" description={`Client ID: ${id}`} />
      <form
        onSubmit={handleSubmit((d) => {
          console.log(d);
          toast.success("Changes saved");
          navigate({ to: "/admin/clients" });
        })}
        className="card-surface space-y-4 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Business name</Label>
            <Input {...register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label>Admin email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label>Plan</Label>
            <Input {...register("plan")} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/clients" })}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-dark">Save changes</Button>
        </div>
      </form>
    </PageContainer>
  );
}
