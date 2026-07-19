import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/common/ImageUpload";

export const Route = createFileRoute("/admin/clients/new")({
  component: NewClientPage,
});

interface ClientForm {
  name: string;
  email: string;
  plan: string;
  contact: string;
  notes?: string;
}

function NewClientPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientForm>();

  const onSubmit = (data: ClientForm) => {
    console.log("client:", data);
    toast.success("Client created");
    navigate({ to: "/admin/clients" });
  };

  return (
    <PageContainer>
      <PageHeader title="Add Client" description="Create a new business account." />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface space-y-4 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Business name</Label>
              <Input id="name" placeholder="Aurora Studio" {...register("name", { required: "Required" })} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Admin email</Label>
              <Input id="email" type="email" placeholder="hello@aurora.studio" {...register("email", { required: "Required" })} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan">Plan</Label>
              <Select onValueChange={(v) => setValue("plan", v)}>
                <SelectTrigger id="plan"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact">Contact person</Label>
              <Input id="contact" placeholder="Jane Doe" {...register("contact")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Anything worth remembering…" {...register("notes")} rows={4} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/clients" })}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              Create client
            </Button>
          </div>
        </div>

        <div className="card-surface space-y-4 p-6">
          <div>
            <p className="text-sm font-semibold">Brand logo</p>
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>
          <ImageUpload label="Upload logo" />
        </div>
      </form>
    </PageContainer>
  );
}
