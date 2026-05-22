// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { useEffect, useState, useCallback, useRef } from "react";
import { PaginatedResponse } from "../../types/project/pagination";
import { ProjectCardType } from "../../types/project/card";

function useProjects(currentParams: ProjectQueryParams) {
  const [projects, setProjects] = useState<ProjectCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<
    PaginatedResponse<ProjectCardType>["meta"] | null
  >(null);

  const prevFilterRef = useRef<string>("");

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProjects = useCallback(
    async (page: number, isNewFilter: boolean) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requestId = ++requestIdRef.current;

      setIsLoading(true);
      setError(null);

      try {
        let apiUrl = "/api/projects";
        const queryParams = new URLSearchParams();

        if (currentParams.featured) {
          apiUrl = "/api/projects/featured";
        } else {
          queryParams.append("page", page.toString());
          queryParams.append("limit", String(currentParams.limit || 9));
        }

        if (currentParams.title)
          queryParams.append("title", currentParams.title);

        if (currentParams.projectTypes?.length) {
          currentParams.projectTypes.forEach((type) =>
            queryParams.append("projectTypes", type),
          );
        }

        if (currentParams.domains?.length) {
          currentParams.domains.forEach((domain) =>
            queryParams.append("domains", domain),
          );
        }

        if (currentParams.status?.length) {
          currentParams.status.forEach((status) =>
            queryParams.append("status", status),
          );
        }

        if (currentParams.sdgGoals?.length) {
          currentParams.sdgGoals.forEach((goal) =>
            queryParams.append("sdgGoals", goal),
          );
        }

        if (currentParams.techStack?.length) {
          currentParams.techStack.forEach((tech) =>
            queryParams.append("techStack", tech),
          );
        }

        if (currentParams.years?.length) {
          currentParams.years.forEach((year) =>
            queryParams.append("years", year),
          );
        }

        const finalUrl = queryParams.toString()
          ? `${apiUrl}?${queryParams.toString()}`
          : apiUrl;

        const response = await fetch(finalUrl, { signal: controller.signal });

        if (requestId !== requestIdRef.current) return;

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Error ${response.status}: ${errorData || response.statusText}`,
          );
        }

        const result = await response.json();

        if (requestId !== requestIdRef.current) return;

        // Handle different response formats
        let projectsData: ProjectCardType[];
        let metaData: PaginatedResponse<ProjectCardType>["meta"];

        if (currentParams.featured) {
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
            projectsData = result.data || result;
            metaData = result.meta || {
              totalItems: projectsData.length,
              currentPage: 1,
              itemsPerPage: projectsData.length,
              totalPages: 1,
            };
          }
        } else {
          const paginatedResult = result as PaginatedResponse<ProjectCardType>;
          projectsData = paginatedResult.data;
          metaData = paginatedResult.meta;
        }

        if (isNewFilter) {
          setProjects(projectsData);
        } else {
          setProjects((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems = projectsData.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newItems];
          });
        }

        setMeta(metaData);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        if (requestId !== requestIdRef.current) return;

        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching projects",
        );
        console.error("Error fetching projects:", err);
        if (isNewFilter) setProjects([]);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [currentParams],
  );

  useEffect(() => {
    const filterKey = [
      currentParams.featured,
      currentParams.title,
      currentParams.limit,
      currentParams.projectTypes?.join(","),
      currentParams.domains?.join(","),
      currentParams.status?.join(","),
      currentParams.sdgGoals?.join(","),
      currentParams.techStack?.join(","),
      currentParams.years?.join(","),
    ].join("|");

    const isNewFilter = filterKey !== prevFilterRef.current;
    prevFilterRef.current = filterKey;

    const page = currentParams.page || 1;
    fetchProjects(page, isNewFilter);

    return () => {
      abortControllerRef.current?.abort();
    };
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