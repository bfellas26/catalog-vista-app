import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Filter, Plus, MoreHorizontal, Pencil, RefreshCw, CheckCircle2, XCircle, Building2, User } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/common/PageContainer";
import { SearchBar } from "@/components/common/SearchBar";
import { StatusBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountsApi, Account } from "@/services/accountsApi";

export const Route = createFileRoute("/admin/clients/")({
  component: ClientsPage,
});

function ClientsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await accountsApi.getAccountsList();
      if (res.success && Array.isArray(res.data)) {
        setAccounts(res.data);
      } else {
        setAccounts([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load accounts from backend server";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleToggleStatus = async (accountId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "ENABLED" || currentStatus === "Active" ? "DISABLED" : "ENABLED";
    setUpdatingId(accountId);
    try {
      await accountsApi.updateAccountStatus(accountId, nextStatus);
      toast.success(`Account ${accountId} status set to ${nextStatus}`);
      setAccounts((prev) =>
        prev.map((acc) => (acc.accountId === accountId ? { ...acc, status: nextStatus } : acc))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = accounts.filter((c) => {
    const term = q.toLowerCase();
    return (
      c.businessName?.toLowerCase().includes(term) ||
      c.accountId?.toLowerCase().includes(term) ||
      c.ownerName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.businessType?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term)
    );
  });

  return (
    <PageContainer>
      <PageHeader
        title="Accounts & Clients"
        description="Manage all live business accounts integrated via the Accounts API."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAccounts} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button asChild className="bg-primary hover:bg-primary-dark">
              <Link to="/admin/clients/new">
                <Plus className="mr-1.5 h-4 w-4" /> Add Account
              </Link>
            </Button>
          </div>
        }
      />

      <div className="card-surface">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar placeholder="Search accounts by name, ID, owner, email..." value={q} onChange={setQ} />
          <Button variant="outline" size="sm">
            <Filter className="mr-1.5 h-4 w-4" /> Filters
          </Button>
        </div>

        {error && (
          <div className="m-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <div>
              <p className="font-semibold">Backend Connection Issue</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={loadAccounts}>
              Retry Connection
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Business / ID</th>
                <th className="px-4 py-3 text-left font-medium">Owner & Contact</th>
                <th className="px-4 py-3 text-left font-medium">Type & Location</th>
                <th className="px-4 py-3 text-left font-medium">Currency</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Enable/Disable</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
                    Fetching accounts from backend API...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    {error ? "Unable to load accounts from backend server." : "No business accounts found."}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const isEnabled = c.status === "ENABLED" || c.status === "Active";
                  return (
                    <tr key={c.accountId || c.documentId} className="border-b border-border last:border-0 hover:bg-accent/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{c.businessName || "Unnamed Business"}</p>
                            <p className="font-mono text-xs text-muted-foreground">ID: {c.accountId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{c.ownerName || "N/A"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{c.email || c.phone || "No email"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">{c.businessType || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">
                          {[c.city, c.state, c.country].filter(Boolean).join(", ") || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{c.currency || "USD"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.status || "ENABLED"} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Switch
                            checked={isEnabled}
                            disabled={updatingId === c.accountId}
                            onCheckedChange={() => handleToggleStatus(c.accountId, c.status)}
                          />
                          <span className="text-xs font-mono text-muted-foreground min-w-[55px] text-left">
                            {isEnabled ? (
                              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="text-muted-foreground flex items-center gap-1">
                                <XCircle className="h-3 w-3" /> Off
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded-md p-1.5 hover:bg-accent">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to="/admin/clients/edit/$id" params={{ id: c.accountId }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Account
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {accounts.length} accounts from backend</span>
        </div>
      </div>
    </PageContainer>
  );
}
