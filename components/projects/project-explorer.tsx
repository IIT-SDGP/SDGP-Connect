// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
// filepath: d:\MyProjects\LEXi\SDGP-Connect\components\projects\project-explorer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ProjectQueryParams } from "@/hooks/project/useGetProjects";
import { EmptyState } from "../ui/empty-state";
import { FileX2, ChevronLeft, ChevronRight } from "lucide-react";
import { PaginatedResponse } from "@/types/project/pagination";
import { ProjectCardType } from "@/types/project/card";

interface ProjectExplorerProps {
  currentParams: ProjectQueryParams;
  projects: any[];
  isLoading: boolean;
  error: string | null;
  meta: PaginatedResponse<ProjectCardType>["meta"] | null;
  onPageChange: (page: number) => void;
}

export default function ProjectExplorer({
  currentParams,
  projects,
  isLoading,
  error,
  meta,
  onPageChange,
}: ProjectExplorerProps) {
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading projects: {error}
      </div>
    );
  }

  // Initial loading state (when no projects are loaded yet)
  if (isLoading && (!projects || projects.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(currentParams.limit || 9)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[350px] rounded-xl bg-muted" />
          ))}
      </div>
    );
  }

  // Empty state when no projects match filters
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <EmptyState
          title="No projects found"
          description="Try adjusting your filters or search criteria."
          icons={[FileX2]}
        />
      </div>
    );
  }

  const currentPage = meta?.currentPage || 1;
  const totalPages = meta?.totalPages || 1;
  const hasNextPage = meta?.hasNextPage ?? currentPage < totalPages;
  const hasPrevPage = meta?.hasPrevPage ?? currentPage > 1;

  // Render projects with pagination controls
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through loaded projects */}
        {projects.map((project) => {
          return (
            <div key={project.id} className="project-card-container">
              <Link
                href={`/project/${project.id}`}
                className="project-card group block rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={
                      project.coverImage ||
                      "https://placehold.co/600x400?text=NO+IMAGE"
                    }
                    alt={project.title || "No title available"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Display status badge if status exists */}
                  {project.status && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge>{project.status}</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col h-[calc(100%-aspect-video)]">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                    {project.subtitle || "No subtitle available."}
                  </p>

                  {/* Display Project Types */}
                  {project.projectTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.projectTypes
                        .slice(0, 2)
                        .map((type: string, i: number) => (
                          <Badge
                            key={`${type}-${i}`}
                            variant="outline"
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      {project.projectTypes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.projectTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Display Domains and View Button */}
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
                    {project.domains?.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {project.domains
                          .slice(0, 1)
                          .map((domain: string, i: number) => (
                            <Badge
                              key={`${domain}-${i}`}
                              variant="secondary"
                              className="text-xs"
                            >
                              {domain}
                            </Badge>
                          ))}
                        {project.domains.length > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.domains.length - 1}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Loading overlay for page transitions */}
      {isLoading && projects.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-2 border-primary/50 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrevPage || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
