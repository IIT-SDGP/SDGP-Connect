// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import FilterSidebar from "@/components/projects/filter-sidebar";
import ProjectExplorer from "@/components/projects/project-explorer";
import SearchHeader, { type ViewMode } from "@/components/projects/search-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectQueryParams, useProjects } from "@/hooks/project/useGetProjects";
import { SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn, dualGlowBg, heroGlowBg, projectContentShell } from "@/lib/utils";

const ThreeScene = dynamic(() => import("@/components/home/three-scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
  ),
});

interface FilterState {
  featured: boolean;
  status: string[];
  years: string[];
  projectTypes: string[];
  domains: string[];
  sdgGoals: string[];
  techStack: string[];
}

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const currentParams = useMemo(
    (): ProjectQueryParams => ({
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "9", 10),
      title: searchParams.get("title") || undefined,
      featured: searchParams.get("featured") === "true",
      status: searchParams.getAll("status"),
      years: searchParams.getAll("years"),
      projectTypes: searchParams.getAll("projectTypes"),
      domains: searchParams.getAll("domains"),
      sdgGoals: searchParams.getAll("sdgGoals"),
      techStack: searchParams.getAll("techStack"),
    }),
    [searchParams],
  );

  const { projects, isLoading, error, meta, resetToFirstPage } = useProjects(currentParams);

  useEffect(() => {
    if (!isLoading) {
      setIsFilterLoading(false);
      if (projects && isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [isLoading, projects, isInitialLoad]);

  const initialFilters = useMemo(
    (): FilterState => ({
      featured: currentParams.featured || false,
      status: currentParams.status || [],
      years: currentParams.years || [],
      projectTypes: currentParams.projectTypes || [],
      domains: currentParams.domains || [],
      sdgGoals: currentParams.sdgGoals || [],
      techStack: currentParams.techStack || [],
    }),
    [currentParams],
  );

  const resultsSummary = useMemo(() => {
    if (!meta) return undefined;
    const n = meta.totalItems;
    const noun = n === 1 ? "project" : "projects";
    if (currentParams.featured) {
      return `${n} featured ${noun}`;
    }
    return `${n} ${noun} · Page ${meta.currentPage} of ${meta.totalPages}`;
  }, [meta, currentParams.featured]);

  const toggleFilters = useCallback(() => {
    setShowMobileFilters((prev) => !prev);
  }, []);

  const prevFiltersRef = useRef(initialFilters);

  useEffect(() => {
    prevFiltersRef.current = initialFilters;
  }, [initialFilters]);

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      const prev = prevFiltersRef.current;
      const isSame =
        prev.featured === newFilters.featured &&
        JSON.stringify([...prev.status].sort()) ===
          JSON.stringify([...newFilters.status].sort()) &&
        JSON.stringify([...prev.years].sort()) ===
          JSON.stringify([...newFilters.years].sort()) &&
        JSON.stringify([...prev.projectTypes].sort()) ===
          JSON.stringify([...newFilters.projectTypes].sort()) &&
        JSON.stringify([...prev.domains].sort()) ===
          JSON.stringify([...newFilters.domains].sort()) &&
        JSON.stringify([...prev.sdgGoals].sort()) ===
          JSON.stringify([...newFilters.sdgGoals].sort()) &&
        JSON.stringify([...prev.techStack].sort()) ===
          JSON.stringify([...newFilters.techStack].sort());

      if (isSame) return;

      prevFiltersRef.current = newFilters;
      setIsFilterLoading(true);

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", String(currentParams.limit || 15));
      if (currentParams.title) params.append("title", currentParams.title);

      if (newFilters.featured) {
        params.append("featured", "true");
      }

      Object.entries(newFilters).forEach(([key, values]) => {
        if (key === "featured") return;
        if (Array.isArray(values) && values.length > 0) {
          values.forEach((value: string) => {
            params.append(key, value);
          });
        }
      });

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [router, currentParams.limit, currentParams.title],
  );

  const handleSearch = useCallback(
    (value: string) => {
      const normalizedValue = value.trim();
      const currentTitle = (searchParams.get("title") || "").trim();

      if (normalizedValue === currentTitle) return;

      const params = new URLSearchParams(searchParams.toString());
      if (normalizedValue) {
        params.set("title", normalizedValue);
      } else {
        params.delete("title");
      }
      params.set("page", "1");
      router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showMobileFilters) {
        setShowMobileFilters(false);
      }
    };

    if (showMobileFilters) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showMobileFilters]);

  if (isInitialLoad && isLoading && (!projects || projects.length === 0)) {
    return <LoadingSkeleton />;
  }

  const pageShell = projectContentShell;

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 z-0">
        <ThreeScene />
        <div className={cn("absolute inset-0", heroGlowBg)} />
      </div>

      <div className="relative z-10 bg-gradient-to-b from-background/80 via-background/90 to-muted/25">
        <div className={cn(pageShell, "pb-8 pt-2 sm:pb-12 sm:pt-3 md:pt-4")}>
          <SearchHeader
            toggleFilters={toggleFilters}
            defaultTitle={currentParams.title ?? ""}
            onSearch={handleSearch}
            resultsSummary={resultsSummary}
            isLoading={isLoading && !resultsSummary}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="grid min-w-0 grid-cols-1 gap-4 pt-5 sm:gap-5 sm:pt-6 md:pt-7 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-5">
            <aside className="hidden min-w-0 self-stretch lg:block">
              <div className="sticky top-4 z-20 w-full max-h-[calc(100dvh-2rem)] [contain:layout]">
                <FilterSidebar onFilterChange={handleFilterChange} initialFilters={initialFilters} />
              </div>
            </aside>

            <div className="min-w-0">
              <ProjectExplorer
                currentParams={currentParams}
                projects={projects || []}
                isLoading={isLoading}
                isFilterLoading={isFilterLoading}
                error={error}
                meta={meta}
                viewMode={viewMode}
                onPageChange={(page) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(page));
                  router.push(`${window.location.pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                onReset={resetToFirstPage}
              />
            </div>
          </div>
        </div>
      </div>

      {showMobileFilters ? (
        <div
          className="fixed inset-0 z-[60] flex max-h-[100dvh] flex-col bg-background lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter projects"
        >
          <div className="relative shrink-0 overflow-hidden border-b border-border/70 bg-card/90 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] shadow-sm ring-1 ring-border/50 backdrop-blur-md">
            <div className={cn("pointer-events-none absolute inset-0", dualGlowBg)} />
            <div className="relative flex items-center justify-between gap-2">
            <div className="flex min-w-0 gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 ring-1 ring-primary/25"
                aria-hidden
              >
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Refine results
                </p>
                <h2 className="mt-0.5 text-base font-bold tracking-tight">Filters</h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileFilters(false)}
              type="button"
              className="h-10 w-10 shrink-0 rounded-full"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </Button>
            </div>
          </div>

          <div className="scrollbar-visible min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <FilterSidebar
              embedded
              onFilterChange={handleFilterChange}
              initialFilters={initialFilters}
            />
          </div>

          <div className="flex shrink-0 gap-2 border-t border-border/70 bg-card/80 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowMobileFilters(false)}
              type="button"
            >
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const Page = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProjectsPageContent />
    </Suspense>
  );
};

const LoadingSkeleton = () => {
  return (
  <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-background to-muted/25">
    <div className={cn(projectContentShell, "pb-8 pt-2 sm:pb-12 sm:pt-3 md:pt-4")}>
      <div className="overflow-hidden rounded-2xl border bg-card/90 p-4 shadow-sm ring-1 ring-border/50 sm:p-5">
        <div className="flex gap-2.5 sm:gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-6 w-36 max-w-full sm:h-7" />
            <Skeleton className="h-3.5 w-full max-w-lg" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-24 shrink-0 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4 pt-5 sm:gap-5 sm:pt-6 md:pt-7 lg:flex-row lg:gap-4 xl:gap-5">
        <div className="hidden shrink-0 lg:block lg:w-56 xl:w-60">
          <Skeleton className="h-[min(28rem,70vh)] w-full rounded-2xl" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
        </div>
      </div>
    </div>
  </div>
  );
};
export default Page;
