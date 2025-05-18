export enum Gender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export const GenderName = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
} as const;

export enum Role {
  ADMIN = 1,
  HUBER = 2,
  LIBER = 3,
}

export const ROLE_NAME = {
  [Role.ADMIN]: 'Admin',
  [Role.HUBER]: 'Huber',
  [Role.LIBER]: 'Liber',
} as const;

export enum StatusEnum {
  Finished = 'finished',
  Pending = 'pending',
  Canceled = 'canceled',
  Rejected = 'rejected',
  Approved = 'approved',
  UnInitialized = 'unInitialized',
}
