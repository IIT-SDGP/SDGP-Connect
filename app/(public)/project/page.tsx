// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import FilterSidebar from "@/components/projects/filter-sidebar";
import ProjectExplorer from "@/components/projects/project-explorer";
import SearchHeader from "@/components/projects/search-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectQueryParams, useProjects } from "@/hooks/project/useGetProjects";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

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

  const { projects, isLoading, error, meta, hasMore, loadMore } = useProjects(currentParams);

  useEffect(() => {
    if (!isLoading && projects && isInitialLoad) {
      setIsInitialLoad(false);
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

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
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
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("title", value);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/25">
      <div className="mx-auto w-full max-w-7xl px-3 pb-8 pt-6 sm:px-4 sm:pt-8 md:px-6 md:pb-12 md:pt-10 lg:px-8 xl:px-10">
        <SearchHeader
          toggleFilters={toggleFilters}
          defaultTitle={currentParams.title ?? ""}
          onSearch={handleSearch}
          resultsSummary={resultsSummary}
          isLoading={isLoading && !resultsSummary}
        />

        <div className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row md:gap-8 lg:gap-10">
          <div className="hidden w-[17.5rem] shrink-0 lg:w-72 md:block">
            <div className="sticky top-6">
              <FilterSidebar onFilterChange={handleFilterChange} initialFilters={initialFilters} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <ProjectExplorer
              currentParams={currentParams}
              projects={projects || []}
              isLoading={isLoading}
              error={error}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          </div>
        </div>
      </div>

      {showMobileFilters ? (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-background md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter projects"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border/70 bg-card/50 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] backdrop-blur-md">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Refine results
              </p>
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)} type="button" className="h-10 w-10 shrink-0 rounded-full" aria-label="Close filters">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 pb-[env(safe-area-inset-bottom,0px)]">
            <FilterSidebar onFilterChange={handleFilterChange} initialFilters={initialFilters} />
          </div>

          <div className="flex shrink-0 gap-2 border-t border-border/70 bg-card/80 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowMobileFilters(false)} type="button">
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

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/25">
    <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8">
      <div className="overflow-hidden rounded-2xl border bg-card/90 p-5 shadow-sm ring-1 ring-border/50 sm:p-6 md:p-8">
        <div className="flex gap-3 sm:gap-4">
          <Skeleton className="h-11 w-11 shrink-0 rounded-xl sm:h-12 sm:w-12" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-48 max-w-full sm:h-10" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="mt-4 h-11 w-full rounded-xl sm:h-12" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row">
        <div className="hidden w-72 shrink-0 md:block">
          <Skeleton className="h-[min(28rem,70vh)] w-full rounded-2xl" />
        </div>
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[320px] rounded-2xl sm:h-[340px]" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Page;
