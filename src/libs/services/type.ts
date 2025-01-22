export interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
}
