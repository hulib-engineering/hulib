export interface Topic {
  id: number;
  name: string;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface GetTopicsParams {
  page?: number;
  limit?: number;
  name?: string;
}
