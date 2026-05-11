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
export type UserStatus = 'active' | 'inactive' | 'under_warning';

export enum UserStatusEnum {
  INACTIVE = 2,
  UNDER_WARNING = 3,
}
