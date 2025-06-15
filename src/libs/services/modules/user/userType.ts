export interface Topic {
  id: number;
  name: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}
