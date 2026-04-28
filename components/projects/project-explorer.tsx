// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { ProjectQueryParams } from "@/hooks/project/useGetProjects";
import { EmptyState } from "../ui/empty-state";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { FileX2, ArrowUpRight, ArrowUp, AlertCircle } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectExplorerProps {
  currentParams: ProjectQueryParams;
  projects: any[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

const statusTone: Record<string, string> = {
  IDEA: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  MVP: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  RESEARCH: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  DEPLOYED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  STARTUP: "border-pink-500/40 bg-pink-500/10 text-pink-800 dark:text-pink-300",
};

export default function ProjectExplorer({
  currentParams,
  projects,
  isLoading,
  error,
  hasMore,
  loadMore,
}: ProjectExplorerProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadMoreRef = useRef(loadMore);
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const lastProjectElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMoreRef.current &&
            !isLoadingRef.current
          ) {
            isLoadingRef.current = true;
            loadMoreRef.current();
          }
        },
        { threshold: 0.35, rootMargin: "80px" },
      );

      observerRef.current.observe(node);
    },
    [projects.length],
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <Alert variant="destructive" className="rounded-2xl border shadow-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Couldn&apos;t load projects</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading && (!projects || projects.length === 0)) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array(currentParams.limit || 9)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-2xl sm:h-[340px]" />
          ))}
      </div>
    );
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
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {projects.map((project, index) => {
          const isLastProject = index === projects.length - 1;
          const status = project.status as string | undefined;
          const tone = status ? statusTone[status] : "";

          return (
            <div
              key={project.id}
              ref={isLastProject ? lastProjectElementRef : null}
              className="min-w-0"
            >
              <Link
                href={`/project/${project.id}`}
                className={cn(
                  "group relative block overflow-hidden rounded-2xl border bg-card/85 shadow-sm ring-1 ring-border/55",
                  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/25",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-video">
                  <Image
                    src={
                      project.coverImage ||
                      "https://placehold.co/600x400?text=NO+IMAGE"
                    }
                    alt={project.title || "Project cover"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-80 transition duration-300 group-hover:opacity-95" />
                  {project.status && (
                    <div className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm sm:text-xs",
                          tone || "bg-background/80"
                        )}
                      >
                        {String(project.status).replace(/_/g, " ")}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="relative space-y-3 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 flex-1 text-base font-semibold leading-snug tracking-tight sm:text-lg">
                      {project.title}
                    </h3>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 ring-1 ring-primary/20 transition group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.subtitle || "Explore this project on its detail page."}
                  </p>

                  {project.projectTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.projectTypes.slice(0, 2).map((type: string, i: number) => (
                        <Badge
                          key={`${type}-${i}`}
                          variant="secondary"
                          className="text-[10px] font-normal sm:text-xs"
                        >
                          {String(type).replace(/_/g, " ")}
                        </Badge>
                      ))}
                      {project.projectTypes.length > 2 && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          +{project.projectTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                    {project.domains?.length > 0 ? (
                      <div className="flex min-w-0 flex-wrap gap-1">
                        {project.domains.slice(0, 1).map((domain: string, i: number) => (
                          <Badge
                            key={`${domain}-${i}`}
                            variant="outline"
                            className="max-w-full truncate text-[10px] font-normal capitalize sm:text-xs"
                          >
                            {String(domain).replace(/_/g, " ").toLowerCase()}
                          </Badge>
                        ))}
                        {project.domains.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            +{project.domains.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">View details</span>
                    )}
                    <span className="shrink-0 text-xs font-medium text-primary opacity-70 transition group-hover:opacity-100">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {isLoading && projects.length > 0 && (
        <div className="flex justify-center py-2" ref={loadingRef}>
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-primary/40 border-t-primary"
            role="status"
            aria-label="Loading more"
          />
        </div>
      )}

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={cn(
            "fixed z-[60] flex h-11 w-11 items-center justify-center rounded-full",
            "border border-border/80 bg-card/95 text-foreground shadow-lg backdrop-blur-md",
            "transition hover:bg-muted",
            "bottom-[max(1rem,env(safe-area-inset-bottom,0px)+4.5rem)] right-4",
            "md:bottom-6 md:right-6 md:max-lg:bottom-6"
          )}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
