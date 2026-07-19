import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "@/components/common/LoginView";

export const Route = createFileRoute("/login/business")({
  head: () => ({
    meta: [{ title: "Business Admin Login — Catalogo" }],
  }),
  component: BusinessAdminLogin,
});

function BusinessAdminLogin() {
  return (
    <LoginView
      role="Business Admin"
      tagline="Run your catalog beautifully — products, tags, subscribers and enquiries."
      redirectTo="/business/dashboard"
      altLabel="Super Admin login"
      altHref="/login/admin"
    />
  );
}
