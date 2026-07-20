import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, Users, MessageSquare, Settings, ArrowRight, FolderTree } from "lucide-react";
import { PageContainer, PageHeader, SectionHeader } from "@/components/common/PageContainer";
import { StatCard } from "@/components/common/StatCard";
import { placeholderBusinessStats } from "@/lib/placeholders";

export const Route = createFileRoute("/business/dashboard")({
  component: BusinessDashboard,
});

const statIcons = [Package, FolderTree, Users, MessageSquare];

const quickAccessItems = [
  {
    title: "Product Management",
    description: "Manage categories, products, and product tags in your catalogue.",
    icon: Package,
    href: "/business/products",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    hoverColor: "hover:border-blue-500/40 hover:bg-blue-500/[0.02]",
  },
  {
    title: "Account Settings",
    description: "Update your business profile, metadata, and catalogue styling.",
    icon: Settings,
    href: "/business/settings",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    hoverColor: "hover:border-purple-500/40 hover:bg-purple-500/[0.02]",
  },
  {
    title: "Enquiries",
    description: "Review messages, orders, and inquiries sent by catalogue viewers.",
    icon: MessageSquare,
    href: "/business/enquiries",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    hoverColor: "hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]",
  },
  {
    title: "Subscribers",
    description: "Monitor and manage email addresses subscribed to updates.",
    icon: Users,
    href: "/business/subscribers",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    hoverColor: "hover:border-amber-500/40 hover:bg-amber-500/[0.02]",
  },
];

function BusinessDashboard() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Your catalog at a glance." />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderBusinessStats.map((s, i) => {
          const Icon = statIcons[i];
          return <StatCard key={s.label} {...s} index={i} icon={<Icon className="h-4 w-4" />} />;
        })}
      </div>

      {/* Quick Access Menu Section */}
      <div className="mt-10">
        <SectionHeader title="Quick Access" description="Manage different sections of your business portal." />
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className={`flex h-full flex-col justify-between rounded-2xl border border-border p-6 bg-card transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group ${item.hoverColor}`}
                >
                  <div>
                    <div className={`inline-flex items-center justify-center rounded-xl p-3 border ${item.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
