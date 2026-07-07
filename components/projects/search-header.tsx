// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useState, useEffect } from "react";
import { LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface SearchHeaderProps {
  toggleFilters: () => void;
  defaultTitle?: string;
  onSearch: (value: string) => void;
  /** e.g. "42 projects · Page 1 of 5" */
  resultsSummary?: string;
  isLoading?: boolean;
}

export default function SearchHeader({
  toggleFilters,
  defaultTitle = "",
  onSearch,
  resultsSummary,
  isLoading,
}: SearchHeaderProps) {
  const [value, setValue] = useState(defaultTitle);

  useEffect(() => {
    setValue(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden border-y bg-card/90 p-5 shadow-sm ring-1 ring-border/50",
        "sm:p-6 md:rounded-2xl md:border md:p-8"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,0.12),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_80%,rgba(34,197,246,0.08),transparent_38%)]" />

      <div className="relative flex flex-col gap-5 sm:gap-6">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25 sm:h-12 sm:w-12"
              aria-hidden
            >
              <LayoutGrid className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Browse the showcase
              </p>
              <h1 className="mt-1 text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Projects
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                Search by title, then refine with filters — SDG alignment, domain, tech stack, and more.
              </p>
            </div>
          </div>
          {(resultsSummary || isLoading) && (
            <p
              className="w-full min-w-0 text-xs leading-snug text-muted-foreground tabular-nums lg:w-auto lg:max-w-[min(100%,20rem)] lg:shrink-0 lg:text-right lg:text-sm xl:max-w-none"
              aria-live="polite"
            >
              {isLoading && !resultsSummary ? "Loading…" : resultsSummary}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-4"
              aria-hidden
            />
            <Input
              placeholder="Search by project title…"
              className="h-11 w-full rounded-xl border-border/80 bg-background/80 pl-10 pr-4 shadow-sm backdrop-blur-sm sm:h-12 sm:pl-11"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Search projects by title"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 w-full shrink-0 gap-2 rounded-xl border-border/80 touch-manipulation sm:h-12 sm:w-auto lg:hidden"
            onClick={() => toggleFilters()}
            type="button"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
