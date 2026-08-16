import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  Building,
  Globe,
  Loader2,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Trash2,
  FileImage,
  HardDrive,
} from "lucide-react";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  businessSettingsApi,
  BusinessSettings,
  CreateBusinessSettingsPayload,
  UpdateBusinessSettingsPayload,
} from "@/services/businessSettingsApi";
import { storageService } from "@/services/storageService";
import { placeholderBusinessSettings } from "@/lib/placeholders";

export const Route = createFileRoute("/business/settings")({
  component: BusinessSettingsPage,
});

function BusinessSettingsPage() {
  const [activeAccountId, setActiveAccountId] = useState<string>("ACC-8832");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExisting, setIsExisting] = useState<boolean>(false);
  
  // Storage upload loading states
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState<boolean>(false);

  const [auditInfo, setAuditInfo] = useState<{
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    documentId?: string;
  }>({});

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, watch, reset, setValue } = useForm<BusinessSettings>({
    defaultValues: placeholderBusinessSettings,
  });

  const loadBusinessSettings = useCallback(async (accId: string) => {
    setIsLoading(true);
    try {
      const res = await businessSettingsApi.getBusinessSettingsByAccount(accId);
      if (res.success && res.data) {
        setIsExisting(true);
        reset({
          accountId: res.data.accountId || accId,
          brandName: res.data.brandName || "",
          businessLogo: res.data.businessLogo || "",
          bannerImage: res.data.bannerImage || "",
          businessPunchline: res.data.businessPunchline || "",
          whatsAppNumber: res.data.whatsAppNumber || "",
          emailAddress: res.data.emailAddress || "",
          country: res.data.country || "",
          state: res.data.state || "",
          city: res.data.city || "",
          address: res.data.address || "",
          instagramLink: res.data.instagramLink || "",
          facebookLink: res.data.facebookLink || "",
        });
        setAuditInfo({
          documentId: res.data.documentId,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          createdBy: res.data.createdBy,
          updatedBy: res.data.updatedBy,
        });
        toast.success(`Loaded settings for ${res.data.brandName || accId}`);
      } else {
        setIsExisting(false);
        setAuditInfo({});
      }
    } catch (err: unknown) {
      setIsExisting(false);
      setAuditInfo({});
      const message = err instanceof Error ? err.message : "Failed to load settings";
      if (message.includes("404") || message.toLowerCase().includes("not found")) {
        toast.info(`No existing settings found for account ${accId}. You can create them now.`);
        reset({
          ...placeholderBusinessSettings,
          accountId: accId,
        });
      } else {
        toast.error(`Backend notice: ${message}. Operating in offline edit mode.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    loadBusinessSettings(activeAccountId);
  }, [activeAccountId, loadBusinessSettings]);

  // Handle Logo Upload to Firebase Storage
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const uploadRes = await storageService.uploadFile({
        file,
        accountId: activeAccountId,
        subfolder: "accountsettings",
        prefix: "logo",
      });

      setValue("businessLogo", uploadRes.downloadUrl);
      toast.success("Logo uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload logo";
      toast.error(`Logo upload error: ${msg}`);
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = "";
    }
  };

  // Handle Banner Upload to Firebase Storage
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    setIsUploadingBanner(true);
    try {
      const uploadRes = await storageService.uploadFile({
        file,
        accountId: activeAccountId,
        subfolder: "accountsettings",
        prefix: "banner",
      });

      setValue("bannerImage", uploadRes.downloadUrl);
      toast.success("Banner uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload banner";
      toast.error(`Banner upload error: ${msg}`);
    } finally {
      setIsUploadingBanner(false);
      if (e.target) e.target.value = "";
    }
  };

  const onSubmit = async (data: BusinessSettings) => {
    setIsSaving(true);
    try {
      if (isExisting) {
        const payload: UpdateBusinessSettingsPayload = {
          brandName: data.brandName,
          businessLogo: data.businessLogo,
          bannerImage: data.bannerImage,
          businessPunchline: data.businessPunchline,
          whatsAppNumber: data.whatsAppNumber,
          emailAddress: data.emailAddress,
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
          instagramLink: data.instagramLink,
          facebookLink: data.facebookLink,
        };
        await businessSettingsApi.updateBusinessSettings(activeAccountId, payload);
        toast.success("Business settings updated successfully");
        setIsExisting(true);
      } else {
        const payload: CreateBusinessSettingsPayload = {
          accountId: activeAccountId,
          brandName: data.brandName,
          businessLogo: data.businessLogo,
          bannerImage: data.bannerImage,
          businessPunchline: data.businessPunchline,
          whatsAppNumber: data.whatsAppNumber,
          emailAddress: data.emailAddress,
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
          instagramLink: data.instagramLink,
          facebookLink: data.facebookLink,
        };
        const res = await businessSettingsApi.createBusinessSettings(payload);
        toast.success("Business settings created successfully");
        setIsExisting(true);
        if (res.data?.documentId) {
          setAuditInfo((prev) => ({ ...prev, documentId: res.data.documentId }));
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save settings";
      toast.error(`Error saving settings: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formValues = watch();

  return (
    <PageContainer>
      <PageHeader
        title="Business Settings"
        description="Manage your store profile, brand styling, and contact details."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 shadow-sm text-sm">
              <span className="text-muted-foreground text-xs font-medium">Account ID:</span>
              <input
                type="text"
                value={activeAccountId}
                onChange={(e) => setActiveAccountId(e.target.value)}
                className="bg-transparent font-mono font-semibold focus:outline-none w-24"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadBusinessSettings(activeAccountId)}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Sync
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
        {/* Business Identity */}
        <div className="card-surface p-6">
          <SectionHeader
            title="Business Identity"
            description="Configure your catalog brand name and tagline."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                {...register("brandName", { required: true })}
                placeholder="Aurora Studio"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessPunchline">Business Punchline / Tagline</Label>
              <Input
                id="businessPunchline"
                {...register("businessPunchline")}
                placeholder="Elevating daily living with handcrafted minimalism."
              />
            </div>
          </div>
        </div>

        {/* Branding & Media Upload */}
        <div className="card-surface p-6 space-y-6">
          <SectionHeader
            title="Branding & Media"
            description="Upload logo and banner images for your online catalog."
          />

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={logoInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleLogoFileChange}
          />
          <input
            type="file"
            ref={bannerInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleBannerFileChange}
          />

          {/* Business Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Business Logo</Label>

            {formValues.businessLogo ? (
              <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3">
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted shrink-0">
                  <img
                    src={formValues.businessLogo}
                    alt="Business Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">Logo Active</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    ) : (
                      <UploadCloud className="h-3.5 w-3.5 mr-1" />
                    )}
                    Replace Logo
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValue("businessLogo", "")}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 p-6 text-center transition-colors hover:border-primary hover:bg-muted/60 cursor-pointer"
              >
                {isUploadingLogo ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Uploading Logo...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Click to upload Logo</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Select image (PNG, JPG, SVG up to 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Banner Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Banner Image</Label>

            {formValues.bannerImage ? (
              <div className="relative overflow-hidden rounded-xl border border-border bg-background">
                <div className="h-28 w-full bg-muted">
                  <img
                    src={formValues.bannerImage}
                    alt="Banner Image"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-card border-t border-border">
                  <span className="text-xs font-semibold text-foreground">
                    Banner Active
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => bannerInputRef.current?.click()}
                      disabled={isUploadingBanner}
                    >
                      {isUploadingBanner ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <UploadCloud className="h-3.5 w-3.5 mr-1" />
                      )}
                      Replace Banner
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue("bannerImage", "")}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 p-6 text-center transition-colors hover:border-primary hover:bg-muted/60 cursor-pointer"
              >
                {isUploadingBanner ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Uploading Banner...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileImage className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Click to upload Banner</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Wide catalog banner image recommended (1200x400)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="card-surface p-6">
          <SectionHeader
            title="Contact Information"
            description="Official email and WhatsApp contact details."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="emailAddress" className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email Address *
              </Label>
              <Input
                id="emailAddress"
                type="email"
                {...register("emailAddress", { required: true })}
                placeholder="contact@aurorastudio.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsAppNumber" className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-emerald-600" /> WhatsApp Number
              </Label>
              <Input
                id="whatsAppNumber"
                {...register("whatsAppNumber")}
                placeholder="+1 (555) 234-5678"
              />
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="card-surface p-6">
          <SectionHeader
            title="Location & Address"
            description="Physical business address."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address Line</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="123 Design Quarter, Ave 4"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} placeholder="San Francisco" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" {...register("state")} placeholder="California" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} placeholder="United States" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card-surface p-6">
          <SectionHeader
            title="Social Profiles"
            description="Connect official social channels to display in headers."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="instagramLink" className="flex items-center gap-1.5">
                <Instagram className="h-4 w-4 text-pink-600" /> Instagram Profile URL
              </Label>
              <Input
                id="instagramLink"
                {...register("instagramLink")}
                placeholder="https://instagram.com/aurorastudio"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facebookLink" className="flex items-center gap-1.5">
                <Facebook className="h-4 w-4 text-blue-600" /> Facebook Page URL
              </Label>
              <Input
                id="facebookLink"
                {...register("facebookLink")}
                placeholder="https://facebook.com/aurorastudio"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {auditInfo.updatedAt && (
              <span>Last saved: {new Date(auditInfo.updatedAt).toLocaleString()}</span>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSaving || isLoading || isUploadingLogo || isUploadingBanner}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-sm"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isExisting ? "Update Settings" : "Create Settings"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
