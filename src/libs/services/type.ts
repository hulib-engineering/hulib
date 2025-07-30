export type PaginatedResponse<T> = {
  data: T[];
  hasNextPage: boolean;
};
