"use client";

import { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";

interface AdminPageShellProps {
  title: string;
  description?: string;
  /** Short label above the title, e.g. "Overview" */
  kicker?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminPageShell({
  title,
  description,
  kicker,
  actions,
  children,
  className,
}: AdminPageShellProps) {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <section className={cn("admin-page-shell", className)}>
      <header className="admin-page-header">
        <div className="admin-page-header-accent" aria-hidden />
        <div className="admin-page-header-inner">
          <div className="min-w-0 flex-1">
            {kicker ? <p className="admin-page-kicker">{kicker}</p> : null}
            <h1 className="admin-page-title">{title}</h1>
            {description ? (
              <p className="admin-page-description">{description}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <time
              dateTime={new Date().toISOString().slice(0, 10)}
              className="admin-page-date"
            >
              {today}
            </time>
            {actions ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {actions}
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div className="admin-page-body space-y-8">{children}</div>
    </section>
  );
}
