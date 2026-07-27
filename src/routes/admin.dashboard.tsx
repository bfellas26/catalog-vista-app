import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Building2, TrendingUp, Activity } from "lucide-react";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/Badges";
import { placeholderStats } from "@/lib/placeholders";
import { accountsApi, Account } from "@/services/accountsApi";

export const Route = createFileRoute("/admin/dashboard")({
  component: SuperAdminDashboard,
});

const icons = [Users, Building2, TrendingUp, Activity];

function SuperAdminDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountsApi
      .getAccountsList()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setAccounts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Accounts",
      value: accounts.length ? String(accounts.length) : placeholderStats[0].value,
      delta: "+12%",
      trend: "up" as const,
    },
    placeholderStats[1],
    placeholderStats[2],
    placeholderStats[3],
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your platform activity & connected accounts."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = icons[i];
          return <StatCard key={s.label} {...s} index={i} icon={<Icon className="h-4 w-4" />} />;
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-surface p-5 lg:col-span-2"
        >
          <SectionHeader title="Platform growth" description="Charts coming soon" />
          <div className="grid h-72 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            Chart placeholder — analytics coming soon.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface p-5"
        >
          <SectionHeader title="Recent activity" />
          <ul className="space-y-3">
            {[
              "New account created",
              "Account status updated",
              "Catalog published",
              "Payment received",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div className="min-w-0">
                  <p className="truncate text-foreground">{t}</p>
                  <p className="text-xs text-muted-foreground">Recent</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="mt-8">
        <SectionHeader
          title="Recent Accounts"
          description="Live business accounts fetched from backend Accounts API"
        />
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Business / Account ID</th>
                  <th className="px-4 py-3 text-left font-medium">Owner</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-xs text-muted-foreground">
                      Loading recent accounts...
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-xs text-muted-foreground">
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  accounts.slice(0, 5).map((c) => (
                    <tr
                      key={c.accountId || c.documentId}
                      className="border-b border-border last:border-0 hover:bg-accent/30"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {c.businessName || "Unnamed Business"}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">{c.accountId}</p>
                      </td>
                      <td className="px-4 py-3">{c.ownerName || c.email || "N/A"}</td>
                      <td className="px-4 py-3">{c.businessType || "N/A"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.status || "ENABLED"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
