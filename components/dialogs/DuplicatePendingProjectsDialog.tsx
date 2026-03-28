// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

type DuplicateGroup = {
  key: string;
  title: string;
  groupNumber: string;
  keep: {
    projectId: string;
    createdAt: string;
  };
  reject: Array<{
    projectId: string;
    createdAt: string;
  }>;
};

export default function DuplicatePendingProjectsDialog({
  open,
  onOpenChange,
  onRejected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejected?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  const rejectableCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.reject.length, 0),
    [groups]
  );

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/projects/duplicates?limit=5000");
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load duplicates");
        }
        setGroups(json?.data?.groups ?? []);
      } catch (e: any) {
        setError(e?.message || "Failed to load duplicates");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [open]);

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const res = await fetch("/api/admin/projects/duplicates/reject?limit=5000", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to bulk reject duplicates");
      }

      toast.success("Duplicates rejected", {
        description: json?.message || `Rejected ${rejectableCount} duplicates`,
      });

      onOpenChange(false);
      if (onRejected) onRejected();
    } catch (e: any) {
      toast.error("Bulk reject failed", {
        description: e?.message || "Something went wrong",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Duplicate Pending Submissions</DialogTitle>
          <DialogDescription>
            Detects duplicates by <span className="font-mono">title.toLowerCase()</span> +{" "}
            <span className="font-mono">group_num</span> for projects still in{" "}
            <span className="font-mono">PENDING</span>. Keeps the most recent submission and rejects
            older duplicates with a standard reason.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : groups.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No duplicate pending submissions found.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {groups.length} duplicate group(s), {rejectableCount} older submission(s) will be
              rejected.
            </div>
            <ScrollArea className="h-[360px] rounded-md border p-3">
              <div className="space-y-4">
                {groups.map((g) => (
                  <div key={g.key} className="rounded-md border p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-medium">
                        {g.title} <span className="text-muted-foreground">({g.groupNumber})</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        keep: {new Date(g.keep.createdAt).toLocaleString()} • reject:{" "}
                        {g.reject.length}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Kept submission: <span className="font-mono">{g.keep.projectId}</span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs">
                      {g.reject.map((r) => (
                        <div key={r.projectId} className="text-muted-foreground">
                          Reject <span className="font-mono">{r.projectId}</span> •{" "}
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRejecting}>
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading || !!error || groups.length === 0 || isRejecting}
          >
            {isRejecting ? <LoadingSpinner size="sm" /> : `Reject Older Duplicates (${rejectableCount})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

