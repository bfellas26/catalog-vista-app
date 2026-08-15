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

  // File path audit tracking
  const [logoPathInfo, setLogoPathInfo] = useState<string>("");
  const [bannerPathInfo, setBannerPathInfo] = useState<string>("");

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
      setLogoPathInfo(uploadRes.filePath);
      toast.success(`Logo uploaded to Firebase Storage: ${uploadRes.filePath}`);
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
      setBannerPathInfo(uploadRes.filePath);
      toast.success(`Banner uploaded to Firebase Storage: ${uploadRes.filePath}`);
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
        description="Manage your store profile, upload branding images to Firebase Storage, and connect social links."
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

      {/* Backend & Firebase Storage Status Banner */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              isExisting
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isExisting ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {isExisting ? "Settings Connected to Backend" : "New Account Settings Mode"}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  isExisting
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                }`}
              >
                {isExisting ? "PUT /update" : "POST /create"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isExisting
                ? `Account settings loaded for '${activeAccountId}'. Image uploads go directly to Firebase Storage.`
                : `No existing record found for account '${activeAccountId}'. Image uploads will structure under /${activeAccountId}/accountsettings/.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
          <HardDrive className="h-3.5 w-3.5 text-primary" />
          <span>Storage Bucket: </span>
          <a
            href="http://127.0.0.1:4000/storage/digital-catalog-saas.firebasestorage.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            digital-catalog-saas.firebasestorage.app
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Business Identity */}
          <div className="card-surface p-6">
            <SectionHeader
              title="Business Identity"
              description="Configure account details, brand name, and taglines."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="accountId">Account ID</Label>
                <Input
                  id="accountId"
                  {...register("accountId")}
                  value={activeAccountId}
                  onChange={(e) => {
                    setActiveAccountId(e.target.value);
                    setValue("accountId", e.target.value);
                  }}
                  placeholder="ACC-8832"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  {...register("brandName", { required: true })}
                  placeholder="Aurora Studio"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="businessPunchline">Business Punchline / Tagline</Label>
                <Input
                  id="businessPunchline"
                  {...register("businessPunchline")}
                  placeholder="Elevating daily living with handcrafted minimalism."
                />
              </div>
            </div>
          </div>

          {/* Firebase Storage Image Upload Section */}
          <div className="card-surface p-6 space-y-6">
            <SectionHeader
              title="Branding & Media Upload"
              description="Upload system image files from your computer or mobile device directly to Firebase Storage."
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

            {/* Business Logo Upload Card */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-sm font-medium">
                <span>Business Logo Image</span>
                {logoPathInfo && (
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    Uploaded: {logoPathInfo}
                  </span>
                )}
              </Label>

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
                    <p className="text-[11px] font-mono text-muted-foreground truncate">
                      {formValues.businessLogo.slice(0, 45)}...
                    </p>
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
                      onClick={() => {
                        setValue("businessLogo", "");
                        setLogoPathInfo("");
                      }}
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
                      <p className="text-xs text-muted-foreground">Uploading Logo to Firebase Storage...</p>
                      <p className="text-[11px] font-mono text-primary">
                        /{activeAccountId}/accountsettings/logo.&lt;ext&gt;
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Click or tap to upload Logo</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Select image from laptop or mobile (PNG, JPG, SVG up to 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Banner Image Upload Card */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-sm font-medium">
                <span>Banner Showcase Image</span>
                {bannerPathInfo && (
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    Uploaded: {bannerPathInfo}
                  </span>
                )}
              </Label>

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
                      Banner Image Active
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
                        onClick={() => {
                          setValue("bannerImage", "");
                          setBannerPathInfo("");
                        }}
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
                      <p className="text-xs text-muted-foreground">Uploading Banner to Firebase Storage...</p>
                      <p className="text-[11px] font-mono text-primary">
                        /{activeAccountId}/accountsettings/banner.&lt;ext&gt;
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FileImage className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Click or tap to upload Banner Image</p>
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
              description="Official email and WhatsApp contact line."
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
              description="Physical address and location details."
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
              description="Connect official social channel links for your catalog headers."
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
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeader title="Live Catalog Header Preview" />
              <Sparkles className="h-4 w-4 text-primary" />
            </div>

            {/* Simulated Header Card */}
            <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              {/* Banner Image */}
              <div className="relative h-32 w-full bg-muted">
                {formValues.bannerImage ? (
                  <img
                    src={formValues.bannerImage}
                    alt="Banner Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground gap-1.5">
                    <ImageIcon className="h-4 w-4" /> No Banner Set
                  </div>
                )}

                {/* Logo Overlay */}
                <div className="absolute -bottom-5 left-4 h-14 w-14 overflow-hidden rounded-xl border-2 border-background bg-card shadow-md">
                  {formValues.businessLogo ? (
                    <img
                      src={formValues.businessLogo}
                      alt="Logo Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                      {formValues.brandName ? formValues.brandName.slice(0, 2).toUpperCase() : "BS"}
                    </div>
                  )}
                </div>
              </div>

              {/* Business Info Section */}
              <div className="p-4 pt-7 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-tight">
                    {formValues.brandName || "Your Brand Name"}
                  </h3>
                  <p className="text-xs text-muted-foreground italic mt-0.5">
                    {formValues.businessPunchline || "Your business tagline or punchline goes here"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                  {formValues.city && (
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {formValues.city}
                      {formValues.state ? `, ${formValues.state}` : ""}
                    </span>
                  )}
                  {formValues.emailAddress && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {formValues.emailAddress}
                    </span>
                  )}
                  {formValues.whatsAppNumber && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Phone className="h-3 w-3" />
                      WhatsApp: {formValues.whatsAppNumber}
                    </span>
                  )}
                </div>

                {/* Social Badges */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  {formValues.instagramLink && (
                    <a
                      href={formValues.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 px-2 py-1 text-[11px] font-medium"
                    >
                      <Instagram className="h-3 w-3" /> Instagram
                    </a>
                  )}
                  {formValues.facebookLink && (
                    <a
                      href={formValues.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-1 text-[11px] font-medium"
                    >
                      <Facebook className="h-3 w-3" /> Facebook
                    </a>
                  )}
                  {!formValues.instagramLink && !formValues.facebookLink && (
                    <span className="text-[11px] text-muted-foreground">No social links configured</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Backend Contract & Firebase Storage Audit Panel */}
          <div className="card-surface p-6 space-y-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm flex items-center justify-between">
              <span>Backend Contract & Storage Audit</span>
              <span className="font-mono text-[11px] font-normal text-muted-foreground">
                {auditInfo.documentId ? `Doc: ${auditInfo.documentId.slice(0, 10)}...` : "New Doc"}
              </span>
            </p>
            <div className="rounded-lg bg-muted/60 p-3 font-mono text-[11px] space-y-1.5 border border-border/60 overflow-x-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">accountId:</span>
                <span className="font-semibold text-foreground">{formValues.accountId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">brandName:</span>
                <span className="font-semibold text-foreground">{formValues.brandName || "N/A"}</span>
              </div>

              {/* Firebase Storage Folders Audit */}
              <div className="pt-1 pb-1 border-t border-border/40 space-y-1">
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Firebase Storage Folder:</span>
                  <span>/{formValues.accountId || "ACC-8832"}/accountsettings/</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">logo file:</span>
                  <span className="font-semibold text-foreground">
                    {logoPathInfo || (formValues.businessLogo ? "Uploaded" : "None")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">banner file:</span>
                  <span className="font-semibold text-foreground">
                    {bannerPathInfo || (formValues.bannerImage ? "Uploaded" : "None")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between border-t border-border/40 pt-1">
                <span className="text-muted-foreground">whatsAppNumber:</span>
                <span className="font-semibold text-foreground">
                  {formValues.whatsAppNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">emailAddress:</span>
                <span className="font-semibold text-foreground">
                  {formValues.emailAddress || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">state:</span>
                <span className="font-semibold text-foreground">{formValues.state || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">city:</span>
                <span className="font-semibold text-foreground">{formValues.city || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">country:</span>
                <span className="font-semibold text-foreground">{formValues.country || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
