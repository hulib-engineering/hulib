export interface Topic {
  id: number;
  name: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
  role?: string;
}

// Allowed user status values for update
export type UserStatus = 'active' | 'inactive' | 'under_warning';

// Request body for updating user status
export interface UpdateUserStatusRequest {
  status: UserStatus;
}
