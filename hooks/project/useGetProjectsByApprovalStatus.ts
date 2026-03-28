import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { ProjectApprovalStatus } from '@prisma/client';
import { PendingProject, ApprovedProject, RejectedProject } from '@/types/project/response';

interface PaginatedResponse<T> {
  data: T[];
  metadata?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface UseGetProjectsByApprovalStatusReturn<T> {
  projects: T[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
  refresh: () => Promise<void>;
  isEmpty: boolean;
}

export function useGetProjectsByApprovalStatus<T extends PendingProject | ApprovedProject | RejectedProject>(
  statusType: ProjectApprovalStatus,
  searchQuery: string = '',
  itemsPerPage: number = 10,
  sortBy?: string,
  sortDir?: 'asc' | 'desc'
): UseGetProjectsByApprovalStatusReturn<T> {
  const [projects, setProjects] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchProjects = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params: Record<string, any> = {
        status: statusType,
        page,
        limit: itemsPerPage,
      };

      if (sortBy) params.sortBy = sortBy;
      if (sortDir) params.sortDir = sortDir;

      // Add search query if provided
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Use the dedicated admin API endpoint for project approval management
      const response = await axios.get<PaginatedResponse<T>>(`/api/admin/projects`, {
        params,
      });

      const { data, metadata } = response.data;


      // Check if the response contains data and metadata
      if (data && Array.isArray(data) && metadata) {
        setProjects(data);
        setTotalPages(metadata.totalPages || 1);
        setTotalItems(metadata.totalItems || 0);
        setCurrentPage(metadata.currentPage || 1);
        setIsEmpty(data.length === 0);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { error?: string })?.error ||
        axiosError.message ||
        'Failed to fetch projects';
      console.error('Error fetching projects:', errorMessage);
      setError(new Error(errorMessage));
      setIsEmpty(true);
      // Reset projects array on error
      setProjects([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [statusType, searchQuery, itemsPerPage, sortBy, sortDir]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
    fetchProjects(1);
  }, [statusType, searchQuery, fetchProjects]);

  const fetchNextPage = async () => {
    if (currentPage < totalPages) {
      await fetchProjects(currentPage + 1);
    }
  };

  const fetchPreviousPage = async () => {
    if (currentPage > 1) {
      await fetchProjects(currentPage - 1);
    }
  };

  const refresh = async () => {
    await fetchProjects(currentPage);
  };

  return {
    projects,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchNextPage,
    fetchPreviousPage,
    refresh,
    isEmpty,
  };
}
