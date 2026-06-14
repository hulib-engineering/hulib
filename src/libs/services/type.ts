export type PaginatedResponse<T> = {
  data: T[];
  hasNextPage: boolean;
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
};
