// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { ProjectQueryParams } from "@/hooks/project/useGetProjects";
import { EmptyState } from "../ui/empty-state";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  FileX2,
  ArrowUpRight,
  ArrowUp,
  AlertCircle,
} from "lucide-react";
import { PaginatedResponse } from "@/types/project/pagination";
import { ProjectCardType } from "@/types/project/card";
import { cn } from "@/lib/utils";
import type { ViewMode } from "./search-header";

interface ProjectExplorerProps {
  currentParams: ProjectQueryParams;
  projects: any[];
  isLoading: boolean;
  isFilterLoading: boolean;
  error: string | null;
  meta: PaginatedResponse<ProjectCardType>["meta"] | null;
  onPageChange: (page: number) => void;
  onReset: () => void;
  viewMode: ViewMode;
}

const statusTone: Record<string, string> = {
  IDEA: "border-sky-500/35 bg-sky-500/12 text-sky-700 dark:text-sky-300",
  MVP: "border-violet-500/35 bg-violet-500/12 text-violet-700 dark:text-violet-300",
  RESEARCH: "border-amber-500/35 bg-amber-500/12 text-amber-800 dark:text-amber-300",
  DEPLOYED: "border-emerald-500/35 bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
  STARTUP: "border-pink-500/35 bg-pink-500/12 text-pink-800 dark:text-pink-300",
};

const statusDot: Record<string, string> = {
  IDEA: "bg-sky-500",
  MVP: "bg-violet-500",
  RESEARCH: "bg-amber-500",
  DEPLOYED: "bg-emerald-500",
  STARTUP: "bg-pink-500",
};

function formatLabel(value: string) {
  return String(value).replace(/_/g, " ").toLowerCase();
}

function ProjectStatusBadge({
  status,
  compact = false,
}: {
  status?: string;
  compact?: boolean;
}) {
  if (!status) return null;
  const tone = statusTone[status] ?? "";
  const dot = statusDot[status] ?? "bg-muted-foreground";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border font-medium backdrop-blur-sm",
        compact
          ? "px-1.5 py-0 text-[9px] uppercase tracking-wider"
          : "text-[10px] uppercase tracking-wide sm:text-[11px]",
        tone || "bg-background/80",
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} aria-hidden />
      {formatLabel(status)}
    </Badge>
  );
}

function MetaChip({
  children,
  variant = "muted",
}: {
  children: ReactNode;
  variant?: "muted" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize leading-none ring-1 sm:text-[11px]",
        variant === "accent"
          ? "bg-primary/8 text-primary ring-primary/20"
          : "bg-muted/55 text-muted-foreground ring-border/50",
      )}
    >
      {children}
    </span>
  );
}

