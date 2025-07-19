export type Topic = {
  id: number;
  name: string;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
  role?: string;
};

// Allowed user status values for update
type UserStatus = 'active' | 'inactive' | 'under_warning';

// Request body for updating user status
export type UpdateUserStatusRequest = {
  status: UserStatus;
};
