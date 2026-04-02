// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { useEffect, useState, useCallback } from "react";
import { PaginatedResponse } from "../../types/project/pagination";
import { ProjectCardType } from "../../types/project/card";

function useProjects(currentParams: ProjectQueryParams) {
  const [projects, setProjects] = useState<ProjectCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<
    PaginatedResponse<ProjectCardType>["meta"] | null
  >(null);

  // Fetch projects for the given page (always replaces, never appends)
  const fetchProjects = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        let apiUrl = "/api/projects";
        let queryParams = new URLSearchParams();

        if (currentParams.featured) {
          apiUrl = "/api/projects/featured";
        } else {
          queryParams.append("page", page.toString());
          queryParams.append("limit", String(currentParams.limit || 9));
        }

        if (currentParams.title)
          queryParams.append("title", currentParams.title);

        if (
          currentParams.projectTypes &&
          currentParams.projectTypes.length > 0
        ) {
          currentParams.projectTypes.forEach((type) =>
            queryParams.append("projectTypes", type),
          );
        }

        if (currentParams.domains && currentParams.domains.length > 0) {
          currentParams.domains.forEach((domain) =>
            queryParams.append("domains", domain),
          );
        }

        if (currentParams.status && currentParams.status.length > 0) {
          currentParams.status.forEach((status) =>
            queryParams.append("status", status),
          );
        }

        if (currentParams.sdgGoals && currentParams.sdgGoals.length > 0) {
          currentParams.sdgGoals.forEach((goal) =>
            queryParams.append("sdgGoals", goal),
          );
        }

        if (currentParams.techStack && currentParams.techStack.length > 0) {
          currentParams.techStack.forEach((tech) =>
            queryParams.append("techStack", tech),
          );
        }

        if (currentParams.years && currentParams.years.length > 0) {
          currentParams.years.forEach((year) =>
            queryParams.append("years", year),
          );
        }

        // Build final URL
        const finalUrl = queryParams.toString()
          ? `${apiUrl}?${queryParams.toString()}`
          : apiUrl;
        const response = await fetch(finalUrl);

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Error ${response.status}: ${errorData || response.statusText}`,
          );
        }

        const result = await response.json();

        // Handle different response formats
        let projectsData: ProjectCardType[];
        let metaData: PaginatedResponse<ProjectCardType>["meta"];

        if (currentParams.featured) {
          // Featured projects API might return a simple array
          if (Array.isArray(result)) {
            projectsData = result;
            metaData = {
              totalItems: result.length,
              currentPage: 1,
              itemsPerPage: result.length,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: false,
            };
          } else {
            // Or it might return a paginated response
            projectsData = result.data || result;
            metaData = result.meta || {
              totalItems: projectsData.length,
              currentPage: 1,
              itemsPerPage: projectsData.length,
              totalPages: 1,
            };
          }
        } else {
          // Regular projects API returns paginated response
          const paginatedResult = result as PaginatedResponse<ProjectCardType>;
          projectsData = paginatedResult.data;
          metaData = paginatedResult.meta;
        }

        setProjects(projectsData);
        setMeta(metaData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching projects",
        );
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentParams],
  );

  // Fetch whenever params change
  useEffect(() => {
    const page = currentParams.page || 1;
    fetchProjects(page);
  }, [
    currentParams.featured,
    currentParams.page,
    currentParams.title,
    currentParams.limit,
    currentParams.projectTypes?.join(","),
    currentParams.domains?.join(","),
    currentParams.status?.join(","),
    currentParams.sdgGoals?.join(","),
    currentParams.techStack?.join(","),
    currentParams.years?.join(","),
    // NOTE: fetchProjects intentionally excluded to prevent re-render loops
  ]);

  return {
    projects,
    isLoading,
    error,
    meta,
  };
}

export { useProjects };

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  title?: string;
  projectTypes?: string[];
  featured?: boolean;
  domains?: string[];
  status?: string[];
  sdgGoals?: string[];
  techStack?: string[];
  years?: string[];
}
