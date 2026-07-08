import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminManagementBarProps = {
  /** Status tabs (e.g. Pending / Approved / Rejected). */
  tabs: ReactNode;
  /** Search field or other centered controls. */
  center?: ReactNode;
  /** Refresh, bulk actions, etc. */
  end?: ReactNode;
  className?: string;
};

/**
 * Shared toolbar row for moderation pages: tabs (start), search (center), actions (end).
 */
export function AdminManagementBar({
  tabs,
  center,
  end,
  className,
}: AdminManagementBarProps) {
  return (
    <div className={cn("admin-mgmt-bar", className)}>
      <div className="flex justify-center lg:justify-start">{tabs}</div>
      <div className="flex flex-col items-stretch justify-center sm:items-center">
        {center}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
        {end ?? null}
      </div>
    </div>
  );
}
