import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locationData, currencies } from "@/lib/locationData";
import { accountsApi, UpdateAccountPayload, Account } from "@/services/accountsApi";
import { Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/common/Badges";

export const Route = createFileRoute("/admin/clients/edit/$id")({
  component: EditClientPage,
});

interface ClientEditForm extends UpdateAccountPayload {}

function EditClientPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ClientEditForm>({
    defaultValues: {
      businessName: "",
      ownerName: "",
      businessType: "",
      phone: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: "",
      currency: "USD",
    },
  });

  const fetchAccount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getAccountById(id);
      if (res.success && res.data) {
        setAccount(res.data);
        reset({
          businessName: res.data.businessName || "",
          ownerName: res.data.ownerName || "",
          businessType: res.data.businessType || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          address: res.data.address || "",
          country: res.data.country || "",
          state: res.data.state || "",
          city: res.data.city || "",
          currency: res.data.currency || "USD",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load account details";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const countries = Object.keys(locationData);
  const states = selectedCountry ? Object.keys(locationData[selectedCountry] || {}) : [];
  const cities =
    selectedCountry && selectedState ? locationData[selectedCountry]?.[selectedState] || [] : [];

  const onSubmit = async (data: ClientEditForm) => {
    setSubmitting(true);
    try {
      const res = await accountsApi.updateAccount(id, data);
      if (res.success) {
        toast.success(res.message || "Account updated successfully");
        navigate({ to: "/admin/clients" });
      } else {
        toast.error(res.message || "Failed to update account");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating account";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!account) return;
    const isCurrentlyEnabled = account.status === "ENABLED" || account.status === "Active";
    const nextStatus = isCurrentlyEnabled ? "DISABLED" : "ENABLED";

    setUpdatingStatus(true);
    try {
      const res = await accountsApi.updateAccountStatus(id, nextStatus);
      if (res.success) {
        toast.success(res.message || `Account status updated to ${nextStatus}`);
        setAccount({ ...account, status: nextStatus });
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status";
      toast.error(msg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Edit Account" description={`Loading account ${id}...`} />
        <div className="card-surface p-12 text-center text-muted-foreground">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p>Fetching account details from backend API...</p>
        </div>
      </PageContainer>
    );
  }

  const isEnabled = account?.status === "ENABLED" || account?.status === "Active";

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Account: ${account?.businessName || id}`}
        description={`Update account details (PUT /accounts/update/${id})`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        {/* Main Fields Form Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Identity & Business Info */}
          <div className="card-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Business Profile
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="accountId">Account ID</Label>
                <Input
                  id="accountId"
                  disabled
                  value={id}
                  className="bg-accent/40 cursor-not-allowed opacity-80 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g. Aurora Textiles Co."
                  {...register("businessName", { required: "Business name is required" })}
                />
                {errors.businessName && (
                  <p className="text-xs text-destructive">{errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessType">Business Type *</Label>
                <Input
                  id="businessType"
                  placeholder="e.g. Fashion, Food & Beverage"
                  {...register("businessType", { required: "Business type is required" })}
                />
                {errors.businessType && (
                  <p className="text-xs text-destructive">{errors.businessType.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  id="ownerName"
                  placeholder="e.g. Johnathan Smith"
                  {...register("ownerName", { required: "Owner name is required" })}
                />
                {errors.ownerName && (
                  <p className="text-xs text-destructive">{errors.ownerName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="card-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. info@company.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  {...register("phone", { required: "Phone number is required" })}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Street name, suite no, zipcode"
                  {...register("address", { required: "Address is required" })}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-xs text-destructive">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location & Preferences */}
          <div className="card-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Regional Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Country Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="country">Country *</Label>
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-xs text-destructive">{errors.country.message}</p>
                )}
              </div>

              {/* State Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="state">State / Province *</Label>
                <Controller
                  control={control}
                  name="state"
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger id="state">
                        <SelectValue
                          placeholder={selectedCountry ? "Select state" : "Choose country first"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedState}
                    >
                      <SelectTrigger id="city">
                        <SelectValue
                          placeholder={selectedState ? "Select city" : "Choose state first"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>

              {/* Currency Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency *</Label>
                <Controller
                  control={control}
                  name="currency"
                  rules={{ required: "Currency is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && (
                  <p className="text-xs text-destructive">{errors.currency.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status Control */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Account Status
            </h3>

            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-accent/20">
              <div className="space-y-0.5">
                <Label className="font-semibold text-sm">
                  Status: {account?.status || "ENABLED"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Toggle active status for this account.
                </p>
              </div>
              <Switch
                checked={isEnabled}
                disabled={updatingStatus}
                onCheckedChange={handleToggleStatus}
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <StatusBadge status={account?.status || "ENABLED"} />
              {updatingStatus && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  "Update Account"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate({ to: "/admin/clients" })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
