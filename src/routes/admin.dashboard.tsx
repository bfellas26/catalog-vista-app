import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Building2, TrendingUp, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/Badges";
import { placeholderStats, placeholderClients, chartData } from "@/lib/placeholders";

export const Route = createFileRoute("/admin/dashboard")({
  component: SuperAdminDashboard,
});

const icons = [Users, Building2, TrendingUp, Activity];

function SuperAdminDashboard() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Overview of your platform activity." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderStats.map((s, i) => {
          const Icon = icons[i];
          return <StatCard key={s.label} {...s} index={i} icon={<Icon className="h-4 w-4" />} />;
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Charts temporarily disabled per request
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-surface p-5 lg:col-span-2"
        >
          <SectionHeader title="Platform growth" description="Revenue trend, last 7 months" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface p-5 lg:col-span-2"
        >
          <SectionHeader title="Platform growth" description="Charts coming soon" />
          <div className="grid h-72 place-items-center text-sm text-muted-foreground">
            Charts have been temporarily disabled.
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
            {["New client signed up", "Plan upgraded to Pro", "Support ticket opened", "Payment received"].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div className="min-w-0">
                  <p className="truncate text-foreground">{t}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Original recent activity block kept above; extra closing removed */}
      <div className="hidden">


      <div className="mt-8">
        <SectionHeader title="Recent clients" description="Latest brands to join the platform" />
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Client</th>
                  <th className="px-4 py-3 text-left font-medium">Plan</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {placeholderClients.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="px-4 py-3">{c.plan}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
