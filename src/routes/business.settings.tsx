import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Instagram, Twitter, Facebook, Globe } from "lucide-react";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/ImageUpload";

export const Route = createFileRoute("/business/settings")({
  component: BusinessSettingsPage,
});

function BusinessSettingsPage() {
  const { register, handleSubmit } = useForm();

  return (
    <PageContainer>
      <PageHeader title="Business Settings" description="Manage your brand, contact and social links." />

      <form
        onSubmit={handleSubmit(() => toast.success("Settings saved"))}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface p-6">
            <SectionHeader title="Brand" description="How your brand appears to customers." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Brand name</Label><Input placeholder="Aurora Studio" {...register("brand")} /></div>
              <div className="space-y-1.5"><Label>Punchline</Label><Input placeholder="Thoughtfully designed goods" {...register("punchline")} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>About</Label><Textarea rows={4} {...register("about")} /></div>
            </div>
          </div>

          <div className="card-surface p-6">
            <SectionHeader title="Contact information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" {...register("email")} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input {...register("phone")} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Input {...register("address")} /></div>
            </div>
          </div>

          <div className="card-surface p-6">
            <SectionHeader title="Social media" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Instagram, name: "instagram", label: "Instagram" },
                { icon: Twitter, name: "twitter", label: "Twitter" },
                { icon: Facebook, name: "facebook", label: "Facebook" },
                { icon: Globe, name: "website", label: "Website" },
              ].map((s) => (
                <div key={s.name} className="space-y-1.5">
                  <Label className="flex items-center gap-2"><s.icon className="h-4 w-4" />{s.label}</Label>
                  <Input placeholder={`https://${s.name}.com/…`} {...register(s.name)} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary-dark">Save changes</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <SectionHeader title="Logo" />
            <ImageUpload label="Upload logo" hint="Square, PNG preferred" />
          </div>
          <div className="card-surface p-6">
            <SectionHeader title="Banner" />
            <ImageUpload label="Upload banner" hint="1920×640 recommended" />
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
