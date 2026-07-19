import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

interface LoginForm {
  username: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    // UI-only — no auth logic. Route to super admin by default.
    toast.success(`Welcome back, ${data.username}`);
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Branding */}
      <div className="relative hidden overflow-hidden bg-primary p-12 lg:block">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="relative flex h-full flex-col justify-between text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground text-primary">
              <span className="font-display font-bold">C</span>
            </div>
            <span className="font-display text-lg font-semibold">Catalogo</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3 w-3 text-gold" />
              Digital Catalog Platform
            </div>
            <h1 className="mt-6 font-display text-4xl leading-tight font-bold">
              Beautifully organized catalogs, effortlessly shared.
            </h1>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Manage products, categories and enquiries in one place — designed
              for modern brands and their customers.
            </p>
          </motion.div>

          <p className="text-xs text-primary-foreground/50">
            © 2025 Catalogo. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="alex.kim"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary-dark"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Continue as a{" "}
            <Link to="/" className="font-medium text-primary hover:underline">
              customer
            </Link>{" "}
            or{" "}
            <Link to="/business/dashboard" className="font-medium text-primary hover:underline">
              business admin
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
