import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
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
import { locationData, currencies } from "@/lib/locationData";
import { accountsApi, CreateAccountPayload } from "@/services/accountsApi";
import { Lock, UserCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/clients/new")({
  component: NewClientPage,
});

interface ClientForm extends CreateAccountPayload {}

function NewClientPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ClientForm>({
    defaultValues: {
      accountId: "",
      businessName: "",
      ownerName: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      businessType: "",
      address: "",
      country: "",
      state: "",
      city: "",
      currency: "USD",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const countries = Object.keys(locationData);
  const states = selectedCountry ? Object.keys(locationData[selectedCountry] || {}) : [];
  const cities =
    selectedCountry && selectedState
      ? locationData[selectedCountry]?.[selectedState] || []
      : [];

  useEffect(() => {
    if (selectedCountry) {
      setValue("state", "");
      setValue("city", "");
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedState) {
      setValue("city", "");
    }
  }, [selectedState, setValue]);

  const onSubmit = async (data: ClientForm) => {
    setSubmitting(true);
    try {
      const res = await accountsApi.createAccount(data);
      if (res.success) {
        toast.success(res.message || "Account Created Successfully");
        navigate({ to: "/admin/clients" });
      } else {
        toast.error(res.message || "Failed to create account");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating account";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create New Account"
        description="Register a new business account and create login credentials via the Accounts API."
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
                <Label htmlFor="accountId">Account ID *</Label>
                <Input
                  id="accountId"
                  placeholder="e.g. ACC123 or aurora-textiles"
                  {...register("accountId", { required: "Account ID is required" })}
                />
                {errors.accountId && (
                  <p className="text-xs text-destructive">{errors.accountId.message}</p>
                )}
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
                  placeholder="e.g. Retail, Apparel, Food & Beverage"
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

          {/* Login Credentials Section */}
          <div className="card-surface p-6 space-y-4 border-l-4 border-l-primary">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Login Credentials
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              These credentials will be created in the backend system to grant access to the account portal.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="e.g. aurora_admin"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
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
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  {...register("phone", { required: "Phone number is required" })}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
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
                        <SelectValue placeholder={selectedCountry ? "Select state" : "Choose country first"} />
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
                {errors.state && (
                  <p className="text-xs text-destructive">{errors.state.message}</p>
                )}
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
                        <SelectValue placeholder={selectedState ? "Select city" : "Choose state first"} />
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
                {errors.city && (
                  <p className="text-xs text-destructive">{errors.city.message}</p>
                )}
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

        {/* Sidebar Actions Column */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contract Integration
            </h3>
            <div className="rounded-lg bg-accent/30 p-3 text-xs space-y-2 text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <UserCheck className="h-4 w-4 text-emerald-500" /> API Target
              </div>
              <p className="font-mono text-[11px]">POST /accounts/create</p>
              <p>Will transmit JSON body containing business info and login credentials to backend API.</p>
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary-dark">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  "Create Account"
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