function ProjectGridCard({ project }: { project: any }) {
  const types = project.projectTypes ?? [];
  const domains = project.domains ?? [];

  return (
    <Link
      href={`/project/${project.id}`}
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/90 shadow-sm ring-1 ring-border/45",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:ring-primary/15",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1),transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative aspect-video overflow-hidden bg-muted/70">
        <Image
          src={project.coverImage || "https://placehold.co/1280x720?text=Project"}
          alt={project.title || "Project cover"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {project.status && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <ProjectStatusBadge status={project.status} compact />
          </div>
        )}
      </div>

      <div className="relative z-[2] flex flex-1 flex-col gap-2.5 p-3">
        <div className="min-w-0 space-y-1.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            {project.subtitle || "Discover objectives, stack, and impact on the detail page."}
          </p>
        </div>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 border-t border-border/50 pt-2.5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {types.slice(0, 1).map((type: string, i: number) => (
              <MetaChip key={`${type}-${i}`} variant="accent">
                {formatLabel(type)}
              </MetaChip>
            ))}
            {domains.slice(0, 1).map((domain: string, i: number) => (
              <MetaChip key={`${domain}-${i}`}>{formatLabel(domain)}</MetaChip>
            ))}
            {types.length + domains.length > 2 && (
              <MetaChip>+{types.length + domains.length - 2}</MetaChip>
            )}
          </div>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary sm:text-[11px]">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProjectListRow({ project }: { project: any }) {
  const types = project.projectTypes ?? [];
  const domains = project.domains ?? [];

  return (
    <Link
      href={`/project/${project.id}`}
      className={cn(
        "group relative flex min-w-0 items-stretch gap-3 overflow-hidden rounded-xl border border-border/50 bg-card/90 p-2 shadow-sm ring-1 ring-border/45 sm:gap-4 sm:p-2.5",
        "transition-all duration-300 hover:border-border/75 hover:bg-card hover:shadow-md hover:ring-primary/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      <span
        className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(99,102,241,0.06),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative aspect-video w-24 shrink-0 self-center overflow-hidden rounded-lg bg-muted ring-1 ring-border/40 sm:w-32 md:w-36">
        <Image
          src={project.coverImage || "https://placehold.co/1280x720?text=Project"}
          alt={project.title || "Project cover"}
          fill
          sizes="(max-width: 768px) 96px, 144px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="line-clamp-1 text-sm font-semibold tracking-tight sm:text-[15px]">
                {project.title}
              </h3>
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
              {project.subtitle || "Discover objectives, stack, and impact on the detail page."}
            </p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {types.slice(0, 2).map((type: string, i: number) => (
            <MetaChip key={`${type}-${i}`} variant="accent">
              {formatLabel(type)}
            </MetaChip>
          ))}
          {domains.slice(0, 2).map((domain: string, i: number) => (
            <MetaChip key={`${domain}-${i}`}>{formatLabel(domain)}</MetaChip>
          ))}
          {(types.length > 2 || domains.length > 2) && (
            <MetaChip>
              +{Math.max(0, types.length - 2) + Math.max(0, domains.length - 2)}
            </MetaChip>
          )}
        </div>
      </div>

      <div className="relative hidden shrink-0 flex-col items-center justify-center gap-1 border-l border-border/45 pl-3 sm:flex sm:pl-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition group-hover:text-primary">
          View
        </span>
      </div>
    </Link>
  );
}

export default function ProjectExplorer({
  currentParams,
  projects,
  isLoading,
  isFilterLoading,
  error,
  meta,
  onPageChange,
  onReset,
  viewMode,
}: ProjectExplorerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isRequestingNextPageRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          meta?.hasNextPage &&
          !isLoading &&
          !isRequestingNextPageRef.current
        ) {
          isRequestingNextPageRef.current = true;
          observer.unobserve(sentinel);
          onPageChange((meta.currentPage || 1) + 1);
        }
      },
      { threshold: 0.1, root: null },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [meta, isLoading, onPageChange]);

  useEffect(() => {
    if (!isLoading) {
      isRequestingNextPageRef.current = false;
    }
  }, [isLoading]);

  const handleBackToTop = () => {
    onReset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gridSkeleton = (
    <div className="grid min-w-0 grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3 lg:grid-cols-4">
      {Array(currentParams.limit || 9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border/40 bg-card/50">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-2.5 p-3">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3 w-full" />
              <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const listSkeleton = (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      {Array(currentParams.limit || 9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-2.5 sm:gap-4">
            <Skeleton className="aspect-video w-24 shrink-0 self-center rounded-lg sm:w-32 md:w-36" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  if (error) {
    return (
      <Alert variant="destructive" className="rounded-2xl border shadow-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Couldn&apos;t load projects</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isFilterLoading) {
    return viewMode === "grid" ? gridSkeleton : listSkeleton;
  }

  if (isLoading && (!projects || projects.length === 0)) {
    return viewMode === "grid" ? gridSkeleton : listSkeleton;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex justify-center py-6">
        <EmptyState
          title="No projects found"
          description="Try a different search or loosen your filters."
          icons={[FileX2]}
        />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
      {viewMode === "grid" ? (
        <div className="grid min-w-0 grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {projects.map((project) => (
            <div key={project.id} className="min-w-0">
              <ProjectGridCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-2 sm:gap-2.5">
          {projects.map((project) => (
            <ProjectListRow key={project.id} project={project} />
          ))}
        </div>
      )}

      {isLoading && projects.length > 0 && (
        viewMode === "grid" ? (
          <div className="grid min-w-0 grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={`next-batch-${i}`} className="overflow-hidden rounded-2xl border border-border/40 bg-card/50">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="space-y-2 p-3">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={`next-batch-${i}`} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-2.5">
                  <Skeleton className="aspect-video w-24 shrink-0 self-center rounded-lg sm:w-32 md:w-36" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
          </div>
        )
      )}

      <div ref={sentinelRef} className="h-1 w-full" />

      {!meta?.hasNextPage && projects.length > 0 && !isLoading && (
        <p className="py-3 text-center text-xs text-muted-foreground sm:text-sm">
          You&apos;ve reached the end of the results.
        </p>
      )}

      {(meta?.currentPage ?? 1) > 1 && (
        <button
          type="button"
          onClick={handleBackToTop}
          className={cn(
            "fixed z-[60] flex h-11 w-11 items-center justify-center rounded-full",
            "border border-border/80 bg-card/95 text-foreground shadow-lg backdrop-blur-md",
            "transition hover:bg-muted",
            "bottom-[max(5.75rem,env(safe-area-inset-bottom,0px)+4.25rem)] right-3 max-[430px]:right-3 sm:right-4",
            "md:bottom-6 md:right-6",
          )}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
