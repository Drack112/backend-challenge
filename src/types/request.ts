export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalTasks: number;
}
