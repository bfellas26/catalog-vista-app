import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
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
import { placeholderClients } from "@/lib/placeholders";
import { locationData, currencies } from "@/lib/locationData";

export const Route = createFileRoute("/admin/clients/edit/$id")({
  component: EditClientPage,
});

interface ClientForm {
  accountId: string;
  accountStatus: string;
  businessName: string;
  businessType: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  currency: string;
  status: boolean;
}

function EditClientPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  // Find existing client from mockup collection
  const existingClient = placeholderClients.find((c) => c.id === id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ClientForm>({
    defaultValues: {
      accountId: id || "",
      accountStatus: existingClient?.status || "Active",
      businessName: existingClient?.name || "Aurora Studio",
      businessType: "Consumer Goods",
      ownerName: "Sarah Connor",
      email: existingClient?.email || "hello@company.com",
      phone: "+1 (555) 304-4903",
      address: "88 Skyline Boulevard, Building B",
      country: "United States",
      state: "California",
      city: "Los Angeles",
      currency: "USD",
      status: existingClient ? existingClient.status !== "Suspended" : true,
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

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Safely handle dropdown hierarchy resets without stepping over mount values
  useEffect(() => {
    if (isInitialLoad) {
      return;
    }
    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    setValue("city", "");
  }, [selectedState, setValue]);

  const onSubmit = (data: ClientForm) => {
    console.log("Saved Client Form Values:", data);
    toast.success("Client account settings saved successfully!");
    navigate({ to: "/admin/clients" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Edit Client"
        description={`Update client configuration and settings for: ${existingClient?.name || id}`}
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
                  placeholder="e.g. aurora-textiles"
                  {...register("accountId", { required: "Account ID is required" })}
                  className="bg-accent/40 cursor-not-allowed opacity-80"
                />
                {errors.accountId && (
                  <p className="text-xs text-destructive">{errors.accountId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessName">Business Name</Label>
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
                <Label htmlFor="businessType">Business Type</Label>
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
                <Label htmlFor="ownerName">Owner Name</Label>
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
                <Label htmlFor="email">Email Address</Label>
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
                <Label htmlFor="phone">Phone Number</Label>
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
                <Label htmlFor="address">Address</Label>
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
                <Label htmlFor="country">Country</Label>
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
                <Label htmlFor="state">State / Province</Label>
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
                <Label htmlFor="city">City</Label>
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
                <Label htmlFor="currency">Default Currency</Label>
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

        {/* Status Actions Sidebar Column */}
        <div className="space-y-6">
          <div className="card-surface p-6 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Account Control
            </h3>

            {/* Account Status Select */}
            <div className="space-y-1.5">
              <Label htmlFor="accountStatus">System Status</Label>
              <Controller
                control={control}
                name="accountStatus"
                rules={{ required: "Account status is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="accountStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Trial">Trial</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Boolean Status Switch */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-accent/20">
              <div className="space-y-0.5">
                <Label htmlFor="status" className="font-semibold text-sm">
                  Active Member
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow client accessing portals & services.
                </p>
              </div>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Switch
                    id="status"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                Save Client Settings
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
