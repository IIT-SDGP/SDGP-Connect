// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OutboxItem = {
  id: string;
  type: string;
  to: string;
  subject: string;
  status: string;
  attempts: number;
  lastError: string | null;
  nextAttemptAt: string | null;
  updatedAt: string;
};

const statusTabs = ["FAILED", "PENDING", "SENT"] as const;

export default function EmailOutboxPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [tab, setTab] = useState<(typeof statusTabs)[number]>("FAILED");
  const [items, setItems] = useState<OutboxItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedIds = useMemo(() => items.map((i) => i.id), [items]);
  const nowMs = Date.now();

  const renderNextAttempt = (i: OutboxItem) => {
    if (!i.nextAttemptAt) return "-";
    const ts = new Date(i.nextAttemptAt);
    const isDue =
      (i.status === "PENDING" || i.status === "FAILED") && !Number.isNaN(ts.getTime()) && ts.getTime() <= nowMs;

    if (!isDue) return ts.toLocaleString("en-GB");

    return (
      <span className="text-destructive font-medium" title={ts.toLocaleString("en-GB")}>
        Due
      </span>
    );
  };

  const load = async (activeTab = tab) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/email-outbox?status=${activeTab}&limit=100`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load email outbox");
      setItems(json?.data ?? []);
    } catch (e: any) {
      toast.error("Failed to load emails", { description: e?.message || "Unknown error" });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const retry = async (ids: string[]) => {
    try {
      const res = await fetch("/api/admin/email-outbox/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to retry emails");
      toast.success("Queued for retry", { description: json?.message });
      await load();
    } catch (e: any) {
      toast.error("Retry failed", { description: e?.message || "Unknown error" });
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [tab, isAdmin]);

  if (status === "loading") return null;
  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Email Outbox</h1>
        <p className="text-muted-foreground mt-2">Only admins can access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Email Outbox</h1>
          <p className="text-muted-foreground">See failed emails and retry delivery.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => load()} disabled={isLoading}>
            Refresh
          </Button>
          {tab === "FAILED" && selectedIds.length > 0 && (
            <Button onClick={() => retry(selectedIds)} disabled={isLoading}>
              Retry All ({selectedIds.length})
            </Button>
          )}
          {tab === "PENDING" && selectedIds.length > 0 && (
            <Button onClick={() => retry(selectedIds)} disabled={isLoading}>
              Requeue All ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          {statusTabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Last Error</TableHead>
              <TableHead>Next Attempt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  {isLoading ? "Loading..." : "No items"}
                </TableCell>
              </TableRow>
            ) : (
              items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <Badge variant={i.status === "FAILED" ? "destructive" : "default"}>{i.status}</Badge>
                  </TableCell>
                  <TableCell>{i.type}</TableCell>
                  <TableCell className="max-w-[260px] truncate">{i.to}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{i.subject}</TableCell>
                  <TableCell>{i.attempts}</TableCell>
                  <TableCell className="max-w-[340px] truncate" title={i.lastError ?? ""}>
                    {i.lastError ?? "-"}
                  </TableCell>
                  <TableCell>{renderNextAttempt(i)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              JSON.stringify(
                                {
                                  id: i.id,
                                  type: i.type,
                                  to: i.to,
                                  subject: i.subject,
                                  status: i.status,
                                  attempts: i.attempts,
                                  lastError: i.lastError,
                                  nextAttemptAt: i.nextAttemptAt,
                                  updatedAt: i.updatedAt,
                                },
                                null,
                                2
                              )
                            );
                            toast.success("Copied");
                          } catch {
                            toast.error("Copy failed");
                          }
                        }}
                      >
                        Copy
                      </Button>
                      {(i.status === "FAILED" || i.status === "PENDING") && (
                        <Button size="sm" onClick={() => retry([i.id])} disabled={isLoading}>
                          {i.status === "FAILED" ? "Retry" : "Requeue"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
