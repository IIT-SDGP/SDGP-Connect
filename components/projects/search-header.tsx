// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useState, useEffect } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn, dualGlowBg } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface SearchHeaderProps {
  toggleFilters: () => void;
  defaultTitle?: string;
  onSearch: (value: string) => void;
  resultsSummary?: string;
  isLoading?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex shrink-0 items-center rounded-xl border border-border/80 bg-background/70 p-0.5">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 gap-1.5 rounded-lg px-2.5 text-xs sm:px-3",
          viewMode === "grid" && "bg-muted text-foreground shadow-sm",
        )}
        onClick={() => onViewModeChange("grid")}
        aria-pressed={viewMode === "grid"}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 gap-1.5 rounded-lg px-2.5 text-xs sm:px-3",
          viewMode === "list" && "bg-muted text-foreground shadow-sm",
        )}
        onClick={() => onViewModeChange("list")}
        aria-pressed={viewMode === "list"}
        aria-label="List view"
      >
        <List className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  );
}

export default function SearchHeader({
  toggleFilters,
  defaultTitle = "",
  onSearch,
  resultsSummary,
  isLoading,
  viewMode,
  onViewModeChange,
}: SearchHeaderProps) {  const [value, setValue] = useState(defaultTitle);

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
        "relative min-w-0 overflow-hidden rounded-2xl border border-border/50 bg-card/90 p-3.5 shadow-sm ring-1 ring-border/50",
        "sm:p-4",
      )}
    >      <div className={cn("pointer-events-none absolute inset-0", dualGlowBg)} />

      <div className="relative flex flex-col gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-3">
          <div className="flex min-w-0 gap-2.5 sm:gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 ring-1 ring-primary/25 sm:h-10 sm:w-10"
              aria-hidden
            >
              <LayoutGrid className="h-4 w-4 text-primary sm:h-[1.125rem] sm:w-[1.125rem]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">
                Browse the showcase
              </p>
              <h1 className="mt-0.5 text-balance text-xl font-bold tracking-tight sm:text-2xl">
                Projects
              </h1>
              <p className="mt-1 max-w-2xl text-pretty text-xs text-muted-foreground sm:text-sm">
                Search by title, then refine with filters — SDG alignment, domain, tech stack, and more.
              </p>
            </div>
          </div>
          {(resultsSummary || isLoading) && (
            <p
              className="w-full min-w-0 text-[11px] leading-snug text-muted-foreground tabular-nums lg:w-auto lg:max-w-[min(100%,20rem)] lg:shrink-0 lg:text-right lg:text-xs xl:max-w-none"
              aria-live="polite"
            >
              {isLoading && !resultsSummary ? "Loading…" : resultsSummary}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2.5">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Search by project title…"
              className="h-10 w-full rounded-xl border-border/80 bg-background/80 pl-9 pr-3 text-sm shadow-sm backdrop-blur-sm sm:pl-10"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Search projects by title"
            />
          </div>
          <div className="flex min-w-0 shrink-0 items-stretch gap-2">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
            <Button
              variant="outline"
              className="h-10 flex-1 gap-2 rounded-xl border-border/80 text-sm touch-manipulation sm:flex-none lg:hidden"
              onClick={() => toggleFilters()}
              type="button"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filters
            </Button>
          </div>
        </div>      </div>
    </div>
  );
}
