import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Instagram, Facebook, Mail, Building, Globe } from "lucide-react";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { placeholderBusinessSettings } from "@/lib/placeholders";

export const Route = createFileRoute("/business/settings")({
  component: BusinessSettingsPage,
});

function BusinessSettingsPage() {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: placeholderBusinessSettings,
  });

  const isEmailEnabled = watch("isEmailEnabled");

  return (
    <PageContainer>
      <PageHeader
        title="Business Settings"
        description="Configure your business profile settings matching your businessSettings schema."
      />

      <form
        onSubmit={handleSubmit(() => toast.success("Business settings saved successfully"))}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          {/* General & Account Settings */}
          <div className="card-surface p-6">
            <SectionHeader title="Business Identity" description="Core account and brand configuration." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="accountId">Account ID</Label>
                <Input id="accountId" {...register("accountId")} placeholder="ACC-8832" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" {...register("brandName")} placeholder="Aurora Studio" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input id="emailAddress" type="email" {...register("emailAddress")} placeholder="contact@aurorastudio.com" />
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="card-surface p-6">
            <SectionHeader title="Location & Address" description="Physical business address details." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} placeholder="123 Design Quarter, Ave 4" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} placeholder="San Francisco" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} placeholder="USA" />
              </div>
            </div>
          </div>

          {/* Social Links & Banner */}
          <div className="card-surface p-6">
            <SectionHeader title="Media & Social Links" description="Banner and official social profile links." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bannerUrl">Banner URL</Label>
                <Input id="bannerUrl" {...register("bannerUrl")} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebookLink" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" /> Facebook Link
                </Label>
                <Input id="facebookLink" {...register("facebookLink")} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagramLink" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600" /> Instagram Link
                </Label>
                <Input id="instagramLink" {...register("instagramLink")} placeholder="https://instagram.com/..." />
              </div>
            </div>
          </div>

          {/* Notification & Audit */}
          <div className="card-surface p-6">
            <SectionHeader title="Email Preferences & Audit" description="Email toggles and creation audit trail." />
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isEmailEnabled" className="text-base font-medium">Enable Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive system and enquiry notification emails (isEmailEnabled)</p>
                </div>
                <Switch
                  id="isEmailEnabled"
                  checked={isEmailEnabled}
                  onCheckedChange={(val) => setValue("isEmailEnabled", val)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="createdBy">Created By</Label>
                  <Input id="createdBy" {...register("createdBy")} placeholder="admin@aurora.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="createdAt">Created At</Label>
                  <Input id="createdAt" {...register("createdAt")} readOnly className="bg-muted text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary-dark">Save changes</Button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-4">
            <SectionHeader title="Banner Preview" />
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted border border-border">
              {watch("bannerUrl") ? (
                <img src={watch("bannerUrl")} alt="Banner Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Banner URL</div>
              )}
            </div>
          </div>

          <div className="card-surface p-6 space-y-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm">Schema Field Audit</p>
            <ul className="space-y-1 list-disc pl-4 font-mono">
              <li>accountId: {watch("accountId") || "N/A"}</li>
              <li>brandName: {watch("brandName") || "N/A"}</li>
              <li>emailAddress: {watch("emailAddress") || "N/A"}</li>
              <li>address: {watch("address") || "N/A"}</li>
              <li>city: {watch("city") || "N/A"}</li>
              <li>country: {watch("country") || "N/A"}</li>
              <li>bannerUrl: {watch("bannerUrl") ? "Set" : "Empty"}</li>
              <li>facebookLink: {watch("facebookLink") ? "Set" : "Empty"}</li>
              <li>instagramLink: {watch("instagramLink") ? "Set" : "Empty"}</li>
              <li>isEmailEnabled: {isEmailEnabled ? "true" : "false"}</li>
              <li>createdBy: {watch("createdBy") || "N/A"}</li>
              <li>createdAt: {watch("createdAt") || "N/A"}</li>
            </ul>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
