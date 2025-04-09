export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  types?: string[];
  domains?: string[];
  status?: string[];
  sdgGoals?: string[];
  techStack?: string[];
}
