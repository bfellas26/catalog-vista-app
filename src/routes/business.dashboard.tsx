import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, FolderTree, Users, MessageSquare } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { StatCard } from "@/components/common/StatCard";
import { TagBadge, StatusBadge } from "@/components/common/Badges";
import {
  placeholderBusinessStats,
  placeholderProducts,
  placeholderSubscribers,
  placeholderEnquiries,
  chartData,
} from "@/lib/placeholders";

export const Route = createFileRoute("/business/dashboard")({
  component: BusinessDashboard,
});

const icons = [Package, FolderTree, Users, MessageSquare];

function BusinessDashboard() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Your catalog at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderBusinessStats.map((s, i) => {
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
          <SectionHeader title="Product views" description="Views per month" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface p-5"
        >
          <SectionHeader title="Recent enquiries" />
          <ul className="space-y-3">
            {placeholderEnquiries.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.items} items</p>
                </div>
                <StatusBadge status={e.status} />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <SectionHeader title="Recent products" />
          <ul className="divide-y divide-border">
            {placeholderProducts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${p.price}</p>
                  <div className="mt-1 flex gap-1">
                    {p.tags.map((t) => <TagBadge key={t} name={t} variant="primary" />)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-5">
          <SectionHeader title="Recent subscribers" />
          <ul className="divide-y divide-border">
            {placeholderSubscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{s.email}</p>
                  <p className="text-xs text-muted-foreground">Joined {s.joined}</p>
                </div>
                <TagBadge name={s.source} variant="gold" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
