import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "@/components/common/LoginView";

export const Route = createFileRoute("/login/admin")({
  head: () => ({
    meta: [{ title: "Super Admin Login — Catalogo" }],
  }),
  component: SuperAdminLogin,
});

function SuperAdminLogin() {
  return (
    <LoginView
      role="Super Admin"
      tagline="Oversee every brand on the platform, from one calm dashboard."
      redirectTo="/admin/clients"
      altLabel="Business Admin login"
      altHref="/login/business"
    />
  );
}
